import fs from 'fs';
import path from 'path';
import { io } from 'socket.io-client';

const API_BASE = 'http://localhost:4000';

async function runTests() {
  console.log("🚀 Starting Automated Integration Tests for VedaAI...");

  // 1. Test /api/health
  try {
    const healthRes = await fetch(`${API_BASE}/api/health`);
    if (!healthRes.ok) throw new Error("Health check failed");
    const healthData = await healthRes.json();
    console.log("✅ Health check passed:", healthData);
  } catch (error: any) {
    console.error("❌ Health check failed:", error.message);
    process.exit(1);
  }

  // Create a temporary test document
  const testDocPath = path.join(__dirname, '../test-source.txt');
  fs.writeFileSync(testDocPath, "Electric current is a flow of electric charge. In electric circuits this charge is often carried by moving electrons in a wire. It can also be carried by ions in an electrolyte, or by both ions and electrons such as in an ionised gas.", "utf-8");

  // 2. Setup Socket.io connection
  const socket = io(API_BASE);

  let jobCompletedPromise = new Promise<{ jobId: string; paper: any }>((resolve, reject) => {
    const timeout = setTimeout(() => {
      socket.disconnect();
      reject(new Error("Timeout: Job did not complete in 30 seconds"));
    }, 30000);

    socket.on('connect', () => {
      console.log("🔌 Connected to WebSocket server");
    });

    socket.on('job-completed', (data: any) => {
      console.log("🔔 WebSocket received job-completed:", data.jobId);
      clearTimeout(timeout);
      socket.disconnect();
      resolve(data);
    });

    socket.on('job-failed', (data: any) => {
      console.log("❌ WebSocket received job-failed:", data);
      clearTimeout(timeout);
      socket.disconnect();
      reject(new Error(data.error || "Job failed"));
    });
  });

  // 3. Trigger Assignment Generation via Guest Flow
  try {
    const formData = new FormData();
    const fileBuffer = fs.readFileSync(testDocPath);
    const fileBlob = new Blob([fileBuffer], { type: 'text/plain' });
    formData.append('document', fileBlob, 'test-source.txt');
    formData.append('title', 'Physics Electric Current Quiz');
    formData.append('dueDate', '2026-06-01');
    formData.append('totalMarks', '20');
    formData.append('totalQuestions', '2');
    formData.append('additionalInfo', 'Keep it simple.');
    formData.append('questionTypes', JSON.stringify([
      { type: 'Multiple Choice Questions', questions: 1, marks: 10 },
      { type: 'Short Questions', questions: 1, marks: 10 }
    ]));
    formData.append('subject', 'Physics');
    formData.append('classLevel', '10th Grade');

    console.log("📤 Sending generate request (Guest Mode)...");
    const response = await fetch(`${API_BASE}/api/generate`, {
      method: 'POST',
      headers: {
        'Authorization': 'Guest test-guest-token'
      },
      body: formData
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Generate request failed: ${response.statusText} - ${errText}`);
    }

    const initData = await response.json();
    console.log("✅ Generate request accepted, job queued:", initData);

    const { jobId } = initData;

    console.log(`⏳ Waiting for background job ${jobId} to complete via WebSocket...`);
    const completedJob = await jobCompletedPromise;

    if (completedJob.jobId !== jobId) {
      throw new Error(`Mismatched jobId: expected ${jobId}, got ${completedJob.jobId}`);
    }

    const { paper } = completedJob;
    console.log("📄 Generated Paper Header:", paper.header);

    // Assertions on the paper JSON structure
    if (!paper.header || typeof paper.header !== 'object') {
      throw new Error("Missing header in generated paper JSON");
    }
    if (paper.header.subject !== 'Physics') {
      throw new Error(`Incorrect subject: expected Physics, got ${paper.header.subject}`);
    }
    if (paper.header.class !== '10th Grade') {
      throw new Error(`Incorrect class: expected 10th Grade, got ${paper.header.class}`);
    }
    if (!paper.sections || !Array.isArray(paper.sections) || paper.sections.length === 0) {
      throw new Error("Missing or empty sections list in generated paper JSON");
    }
    if (!paper.answerKey || !Array.isArray(paper.answerKey) || paper.answerKey.length === 0) {
      throw new Error("Missing or empty answerKey list in generated paper JSON");
    }

    console.log("✨ Assertions passed successfully!");
    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!");

    // Clean up
    if (fs.existsSync(testDocPath)) {
      fs.unlinkSync(testDocPath);
    }
    process.exit(0);

  } catch (error: any) {
    console.error("❌ Test Failed:", error.message);
    if (fs.existsSync(testDocPath)) {
      fs.unlinkSync(testDocPath);
    }
    process.exit(1);
  }
}

runTests();
