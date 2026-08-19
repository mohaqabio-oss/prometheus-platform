"use client";

import React, { useState } from "react";
import { updateUserRoleAction, deleteUserAction } from "@/app/actions/user-actions";
import { RoleType } from "@prisma/client";
import { Loader2, Trash2 } from "lucide-react";

export interface UserRoleSelectorProps {
  userId: string;
  currentRole: RoleType;
}

export function UserRoleSelector({ userId, currentRole }: UserRoleSelectorProps) {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<RoleType>(currentRole);

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as RoleType;
    setRole(newRole);
    setLoading(true);
    try {
      await updateUserRoleAction(userId, newRole);
    } catch (err) {
      console.error("Failed to update role:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("هل أنت تأكد من رغبتك في حذف هذا الحساب؟")) return;
    setLoading(true);
    try {
      await deleteUserAction(userId);
    } catch (err) {
      console.error("Failed to delete user:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <div className="relative">
        <select
          value={role}
          onChange={handleRoleChange}
          disabled={loading}
          className="h-8 px-2 bg-[#1A2B4A] border border-[#6B7280]/30 rounded-xl text-[11px] font-mono text-white focus:outline-none focus:border-[#E84A0C]"
        >
          <option value="ADMIN">ADMIN</option>
          <option value="HR_EDITOR">HR_EDITOR</option>
          <option value="POST_EDITOR">POST_EDITOR</option>
          <option value="AUTHOR">AUTHOR</option>
          <option value="MEMBER">MEMBER</option>
        </select>
        {loading && (
          <Loader2 className="w-3 h-3 animate-spin absolute end-2 top-1/2 -translate-y-1/2 text-[#E84A0C]" />
        )}
      </div>

      <button
        onClick={handleDelete}
        disabled={loading}
        title="حذف الحساب"
        className="p-1.5 rounded-xl hover:bg-rose-500/20 text-[#6B7280] hover:text-rose-400 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
