import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { requestIdMiddleware } from './middlewares/request-id.middleware';
import { errorHandlerMiddleware, AppError } from './middlewares/error.middleware';
import { sendSuccess } from './utils/response';
import logger from './utils/logger';

const app: Express = express();

// 1. Enable request ID context tracking immediately
app.use(requestIdMiddleware);

// Log each incoming request route details
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

// 2. Wire transport & security middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Define APIs under /api/v1
const apiRouter = express.Router();

// Health check route
apiRouter.get('/health', (req: Request, res: Response) => {
  logger.info('Performing system health evaluation');
  sendSuccess(res, {
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Test error route to verify structure of error responses
apiRouter.get('/test-error', () => {
  logger.warn('Triggering intentional test exception');
  throw new AppError('This is an intentional test error to check format standards', 400, 'TEST_ERROR', {
    parameter: 'test_param',
    issue: 'Validation simulated successfully',
  });
});

app.use('/api/v1', apiRouter);

// Catch-all for undefined route paths (404)
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Endpoint not found: ${req.method} ${req.originalUrl}`, 404, 'ENDPOINT_NOT_FOUND'));
});

// 4. Global Error handler middleware is wired last
app.use(errorHandlerMiddleware);

export default app;
