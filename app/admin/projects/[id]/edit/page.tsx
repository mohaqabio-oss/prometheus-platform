import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { ProjectEditor } from "@/components/admin/project-editor";
import { updateProjectAction } from "@/app/actions/project-actions";
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
      prisma.project.findUnique({
        where: { id },
        include: {
          members: { include: { member: true } },
          articles: { include: { article: true } },
          partners: { include: { partner: true } },
        },
      }),
      prisma.member.findMany({ where: { status: "ACTIVE" }, orderBy: { fullName: "asc" } }),
      prisma.article.findMany({ where: { status: "PUBLISHED" }, orderBy: { createdAt: "desc" }, take: 50 }),
      prisma.partner.findMany({ orderBy: { order: "asc" } }),
    ]);
  } catch {}

  if (!project) notFound();

  const projectForEditor = {
    id: project.id,
    title: project.title,
    slug: project.slug,
    description: project.description,
    coverImage: project.coverImage,
    status: project.status,
    membersCount: project.members.length,
    articlesCount: project.articles.length,
    createdAt: project.createdAt.toISOString(),
    members: project.members.map((pr: any) => ({
      memberId: pr.member.id,
      memberName: pr.member.fullName,
      roleName: pr.roleName,
    })),
    articles: project.articles.map((pa: any) => ({
      id: pa.article.id,
      title: pa.article.title,
      type: pa.article.type,
    })),
    partners: project.partners.map((pp: any) => ({
      id: pp.partner.id,
      name: pp.partner.name,
      logoUrl: pp.partner.logoUrl,
    })),
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/admin/projects"
          className="p-2 rounded-xl bg-[#1A2B4A] text-[#6B7280] hover:text-white hover:bg-[#E84A0C]/10 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-cairo text-2xl font-extrabold text-white">تعديل المشروع</h1>
          <p className="text-xs text-[#6B7280]">{project.title}</p>
        </div>
      </div>
      <ProjectEditor
        project={projectForEditor}
        availableMembers={members.map((m: any) => ({ id: m.id, name: m.fullName, title: m.title, department: m.departmentName }))}
        availableArticles={articles.map((a: any) => ({ id: a.id, title: a.title, type: a.type }))}
        availablePartners={partners.map((p: any) => ({ id: p.id, name: p.name, logoUrl: p.logoUrl }))}
        saveAction={updateProjectAction}
      />
    </div>
  );
}
