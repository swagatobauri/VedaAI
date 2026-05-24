"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, FileText, Clock, Sparkles, Plus } from "lucide-react";

interface MobileNavProps {
  onCreateClick?: () => void;
  hideFab?: boolean;
}

export function MobileNav({ onCreateClick, hideFab = false }: MobileNavProps) {
  const pathname = usePathname();
  const [assignmentCount, setAssignmentCount] = useState(0);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = Cookies.get("token");
        const isGuestStatus = Cookies.get("isGuest");
        const authHeader = token ? `Bearer ${token}` : isGuestStatus === "true" ? "Guest" : "";
        if (!authHeader) return;

        const res = await fetch("/api/assignments", {
          headers: { Authorization: authHeader, "X-Veda-Auth": authHeader }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setAssignmentCount(data.length);
          }
        }
      } catch (e) {
        console.error("Failed to fetch assignment count", e);
      }
    };
    fetchAssignments();
  }, []);

  return (
    <>
      {/* Mobile Blur Fade Overlay */}
      <div 
        className="md:hidden fixed bottom-0 left-0 right-0 h-[150px] pointer-events-none z-30"
        style={{
          background: 'linear-gradient(to top, rgba(237,237,237,1) 30%, rgba(237,237,237,0.5) 70%, transparent 100%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          WebkitMaskImage: 'linear-gradient(to top, black 60%, transparent 100%)',
          maskImage: 'linear-gradient(to top, black 60%, transparent 100%)'
        }}
      />

      {/* Floating Action Button */}
      {!hideFab && (
        <div className="md:hidden fixed bottom-[110px] right-[10px] z-50">
          <button 
            onClick={() => {
              if (onCreateClick) onCreateClick();
              else window.location.href = '/assignments';
            }}
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 text-orange-500 hover:scale-105 transition-transform"
          >
            <Plus size={28} strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="md:hidden fixed bottom-[24px] left-[10px] right-[10px] h-[72px] bg-[#18181B] text-[#6B7280] rounded-[32px] flex items-center justify-around px-4 z-40 shadow-2xl">
        <Link href="/dashboard" className={`flex flex-col items-center gap-1 p-2 transition-colors ${pathname === '/dashboard' ? 'text-white' : 'hover:text-white'}`}>
          <LayoutGrid size={22} strokeWidth={pathname === '/dashboard' ? 2.5 : 2} />
          <span className="text-[11px] font-medium">Home</span>
        </Link>
        <Link href="/assignments" className={`relative flex flex-col items-center gap-1 p-2 transition-colors ${pathname === '/assignments' ? 'text-white' : 'hover:text-white'}`}>
          <FileText size={22} strokeWidth={pathname === '/assignments' ? 2.5 : 2} />
          {assignmentCount > 0 && (
            <span className="absolute top-0 right-2 bg-orange-500 text-white text-[9px] font-bold px-1.5 rounded-full shadow-sm">
              {assignmentCount}
            </span>
          )}
          <span className="text-[11px] font-medium">Assignments</span>
        </Link>
        <Link href="/library" className={`flex flex-col items-center gap-1 p-2 transition-colors ${pathname === '/library' ? 'text-white' : 'hover:text-white'}`}>
          <Clock size={22} strokeWidth={pathname === '/library' ? 2.5 : 2} />
          <span className="text-[11px] font-medium">Library</span>
        </Link>
        <Link href="/ai-toolkit" className={`flex flex-col items-center gap-1 p-2 transition-colors ${pathname === '/ai-toolkit' ? 'text-white' : 'hover:text-white'}`}>
          <Sparkles size={22} strokeWidth={pathname === '/ai-toolkit' ? 2.5 : 2} />
          <span className="text-[11px] font-medium">AI Toolkit</span>
        </Link>
      </div>
    </>
  );
}
