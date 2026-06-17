import { Router } from 'express';
import { loginController } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import { loginSchema } from '../validators/auth.validator';

const authRouter = Router();

// Hook up login validations and controller logic
authRouter.post('/login', validateRequest(loginSchema), loginController);

export default authRouter;
