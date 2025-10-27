import { Router, type Router as RouterType } from 'express';
import { friendsController } from '../controllers/friends.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';

const router: RouterType = Router();

// All routes require authentication
router.use(authenticate);

// Validation schemas
const sendRequestSchema = z.object({
  addresseeId: z.string().uuid(),
});

// Routes
router.get('/search', friendsController.searchUsers);
router.get('/suggestions', friendsController.getSuggestions);
router.get('/', friendsController.getFriends);
router.get('/requests/pending', friendsController.getPendingRequests);
router.get('/requests/sent', friendsController.getSentRequests);
router.post('/requests', validate(sendRequestSchema), friendsController.sendRequest);
router.post('/requests/:id/accept', friendsController.acceptRequest);
router.delete('/requests/:id', friendsController.declineRequest);
router.delete('/:id', friendsController.removeFriend);

export default router;
