import { Router } from 'express';
import { LeadController } from '../modules/leads/controllers/lead.controller';
import { CallController } from '../modules/calls/controllers/call.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { createLeadSchema } from '../modules/leads/validators/createLead.schema';
import { updateLeadSchema } from '../modules/leads/validators/updateLead.schema';
import { assignLeadSchema } from '../modules/leads/validators/assignLead.schema';
import { createCallSchema } from '../modules/calls/validators/call.validator';

const leadRouter = Router();
const leadController = new LeadController();
const callController = new CallController();

// Enforce auth on all lead/call routes
leadRouter.use(requireAuth);

// Lead CRUD Endpoints
leadRouter.post('/', validateRequest({ body: createLeadSchema }), leadController.createLead);
leadRouter.get('/', leadController.getLeads);
leadRouter.get('/:id', leadController.getLeadById);
leadRouter.patch('/:id', validateRequest({ body: updateLeadSchema }), leadController.updateLead);
leadRouter.patch('/:id/assign', validateRequest({ body: assignLeadSchema }), leadController.assignLead);

// Call Record Endpoint associated with a Lead
leadRouter.post('/:id/calls', validateRequest({ body: createCallSchema }), callController.logCall);

export default leadRouter;
