"use client";

import React, { useState } from "react";
import { deleteMemberAction } from "@/app/actions/hr-actions";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

export function AdminDeleteMemberButton({ memberId, memberName }: { memberId: string; memberName: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`هل أنت تأكد من رغبتك في حذف العضو "${memberName}"؟`)) return;
    setLoading(true);
    try {
      await deleteMemberAction(memberId);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDelete}
      disabled={loading}
      variant="outline"
      size="sm"
      className="h-8 px-2 text-xs rounded-xl border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500"
      title="حذف العضو"
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
    </Button>
  );
}
