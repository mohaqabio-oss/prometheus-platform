"use client";

import React, { useState, useActionState } from "react";
import { createUserAction } from "@/app/actions/user-actions";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, X, Loader2, ShieldCheck, AlertCircle } from "lucide-react";

export function AdminUserDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const res = await createUserAction(prevState, formData);
      if (res?.success) {
        setOpen(false);
      }
      return res;
    },
    null
  );

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="gap-2 bg-brand-orange text-white hover:bg-brand-orange/90 text-xs shadow-lg cursor-pointer"
      >
        <UserPlus className="w-4 h-4" />
        <span>إضافة حساب جديد (Add User)</span>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-brand-dark-900 border border-brand-dark-800 rounded-2xl p-6 shadow-2xl space-y-6 text-foreground">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-brand-dark-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-brand-dark-850 border border-brand-dark-800 text-brand-orange">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground dark:text-white text-base">
                    إنشاء حساب مستخدم جديد
                  </h3>
                  <p className="text-xs text-brand-gray-400 font-mono">
                    Assign System Role & Credentials
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-brand-gray-400 hover:text-foreground dark:hover:text-white p-1"
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
                <label className="block text-brand-gray-300 font-medium mb-1">
                  الاسم الكامل (Full Name) *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="مثال: أحمد حسن"
                  className="w-full h-10 px-3 bg-brand-dark-950 border border-brand-dark-800 rounded-lg text-foreground dark:text-white focus:outline-none focus:border-brand-orange/60"
                />
              </div>

              <div>
                <label className="block text-brand-gray-300 font-medium mb-1">
                  البريد الإلكتروني (Email Address) *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="user@mywebsite.com"
                  className="w-full h-10 px-3 bg-brand-dark-950 border border-brand-dark-800 rounded-lg text-foreground dark:text-white font-mono focus:outline-none focus:border-brand-orange/60"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-gray-300 font-medium mb-1">
                    كلمة المرور (Password) *
                  </label>
                  <input
                    type="text"
                    name="password"
                    defaultValue="adminpassword123"
                    required
                    className="w-full h-10 px-3 bg-brand-dark-950 border border-brand-dark-800 rounded-lg text-foreground dark:text-white font-mono focus:outline-none focus:border-brand-orange/60"
                  />
                </div>

                <div>
                  <label className="block text-brand-gray-300 font-medium mb-1">
                    الدور والصلاحية (RBAC Role) *
                  </label>
                  <select
                    name="role"
                    defaultValue="MEMBER"
                    className="w-full h-10 px-3 bg-brand-dark-950 border border-brand-dark-800 rounded-lg text-foreground dark:text-white font-mono focus:outline-none focus:border-brand-orange/60"
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
                <label className="block text-brand-gray-300 font-medium mb-1">
                  المسمى الوظيفي (Title)
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="مثال: Software Engineer / Research Assistant"
                  className="w-full h-10 px-3 bg-brand-dark-950 border border-brand-dark-800 rounded-lg text-foreground dark:text-white focus:outline-none focus:border-brand-orange/60"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-brand-dark-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending}
                  className="gap-2 bg-brand-orange text-white hover:bg-brand-orange/90"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري الإنشاء...</span>
                    </>
                  ) : (
                    <span>إنشاء الحساب (Create User)</span>
                  )}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}
