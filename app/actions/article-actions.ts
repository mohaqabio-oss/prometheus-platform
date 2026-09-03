"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { ArticleStatus, ArticleType, RoleType } from "@prisma/client";

export interface ArticleAuthor {
  id: string;
  name: string;
  avatarUrl?: string;
  title?: string;
  department?: string;
  bio?: string;
  roleName?: string;
}

export interface LocalArticleRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryName: string;
  coverImage?: string;
  sources: string[];
  guestAuthors: string[];
  status: ArticleStatus;
  type: ArticleType;
  editorNotes?: string;
  authorId: string;
  authorName: string;
  authors: ArticleAuthor[];
  partners: { id: string; name: string; logoUrl: string; roleName?: string }[];
  publishedAt?: string;
  createdAt: string;
}

async function requireAuth(allowedRoles: RoleType[]) {
  const session = await getSession();
  if (!session) throw new Error("Authentication required.");
  const hasRole = session.roles.includes("ADMIN") || allowedRoles.some((r) => session.roles.includes(r));
  if (!hasRole) throw new Error("Unauthorized.");
  return session;
}

export async function getMembersForSelectAction(): Promise<ArticleAuthor[]> {
  try {
    const dbMembers = await prisma.member.findMany({
      where: { status: "ACTIVE" },
      orderBy: { fullName: "asc" },
    });
    if (dbMembers.length > 0) {
      return dbMembers.map((m: any) => ({
        id: m.id,
        name: m.fullName,
        avatarUrl: m.avatarUrl || m.profileImage || undefined,
        title: m.title || "عضو فريق بروميثيوس",
        department: m.departmentName || "عام",
        bio: m.bio || undefined,
      }));
    }
  } catch (e) { }

  return [{ id: "mem-default-1", name: "محرر بروميثيوس", title: "محرر أكاديمي", department: "البحث والتطوير" }];
}

export async function getPartnersForSelectAction(): Promise<{ id: string; name: string; logoUrl: string }[]> {
  try {
    return await prisma.partner.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true, logoUrl: true },
    });
  } catch {
    return [];
  }
}

export async function getPublicArticlesAction(type?: ArticleType): Promise<LocalArticleRecord[]> {
  try {
    const dbArticles = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        ...(type ? { type } : {}),
      },
      include: {
        author: true,
        memberRoles: { include: { member: true } },
        partners: { include: { partner: true } },
      },
      orderBy: { publishedAt: "desc" },
    });

    return dbArticles.map((a) => {
      const authorsList: ArticleAuthor[] = a.memberRoles.map((mr) => ({
        id: mr.member.id,
        name: mr.member.fullName,
        avatarUrl: mr.member.avatarUrl || mr.member.profileImage || undefined,
        title: mr.roleName || "مؤلف مشارك",
        department: mr.member.departmentName || "عام",
        roleName: mr.roleName,
      }));

      return {
        id: a.id,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt || "",
        content: a.content,
        coverImage: a.coverImage || undefined,
        sources: a.sources || [],
        guestAuthors: a.guestAuthors || [],
        categoryName: "عام",
        status: a.status,
        type: a.type || ArticleType.BLOG,
        authorId: a.author?.id || "unknown",
        authorName: authorsList.map((au) => au.name).join("، ") || a.author?.fullName || "محرر بروميثيوس",
        authors: authorsList,
        partners: a.partners.map((p) => ({
          id: p.partner.id,
          name: p.partner.name,
          logoUrl: p.partner.logoUrl,
          roleName: p.roleName || "شريك إعلامي",
        })),
        publishedAt: a.publishedAt?.toISOString(),
        createdAt: a.createdAt.toISOString(),
      };
    });
  } catch (e) {
    return [];
  }
}

export async function incrementArticleViewCount(articleId: string) {
  try {
    await prisma.article.update({
      where: { id: articleId },
      data: { viewCount: { increment: 1 } },
    });
  } catch {}
}

export async function getDashboardAnalyticsData() {
  try {
    const [totalArticles, publishedArticles, totalProjects, totalMembers, totalPartners] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: "PUBLISHED" } }),
      prisma.project.count(),
      prisma.member.count({ where: { status: "ACTIVE" } }),
      prisma.partner.count(),
    ]);

    return {
      totalArticles,
      publishedArticles,
      totalProjects,
      totalMembers,
      totalPartners,
    };
  } catch {
    return {
      totalArticles: 0,
      publishedArticles: 0,
      totalProjects: 0,
      totalMembers: 0,
      totalPartners: 0,
    };
  }
}

export async function createArticleDraftAction(prevState: any, formData: FormData) {
  const session = await requireAuth(["AUTHOR", "POST_EDITOR", "ADMIN"]);

  const title = formData.get("title")?.toString().trim();
  const excerpt = formData.get("excerpt")?.toString().trim() || "";
  const content = formData.get("content")?.toString().trim();
  const coverImage = formData.get("coverImage")?.toString() || "";
  const rawAuthorRoles = formData.get("authorRoles")?.toString() || formData.get("authorIds")?.toString() || "";
  const rawType = formData.get("type")?.toString();
  const type: ArticleType = rawType === "ACADEMIC" ? ArticleType.ACADEMIC : ArticleType.BLOG;
  const rawSources = formData.get("sources")?.toString() || "[]";
  const rawPartnerRoles = formData.get("partnerRoles")?.toString() || formData.get("partnerIds")?.toString() || "[]";
  const rawGuestAuthors = formData.get("guestAuthors")?.toString() || "[]";

  let sources: string[] = [];
  let partnerRoles: { partnerId: string; roleName?: string }[] = [];
  let guestAuthors: string[] = [];
  let memberRoles: { memberId: string; roleName: string }[] = [];

  try { sources = JSON.parse(rawSources).filter((s: string) => s.trim() !== ""); } catch { sources = []; }
  try {
    const parsed = JSON.parse(rawPartnerRoles);
    partnerRoles = parsed.map((p: any) => typeof p === "string" ? { partnerId: p, roleName: "شريك إعلامي" } : p);
  } catch { partnerRoles = []; }
  try { guestAuthors = JSON.parse(rawGuestAuthors).filter((g: string) => g.trim() !== ""); } catch { guestAuthors = []; }

  if (!title || !content) return { error: "عنوان المقالة ومحتواها مطلوبان." };

  if (rawAuthorRoles) {
    try {
      const parsed = JSON.parse(rawAuthorRoles);
      memberRoles = parsed.map((m: any) => typeof m === "string" ? { memberId: m, roleName: "مؤلف مشارك" } : m);
    } catch {
      memberRoles = rawAuthorRoles.split(",").map((s) => ({ memberId: s.trim(), roleName: "مؤلف مشارك" })).filter((m) => m.memberId);
    }
  }

  const slug = title
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\u0621-\u064A\u0660-\u0669\-]+/g, "")
    .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4);

  try {
    await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        sources,
        guestAuthors,
        status: "DRAFT",
        type,
        author: { connect: { id: session.userId } },
        ...(partnerRoles.length > 0
          ? { partners: { create: partnerRoles.map((p) => ({ partnerId: p.partnerId, roleName: p.roleName || "شريك إعلامي" })) } }
          : {}),
        ...(memberRoles.length > 0
          ? { memberRoles: { create: memberRoles.map((m) => ({ memberId: m.memberId, roleName: m.roleName || "مؤلف مشارك" })) } }
          : {}),
      },
    });
  } catch (err: any) {
    if (err.message === "NEXT_REDIRECT") throw err;
    return { error: err.message || "فشل إنشاء مسودة المقالة." };
  }

  revalidatePath("/", "layout");
  redirect("/admin/articles");
}

export async function updateArticleAction(prevState: any, formData: FormData) {
  const session = await requireAuth(["AUTHOR", "POST_EDITOR", "ADMIN"]);

  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString().trim();
  const excerpt = formData.get("excerpt")?.toString().trim() || "";
  const content = formData.get("content")?.toString().trim();
  const coverImage = formData.get("coverImage")?.toString() || "";
  const rawStatus = formData.get("status")?.toString();
  const status = (rawStatus === "PUBLISHED" ? "PUBLISHED" : "DRAFT") as ArticleStatus;
  const rawType = formData.get("type")?.toString();
  const type: ArticleType = rawType === "ACADEMIC" ? ArticleType.ACADEMIC : ArticleType.BLOG;
  const rawAuthorRoles = formData.get("authorRoles")?.toString() || formData.get("authorIds")?.toString() || "";
  const rawSources = formData.get("sources")?.toString() || "[]";
  const rawPartnerRoles = formData.get("partnerRoles")?.toString() || formData.get("partnerIds")?.toString() || "[]";
  const rawGuestAuthors = formData.get("guestAuthors")?.toString() || "[]";

  let sources: string[] = [];
  let partnerRoles: { partnerId: string; roleName?: string }[] = [];
  let guestAuthors: string[] = [];
  let memberRoles: { memberId: string; roleName: string }[] = [];

  try { sources = JSON.parse(rawSources).filter((s: string) => s.trim() !== ""); } catch { sources = []; }
  try {
    const parsed = JSON.parse(rawPartnerRoles);
    partnerRoles = parsed.map((p: any) => typeof p === "string" ? { partnerId: p, roleName: "شريك إعلامي" } : p);
  } catch { partnerRoles = []; }
  try { guestAuthors = JSON.parse(rawGuestAuthors).filter((g: string) => g.trim() !== ""); } catch { guestAuthors = []; }

  if (!id || !title || !content) return { error: "معرف المقالة والعنوان والمحتوى مطلوبان." };

  if (rawAuthorRoles) {
    try {
      const parsed = JSON.parse(rawAuthorRoles);
      memberRoles = parsed.map((m: any) => typeof m === "string" ? { memberId: m, roleName: "مؤلف مشارك" } : m);
    } catch {
      memberRoles = rawAuthorRoles.split(",").map((s) => ({ memberId: s.trim(), roleName: "مؤلف مشارك" })).filter((m) => m.memberId);
    }
  }

  const slug = title
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\u0621-\u064A\u0660-\u0669\-]+/g, "")
    .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4);

  try {
    await prisma.article.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        sources,
        guestAuthors,
        status,
        type,
        ...(status === "PUBLISHED" ? { publishedAt: new Date() } : {}),
        partners: {
          deleteMany: {},
          create: partnerRoles.map((p) => ({ partnerId: p.partnerId, roleName: p.roleName || "شريك إعلامي" })),
        },
        memberRoles: {
          deleteMany: {},
          create: memberRoles.map((m) => ({ memberId: m.memberId, roleName: m.roleName || "مؤلف مشارك" })),
        },
      },
    });
  } catch (err: any) {
    if (err.message === "NEXT_REDIRECT") throw err;
    return { error: err.message || "فشل تحديث المقالة." };
  }

  revalidatePath("/", "layout");
  redirect("/admin/articles");
}

export async function getAdminArticlesList(): Promise<LocalArticleRecord[]> {
  const session = await getSession();
  if (!session) return [];

  try {
    const dbArticles = await prisma.article.findMany({
      include: {
        author: true,
        memberRoles: { include: { member: true } },
        partners: { include: { partner: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return dbArticles.map((a) => {
      const authorsList: ArticleAuthor[] = a.memberRoles.map((mr) => ({
        id: mr.member.id,
        name: mr.member.fullName,
        avatarUrl: mr.member.avatarUrl || mr.member.profileImage || undefined,
        title: mr.roleName || "مؤلف مشارك",
        department: mr.member.departmentName || "عام",
        roleName: mr.roleName,
      }));

      return {
        id: a.id,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt || "",
        content: a.content,
        coverImage: a.coverImage || undefined,
        sources: a.sources || [],
        guestAuthors: a.guestAuthors || [],
        categoryName: "عام",
        status: a.status,
        type: a.type || ArticleType.BLOG,
        authorId: a.author?.id || "unknown",
        authorName: authorsList.map((au) => au.name).join("، ") || a.author?.fullName || "محرر بروميثيوس",
        authors: authorsList,
        partners: a.partners.map((p) => ({
          id: p.partner.id,
          name: p.partner.name,
          logoUrl: p.partner.logoUrl,
          roleName: p.roleName || "شريك إعلامي",
        })),
        publishedAt: a.publishedAt?.toISOString(),
        createdAt: a.createdAt.toISOString(),
      };
    });
  } catch (e) {
    return [];
  }
}

export async function deleteArticleAction(articleId: string) {
  await requireAuth(["POST_EDITOR", "ADMIN"]);
  try {
    await prisma.article.delete({ where: { id: articleId } });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "فشل حذف المقالة." };
  }
}