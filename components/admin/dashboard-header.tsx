"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/actions/auth-actions";
import { RoleType } from "@prisma/client";
import { LogOut, User, Shield } from "lucide-react";

interface DashboardHeaderProps {
  fullName: string;
  email: string;
  roles: RoleType[];
}

export function DashboardHeader({ fullName, email, roles }: DashboardHeaderProps) {
  const primaryRole = roles[0] || "MEMBER";

  const getRoleLabel = (role: RoleType) => {
    switch (role) {
      case "ADMIN":
        return "مدير النظام";
      case "HR_EDITOR":
        return "محرر موارد بشرية";
      case "POST_EDITOR":
        return "رئيس تحرير المقالات";
      case "AUTHOR":
        return "كاتب محتوى";
      default:
        return "عضو كادر";
    }
  };

  return (
    <header className="h-16 border-b border-[#6B7280]/20 bg-[#1A2B4A]/95 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#0D0D0D] border border-[#6B7280]/20 flex items-center justify-center text-[#E84A0C]">
          <User className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white leading-none">{fullName}</p>
          <p className="text-[11px] font-mono text-[#6B7280] mt-0.5">{email}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <Badge variant="orange" className="font-mono text-[10px] gap-1 shadow-sm">
          <Shield className="w-3 h-3" />
          <span>{getRoleLabel(primaryRole)}</span>
        </Badge>

        <form action={logoutAction}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-[#6B7280] hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تسجيل الخروج</span>
          </Button>
        </form>
      </div>

    </header>
  );
}
