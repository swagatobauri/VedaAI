"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { ArrowLeft, ArrowRight, Calendar, CloudUpload, Mic, Minus, Plus, X, ChevronDown, FileText, Loader2, FileSearch, BrainCircuit, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { io } from "socket.io-client";
interface QuestionTypeRow {
  id: string;
  type: string;
  questions: number;
  marks: number;
}

const QUESTION_TYPE_OPTIONS = [
  "Multiple Choice Questions",
  "Short Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "Long Answer Questions"
];

interface CreateAssignmentProps {
  onGenerateSuccess?: (assignment: any, paper: any) => void;
}

export function CreateAssignment({ onGenerateSuccess }: CreateAssignmentProps) {
  const [dueDate, setDueDate] = useState("");
  const [subject, setSubject] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [questionTypes, setQuestionTypes] = useState<QuestionTypeRow[]>([
    { id: "1", type: "Multiple Choice Questions", questions: 4, marks: 1 },
    { id: "2", type: "Short Questions", questions: 3, marks: 2 },
    { id: "3", type: "Diagram/Graph-Based Questions", questions: 5, marks: 5 },
    { id: "4", type: "Numerical Problems", questions: 5, marks: 5 },
  ]);

  const totalQuestions = questionTypes.reduce((acc, row) => acc + row.questions, 0);
  const totalMarks = questionTypes.reduce((acc, row) => acc + (row.questions * row.marks), 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddQuestionType = () => {
    setQuestionTypes([
      ...questionTypes,
      { id: Date.now().toString(), type: QUESTION_TYPE_OPTIONS[0], questions: 1, marks: 1 }
    ]);
  };

  const handleRemoveQuestionType = (id: string) => {
    setQuestionTypes(questionTypes.filter(q => q.id !== id));
  };

  const handleUpdateRow = (id: string, field: keyof QuestionTypeRow, value: any) => {
    setQuestionTypes(questionTypes.map(q => {
      if (q.id === id) {
        return { ...q, [field]: value };
      }
      return q;
    }));
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setGenerationStep((prev) => (prev < 2 ? prev + 1 : prev));
      }, 3500); // Progress steps roughly every 3.5 seconds, but wait at step 2 for WebSocket
    } else {
      setGenerationStep(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleNext = async () => {
    try {
      if (!selectedFile) {
        alert("Please upload a document first.");
        return;
      }
      setIsGenerating(true);

      const formData = new FormData();
      const documentTitle = selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "") : "Untitled Assignment";
      formData.append('document', selectedFile);
      formData.append('title', documentTitle);
      formData.append('dueDate', dueDate);
      formData.append('subject', subject);
      formData.append('classLevel', classLevel);
      formData.append('totalQuestions', String(totalQuestions));
      formData.append('totalMarks', String(totalMarks));
      formData.append('additionalInfo', additionalInfo);
      formData.append('questionTypes', JSON.stringify(questionTypes));

      const token = Cookies.get("token");
      const isGuest = Cookies.get("isGuest");
      const authHeader = token ? `Bearer ${token}` : isGuest === "true" ? "Guest" : "";

      const generateRes = await fetch("/api/generate", {
        method: "POST",
        headers: {
          Authorization: authHeader,
          'X-Veda-Auth': authHeader
        },
        body: formData
      });

      if (generateRes.ok) {
        const result = await generateRes.json();
        console.log("Job Queued:", result);

        // Connect to WebSocket to listen for job completion
        const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000");

        socket.on("job-completed", (data: any) => {
          if (data.jobId === result.jobId) {
            setGenerationStep(3); // Final step
            setTimeout(() => {
              setIsGenerating(false);
              if (onGenerateSuccess) {
                onGenerateSuccess({ id: data.assignmentId }, data.paper);
              }
              socket.disconnect();
            }, 1000);
          }
        });

        socket.on("job-failed", (data: any) => {
          if (data.jobId === result.jobId) {
            setIsGenerating(false);
            alert(data.error || "VedaAI failed to generate this document. Please try again.");
            socket.disconnect();
          }
        });

      } else {
        const errorText = await generateRes.text();
        console.error("Failed to generate assignment:", errorText);
        alert("Error sending request to backend: " + errorText);
        setIsGenerating(false);
      }

    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Network error: Could not connect to backend.");
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    const steps = [
      { icon: <CloudUpload size={24} className="text-orange-500" />, title: "Uploading Document", desc: "Securely transferring your file to the server." },
      { icon: <FileSearch size={24} className="text-blue-500" />, title: "Extracting Content", desc: "Reading and understanding the text using OCR and parsers." },
      { icon: <BrainCircuit size={24} className="text-purple-500" />, title: "AI is Crafting Questions", desc: "VedaAI is analyzing the context to generate high-quality questions." },
      { icon: <CheckCircle2 size={24} className="text-green-500" />, title: "Formatting Paper", desc: "Structuring your customized question paper perfectly." }
    ];

    return (
      <div className="w-full max-w-[900px] mx-auto min-h-[500px] flex flex-col items-center justify-center pt-20 px-4">
        <div className="bg-white rounded-[32px] p-10 shadow-xl w-full max-w-[600px] flex flex-col items-center relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-blue-500 to-purple-500"></div>

          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
            <Loader2 size={36} className="text-orange-500 animate-spin absolute" />
            <BrainCircuit size={20} className="text-gray-900" />
          </div>

          <h2 className="text-[24px] font-bold text-gray-900 font-[family-name:var(--font-bricolage)] mb-2 text-center">
            Creating Your Assignment
          </h2>
          <p className="text-[14px] text-gray-500 mb-10 text-center max-w-[400px]">
            Please wait while VedaAI analyzes your document and generates a highly professional question paper. This may take up to 30 seconds.
          </p>

          <div className="w-full space-y-4">
            {steps.map((step, index) => {
              const isActive = index === generationStep;
              const isPast = index < generationStep;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ${isActive ? 'bg-gray-50 border border-gray-100 scale-100 opacity-100 shadow-sm' : isPast ? 'opacity-60 scale-95 grayscale' : 'opacity-30 scale-95 grayscale'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                    {isPast ? <CheckCircle2 size={24} className="text-green-500" /> : step.icon}
                  </div>
                  <div>
                    <h4 className={`font-bold text-[15px] ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>{step.title}</h4>
                    <p className="text-[12px] text-gray-500 mt-0.5">{step.desc}</p>
                  </div>
                  {isActive && (
                    <div className="ml-auto flex gap-1">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1100px] mx-auto min-h-[500px] pb-[140px] px-4 md:px-0 pt-6">

      {/* Title Area */}
      <div className="flex flex-col gap-1 px-[8px]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <h2 className="text-[20px] font-bold text-gray-900 font-[family-name:var(--font-bricolage)]">Create Assignment</h2>
        </div>
        <p className="text-[13px] text-gray-400 font-medium">Set up a new assignment for your students</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 mt-6 px-[8px]">
        <div className="h-1 bg-gray-800 rounded-full w-[30%]"></div>
        <div className="h-1 bg-gray-200 rounded-full flex-1"></div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-[24px] p-5 md:p-8 shadow-sm mt-8 w-full max-w-[900px] mx-auto">

        <h3 className="text-[18px] font-bold text-gray-900 font-[family-name:var(--font-bricolage)]">Assignment Details</h3>
        <p className="text-[13px] text-gray-400 font-medium mt-1">Basic information about your assignment</p>

        {/* Upload Area */}
        <label className="mt-6 border-2 border-dashed border-gray-200 rounded-[16px] h-[180px] flex flex-col items-center justify-center gap-3 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer relative overflow-hidden">
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf"
          />
          {selectedFile ? (
            <div className="flex flex-col items-center gap-2">
              <FileText size={32} className="text-green-500" />
              <span className="font-bold text-gray-900 text-[14px]">{selectedFile.name}</span>
              <span className="text-[12px] text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          ) : (
            <>
              <CloudUpload size={28} className="text-gray-900" />
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-900 text-[14px]">Choose a file or drag & drop it here</span>
                <span className="text-[12px] text-gray-400 mt-1">JPEG, PNG, PDF upto 10MB</span>
              </div>
              <div className="bg-gray-100 text-gray-700 text-[12px] font-bold px-4 py-1.5 rounded-full mt-2">
                Browse Files
              </div>
            </>
          )}
        </label>
        <p className="text-center text-[12px] text-gray-500 mt-3 font-medium">Upload images of your preferred document/image</p>

        {/* Due Date */}
        <div className="mt-8">
          <label className="block text-[14px] font-bold text-gray-900 mb-3">Due Date</label>
          <div className="relative flex items-center w-full">
            <input
              type="text"
              placeholder="DD-MM-YYYY"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full h-[46px] px-4 border border-gray-200 rounded-full text-[14px] text-gray-900 focus:outline-none focus:border-gray-300 placeholder-gray-400"
            />
            <Calendar size={18} className="absolute right-4 text-gray-900" />
          </div>
        </div>

        {/* Subject & Class */}
        <div className="mt-8 flex gap-4 w-full">
          <div className="flex-1">
            <label className="block text-[14px] font-bold text-gray-900 mb-3">Subject</label>
            <input
              type="text"
              placeholder="e.g. Science, Mathematics"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full h-[46px] px-4 border border-gray-200 rounded-[16px] text-[14px] text-gray-900 focus:outline-none focus:border-gray-300 placeholder-gray-400"
            />
          </div>
          <div className="flex-1">
            <label className="block text-[14px] font-bold text-gray-900 mb-3">Class / Grade</label>
            <input
              type="text"
              placeholder="e.g. 5th Grade, High School"
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
              className="w-full h-[46px] px-4 border border-gray-200 rounded-[16px] text-[14px] text-gray-900 focus:outline-none focus:border-gray-300 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Question Type */}
        <div className="mt-10">

          <div className="flex justify-between items-center mb-4">
            <label className="text-[14px] font-bold text-gray-900">Question Type</label>
            <div className="flex gap-[40px] text-[13px] text-gray-900 font-medium pr-4">
              <span>No. of Questions</span>
              <span>Marks</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {questionTypes.map((row) => (
              <div key={row.id} className="flex items-center gap-4">
                <div className="relative flex-1">
                  <select
                    value={row.type}
                    onChange={(e) => handleUpdateRow(row.id, "type", e.target.value)}
                    className="w-full h-[46px] px-5 border border-gray-100 rounded-full text-[14px] font-medium text-gray-900 appearance-none bg-white shadow-sm focus:outline-none"
                  >
                    {QUESTION_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>

                <button
                  onClick={() => handleRemoveQuestionType(row.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>

                {/* No. of Questions Counter */}
                <div className="flex items-center justify-between w-[90px] h-[40px] bg-gray-50 rounded-full px-3 border border-gray-100">
                  <button
                    onClick={() => handleUpdateRow(row.id, "questions", Math.max(1, row.questions - 1))}
                    className="text-gray-400 hover:text-gray-900"
                  ><Minus size={14} /></button>
                  <span className="text-[14px] font-bold text-gray-900">{row.questions}</span>
                  <button
                    onClick={() => handleUpdateRow(row.id, "questions", row.questions + 1)}
                    className="text-gray-400 hover:text-gray-900"
                  ><Plus size={14} /></button>
                </div>

                {/* Marks Counter */}
                <div className="flex items-center justify-between w-[90px] h-[40px] bg-gray-50 rounded-full px-3 border border-gray-100">
                  <button
                    onClick={() => handleUpdateRow(row.id, "marks", Math.max(1, row.marks - 1))}
                    className="text-gray-400 hover:text-gray-900"
                  ><Minus size={14} /></button>
                  <span className="text-[14px] font-bold text-gray-900">{row.marks}</span>
                  <button
                    onClick={() => handleUpdateRow(row.id, "marks", row.marks + 1)}
                    className="text-gray-400 hover:text-gray-900"
                  ><Plus size={14} /></button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddQuestionType}
            className="flex items-center gap-2 mt-6 text-[13px] font-bold text-gray-900 hover:text-green-600 transition-colors"
          >
            <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center text-white">
              <Plus size={14} />
            </div>
            Add Question Type
          </button>

          <div className="flex flex-col items-end mt-4 text-[14px] font-bold text-gray-900 gap-1 pr-2">
            <span>Total Questions : {totalQuestions}</span>
            <span>Total Marks : {totalMarks}</span>
          </div>

        </div>

        {/* Additional Information */}
        <div className="mt-8">
          <label className="block text-[14px] font-bold text-gray-900 mb-3">Additional Information (For better output)</label>
          <div className="relative w-full h-[120px]">
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
              className="w-full h-full p-4 bg-gray-50 border border-dashed border-gray-200 rounded-[16px] text-[13px] text-gray-900 focus:outline-none placeholder-gray-400 resize-none"
            ></textarea>
            <button className="absolute bottom-4 right-4 text-gray-700 bg-gray-200/50 p-2 rounded-full hover:bg-gray-200 transition-colors">
              <Mic size={16} />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between w-full max-w-[900px] mx-auto mt-6">
        <button className="flex items-center gap-2 bg-white text-gray-900 h-[46px] px-6 rounded-full font-bold text-[14px] shadow-sm hover:bg-gray-50 transition-colors">
          <ArrowLeft size={16} strokeWidth={2.5} />
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={isGenerating}
          className={`flex items-center gap-2 bg-[#18181B] text-white h-[46px] px-8 rounded-full font-bold text-[14px] shadow-lg transition-colors ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black'}`}
        >
          {isGenerating ? 'Generating...' : 'Next'}
          {!isGenerating && <ArrowRight size={16} strokeWidth={2.5} />}
        </button>
      </div>

      {/* Spacer to guarantee scrollable gap under the buttons */}
      <div className="h-[120px] w-full flex-shrink-0"></div>

    </div>
  );
}
