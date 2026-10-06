import { TenantAppState, APP_STATE_KEYS } from '../models/TenantAppState.js';
import { Order } from '../models/Order.js';
import { InventoryItem } from '../models/InventoryItem.js';
import { StockLedger } from '../models/StockLedger.js';
import { buildAppStateData } from '../seed/appStateSeed.js';
import { getAllSeedOrders, getFreshInventory } from '../seed/orderSeedData.js';
import { httpError } from '../middleware/errorHandler.js';
import { ok, created } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { WORKFLOW_STEPS } from '../seed/orderSeedData.js';

async function getOrCreateState(tenantId) {
  let doc = await TenantAppState.findOne({ tenantId });
  if (!doc) {
    doc = await TenantAppState.create({ tenantId, data: buildAppStateData() });
  }
  return doc;
}

function itemId(item) {
  return item?.id ?? item?.key ?? item?._id ?? item?.sku;
}

function stripMeta(row) {
  const { _id, tenantId, __v, createdAt, updatedAt, ...rest } = row || {};
  return rest;
}

export const bootstrap = asyncHandler(async (req, res) => {
  const tenantId = req.auth.tenantId;
  const [appDoc, orders, inventory] = await Promise.all([
    getOrCreateState(tenantId),
    Order.find({ tenantId }).sort({ date: -1 }),
    InventoryItem.find({ tenantId }).sort({ sku: 1 }),
  ]);

  const data = { ...appDoc.data };
  const state = {
    ...data,
    orders: orders.map((o) => o.toClient()),
    inventory: inventory.map((i) => i.toClient()),
    toasts: [],
    workflowSteps: WORKFLOW_STEPS,
  };

  return ok(res, state);
});

export const mutate = asyncHandler(async (req, res) => {
  const tenantId = req.auth.tenantId;
  const { op, collection, idField = 'id', id, patch, item, data } = req.body || {};

  if (op === 'replaceState' && data && typeof data === 'object') {
    const next = {};
    for (const key of APP_STATE_KEYS) {
      if (data[key] !== undefined) next[key] = data[key];
    }

    if (Array.isArray(data.orders)) {
      const keys = data.orders.map((o) => o.id || o.key).filter(Boolean);
      await Order.deleteMany({ tenantId, key: { $nin: keys } });
      for (const o of data.orders) {
        const key = o.id || o.key;
        if (!key) continue;
        const rest = stripMeta(o);
        delete rest.id;
        await Order.findOneAndUpdate(
          { tenantId, key },
          { ...rest, key, tenantId },
          { upsert: true }
        );
      }
    }

    if (Array.isArray(data.inventory)) {
      const skus = data.inventory.map((row) => row.sku).filter(Boolean);
      await InventoryItem.deleteMany({ tenantId, sku: { $nin: skus } });
      for (const row of data.inventory) {
        if (!row.sku) continue;
        const rest = stripMeta(row);
        delete rest.id;
        await InventoryItem.findOneAndUpdate(
          { tenantId, sku: row.sku },
          { ...rest, sku: row.sku, tenantId },
          { upsert: true }
        );
      }
    }

    await TenantAppState.findOneAndUpdate(
      { tenantId },
      { data: next },
      { upsert: true }
    );
    return ok(res, { saved: true }, 'State saved');
  }

  // ——— Orders ———
  if (collection === 'orders') {
    if (op === 'add') {
      const src = item || patch || {};
      const key = String(src.id || src.key || Date.now());
      const payload = {
        ...stripMeta(src),
        key,
        orderNumber: src.orderNumber || `#${key}`,
        tenantId,
        date: src.date ? new Date(src.date) : new Date(),
        status: src.status || 'Imported',
        workflowStep: src.workflowStep || 1,
        timeline: src.timeline || [],
        auditLog: src.auditLog || [],
      };
      delete payload.id;
      const order = await Order.create(payload);
      return created(res, { order: order.toClient() }, 'Order created');
    }
    if (op === 'update') {
      const order = await Order.findOne({ tenantId, key: String(id) });
      if (!order) throw httpError(404, 'Order not found');
      Object.assign(order, stripMeta(patch || {}));
      await order.save();
      return ok(res, { order: order.toClient() }, 'Order updated');
    }
    if (op === 'delete') {
      const deleted = await Order.findOneAndDelete({ tenantId, key: String(id) });
      if (!deleted) throw httpError(404, 'Order not found');
      return ok(res, { id }, 'Order deleted');
    }
    throw httpError(400, 'Unsupported orders op');
  }

  // ——— Inventory ———
  if (collection === 'inventory') {
    if (op === 'add') {
      const src = item || patch || {};
      if (!src.sku) throw httpError(400, 'sku is required');
      const row = await InventoryItem.create({ ...stripMeta(src), sku: src.sku, tenantId });
      return created(res, { item: row.toClient() }, 'Inventory row created');
    }
    if (op === 'update') {
      const row = await InventoryItem.findOne({ tenantId, sku: String(id) });
      if (!row) throw httpError(404, 'Inventory row not found');
      Object.assign(row, stripMeta(patch || {}));
      await row.save();
      return ok(res, { item: row.toClient() }, 'Inventory updated');
    }
    if (op === 'delete') {
      const deleted = await InventoryItem.findOneAndDelete({ tenantId, sku: String(id) });
      if (!deleted) throw httpError(404, 'Inventory row not found');
      return ok(res, { id }, 'Inventory deleted');
    }
    if (op === 'replaceCollection' && Array.isArray(data)) {
      await InventoryItem.deleteMany({ tenantId });
      await InventoryItem.insertMany(data.map((row) => ({ ...stripMeta(row), sku: row.sku, tenantId })));
      const inventory = await InventoryItem.find({ tenantId });
      return ok(res, { inventory: inventory.map((i) => i.toClient()) });
    }
    throw httpError(400, 'Unsupported inventory op');
  }

  if (!APP_STATE_KEYS.includes(collection) && collection !== 'auditLogs') {
    throw httpError(400, `Unknown collection: ${collection}`);
  }

  const doc = await getOrCreateState(tenantId);
  const bucket = doc.data[collection];

  if (op === 'update') {
    if (!Array.isArray(bucket)) throw httpError(400, `${collection} is not an array`);
    doc.data[collection] = bucket.map((row) =>
      String(row[idField] ?? itemId(row)) === String(id) ? { ...row, ...patch } : row
    );
    doc.markModified('data');
    await doc.save();
    return ok(res, {
      collection,
      item: doc.data[collection].find((r) => String(r[idField] ?? itemId(r)) === String(id)),
    }, 'Updated');
  }

  if (op === 'add') {
    if (!Array.isArray(bucket)) throw httpError(400, `${collection} is not an array`);
    const nextItem = item || patch;
    if (!nextItem) throw httpError(400, 'item required');
    doc.data[collection] = [nextItem, ...bucket];
    doc.markModified('data');
    await doc.save();
    return created(res, { collection, item: nextItem }, 'Created');
  }

  if (op === 'delete') {
    if (!Array.isArray(bucket)) throw httpError(400, `${collection} is not an array`);
    const before = bucket.length;
    doc.data[collection] = bucket.filter((row) => String(row[idField] ?? itemId(row)) !== String(id));
    if (doc.data[collection].length === before) throw httpError(404, 'Record not found');
    doc.markModified('data');
    await doc.save();
    return ok(res, { collection, id }, 'Deleted');
  }

  if (op === 'replaceCollection') {
    doc.data[collection] = data;
    doc.markModified('data');
    await doc.save();
    return ok(res, { collection, data: doc.data[collection] });
  }

  if (op === 'setKey') {
    doc.data[collection] = data ?? patch;
    doc.markModified('data');
    await doc.save();
    return ok(res, { collection, data: doc.data[collection] });
  }

  throw httpError(400, 'op must be update | add | delete | replaceCollection | setKey | replaceState');
});

export const resetAppData = asyncHandler(async (req, res) => {
  const tenantId = req.auth.tenantId;

  await Promise.all([
    Order.deleteMany({ tenantId }),
    InventoryItem.deleteMany({ tenantId }),
    StockLedger.deleteMany({ tenantId }),
    TenantAppState.deleteMany({ tenantId }),
  ]);

  await InventoryItem.insertMany(getFreshInventory().map((row) => ({ ...row, tenantId })));
  await Order.insertMany(getAllSeedOrders().map((o) => ({ ...o, tenantId })));
  await TenantAppState.create({ tenantId, data: buildAppStateData() });

  return bootstrap(req, res);
});
