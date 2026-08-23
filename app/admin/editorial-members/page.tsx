import React from "react";
import Link from "next/link";
import { getEditorialMembers } from "@/app/actions/editorial-actions";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EditorialMemberDialog } from "@/components/admin/editorial-member-dialog";
import { AdminDeleteEditorialButton } from "@/components/admin/admin-delete-editorial-button";
import {
  BookOpen,
  GraduationCap,
  Award,
  Globe,
  ExternalLink,
  UserCheck,
} from "lucide-react";

export default async function AdminEditorialMembersPage() {
  const members = await getEditorialMembers();

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <SectionHeader
        badgeText="إدارة هيئة التحرير والأكاديميين"
        title="هيئة تحرير"
        highlightedTitle="مجلة بروميثيوس المحكمة"
        description="إدارة السجلات والملفات الشخصية والأبحاث لأعضاء هيئة التحرير والمحكمين الدوليين، المعتمدة في معايير ISSN والتوثيق الأكاديمي."
        action={<EditorialMemberDialog mode="create" />}
      />

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-[#0D0D0D] flex items-center gap-3 border border-[#6B7280]/20 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/20 flex items-center justify-center text-[#E84A0C]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#6B7280] font-sans">إجمالي أعضاء الهيئة</p>
            <p className="text-xl font-bold font-mono text-white mt-0.5">{members.length} عضو</p>
          </div>
        </Card>

        <Card className="p-4 bg-[#0D0D0D] flex items-center gap-3 border border-[#6B7280]/20 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/20 flex items-center justify-center text-[#E84A0C]">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#6B7280] font-sans">الجامعات والمؤسسات الممثلة</p>
            <p className="text-xl font-bold font-mono text-white mt-0.5">
              {new Set(members.map((m) => m.university).filter(Boolean)).size} جامعة
            </p>
          </div>
        </Card>

        <Card className="p-4 bg-[#0D0D0D] flex items-center gap-3 border border-[#6B7280]/20 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/20 flex items-center justify-center text-[#E84A0C]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#6B7280] font-sans">التخصصات الأكاديمية</p>
            <p className="text-xl font-bold font-mono text-white mt-0.5">
              {new Set(members.map((m) => m.specialty).filter(Boolean)).size} تخصص
            </p>
          </div>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="p-0 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            
            {/* Table Header */}
            <thead className="bg-[#1A2B4A] border-b border-[#6B7280]/20 text-[#6B7280] font-mono uppercase tracking-wider">
              <tr>
                <th className="p-4">العضو الأكاديمي</th>
                <th className="p-4">الرتبة الأكاديمية</th>
                <th className="p-4">الجامعة / المؤسسة</th>
                <th className="p-4">التخصص الدقيق</th>
                <th className="p-4">معرف ORCID</th>
                <th className="p-4">الترتيب</th>
                <th className="p-4 text-left">الإجراءات</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[#6B7280]/20">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#6B7280]">
                    لا يوجد أعضاء مضافين في هيئة التحرير حتى الآن. انقر فوق "إضافة عضو هيئة تحرير" للبدء.
                  </td>
                </tr>
              ) : (
                members.map((mem) => (
                  <tr key={mem.id} className="hover:bg-[#1A2B4A]/40 transition-colors">
                    
                    {/* Member Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={mem.avatarUrl}
                          name={mem.fullName}
                          size="sm"
                        />
                        <div>
                          <p className="font-display font-bold text-white text-sm">
                            {mem.fullName}
                          </p>
                          {mem.bio && (
                            <p className="text-[#6B7280] font-sans text-[11px] line-clamp-1 max-w-xs">
                              {mem.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Academic Rank */}
                    <td className="p-4 font-medium text-white">
                      <Badge variant="orange" className="text-[10px]">
                        {mem.academicRank || "محرر محكم"}
                      </Badge>
                    </td>

                    {/* University */}
                    <td className="p-4">
                      <span className="font-sans text-white text-xs">
                        {mem.university || "—"}
                      </span>
                    </td>

                    {/* Specialty */}
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-xl font-mono text-[10px] bg-[#1A2B4A] text-white border border-[#6B7280]/30">
                        {mem.specialty || "عام"}
                      </span>
                    </td>

                    {/* ORCID */}
                    <td className="p-4">
                      {mem.orcidUrl ? (
                        <Link
                          href={mem.orcidUrl}
                          target="_blank"
                          className="inline-flex items-center gap-1 font-mono text-[11px] text-[#E84A0C] hover:underline"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>ORCID</span>
                          <ExternalLink className="w-3 h-3 text-[#6B7280]" />
                        </Link>
                      ) : (
                        <span className="text-[#6B7280] font-mono text-[11px]">غير مضاف</span>
                      )}
                    </td>

                    {/* Order */}
                    <td className="p-4 font-mono text-white font-bold">
                      #{mem.order}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-left">
                      <div className="flex items-center justify-end gap-2">
                        <EditorialMemberDialog mode="edit" member={mem} />
                        <AdminDeleteEditorialButton memberId={mem.id} memberName={mem.fullName} />
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </Card>

    </div>
  );
}
