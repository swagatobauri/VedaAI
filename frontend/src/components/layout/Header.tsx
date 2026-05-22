import { ArrowLeft, Bell, ChevronDown, LayoutGrid, Menu } from "lucide-react";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-[12px] z-40 flex items-center justify-between w-auto h-[56px] pl-[24px] pr-[12px] mx-[10px] md:ml-0 md:mr-[12px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      
      {/* Desktop Left side */}
      <div className="hidden md:flex items-center gap-2">
        <button className="p-1.5 -ml-1.5 hover:bg-gray-200/50 rounded-full transition-colors text-gray-600">
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center gap-2 text-gray-600">
          <LayoutGrid size={18} />
          <span className="font-medium text-sm">Assignment</span>
        </div>
      </div>

      {/* Mobile Left side */}
      <div className="flex md:hidden items-center gap-2">
        <div className="relative w-[40px] h-[40px] flex-shrink-0">
          {/* Base Logo */}
          <Image 
            src="/assets/logo.svg" 
            alt="VedaAI Logo Base" 
            width={40}
            height={40}
            className="absolute top-0 left-0"
          />
          {/* Upper Layer */}
          <Image 
            src="/assets/upperlayerlogo.svg" 
            alt="VedaAI Logo Upper Layer" 
            width={40}
            height={40}
            className="absolute top-0 left-0 z-10"
          />
        </div>
        <span 
          className="text-gray-900 font-[family-name:var(--font-bricolage)] font-bold align-middle"
          style={{ 
            fontSize: '28px', 
            letterSpacing: '-0.06em', 
            lineHeight: '1.2' 
          }}
        >
          VedaAI
        </span>
      </div>

      {/* Right side (Both Desktop and Mobile) */}
      <div className="flex items-center gap-4">
        <button className="relative w-11 h-11 flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full transition-colors">
          <Bell size={22} strokeWidth={2} />
          <span className="absolute top-[8px] right-[10px] w-[10px] h-[10px] bg-orange-500 border-2 border-gray-100 rounded-full"></span>
        </button>
        
        {/* Desktop Profile Dropdown */}
        <div className="hidden md:flex items-center gap-2 py-[6px] px-[12px] rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src="https://i.pravatar.cc/150?u=johndoe" alt="John Doe" className="w-full h-full object-cover" />
          </div>
          <span className="text-base font-semibold text-gray-900">John Doe</span>
          <ChevronDown size={20} strokeWidth={2} className="text-gray-900" />
        </div>

        {/* Mobile Profile & Menu */}
        <div className="flex md:hidden items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden shadow-sm">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src="https://i.pravatar.cc/150?u=johndoe" alt="John Doe" className="w-full h-full object-cover" />
          </div>
          <button className="p-2 text-gray-700">
            <Menu size={24} />
          </button>
        </div>
      </div>
      
    </header>
  );
}
