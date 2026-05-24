import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import { parseDocument, generateQuestionPaper } from './services/llmService';
import { QUEUE_NAME } from './services/queue';

const prisma = new PrismaClient();
const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

export function startWorker(io: any) {
  console.log(`Starting BullMQ Worker for ${QUEUE_NAME}`);

  const worker = new Worker(QUEUE_NAME, async (job: Job) => {
    const {
      assignmentId,
      filePath,
      mimeType,
      dueDate,
      classLevel,
      schoolName,
      totalQuestions,
      totalMarks,
      additionalInfo,
      questionTypes,
      isGuest
    } = job.data;

    try {
      // 1. Process document text
      const contextText = await parseDocument(filePath, mimeType);

      // 2. Generate questions using LLM
      const paperJson = await generateQuestionPaper(contextText, {
        dueDate,
        classLevel,
        schoolName,
        totalQuestions,
        totalMarks,
        additionalInfo,
        questionTypes
      });

      // 3. Update assignment in DB
      let updatedAssignment;
      if (!isGuest && assignmentId) {
        updatedAssignment = await prisma.assignment.update({
          where: { id: assignmentId },
          data: {
            status: 'COMPLETED',
            paperJson: JSON.stringify(paperJson)
          }
        });
      } else {
        updatedAssignment = {
          id: assignmentId,
          status: 'COMPLETED',
          paperJson: JSON.stringify(paperJson)
        };
      }

      // 4. Emit websocket event
      io.emit('job-completed', {
        jobId: job.id,
        assignmentId,
        paper: paperJson
      });

      return updatedAssignment;

    } catch (error: any) {
      console.error(`Job ${job.id} failed:`, error);
      
      if (!isGuest && assignmentId) {
        await prisma.assignment.update({
          where: { id: assignmentId },
          data: { status: 'FAILED' }
        });
      }

      let errorMessage = "Failed to generate paper";
      if (error?.message?.includes('Rate limit') || error?.status === 429) {
        errorMessage = "Daily AI generation limit reached for this premium model. Please try uploading the next document after some time.";
      }

      io.emit('job-failed', {
        jobId: job.id,
        assignmentId,
        error: errorMessage
      });

      throw error;
    }
  }, { connection });

  worker.on('completed', job => {
    console.log(`Job ${job.id} has completed!`);
  });

  worker.on('failed', (job, err) => {
    console.log(`Job ${job?.id} has failed with ${err.message}`);
  });

  return worker;
}
