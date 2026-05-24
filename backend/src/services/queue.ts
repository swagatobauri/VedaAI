import { Queue } from 'bullmq';
import IORedis from 'ioredis';

// Use a fallback URL if REDIS_URL is not set yet
const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
});

export const assignmentQueue = new Queue('assignment-generation', {
  connection
});
