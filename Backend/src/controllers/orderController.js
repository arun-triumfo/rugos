import { Order } from '../models/Order.js';
import { InventoryItem } from '../models/InventoryItem.js';
import { advanceOrderWorkflow, resetDemoOrder1001 } from '../services/workflowService.js';
import { httpError } from '../middleware/errorHandler.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { WORKFLOW_STEPS } from '../seed/orderSeedData.js';

export const listOrders = asyncHandler(async (req, res) => {
  const { status, search, marketplace } = req.query;
  const q = { tenantId: req.auth.tenantId };
  if (status) q.status = status;
  if (marketplace) q.marketplace = marketplace;
  if (search) {
    q.$or = [
      { orderNumber: new RegExp(search, 'i') },
      { customer: new RegExp(search, 'i') },
      { sku: new RegExp(search, 'i') },
      { product: new RegExp(search, 'i') },
      { marketplaceOrderId: new RegExp(search, 'i') },
    ];
  }

  const orders = await Order.find(q).sort({ date: -1 });
  return ok(res, {
    orders: orders.map((o) => o.toClient()),
    workflowSteps: WORKFLOW_STEPS,
  });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ tenantId: req.auth.tenantId, key: req.params.id });
  if (!order) throw httpError(404, 'Order not found');
  return ok(res, { order: order.toClient(), workflowSteps: WORKFLOW_STEPS });
});

export const runWorkflow = asyncHandler(async (req, res) => {
  const { action, payload } = req.body || {};
  if (!action) throw httpError(400, 'action is required');

  const result = await advanceOrderWorkflow(
    req.auth.tenantId,
    req.params.id,
    action,
    payload || {},
    req.user?.name || 'Demo User'
  );
  return ok(res, result, `Workflow: ${action}`);
});

export const resetWorkflow = asyncHandler(async (req, res) => {
  if (req.params.id !== '1001') {
    throw httpError(400, 'Only Order #1001 demo workflow can be reset');
  }
  const result = await resetDemoOrder1001(req.auth.tenantId);
  return ok(res, result, 'Order #1001 workflow reset');
});

export const listInventory = asyncHandler(async (req, res) => {
  const rows = await InventoryItem.find({ tenantId: req.auth.tenantId }).sort({ sku: 1 });
  return ok(res, rows.map((r) => r.toClient()));
});
