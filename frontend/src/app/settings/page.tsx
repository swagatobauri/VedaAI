import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";

const SETTINGS_SECTIONS = [
  {
    icon: User,
    title: "Profile",
    description: "Update your name, school, and profile picture.",
    color: "bg-blue-50",
    iconColor: "text-blue-500"
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Configure email and push notification preferences.",
    color: "bg-yellow-50",
    iconColor: "text-yellow-500"
  },
  {
    icon: Shield,
    title: "Security",
    description: "Manage password, two-factor authentication, and API keys.",
    color: "bg-red-50",
    iconColor: "text-red-500"
  },
  {
    icon: Palette,
    title: "Appearance",
    description: "Customize the look and feel of VedaAI.",
    color: "bg-green-50",
    iconColor: "text-green-500"
  }
];

export default function SettingsPage() {
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

              {/* Settings Cards */}
              <div className="flex flex-col gap-[12px] w-full">
                {SETTINGS_SECTIONS.map((section, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-4 w-full bg-white rounded-[20px] p-[20px] shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className={`w-11 h-11 ${section.color} rounded-xl flex items-center justify-center shrink-0`}>
                      <section.icon size={20} className={section.iconColor} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-[family-name:var(--font-bricolage)] text-[16px] font-bold text-gray-900 tracking-tight">
                        {section.title}
                      </h3>
                      <p className="text-[13px] text-gray-400 leading-relaxed">{section.description}</p>
                    </div>
                    <div className="text-gray-300">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
