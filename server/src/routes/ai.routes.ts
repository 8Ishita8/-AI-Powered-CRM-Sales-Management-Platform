import { Router } from 'express';
import { AIController } from '../modules/ai/ai.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const aiRouter = Router();
const controller = new AIController();

// Seed test data does not strictly require auth to make it easy for developer integration testing
aiRouter.post('/seed-test-data', controller.seedTestData);

// Apply requireAuth for scoring and email generation
aiRouter.post('/leads/:id/analyze', requireAuth, controller.analyzeLead);
aiRouter.post('/generate-email', requireAuth, controller.generateEmail);

export default aiRouter;
