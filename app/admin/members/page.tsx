import React from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getAdminMembersList } from "@/app/actions/hr-actions";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminAddMemberDialog } from "@/components/admin/admin-add-member-dialog";
import { AdminLogHoursButton } from "@/components/admin/admin-log-hours-button";
import {
  Users,
  Award,
  Clock,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export default async function AdminMembersPage() {
  const session = await getSession();
  const members = await getAdminMembersList();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <SectionHeader
        badgeText="سجل الموارد البشرية والأعضاء"
        title="إدارة كادر"
        highlightedTitle="فريق بروميثيوس"
        description="متابعة كادر المتطوعين النشطين، توزيع المهام حسب الأقسام، تسجيل الساعات التطوعية، وإصدار الشهادات الرسمية."
        action={<AdminAddMemberDialog />}
      />

      {/* Roster Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-brand-dark-900/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-dark-850 border border-brand-dark-800 flex items-center justify-center text-brand-orange">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-brand-gray-400 font-sans">الأعضاء النشطين</p>
            <p className="text-xl font-bold font-mono text-white mt-0.5">{members.length} عضو</p>
          </div>
        </Card>

        <Card className="p-4 bg-brand-dark-900/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-dark-850 border border-brand-dark-800 flex items-center justify-center text-brand-orange">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-brand-gray-400 font-sans">إجمالي الساعات التطوعية</p>
            <p className="text-xl font-bold font-mono text-white mt-0.5">
              {members.reduce((acc, m) => acc + m.volunteerHours, 0)} ساعة
            </p>
          </div>
        </Card>

        <Card className="p-4 bg-brand-dark-900/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-dark-850 border border-brand-dark-800 flex items-center justify-center text-brand-orange">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-brand-gray-400 font-sans">الشهادات الموثقة الممنوحة</p>
            <p className="text-xl font-bold font-mono text-white mt-0.5">
              {members.filter((m) => m.certificateCode).length} شهادة
            </p>
          </div>
        </Card>
      </div>

      {/* Data Table Container */}
      <Card className="p-0 bg-brand-dark-900/80 border-brand-dark-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            
            {/* Header */}
            <thead className="bg-brand-dark-850 border-b border-brand-dark-800 text-brand-gray-400 font-mono uppercase tracking-wider">
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
            <tbody className="divide-y divide-brand-dark-800/60">
              {members.map((mem) => (
                <tr key={mem.id} className="hover:bg-brand-dark-850/50 transition-colors">
                  
                  {/* Name & Email */}
                  <td className="p-4">
                    <p className="font-display font-bold text-white text-sm">
                      {mem.fullName}
                    </p>
                    <p className="text-brand-gray-500 font-mono text-[11px]">
                      {mem.email}
                    </p>
                  </td>

                  {/* Title */}
                  <td className="p-4 font-medium text-brand-gray-300">
                    {mem.title}
                  </td>

                  {/* Department */}
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-brand-dark-850 text-brand-gray-400 border border-brand-dark-800">
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
                        <ExternalLink className="w-3 h-3 text-brand-gray-500" />
                      </Link>
                    ) : (
                      <span className="text-brand-gray-600 font-mono text-[11px]">غير مـصدر</span>
                    )}
                  </td>

                  {/* Log Hours Button */}
                  <td className="p-4 text-left">
                    <AdminLogHoursButton memberId={mem.id} memberName={mem.fullName} />
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
