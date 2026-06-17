import dotenv from 'dotenv';
// Load environment variables first
dotenv.config();

import app from './app';
import logger from './utils/logger';

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  logger.info(`========================================================`);
  logger.info(` Server started in [${NODE_ENV}] mode on port ${PORT}`);
  logger.info(` Health endpoint: http://localhost:${PORT}/api/v1/health`);
  logger.info(`========================================================`);
});

// Handle graceful shutdown on process signals
const handleGracefulShutdown = (signal: string): void => {
  logger.info(`Received ${signal}. Shutting down application gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed. Releasing process handles.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

// Catch any unhandled process-level exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('CRITICAL: Uncaught Exception detected!', {
    message: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  logger.error('CRITICAL: Unhandled Rejection detected!', {
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined,
  });
  process.exit(1);
});
