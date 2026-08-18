"use client";

import React, { useState, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { createMemberAction } from "@/app/actions/hr-actions";
import { UserPlus, X, Loader2, AlertCircle } from "lucide-react";

export function AdminAddMemberDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    const res = await createMemberAction(prevState, formData);
    if (res.success) {
      setOpen(false);
    }
    return res;
  }, null);

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" className="gap-1.5 text-xs">
        <UserPlus className="w-4 h-4" />
        <span>Add New Member</span>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-brand-dark-900 border border-brand-dark-800 rounded-xl p-6 space-y-5">
            
            <div className="flex items-center justify-between border-b border-brand-dark-800 pb-3">
              <h3 className="font-display font-bold text-white text-base">Add New Team Member</h3>
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
                <label className="text-brand-gray-300 block">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Layla Hassan"
                  className="w-full h-10 px-3 bg-brand-dark-950 border border-brand-dark-800 rounded text-white font-sans focus:outline-none focus:border-brand-orange/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-brand-gray-300 block">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="layla@prometheus.local"
                  className="w-full h-10 px-3 bg-brand-dark-950 border border-brand-dark-800 rounded text-white font-mono focus:outline-none focus:border-brand-orange/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-brand-gray-300 block">Member Title / Role</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Content Writer & Researcher"
                  className="w-full h-10 px-3 bg-brand-dark-950 border border-brand-dark-800 rounded text-white font-sans focus:outline-none focus:border-brand-orange/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-brand-gray-300 block">Department</label>
                  <select
                    name="departmentName"
                    className="w-full h-10 px-2 bg-brand-dark-950 border border-brand-dark-800 rounded text-brand-gray-300 focus:outline-none focus:border-brand-orange/60"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Research">Research</option>
                    <option value="Education">Education</option>
                    <option value="HR & Operations">HR & Operations</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-brand-gray-300 block">Initial Hours</label>
                  <input
                    type="number"
                    name="initialHours"
                    defaultValue={0}
                    className="w-full h-10 px-3 bg-brand-dark-950 border border-brand-dark-800 rounded text-white focus:outline-none focus:border-brand-orange/60"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-brand-dark-800 flex justify-end gap-2">
                <Button type="button" onClick={() => setOpen(false)} variant="ghost" size="sm">
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending} size="sm">
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Member"}
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}
    </>
  );
}
