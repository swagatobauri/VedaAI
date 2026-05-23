import { Download, Send, X, Users, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

interface AssignmentOutputProps {
  onBack: () => void;
  paper: any;
  assignmentId?: string | null;
}

export function AssignmentOutput({ onBack, paper, assignmentId }: AssignmentOutputProps) {
  const [showSendModal, setShowSendModal] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const openSendModal = async () => {
    setShowSendModal(true);
    setLoadingGroups(true);
    try {
      const token = Cookies.get("token");
      const res = await fetch("/api/groups", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setGroups(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingGroups(false);
    }
  };

  const handleSend = async () => {
    if (!assignmentId) {
      alert("Please save the assignment first to send it.");
      return;
    }
    if (!selectedGroupId) {
      alert("Please select a group");
      return;
    }

    setIsSending(true);
    try {
      const token = Cookies.get("token");
      const res = await fetch(`/api/assignments/${assignmentId}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ groupId: selectedGroupId })
      });

      if (res.ok) {
        alert("Assignment sent successfully to the group!");
        setShowSendModal(false);
        setSelectedGroupId("");
      } else {
        const error = await res.json();
        alert("Failed to send: " + (error.error || "Unknown error"));
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred while sending.");
    } finally {
      setIsSending(false);
    }
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
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 shrink-0 hide-scrollbar">
          <button 
            onClick={openSendModal}
            className="flex items-center justify-center gap-2 bg-[#FF7950] text-white h-[40px] px-5 rounded-full font-bold text-[13px] hover:bg-[#E66A45] transition-colors shrink-0 shadow-[0_8px_20px_rgba(255,121,80,0.25)]"
          >
            <Send size={16} strokeWidth={2.5} />
            Send to Group
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-white text-[#18181B] h-[40px] px-5 rounded-full font-bold text-[13px] hover:bg-gray-100 transition-colors shrink-0"
          >
            <Download size={16} strokeWidth={2.5} />
            Download PDF
          </button>
        </div>
      </div>

      {/* The Document — pixel-perfect A4 style */}
      <div className="document-container w-full max-w-[794px] mx-auto bg-[#D6DCE4] shadow-lg font-serif text-black print:shadow-none print:max-w-full print:bg-[#D6DCE4]">
        
        {/* School Header Banner */}
        <div className="relative bg-[#D6DCE4] px-6 md:px-[50px] pt-6 md:pt-[30px] pb-[20px]">
          {/* Teacher badge */}
          <div className="absolute top-[12px] left-[12px] bg-[#5B4A9E] text-white text-[11px] font-bold px-3 py-1.5 rounded-md shadow-md z-10">
            VedaAI Generated
          </div>
          
          <div className="text-center pt-[20px]">
            <h1 className="text-[20px] md:text-[24px] font-bold leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              {paper.header.schoolName}
            </h1>
            <h2 className="text-[16px] md:text-[17px] font-bold mt-1">Subject: {paper.header.subject}</h2>
            <h3 className="text-[15px] md:text-[16px] font-bold">Class: {paper.header.class}</h3>
          </div>
        </div>

        {/* Document Body */}
        <div className="bg-white mx-0 px-6 md:px-[50px] py-[30px]">
          
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

      {/* Send to Group Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-[32px] w-full max-w-[400px] shadow-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="font-bold text-[18px] font-[family-name:var(--font-bricolage)] text-gray-900">Send Assignment</h3>
              <button onClick={() => setShowSendModal(false)} className="text-gray-400 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {loadingGroups ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : groups.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                    <Users size={20} />
                  </div>
                  <p className="text-sm text-gray-600">You don&apos;t have any groups yet. Create one in the My Groups tab to send assignments.</p>
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-3">Select a group to send to:</label>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {groups.map(group => {
                      const emails = JSON.parse(group.emails || "[]");
                      return (
                        <div 
                          key={group.id} 
                          onClick={() => setSelectedGroupId(group.id)}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${selectedGroupId === group.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                        >
                          <div>
                            <p className="font-bold text-sm text-gray-900">{group.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{emails.length} Students</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedGroupId === group.id ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                            {selectedGroupId === group.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button 
                onClick={() => setShowSendModal(false)}
                className="px-5 py-2.5 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSend}
                disabled={isSending || groups.length === 0 || !selectedGroupId}
                className="flex items-center justify-center min-w-[100px] px-5 py-2.5 bg-[#FF7950] text-white rounded-full text-sm font-medium hover:bg-[#E66A45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_20px_rgba(255,121,80,0.25)]"
              >
                {isSending ? <Loader2 size={16} className="animate-spin" /> : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
