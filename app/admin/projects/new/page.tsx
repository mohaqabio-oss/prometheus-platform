import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { ProjectEditor } from "@/components/admin/project-editor";
import { createProjectAction } from "@/app/actions/project-actions";
import { ArrowLeft, FolderGit2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  let members: any[] = [];
  let articles: any[] = [];
  let partners: any[] = [];

  try {
    [members, articles, partners] = await Promise.all([
      prisma.member.findMany({ where: { status: "ACTIVE" }, orderBy: { fullName: "asc" } }),
      prisma.article.findMany({ where: { status: "PUBLISHED" }, orderBy: { createdAt: "desc" }, take: 50 }),
      prisma.partner.findMany({ orderBy: { order: "asc" } }),
    ]);
  } catch {}

  const availableMembers = members.map((m) => ({
    id: m.id,
    name: m.fullName,
    title: m.title,
    department: m.departmentName,
  }));

  const availableArticles = articles.map((a) => ({
    id: a.id,
    title: a.title,
    type: a.type,
  }));

  const availablePartners = partners.map((p) => ({
    id: p.id,
    name: p.name,
    logoUrl: p.logoUrl,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/admin/projects"
          className="p-2 rounded-xl bg-[#1A2B4A] text-[#6B7280] hover:text-white hover:bg-[#E84A0C]/10 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-cairo text-2xl font-extrabold text-white">إنشاء مشروع بحثي جديد</h1>
          <p className="text-xs text-[#6B7280]">أضف مشروعاً جديداً لمنصة بروميثيوس.</p>
        </div>
      </div>
      <ProjectEditor
        availableMembers={availableMembers}
        availableArticles={availableArticles}
        availablePartners={availablePartners}
        saveAction={createProjectAction}
      />
    </div>
  );
}
