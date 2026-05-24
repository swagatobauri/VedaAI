import Groq from 'groq-sdk';
import fs from 'fs';
import Tesseract from 'tesseract.js';

const pdfParse = require('pdf-parse');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function parseDocument(filePath: string, mimeType: string): Promise<string> {
  console.log(`Parsing document: ${filePath} (${mimeType})`);
  
  if (mimeType === 'application/pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } else if (mimeType.startsWith('image/')) {
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
    return text;
  }
  
  // Fallback for text files
  return fs.readFileSync(filePath, 'utf-8');
}

export async function generateQuestionPaper(
  contextText: string,
  params: {
    dueDate: string;
    subject: string;
    classLevel: string;
    schoolName: string;
    totalQuestions: number;
    totalMarks: number;
    additionalInfo: string;
    questionTypes: any[];
  }
) {
  // Truncate context to avoid token limits slowing down TTFT (approx 3500 tokens)
  const truncatedContext = contextText.substring(0, 15000);

  const prompt = `
You are an expert Teacher and AI Assistant named VedaAI. Your task is to generate a highly professional question paper based on the provided document context.

DOCUMENT CONTEXT:
"""
${truncatedContext}
"""

REQUIREMENTS:
- Time Allowed: 45 minutes
- Maximum Marks: ${params.totalMarks}
- Total Questions: ${params.totalQuestions}
- Subject: ${params.subject}
- Class/Grade: ${params.classLevel}
- School/Institution: ${params.schoolName}
- Additional Instructions: ${params.additionalInfo || 'None'}
- Question Breakdown:
${params.questionTypes.map((q: any) => `  - ${q.questions}x ${q.type} (${q.marks} marks each)`).join('\n')}
- IMPORTANT: You MUST generate the exact number of questions requested.
- IMPORTANT: You MUST provide an answer in the "answerKey" array for EVERY SINGLE question generated across all sections. Do not skip any answers.

OUTPUT FORMAT:
You MUST respond with a raw, valid JSON object containing exactly the following structure. Do NOT wrap it in markdown code blocks.
{
  "header": {
    "schoolName": "${params.schoolName}",
    "subject": "${params.subject}",
    "class": "${params.classLevel}",
    "timeAllowed": "45 minutes",
    "maximumMarks": ${params.totalMarks}
  },
  "instructions": "All questions are compulsory unless stated otherwise.",
  "sections": [
    {
      "title": "Section A",
      "subtitle": "Short Answer Questions",
      "instruction": "Attempt all questions. Each question carries marks as indicated.",
      "questions": [
        {
          "number": 1,
          "text": "[Easy] Define electroplating. Explain its purpose.",
          "marks": 2
        }
      ]
    }
  ],
  "answerKey": [
    {
      "number": 1,
      "answer": "Electroplating is the process of depositing a thin layer of metal..."
    }
  ]
}
`;

  console.log("Calling Groq LLM with prompt (length:", prompt.length, ")...");
  
  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful teaching assistant that only outputs valid JSON. Always complete the entire generation without cutting off.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.2,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error("Groq API Error:", error);
    throw error;
  }
}
