"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Settings as SettingsIcon, Building, Save, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [schoolName, setSchoolName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) return;

        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user?.schoolName) {
            setSchoolName(data.user.schoolName);
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = Cookies.get("token");
      if (!token) return;

      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ schoolName })
      });

      if (res.ok) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#EDEDED] overflow-hidden text-gray-900">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full md:pl-[328px]">
        <Header />
        <main className="flex-1 overflow-y-auto w-full relative mt-[38px] md:mt-[22px]">
          <div className="h-full flex flex-col items-center justify-start p-4">
            <div className="w-full max-w-[900px] mx-auto px-4 md:px-0 pt-6">
              
              {/* Title */}
              <div className="flex flex-row items-center w-full h-[50px] px-[8px] gap-[16px] mb-8">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                  <SettingsIcon size={16} className="text-gray-500" />
                </div>
                <div className="flex flex-col justify-center">
                  <h2 className="text-gray-900 font-[family-name:var(--font-bricolage)] text-left font-bold text-[20px] tracking-tight">
                    Settings
                  </h2>
                  <p className="text-[12px] text-gray-400 font-medium leading-tight mt-0.5">Configure your account and preferences.</p>
                </div>
              </div>

              {/* Profile Card */}
              <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm w-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                    <Building size={18} />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-gray-900 font-[family-name:var(--font-bricolage)] tracking-tight">
                      Institution Details
                    </h3>
                    <p className="text-[13px] text-gray-400">This will be printed at the top of your generated question papers.</p>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center h-[100px]">
                    <Loader2 className="animate-spin text-gray-400" size={24} />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[14px] font-bold text-gray-900 mb-2">School / Institution Name</label>
                      <input 
                        type="text" 
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="e.g. Delhi Public School, Sector-4, Bokaro"
                        className="w-full h-[46px] px-4 border border-gray-200 rounded-full text-[14px] text-gray-900 focus:outline-none focus:border-gray-300 placeholder-gray-400"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex items-center gap-2 bg-[#18181B] text-white h-[42px] px-6 rounded-full font-bold text-[13px] shadow-md transition-colors ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black'}`}
                      >
                        {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
