import { Router } from 'express';
import { login, me, logout, quickLogin, switchRole } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.post('/quick-login', quickLogin);
router.post('/switch-role', requireAuth, switchRole);
router.get('/me', requireAuth, me);
router.post('/logout', requireAuth, logout);

export default router;
