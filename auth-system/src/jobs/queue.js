import { Queue } from 'bullmq';
import { redisClient } from '../config/redis.js';
import dotenv from 'dotenv';

dotenv.config();

const droneDataQueue = new Queue('drone-data-queue', {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
    // If authentication is needed, provide password or username
  }
});

// Example consumer
// In real usage, create a separate worker process to handle queue jobs
const processDroneData = async (job) => {
  // business logic goes here
  console.log('Processing job data:', job.data);

  // e.g., call a verification service
};

droneDataQueue.on('completed', (job) => {
  console.log(`Job with ID ${job.id} has been completed`);
});

droneDataQueue.on('failed', (job, err) => {
  console.error(`Job with ID ${job.id} has failed with ${err.message}`);
});

export { droneDataQueue, processDroneData };
