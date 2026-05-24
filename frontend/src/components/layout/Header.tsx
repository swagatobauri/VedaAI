"use client";

import { ArrowLeft, Bell, ChevronDown, LayoutGrid, Menu, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useNotificationStore } from "@/store/useNotificationStore";

interface HeaderProps {
  onBack?: () => void;
  isCreating?: boolean;
  title?: string;
}

export function Header({ onBack, isCreating, title }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, markAllAsRead } = useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const getTitle = () => {
    if (title) return title;
    if (isCreating) return "Create Assignment";
    if (pathname === '/settings') return "Settings";
    if (pathname === '/library') return "Library";
    if (pathname === '/groups') return "My Groups";
    if (pathname === '/ai-toolkit') return "AI Toolkit";
    if (pathname === '/assignments') return "Assignments";
    return "Dashboard";
  };
  
  return (
    <header className="sticky top-[12px] mt-[12px] z-40 flex items-center justify-between w-auto h-[56px] pl-[24px] pr-[12px] mx-[10px] md:ml-0 md:mr-[12px] bg-white rounded-[16px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] gap-[10px]">
      
      {/* Desktop Left side */}
      <div className="hidden md:flex items-center gap-2">
        <button 
          onClick={() => {
            if (onBack) {
              onBack();
            } else if (pathname !== '/dashboard' && pathname !== '/assignments') {
              router.back();
            }
          }}
          className={`p-1.5 -ml-1.5 hover:bg-gray-200/50 rounded-full transition-colors ${(pathname === '/dashboard' || pathname === '/assignments') && !onBack ? 'text-gray-300 cursor-default hover:bg-transparent' : 'text-gray-600'}`}
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center gap-2 text-gray-600">
          <LayoutGrid size={18} />
          <span className="font-medium text-sm">{getTitle()}</span>
        </div>
      </div>

      {/* Mobile Left side */}
      <Link href="/dashboard" className="flex md:hidden items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
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
      </Link>

      {/* Right side (Both Desktop and Mobile) */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications && unreadCount > 0) {
                markAllAsRead();
              }
            }}
            className="relative w-11 h-11 flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full transition-colors focus:outline-none"
          >
            <Bell size={22} strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute top-[8px] right-[10px] w-[10px] h-[10px] bg-orange-500 border-2 border-gray-100 rounded-full"></span>
            )}
          </button>
          
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-[family-name:var(--font-bricolage)] font-bold text-gray-900">Notifications</h3>
                {notifications.length > 0 && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{notifications.length}</span>
                )}
              </div>
              
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-gray-500">
                    No notifications yet.
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-0">
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${notif.type === 'success' ? 'bg-green-500' : notif.type === 'info' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-0.5">{notif.title}</h4>
                            <p className="text-xs text-gray-500 leading-relaxed mb-1">{notif.message}</p>
                            <span className="text-[10px] text-gray-400 font-medium">
                              {notif.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Profile Dropdown */}
        <div className="hidden md:flex items-center gap-2 py-[6px] px-[12px] rounded-xl group relative cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden text-orange-600 font-bold">
             {user?.name ? user.name.charAt(0) : "G"}
          </div>
          <span className="text-base font-semibold text-gray-900">{user ? (user.name || "Teacher") : "Guest"}</span>
          <ChevronDown size={20} strokeWidth={2} className="text-gray-900" />
          
          {/* Dropdown Menu */}
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut size={16} />
              {user ? "Sign Out" : "Sign In"}
            </button>
          </div>
        </div>

        {/* Mobile Profile & Menu */}
        <div className="flex md:hidden items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden shadow-sm text-orange-600 font-bold">
             {user?.name ? user.name.charAt(0) : "G"}
          </div>
          <button onClick={logout} className="p-2 text-gray-700">
             <LogOut size={20} className="text-red-500" />
          </button>
        </div>
      </div>
      
    </header>
  );
}
