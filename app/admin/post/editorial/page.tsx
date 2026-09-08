import React from "react";
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
  Users,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminEditorialPostManagerPage() {
  const members = await getEditorialMembers();

  const uniqueInstitutions = new Set(
    members.map((m) => m.institution || m.university).filter(Boolean)
  ).size;

  const uniqueRoles = new Set(
    members.map((m) => m.role || m.academicRank).filter(Boolean)
  ).size;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <SectionHeader
        badgeText="إدارة هيئة تحرير Prometheus Post"
        title="الهيئة التحريرية"
        highlightedTitle="والأكاديمية للمجلة"
        description="إدارة وتحديث بيانات وسجلات أعضاء هيئة التحرير والمحكمين المعتمدين لمجلة بروميثيوس الأكاديمية (The Prometheus Post)."
        action={<EditorialMemberDialog mode="create" />}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-[#0D0D0D] flex items-center gap-3 border border-[#6B7280]/20 rounded-2xl shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/20 flex items-center justify-center text-[#E84A0C]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#6B7280] font-sans">إجمالي أعضاء الهيئة</p>
            <p className="text-xl font-bold font-mono text-white mt-0.5">{members.length} عضو</p>
          </div>
        </Card>

        <Card className="p-4 bg-[#0D0D0D] flex items-center gap-3 border border-[#6B7280]/20 rounded-2xl shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/20 flex items-center justify-center text-amber-500">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#6B7280] font-sans">المؤسسات والجامعات</p>
            <p className="text-xl font-bold font-mono text-white mt-0.5">
              {uniqueInstitutions} جامعة / مؤسسة
            </p>
          </div>
        </Card>

        <Card className="p-4 bg-[#0D0D0D] flex items-center gap-3 border border-[#6B7280]/20 rounded-2xl shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/20 flex items-center justify-center text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#6B7280] font-sans">المسميات والصفات التحريرية</p>
            <p className="text-xl font-bold font-mono text-white mt-0.5">
              {uniqueRoles} مسمى
            </p>
          </div>
        </Card>
      </div>

      {/* Members Data Table */}
      <Card className="p-0 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            {/* Table Header */}
            <thead className="bg-[#1A2B4A] border-b border-[#6B7280]/20 text-[#6B7280] font-mono uppercase tracking-wider">
              <tr>
                <th className="p-4">العضو الأكاديمي</th>
                <th className="p-4">الصفة التحريرية / الرتبة</th>
                <th className="p-4">الجامعة / جهة الانتساب</th>
                <th className="p-4">النبذة العلمية</th>
                <th className="p-4">الترتيب</th>
                <th className="p-4 text-left">الإجراءات</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[#6B7280]/20">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-[#6B7280] space-y-2">
                    <BookOpen className="w-8 h-8 text-[#6B7280]/60 mx-auto" />
                    <p>لا يوجد أعضاء مضافين في هيئة التحرير حتى الآن.</p>
                    <p className="text-[11px]">انقر فوق &quot;إضافة عضو هيئة تحرير&quot; للبدء.</p>
                  </td>
                </tr>
              ) : (
                members.map((mem) => {
                  const memName = mem.name || mem.fullName || "عضو";
                  const memRole = mem.role || mem.academicRank || "محرر";
                  const memInst = mem.institution || mem.university || "—";

                  return (
                    <tr key={mem.id} className="hover:bg-[#1A2B4A]/40 transition-colors">
                      {/* Name & Avatar */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={mem.avatarUrl}
                            name={memName}
                            size="sm"
                          />
                          <div>
                            <p className="font-display font-bold text-white text-sm">
                              {memName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="p-4">
                        <Badge variant="orange" className="text-[11px]">
                          {memRole}
                        </Badge>
                      </td>

                      {/* Institution */}
                      <td className="p-4">
                        <span className="font-sans text-white text-xs">
                          {memInst}
                        </span>
                      </td>

                      {/* Bio */}
                      <td className="p-4 max-w-xs">
                        {mem.bio ? (
                          <p className="text-[#6B7280] font-sans text-xs line-clamp-2">
                            {mem.bio}
                          </p>
                        ) : (
                          <span className="text-[#6B7280] text-xs">—</span>
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
                          <AdminDeleteEditorialButton
                            memberId={mem.id}
                            memberName={memName}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
