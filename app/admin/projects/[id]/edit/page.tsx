import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { ProjectEditor } from "@/components/admin/project-editor";
import { updateProjectAction, getAdminProjectById } from "@/app/actions/project-actions";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;

  let project: any = null;
  let members: any[] = [];
  let articles: any[] = [];
  let partners: any[] = [];

  try {
    [project, members, articles, partners] = await Promise.all([
      getAdminProjectById(id),
      prisma.member.findMany({ where: { status: "ACTIVE" }, orderBy: { fullName: "asc" } }),
      prisma.article.findMany({ where: { status: "PUBLISHED" }, orderBy: { createdAt: "desc" }, take: 50 }),
      prisma.partner.findMany({ orderBy: { order: "asc" } }),
    ]);
  } catch {}

  if (!project) notFound();

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex items-center gap-3">
        <Link href="/admin/projects"
          className="p-2 rounded-xl bg-[#1A2B4A] text-[#6B7280] hover:text-white hover:bg-[#E84A0C]/10 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-cairo text-2xl font-extrabold text-white">تعديل المشروع / الفعالية</h1>
          <p className="text-xs text-[#6B7280]">{project.title}</p>
        </div>
      </div>
      <ProjectEditor
        project={project}
        availableMembers={members.map((m: any) => ({ id: m.id, name: m.fullName, title: m.title, department: m.departmentName }))}
        availableArticles={articles.map((a: any) => ({ id: a.id, title: a.title, type: a.type }))}
        availablePartners={partners.map((p: any) => ({ id: p.id, name: p.name, logoUrl: p.logoUrl }))}
        saveAction={updateProjectAction}
      />
    </div>
  );
}
