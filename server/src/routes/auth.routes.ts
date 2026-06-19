import { Router } from 'express';
import { loginController, registerController } from '../controllers/auth.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';

const authRouter = Router();

// Route to log in users
authRouter.post('/login', validateBody(loginSchema), loginController);

// Route to register new users (Admin-only restriction)
authRouter.post(
  '/register',
  requireAuth,
  requireRole(['admin']),
  validateBody(registerSchema),
  registerController
);

export default authRouter;
