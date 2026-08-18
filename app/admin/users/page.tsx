import React from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { UserCog } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        badgeText="Security & Access"
        title="User Access &"
        highlightedTitle="Roles"
        description="Assign RBAC roles (ADMIN, HR_EDITOR, POST_EDITOR, AUTHOR, MEMBER) to staff users."
      />

      <Card className="p-12 text-center border-dashed border-brand-dark-800 bg-brand-dark-900/40">
        <div className="w-12 h-12 rounded-full bg-brand-dark-850 border border-brand-dark-800 flex items-center justify-center text-brand-orange mx-auto mb-4">
          <UserCog className="w-6 h-6" />
        </div>
        <h3 className="font-display text-lg font-bold text-white mb-2">User Roles & Access Control</h3>
        <p className="text-xs text-brand-gray-400 max-w-md mx-auto">
          Manage system user accounts, reset credentials, and assign role-based authorization permissions.
        </p>
      </Card>
    </div>
  );
}
