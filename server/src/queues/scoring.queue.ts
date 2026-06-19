import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

// Initialize the BullMQ queue named 'lead-scoring' only if Redis is available
export let scoringQueue: Queue | null = null;
let isRedisActive = false;

/**
 * Initializes the BullMQ queue instance if Redis is verified online.
 * @param redisOnline - Boolean status of Redis connectivity
 */
export function initializeQueue(redisOnline: boolean) {
  isRedisActive = redisOnline;
  if (redisOnline && !scoringQueue) {
    try {
      scoringQueue = new Queue('lead-scoring', {
        connection: redisConnection,
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000, // 5 seconds initial backoff delay
          },
          removeOnComplete: true, // Remove completed jobs to save Redis memory
          removeOnFail: false,    // Retain failed jobs for analysis and debugging
        },
      });
      console.log('[Queue] BullMQ lead-scoring queue initialized.');
    } catch (error) {
      console.warn('[Queue] Failed to construct BullMQ queue. Using in-memory fallback.');
      isRedisActive = false;
    }
  }
}

/**
 * Queues a lead scoring/analysis job with idempotency.
 * If Redis is offline, it falls back to an in-memory setTimeout trigger.
 * 
 * @param leadId - The Mongoose Lead ObjectId as a string
 * @returns The created job instance (or mock job metadata)
 */
export async function queueLeadAnalysis(leadId: string) {
  const jobId = `lead-${leadId}`;
  
  if (isRedisActive && scoringQueue) {
    console.log(`[Queue] Adding lead analysis job to 'lead-scoring' queue. Job ID: ${jobId}`);
    return await scoringQueue.add(
      'analyze-lead-job',
      { leadId },
      {
        jobId, // Enforce idempotency
      }
    );
  } else {
    console.log(`[Queue] [In-Memory Mode] Redis is offline. Simulating async analysis for Lead ID: ${leadId}`);
    
    // Defer execution to run in the background (similar to a worker queue)
    setTimeout(async () => {
      try {
        // Dynamic require to prevent circular import issues
        const { processInMemoryJob } = require('../workers/scoring.worker');
        await processInMemoryJob(leadId);
      } catch (error) {
        console.error(`[Queue] [In-Memory Mode] Failed to process mock job:`, error);
      }
    }, 500);

    return { id: jobId, name: 'in-memory-mock-job' };
  }
}
export default scoringQueue;
