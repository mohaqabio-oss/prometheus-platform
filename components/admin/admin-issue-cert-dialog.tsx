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
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    const res = await issueCertificateAction(prevState, formData);
    if (res.success) {
      setOpen(false);
    }
    return res;
  }, null);

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" className="gap-1.5 text-xs">
        <Award className="w-4 h-4" />
        <span>Issue New Certificate</span>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-brand-dark-900 border border-brand-dark-800 rounded-xl p-6 space-y-5">
            
            <div className="flex items-center justify-between border-b border-brand-dark-800 pb-3">
              <h3 className="font-display font-bold text-white text-base">Issue Official Volunteer Certificate</h3>
              <button onClick={() => setOpen(false)} className="text-brand-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {state?.error && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            <form action={formAction} className="space-y-4 text-xs font-mono">
              
              <div className="space-y-1">
                <label className="text-brand-gray-300 block">Select Member Recipient *</label>
                <select
                  name="memberId"
                  required
                  className="w-full h-10 px-3 bg-brand-dark-950 border border-brand-dark-800 rounded text-white focus:outline-none focus:border-brand-orange/60"
                >
                  <option value="">Select a member...</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.departmentName} - {m.volunteerHours} hrs)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-brand-gray-300 block">Certificate Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue="Verified Certificate of Voluntary Contribution"
                  className="w-full h-10 px-3 bg-brand-dark-950 border border-brand-dark-800 rounded text-white font-sans focus:outline-none focus:border-brand-orange/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-brand-gray-300 block">Description / Citation</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="e.g. Awarded for exemplary dedication and leadership in voluntary engineering projects..."
                  className="w-full p-3 bg-brand-dark-950 border border-brand-dark-800 rounded text-white font-sans focus:outline-none focus:border-brand-orange/60"
                />
              </div>

              <div className="pt-3 border-t border-brand-dark-800 flex justify-end gap-2">
                <Button type="button" onClick={() => setOpen(false)} variant="ghost" size="sm">
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending} size="sm">
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Issue Certificate"}
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}
    </>
  );
}
