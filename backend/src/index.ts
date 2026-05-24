import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import * as admin from 'firebase-admin';
import jwt from 'jsonwebtoken';
import { requireAuth, AuthRequest } from './middleware/authMiddleware';
import { parseDocument, generateQuestionPaper } from './services/llmService';
import authRoutes from './routes/authRoutes';
import { groupRouter } from './routes/groupRoute';
import { sendAssignmentEmails } from './services/emailService';
import { assignmentQueue } from './services/queue';
import { startWorker } from './worker';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ["GET", "POST"]
  }
});

// Start the background worker
startWorker(io);
export const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_dev';

try {
  if (!admin.apps.length) {
    const serviceAccountPath = path.resolve(__dirname, '../firebase-service-account.json');
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      console.warn("firebase-service-account.json not found. Google Auth will fail.");
    }
  }
} catch (e) {
  console.log("Firebase admin initialization warning:", e);
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Mount Auth Routes
app.use('/api/auth', authRoutes);

// Setup Multer for file uploads
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'VedaAI Backend is running!' });
});

// 1. Handle File Upload (RAG ingestion prep)
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Here we would eventually process the file for RAG
  console.log(`[File Uploaded] ${req.file.originalname} saved to ${req.file.path}`);
  
  res.json({ 
    message: 'File uploaded successfully', 
    filename: req.file.filename,
    path: req.file.path
  });
});




// Create assignment and upload document
app.post('/api/generate', requireAuth, upload.single('document'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, dueDate, totalMarks, totalQuestions, additionalInfo, questionTypes } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: 'Document is required' });
      return;
    }

    const parsedQuestionTypes = JSON.parse(questionTypes);
    const parsedTotalMarks = parseInt(totalMarks);
    const parsedTotalQuestions = parseInt(totalQuestions);

    // Save document to DB (skip if guest)
    let documentId = null;
    if (!req.isGuest && req.user) {
      const document = await prisma.document.create({
        data: {
          filename: file.originalname,
          filepath: file.path,
          mimeType: file.mimetype,
          size: file.size,
          userId: req.user.userId
        }
      });
      documentId = document.id;
    }

    // Create an initial draft assignment (skip if guest)
    let assignment = null;
    if (!req.isGuest && req.user) {
      assignment = await prisma.assignment.create({
        data: {
          title,
          dueDate,
          totalMarks: parsedTotalMarks,
          status: 'GENERATING',
          userId: req.user.userId
        }
      });
    }

    // Enqueue the background job
    const job = await assignmentQueue.add('generate-paper', {
      assignmentId: assignment?.id || `guest-${Date.now()}`,
      filePath: file.path,
      mimeType: file.mimetype,
      dueDate,
      totalQuestions: parsedTotalQuestions,
      totalMarks: parsedTotalMarks,
      additionalInfo,
      questionTypes: parsedQuestionTypes,
      isGuest: req.isGuest
    });

    res.json({ message: "Job queued", jobId: job.id, assignmentId: assignment?.id });
  } catch (error) {
    console.error('Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate assignment' });
  }
});

// Get all assignments
app.get('/api/assignments', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.isGuest) {
      res.json([]);
      return;
    }

    const assignments = await prisma.assignment.findMany({
      where: { userId: req.user?.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// Delete an assignment
app.delete('/api/assignments/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.isGuest) {
      res.status(403).json({ error: 'Guests cannot delete' });
      return;
    }

    const id = req.params.id as string;
    
    const assignment = await prisma.assignment.findUnique({ where: { id } });
    if (!assignment || assignment.userId !== req.user?.userId) {
      res.status(404).json({ error: 'Assignment not found or unauthorized' });
      return;
    }

    await prisma.assignment.delete({
      where: { id }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

app.use('/api/groups', groupRouter);

// Send an assignment to a group
app.post('/api/assignments/:id/send', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.isGuest) {
      res.status(403).json({ error: 'Guests cannot send assignments' });
      return;
    }

    const assignmentId = req.params.id as string;
    const { groupId } = req.body;

    if (!groupId) {
      res.status(400).json({ error: 'Group ID is required' });
      return;
    }

    const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
    if (!assignment || assignment.userId !== req.user?.userId) {
      res.status(404).json({ error: 'Assignment not found or unauthorized' });
      return;
    }

    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group || group.userId !== req.user?.userId) {
      res.status(404).json({ error: 'Group not found or unauthorized' });
      return;
    }

    // In a production app, we'd generate a PDF here, but for now we'll simulate sending
    // an email with a mock PDF buffer or a text format of the JSON.
    const emails = JSON.parse(group.emails);
    
    // Create a mock buffer (in real app: convert assignment.paperJson to PDF buffer)
    const mockPdfBuffer = Buffer.from("Mock PDF Content - " + assignment.title);

    await sendAssignmentEmails(
      emails,
      group.name,
      assignment.title,
      (req.user as any)?.name || "Teacher",
      mockPdfBuffer
    );

    res.json({ success: true, message: `Sent to ${emails.length} students` });
  } catch (error) {
    console.error('Error sending assignment:', error);
    res.status(500).json({ error: 'Failed to send assignment' });
  }
});
server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
