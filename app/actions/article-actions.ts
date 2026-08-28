"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { ArticleStatus, RoleType } from "@prisma/client";

export interface ArticleAuthor {
  id: string;
  name: string;
  avatarUrl?: string;
  title?: string;
  department?: string;
  bio?: string;
}

export interface LocalArticleRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryName: string;
  coverImage?: string;
  status: ArticleStatus;
  editorNotes?: string;
  authorId: string;
  authorName: string;
  authors: ArticleAuthor[];
  publishedAt?: string;
  createdAt: string;
}

// Helper: Ensure authenticated session with role check
async function requireAuth(allowedRoles: RoleType[]) {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required. Please log in to perform this action.");
  }
  const hasRole = session.roles.includes("ADMIN") || allowedRoles.some((r) => session.roles.includes(r));
  if (!hasRole) {
    throw new Error("Unauthorized: Your assigned role does not have permission for this workflow action.");
  }
  return session;
}

// Fetch all members for Multi-Select Author dropdown in Article Editor
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

  return [
    {
      id: "mem-default-1",
      name: "محرر بروميثيوس",
      title: "محرر أكاديمي",
      department: "البحث والتطوير",
    },
  ];
}

// 1. Create Article Draft
export async function createArticleDraftAction(prevState: any, formData: FormData) {
  const session = await requireAuth(["AUTHOR", "POST_EDITOR", "ADMIN"]);

  const title = formData.get("title")?.toString().trim();
  const excerpt = formData.get("excerpt")?.toString().trim() || "";
  const content = formData.get("content")?.toString().trim();
  const coverImage = formData.get("coverImage")?.toString() || "";
  const rawAuthorIds = formData.get("authorIds")?.toString() || "";

  if (!title || !content) {
    return { error: "Article title and body content are required." };
  }

  let selectedAuthorIds: string[] = [];
  if (rawAuthorIds) {
    try {
      selectedAuthorIds = JSON.parse(rawAuthorIds);
    } catch (e) {
      selectedAuthorIds = rawAuthorIds.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }

  // دعم اللغة العربية في الروابط (Slug) بشكل كامل
  const slug = title
    .trim()
    .replace(/\s+/g, "-") // تحويل المسافات إلى شواخص
    .replace(/[^a-zA-Z0-9\u0621-\u064A\u0660-\u0669\-]+/g, "") // إبقاء العربي والإنجليزي والأرقام
    .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4);

  try {
    let coAuthorsData: { name: string; role: string }[] = [];
    if (selectedAuthorIds.length > 0) {
      const members = await prisma.member.findMany({
        where: { id: { in: selectedAuthorIds } },
      });
      coAuthorsData = members.map((m: any) => ({
        name: m.fullName,
        role: "مؤلف مشارك",
      }));
    }

    await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        status: "DRAFT",
        author: {
          connect: { id: session.userId },
        },
        ...(coAuthorsData.length > 0
          ? {
            authors: {
              create: coAuthorsData,
            },
          }
          : {}),
      },
    });
  } catch (err: any) {
    if (err.message === "NEXT_REDIRECT") throw err;
    return { error: err.message || "Failed to create draft article." };
  }

  revalidatePath("/", "layout");
  redirect("/admin/articles");
}

// 2. Submit Article for Review
export async function submitArticleAction(articleId: string) {
  await requireAuth(["AUTHOR", "POST_EDITOR", "ADMIN"]);
  try {
    await prisma.article.update({
      where: { id: articleId },
      data: { status: "DRAFT" },
    });
  } catch (e) { }
  revalidatePath("/", "layout");
  return { success: true };
}

// 3. Mark Article as Under Review
export async function reviewArticleAction(articleId: string) {
  await requireAuth(["POST_EDITOR", "ADMIN"]);
  try {
    await prisma.article.update({
      where: { id: articleId },
      data: { status: "DRAFT" },
    });
  } catch (e) { }
  revalidatePath("/", "layout");
  return { success: true };
}

// 4. Request Changes with Editor Notes
export async function requestArticleChangesAction(articleId: string, editorNotes: string) {
  await requireAuth(["POST_EDITOR", "ADMIN"]);
  try {
    await prisma.article.update({
      where: { id: articleId },
      data: { status: "DRAFT" },
    });
  } catch (e) { }
  revalidatePath("/", "layout");
  return { success: true };
}

// 5. Publish Article
export async function publishArticleAction(articleId: string) {
  const session = await requireAuth(["POST_EDITOR", "ADMIN"]);
  try {
    const dbArt = await prisma.article.findUnique({
      where: { id: articleId },
      include: { author: true },
    });

    if (dbArt && dbArt.author?.id === session.userId && !session.roles.includes("ADMIN")) {
      throw new Error("Security Violation: Authors cannot approve or publish their own articles.");
    }

    await prisma.article.update({
      where: { id: articleId },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
  } catch (e: any) {
    if (e.message?.includes("Security Violation")) throw e;
  }
  revalidatePath("/", "layout");
  return { success: true };
}

// Helper to fetch articles for admin list
export async function getAdminArticlesList(): Promise<LocalArticleRecord[]> {
  const session = await getSession();
  if (!session) return [];

  try {
    const dbArticles = await prisma.article.findMany({
      include: {
        author: true,
        authors: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbArticles.length > 0) {
      let filtered = dbArticles;
      if (session.roles.includes("AUTHOR") && !session.roles.includes("POST_EDITOR") && !session.roles.includes("ADMIN")) {
        filtered = dbArticles.filter((a) => a.author?.id === session.userId);
      }

      return filtered.map((a) => {
        const authorsList: ArticleAuthor[] =
          a.authors && a.authors.length > 0
            ? a.authors.map((m: any) => ({
              id: m.id,
              name: m.name,
              avatarUrl: undefined,
              title: m.role || "عضو فريق بروميثيوس",
              department: "عام",
              bio: undefined,
            }))
            : [
              {
                id: a.author?.id || "unknown",
                name: a.author?.fullName || "محرر بروميثيوس",
                avatarUrl: a.author?.image || undefined,
                title: "عضو فريق بروميثيوس",
                department: "عام",
              },
            ];

        return {
          id: a.id,
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt || "",
          content: a.content,
          coverImage: a.coverImage || undefined,
          categoryName: (a as any).category?.name || "عام",
          status: a.status,
          editorNotes: undefined,
          authorId: a.author?.id || "unknown",
          authorName: authorsList.map((au) => au.name).join("، "),
          authors: authorsList,
          publishedAt: a.publishedAt?.toISOString(),
          createdAt: a.createdAt.toISOString(),
        };
      });
    }
  } catch (e) { }

  return [];
}

// Get Public Published Articles for Public Articles Page
export async function getPublicArticlesAction(): Promise<LocalArticleRecord[]> {
  try {
    const dbArticles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      include: {
        author: true,
        authors: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbArticles.length > 0) {
      return dbArticles.map((a) => {
        const authorsList: ArticleAuthor[] =
          a.authors && a.authors.length > 0
            ? a.authors.map((m: any) => ({
              id: m.id,
              name: m.name,
              avatarUrl: undefined,
              title: m.role || "عضو فريق بروميثيوس",
              department: "عام",
              bio: undefined,
            }))
            : [
              {
                id: a.author?.id || "unknown",
                name: a.author?.fullName || "محرر بروميثيوس",
                avatarUrl: a.author?.image || undefined,
                title: "عضو فريق بروميثيوس",
                department: "عام",
              },
            ];

        return {
          id: a.id,
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt || "",
          content: a.content,
          coverImage: a.coverImage || undefined,
          categoryName: (a as any).category?.name || "عام",
          status: a.status,
          editorNotes: undefined,
          authorId: a.author?.id || "unknown",
          authorName: authorsList.map((au) => au.name).join("، "),
          authors: authorsList,
          publishedAt: a.publishedAt?.toISOString(),
          createdAt: a.createdAt.toISOString(),
        };
      });
    }
  } catch (e) { }

  return [];
}

// 6. Update Article
export async function updateArticleAction(prevState: any, formData: FormData) {
  const session = await requireAuth(["AUTHOR", "POST_EDITOR", "ADMIN"]);

  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString().trim();
  const excerpt = formData.get("excerpt")?.toString().trim() || "";
  const content = formData.get("content")?.toString().trim();
  const coverImage = formData.get("coverImage")?.toString() || "";
  const rawStatus = formData.get("status")?.toString();
  const status = (rawStatus === "PUBLISHED" ? "PUBLISHED" : "DRAFT") as ArticleStatus;
  const rawAuthorIds = formData.get("authorIds")?.toString() || "";

  if (!id || !title || !content) {
    return { error: "Article ID, title, and content are required." };
  }

  let selectedAuthorIds: string[] = [];
  if (rawAuthorIds) {
    try {
      selectedAuthorIds = JSON.parse(rawAuthorIds);
    } catch (e) {
      selectedAuthorIds = rawAuthorIds.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }

  // دعم تحديث الرابط (Slug) في حال تغير العنوان
  const slug = title
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\u0621-\u064A\u0660-\u0669\-]+/g, "")
    .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4);

  try {
    let coAuthorsData: { name: string; role: string }[] = [];
    if (selectedAuthorIds.length > 0) {
      const members = await prisma.member.findMany({
        where: { id: { in: selectedAuthorIds } },
      });
      coAuthorsData = members.map((m: any) => ({
        name: m.fullName,
        role: "مؤلف مشارك",
      }));
    }

    await prisma.article.update({
      where: { id },
      data: {
        title,
        slug, // تحديث الرابط ليتوافق مع العنوان الجديد
        excerpt,
        content,
        coverImage,
        status,
        ...(status === "PUBLISHED" ? { publishedAt: new Date() } : {}),
        ...(coAuthorsData.length > 0
          ? {
            authors: {
              deleteMany: {},
              create: coAuthorsData,
            },
          }
          : {}),
      },
    });
  } catch (err: any) {
    if (err.message === "NEXT_REDIRECT") throw err;
    console.error("Prisma Update Error:", err);
    return { error: err.message || "Failed to update article." };
  }

  revalidatePath("/", "layout");
  redirect("/admin/articles");
}

// 7. Delete Article
export async function deleteArticleAction(articleId: string) {
  await requireAuth(["POST_EDITOR", "ADMIN"]);
  try {
    await prisma.article.delete({
      where: { id: articleId },
    });
  } catch (err: any) {
    return { error: err.message || "Failed to delete article." };
  }
  revalidatePath("/", "layout");
  return { success: true };
}

// 8. Increment Article View Count
export async function incrementArticleViewCount(articleId: string) {
  if (!articleId) return;
  try {
    await prisma.article.update({
      where: { id: articleId },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  } catch (e) { }
}

// 9. Dashboard Analytics Data
export interface AnalyticsData {
  totalViews: number;
  totalArticles: number;
  publishedArticlesCount: number;
  draftArticlesCount: number;
  activeMembersCount: number;
  certificatesIssuedCount: number;
  topArticles: {
    id: string;
    title: string;
    slug: string;
    viewCount: number;
    categoryName: string;
    publishedAt: string | null;
  }[];
}

export async function getDashboardAnalyticsData(): Promise<AnalyticsData> {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required.");
  }

  try {
    const [
      articles,
      publishedCount,
      draftCount,
      membersCount,
      certificatesCount,
      topArticlesList,
    ] = await Promise.all([
      prisma.article.findMany({ select: { viewCount: true } }),
      prisma.article.count({ where: { status: "PUBLISHED" } }),
      prisma.article.count({ where: { status: "DRAFT" } }),
      prisma.member.count({ where: { status: "ACTIVE" } }),
      prisma.certificate.count(),
      prisma.article.findMany({
        where: { status: "PUBLISHED" },
        take: 5,
        orderBy: { viewCount: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          viewCount: true,
          publishedAt: true,
        },
      }),
    ]);

    const totalViews = articles.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);

    return {
      totalViews,
      totalArticles: articles.length,
      publishedArticlesCount: publishedCount,
      draftArticlesCount: draftCount,
      activeMembersCount: membersCount,
      certificatesIssuedCount: certificatesCount,
      topArticles: topArticlesList.map((a: any) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        viewCount: a.viewCount || 0,
        categoryName: a.category?.name || "عام",
        publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
      })),
    };
  } catch (e: any) {
    return {
      totalViews: 0,
      totalArticles: 0,
      publishedArticlesCount: 0,
      draftArticlesCount: 0,
      activeMembersCount: 0,
      certificatesIssuedCount: 0,
      topArticles: [],
    };
  }
}