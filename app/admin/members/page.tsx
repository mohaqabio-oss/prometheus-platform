import React from "react";
import Link from "next/link";
import { getAdminMembersList } from "@/app/actions/hr-actions";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MemberDialog } from "@/components/admin/member-dialog";
import { AdminDeleteMemberButton } from "@/components/admin/admin-delete-member-button";
import { AdminLogHoursButton } from "@/components/admin/admin-log-hours-button";
import {
  Users,
  Award,
  Clock,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export default async function AdminMembersPage() {
  const members = await getAdminMembersList();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <SectionHeader
        badgeText="سجل الموارد البشرية والأعضاء"
        title="إدارة كادر"
        highlightedTitle="فريق بروميثيوس"
        description="متابعة كادر المتطوعين النشطين، توزيع المهام حسب الأقسام، تسجيل الساعات التطوعية، وإصدار الشهادات الرسمية."
        action={<MemberDialog mode="create" />}
      />

      {/* Roster Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-[#0D0D0D] flex items-center gap-3 border border-[#6B7280]/20 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/20 flex items-center justify-center text-[#E84A0C]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#6B7280] font-sans">الأعضاء النشطين</p>
            <p className="text-xl font-bold font-mono text-white mt-0.5">{members.length} عضو</p>
          </div>
        </Card>

        <Card className="p-4 bg-[#0D0D0D] flex items-center gap-3 border border-[#6B7280]/20 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/20 flex items-center justify-center text-[#E84A0C]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#6B7280] font-sans">إجمالي الساعات التطوعية</p>
            <p className="text-xl font-bold font-mono text-white mt-0.5">
              {members.reduce((acc, m) => acc + m.volunteerHours, 0)} ساعة
            </p>
          </div>
        </Card>

        <Card className="p-4 bg-[#0D0D0D] flex items-center gap-3 border border-[#6B7280]/20 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/20 flex items-center justify-center text-[#E84A0C]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#6B7280] font-sans">الشهادات الموثقة الممنوحة</p>
            <p className="text-xl font-bold font-mono text-white mt-0.5">
              {members.filter((m) => m.certificateCode).length} شهادة
            </p>
          </div>
        </Card>
      </div>

      {/* Data Table Container */}
      <Card className="p-0 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            
            {/* Header */}
            <thead className="bg-[#1A2B4A] border-b border-[#6B7280]/20 text-[#6B7280] font-mono uppercase tracking-wider">
              <tr>
                <th className="p-4">اسم العضو والبريد</th>
                <th className="p-4">المسمى الوظيفي / الدور</th>
                <th className="p-4">القسم التخصصي</th>
                <th className="p-4">حالة العضوية</th>
                <th className="p-4">الساعات الموثقة</th>
                <th className="p-4">رمز الشهادة</th>
                <th className="p-4 text-left">الإجراءات</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-[#6B7280]/20">
              {members.map((mem) => (
                <tr key={mem.id} className="hover:bg-[#1A2B4A]/40 transition-colors">
                  
                  {/* Name & Email */}
                  <td className="p-4">
                    <p className="font-display font-bold text-white text-sm">
                      {mem.fullName}
                    </p>
                    <p className="text-[#6B7280] font-mono text-[11px]">
                      {mem.email}
                    </p>
                  </td>

                  {/* Title */}
                  <td className="p-4 font-medium text-white">
                    {mem.title}
                  </td>

                  {/* Department */}
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-xl font-mono text-[10px] bg-[#1A2B4A] text-white border border-[#6B7280]/30">
                      {mem.departmentName}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <Badge variant="orange" className="text-[10px]">
                      {mem.status === "ACTIVE" ? "عضو نشط" : mem.status}
                    </Badge>
                  </td>

                  {/* Logged Hours */}
                  <td className="p-4 font-mono text-white font-bold text-sm">
                    {mem.volunteerHours} ساعة
                  </td>

                  {/* Certificate Link */}
                  <td className="p-4">
                    {mem.certificateCode ? (
                      <Link
                        href={`/verify/${mem.certificateCode}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 hover:underline"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{mem.certificateCode}</span>
                        <ExternalLink className="w-3 h-3 text-[#6B7280]" />
                      </Link>
                    ) : (
                      <span className="text-[#6B7280] font-mono text-[11px]">غير مـصدر</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-left">
                    <div className="flex items-center justify-end gap-2">
                      <AdminLogHoursButton memberId={mem.id} memberName={mem.fullName} />
                      <MemberDialog mode="edit" member={mem} />
                      <AdminDeleteMemberButton memberId={mem.id} memberName={mem.fullName} />
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </Card>

    </div>
  );
}
