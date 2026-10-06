import { Router } from 'express';
import { bootstrap, mutate, resetAppData } from '../controllers/appController.js';
import { requireAuth, requireTenantUser } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireTenantUser);

router.get('/app/bootstrap', bootstrap);
router.post('/app/mutate', mutate);
router.post('/app/reset', resetAppData);

export default router;
