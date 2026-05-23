"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Calendar, CloudUpload, Mic, Minus, Plus, X, ChevronDown, FileText } from "lucide-react";

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
  onGenerateSuccess?: (paperPayload: any) => void;
}

export function CreateAssignment({ onGenerateSuccess }: CreateAssignmentProps) {
  const [dueDate, setDueDate] = useState("");
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

  const handleNext = async () => {
    try {
      setIsGenerating(true);
      let uploadedFilename = null;

      // 1. Upload File if present
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        
        console.log("Uploading file to backend...");
        const uploadRes = await fetch("http://localhost:4000/api/upload", {
          method: "POST",
          body: formData,
        });
        
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedFilename = uploadData.filename;
          console.log("File uploaded successfully:", uploadedFilename);
        } else {
          console.error("File upload failed");
        }
      }

      // 2. Submit form data
      const payload = {
        file: uploadedFilename || null,
        dueDate,
        questionTypes,
        totalQuestions,
        totalMarks,
        additionalInfo
      };

      console.log("Sending generation request with payload:", payload);
      
      const generateRes = await fetch("http://localhost:4000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (generateRes.ok) {
        const result = await generateRes.json();
        console.log("Backend response:", result);
        if (onGenerateSuccess) {
          onGenerateSuccess(result.paper);
        }
      } else {
        const errorText = await generateRes.text();
        console.error("Failed to generate assignment:", errorText);
        alert("Error sending request to backend: " + errorText);
      }

    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Network error: Could not connect to backend.");
    } finally {
      setIsGenerating(false);
    }
  };

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
      <div className="bg-white rounded-[24px] p-8 shadow-sm mt-8 w-full max-w-[900px] mx-auto">
        
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
      <div className="flex items-center justify-between w-full max-w-[900px] mx-auto mt-8">
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

    </div>
  );
}
