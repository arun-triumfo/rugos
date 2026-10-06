import { Order } from '../models/Order.js';
import { InventoryItem } from '../models/InventoryItem.js';
import { StockLedger } from '../models/StockLedger.js';
import { TenantAppState } from '../models/TenantAppState.js';
import { buildAppStateData } from '../seed/appStateSeed.js';
import { decideFulfilment, calcProfit } from '../utils/allocation.js';
import { httpError } from '../middleware/errorHandler.js';
import { baseTimeline1001 } from '../seed/orderSeedData.js';

async function loadAppData(tenantId) {
  let doc = await TenantAppState.findOne({ tenantId });
  if (!doc) doc = await TenantAppState.create({ tenantId, data: buildAppStateData() });
  return doc;
}

async function applySideEffects(tenantId, action, order, payload = {}) {
  const doc = await loadAppData(tenantId);
  const d = doc.data;
  const orderNum = order.orderNumber || `#${order.key}`;

  const mapPick = (fn) => {
    d.pickPack = (d.pickPack || []).map((p) => (p.order === orderNum || p.order === '#1001' ? fn(p) : p));
  };

  if (action === 'allocateInventory') {
    const path = order.fulfilmentPath;
    if (path === 'USA') {
      mapPick((p) => ({ ...p, status: 'Awaiting Pick', bin: 'USA-RUG-01', operator: 'Mike Johnson' }));
    } else if (path === 'INDIA') {
      mapPick((p) => ({ ...p, status: 'Awaiting Pick', bin: 'IND-RUG-01', operator: 'Amit Singh' }));
    } else if (path === 'MTO') {
      const exists = (d.mto || []).some((m) => m.id === order.mtoId || m.order === orderNum);
      if (!exists) {
        d.mto = [
          {
            id: order.mtoId || `MTO-${order.key}`,
            order: orderNum,
            sku: order.sku,
            product: order.product,
            qty: order.qty || 1,
            customer: order.customer,
            expectedReady: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
            stage: 'To Make',
            pendingQty: order.qty || 1,
            notes: 'Auto-created — USA & India stock unavailable',
            attachments: [],
          },
          ...(d.mto || []),
        ];
      }
      mapPick((p) => ({ ...p, status: 'Awaiting Pick', operator: 'Unassigned' }));
    }
  }

  if (action === 'completeMto') {
    d.mto = (d.mto || []).map((m) =>
      m.order === orderNum || m.id === order.mtoId ? { ...m, stage: 'Pack', pendingQty: 0 } : m
    );
    mapPick((p) => ({ ...p, status: 'Awaiting Pick', bin: 'IND-RUG-01', operator: 'Amit Singh' }));
  }

  if (action === 'startPicking') mapPick((p) => ({ ...p, status: 'Picking' }));
  if (action === 'markPicked') mapPick((p) => ({ ...p, status: 'Picked', pickQty: order.qty || 1 }));
  if (action === 'markPacked') mapPick((p) => ({ ...p, status: 'Packed', packedQty: order.qty || 1 }));

  if (action === 'enterCourier') {
    d.courierReferences = (d.courierReferences || []).map((c) =>
      c.order === orderNum || c.order === '#1001'
        ? {
            ...c,
            provider: order.courier?.provider,
            reference: order.courier?.reference,
            awb: order.awb,
            qrReference: order.qrReference,
            serviceType: order.courier?.service,
            weight: order.weighing?.weightKg || order.courier?.weight,
            dimensions: order.courier?.dimensions,
            status: 'Mapped',
          }
        : c
    );
  }

  if (action === 'confirmUsaReceipt') {
    d.usaReceipts = [
      {
        id: `RCP-USA-${order.key}`,
        order: orderNum,
        date: new Date().toISOString().slice(0, 10),
        sku: order.sku,
        expected: order.usaReceipt?.expected ?? 1,
        received: order.usaReceipt?.received ?? 1,
        difference: order.usaReceipt?.difference ?? 0,
        condition: order.usaReceipt?.condition || 'Good',
        status: order.usaReceipt?.status || 'Matched',
      },
      ...(d.usaReceipts || []).filter((r) => r.id !== `RCP-USA-${order.key}` && r.id !== 'RCP-USA-046'),
    ];
  }

  if (action === 'createShipment' || action === 'markDelivered') {
    const origin = order.fulfilmentPath === 'USA' ? 'USA East Warehouse' : 'India Main Warehouse';
    d.shipments = (d.shipments || []).map((s) => {
      if (s.id !== 'SHP-1001' && s.order !== orderNum) return s;
      if (action === 'createShipment') {
        return {
          ...s,
          order: orderNum,
          courier: order.courier?.provider || 'Manual / No Partner',
          awb: order.awb || s.awb,
          origin,
          destination: order.shipTo?.city ? `${order.shipTo.city}, ${order.shipTo.state || ''}`.trim() : s.destination,
          weight: order.weighing?.weightKg || s.weight,
          status: 'Out for Delivery',
          lastUpdate: new Date().toISOString(),
          tracking: [
            { at: new Date().toISOString(), event: 'Shipment created', location: origin },
            { at: new Date().toISOString(), event: 'Out for delivery', location: order.shipTo?.city || 'Customer' },
          ],
        };
      }
      return {
        ...s,
        status: 'Delivered',
        actualCost: s.estimatedCost || 1100,
        lastUpdate: new Date().toISOString(),
        tracking: [...(s.tracking || []), { at: new Date().toISOString(), event: 'Delivered', location: order.shipTo?.city || 'Customer' }],
      };
    });
  }

  d.demoWorkflowStep = order.workflowStep || d.demoWorkflowStep;
  doc.data = d;
  doc.markModified('data');
  await doc.save();

  return {
    pickPack: d.pickPack,
    mto: d.mto,
    courierReferences: d.courierReferences,
    usaReceipts: d.usaReceipts,
    shipments: d.shipments,
    demoWorkflowStep: d.demoWorkflowStep,
  };
}

function pushTimeline(order, title, user = 'Demo User') {
  const now = new Date();
  const timeline = [...(order.timeline || [])];
  const pendingIdx = timeline.findIndex((t) => t.status === 'pending' || t.status === 'locked');
  if (pendingIdx >= 0) {
    timeline[pendingIdx] = {
      ...timeline[pendingIdx].toObject?.() || timeline[pendingIdx],
      at: now,
      title,
      user,
      status: 'done',
    };
    if (timeline[pendingIdx + 1] && timeline[pendingIdx + 1].status === 'locked') {
      timeline[pendingIdx + 1] = {
        ...timeline[pendingIdx + 1].toObject?.() || timeline[pendingIdx + 1],
        status: 'pending',
      };
    }
  } else {
    timeline.push({ id: `t-${Date.now()}`, at: now, title, user, status: 'done' });
  }
  order.timeline = timeline;
}

function pushAudit(order, user, action, oldValue, newValue) {
  order.auditLog = [
    ...(order.auditLog || []),
    {
      at: new Date().toISOString(),
      user,
      action,
      module: 'Orders',
      oldValue,
      newValue,
    },
  ];
}

async function writeLedger(tenantId, { sku, type, reference, from, to, qtyIn = 0, qtyOut = 0, user, notes }) {
  const inv = await InventoryItem.findOne({ tenantId, sku });
  const balance = inv
    ? inv.indiaAvailable + inv.packed + inv.inTransit + inv.usa + inv.fba
    : 0;
  await StockLedger.create({
    tenantId,
    key: `LED-${Date.now()}`,
    date: new Date(),
    sku,
    type,
    reference,
    from,
    to,
    qtyIn,
    qtyOut,
    balance,
    user,
    notes,
  });
}

export async function advanceOrderWorkflow(tenantId, orderKey, action, payload = {}, actorName = 'Demo User') {
  const order = await Order.findOne({ tenantId, key: orderKey });
  if (!order) throw httpError(404, 'Order not found');

  const step = order.workflowStep || 1;
  const oldStatus = order.status;
  const sku = order.sku || 'RUG-1001';
  let inv = await InventoryItem.findOne({ tenantId, sku });

  switch (action) {
    case 'resolveSku':
      order.sku = 'RUG-1001';
      order.product = 'Hand Knotted Wool Rug';
      order.status = 'Awaiting Inventory';
      order.inventoryStatus = 'Checked';
      order.workflowStep = Math.max(step, 2);
      pushTimeline(order, 'SKU mapped to RUG-1001', 'Priya Sharma');
      break;

    case 'allocateInventory': {
      if (!inv) throw httpError(400, `Inventory not found for SKU ${sku}`);
      const decision = decideFulfilment(inv, order.qty || 1, payload.forcePath || null);
      order.status = decision.status;
      order.inventoryStatus = decision.inventoryStatus;
      order.fulfilmentLocation = decision.fulfilmentLocation;
      order.fulfilmentType = decision.fulfilmentType;
      order.warehouse = decision.warehouse;
      order.bin = decision.bin;
      order.fulfilmentPath = decision.path;
      order.allocationChecks = decision.checks;
      order.mtoId = decision.path === 'MTO' ? order.mtoId || `MTO-${order.key}` : order.mtoId || null;
      order.mtoReady = decision.path !== 'MTO';
      order.workflowStep = Math.max(step, 3);

      pushTimeline(
        order,
        `Checked USA (${decision.checks.usaFree}) → India (${decision.checks.indiaFree}) → ${decision.message}`,
        'Priya Sharma'
      );

      if (decision.path === 'USA') {
        inv.usa = Math.max(0, inv.usa - (order.qty || 1));
        await inv.save();
        await writeLedger(tenantId, {
          sku, type: 'Reservation', reference: order.orderNumber,
          from: 'USA Warehouse', to: 'Merchant Fulfilment', qtyOut: order.qty || 1,
          user: 'Priya Sharma', notes: 'USA stock reserved',
        });
        pushTimeline(order, `Stock reserved at ${decision.warehouse}`, 'Priya Sharma');
      } else if (decision.path === 'INDIA') {
        inv.reserved += order.qty || 1;
        await inv.save();
        await writeLedger(tenantId, {
          sku, type: 'Reservation', reference: order.orderNumber,
          from: 'India Finished Stock', to: 'India Reserved', qtyOut: order.qty || 1,
          user: 'Priya Sharma', notes: 'India stock reserved',
        });
        pushTimeline(order, `Stock reserved at ${decision.warehouse}`, 'Priya Sharma');
      } else {
        pushTimeline(order, 'MTO created — awaiting production before pick', 'System');
      }
      break;
    }

    case 'completeMto':
      order.status = 'Reserved';
      order.inventoryStatus = 'Reserved (India · after MTO)';
      order.fulfilmentPath = 'INDIA';
      order.fulfilmentType = 'Make to Order → India Stock → Customer';
      order.fulfilmentLocation = 'India Main Warehouse';
      order.warehouse = 'India Main Warehouse';
      order.bin = 'IND-RUG-01';
      order.mtoReady = true;
      order.workflowStep = Math.max(step, 3);
      if (inv) {
        inv.indiaAvailable += order.qty || 1;
        inv.reserved += order.qty || 1;
        await inv.save();
      }
      pushTimeline(order, 'MTO completed · QC passed · stock ready to pick', 'Ravi Kumar');
      break;

    case 'startPicking':
      order.status = 'Picking';
      order.workflowStep = Math.max(step, 4);
      pushTimeline(order, `Picking started at ${order.warehouse || 'warehouse'}`, order.fulfilmentPath === 'USA' ? 'Mike Johnson' : 'Amit Singh');
      break;

    case 'markPicked':
      order.status = 'Picked';
      order.workflowStep = Math.max(step, 5);
      pushTimeline(order, `Pick completed from bin ${order.bin || '—'}`, order.fulfilmentPath === 'USA' ? 'Mike Johnson' : 'Amit Singh');
      break;

    case 'recordWeighing':
      order.status = 'Packing';
      order.weighing = {
        weightKg: Number(payload.weightKg ?? 28.5),
        lengthCm: Number(payload.lengthCm ?? 250),
        widthCm: Number(payload.widthCm ?? 180),
        heightCm: Number(payload.heightCm ?? 12),
        photoName: payload.photoName || `weighing-photo-${order.key}.jpg`,
        photoPreview: payload.photoPreview || null,
        capturedAt: new Date().toISOString(),
        notes: payload.notes || 'Manual weighing — no courier partner API',
      };
      order.workflowStep = Math.max(step, 6);
      pushTimeline(
        order,
        `Weighing captured: ${order.weighing.weightKg} kg · ${order.weighing.lengthCm}x${order.weighing.widthCm}x${order.weighing.heightCm} cm · photo uploaded`,
        'Warehouse Operator'
      );
      break;

    case 'enterCourier':
      order.status = 'Packing';
      order.courier = {
        provider: payload.provider || 'Manual / No Partner',
        reference: payload.reference || `MANUAL-${order.key}`,
        awb: payload.awb || `MANUAL-AWB-${order.key}`,
        qrReference: payload.qrReference || `QR-MANUAL-${order.key}`,
        service: payload.serviceType || 'Standard',
        weight: payload.weight || order.weighing?.weightKg || 28.5,
        dimensions: payload.dimensions || (order.weighing
          ? `${order.weighing.lengthCm}x${order.weighing.widthCm}x${order.weighing.heightCm} cm`
          : '250x180x12 cm'),
        estimatedCost: payload.estimatedCost || 1250,
      };
      order.awb = order.courier.awb;
      order.qrReference = order.courier.qrReference;
      order.workflowStep = Math.max(step, 6);
      pushTimeline(order, `Courier reference entered (manual): ${order.awb}`, 'Amit Singh');
      break;

    case 'generateLabel':
      order.labelGenerated = true;
      order.workflowStep = Math.max(step, 7);
      pushTimeline(order, 'Internal packing/shipping label generated (no courier API)', 'Warehouse Operator');
      break;

    case 'printLabel':
      order.labelPrinted = true;
      order.workflowStep = Math.max(step, 8);
      pushTimeline(order, 'Label printed', 'Warehouse Operator');
      break;

    case 'uploadProof':
      order.packingProof = payload.proofName || `packing-proof-${order.key}.jpg`;
      order.workflowStep = Math.max(step, 8);
      pushTimeline(order, 'Packing proof uploaded', 'Warehouse Operator');
      break;

    case 'markPacked':
      order.status = 'Packed';
      order.inventoryStatus = 'Packed / Ready';
      order.shipmentStatus = 'Ready';
      order.workflowStep = Math.max(step, 9);
      if (inv && (order.fulfilmentPath === 'INDIA' || order.fulfilmentPath === 'MTO')) {
        inv.reserved = Math.max(0, inv.reserved - (order.qty || 1));
        inv.packed += order.qty || 1;
        await inv.save();
      }
      pushTimeline(order, 'Marked Packed / Ready to Ship', 'Warehouse Operator');
      break;

    case 'dispatchIndia':
      order.status = 'Dispatched';
      order.inventoryStatus = 'India Dispatch';
      order.shipmentStatus = 'Dispatched';
      order.workflowStep = Math.max(step, 9);
      if (inv) {
        inv.packed = Math.max(0, inv.packed - (order.qty || 1));
        inv.inTransit += order.qty || 1;
        await inv.save();
      }
      pushTimeline(order, 'Dispatched from India Main Warehouse', 'Ravi Kumar');
      break;

    case 'markInTransit':
      order.status = 'In Transit';
      order.inventoryStatus = 'In Transit';
      order.shipmentStatus = 'In Transit';
      order.workflowStep = Math.max(step, 9);
      pushTimeline(order, 'Stock marked In Transit', 'System');
      break;

    case 'confirmUsaReceipt': {
      const received = payload.receivedQty ?? order.qty ?? 1;
      const expected = order.qty || 1;
      const diff = received - expected;
      let receiptStatus = 'Matched';
      if (diff < 0) receiptStatus = 'Short';
      if (diff > 0) receiptStatus = 'Excess';
      if (payload.condition === 'Damaged') receiptStatus = 'Damaged';
      order.status = receiptStatus === 'Matched' ? 'Fulfilment Ready' : 'Received USA';
      order.inventoryStatus = receiptStatus === 'Matched' ? 'USA Available' : 'Discrepancy';
      order.usaReceiptConfirmed = receiptStatus === 'Matched';
      order.usaReceipt = { expected, received, difference: diff, condition: payload.condition || 'Good', status: receiptStatus };
      order.workflowStep = Math.max(step, 9);
      if (order.usaReceiptConfirmed && inv) {
        inv.inTransit = Math.max(0, inv.inTransit - expected);
        inv.usa += received;
        await inv.save();
      }
      pushTimeline(
        order,
        receiptStatus === 'Matched'
          ? 'USA receipt confirmed — stock now available'
          : `USA receipt discrepancy: ${receiptStatus}`,
        'Mike Johnson'
      );
      break;
    }

    case 'createShipment':
      order.status = 'Shipped';
      order.shipmentStatus = 'Out for Delivery';
      order.fulfilmentType = order.fulfilmentType || 'Customer Fulfilment';
      order.awb = order.awb || `SHIP-DEMO-${order.key}`;
      order.workflowStep = Math.max(step, 10);
      order.courier = {
        ...(order.courier || { provider: 'Manual / No Partner' }),
        lastMile: {
          provider: order.fulfilmentPath === 'USA' ? 'UPS' : 'Manual Label',
          awb: order.awb,
          service: 'Ground',
        },
      };
      if (inv && (order.fulfilmentPath === 'INDIA' || order.fulfilmentPath === 'MTO')) {
        inv.packed = Math.max(0, inv.packed - (order.qty || 1));
        await inv.save();
      }
      pushTimeline(order, 'Shipped to customer · tracking updated', 'Logistics');
      break;

    case 'markDelivered': {
      const costs = order.costs || {};
      const { totalCost, profit, margin } = calcProfit(order.sellingPrice, costs);
      order.status = 'Delivered';
      order.shipmentStatus = 'Delivered';
      order.paymentStatus = 'Settled';
      order.actualCostsReady = true;
      order.profit = profit;
      order.margin = margin;
      order.totalCost = totalCost;
      order.workflowStep = Math.max(step, 11);
      pushTimeline(order, 'Delivery confirmed · finance & profitability finalized', 'System');
      break;
    }

    default:
      throw httpError(400, `Unknown workflow action: ${action}`);
  }

  pushAudit(order, actorName, action, oldStatus, order.status);
  await order.save();

  const appPatch = await applySideEffects(tenantId, action, order, payload);
  const inventory = await InventoryItem.find({ tenantId }).lean();
  return {
    order: order.toClient(),
    inventory: inventory.map((row) => ({
      ...row,
      id: row.sku,
      _id: row._id.toString(),
      tenantId: row.tenantId.toString(),
    })),
    appPatch,
  };
}

export async function resetDemoOrder1001(tenantId) {
  const { getFreshOrder1001, getFreshInventory } = await import('../seed/orderSeedData.js');
  const fresh = getFreshOrder1001();
  const order = await Order.findOneAndUpdate(
    { tenantId, key: '1001' },
    {
      ...fresh,
      tenantId,
      key: '1001',
      timeline: JSON.parse(JSON.stringify(baseTimeline1001)),
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const invRows = getFreshInventory();
  for (const row of invRows) {
    await InventoryItem.findOneAndUpdate(
      { tenantId, sku: row.sku },
      { ...row, tenantId },
      { upsert: true }
    );
  }

  const freshApp = buildAppStateData();
  await TenantAppState.findOneAndUpdate(
    { tenantId },
    { data: freshApp },
    { upsert: true }
  );

  const inventory = await InventoryItem.find({ tenantId }).lean();
  return {
    order: order.toClient(),
    inventory: inventory.map((row) => ({
      ...row,
      id: row.sku,
      _id: row._id.toString(),
      tenantId: row.tenantId.toString(),
    })),
    appPatch: {
      pickPack: freshApp.pickPack,
      mto: freshApp.mto,
      courierReferences: freshApp.courierReferences,
      usaReceipts: freshApp.usaReceipts,
      shipments: freshApp.shipments,
      demoWorkflowStep: 1,
    },
  };
}
