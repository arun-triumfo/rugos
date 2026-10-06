import { Router } from 'express';
import { getDashboard } from '../controllers/analyticsController.js';
import { requireAuth, requireTenantUser } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireTenantUser);
router.get('/analytics/dashboard', getDashboard);

export default router;
