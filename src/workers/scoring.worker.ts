import { Worker, Job } from 'bullmq';
import { redisConnection, isRedisAvailable } from '../config/redis';
import { buildLeadContext } from '../modules/ai/context-builder';
import { AIService } from '../modules/ai/ai.service';
import { Lead } from '../modules/lead/lead.model';

const aiService = new AIService();

// Core processing logic shared by both BullMQ and in-memory execution
export async function executeScoringJob(leadId: string, jobId: string) {
  console.log(`[Worker] Processing Job ID: ${jobId} for Lead ID: ${leadId}`);

  try {
    // 1. Build Lead Context from database (Lead, Activities, FollowUps)
    const context = await buildLeadContext(leadId);

    // 2. Perform AI Lead Analysis (runs Gemini, validates schema, handles repair and fallbacks)
    const analysisResult = await aiService.analyzeLead(context);

    // 3. Update Mongoose Lead document with results
    const updatedLead = await Lead.findByIdAndUpdate(
      leadId,
      {
        conversionScore: analysisResult.conversion_score,
        aiAnalysisSummary: analysisResult.summary,
        probabilityClass: analysisResult.probability_class,
        nextBestAction: analysisResult.next_best_action,
      },
      { new: true }
    );

    if (!updatedLead) {
      throw new Error(`Lead document not found in MongoDB during update.`);
    }

    console.log(`[Worker] Job Success. Job ID: ${jobId}, Lead ID: ${leadId}, New Score: ${analysisResult.conversion_score}`);
    return {
      success: true,
      leadId,
      score: analysisResult.conversion_score,
      class: analysisResult.probability_class,
    };

  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error(`[Worker] Job Error. Job ID: ${jobId}, Lead ID: ${leadId}, Error: ${errorMessage}`);
    
    // Rethrow to let BullMQ handle retry attempts and backoff
    throw error;
  }
}

/**
 * Direct execution endpoint for in-memory queue simulation.
 */
export async function processInMemoryJob(leadId: string) {
  const jobId = `in-memory-${leadId}`;
  return await executeScoringJob(leadId, jobId);
}

// Create and export the BullMQ Worker conditionally
export let scoringWorker: Worker | null = null;

/**
 * Initializes the BullMQ Worker listening to the lead-scoring queue if Redis is online.
 * @param redisOnline - Boolean status of Redis connectivity
 */
export function initializeWorker(redisOnline: boolean) {
  if (redisOnline && !scoringWorker) {
    try {
      scoringWorker = new Worker(
        'lead-scoring',
        async (job: Job) => {
          const { leadId } = job.data;
          const jobId = job.id || 'unknown';
          return await executeScoringJob(leadId, jobId);
        },
        {
          connection: redisConnection,
          concurrency: 5, // Process up to 5 jobs in parallel
        }
      );

      // Listeners for monitoring worker events
      scoringWorker.on('completed', (job) => {
        console.log(`[Worker Listener] Job ${job.id} has completed.`);
      });

      scoringWorker.on('failed', (job, err) => {
        const leadId = job?.data?.leadId || 'unknown';
        console.error(`[Worker Listener] Job ${job?.id || 'unknown'} for Lead: ${leadId} failed permanently. Details: ${err.message}`);
      });

      scoringWorker.on('error', (err) => {
        console.error('[Worker Listener] A connection or general worker error occurred:', err);
      });
      console.log('[Worker] BullMQ lead-scoring worker initialized.');
    } catch (error) {
      console.warn('[Worker] Failed to construct BullMQ worker. Using in-memory fallback.');
    }
  } else if (!redisOnline) {
    console.log('[Worker] Redis is offline. BullMQ worker disabled (In-Memory Queue Simulation active).');
  }
}
