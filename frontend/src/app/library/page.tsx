import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Clock, FolderOpen } from "lucide-react";

export default function LibraryPage() {
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
                <div className="flex items-center justify-center w-8 h-8 bg-violet-50 rounded-lg">
                  <Clock size={16} className="text-violet-500" />
                </div>
                <div className="flex flex-col justify-center">
                  <h2 className="text-gray-900 font-[family-name:var(--font-bricolage)] text-left font-bold text-[20px] tracking-tight">
                    My Library
                  </h2>
                  <p className="text-[12px] text-gray-400 font-medium leading-tight mt-0.5">Your saved documents, templates, and resources.</p>
                </div>
              </div>

              {/* Empty State */}
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-violet-50 rounded-full flex items-center justify-center mb-6">
                  <FolderOpen size={32} className="text-violet-400" />
                </div>
                <h3 className="text-[18px] font-bold text-gray-900 mb-2">Your library is empty</h3>
                <p className="text-gray-400 text-sm max-w-[320px] mb-6">Documents you upload and question papers you generate will appear here for quick access.</p>
              </div>

            </div>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
