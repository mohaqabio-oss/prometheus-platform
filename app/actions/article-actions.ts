"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { ArticleStatus, RoleType } from "@prisma/client";

// In-Memory Mock Store Fallback for Development Preview when PostgreSQL DB is not seeded
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

// 1. Create Article Draft
export async function createArticleDraftAction(prevState: any, formData: FormData) {
  const session = await requireAuth(["AUTHOR", "POST_EDITOR", "ADMIN"]);

  const title = formData.get("title")?.toString().trim();
  const excerpt = formData.get("excerpt")?.toString().trim() || "";
  const content = formData.get("content")?.toString().trim();
  const categoryName = formData.get("categoryName")?.toString() || "Technology";
  const coverImage = formData.get("coverImage")?.toString() || "";

  if (!title || !content) {
    return { error: "Article title and body content are required." };
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4);

  try {
    // Try database insertion
    try {
      const article = await prisma.article.create({
        data: {
          title,
          slug,
          excerpt,
          content,
          coverImage,
          status: "DRAFT",
          author: {
            connectOrCreate: {
              where: { userId: session.userId },
              create: {
                fullName: session.fullName,
                userId: session.userId,
              },
            },
          },
        },
      });
      revalidatePath("/admin/articles");
      redirect("/admin/articles");
    } catch (dbErr) {
      // Fallback in-memory insertion for preview
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

// 2. Submit Article for Review (DRAFT / CHANGES_REQUESTED -> SUBMITTED)
export async function submitArticleAction(articleId: string) {
  const session = await requireAuth(["AUTHOR", "POST_EDITOR", "ADMIN"]);

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

// 3. Mark Article as Under Review (POST_EDITOR / ADMIN)
export async function reviewArticleAction(articleId: string) {
  const session = await requireAuth(["POST_EDITOR", "ADMIN"]);

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

// 4. Request Changes with Editor Notes (POST_EDITOR / ADMIN)
export async function requestArticleChangesAction(articleId: string, editorNotes: string) {
  const session = await requireAuth(["POST_EDITOR", "ADMIN"]);

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

// 5. Publish Article (POST_EDITOR / ADMIN) - STRICT SECURITY: Authors cannot publish their own articles!
export async function publishArticleAction(articleId: string) {
  const session = await requireAuth(["POST_EDITOR", "ADMIN"]);

  const art = MOCK_DB_ARTICLES.find((a) => a.id === articleId);
  if (art) {
    // SECURITY RULE ENFORCEMENT: Author cannot approve/publish own article unless ADMIN
    if (art.authorId === session.userId && !session.roles.includes("ADMIN")) {
      throw new Error("Security Violation: Authors cannot approve or publish their own articles. An independent editor must review and publish.");
    }
    art.status = "PUBLISHED";
    art.publishedAt = new Date().toISOString();
  }

  try {
    // Database check for self-publishing
    const dbArt = await prisma.article.findUnique({
      where: { id: articleId },
      include: { author: true },
    });

    if (dbArt && dbArt.author.userId === session.userId && !session.roles.includes("ADMIN")) {
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
  return { success: true };
}

// Helper to fetch articles for admin list
export async function getAdminArticlesList() {
  const session = await getSession();
  if (!session) return [];

  // Try DB query
  try {
    const dbArticles = await prisma.article.findMany({
      include: {
        author: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbArticles.length > 0) {
      let filtered = dbArticles;
      // If AUTHOR only, show their own articles
      if (session.roles.includes("AUTHOR") && !session.roles.includes("POST_EDITOR") && !session.roles.includes("ADMIN")) {
        filtered = dbArticles.filter((a) => a.author.userId === session.userId);
      }

      return filtered.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt || "",
        content: a.content,
        categoryName: a.category?.name || "General",
        status: a.status,
        editorNotes: a.editorNotes || undefined,
        authorId: a.author.userId || a.authorId,
        authorName: a.author.fullName,
        publishedAt: a.publishedAt?.toISOString(),
        createdAt: a.createdAt.toISOString(),
      }));
    }
  } catch (e) {}

  // Fallback to local mock data
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
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbArticles.length > 0) {
      return dbArticles.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt || "",
        content: a.content,
        categoryName: a.category?.name || "عام",
        status: a.status,
        editorNotes: a.editorNotes || undefined,
        authorId: a.author.userId || a.authorId,
        authorName: a.author.fullName,
        publishedAt: a.publishedAt?.toISOString(),
        createdAt: a.createdAt.toISOString(),
      }));
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

  if (!id || !title || !content) {
    return { error: "Article ID, title, and content are required." };
  }

  try {
    let categoryId: string | undefined = undefined;
    if (categoryName) {
      const cat = await prisma.category.findFirst({
        where: { name: categoryName },
      });
      if (cat) categoryId = cat.id;
    }

    await prisma.article.update({
      where: { id },
      data: {
        title,
        excerpt,
        content,
        coverImage,
        status,
        ...(status === "PUBLISHED" ? { publishedAt: new Date() } : {}),
        ...(categoryId ? { categoryId } : {}),
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

