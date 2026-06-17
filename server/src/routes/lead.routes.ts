import { Router } from 'express';
import { getLeadsController, getLeadByIdController } from '../controllers/lead.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const leadRouter = Router();

// Secure all endpoints under JWT Authentication middleware
leadRouter.use(requireAuth);

leadRouter.get('/', getLeadsController);
leadRouter.get('/:id', getLeadByIdController);

export default leadRouter;
