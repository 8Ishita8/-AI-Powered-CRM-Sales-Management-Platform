import { Router } from 'express';
import { loginController } from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { loginSchema } from '../validators/auth.validator';

const authRouter = Router();

// Hook up login validations using validateBody and direct login schema
authRouter.post('/login', validateBody(loginSchema), loginController);

export default authRouter;
