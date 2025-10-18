import { Router } from 'express';
import { wishesController } from '../controllers/wishes.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Validation schemas
const createWishSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  category: z.string().min(1).max(50),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
});

const updateWishSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  category: z.string().min(1).max(50).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  isFulfilled: z.boolean().optional(),
});

// Routes
router.get('/feed', wishesController.getFeed);
router.get('/my-wishes', wishesController.getMyWishes);
router.get('/:id', wishesController.getById);
router.post('/', validate(createWishSchema), wishesController.create);
router.put('/:id', validate(updateWishSchema), wishesController.update);
router.post('/:id/fulfilled', wishesController.markAsFulfilled);
router.delete('/:id', wishesController.delete);

export default router;
