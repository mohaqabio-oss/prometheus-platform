"use client";

import React, { useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { MemberCard } from "@/components/members/member-card";
import { Card } from "@/components/ui/card";
import { Search, Users } from "lucide-react";
import { PageHeaderConfig } from "@/app/actions/website-actions";

interface MembersClientPageProps {
  initialMembers: any[];
  headerConfig: PageHeaderConfig | null;
}

export function MembersClientPage({ initialMembers, headerConfig }: MembersClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("الكل");

  const departments = [
    "الكل",
    "الهندسة البرمجية",
    "البحث العلمي",
    "التعليم والتطوير",
    "الموارد البشرية والعمليات",
  ];

  const filteredMembers = initialMembers.filter((member) => {
    const matchesDept =
      selectedDept === "الكل" || member.department === selectedDept || member.departmentName === selectedDept;
    const matchesSearch =
      (member.name || member.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.role || member.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="py-12 sm:py-20 container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl space-y-16">
      
      {/* Dynamic Header */}
      <SectionHeader
        badgeText={headerConfig?.badge || "دليل أعضاء الفريق"}
        title={headerConfig?.title || "فريقنا المتطوع والكوادر"}
        description={headerConfig?.subtitle || "استكشف الكوادر التطوعية، مهندسي البرمجيات، الباحثين الأكاديميين، والمحررين القائمين على مشاريع فريق بروميثيوس."}
      />

      {/* Search & Department Filters */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              placeholder="ابحث باسم العضو أو المسمى الوظيفي..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 ps-10 pe-4 bg-[#0D0D0D] border border-[#6B7280]/30 rounded-xl text-sm text-white placeholder:text-[#6B7280] focus:outline-none focus:border-[#E84A0C] font-sans transition-all duration-300"
            />
          </div>

          <div className="text-xs font-mono text-[#6B7280]">
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
                  ? "bg-[#E84A0C] text-white font-bold shadow-md"
                  : "bg-[#0D0D0D] text-[#6B7280] hover:text-white border border-[#6B7280]/30"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Member Cards Grid or Clean Empty State */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={{
                id: member.id,
                name: member.name || member.fullName,
                role: member.role || member.title || "عضو متطوع",
                department: member.department || member.departmentName || "عام",
                avatarUrl: member.avatarUrl || member.photoUrl,
                photoUrl: member.photoUrl || member.avatarUrl,
                volunteerHours: member.volunteerHours || 0,
              }}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center border border-dashed border-[#6B7280]/30 bg-[#0D0D0D] space-y-3">
          <Users className="w-10 h-10 text-[#6B7280] mx-auto" />
          <h3 className="font-display text-base font-bold text-white">
            لا يوجد أعضاء حالياً
          </h3>
          <p className="text-xs text-[#6B7280] max-w-md mx-auto">
            سيتم عرض دليل أعضاء الفريق الكادر فور اعتماد وتسجيل بيانات الأعضاء في القاعدة.
          </p>
        </Card>
      )}

    </div>
  );
}
