"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import {
  LayoutGrid,
  Users,
  FileText,
  Sparkles,
  Clock,
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  onCreateClick?: () => void;
}

export function Sidebar({ onCreateClick }: SidebarProps) {
  const pathname = usePathname();
  const { user, isGuest, logout } = useAuthStore();
  const [assignmentCount, setAssignmentCount] = useState(0);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = Cookies.get("token");
        const isGuestStatus = Cookies.get("isGuest");
        const authHeader = token ? `Bearer ${token}` : isGuestStatus === "true" ? "Guest" : "";
        if (!authHeader) return;

        const res = await fetch("/api/assignments", {
          headers: {
            Authorization: authHeader,
            'X-Veda-Auth': authHeader
          }
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

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="hidden md:flex flex-col w-[304px] fixed top-[12px] left-[12px] bottom-[12px] bg-white rounded-2xl p-6 justify-between shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-50">

      {/* Top Section */}
      <div className="space-y-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-0 px-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="relative w-[64px] h-[64px] flex-shrink-0">
            <Image
              src="/assets/vedaAILOGO.png"
              alt="VedaAI Logo"
              fill
              className="object-contain"
            />
          </div>
          <span
            className="text-gray-900 font-[family-name:var(--font-bricolage)] font-bold align-middle -ml-1"
            style={{
              fontSize: '32px',
              letterSpacing: '-0.06em',
              lineHeight: '1.2'
            }}
          >
            VedaAI
          </span>
        </Link>

        {/* Create Assignment Button */}
        <button
          onClick={() => {
            if (onCreateClick) onCreateClick();
            else window.location.href = '/assignments';
          }}
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
          <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${pathname === '/dashboard' ? 'text-gray-900 bg-gray-100' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
            <LayoutGrid size={18} />
            Home
          </Link>
          <Link href="/groups" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${pathname === '/groups' ? 'text-gray-900 bg-gray-100' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
            <Users size={18} />
            My Groups
          </Link>
          <Link href="/assignments" className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors text-sm font-medium ${pathname === '/assignments' ? 'text-gray-900 bg-gray-100' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
            <div className="flex items-center gap-3">
              <FileText size={18} />
              Assignments
            </div>
            {assignmentCount > 0 && (
              <span className="bg-[#FF7950] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                {assignmentCount}
              </span>
            )}
          </Link>
          <Link href="/ai-toolkit" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${pathname === '/ai-toolkit' ? 'text-gray-900 bg-gray-100' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
            <Sparkles size={18} />
            AI Teacher&apos;s Toolkit
          </Link>
          <Link href="/library" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${pathname === '/library' ? 'text-gray-900 bg-gray-100' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
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
        <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden shrink-0 text-orange-600 font-bold">
            {user?.name ? user.name.charAt(0) : "🧔‍♂️"}
          </div>
          <div className="flex flex-col overflow-hidden flex-1">
            <span className="text-sm font-semibold text-gray-900 truncate">{user ? (user.name || "Teacher") : "Guest User"}</span>
            <span className="text-xs text-gray-500 truncate">{user ? user.email : "Not saved to cloud"}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
        >
          <LogOut size={18} />
          {user ? "Log out" : "Sign in / Register"}
        </button>
      </div>

    </div>
  );
}
