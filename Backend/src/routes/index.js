import { Router } from 'express';
import authRoutes from './authRoutes.js';
import saasRoutes from './saasRoutes.js';
import orderRoutes from './orderRoutes.js';
import appRoutes from './appRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ ok: true, data: { service: 'rugos-api', status: 'up' } });
});

router.use('/auth', authRoutes);
router.use('/saas', saasRoutes);
router.use(orderRoutes);
router.use(appRoutes);
router.use(analyticsRoutes);

export default router;
