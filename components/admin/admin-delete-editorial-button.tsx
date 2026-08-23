"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteEditorialMemberAction } from "@/app/actions/editorial-actions";
import { Trash2 } from "lucide-react";

export interface AdminDeleteEditorialButtonProps {
  memberId: string;
  memberName: string;
}

export function AdminDeleteEditorialButton({ memberId, memberName }: AdminDeleteEditorialButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`هل أنت تأكد من رغبتك في حذف العضو الأكاديمي "${memberName}" من هيئة التحرير؟`)) {
      startTransition(async () => {
        await deleteEditorialMemberAction(memberId);
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
      className="h-8 px-2 text-xs rounded-xl border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
      title="حذف هذا العضو من هيئة التحرير"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </Button>
  );
}
