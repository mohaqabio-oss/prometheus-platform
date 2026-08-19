"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { RoleType } from "@prisma/client";
import {
  LayoutDashboard,
  FileText,
  Layers,
  Users,
  UserCheck,
  Globe,
  UserCog,
  Settings,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  Award,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  rolesAllowed: RoleType[];
}

interface NavGroup {
  groupLabel: string;
  items: NavItem[];
}

interface DashboardSidebarProps {
  userRoles: RoleType[];
}

export function DashboardSidebar({ userRoles }: DashboardSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const hasAccess = (allowed: RoleType[]) => {
    if (userRoles.includes("ADMIN")) return true;
    return allowed.some((role) => userRoles.includes(role));
  };

  const navGroups: NavGroup[] = [
    {
      groupLabel: "الرئيسية",
      items: [
        {
          title: "نظرة عامة",
          href: "/admin/dashboard",
          icon: <LayoutDashboard className="w-4 h-4" />,
          rolesAllowed: ["ADMIN", "HR_EDITOR", "POST_EDITOR", "AUTHOR", "MEMBER"],
        },
        {
          title: "الموقع العام",
          href: "/admin/website",
          icon: <Globe className="w-4 h-4" />,
          rolesAllowed: ["ADMIN"],
        },
      ],
    },
    {
      groupLabel: "منشورات بروميثيوس",
      items: [
        {
          title: "المقالات والمنشورات",
          href: "/admin/articles",
          icon: <FileText className="w-4 h-4" />,
          rolesAllowed: ["ADMIN", "POST_EDITOR", "AUTHOR"],
        },
        {
          title: "المجموعات والسلاسل",
          href: "/admin/collections",
          icon: <Layers className="w-4 h-4" />,
          rolesAllowed: ["ADMIN", "POST_EDITOR"],
        },
      ],
    },
    {
      groupLabel: "الفريق والتوظيف",
      items: [
        {
          title: "دليل الأعضاء",
          href: "/admin/members",
          icon: <Users className="w-4 h-4" />,
          rolesAllowed: ["ADMIN", "HR_EDITOR"],
        },
        {
          title: "إصدار الشهادات",
          href: "/admin/certificates",
          icon: <Award className="w-4 h-4" />,
          rolesAllowed: ["ADMIN", "HR_EDITOR"],
        },
        {
          title: "طلبات الانضمام",
          href: "/admin/applications",
          icon: <UserCheck className="w-4 h-4" />,
          rolesAllowed: ["ADMIN", "HR_EDITOR"],
        },
      ],
    },
    {
      groupLabel: "الإدارة والنظام",
      items: [
        {
          title: "المستخدمين والصلاحيات",
          href: "/admin/users",
          icon: <UserCog className="w-4 h-4" />,
          rolesAllowed: ["ADMIN"],
        },
        {
          title: "إعدادات النظام",
          href: "/admin/settings",
          icon: <Settings className="w-4 h-4" />,
          rolesAllowed: ["ADMIN"],
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 bg-background dark:bg-brand-dark-900 border-l border-border transition-colors duration-200">
      
      {/* Top Brand Block */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2 pt-2">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-card dark:bg-brand-dark-850 border border-border flex items-center justify-center p-1">
              {/* Light Mode Logo */}
              <Image
                src="/logo-light.PNG"
                alt="Prometheus Admin"
                width={24}
                height={24}
                className="w-6 h-6 object-contain block dark:hidden"
              />
              {/* Dark Mode Logo */}
              <Image
                src="/logo-dark.PNG"
                alt="Prometheus Admin"
                width={24}
                height={24}
                className="w-6 h-6 object-contain hidden dark:block"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold tracking-widest text-foreground dark:text-white leading-none">
                بروميثيوس
              </span>
              <span className="text-[9px] font-mono tracking-wider text-brand-orange uppercase mt-0.5">
                لوحة الإدارة
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-brand-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Link Groups */}
        <div className="space-y-5 pt-2">
          {navGroups.map((group) => {
            const accessibleItems = group.items.filter((item) =>
              hasAccess(item.rolesAllowed)
            );

            if (accessibleItems.length === 0) return null;

            return (
              <div key={group.groupLabel} className="space-y-1.5">
                <p className="px-3 text-[10px] font-mono uppercase tracking-widest text-brand-gray-500 font-semibold">
                  {group.groupLabel}
                </p>
                <div className="space-y-0.5">
                  {accessibleItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150",
                          isActive
                            ? "bg-brand-dark-850 text-white border border-brand-dark-700 shadow-sm"
                            : "text-brand-gray-400 hover:text-white hover:bg-brand-dark-850/60"
                        )}
                      >
                        <span className={cn(isActive ? "text-brand-orange" : "text-brand-gray-500")}>
                          {item.icon}
                        </span>
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-4 border-t border-brand-dark-800 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-brand-gray-400 hover:text-white hover:bg-brand-dark-850 transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5 text-brand-orange" />
          <span>العودة للموقع العام</span>
        </Link>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Column */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg bg-brand-dark-900 border border-brand-dark-800 text-brand-gray-300 hover:text-white"
          aria-label="فتح القائمة الجانبية"
        >
          <Menu className="w-5 h-5" />
        </button>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative z-10 w-72 h-full bg-brand-dark-900">
              {sidebarContent}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
