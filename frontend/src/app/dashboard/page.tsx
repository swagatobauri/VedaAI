"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { AssignmentList } from "@/components/dashboard/AssignmentList";
import { CreateAssignment } from "@/components/dashboard/CreateAssignment";
import { AssignmentOutput } from "@/components/dashboard/AssignmentOutput";
import { useAuthStore } from "@/store/useAuthStore";
import { useNotificationStore } from "@/store/useNotificationStore";

export default function Home() {
  const [view, setView] = useState<'list' | 'create' | 'output'>('list');
  const [generatedPaper, setGeneratedPaper] = useState<any>(null);
  const [currentAssignmentId, setCurrentAssignmentId] = useState<string | null>(null);

  const { user, isGuest, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && !isGuest) {
      router.push("/");
    }
  }, [user, isGuest, loading, router]);

  const handleBack = () => {
    if (view === 'create') setView('list');
    if (view === 'output') setView('list');
  };

  const addNotification = useNotificationStore((state) => state.addNotification);

  const handleGenerateSuccess = (result: any, paper: any) => {
    // result is the DB object, paper is the parsed JSON
    setCurrentAssignmentId(result.id);
    setGeneratedPaper(paper);
    setView('output');
    
    addNotification({
      title: "Assignment Generated!",
      message: "Done with question paper making. You can view the results now.",
      type: "success"
    });
  };

  const handleViewAssignment = (assignmentId: string, paper: any) => {
    setCurrentAssignmentId(assignmentId);
    setGeneratedPaper(paper);
    setView('output');
  };

  return (
    <div className="flex h-screen w-full bg-[#EDEDED] overflow-hidden text-gray-900 print:h-auto print:overflow-visible print:bg-white print:block">
      {/* Desktop Sidebar */}
      <div className="print:hidden">
        <Sidebar onCreateClick={() => setView('create')} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-full md:pl-[328px] print:pl-0 print:block print:w-full">
        {/* Header */}
        <div className="print:hidden">
          <Header isCreating={view !== 'list'} onBack={view !== 'list' ? handleBack : undefined} />
        </div>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto w-full relative mt-[38px] md:mt-[22px] print:mt-0 print:overflow-visible print:h-auto print:block">
          <div className="min-h-full flex flex-col items-center justify-start p-4 print:p-0 print:h-auto print:block">
            {view === 'create' && (
              <CreateAssignment onGenerateSuccess={handleGenerateSuccess} />
            )}
            {view === 'output' && (
              <AssignmentOutput 
                onBack={handleBack} 
                paper={generatedPaper} 
                assignmentId={currentAssignmentId}
              />
            )}
            {view === 'list' && (
              <AssignmentList 
                onCreateClick={() => setView('create')} 
                onViewAssignment={handleViewAssignment}
              />
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="print:hidden">
        <MobileNav onCreateClick={() => setView('create')} hideFab={view !== 'list'} />
      </div>
    </div>
  );
}
