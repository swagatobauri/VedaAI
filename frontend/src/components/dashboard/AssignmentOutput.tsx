import { Download } from "lucide-react";

interface AssignmentOutputProps {
  onBack: () => void;
  paper: any;
}

export function AssignmentOutput({ onBack, paper }: AssignmentOutputProps) {
  
  const handlePrint = () => {
    window.print();
  };

  if (!paper || !paper.header) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-gray-500">Generating your assignment...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1100px] mx-auto min-h-[500px] pb-[140px] px-4 md:px-0 pt-6 print:max-w-full print:pb-0 print:px-0 print:pt-0">
      
      {/* Top Header Card (Hidden during print) */}
      <div className="print:hidden bg-[#18181B] rounded-[24px] p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex-1">
          <p className="text-[14px] leading-relaxed font-medium text-gray-200">
            Certainly! Here is your customized Question Paper for {paper.header.subject} {paper.header.class} based on your instructions.
          </p>
        </div>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-white text-[#18181B] h-[40px] px-5 rounded-full font-bold text-[13px] hover:bg-gray-100 transition-colors shrink-0"
        >
          <Download size={16} strokeWidth={2.5} />
          Download as PDF
        </button>
      </div>

      {/* The Document — pixel-perfect A4 style */}
      <div className="document-container w-full max-w-[794px] mx-auto bg-[#D6DCE4] shadow-lg font-serif text-black print:shadow-none print:max-w-full print:bg-[#D6DCE4]">
        
        {/* School Header Banner */}
        <div className="relative bg-[#D6DCE4] px-[50px] pt-[30px] pb-[20px]">
          {/* Teacher badge */}
          <div className="absolute top-[12px] left-[12px] bg-[#5B4A9E] text-white text-[11px] font-bold px-3 py-1.5 rounded-md shadow-md z-10">
            VedaAI Generated
          </div>
          
          <div className="text-center pt-[20px]">
            <h1 className="text-[24px] font-bold leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              {paper.header.schoolName}
            </h1>
            <h2 className="text-[17px] font-bold mt-1">Subject: {paper.header.subject}</h2>
            <h3 className="text-[16px] font-bold">Class: {paper.header.class}</h3>
          </div>
        </div>

        {/* Document Body */}
        <div className="bg-white mx-0 px-[50px] py-[30px]">
          
          {/* Time & Marks */}
          <div className="flex justify-between items-center text-[14px] font-bold mb-5">
            <span>Time Allowed: {paper.header.timeAllowed}</span>
            <span>Maximum Marks: {paper.header.maximumMarks}</span>
          </div>

          {/* General Instructions */}
          <p className="text-[14px] font-bold mb-6">
            {paper.instructions}
          </p>

          {/* Student Info Fields */}
          <div className="flex flex-col gap-2 text-[14px] mb-8">
            <div className="flex items-baseline gap-1">
              <span className="font-bold">Name:</span>
              <span className="flex-1 border-b border-black ml-1" style={{ minWidth: 180, maxWidth: 220 }}></span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold">Roll Number:</span>
              <span className="flex-1 border-b border-black ml-1" style={{ minWidth: 140, maxWidth: 180 }}></span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold">Class: {paper.header.class} Section:</span>
              <span className="flex-1 border-b border-black ml-1" style={{ minWidth: 100, maxWidth: 140 }}></span>
            </div>
          </div>

          {/* Sections */}
          {paper.sections?.map((section: any, idx: number) => (
            <div key={idx} className="mb-8">
              {/* Section Title */}
              <h4 className="text-center text-[20px] font-bold text-[#4A5DA8] mb-3 mt-4" style={{ fontFamily: 'Georgia, serif' }}>
                {section.title}
              </h4>
              
              {/* Subtitle */}
              {section.subtitle && (
                <h5 className="font-bold text-[15px] mb-1">{section.subtitle}</h5>
              )}

              {/* Section Instruction */}
              {section.instruction && (
                <p className="text-[13px] italic mb-4 text-gray-700">{section.instruction}</p>
              )}

              {/* Questions */}
              <div className="flex flex-col gap-4">
                {section.questions?.map((q: any, qIdx: number) => (
                  <div key={qIdx} className="flex gap-2 text-[14px] leading-relaxed">
                    <span className="shrink-0 tabular-nums">{q.number}.</span>
                    <p className="flex-1">
                      {q.text} [{q.marks} Marks]
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* End of Paper */}
          <p className="text-[14px] font-bold text-red-600 mt-6 mb-8">
            End of Question Paper
          </p>

          {/* Answer Key */}
          {paper.answerKey && paper.answerKey.length > 0 && (
            <div className="mt-8 pt-8 border-t-2 border-black">
              <h3 className="font-bold text-[18px] mb-5">Answer Key:</h3>
              <div className="flex flex-col gap-4 text-[14px] leading-relaxed">
                {paper.answerKey.map((ans: any, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <span className="shrink-0 tabular-nums">{ans.number}.</span>
                    <p className="flex-1">{ans.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
