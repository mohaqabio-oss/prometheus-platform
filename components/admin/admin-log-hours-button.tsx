"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateVolunteerHoursAction } from "@/app/actions/hr-actions";
import { Clock, Plus, Loader2 } from "lucide-react";

interface AdminLogHoursButtonProps {
  memberId: string;
  memberName: string;
}

export function AdminLogHoursButton({ memberId, memberName }: AdminLogHoursButtonProps) {
  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateVolunteerHoursAction(memberId, Number(hours));
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size="sm"
        className="h-8 px-2.5 text-xs gap-1"
      >
        <Plus className="w-3.5 h-3.5 text-brand-orange" />
        <span>Log Hours</span>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-brand-dark-900 border border-brand-dark-800 rounded-xl p-5 space-y-4 text-left">
            <h4 className="font-display font-bold text-white text-sm">
              Log Hours: {memberName}
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono text-brand-gray-400 block mb-1">
                  Add Additional Volunteer Hours:
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  required
                  className="w-full h-10 px-3 bg-brand-dark-950 border border-brand-dark-800 rounded text-sm text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" onClick={() => setOpen(false)} variant="ghost" size="sm">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} size="sm">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Log Hours"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
