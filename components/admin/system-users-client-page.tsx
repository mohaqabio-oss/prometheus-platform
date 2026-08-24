"use client";

import React, { useState } from "react";
import { AdminUserItem, deleteUserAction, resetUserPasswordAction } from "@/app/actions/user-actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  UserPlus,
  KeyRound,
  Trash2,
  Lock,
  Mail,
  User,
  Shield,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface SystemUsersClientPageProps {
  users: AdminUserItem[];
  currentUserId: string;
}

export function SystemUsersClientPage({ users, currentUserId }: SystemUsersClientPageProps) {
  const [resetModalUser, setResetModalUser] = useState<AdminUserItem | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalUser) return;

    setResetLoading(true);
    setResetError(null);
    setResetSuccess(false);

    try {
      const res = await resetUserPasswordAction(resetModalUser.id, newPassword);
      if (res.error) {
        setResetError(res.error);
      } else {
        setResetSuccess(true);
        setTimeout(() => {
          setResetModalUser(null);
          setNewPassword("");
          setResetSuccess(false);
        }, 1500);
      }
    } catch (err: any) {
      setResetError(err.message || "حدث خطأ أثناء تعيين كلمة المرور.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUserId) {
      alert("لا يمكنك حذف حسابك الحالي.");
      return;
    }
    if (!confirm("هل أنت تأكد من رغبتك في حذف هذا الحساب الإداري نهائياً؟")) {
      return;
    }

    setDeletingId(userId);
    try {
      await deleteUserAction(userId);
    } catch (err: any) {
      alert(err.message || "فشل حذف الحساب.");
    } finally {
      setDeletingId(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge variant="orange" className="text-[10px] gap-1 font-mono">
            <Shield className="w-3 h-3" />
            <span>Master Admin</span>
          </Badge>
        );
      case "HR_EDITOR":
        return (
          <Badge variant="dark" className="text-[10px] bg-purple-500/20 text-purple-300 border-purple-500/30 font-mono">
            HR Manager
          </Badge>
        );
      case "WRITER":
      case "POST_EDITOR":
        return (
          <Badge variant="dark" className="text-[10px] bg-sky-500/20 text-sky-300 border-sky-500/30 font-mono">
            Content Writer
          </Badge>
        );
      default:
        return (
          <Badge variant="dark" className="text-[10px] font-mono text-[#6B7280]">
            Member Account
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-white max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#6B7280]/20 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="orange" className="text-xs">
              منطقة مدير النظام (Master Admin Only)
            </Badge>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
            سجل حسابات النظام ولوحة المدراء
          </h1>
          <p className="text-xs text-[#6B7280] font-sans">
            إدارة الحسابات الأمنية المسجلة في النظام وعزلها تماماً عن دليل الأعضاء العام.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 text-xs font-mono text-emerald-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>إجمالي الحسابات: {users.length}</span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <Card className="p-6 bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl shadow-xl overflow-hidden space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs font-sans">
            <thead>
              <tr className="border-b border-[#6B7280]/20 text-[#6B7280] font-mono text-[11px]">
                <th className="py-3 px-4">المستخدم / البريد الإلكتروني</th>
                <th className="py-3 px-4">الصلاحية المنظومية</th>
                <th className="py-3 px-4">حالة كلمة المرور</th>
                <th className="py-3 px-4">تاريخ الإنشاء</th>
                <th className="py-3 px-4 text-center">الإجراءات الأمنية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#6B7280]/10">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#6B7280] font-mono">
                    لا توجد حسابات مسجلة في النظام حالياً.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#1A2B4A]/30 transition-colors">
                    
                    {/* User Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/30 flex items-center justify-center text-[#E84A0C] font-mono text-xs font-bold shrink-0">
                          {u.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{u.fullName}</p>
                          <p className="text-[11px] font-mono text-[#6B7280] flex items-center gap-1">
                            <Mail className="w-3 h-3 text-[#6B7280]" />
                            <span>{u.email}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-4">
                      {getRoleBadge(u.role)}
                    </td>

                    {/* Encrypted Password Note */}
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141C2F] border border-[#6B7280]/20 text-[11px] font-mono text-[#6B7280]">
                        <Lock className="w-3 h-3 text-emerald-400" />
                        <span>●●●●●●●● (مشفّرة بنظام Bcrypt)</span>
                      </div>
                    </td>

                    {/* Date Created */}
                    <td className="py-4 px-4 font-mono text-[#6B7280]">
                      {new Date(u.createdAt).toLocaleDateString("ar-EG")}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        
                        {/* Reset Password Button */}
                        <Button
                          onClick={() => setResetModalUser(u)}
                          variant="outline"
                          size="sm"
                          className="h-8 px-2.5 gap-1.5 text-xs rounded-xl border-[#6B7280]/30 text-white hover:text-[#E84A0C]"
                          title="إعادة تعيين كلمة المرور"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-[#E84A0C]" />
                          <span>إعادة تعيين كلمة المرور</span>
                        </Button>

                        {/* Delete User Button */}
                        {u.id !== currentUserId && (
                          <Button
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={deletingId === u.id}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                            title="حذف الحساب"
                          >
                            {deletingId === u.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        )}

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Reset Password Dialog Modal */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#0D0D0D] border border-[#6B7280]/30 rounded-2xl p-6 shadow-2xl space-y-6 text-white">
            
            <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#E84A0C]" />
                <h3 className="font-display font-bold text-white text-base">
                  إعادة تعيين كلمة المرور للحساب
                </h3>
              </div>
              <button
                onClick={() => setResetModalUser(null)}
                className="text-[#6B7280] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/20 text-xs space-y-1">
              <p className="text-[#6B7280]">الحساب المستهدف:</p>
              <p className="font-bold text-white">{resetModalUser.fullName} ({resetModalUser.email})</p>
            </div>

            {resetSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>تم تحديث كلمة المرور بنجاح!</span>
              </div>
            )}

            {resetError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4 text-xs font-sans">
              <div className="space-y-1.5">
                <label className="block text-[#6B7280] font-medium">كلمة المرور الجديدة</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="أدخل كلمة مرور جديدة لا تقل عن 6 أحرف..."
                  className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#6B7280]/20">
                <Button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  variant="ghost"
                  className="text-[#6B7280] hover:text-white"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={resetLoading}
                  className="bg-[#E84A0C] hover:bg-[#D03E06] text-white gap-2 rounded-xl"
                >
                  {resetLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>تحديث كلمة المرور</span>
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
