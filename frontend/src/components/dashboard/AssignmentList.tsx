"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Filter, Search, Plus, MoreVertical } from "lucide-react";
import Cookies from "js-cookie";
import { EmptyState } from "./EmptyState";

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  totalMarks: number;
  status: string;
  paperJson?: string;
  createdAt: string;
}

interface AssignmentListProps {
  onCreateClick?: () => void;
  onViewAssignment?: (assignmentId: string, paper: any) => void;
}

export function AssignmentList({ onCreateClick, onViewAssignment }: AssignmentListProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch assignments from the backend
  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = Cookies.get("token");
      const isGuest = Cookies.get("isGuest");
      const authHeader = token ? `Bearer ${token}` : isGuest ? "Guest" : "";

      const response = await fetch("/api/assignments", {
        headers: { 
          Authorization: authHeader,
          'X-Veda-Auth': authHeader
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      }
    } catch (err) {
      console.error("Failed to fetch assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    try {
      const token = Cookies.get("token");
      const isGuest = Cookies.get("isGuest");
      if (isGuest === "true") {
        alert("Guests cannot delete assignments.");
        return;
      }
      
      const authHeader = token ? `Bearer ${token}` : "";
      const res = await fetch(`/api/assignments/${id}`, {
        method: "DELETE",
        headers: { 
          Authorization: authHeader,
          'X-Veda-Auth': authHeader
        }
      });
      if (res.ok) {
        setAssignments(prev => prev.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete:", err);
    }
    setOpenMenuId(null);
  };

  const handleView = (assignment: Assignment) => {
    setOpenMenuId(null);
    if (!assignment.paperJson) {
      alert("This assignment was created before paper storage was enabled. Please generate a new one.");
      return;
    }
    if (onViewAssignment) {
      const paper = JSON.parse(assignment.paperJson);
      onViewAssignment(assignment.id, paper);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto min-h-[500px] pb-[140px] px-4 md:px-0">
      
      {/* Mobile Title Area */}
      <div className="flex md:hidden relative items-center justify-center w-full h-[50px] mb-4">
        <button className="absolute left-0 w-10 h-10 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center text-gray-700 transition-colors">
          <ArrowLeft size={20} strokeWidth={2} />
        </button>
        <h2 
          className="text-gray-900 font-[family-name:var(--font-bricolage)] text-center align-middle"
          style={{
            fontWeight: 700,
            fontSize: '18px',
            lineHeight: '140%',
            letterSpacing: '-0.04em'
          }}
        >
          Assignments
        </h2>
      </div>

      {/* Desktop Title Area */}
      <div className="hidden md:flex flex-row items-center w-full h-[50px] px-[8px] gap-[16px] mb-6">
        {assignments.length > 0 && (
          <div className="flex items-center justify-center w-8 h-8 bg-green-50 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        )}
        <div className="flex flex-col justify-center">
          <h2 
            className="text-gray-900 font-[family-name:var(--font-bricolage)] text-left align-middle"
            style={{
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: '140%',
              letterSpacing: '-0.04em'
            }}
          >
            Assignments
          </h2>
          <p className="text-[12px] text-gray-400 font-medium leading-tight mt-0.5">Manage and create assignments for your classes.</p>
        </div>
      </div>
      
      {/* Desktop Filter & Search Bar */}
      <div className="hidden md:flex flex-row items-center justify-between w-full h-[64px] bg-white rounded-[16px] px-[16px] mb-6 shadow-sm">
        <div className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
          <Filter size={18} strokeWidth={2} />
          <span className="text-sm font-medium">Filter By</span>
        </div>
        <div className="relative flex items-center w-[344px] h-[40px]">
          <Search size={16} className="absolute left-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search Assignment" 
            className="w-full h-full pl-[36px] pr-4 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-gray-300 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Mobile Filter & Search Bar */}
      <div className="flex md:hidden flex-row items-center gap-3 w-full mb-6">
        <button className="flex items-center justify-center gap-2 h-[44px] px-[16px] bg-white rounded-full text-gray-400 shadow-sm flex-shrink-0">
          <Filter size={18} strokeWidth={2} />
          <span className="text-sm font-medium">Filter</span>
        </button>
        <div className="relative flex-1 h-[44px]">
          <Search size={16} className="absolute left-[14px] top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search Name" 
            className="w-full h-full pl-[36px] pr-4 bg-white rounded-full text-sm focus:outline-none shadow-sm placeholder-gray-400"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400 text-sm">Loading assignments...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && assignments.length === 0 && (
        <EmptyState onCreateClick={onCreateClick} />
      )}

      {/* Assignment Cards Grid */}
      {!loading && assignments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] w-full">
          {assignments.map((assignment) => (
            <div 
              key={assignment.id} 
              className="relative flex flex-col justify-between w-full max-w-full md:max-w-[542px] h-[162px] bg-white rounded-[24px] p-[24px] shadow-sm"
            >
              {/* Top row */}
              <div className="flex justify-between items-start">
                <h3 className="font-[family-name:var(--font-bricolage)] text-[20px] font-bold text-gray-900 tracking-tight">
                  {assignment.title}
                </h3>
                <button 
                  onClick={() => setOpenMenuId(openMenuId === assignment.id ? null : assignment.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Bottom row */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex gap-1.5 items-center">
                  <span className="font-bold text-gray-900 text-[13px]">Assigned on :</span>
                  <span className="text-gray-500 text-[13px]">{formatDate(assignment.createdAt)}</span>
                </div>
                <div className="flex gap-1.5 items-center">
                  <span className="font-bold text-gray-900 text-[13px]">Due :</span>
                  <span className="text-gray-500 text-[13px]">{assignment.dueDate !== "Pending" ? assignment.dueDate : "—"}</span>
                </div>
              </div>

              {/* Dropdown Menu */}
              {openMenuId === assignment.id && (
                <div className="absolute top-[60px] right-[24px] bg-white rounded-[16px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-2 w-[160px] z-10 flex flex-col">
                  <button 
                    onClick={() => handleView(assignment)}
                    className="text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    View Assignment
                  </button>
                  <button 
                    onClick={() => handleDelete(assignment.id)}
                    className="text-left px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 font-medium"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Floating Create Assignment Button Area (Desktop) */}
      {!loading && assignments.length > 0 && (
        <div className="hidden md:flex fixed bottom-0 left-0 right-0 pl-[328px] h-[160px] pointer-events-none items-end justify-center pb-[40px] bg-gradient-to-t from-[#EDEDED] via-[#EDEDED]/80 to-transparent z-20">
          <button 
            onClick={onCreateClick}
            className="pointer-events-auto flex items-center justify-center gap-2 bg-[#18181B] text-white h-[46px] px-6 rounded-full transition-colors text-sm font-medium shadow-xl hover:bg-black border-[1.5px] border-white/10"
          >
            <Plus size={18} />
            Create Assignment
          </button>
        </div>
      )}

    </div>
  );
}
