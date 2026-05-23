import Link from "next/link";
import Image from "next/image";
import { 
  LayoutGrid, 
  Users, 
  FileText, 
  Sparkles, 
  Clock, 
  Settings
} from "lucide-react";

export function Sidebar() {
  return (
    <div className="hidden md:flex flex-col w-[304px] fixed top-[12px] left-[12px] bottom-[12px] bg-white rounded-2xl p-6 justify-between shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-50">
      
      {/* Top Section */}
      <div className="space-y-6">
        {/* Logo */}
        <div className="flex items-center gap-2 px-2">
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

        {/* Create Assignment Button */}
        <button 
          className="w-full h-[42px] px-[43px] flex items-center justify-center gap-[10px] text-white rounded-full transition-colors hover:opacity-90 shadow-[0_32px_48px_0_rgba(255,255,255,0.2)] font-inter font-medium align-middle"
          style={{
            border: '4px solid transparent',
            background: 'linear-gradient(#272727, #272727) padding-box, linear-gradient(90deg, #FF7950 0%, #C0350A 100%) border-box',
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: '14px', 
            fontWeight: 500,
            lineHeight: '28px', 
            letterSpacing: '-0.04em' 
          }}
        >
          <Image 
            src="/assets/Sparkles.png" 
            alt="Sparkles" 
            width={18} 
            height={18} 
            className="object-contain align-middle w-auto h-auto"
          />
          <span className="align-middle">
            Create Assignment
          </span>
        </button>

        {/* Navigation */}
        <nav className="space-y-1">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors text-sm font-medium">
            <LayoutGrid size={18} />
            Home
          </Link>
          <Link href="/groups" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors text-sm font-medium">
            <Users size={18} />
            My Groups
          </Link>
          <Link href="/assignments" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors text-sm font-medium">
            <FileText size={18} />
            Assignments
          </Link>
          <Link href="/ai-toolkit" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors text-sm font-medium">
            <Sparkles size={18} />
            AI Teacher&apos;s Toolkit
          </Link>
          <Link href="/library" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors text-sm font-medium">
            <Clock size={18} />
            My Library
          </Link>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-2">
        <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors text-sm font-medium">
          <Settings size={18} />
          Settings
        </Link>
        
        {/* User Profile */}
        <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-2xl cursor-pointer hover:bg-gray-200 transition-colors">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden shrink-0">
             {/* Simple avatar placeholder */}
             <span className="text-xl">🧔‍♂️</span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-gray-900 truncate">Delhi Public School</span>
            <span className="text-xs text-gray-500 truncate">Bokaro Steel City</span>
          </div>
        </div>
      </div>

    </div>
  );
}
