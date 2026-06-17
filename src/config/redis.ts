import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export let isRedisAvailable = true;

// Export a reusable Redis client connection with fast failure limits
export const redisConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null, // BullMQ requires maxRetriesPerRequest to be null
  lazyConnect: true,          // Allow lazy connection verification
  showFriendlyStackOnRejection: true,
  retryStrategy(times) {
    if (times > 1) {
      isRedisAvailable = false;
      return null; // Stop retrying connection
    }
    return 100; // Retry once after 100ms
  },
});

redisConnection.on('connect', () => {
  console.log('[Redis] Reusable Redis connection established.');
  isRedisAvailable = true;
});

redisConnection.on('error', (error) => {
  if (isRedisAvailable) {
    console.warn('[Redis] Connection refused. Falling back to In-Memory Queue Simulation (No Redis Mode).');
    isRedisAvailable = false;
    // Disconnect to stop further socket reconnection loops
    redisConnection.disconnect();
  }
});
