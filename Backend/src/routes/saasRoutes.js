import { Router } from 'express';
import {
  listPlans,
  updatePlan,
  listBuyers,
  createBuyerPurchase,
  approveBuyer,
  suspendBuyer,
  listSubscriptions,
  changeSubscriptionPlan,
} from '../controllers/saasController.js';
import { requireAuth, requirePlatformAdmin } from '../middleware/auth.js';

const router = Router();

// Public
router.get('/plans', listPlans);
router.post('/buyers/purchase', createBuyerPurchase);

// Platform superadmin
router.patch('/plans/:id', requireAuth, requirePlatformAdmin, updatePlan);
router.get('/buyers', requireAuth, requirePlatformAdmin, listBuyers);
router.post('/buyers/:id/approve', requireAuth, requirePlatformAdmin, approveBuyer);
router.post('/buyers/:id/suspend', requireAuth, requirePlatformAdmin, suspendBuyer);
router.get('/subscriptions', requireAuth, requirePlatformAdmin, listSubscriptions);
router.patch('/subscriptions/:id', requireAuth, requirePlatformAdmin, changeSubscriptionPlan);

export default router;
