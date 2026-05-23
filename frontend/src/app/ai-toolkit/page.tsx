import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Sparkles, Wand2, BookOpen, BrainCircuit, PenTool } from "lucide-react";

const TOOLS = [
  {
    icon: Wand2,
    title: "Question Paper Generator",
    description: "Generate customized question papers from any document using AI.",
    color: "bg-orange-50",
    iconColor: "text-orange-500",
    status: "Active"
  },
  {
    icon: BookOpen,
    title: "Lesson Plan Creator",
    description: "Create structured lesson plans aligned to your curriculum.",
    color: "bg-purple-50",
    iconColor: "text-purple-500",
    status: "Coming Soon"
  },
  {
    icon: BrainCircuit,
    title: "Quiz Generator",
    description: "Generate interactive quizzes with auto-grading capabilities.",
    color: "bg-blue-50",
    iconColor: "text-blue-500",
    status: "Coming Soon"
  },
  {
    icon: PenTool,
    title: "Answer Evaluator",
    description: "AI-powered answer evaluation with detailed feedback.",
    color: "bg-green-50",
    iconColor: "text-green-500",
    status: "Coming Soon"
  }
];

export default function AIToolkitPage() {
  return (
    <div className="flex h-screen w-full bg-[#EDEDED] overflow-hidden text-gray-900">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full md:pl-[328px]">
        <Header />
        <main className="flex-1 overflow-y-auto w-full relative mt-[38px] md:mt-[22px]">
          <div className="h-full flex flex-col items-center justify-start p-4">
            <div className="w-full max-w-[1100px] mx-auto px-4 md:px-0">
              
              {/* Title */}
              <div className="flex flex-row items-center w-full h-[50px] px-[8px] gap-[16px] mb-6">
                <div className="flex items-center justify-center w-8 h-8 bg-orange-50 rounded-lg">
                  <Sparkles size={16} className="text-orange-500" />
                </div>
                <div className="flex flex-col justify-center">
                  <h2 className="text-gray-900 font-[family-name:var(--font-bricolage)] text-left font-bold text-[20px] tracking-tight">
                    AI Teacher&apos;s Toolkit
                  </h2>
                  <p className="text-[12px] text-gray-400 font-medium leading-tight mt-0.5">Powerful AI tools designed for educators.</p>
                </div>
              </div>

              {/* Tool Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] w-full">
                {TOOLS.map((tool, i) => (
                  <div 
                    key={i}
                    className="relative flex flex-col justify-between w-full bg-white rounded-[24px] p-[24px] shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${tool.color} rounded-2xl flex items-center justify-center shrink-0`}>
                        <tool.icon size={22} className={tool.iconColor} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-[family-name:var(--font-bricolage)] text-[17px] font-bold text-gray-900 tracking-tight">
                            {tool.title}
                          </h3>
                          {tool.status === "Coming Soon" && (
                            <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                              {tool.status}
                            </span>
                          )}
                        </div>
                        <p className="text-[13px] text-gray-400 leading-relaxed">{tool.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
