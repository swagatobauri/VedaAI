import { Plus } from "lucide-react";
import Image from "next/image";

interface EmptyStateProps {
  onCreateClick?: () => void;
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto px-4 gap-[32px] w-full">
      
      {/* Inner Container (Frame 1984077554) */}
      <div className="flex flex-col items-center text-center gap-[12px] w-full max-w-[373px]">
        {/* Illustration Area */}
        <div className="relative w-[220px] h-[220px] md:w-[300px] md:h-[300px] flex items-center justify-center">
          <Image 
            src="/assets/dashboard_background.png" 
            alt="No assignments yet illustration" 
            fill
            className="object-contain"
          />
        </div>

        <h2 className="text-xl font-bold text-[#18181B]">No assignments yet</h2>
        <p className="text-sm text-[#71717A] leading-relaxed">
          Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
        </p>
      </div>

      <button 
        onClick={onCreateClick}
        className="flex items-center justify-center gap-1 bg-[#18181B] text-white h-[46px] px-6 rounded-full transition-colors text-sm font-medium shadow-md hover:bg-black"
      >
        <Plus size={18} />
        Create Your First Assignment
      </button>
    </div>
  );
}
