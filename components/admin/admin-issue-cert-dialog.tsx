"use client";

import React, { useState, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { issueCertificateAction, LocalMemberRecord } from "@/app/actions/hr-actions";
import { Award, X, Loader2, AlertCircle } from "lucide-react";

interface AdminIssueCertDialogProps {
  members: LocalMemberRecord[];
}

export function AdminIssueCertDialog({ members }: AdminIssueCertDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");

  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    // Ensure memberId is strictly passed from state if missing in formData
    const formMemberId = formData.get("memberId")?.toString().trim();
    if (!formMemberId && selectedMemberId) {
      formData.set("memberId", selectedMemberId);
    }
    
    const res = await issueCertificateAction(prevState, formData);
    if (res?.success) {
      setSelectedMemberId("");
      setOpen(false);
    }
    return res;
  }, null);

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" className="gap-1.5 text-xs bg-[#E84A0C] hover:bg-[#D03E06] text-white rounded-xl">
        <Award className="w-4 h-4" />
        <span>إصدار شهادة جديدة</span>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0D0D0D] border border-[#6B7280]/20 rounded-2xl p-6 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-3">
              <h3 className="font-display font-bold text-white text-base">إصدار شهادة تطوع رسمية</h3>
              <button onClick={() => setOpen(false)} className="text-[#6B7280] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {state?.error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-sans flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            <form action={formAction} className="space-y-4 text-xs font-sans">
              
              <div className="space-y-1">
                <label className="text-[#6B7280] block font-bold">اختيار العضو المستحق *</label>
                <select
                  name="memberId"
                  required
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full h-11 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white focus:outline-none focus:border-[#E84A0C] font-sans"
                >
                  <option value="">اختر عضواً من القائمة...</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.departmentName} - {m.volunteerHours} ساعة)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[#6B7280] block font-bold">عنوان الشهادة *</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue="شهادة توثيق مساهمة تطوعية معتمدة"
                  className="w-full h-11 px-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white font-sans focus:outline-none focus:border-[#E84A0C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#6B7280] block font-bold">تفاصيل وحيثيات منح الشهادة</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="مثال: تُمنح هذه الشهادة تقديرًا لجهوده الاستثنائية وقيادته للمشاريع البرمجية التطوعية..."
                  className="w-full p-3 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-white font-sans focus:outline-none focus:border-[#E84A0C] resize-none"
                />
              </div>

              <div className="pt-3 border-t border-[#6B7280]/20 flex justify-end gap-2">
                <Button type="button" onClick={() => setOpen(false)} variant="ghost" size="sm" className="text-[#6B7280] hover:text-white">
                  إلغاء
                </Button>
                <Button type="submit" disabled={isPending} size="sm" className="bg-[#E84A0C] hover:bg-[#D03E06] text-white font-bold rounded-xl px-5">
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "إصدار واعتماد الشهادة"}
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}
    </>
  );
}
