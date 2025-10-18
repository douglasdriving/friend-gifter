import { Router } from 'express';
import { itemsController } from '../controllers/items.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Validation schemas
const createItemSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  category: z.string().min(1).max(50),
  condition: z.enum(['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR']),
});

const updateItemSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  category: z.string().min(1).max(50).optional(),
  condition: z.enum(['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR']).optional(),
  isGifted: z.boolean().optional(),
});

// Routes
router.get('/feed', itemsController.getFeed);
router.get('/my-items', itemsController.getMyItems);
router.get('/:id', itemsController.getById);
router.post('/', validate(createItemSchema), itemsController.create);
router.put('/:id', validate(updateItemSchema), itemsController.update);
router.post('/:id/gifted', itemsController.markAsGifted);
router.delete('/:id', itemsController.delete);

export default router;
