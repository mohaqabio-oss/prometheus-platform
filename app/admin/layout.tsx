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
    <div className="relative min-h-screen bg-[#070b14] text-slate-100 selection:bg-amber-500/20 flex font-sans overflow-x-hidden">
      {/* Elegant, subtle CSS ambient glow (Static, lightweight, zero JS) */}
      <div 
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {/* Top subtle blue/indigo ambient haze */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[65rem] h-[30rem] rounded-full bg-gradient-to-tr from-blue-900/15 via-indigo-800/10 to-transparent blur-3xl opacity-60" />
        
        {/* Very gentle accent glow near top right */}
        <div className="absolute top-20 right-[-10%] w-[35rem] h-[25rem] rounded-full bg-amber-500/5 blur-[120px] opacity-40" />
      </div>

      {/* Role-Protected Collapsible Sidebar */}
      <DashboardSidebar userRoles={session.roles} />

      {/* Main Administrative Container */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
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
