"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { RoleType } from "@prisma/client";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface PartnerRecord {
  id: string;
  name: string;
  slug: string;
  description?: string;
  bio?: string;
  logoUrl: string;
  websiteUrl?: string;
  order: number;
}

// ── Auth helper ───────────────────────────────────────────────────────────────
async function requireAdmin() {
  const session = await getSession();
  if (!session || !session.roles.includes("ADMIN" as RoleType)) {
    throw new Error("Admin access required.");
  }
  return session;
}

// ── Slug generator ────────────────────────────────────────────────────────────
function generateSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u0621-\u064A\u0660-\u0669\-]+/g, "")
    .replace(/(^-|-$)+/g, "")
    + "-" + Date.now().toString().slice(-4);
}

// ── Get all partners ──────────────────────────────────────────────────────────
export async function getPartnersAction(): Promise<PartnerRecord[]> {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: { order: "asc" },
    });
    return partners.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description || undefined,
      bio: p.bio || undefined,
      logoUrl: p.logoUrl,
      websiteUrl: p.websiteUrl || undefined,
      order: p.order,
    }));
  } catch {
    return [];
  }
}

// ── Get partner by slug (public) ──────────────────────────────────────────────
export async function getPartnerBySlugAction(slug: string) {
  try {
    const partner = await prisma.partner.findUnique({
      where: { slug },
      include: {
        articles: {
          include: {
            article: {
              include: { authors: true },
            },
          },
        },
        projects: {
          include: {
            project: true,
          },
        },
      },
    });
    return partner;
  } catch {
    return null;
  }
}

// ── Create partner ────────────────────────────────────────────────────────────
export async function addPartnerAction(prevState: any, formData: FormData) {
  try {
    await requireAdmin();
  } catch {
    return { error: "Admin access required." };
  }

  const name = formData.get("name")?.toString().trim();
  const logoUrl = formData.get("logoUrl")?.toString().trim();
  const websiteUrl = formData.get("websiteUrl")?.toString().trim() || null;
  const description = formData.get("description")?.toString().trim() || null;
  const bio = formData.get("bio")?.toString().trim() || null;
  const customSlug = formData.get("slug")?.toString().trim();

  if (!name || !logoUrl) {
    return { error: "اسم الشريك ورابط الشعار مطلوبان." };
  }

  const slug = customSlug && customSlug.length > 0 ? customSlug : generateSlug(name);

  try {
    const partner = await prisma.partner.create({
      data: { name, slug, logoUrl, websiteUrl, description, bio },
    });
    revalidatePath("/", "layout");
    return { success: true, partner };
  } catch (err: any) {
    if (err.code === "P2002") return { error: "هذا الاسم أو الرابط المختصر مستخدم بالفعل." };
    return { error: err.message || "فشل إضافة الشريك." };
  }
}

// ── Update partner ────────────────────────────────────────────────────────────
export async function updatePartnerAction(prevState: any, formData: FormData) {
  try {
    await requireAdmin();
  } catch {
    return { error: "Admin access required." };
  }

  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();
  const logoUrl = formData.get("logoUrl")?.toString().trim();
  const websiteUrl = formData.get("websiteUrl")?.toString().trim() || null;
  const description = formData.get("description")?.toString().trim() || null;
  const bio = formData.get("bio")?.toString().trim() || null;
  const slug = formData.get("slug")?.toString().trim();

  if (!id || !name || !logoUrl || !slug) {
    return { error: "جميع الحقول المطلوبة يجب إدخالها." };
  }

  // Handle linked articles
  const rawArticleIds = formData.get("articleIds")?.toString() || "[]";
  let articleIds: string[] = [];
  try { articleIds = JSON.parse(rawArticleIds); } catch { articleIds = []; }

  // Handle linked projects
  const rawProjectIds = formData.get("projectIds")?.toString() || "[]";
  let projectIds: string[] = [];
  try { projectIds = JSON.parse(rawProjectIds); } catch { projectIds = []; }

  try {
    await prisma.$transaction([
      prisma.partner.update({
        where: { id },
        data: { name, slug, logoUrl, websiteUrl, description, bio },
      }),
      prisma.partnerArticle.deleteMany({ where: { partnerId: id } }),
      ...(articleIds.length > 0
        ? [prisma.partnerArticle.createMany({
            data: articleIds.map((aid) => ({ partnerId: id, articleId: aid })),
            skipDuplicates: true,
          })]
        : []),
      prisma.partnerProject.deleteMany({ where: { partnerId: id } }),
      ...(projectIds.length > 0
        ? [prisma.partnerProject.createMany({
            data: projectIds.map((pid) => ({ partnerId: id, projectId: pid })),
            skipDuplicates: true,
          })]
        : []),
    ]);
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "فشل تحديث الشريك." };
  }
}

// ── Delete partner ────────────────────────────────────────────────────────────
export async function deletePartnerAction(id: string) {
  try {
    await requireAdmin();
    await prisma.partner.delete({ where: { id } });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "فشل حذف الشريك." };
  }
}
