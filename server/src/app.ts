import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { requestIdMiddleware } from './middlewares/request-id.middleware';
import { errorHandlerMiddleware } from './middlewares/error.middleware';
import { sendSuccess } from './utils/response';
import logger from './utils/logger';

// Feature routers
import authRouter from './routes/auth.routes';
import leadRouter from './routes/lead.routes';
import followupRouter from './routes/followup.routes';
import aiRouter from './routes/ai.routes';

const app: Express = express();

// 1. Enable request ID context tracking immediately
app.use(requestIdMiddleware);

// 2. Wire transport & security middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log each incoming request route details
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

// 3. Define APIs under /api/v1
const apiRouter = express.Router();

// Register feature endpoints
apiRouter.use('/auth', authRouter);
apiRouter.use('/leads', leadRouter);
apiRouter.use('/follow-ups', followupRouter);
apiRouter.use('/ai', aiRouter);

// Health check route
apiRouter.get('/health', (req: Request, res: Response) => {
  logger.info('Performing system health evaluation');
  sendSuccess(res, {
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use('/api/v1', apiRouter);

// Catch-all for undefined route paths (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// 4. Global Error handler middleware is wired last
app.use(errorHandlerMiddleware);

export default app;
export { app };
