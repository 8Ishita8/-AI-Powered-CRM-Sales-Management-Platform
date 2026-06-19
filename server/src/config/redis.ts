import Redis, { RedisOptions } from 'ioredis';
import env from './env';
import logger from '../utils/logger';

// Parse host, port, and credentials from connection URL
const parsedUrl = new URL(env.REDIS_URL);

/**
 * Shared configuration options object.
 * NOTE: BullMQ requires 'maxRetriesPerRequest: null' to be set.
 */
export const redisConnectionConfig: RedisOptions = {
  host: parsedUrl.hostname,
  port: parseInt(parsedUrl.port || '6379'),
  username: parsedUrl.username || undefined,
  password: parsedUrl.password || undefined,
  maxRetriesPerRequest: null,
};

// Instantiate the default Redis client connection
const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

redis.on('connect', () => {
  logger.info('Redis client connection successfully established.');
});

redis.on('error', (error) => {
  logger.error('Redis connection client encountered an error:', {
    message: error.message,
    stack: error.stack,
  });
});

export default redis;
