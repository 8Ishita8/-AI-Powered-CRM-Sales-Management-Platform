import { Router } from 'express';
import { AIController } from '../modules/ai/ai.controller';

const router = Router();
const controller = new AIController();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// AI analysis endpoints
router.post('/api/v1/ai/leads/:id/analyze', (req, res, next) => {
  controller.analyzeLead(req, res, next);
});

router.post('/api/v1/ai/generate-email', (req, res, next) => {
  controller.generateEmail(req, res, next);
});

router.post('/api/v1/ai/seed-test-data', (req, res, next) => {
  controller.seedTestData(req, res, next);
});

export const aiRouter = router;
export default aiRouter;
