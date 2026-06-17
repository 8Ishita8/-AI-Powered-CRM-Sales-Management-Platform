import express, { Request, Response, NextFunction } from 'express';
import { aiRouter } from './routes/ai.routes';

const app = express();

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Register API Routes
// Mounts the health check (at /health) and AI analysis/email endpoints
app.use('/', aiRouter);

// Catch-all route for unhandled paths
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Centralized Error Handler] Unexpected error occurred:', err);

  const statusCode = err.status || 500;
  const message = err.message || 'An unexpected internal server error occurred.';

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

export default app;
export { app };
