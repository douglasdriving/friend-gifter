import { Router, type Router as RouterType } from 'express';
import authRoutes from './auth.routes';
import itemsRoutes from './items.routes';
import wishesRoutes from './wishes.routes';
import friendsRoutes from './friends.routes';

const router: RouterType = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/items', itemsRoutes);
router.use('/wishes', wishesRoutes);
router.use('/friends', friendsRoutes);

export default router;
