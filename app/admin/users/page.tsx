import React from "react";
import { getSession } from "@/lib/auth/session";
import { getAdminUsersList } from "@/app/actions/user-actions";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminUserDialog } from "@/components/admin/admin-user-dialog";
import { AdminDeleteUserButton } from "@/components/admin/admin-delete-user-button";
import { redirect } from "next/navigation";
import { ShieldCheck, UserCheck, KeyRound, ShieldAlert } from "lucide-react";

export default async function AdminUsersPage() {
  const session = await getSession();

  // Strict Master Admin Only protection
  if (!session || !session.roles.includes("ADMIN")) {
    redirect("/admin/dashboard");
  }

  const users = await getAdminUsersList();

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge variant="orange" className="font-mono text-[10px]">Master Admin</Badge>;
      case "HR_EDITOR":
        return <Badge variant="dark" className="bg-blue-500/15 text-blue-400 border-blue-500/30 text-[10px]">HR Editor</Badge>;
      case "POST_EDITOR":
        return <Badge variant="dark" className="bg-purple-500/15 text-purple-400 border-purple-500/30 text-[10px]">Post Editor</Badge>;
      case "AUTHOR":
        return <Badge variant="dark" className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">Writer / Author</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px]">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <SectionHeader
        badgeText="إدارة الوصول والأمان التنفيذي"
        title="إدارة الحسابات"
        highlightedTitle="والصلاحيات (RBAC)"
        description="لوحة خاصة بحساب Master Admin لإضافة حسابات المستخدمين الجديدة، تعيين أدوار النظام (HR, Writer, Editor, Admin)، وإدارة الوصول الأمني."
        action={<AdminUserDialog />}
      />

      {/* Role Notice Banner */}
      <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#6B7280]/20 flex items-center justify-between text-xs font-mono">
        <span className="text-[#6B7280]">
          مسجل الدخول بصفة Master Admin: <strong className="text-white">{session.fullName}</strong> ({session.email})
        </span>
        <span className="text-[#E84A0C] flex items-center gap-1">
          <ShieldAlert className="w-4 h-4 text-[#E84A0C]" />
          منطقة تحكم أمنية محمية 100%
        </span>
      </div>

      {/* Users Data Table Container */}
      <Card className="p-0 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            
            {/* Header */}
            <thead className="bg-[#1A2B4A] border-b border-[#6B7280]/20 text-[#6B7280] font-mono uppercase tracking-wider">
              <tr>
                <th className="p-4">اسم المستخدم والبريد الإلكتروني</th>
                <th className="p-4">الصلاحيات الممنوحة (Roles)</th>
                <th className="p-4">تاريخ الإنشاء</th>
                <th className="p-4 text-left">الإجراءات</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-[#6B7280]/20">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#1A2B4A]/40 transition-colors">
                  
                  {/* Name & Email */}
                  <td className="p-4">
                    <p className="font-display font-bold text-white text-sm">
                      {u.fullName}
                    </p>
                    <p className="text-[#6B7280] font-mono text-[11px]">
                      {u.email}
                    </p>
                  </td>

                  {/* Roles */}
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1.5">
                      {u.roles.map((r) => (
                        <React.Fragment key={r}>{getRoleBadge(r)}</React.Fragment>
                      ))}
                    </div>
                  </td>

                  {/* Created Date */}
                  <td className="p-4 font-mono text-[#6B7280] text-[11px]">
                    {new Date(u.createdAt).toLocaleDateString("ar-SA")}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-left">
                    {u.id !== session.userId ? (
                      <AdminDeleteUserButton userId={u.id} userName={u.fullName} />
                    ) : (
                      <span className="text-emerald-400 font-mono text-[10px]">حسابك الحالي</span>
                    )}
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
