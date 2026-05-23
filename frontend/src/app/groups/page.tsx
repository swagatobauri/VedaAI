"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Users, UserPlus, X, Mail, Trash2 } from "lucide-react";

interface Group {
  id: string;
  name: string;
  emails: string; // JSON string array
  createdAt: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const token = Cookies.get("token");
      const isGuest = Cookies.get("isGuest") === "true";
      if (isGuest) {
        setLoading(false);
        return;
      }
      const res = await fetch("/api/groups", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGroups(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmail = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = emailInput.trim().replace(/,$/, "");
      if (val && !emails.includes(val) && val.includes("@")) {
        setEmails([...emails, val]);
        setEmailInput("");
      }
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter(e => e !== emailToRemove));
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || emails.length === 0) {
      alert("Group name and at least one email are required.");
      return;
    }

    try {
      const token = Cookies.get("token");
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ name: newGroupName, emails })
      });

      if (res.ok) {
        const newGroup = await res.json();
        setGroups([newGroup, ...groups]);
        setIsModalOpen(false);
        setNewGroupName("");
        setEmails([]);
      } else {
        alert("Failed to create group.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteGroup = async (id: string) => {
    if (!confirm("Are you sure you want to delete this group?")) return;

    try {
      const token = Cookies.get("token");
      const res = await fetch(`/api/groups/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setGroups(groups.filter(g => g.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const isGuest = Cookies.get("isGuest") === "true";

  return (
    <div className="flex h-screen w-full bg-[#EDEDED] overflow-hidden text-gray-900 relative">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full md:pl-[328px]">
        <Header />
        <main className="flex-1 overflow-y-auto w-full relative mt-[38px] md:mt-[22px]">
          <div className="h-full flex flex-col items-center justify-start p-4">
            <div className="w-full max-w-[1100px] mx-auto px-4 md:px-0">
              
              {/* Title & Action */}
              <div className="flex flex-row items-center justify-between w-full h-[50px] px-[8px] mb-6">
                <div className="flex items-center gap-[16px]">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg">
                    <Users size={16} className="text-blue-500" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h2 className="text-gray-900 font-[family-name:var(--font-bricolage)] text-left font-bold text-[20px] tracking-tight">
                      My Groups
                    </h2>
                    <p className="text-[12px] text-gray-400 font-medium leading-tight mt-0.5">Manage your student groups and classes.</p>
                  </div>
                </div>
                {!isGuest && (
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-[#18181B] text-white h-[42px] px-6 rounded-full font-medium text-[14px] hover:bg-black transition-colors"
                  >
                    <UserPlus size={16} />
                    <span className="hidden sm:inline">Create Group</span>
                  </button>
                )}
              </div>

              {/* Content */}
              {loading ? (
                <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>
              ) : isGuest ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <Users size={32} className="text-blue-400" />
                  </div>
                  <h3 className="text-[18px] font-bold text-gray-900 mb-2">Sign in required</h3>
                  <p className="text-gray-400 text-sm max-w-[320px] mb-6">You must be signed in to create and manage student groups.</p>
                </div>
              ) : groups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <Users size={32} className="text-blue-400" />
                  </div>
                  <h3 className="text-[18px] font-bold text-gray-900 mb-2">No groups yet</h3>
                  <p className="text-gray-400 text-sm max-w-[320px] mb-6">Create your first group to organize students and distribute assignments seamlessly.</p>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-[#18181B] text-white h-[42px] px-6 rounded-full font-medium text-[14px] hover:bg-black transition-colors"
                  >
                    <UserPlus size={16} />
                    Create Group
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groups.map(group => {
                    const parsedEmails = JSON.parse(group.emails || "[]");
                    return (
                      <div key={group.id} className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                              <Users size={24} />
                            </div>
                            <button onClick={() => handleDeleteGroup(group.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 -mr-2 -mt-2 rounded-full hover:bg-red-50">
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <h3 className="font-bold text-lg text-gray-900 font-[family-name:var(--font-bricolage)]">{group.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{parsedEmails.length} Students</p>
                        </div>
                        <div className="mt-6 flex flex-wrap gap-1">
                          {parsedEmails.slice(0, 3).map((email: string, i: number) => (
                            <div key={i} className="text-[10px] font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full truncate max-w-full">
                              {email}
                            </div>
                          ))}
                          {parsedEmails.length > 3 && (
                            <div className="text-[10px] font-medium px-2 py-1 bg-gray-50 text-gray-400 rounded-full">
                              +{parsedEmails.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
      <MobileNav />

      {/* Create Group Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-[500px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="font-bold text-[20px] font-[family-name:var(--font-bricolage)]">Create New Group</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Group Name</label>
                <input 
                  type="text" 
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Class 10A Science"
                  className="w-full h-[46px] px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-900"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Student Emails</label>
                <p className="text-[11px] text-gray-500 mb-2">Type an email and press Enter or comma (,)</p>
                <div className="w-full min-h-[46px] p-2 bg-gray-50 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all flex flex-wrap gap-2 items-center">
                  {emails.map((email) => (
                    <div key={email} className="flex items-center gap-1 bg-white border border-gray-200 shadow-sm pl-2 pr-1 py-1 rounded-md">
                      <span className="text-[12px] font-medium text-gray-700">{email}</span>
                      <button onClick={() => handleRemoveEmail(email)} className="text-gray-400 hover:text-red-500 rounded hover:bg-red-50 p-0.5">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <input 
                    type="email" 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={handleAddEmail}
                    placeholder={emails.length === 0 ? "student@example.com" : "Add more..."}
                    className="flex-1 min-w-[120px] bg-transparent outline-none text-[13px] text-gray-900 h-6"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateGroup}
                disabled={!newGroupName.trim() || emails.length === 0}
                className="px-6 py-2.5 bg-[#FF7950] text-white rounded-full text-sm font-medium hover:bg-[#E66A45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_20px_rgba(255,121,80,0.25)]"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
