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

let MOCK_DB_ARTICLES: LocalArticleRecord[] = [];

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
      return dbMembers.map((m) => ({
        id: m.id,
        name: m.fullName,
        avatarUrl: m.avatarUrl || m.profileImage || undefined,
        title: m.title || "عضو فريق بروميثيوس",
        department: m.departmentName || "عام",
        bio: m.bio || undefined,
      }));
    }
  } catch (e) {}

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
  const categoryName = formData.get("categoryName")?.toString() || "Technology";
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

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4);

  try {
    try {
      // Find or create current logged in user's Member record as primary author
      let currentMember = await prisma.member.findFirst({
        where: { userId: session.userId },
      });

      if (!currentMember) {
        currentMember = await prisma.member.create({
          data: {
            fullName: session.fullName,
            userId: session.userId,
            title: "محرر بروميثيوس",
            departmentName: "البحث والتحرير",
          },
        });
      }

      // Merge primary author with selected co-authors
      const allAuthorIds = Array.from(
        new Set([currentMember.id, ...selectedAuthorIds])
      );

      const article = await prisma.article.create({
        data: {
          title,
          slug,
          excerpt,
          content,
          coverImage,
          categoryName: categoryName || "عام",
          status: "DRAFT",
          author: {
            connect: { id: currentMember.id },
          },
          authors: {
            connect: allAuthorIds.map((id) => ({ id })),
          },
        },
      });
      revalidatePath("/admin/articles");
      redirect("/admin/articles");
    } catch (dbErr: any) {
      if (dbErr.message === "NEXT_REDIRECT") throw dbErr;

      const newArticle: LocalArticleRecord = {
        id: `art-${Date.now()}`,
        title,
        slug,
        excerpt,
        content,
        categoryName,
        coverImage,
        status: "DRAFT",
        authorId: session.userId,
        authorName: session.fullName,
        authors: [
          {
            id: session.userId,
            name: session.fullName,
            title: "محرر بروميثيوس",
            department: "البحث والتحرير",
          },
        ],
        createdAt: new Date().toISOString(),
      };
      MOCK_DB_ARTICLES.unshift(newArticle);
    }
  } catch (err: any) {
    if (err.message === "NEXT_REDIRECT") throw err;
    return { error: err.message || "Failed to create draft article." };
  }

  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

// 2. Submit Article for Review
export async function submitArticleAction(articleId: string) {
  await requireAuth(["AUTHOR", "POST_EDITOR", "ADMIN"]);

  const art = MOCK_DB_ARTICLES.find((a) => a.id === articleId);
  if (art) {
    art.status = "SUBMITTED";
  }

  try {
    await prisma.article.update({
      where: { id: articleId },
      data: { status: "SUBMITTED" },
    });
  } catch (e) {}

  revalidatePath("/admin/articles");
  return { success: true };
}

// 3. Mark Article as Under Review
export async function reviewArticleAction(articleId: string) {
  await requireAuth(["POST_EDITOR", "ADMIN"]);

  const art = MOCK_DB_ARTICLES.find((a) => a.id === articleId);
  if (art) {
    art.status = "IN_REVIEW";
  }

  try {
    await prisma.article.update({
      where: { id: articleId },
      data: { status: "IN_REVIEW" },
    });
  } catch (e) {}

  revalidatePath("/admin/articles");
  return { success: true };
}

// 4. Request Changes with Editor Notes
export async function requestArticleChangesAction(articleId: string, editorNotes: string) {
  await requireAuth(["POST_EDITOR", "ADMIN"]);

  const art = MOCK_DB_ARTICLES.find((a) => a.id === articleId);
  if (art) {
    art.status = "CHANGES_REQUESTED";
    art.editorNotes = editorNotes;
  }

  try {
    await prisma.article.update({
      where: { id: articleId },
      data: {
        status: "CHANGES_REQUESTED",
        editorNotes,
      },
    });
  } catch (e) {}

  revalidatePath("/admin/articles");
  return { success: true };
}

// 5. Publish Article - STRICT SECURITY: Authors cannot publish their own articles!
export async function publishArticleAction(articleId: string) {
  const session = await requireAuth(["POST_EDITOR", "ADMIN"]);

  const art = MOCK_DB_ARTICLES.find((a) => a.id === articleId);
  if (art) {
    if (art.authorId === session.userId && !session.roles.includes("ADMIN")) {
      throw new Error("Security Violation: Authors cannot approve or publish their own articles.");
    }
    art.status = "PUBLISHED";
    art.publishedAt = new Date().toISOString();
  }

  try {
    const dbArt = await prisma.article.findUnique({
      where: { id: articleId },
      include: { author: true },
    });

    if (dbArt && dbArt.author?.userId === session.userId && !session.roles.includes("ADMIN")) {
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

  revalidatePath("/admin/articles");
  revalidatePath("/articles");
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
        filtered = dbArticles.filter((a) => a.author?.userId === session.userId);
      }

      return filtered.map((a) => {
        const authorsList: ArticleAuthor[] =
          a.authors && a.authors.length > 0
            ? a.authors.map((m) => ({
                id: m.id,
                name: m.fullName,
                avatarUrl: m.avatarUrl || m.profileImage || undefined,
                title: m.title || "عضو فريق بروميثيوس",
                department: m.departmentName || "عام",
                bio: m.bio || undefined,
              }))
            : [
                {
                  id: a.author?.id || a.authorId,
                  name: a.author?.fullName || "محرر بروميثيوس",
                  avatarUrl: a.author?.avatarUrl || undefined,
                  title: a.author?.title || "عضو فريق بروميثيوس",
                  department: a.author?.departmentName || "عام",
                },
              ];

        return {
          id: a.id,
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt || "",
          content: a.content,
          coverImage: a.coverImage || undefined,
          categoryName: a.categoryName || "General",
          status: a.status,
          editorNotes: a.editorNotes || undefined,
          authorId: a.author?.userId || a.authorId,
          authorName: authorsList.map((au) => au.name).join("، "),
          authors: authorsList,
          publishedAt: a.publishedAt?.toISOString(),
          createdAt: a.createdAt.toISOString(),
        };
      });
    }
  } catch (e) {}

  let filtered = MOCK_DB_ARTICLES;
  if (session.roles.includes("AUTHOR") && !session.roles.includes("POST_EDITOR") && !session.roles.includes("ADMIN")) {
    filtered = MOCK_DB_ARTICLES.filter((a) => a.authorId === session.userId);
  }

  return filtered;
}

// Get Public Published Articles for Public Articles Page
export async function getPublicArticlesAction(): Promise<LocalArticleRecord[]> {
  try {
    const dbArticles = await prisma.article.findMany({
      where: { status: ArticleStatus.PUBLISHED },
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
            ? a.authors.map((m) => ({
                id: m.id,
                name: m.fullName,
                avatarUrl: m.avatarUrl || m.profileImage || undefined,
                title: m.title || "عضو فريق بروميثيوس",
                department: m.departmentName || "عام",
                bio: m.bio || undefined,
              }))
            : [
                {
                  id: a.author?.id || a.authorId,
                  name: a.author?.fullName || "محرر بروميثيوس",
                  avatarUrl: a.author?.avatarUrl || undefined,
                  title: a.author?.title || "عضو فريق بروميثيوس",
                  department: a.author?.departmentName || "عام",
                },
              ];

        return {
          id: a.id,
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt || "",
          content: a.content,
          coverImage: a.coverImage || undefined,
          categoryName: a.categoryName || "عام",
          status: a.status,
          editorNotes: a.editorNotes || undefined,
          authorId: a.author?.userId || a.authorId,
          authorName: authorsList.map((au) => au.name).join("، "),
          authors: authorsList,
          publishedAt: a.publishedAt?.toISOString(),
          createdAt: a.createdAt.toISOString(),
        };
      });
    }
  } catch (e) {}

  return MOCK_DB_ARTICLES;
}

// 6. Update Article
export async function updateArticleAction(prevState: any, formData: FormData) {
  const session = await requireAuth(["AUTHOR", "POST_EDITOR", "ADMIN"]);

  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString().trim();
  const excerpt = formData.get("excerpt")?.toString().trim() || "";
  const content = formData.get("content")?.toString().trim();
  const categoryName = formData.get("categoryName")?.toString() || "Technology";
  const coverImage = formData.get("coverImage")?.toString() || "";
  const status = (formData.get("status")?.toString() || "DRAFT") as ArticleStatus;
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

  try {
    await prisma.article.update({
      where: { id },
      data: {
        title,
        excerpt,
        content,
        coverImage,
        categoryName: categoryName || undefined,
        status,
        ...(status === "PUBLISHED" ? { publishedAt: new Date() } : {}),
        ...(selectedAuthorIds.length > 0
          ? {
              authors: {
                set: selectedAuthorIds.map((authorId) => ({ id: authorId })),
              },
            }
          : {}),
      },
    });
  } catch (err: any) {
    if (err.message === "NEXT_REDIRECT") throw err;
    return { error: err.message || "Failed to update article." };
  }

  revalidatePath("/admin/articles");
  revalidatePath("/articles");
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

  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  return { success: true };
}
