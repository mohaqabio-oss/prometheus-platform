"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { ProjectStatus, RoleType } from "@prisma/client";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ProjectRecord {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: string;
  status: ProjectStatus;
  guestAuthors?: string[];
  membersCount: number;
  articlesCount: number;
  createdAt: string;
}

export interface ProjectMemberRole {
  memberId: string;
  memberName: string;
  avatarUrl?: string;
  roleName: string;
}

export interface ProjectDetail extends ProjectRecord {
  members: ProjectMemberRole[];
  articles: { id: string; title: string; slug: string; type: string }[];
  partners: { id: string; name: string; slug: string; logoUrl: string }[];
}

// ── Auth helper ───────────────────────────────────────────────────────────────
async function requireAuth(roles: RoleType[]) {
  const session = await getSession();
  if (!session) throw new Error("Authentication required.");
  const has = session.roles.includes("ADMIN" as RoleType) || roles.some((r) => session.roles.includes(r));
  if (!has) throw new Error("Unauthorized.");
  return session;
}

// ── Slug generator ────────────────────────────────────────────────────────────
function generateSlug(title: string): string {
  return title
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\u0621-\u064A\u0660-\u0669\-]+/g, "")
    .replace(/(^-|-$)+/g, "")
    + "-" + Date.now().toString().slice(-4);
}

// ── Get all projects ──────────────────────────────────────────────────────────
export async function getProjectsAction(): Promise<ProjectRecord[]> {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { members: true, articles: true } },
      },
    });
    return projects.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description || undefined,
      coverImage: p.coverImage || undefined,
      status: p.status,
      guestAuthors: p.guestAuthors || [],
      membersCount: p._count.members,
      articlesCount: p._count.articles,
      createdAt: p.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

// ── Get project by slug (public) ──────────────────────────────────────────────
export async function getProjectBySlugAction(slug: string): Promise<ProjectDetail | null> {
  try {
    const p = await prisma.project.findUnique({
      where: { slug },
      include: {
        members: {
          include: {
            member: true,
          },
        },
        articles: {
          include: {
            article: true,
          },
        },
        partners: {
          include: {
            partner: true,
          },
        },
        _count: { select: { members: true, articles: true } },
      },
    });
    if (!p) return null;

    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description || undefined,
      coverImage: p.coverImage || undefined,
      status: p.status,
      guestAuthors: p.guestAuthors || [],
      membersCount: p._count.members,
      articlesCount: p._count.articles,
      createdAt: p.createdAt.toISOString(),
      members: p.members.map((pr) => ({
        memberId: pr.member.id,
        memberName: pr.member.fullName,
        avatarUrl: pr.member.avatarUrl || pr.member.profileImage || undefined,
        roleName: pr.roleName,
      })),
      articles: p.articles.map((pa) => ({
        id: pa.article.id,
        title: pa.article.title,
        slug: pa.article.slug,
        type: pa.article.type,
      })),
      partners: p.partners.map((pp) => ({
        id: pp.partner.id,
        name: pp.partner.name,
        slug: pp.partner.slug,
        logoUrl: pp.partner.logoUrl,
      })),
    };
  } catch {
    return null;
  }
}

// ── Create project ────────────────────────────────────────────────────────────
export async function createProjectAction(prevState: any, formData: FormData) {
  await requireAuth(["ADMIN"]);

  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const coverImage = formData.get("coverImage")?.toString().trim() || null;
  const rawStatus = formData.get("status")?.toString();
  const status = (["PLANNED", "IN_PROGRESS", "COMPLETED"].includes(rawStatus || "")
    ? rawStatus
    : "PLANNED") as ProjectStatus;

  const rawArticleIds = formData.get("articleIds")?.toString() || "[]";
  const rawPartnerIds = formData.get("partnerIds")?.toString() || "[]";
  const rawMembers = formData.get("members")?.toString() || "[]"; // [{memberId, roleName}]
  const rawGuestAuthors = formData.get("guestAuthors")?.toString() || "[]";

  let articleIds: string[] = [];
  let partnerIds: string[] = [];
  let memberRoles: { memberId: string; roleName: string }[] = [];
  let guestAuthors: string[] = [];

  try { articleIds = JSON.parse(rawArticleIds); } catch { articleIds = []; }
  try { partnerIds = JSON.parse(rawPartnerIds); } catch { partnerIds = []; }
  try { memberRoles = JSON.parse(rawMembers); } catch { memberRoles = []; }
  try { guestAuthors = JSON.parse(rawGuestAuthors).filter((g: string) => g.trim() !== ""); } catch { guestAuthors = []; }

  if (!title) return { error: "عنوان المشروع مطلوب." };

  const slug = generateSlug(title);

  try {
    await prisma.project.create({
      data: {
        title,
        slug,
        description,
        coverImage,
        status,
        guestAuthors,
        articles: articleIds.length > 0
          ? { create: articleIds.map((aid) => ({ articleId: aid })) }
          : undefined,
        partners: partnerIds.length > 0
          ? { create: partnerIds.map((pid) => ({ partnerId: pid })) }
          : undefined,
        members: memberRoles.length > 0
          ? { create: memberRoles.map((m) => ({ memberId: m.memberId, roleName: m.roleName })) }
          : undefined,
      },
    });
  } catch (err: any) {
    return { error: err.message || "فشل إنشاء المشروع." };
  }

  revalidatePath("/", "layout");
  redirect("/admin/projects");
}

// ── Update project ────────────────────────────────────────────────────────────
export async function updateProjectAction(prevState: any, formData: FormData) {
  await requireAuth(["ADMIN"]);

  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const coverImage = formData.get("coverImage")?.toString().trim() || null;
  const rawStatus = formData.get("status")?.toString();
  const status = (["PLANNED", "IN_PROGRESS", "COMPLETED"].includes(rawStatus || "")
    ? rawStatus
    : "PLANNED") as ProjectStatus;

  const rawArticleIds = formData.get("articleIds")?.toString() || "[]";
  const rawPartnerIds = formData.get("partnerIds")?.toString() || "[]";
  const rawMembers = formData.get("members")?.toString() || "[]";
  const rawGuestAuthors = formData.get("guestAuthors")?.toString() || "[]";

  let articleIds: string[] = [];
  let partnerIds: string[] = [];
  let memberRoles: { memberId: string; roleName: string }[] = [];
  let guestAuthors: string[] = [];

  try { articleIds = JSON.parse(rawArticleIds); } catch { articleIds = []; }
  try { partnerIds = JSON.parse(rawPartnerIds); } catch { partnerIds = []; }
  try { memberRoles = JSON.parse(rawMembers); } catch { memberRoles = []; }
  try { guestAuthors = JSON.parse(rawGuestAuthors).filter((g: string) => g.trim() !== ""); } catch { guestAuthors = []; }

  if (!id || !title) return { error: "معرف المشروع والعنوان مطلوبان." };

  const slug = generateSlug(title);

  try {
    await prisma.$transaction([
      prisma.project.update({
        where: { id },
        data: { title, slug, description, coverImage, status, guestAuthors },
      }),
      prisma.projectArticle.deleteMany({ where: { projectId: id } }),
      ...(articleIds.length > 0
        ? [prisma.projectArticle.createMany({
            data: articleIds.map((aid) => ({ projectId: id, articleId: aid })),
            skipDuplicates: true,
          })]
        : []),
      prisma.partnerProject.deleteMany({ where: { projectId: id } }),
      ...(partnerIds.length > 0
        ? [prisma.partnerProject.createMany({
            data: partnerIds.map((pid) => ({ projectId: id, partnerId: pid })),
            skipDuplicates: true,
          })]
        : []),
      prisma.projectRole.deleteMany({ where: { projectId: id } }),
      ...(memberRoles.length > 0
        ? [prisma.projectRole.createMany({
            data: memberRoles.map((m) => ({ projectId: id, memberId: m.memberId, roleName: m.roleName })),
            skipDuplicates: true,
          })]
        : []),
    ]);
  } catch (err: any) {
    return { error: err.message || "فشل تحديث المشروع." };
  }

  revalidatePath("/", "layout");
  redirect("/admin/projects");
}

// ── Delete project ────────────────────────────────────────────────────────────
export async function deleteProjectAction(id: string) {
  try {
    await requireAuth(["ADMIN"]);
    await prisma.project.delete({ where: { id } });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "فشل حذف المشروع." };
  }
}
