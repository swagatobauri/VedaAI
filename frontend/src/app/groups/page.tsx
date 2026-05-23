import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Users, UserPlus, ArrowRight } from "lucide-react";

export default function GroupsPage() {
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
                <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg">
                  <Users size={16} className="text-blue-500" />
                </div>
                <div className="flex flex-col justify-center">
                  <h2 className="text-gray-900 font-[family-name:var(--font-bricolage)] text-left font-bold text-[20px] tracking-tight">
                    My Groups
                  </h2>
                  <p className="text-[12px] text-gray-400 font-medium leading-tight mt-0.5">Manage your student groups and classes.</p>
                </div>
              </div>

              {/* Empty State */}
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <Users size={32} className="text-blue-400" />
                </div>
                <h3 className="text-[18px] font-bold text-gray-900 mb-2">No groups yet</h3>
                <p className="text-gray-400 text-sm max-w-[320px] mb-6">Create your first group to organize students and distribute assignments seamlessly.</p>
                <button className="flex items-center gap-2 bg-[#18181B] text-white h-[42px] px-6 rounded-full font-medium text-[14px] hover:bg-black transition-colors">
                  <UserPlus size={16} />
                  Create Group
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
