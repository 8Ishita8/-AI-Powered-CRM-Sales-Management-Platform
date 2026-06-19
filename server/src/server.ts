import env from './config/env'; // Asserts all required environment variables are present at startup
import app from './app';
import logger from './utils/logger';
import { connectDB, disconnectDB } from './config/db';
import { seedDefaultUsers } from './models/user.model';
import { redisConnection } from './config/redis';
import { initializeQueue } from './queues/scoring.queue';
import { initializeWorker } from './workers/scoring.worker';

const PORT = env.PORT;
const NODE_ENV = env.NODE_ENV;

async function bootstrap() {
  logger.info('[Bootstrap] Starting CRM Backend initialization...');

  // 1. Connect MongoDB
  await connectDB();

  // 2. Seed Default Users
  await seedDefaultUsers();

  // 3. Verify Redis connection for BullMQ background workers
  let redisOnline = false;
  try {
    await redisConnection.ping();
    logger.info('[Bootstrap] Redis connection verified successfully.');
    redisOnline = true;
  } catch (error) {
    logger.warn('[Bootstrap] Redis is offline. Operating in In-Memory Queue Simulation (No Redis Mode).');
  }

  // 4. Initialize scoring queue and background workers
  initializeQueue(redisOnline);
  initializeWorker(redisOnline);

  // 5. Start HTTP server
  const server = app.listen(PORT, () => {
    logger.info(`========================================================`);
    logger.info(` Server started in [${NODE_ENV}] mode on port ${PORT}`);
    logger.info(` Health endpoint: http://localhost:${PORT}/api/v1/health`);
    logger.info(`========================================================`);
  });

  // Handle graceful shutdown on process signals
  const handleGracefulShutdown = async (signal: string): Promise<void> => {
    logger.info(`Received ${signal}. Shutting down application gracefully...`);
    
    server.close(async () => {
      logger.info('HTTP server closed. Releasing resources.');

      // Close database connection
      await disconnectDB();

      // Close Redis connection
      try {
        await redisConnection.quit();
        logger.info('Redis connection closed.');
      } catch (err) {
        logger.error('Error closing Redis connection:', err);
      }

      logger.info('Cleanup finished. Exiting process.');
      process.exit(0);
    });

    // Enforce hard shutdown if connections take too long to close
    setTimeout(() => {
      logger.error('Graceful shutdown timed out. Forcing exit.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
}

bootstrap().catch((error) => {
  logger.error('CRITICAL: Fatal error during backend bootstrap phase:', error);
  process.exit(1);
});

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
