import React from "react";
import { getSession } from "@/lib/auth/session";
import { getAdminApplicationsList } from "@/app/actions/application-actions";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApplicationReviewPanel } from "@/components/admin/application-review-panel";
import { ApplicationStatus } from "@prisma/client";
import {
  UserCheck,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default async function AdminApplicationsPage() {
  const session = await getSession();
  const applications = await getAdminApplicationsList();

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="dark" className="bg-amber-500/15 text-amber-400 border-amber-500/30">قيد الانتظار</Badge>;
      case "UNDER_REVIEW":
        return <Badge variant="dark" className="bg-purple-500/15 text-purple-400 border-purple-500/30">قيد المراجعة</Badge>;
      case "INTERVIEW_SCHEDULED":
        return <Badge variant="dark" className="bg-blue-500/15 text-blue-400 border-blue-500/30">تم تحديد مقابلة</Badge>;
      case "ACCEPTED":
        return <Badge variant="dark" className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">مقبول</Badge>;
      case "REJECTED":
        return <Badge variant="dark" className="bg-red-500/15 text-red-400 border-red-500/30">مرفوض</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <SectionHeader
        badgeText="مسار القبول والتوظيف"
        title="طلبات انضمام"
        highlightedTitle="المرشحين الجدد"
        description="مراجعة طلبات الانضمام التطوعي، تقييم الخبرات الأكاديمية والمهارات، ومتابعة المقابلات وحالات القبول."
      />

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-brand-dark-900/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-brand-gray-400 font-sans">إجمالي الطلبات</p>
            <p className="text-xl font-bold font-mono text-white mt-0.5">{applications.length}</p>
          </div>
          <UserCheck className="w-5 h-5 text-brand-orange" />
        </Card>

        <Card className="p-4 bg-brand-dark-900/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-brand-gray-400 font-sans">طلبات قيد المراجعة</p>
            <p className="text-xl font-bold font-mono text-amber-400 mt-0.5">
              {applications.filter((a) => a.status === "PENDING" || a.status === "UNDER_REVIEW").length}
            </p>
          </div>
          <Clock className="w-5 h-5 text-amber-400" />
        </Card>

        <Card className="p-4 bg-brand-dark-900/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-brand-gray-400 font-sans">الأعضاء المقبولين</p>
            <p className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
              {applications.filter((a) => a.status === "ACCEPTED").length}
            </p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </Card>

        <Card className="p-4 bg-brand-dark-900/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-brand-gray-400 font-sans">الطلبات الاعتذار عنها</p>
            <p className="text-xl font-bold font-mono text-red-400 mt-0.5">
              {applications.filter((a) => a.status === "REJECTED").length}
            </p>
          </div>
          <XCircle className="w-5 h-5 text-red-400" />
        </Card>
      </div>

      {/* Applications Data Table */}
      <Card className="p-0 bg-brand-dark-900/80 border-brand-dark-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            
            <thead className="bg-brand-dark-850 border-b border-brand-dark-800 text-brand-gray-400 font-mono uppercase tracking-wider">
              <tr>
                <th className="p-4">اسم المرشح والتواصل</th>
                <th className="p-4">القسم المستهدف</th>
                <th className="p-4">الخلفية الأكاديمية والمهارات</th>
                <th className="p-4">حالة الطلب</th>
                <th className="p-4">تاريخ التقديم</th>
                <th className="p-4 text-left">مراجعة الطلب</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-brand-dark-800/60">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-brand-dark-850/50 transition-colors">
                  
                  {/* Name & Contact */}
                  <td className="p-4">
                    <p className="font-display font-bold text-white text-sm">
                      {app.fullName}
                    </p>
                    <p className="text-brand-gray-400 font-mono text-[11px]">
                      {app.email} • {app.phone}
                    </p>
                  </td>

                  {/* Department */}
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-brand-dark-850 text-brand-gray-300 border border-brand-dark-800">
                      {app.departmentName}
                    </span>
                  </td>

                  {/* Education */}
                  <td className="p-4 text-brand-gray-300 font-sans max-w-xs truncate">
                    {app.education}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    {getStatusBadge(app.status as ApplicationStatus)}
                  </td>

                  {/* Applied Date */}
                  <td className="p-4 font-mono text-brand-gray-500 text-[11px]">
                    {new Date(app.createdAt).toLocaleDateString("ar-EG")}
                  </td>

                  {/* Action Panel Button */}
                  <td className="p-4 text-left">
                    <ApplicationReviewPanel application={app} />
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
