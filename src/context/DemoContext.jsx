import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createSeedState, baseTimeline1001 } from '../data/seed';
import { loadPersistedState, savePersistedState, clearPersistedState } from '../utils/storage';
import { calcProfit } from '../utils/format';
import { decideFulfilment } from '../utils/allocation';
import { WORKFLOW_STEPS } from '../data/mockOrders';

const DemoContext = createContext(null);

function mergeSeedWithPersisted() {
  const seed = createSeedState();
  const persisted = loadPersistedState();
  if (!persisted) return seed;
  return { ...seed, ...persisted };
}

export function DemoProvider({ children }) {
  const [state, setState] = useState(mergeSeedWithPersisted);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { toasts: _t, ...persistable } = state;
    savePersistedState(persistable);
  }, [state]);

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const resetDemoData = useCallback(() => {
    clearPersistedState();
    setState(createSeedState());
    toast('Demo data reset to initial seed');
  }, [toast]);

  const updateOrder = useCallback((orderId, patch) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === orderId ? { ...o, ...patch } : o)),
    }));
  }, []);

  const appendAudit = useCallback((entry) => {
    setState((prev) => ({
      ...prev,
      auditLogs: [
        {
          id: `AUD-${Date.now()}`,
          timestamp: new Date().toISOString(),
          ip: '10.0.1.12',
          status: 'Success',
          ...entry,
        },
        ...prev.auditLogs,
      ],
    }));
  }, []);

  const advanceWorkflow = useCallback((action, payload = {}) => {
    setState((prev) => {
      const orders = prev.orders.map((o) => {
        if (o.id !== '1001') return o;
        let order = { ...o };
        const now = new Date().toISOString();
        const step = order.workflowStep || 1;

        const pushTimeline = (title, user = 'Demo User') => {
          const timeline = [...(order.timeline || [])];
          const pendingIdx = timeline.findIndex((t) => t.status === 'pending' || t.status === 'locked');
          if (pendingIdx >= 0) {
            timeline[pendingIdx] = {
              ...timeline[pendingIdx],
              at: now,
              title,
              user,
              status: 'done',
            };
            if (timeline[pendingIdx + 1] && timeline[pendingIdx + 1].status === 'locked') {
              timeline[pendingIdx + 1] = { ...timeline[pendingIdx + 1], status: 'pending' };
            }
          } else {
            timeline.push({ id: `t-${Date.now()}`, at: now, title, user, status: 'done' });
          }
          order.timeline = timeline;
        };

        switch (action) {
          case 'resolveSku':
            order = {
              ...order,
              sku: 'RUG-1001',
              product: 'Hand Knotted Wool Rug',
              status: 'Awaiting Inventory',
              inventoryStatus: 'Checked',
              workflowStep: Math.max(step, 2),
            };
            pushTimeline('SKU mapped to RUG-1001', 'Priya Sharma');
            break;
          case 'allocateInventory': {
            const invRow = prev.inventory.find((i) => i.sku === (order.sku || 'RUG-1001'));
            const decision = decideFulfilment(invRow, order.qty || 1, payload.forcePath || null);
            order = {
              ...order,
              status: decision.status,
              inventoryStatus: decision.inventoryStatus,
              fulfilmentLocation: decision.fulfilmentLocation,
              fulfilmentType: decision.fulfilmentType,
              warehouse: decision.warehouse,
              bin: decision.bin,
              fulfilmentPath: decision.path,
              allocationChecks: decision.checks,
              mtoId: decision.path === 'MTO' ? (order.mtoId || `MTO-1001`) : order.mtoId || null,
              mtoReady: decision.path === 'MTO' ? false : true,
              workflowStep: decision.path === 'MTO' ? Math.max(step, 3) : Math.max(step, 3),
            };
            pushTimeline(
              `Checked USA (${decision.checks.usaFree}) → India (${decision.checks.indiaFree}) → ${decision.message}`,
              'Priya Sharma'
            );
            if (decision.path === 'MTO') {
              pushTimeline('MTO created — awaiting production before pick', 'System');
            } else {
              pushTimeline(`Stock reserved at ${decision.warehouse}`, 'Priya Sharma');
            }
            break;
          }
          case 'completeMto':
            order = {
              ...order,
              status: 'Reserved',
              inventoryStatus: 'Reserved (India · after MTO)',
              fulfilmentPath: 'INDIA',
              fulfilmentType: 'Make to Order → India Stock → Customer',
              fulfilmentLocation: 'India Main Warehouse',
              warehouse: 'India Main Warehouse',
              bin: 'IND-RUG-01',
              mtoReady: true,
              workflowStep: Math.max(step, 3),
            };
            pushTimeline('MTO completed · QC passed · stock ready to pick', 'Ravi Kumar');
            break;
          case 'startPicking':
            order = { ...order, status: 'Picking', workflowStep: Math.max(step, 4) };
            pushTimeline(`Picking started at ${order.warehouse || 'warehouse'}`, order.fulfilmentPath === 'USA' ? 'Mike Johnson' : 'Amit Singh');
            break;
          case 'markPicked':
            order = { ...order, status: 'Picked', workflowStep: Math.max(step, 5) };
            pushTimeline(`Pick completed from bin ${order.bin || '—'}`, order.fulfilmentPath === 'USA' ? 'Mike Johnson' : 'Amit Singh');
            break;
          case 'recordWeighing':
            order = {
              ...order,
              status: 'Packing',
              weighing: {
                weightKg: Number(payload.weightKg ?? 28.5),
                lengthCm: Number(payload.lengthCm ?? 250),
                widthCm: Number(payload.widthCm ?? 180),
                heightCm: Number(payload.heightCm ?? 12),
                photoName: payload.photoName || 'weighing-photo-1001.jpg',
                photoPreview: payload.photoPreview || null,
                capturedAt: now,
                notes: payload.notes || 'Manual weighing — no courier partner API',
              },
              workflowStep: Math.max(step, 6),
            };
            pushTimeline(
              `Weighing captured: ${order.weighing.weightKg} kg · ${order.weighing.lengthCm}x${order.weighing.widthCm}x${order.weighing.heightCm} cm · photo uploaded`,
              'Warehouse Operator'
            );
            break;
          case 'enterCourier':
            order = {
              ...order,
              status: 'Packing',
              courier: {
                provider: payload.provider || 'Manual / No Partner',
                reference: payload.reference || 'MANUAL-1001',
                awb: payload.awb || 'MANUAL-AWB-1001',
                qrReference: payload.qrReference || 'QR-MANUAL-1001',
                service: payload.serviceType || 'Standard',
                weight: payload.weight || order.weighing?.weightKg || 28.5,
                dimensions: payload.dimensions || (order.weighing
                  ? `${order.weighing.lengthCm}x${order.weighing.widthCm}x${order.weighing.heightCm} cm`
                  : '250x180x12 cm'),
                estimatedCost: payload.estimatedCost || 1250,
              },
              awb: payload.awb || 'MANUAL-AWB-1001',
              qrReference: payload.qrReference || 'QR-MANUAL-1001',
              workflowStep: Math.max(step, 6),
            };
            pushTimeline(`Courier reference entered (manual): ${order.awb}`, 'Amit Singh');
            break;
          case 'generateLabel':
            order = { ...order, labelGenerated: true, workflowStep: Math.max(step, 7) };
            pushTimeline('Internal packing/shipping label generated (no courier API)', 'Warehouse Operator');
            break;
          case 'printLabel':
            order = { ...order, labelPrinted: true, workflowStep: Math.max(step, 8) };
            pushTimeline('Label printed', 'Warehouse Operator');
            break;
          case 'uploadProof':
            order = {
              ...order,
              packingProof: payload.proofName || 'packing-proof-1001.jpg',
              workflowStep: Math.max(step, 8),
            };
            pushTimeline('Packing proof uploaded', 'Warehouse Operator');
            break;
          case 'markPacked':
            order = {
              ...order,
              status: 'Packed',
              inventoryStatus: 'Packed / Ready',
              shipmentStatus: 'Ready',
              workflowStep: Math.max(step, 9),
            };
            pushTimeline('Marked Packed / Ready to Ship', 'Warehouse Operator');
            break;
          case 'dispatchIndia':
            order = {
              ...order,
              status: 'Dispatched',
              inventoryStatus: 'India Dispatch',
              shipmentStatus: 'Dispatched',
              workflowStep: Math.max(step, 9),
            };
            pushTimeline('Dispatched from India Main Warehouse', 'Ravi Kumar');
            break;
          case 'markInTransit':
            order = {
              ...order,
              status: 'In Transit',
              inventoryStatus: 'In Transit',
              shipmentStatus: 'In Transit',
              workflowStep: Math.max(step, 9),
            };
            pushTimeline('Stock marked In Transit', 'System');
            break;
          case 'confirmUsaReceipt': {
            const received = payload.receivedQty ?? 1;
            const expected = 1;
            const diff = received - expected;
            let receiptStatus = 'Matched';
            if (diff < 0) receiptStatus = 'Short';
            if (diff > 0) receiptStatus = 'Excess';
            if (payload.condition === 'Damaged') receiptStatus = 'Damaged';
            order = {
              ...order,
              status: receiptStatus === 'Matched' ? 'Fulfilment Ready' : 'Received USA',
              inventoryStatus: receiptStatus === 'Matched' ? 'USA Available' : 'Discrepancy',
              usaReceiptConfirmed: receiptStatus === 'Matched',
              usaReceipt: { expected, received, difference: diff, condition: payload.condition || 'Good', status: receiptStatus },
              workflowStep: Math.max(step, 9),
            };
            pushTimeline(
              receiptStatus === 'Matched'
                ? 'USA receipt confirmed — stock now available'
                : `USA receipt discrepancy: ${receiptStatus}`,
              'Mike Johnson'
            );
            break;
          }
          case 'createShipment':
            order = {
              ...order,
              status: 'Shipped',
              shipmentStatus: 'Out for Delivery',
              fulfilmentType: order.fulfilmentType || 'Customer Fulfilment',
              awb: order.awb || 'SHIP-DEMO-1001',
              workflowStep: Math.max(step, 10),
              courier: {
                ...(order.courier || { provider: 'Manual / No Partner' }),
                lastMile: {
                  provider: order.fulfilmentPath === 'USA' ? 'UPS' : 'Manual Label',
                  awb: order.awb || 'SHIP-DEMO-1001',
                  service: 'Ground',
                },
              },
            };
            pushTimeline('Shipped to customer · tracking updated', 'Logistics');
            break;
          case 'markDelivered': {
            const costs = order.costs;
            const { totalCost, profit, margin } = calcProfit(order.sellingPrice, costs);
            order = {
              ...order,
              status: 'Delivered',
              shipmentStatus: 'Delivered',
              paymentStatus: 'Settled',
              actualCostsReady: true,
              profit,
              margin,
              totalCost,
              workflowStep: Math.max(step, 11),
            };
            pushTimeline('Delivery confirmed · finance & profitability finalized', 'System');
            break;
          }
          default:
            break;
        }
        return order;
      });

      let inventory = prev.inventory;
      let skuMappings = prev.skuMappings;
      let pickPack = prev.pickPack;
      let courierReferences = prev.courierReferences;
      let shipments = prev.shipments;
      let usaReceipts = prev.usaReceipts;

      if (action === 'resolveSku') {
        skuMappings = skuMappings.map((m) =>
          m.marketplaceSku === 'AMZ-RUG-BLUE-8X10' || m.id === 'MAP-002'
            ? m
            : m
        );
        // Ensure demo mapping for AMZ-RUG-BLUE is mapped (already is); clear related exceptions if any
      }

      let mto = prev.mto;

      if (action === 'allocateInventory') {
        const order = orders.find((o) => o.id === '1001');
        const path = order?.fulfilmentPath;
        if (path === 'USA') {
          inventory = inventory.map((row) => {
            if (row.sku !== 'RUG-1001') return row;
            return { ...row, usa: Math.max(0, row.usa - 1) };
          });
          pickPack = pickPack.map((p) =>
            p.order === '#1001'
              ? { ...p, status: 'Awaiting Pick', bin: 'USA-RUG-01', operator: 'Mike Johnson' }
              : p
          );
        } else if (path === 'INDIA') {
          inventory = inventory.map((row) => {
            if (row.sku !== 'RUG-1001') return row;
            return { ...row, reserved: row.reserved + 1 };
          });
          pickPack = pickPack.map((p) =>
            p.order === '#1001'
              ? { ...p, status: 'Awaiting Pick', bin: 'IND-RUG-01', operator: 'Amit Singh' }
              : p
          );
        } else if (path === 'MTO') {
          const exists = mto.some((m) => m.id === 'MTO-1001' || m.order === '#1001');
          if (!exists) {
            mto = [
              {
                id: 'MTO-1001',
                order: '#1001',
                sku: 'RUG-1001',
                product: 'Hand Knotted Wool Rug',
                qty: 1,
                customer: 'Jennifer Walsh',
                expectedReady: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
                stage: 'To Make',
                pendingQty: 1,
                notes: 'Auto-created — USA & India stock unavailable',
                attachments: [],
              },
              ...mto,
            ];
          }
          pickPack = pickPack.map((p) =>
            p.order === '#1001' ? { ...p, status: 'Awaiting Pick', operator: 'Unassigned' } : p
          );
        }
      }

      if (action === 'completeMto') {
        mto = mto.map((m) =>
          m.order === '#1001' || m.id === 'MTO-1001'
            ? { ...m, stage: 'Pack', pendingQty: 0 }
            : m
        );
        inventory = inventory.map((row) => {
          if (row.sku !== 'RUG-1001') return row;
          return { ...row, indiaAvailable: row.indiaAvailable + 1, reserved: row.reserved + 1 };
        });
        pickPack = pickPack.map((p) =>
          p.order === '#1001'
            ? { ...p, status: 'Awaiting Pick', bin: 'IND-RUG-01', operator: 'Amit Singh' }
            : p
        );
      }

      if (action === 'startPicking') {
        pickPack = pickPack.map((p) =>
          p.order === '#1001' ? { ...p, status: 'Picking' } : p
        );
      }

      if (action === 'markPicked') {
        pickPack = pickPack.map((p) =>
          p.order === '#1001' ? { ...p, status: 'Picked', pickQty: 1 } : p
        );
      }

      if (action === 'enterCourier') {
        const order = orders.find((o) => o.id === '1001');
        courierReferences = courierReferences.map((c) =>
          c.order === '#1001'
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

      if (action === 'markPacked') {
        pickPack = pickPack.map((p) =>
          p.order === '#1001' ? { ...p, status: 'Packed', packedQty: 1 } : p
        );
        const order = orders.find((o) => o.id === '1001');
        if (order?.fulfilmentPath === 'INDIA' || order?.fulfilmentPath === 'MTO') {
          inventory = inventory.map((row) => {
            if (row.sku !== 'RUG-1001') return row;
            return {
              ...row,
              reserved: Math.max(0, row.reserved - 1),
              packed: row.packed + 1,
            };
          });
        }
      }

      if (action === 'dispatchIndia' || action === 'markInTransit') {
        inventory = inventory.map((row) => {
          if (row.sku !== 'RUG-1001') return row;
          if (action === 'dispatchIndia') {
            return { ...row, packed: Math.max(0, row.packed - 1), inTransit: row.inTransit + 1 };
          }
          return row;
        });
      }

      if (action === 'confirmUsaReceipt') {
        const order = orders.find((o) => o.id === '1001');
        if (order?.usaReceiptConfirmed) {
          inventory = inventory.map((row) => {
            if (row.sku !== 'RUG-1001') return row;
            return {
              ...row,
              inTransit: Math.max(0, row.inTransit - 1),
              usa: row.usa + 1,
            };
          });
        }
        usaReceipts = [
          {
            id: 'RCP-USA-1001',
            order: '#1001',
            date: new Date().toISOString().slice(0, 10),
            sku: 'RUG-1001',
            expected: 1,
            received: order?.usaReceipt?.received ?? 1,
            difference: order?.usaReceipt?.difference ?? 0,
            condition: order?.usaReceipt?.condition || 'Good',
            status: order?.usaReceipt?.status || 'Matched',
          },
          ...usaReceipts.filter((r) => r.id !== 'RCP-USA-046' && r.id !== 'RCP-USA-1001'),
        ];
      }

      if (action === 'createShipment') {
        const order = orders.find((o) => o.id === '1001');
        const origin = order?.fulfilmentPath === 'USA' ? 'USA East Warehouse' : 'India Main Warehouse';
        shipments = shipments.map((s) =>
          s.id === 'SHP-1001'
            ? {
                ...s,
                courier: order?.courier?.provider || 'Manual / No Partner',
                awb: order?.awb || 'SHIP-DEMO-1001',
                origin,
                destination: 'Austin, TX',
                weight: order?.weighing?.weightKg || s.weight,
                status: 'Out for Delivery',
                lastUpdate: new Date().toISOString(),
                estimatedCost: 1100,
                tracking: [
                  { at: new Date().toISOString(), event: 'Shipment created', location: origin },
                  { at: new Date().toISOString(), event: 'Out for delivery', location: 'Austin, TX' },
                ],
              }
            : s
        );
        if (order?.fulfilmentPath === 'INDIA' || order?.fulfilmentPath === 'MTO') {
          inventory = inventory.map((row) => {
            if (row.sku !== 'RUG-1001') return row;
            return { ...row, packed: Math.max(0, row.packed - 1) };
          });
        }
      }

      if (action === 'markDelivered') {
        shipments = shipments.map((s) =>
          s.id === 'SHP-1001'
            ? {
                ...s,
                status: 'Delivered',
                actualCost: 1100,
                lastUpdate: new Date().toISOString(),
                tracking: [
                  ...(s.tracking || []),
                  { at: new Date().toISOString(), event: 'Delivered', location: 'Austin, TX' },
                ],
              }
            : s
        );
      }

      return {
        ...prev,
        orders,
        inventory,
        skuMappings,
        pickPack,
        courierReferences,
        shipments,
        usaReceipts,
        mto,
        demoWorkflowStep: orders.find((o) => o.id === '1001')?.workflowStep || prev.demoWorkflowStep,
      };
    });
  }, []);

  const resetWorkflow1001 = useCallback(() => {
    setState((prev) => {
      const seed = createSeedState();
      const seedOrder = seed.orders.find((o) => o.id === '1001');
      return {
        ...prev,
        orders: prev.orders.map((o) => (o.id === '1001' ? { ...seedOrder, timeline: JSON.parse(JSON.stringify(baseTimeline1001)) } : o)),
        inventory: seed.inventory,
        pickPack: seed.pickPack,
        courierReferences: seed.courierReferences,
        shipments: prev.shipments.map((s) =>
          s.id === 'SHP-1001'
            ? { ...seed.shipments.find((x) => x.id === 'SHP-1001') }
            : s
        ),
        usaReceipts: seed.usaReceipts,
        mto: seed.mto,
        demoWorkflowStep: 1,
      };
    });
    toast('Demo workflow for Order #1001 has been reset');
  }, [toast]);

  const mapSku = useCallback((mappingId, internalSku) => {
    setState((prev) => {
      const product = prev.products.find((p) => p.sku === internalSku);
      return {
        ...prev,
        skuMappings: prev.skuMappings.map((m) =>
          m.id === mappingId
            ? { ...m, internalSku, status: 'Mapped', product: product?.name || m.product }
            : m
        ),
        orders: prev.orders.map((o) => {
          const mapping = prev.skuMappings.find((m) => m.id === mappingId);
          if (mapping && o.marketplaceSku === mapping.marketplaceSku && o.status === 'Mapping Required') {
            return {
              ...o,
              sku: internalSku,
              product: product?.name || o.product,
              status: 'Awaiting Inventory',
              inventoryStatus: 'Checked',
            };
          }
          return o;
        }),
      };
    });
    toast(`Mapped to internal SKU ${internalSku}`);
  }, [toast]);

  const updateEntity = useCallback((key, idField, id, patch) => {
    setState((prev) => ({
      ...prev,
      [key]: prev[key].map((item) => (item[idField] === id ? { ...item, ...patch } : item)),
    }));
  }, []);

  const addEntity = useCallback((key, item) => {
    setState((prev) => ({
      ...prev,
      [key]: [item, ...prev[key]],
    }));
  }, []);

  const value = useMemo(
    () => ({
      state,
      setState,
      loading,
      setLoading,
      toasts,
      toast,
      dismissToast,
      resetDemoData,
      updateOrder,
      appendAudit,
      advanceWorkflow,
      resetWorkflow1001,
      mapSku,
      updateEntity,
      addEntity,
      workflowSteps: WORKFLOW_STEPS,
    }),
    [
      state, loading, toasts, toast, dismissToast, resetDemoData, updateOrder,
      appendAudit, advanceWorkflow, resetWorkflow1001, mapSku, updateEntity, addEntity,
    ]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
}
