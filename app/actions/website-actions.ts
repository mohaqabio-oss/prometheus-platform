"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export interface PartnerRecord {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  order: number;
}

// Default Site Settings Fallback Map
const DEFAULT_SITE_SETTINGS: Record<string, string> = {
  "hero.title": "فريق بروميثيوس التطوعي",
  "hero.subtitle": "منظمة مؤسسية تطوعية تهدف لنشر المعرفة الأكاديمية، بناء المنصات البرمجية، وإعادة تعريف العمل التطوعي الأكاديمي لدى الشباب.",
  "about.title": "إشعال المعرفة وتمكين العقول الشبابية",
  "about.description": "استلهاماً من رمزية بروميثيوس في إيصال المعرفة للنفع العام، يعمل فريقنا التطوعي برؤية هندسية وأكاديمية صارمة لبناء منصات تقنية وبحوث مفتوحة المصدر تخدم المجتمع.",
  "stat.hours": "+600",
  "stat.articles": "+45",
  "stat.members": "+30",
  "stat.departments": "4",
  "partners.title": "شركاؤنا الداعمون والمؤسسات الراعية",
  "partners.subtitle": "نفخر بالتعاون مع المؤسسات التكنولوجية والمنابر الأكاديمية لدعم منصاتنا التطوعية المفتوحة.",
};

let MOCK_SITE_SETTINGS: Record<string, string> = { ...DEFAULT_SITE_SETTINGS };

let MOCK_PARTNERS: PartnerRecord[] = [
  {
    id: "part-1",
    name: "مؤسسة العراق التقنية",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80",
    websiteUrl: "https://example.org",
    order: 1,
  },
  {
    id: "part-2",
    name: "مبادرة البرمجيات المفتوحة",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80",
    websiteUrl: "https://example.org",
    order: 2,
  },
  {
    id: "part-3",
    name: "شبكة الباحثين الشباب",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80",
    websiteUrl: "https://example.org",
    order: 3,
  },
];

// Helper: Require ADMIN Role for CMS mutations
async function requireAdminRole() {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required. Please log in.");
  }
  if (!session.roles.includes("ADMIN")) {
    throw new Error("Unauthorized: Only ADMIN users can modify homepage CMS content and partners.");
  }
  return session;
}

// 1. Get Site Settings
export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const settings = await prisma.siteSetting.findMany();
    if (settings.length > 0) {
      const result = { ...DEFAULT_SITE_SETTINGS };
      settings.forEach((s) => {
        result[s.key] = s.value;
      });
      return result;
    }
  } catch (e) {}

  return MOCK_SITE_SETTINGS;
}

// 2. Update Site Settings (ADMIN only)
export async function updateSiteSettingsAction(formData: FormData): Promise<void> {
  await requireAdminRole();

  const entries = Array.from(formData.entries());
  for (const [key, value] of entries) {
    if (key.startsWith("setting.")) {
      const settingKey = key.replace("setting.", "");
      const settingVal = value.toString().trim();

      MOCK_SITE_SETTINGS[settingKey] = settingVal;

      try {
        await prisma.siteSetting.upsert({
          where: { key: settingKey },
          update: { value: settingVal },
          create: { key: settingKey, value: settingVal },
        });
      } catch (e) {}
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/website");
}

// 3. Get Partners
export async function getPartners(): Promise<PartnerRecord[]> {
  try {
    const dbPartners = await prisma.partner.findMany({
      orderBy: { order: "asc" },
    });
    if (dbPartners.length > 0) {
      return dbPartners.map((p) => ({
        id: p.id,
        name: p.name,
        logoUrl: p.logoUrl,
        websiteUrl: p.websiteUrl || undefined,
        order: p.order,
      }));
    }
  } catch (e) {}

  return MOCK_PARTNERS;
}

// 4. Add Partner Logo (ADMIN only)
export async function addPartnerAction(prevState: any, formData: FormData) {
  await requireAdminRole();

  const name = formData.get("name")?.toString().trim();
  const logoUrl = formData.get("logoUrl")?.toString().trim();
  const websiteUrl = formData.get("websiteUrl")?.toString().trim() || "";

  if (!name || !logoUrl) {
    return { error: "Partner name and Logo URL are required." };
  }

  const newPartner: PartnerRecord = {
    id: `part-${Date.now()}`,
    name,
    logoUrl,
    websiteUrl,
    order: MOCK_PARTNERS.length + 1,
  };

  MOCK_PARTNERS.push(newPartner);

  try {
    await prisma.partner.create({
      data: {
        name,
        logoUrl,
        websiteUrl: websiteUrl || undefined,
        order: newPartner.order,
      },
    });
  } catch (e) {}

  revalidatePath("/");
  revalidatePath("/admin/website");
  return { success: true };
}

// 5. Delete Partner (ADMIN only)
export async function deletePartnerAction(partnerId: string) {
  await requireAdminRole();

  MOCK_PARTNERS = MOCK_PARTNERS.filter((p) => p.id !== partnerId);

  try {
    await prisma.partner.delete({
      where: { id: partnerId },
    });
  } catch (e) {}

  revalidatePath("/");
  revalidatePath("/admin/website");
  return { success: true };
}
