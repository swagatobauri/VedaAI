"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { AssignmentList } from "@/components/dashboard/AssignmentList";
import { CreateAssignment } from "@/components/dashboard/CreateAssignment";
import { AssignmentOutput } from "@/components/dashboard/AssignmentOutput";
import { useNotificationStore } from "@/store/useNotificationStore";

export default function AssignmentsPage() {
  const [view, setView] = useState<'list' | 'create' | 'output'>('list');
  const [generatedPaper, setGeneratedPaper] = useState<any>(null);

  const handleBack = () => {
    setView('list');
  };

  const addNotification = useNotificationStore((state) => state.addNotification);

  const handleGenerateSuccess = (paperPayload: any) => {
    setGeneratedPaper(paperPayload);
    setView('output');
    
    addNotification({
      title: "Assignment Generated!",
      message: "Done with question paper making. You can view the results now.",
      type: "success"
    });
  };

  const handleViewAssignment = (paper: any) => {
    setGeneratedPaper(paper);
    setView('output');
  };

  return (
    <div className="flex h-screen w-full bg-[#EDEDED] overflow-hidden text-gray-900 print:h-auto print:overflow-visible print:bg-white print:block">
      <div className="print:hidden"><Sidebar onCreateClick={() => setView('create')} /></div>
      <div className="flex flex-col flex-1 w-full md:pl-[328px] print:pl-0 print:block print:w-full">
        <div className="print:hidden">
          <Header isCreating={view !== 'list'} onBack={view !== 'list' ? handleBack : undefined} />
        </div>
        <main className="flex-1 overflow-y-auto w-full relative mt-[38px] md:mt-[22px] print:mt-0 print:overflow-visible print:h-auto print:block">
          <div className="min-h-full flex flex-col items-center justify-start p-4 print:p-0 print:h-auto print:block">
            {view === 'create' && (
              <CreateAssignment onGenerateSuccess={handleGenerateSuccess} />
            )}
            {view === 'output' && (
              <AssignmentOutput onBack={handleBack} paper={generatedPaper} />
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
      <div className="print:hidden"><MobileNav onCreateClick={() => setView('create')} hideFab={view !== 'list'} /></div>
    </div>
  );
}
