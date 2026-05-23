import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

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

import { parseDocument, generateQuestionPaper } from './services/llmService';

// 2. Handle Generation Request
app.post('/api/generate', async (req, res) => {
  const { file, dueDate, questionTypes, totalQuestions, totalMarks, additionalInfo } = req.body;
  
  console.log('\n--- Received Generation Request ---');
  console.log(`Due Date: ${dueDate}`);
  console.log(`Total Questions: ${totalQuestions} | Total Marks: ${totalMarks}`);
  if (file) console.log(`Attached File: ${file}`);
  console.log('-----------------------------------\n');

  try {
    let contextText = "No context provided. Generate a generic assignment based on the instructions.";
    
    // Find the uploaded file physically
    if (file) {
      const allUploads = fs.readdirSync(uploadDir);
      const matchedFile = allUploads.find(f => f.endsWith(file));
      if (matchedFile) {
        const filePath = path.join(uploadDir, matchedFile);
        const mimeType = matchedFile.endsWith('.pdf') ? 'application/pdf' : 'image/png';
        contextText = await parseDocument(filePath, mimeType);
        console.log(`Successfully extracted ${contextText.length} characters of context.`);
      }
    }

    // Call Groq LLM
    const generatedPaperJson = await generateQuestionPaper(contextText, {
      dueDate,
      totalQuestions,
      totalMarks,
      additionalInfo,
      questionTypes
    });

    // Save to DB (include the full paper JSON)
    const savedAssignment = await prisma.assignment.create({
      data: {
        title: generatedPaperJson.header?.subject 
          ? generatedPaperJson.header.subject + " Assignment"
          : "Generated Assignment",
        dueDate: dueDate || "Pending",
        totalMarks: totalMarks,
        status: "GENERATED",
        paperJson: JSON.stringify(generatedPaperJson)
      }
    });

    res.json({ 
      message: 'Generation complete',
      assignment: savedAssignment,
      paper: generatedPaperJson
    });

  } catch (error: any) {
    console.error("Generation error:", error?.message || error);
    res.status(500).json({ error: 'Failed to generate assignment' });
  }
});

// 3. List all Assignments
app.get('/api/assignments', async (req, res) => {
  try {
    const assignments = await prisma.assignment.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(assignments);
  } catch (error: any) {
    console.error("List error:", error?.message || error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// 4. Delete an Assignment
app.delete('/api/assignments/:id', async (req, res) => {
  try {
    await prisma.assignment.delete({ where: { id: req.params.id } });
    res.json({ message: 'Assignment deleted' });
  } catch (error: any) {
    console.error("Delete error:", error?.message || error);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n🚀 Backend Server running on http://localhost:${PORT}`);
});
