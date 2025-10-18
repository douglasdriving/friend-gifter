import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { registerSchema, loginSchema } from '../services/auth.service';

const router = Router();

// POST /api/v1/auth/register - Register new user
router.post('/register', validate(registerSchema), authController.register);

// POST /api/v1/auth/login - Login user
router.post('/login', validate(loginSchema), authController.login);

// GET /api/v1/auth/me - Get current user
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
