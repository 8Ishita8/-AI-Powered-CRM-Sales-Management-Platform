import dotenv from 'dotenv';
// Load environment variables before importing other files
dotenv.config();

import app from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { redisConnection } from './config/redis';

import { initializeQueue } from './queues/scoring.queue';
import { initializeWorker } from './workers/scoring.worker';

const port = process.env.PORT || 5000;

async function bootstrap() {
  console.log('[Bootstrap] Starting CRM AI Engine backend initialization...');

  // 1. Connect MongoDB
  await connectDatabase();

  // 2. Verify Redis is connected
  let redisOnline = false;
  try {
    // Simply check connection status or ping
    await redisConnection.ping();
    console.log('[Bootstrap] Redis connection verified successfully.');
    redisOnline = true;
  } catch (error) {
    console.warn('[Bootstrap] Redis is offline. Operating in In-Memory Queue Simulation (No Redis Mode).');
  }

  // 3. Initialize background jobs & workers
  initializeQueue(redisOnline);
  initializeWorker(redisOnline);

  // 3. Start Express server
  const server = app.listen(port, () => {
    console.log(`============================================`);
    console.log(`  CRM AI Engine Server running on port ${port}`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  Health Check: http://localhost:${port}/health`);
    console.log(`============================================`);
  });

  // Graceful shutdown handling
  const shutdown = async (signal: string) => {
    console.log(`\n[Shutdown] Received ${signal}. Starting graceful shutdown...`);

    server.close(async () => {
      console.log('[Shutdown] Express server stopped.');
      
      // Close database connection
      await connectDatabase().then(() => disconnectDatabase());

      // Close Redis connection
      try {
        await redisConnection.quit();
        console.log('[Shutdown] Redis connection closed.');
      } catch (err) {
        console.error('[Shutdown] Error closing Redis connection:', err);
      }

      console.log('[Shutdown] Cleanup finished. Exiting process.');
      process.exit(0);
    });

    // Enforce hard shutdown if connections take too long to close
    setTimeout(() => {
      console.error('[Shutdown] Graceful shutdown timed out. Forcing exit.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  console.error('[Bootstrap] Fatal error during bootstrap phase:', err);
  process.exit(1);
});
