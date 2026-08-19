import React from "react";
import { getAdminUsersList } from "@/app/actions/user-actions";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminUserDialog } from "@/components/admin/admin-user-dialog";
import { UserRoleSelector } from "@/components/admin/user-role-selector";
import { UserCog, ShieldCheck, Users, ShieldAlert, KeyRound } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await getAdminUsersList();

  const adminCount = users.filter((u) => u.roles.includes("ADMIN")).length;
  const editorCount = users.filter((u) =>
    u.roles.some((r) => r === "HR_EDITOR" || r === "POST_EDITOR")
  ).length;
  const memberCount = users.filter((u) => u.roles.includes("MEMBER")).length;

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <SectionHeader
        badgeText="Security & Access Control"
        title="إدارة الحسابات و"
        highlightedTitle="صلاحيات الأدوار"
        description="إدارة حسابات مستخدمي النظام، منح أدوار الوصول (RBAC)، وإنشاء حسابات الكادر الإداري والتطوعي."
        action={<AdminUserDialog />}
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-brand-dark-900/80 flex items-center gap-3 border-brand-dark-800">
          <div className="w-10 h-10 rounded-lg bg-brand-dark-850 border border-brand-dark-800 flex items-center justify-center text-brand-orange">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-brand-gray-400 font-sans">إجمالي حسابات النظام</p>
            <p className="text-xl font-bold font-mono text-foreground dark:text-white mt-0.5">{users.length} حساب</p>
          </div>
        </Card>

        <Card className="p-4 bg-brand-dark-900/80 flex items-center gap-3 border-brand-dark-800">
          <div className="w-10 h-10 rounded-lg bg-brand-dark-850 border border-brand-dark-800 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-brand-gray-400 font-sans">مدراء النظام (Admins)</p>
            <p className="text-xl font-bold font-mono text-foreground dark:text-white mt-0.5">{adminCount} مدير</p>
          </div>
        </Card>

        <Card className="p-4 bg-brand-dark-900/80 flex items-center gap-3 border-brand-dark-800">
          <div className="w-10 h-10 rounded-lg bg-brand-dark-850 border border-brand-dark-800 flex items-center justify-center text-indigo-400">
            <UserCog className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-brand-gray-400 font-sans">المحررون والكادر (Editors)</p>
            <p className="text-xl font-bold font-mono text-foreground dark:text-white mt-0.5">{editorCount} محرر</p>
          </div>
        </Card>
      </div>

      {/* User Accounts Table */}
      <Card className="p-0 bg-brand-dark-900/80 border-brand-dark-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            
            <thead className="bg-brand-dark-850 border-b border-brand-dark-800 text-brand-gray-400 font-mono uppercase tracking-wider">
              <tr>
                <th className="p-4">اسم العضو والبريد الإلكتروني</th>
                <th className="p-4">المسمى الوظيفي</th>
                <th className="p-4">الدور الحالي (RBAC Role)</th>
                <th className="p-4">تاريخ التسجيل</th>
                <th className="p-4 text-left">تعديل الصلاحية</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-brand-dark-800/60 font-sans">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-brand-dark-850/50 transition-colors">
                  
                  {/* Name & Email */}
                  <td className="p-4">
                    <p className="font-display font-bold text-foreground dark:text-white text-sm">
                      {user.fullName || "Unlinked User"}
                    </p>
                    <p className="text-brand-gray-500 font-mono text-[11px]">
                      {user.email}
                    </p>
                  </td>

                  {/* Title */}
                  <td className="p-4 text-brand-gray-300 font-medium">
                    {user.title || "عضو متطوع"}
                  </td>

                  {/* Role Badge */}
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <Badge
                          key={role}
                          variant={role === "ADMIN" ? "orange" : "dark"}
                          className="text-[10px] font-mono"
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </td>

                  {/* Registered Date */}
                  <td className="p-4 font-mono text-brand-gray-400 text-[11px]">
                    {new Date(user.createdAt).toLocaleDateString("ar-EG")}
                  </td>

                  {/* Role Selector Actions */}
                  <td className="p-4 text-left">
                    <UserRoleSelector userId={user.id} currentRole={user.roles[0] || "MEMBER"} />
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
