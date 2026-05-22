import Link from "next/link";
import { LayoutGrid, FileText, Clock, Sparkles, Plus } from "lucide-react";

export function MobileNav() {
  return (
    <>
      {/* Floating Action Button */}
      <div className="md:hidden fixed bottom-[110px] right-[10px] z-50">
        <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 text-orange-500 hover:scale-105 transition-transform">
          <Plus size={28} strokeWidth={2.5} />
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="md:hidden fixed bottom-[24px] left-[10px] right-[10px] h-[72px] bg-[#18181B] text-[#6B7280] rounded-[32px] flex items-center justify-around px-4 z-40 shadow-2xl">
        <Link href="/" className="flex flex-col items-center gap-1 p-2 hover:text-white transition-colors">
          <LayoutGrid size={22} strokeWidth={2} />
          <span className="text-[11px] font-medium">Home</span>
        </Link>
        <Link href="/assignments" className="flex flex-col items-center gap-1 p-2 text-white transition-colors">
          <FileText size={22} strokeWidth={2.5} />
          <span className="text-[11px] font-medium">Assignments</span>
        </Link>
        <Link href="/library" className="flex flex-col items-center gap-1 p-2 hover:text-white transition-colors">
          <Clock size={22} strokeWidth={2} />
          <span className="text-[11px] font-medium">Library</span>
        </Link>
        <Link href="/ai-toolkit" className="flex flex-col items-center gap-1 p-2 hover:text-white transition-colors">
          <Sparkles size={22} strokeWidth={2} />
          <span className="text-[11px] font-medium">AI Toolkit</span>
        </Link>
      </div>
    </>
  );
}
