"use client";

import React, { useState, useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createUserAction } from "@/app/actions/user-actions";
import { UserPlus, ShieldCheck, X, AlertCircle } from "lucide-react";

export function AdminUserDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    const res = await createUserAction(prevState, formData);
    if (res.success) {
      setOpen(false);
    }
    return res;
  }, null);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="sm"
        className="gap-2 bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl shadow-md"
      >
        <UserPlus className="w-4 h-4" />
        <span>إضافة مستخدم جديد</span>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl p-6 shadow-2xl space-y-6 text-white">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#1A2B4A] border border-[#6B7280]/20 text-[#E84A0C]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base">
                    إنشاء حساب مستخدم جديد
                  </h3>
                  <p className="text-xs text-[#6B7280] font-mono">
                    Assign System Role & Credentials
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-[#6B7280] hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {state?.error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 font-sans">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{state.error}</span>
              </div>
            )}

            {/* Form */}
            <form action={formAction} className="space-y-4 text-xs font-sans">
              
              <div>
                <label className="block text-[#6B7280] font-medium mb-1">
                  الاسم الكامل (Full Name) *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="مثال: أحمد حسن"
                  className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                />
              </div>

              <div>
                <label className="block text-[#6B7280] font-medium mb-1">
                  البريد الإلكتروني (Email Address) *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="user@mywebsite.com"
                  className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white font-mono focus:outline-none focus:border-[#E84A0C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#6B7280] font-medium mb-1">
                    كلمة المرور (Password) *
                  </label>
                  <input
                    type="text"
                    name="password"
                    defaultValue="adminpassword123"
                    required
                    className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white font-mono focus:outline-none focus:border-[#E84A0C]"
                  />
                </div>

                <div>
                  <label className="block text-[#6B7280] font-medium mb-1">
                    الدور والصلاحية (RBAC Role) *
                  </label>
                  <select
                    name="role"
                    defaultValue="MEMBER"
                    className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white font-mono focus:outline-none focus:border-[#E84A0C]"
                  >
                    <option value="ADMIN">ADMIN (مدير النظام)</option>
                    <option value="HR_EDITOR">HR_EDITOR (الموارد البشرية)</option>
                    <option value="POST_EDITOR">POST_EDITOR (المحرر العام)</option>
                    <option value="AUTHOR">AUTHOR (كاتب / باحث)</option>
                    <option value="MEMBER">MEMBER (عضو فريق)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#6B7280] font-medium mb-1">
                  المسمى الوظيفي (Title)
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="مثال: Software Engineer / Research Assistant"
                  className="w-full h-10 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#6B7280]/20">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border-[#6B7280]/30 text-white"
                >
                  إلغاء
                </Button>

                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending}
                  className="bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl shadow-md"
                >
                  {isPending ? "جاري الإنشـاء..." : "تأكيد وإنشاء الحساب"}
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}
    </>
  );
}
