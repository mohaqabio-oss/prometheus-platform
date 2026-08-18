"use client";

import React, { useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { MemberCard } from "@/components/members/member-card";
import { MOCK_MEMBERS } from "@/lib/data/mock-members";
import { Search } from "lucide-react";

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("الكل");

  const departments = [
    "الكل",
    "الهندسة البرمجية",
    "البحث العلمي",
    "التعليم والتطوير",
    "الموارد البشرية والعمليات",
  ];

  const filteredMembers = MOCK_MEMBERS.filter((member) => {
    const matchesDept =
      selectedDept === "الكل" || member.department === selectedDept;
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="py-12 sm:py-20 container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl space-y-16">
      
      {/* Header */}
      <SectionHeader
        badgeText="دليل أعضاء الفريق"
        title="فريقنا المتطوع و"
        highlightedTitle="التخصصات"
        description="استكشف الكوادر التطوعية، مهندسي البرمجيات، الباحثين الأكاديميين، والمحررين القائمين على مشاريع فريق بروميثيوس."
      />

      {/* Search & Department Filters */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-brand-gray-500" />
            <input
              type="text"
              placeholder="ابحث باسم العضو أو المسمى الوظيفي..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 ps-10 pe-4 bg-brand-dark-900 border border-brand-dark-800 rounded-xl text-sm text-white placeholder:text-brand-gray-500 focus:outline-none focus:border-brand-orange/60 font-sans"
            />
          </div>

          <div className="text-xs font-mono text-brand-gray-400">
            عدد الأعضاء المعروضين: <strong className="text-white">{filteredMembers.length} أعضاء</strong>
          </div>

        </div>

        {/* Department Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                selectedDept === dept
                  ? "bg-brand-orange text-white font-bold shadow-md"
                  : "bg-brand-dark-900 text-brand-gray-400 hover:text-white border border-brand-dark-800"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMembers.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>

    </div>
  );
}
