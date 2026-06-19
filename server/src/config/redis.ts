import Redis, { RedisOptions } from 'ioredis';
import env from './env';
import logger from '../utils/logger';

const redisUrl = env.REDIS_URL;

export let isRedisAvailable = true;

// Shared connection configuration options for BullMQ compatibility
const parsedUrl = new URL(redisUrl);
export const redisConnectionConfig: RedisOptions = {
  host: parsedUrl.hostname,
  port: parseInt(parsedUrl.port || '6379'),
  username: parsedUrl.username || undefined,
  password: parsedUrl.password || undefined,
  maxRetriesPerRequest: null, // BullMQ requires maxRetriesPerRequest to be null
  lazyConnect: true,
  retryStrategy(times) {
    if (times > 1) {
      isRedisAvailable = false;
      return null; // Stop retrying connection after first failure
    }
    return 100; // Retry once after 100ms
  },
};

// Instantiate the reusable Redis connection
export const redisConnection = new Redis(redisUrl, {
  ...redisConnectionConfig,
});

redisConnection.on('connect', () => {
  logger.info('Redis connection client successfully established.');
  isRedisAvailable = true;
});

redisConnection.on('error', (error) => {
  if (isRedisAvailable) {
    logger.warn('Redis connection failed. falling back to In-Memory Queue mode.');
    isRedisAvailable = false;
    redisConnection.disconnect(); // Terminate reconnect attempts
  }
});

// Alias for generic redis client imports
export const redis = redisConnection;
export default redis;
