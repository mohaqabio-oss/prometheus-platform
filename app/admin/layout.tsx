import React from "react";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/admin/dashboard-sidebar";
import { DashboardHeader } from "@/components/admin/dashboard-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/admin/dashboard");
  }

  return (
    <div className="min-h-screen flex bg-brand-dark-950 text-foreground font-sans">
      
      {/* Role-Protected Collapsible Sidebar */}
      <DashboardSidebar userRoles={session.roles} />

      {/* Main Administrative Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          fullName={session.fullName}
          email={session.email}
          roles={session.roles}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
