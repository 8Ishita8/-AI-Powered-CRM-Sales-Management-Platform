import { Router } from 'express';
import { FollowupController } from '../modules/followups/controllers/followup.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { createFollowupSchema, updateFollowupStatusSchema } from '../modules/followups/validators/followup.validator';

const followupRouter = Router();
const followupController = new FollowupController();

// Enforce auth on all followup routes
followupRouter.use(requireAuth);

followupRouter.post('/', validateRequest({ body: createFollowupSchema }), followupController.createFollowup);
followupRouter.get('/', followupController.getFollowups);
followupRouter.patch('/:id', validateRequest({ body: updateFollowupStatusSchema }), followupController.updateFollowupStatus);

export default followupRouter;
