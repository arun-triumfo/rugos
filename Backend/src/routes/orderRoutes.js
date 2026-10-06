import { Router } from 'express';
import {
  listOrders, getOrder, runWorkflow, resetWorkflow, listInventory,
} from '../controllers/orderController.js';
import { requireAuth, requireTenantUser } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireTenantUser);

router.get('/orders', listOrders);
router.get('/orders/:id', getOrder);
router.post('/orders/:id/workflow', runWorkflow);
router.post('/orders/:id/reset-workflow', resetWorkflow);
router.get('/inventory', listInventory);

export default router;
