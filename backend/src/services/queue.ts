import { Queue } from 'bullmq';
import IORedis from 'ioredis';

// Use a fallback URL if REDIS_URL is not set yet
const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
});

const queuePrefix = process.env.NODE_ENV === 'production' ? 'production' : 'development';
export const QUEUE_NAME = `${queuePrefix}-assignment-generation`;

export const assignmentQueue = new Queue(QUEUE_NAME, {
  connection
});
