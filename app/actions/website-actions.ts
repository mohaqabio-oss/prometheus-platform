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

export interface PageHeaderConfig {
  title: string;
  subtitle: string;
  badge?: string;
  ethosTitle?: string;
  ethosText?: string;
  email?: string;
  officeInfo?: string;
  hours?: string;
}

export interface PageHeadersMap {
  homeHero: PageHeaderConfig;
  homeAbout: PageHeaderConfig;
  articles: PageHeaderConfig;
  members: PageHeaderConfig;
  joinUs: PageHeaderConfig;
  collections: PageHeaderConfig;
  partners: PageHeaderConfig;
  editorialBoard: PageHeaderConfig;
  publicationEthics: PageHeaderConfig;
  contact: PageHeaderConfig;
}

export interface HomeBlockConfig {
  id: string;
  type: "info-box" | "image-card" | "shortcut-link";
  title: string;
  subtitle?: string;
  content?: string;
  image_url?: string;
  target_url?: string;
}

export interface AcademicSpecsConfig {
  enabled: boolean;
  volumeTitle: string;
  peerReviewType: string;
  licenseType: string;
  repositoryStatus: string;
}

export interface SiteSettingsData {
  primaryColor: string;
  secondaryColor: string;
  pageHeaders: PageHeadersMap;
  homeBlocks: HomeBlockConfig[];
  academicSpecs: AcademicSpecsConfig;
}

// Default Site Settings Fallback Map
const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  primaryColor: "#D49B4B",
  secondaryColor: "#0A0F1D",
  pageHeaders: {
    homeHero: {
      title: "فريق بروميثيوس التطوعي",
      subtitle:
        "مؤسسة تطوعية تعنى بتطوير المنصات البرمجية، نشر المقالات والبحوث المفتوحة المصدر، وتدريب الكوادر والشباب.",
      badge: "منصة مؤسسية وأكاديمية تطوعية",
    },
    homeAbout: {
      title: "منظمة تطوعية تسعى للنهوض بالواقع الأكاديمي والتقني",
      subtitle:
        "تأسس فريق بروميثيوس التطوعي بهدف سد الثغرة بين الدراسة الأكاديمية وسوق العمل التقني، من خلال مشاريع حقيقية وأبحاث رصينة.",
      badge: "رؤيتنا ورسالتنا",
    },
    articles: {
      title: "المكتبة والأوراق البحثية المفتوحة",
      subtitle:
        "منصة تحريرية موجهة لنشر المقالات المنهجية، والمراجعات البحثية المصاغة بأعلى معايير الرصانة الأكاديمية.",
      badge: "منصة منشورات بروميثيوس",
    },
    members: {
      title: "دليل الأعضاء والكوادر التطوعية",
      subtitle:
        "استعرض الأعضاء والفاعلين في مختلف أقسام تخصصات الفريق والأدوار القيادية.",
      badge: "فريق العمل",
    },
    joinUs: {
      title: "انضم إلى فريق بروميثيوس التطوعي",
      subtitle:
        "ساهم بمهاراتك البرمجية أو البحثية أو الإدارية في بناء بيئة عربية أكاديمية ناضجة ومفتوحة المصدر.",
      badge: "التوظيف والانضمام",
    },
    collections: {
      title: "المجموعات والسلاسل الأكاديمية",
      subtitle:
        "سلاسل مقالات وأوراق بحثية مرتبة ومجمعة حسب التخصصات والموضوعات العلمية.",
      badge: "السلاسل العلمية",
    },
    partners: {
      title: "شركاؤنا الداعمون والمؤسسات الراعية",
      subtitle:
        "نفخر بالتعاون مع المؤسسات التكنولوجية والمنابر الأكاديمية لدعم منصاتنا التطوعية المفتوحة.",
      badge: "الشركاء والرعاة",
    },
    editorialBoard: {
      title: "الهيئة التحريرية والاستشارية",
      subtitle:
        "أعضاء الهيئة التحريرية والمحكمين الأكاديميين والقائمين على مراجعة المنشورات والبحوث وفق معايير النشر والأكاديميا المعتمدة.",
      badge: "الكادر التحريري الأكاديمي",
    },
    publicationEthics: {
      title: "أخلاقيات النشر والمعايير الأكاديمية",
      subtitle:
        "دليل النزاهة العلمية وقواعد السلوك المهني المعتمدة لدى فريق ومجلة بروميثيوس التطوعية لضمان جودة الأبحاث المنشورة.",
      badge: "سياسات وقواعد النشر",
      ethosTitle: "التزامنا بالشفافية والنزاهة العلمية",
      ethosText:
        "تلتزم مجلة ومجموعة بروميثيوس التطوعية بكافة مبادئ الشفافية والنزاهة الأكاديمية والتحكيم المنهجي المزدوج. نهدف لبناء منبر عربي موثوق يجمع بين الرصانة العلمية وروح العمل التطوعي المفتوح المصدر.",
    },
    contact: {
      title: "تواصل مع الهيئة التحريرية",
      subtitle:
        "نرحب باستفسارات الباحثين والمؤسسات الأكاديمية بشأن النشر، إيداع المقالات، والانضمام للكوادر التطوعية.",
      badge: "التواصل والاستفسارات الأكاديمية",
      email: "editorial@prometheus-voluntary.org",
      officeInfo: "فريق ومجلة بروميثيوس التطوعية - قسم النشر الأكاديمي والبحوث",
      hours: "الأحد - الخميس (9:00 ص - 5:00 م)",
    },
  },
  homeBlocks: [
    {
      id: "block-1",
      type: "info-box",
      title: "مشاريع برمجية مفتوحة المصدر 100%",
      subtitle: "الهندسة والبرمجيات",
      content:
        "نحن نؤمن بأن المعرفة التقنية والبرمجية يجب أن تتاح للجميع لبناء مجتمع برمجي رصين وعالي الكفاءة.",
      target_url: "/articles",
    },
    {
      id: "block-2",
      type: "image-card",
      title: "الأبحاث والمقالات العلمية المقننة",
      subtitle: "البحث والأكاديميا",
      content:
        "إعداد أوراق بحثية ومراجعات منهجية باللغة العربية لنشر الفكر العلمي الهادئ والموثق بأعلى المعايير.",
      image_url:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      target_url: "/articles",
    },
    {
      id: "block-3",
      type: "shortcut-link",
      title: "تقديم طلب انضمام كعضو متطوع في الفريق",
      subtitle: "انضم لفرصتنا التطوعية القادمة وكن جزءاً من الفاعلين معنا",
      content:
        "طريقك لاكتساب الخبرات والعمل الجماعي وتطوير مهاراتك البرمجية والأكاديمية المباشرة.",
      target_url: "/join-us",
    },
  ],
  academicSpecs: {
    enabled: false,
    volumeTitle: "SPEC REGISTRY // VOL. 04",
    peerReviewType: "Double-Blind Peer Review",
    licenseType: "Open Access (CC BY 4.0)",
    repositoryStatus: "Active Academic Repository",
  },
};

let MOCK_SITE_SETTINGS: SiteSettingsData = JSON.parse(
  JSON.stringify(DEFAULT_SITE_SETTINGS)
);
let MOCK_PARTNERS: PartnerRecord[] = [];

// Helper: Require ADMIN Role for Site Builder mutations
async function requireAdminRole() {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required. Please log in.");
  }
  if (!session.roles.includes("ADMIN")) {
    throw new Error(
      "Unauthorized: Only ADMIN users can modify site appearance and settings."
    );
  }
  return session;
}

// 1. Get Site Settings
export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const setting = await prisma.siteSetting.findFirst();
    if (setting) {
      const dbPageHeaders = (setting.pageHeaders as unknown as PageHeadersMap) || {};
      const pageHeadersMerged: PageHeadersMap = {
        ...DEFAULT_SITE_SETTINGS.pageHeaders,
        ...dbPageHeaders,
      };

      // Deep merge for optional object keys
      Object.keys(DEFAULT_SITE_SETTINGS.pageHeaders).forEach((key) => {
        const k = key as keyof PageHeadersMap;
        pageHeadersMerged[k] = {
          ...DEFAULT_SITE_SETTINGS.pageHeaders[k],
          ...(dbPageHeaders[k] || {}),
        };
      });

      const homeBlocksMerged =
        (setting.homeBlocks as unknown as HomeBlockConfig[]) ||
        DEFAULT_SITE_SETTINGS.homeBlocks;

      const academicSpecsMerged: AcademicSpecsConfig = {
        ...DEFAULT_SITE_SETTINGS.academicSpecs,
        ...((setting.academicSpecs as unknown as AcademicSpecsConfig) || {}),
      };

      return {
        primaryColor: setting.primaryColor || DEFAULT_SITE_SETTINGS.primaryColor,
        secondaryColor: setting.secondaryColor || DEFAULT_SITE_SETTINGS.secondaryColor,
        pageHeaders: pageHeadersMerged,
        homeBlocks: homeBlocksMerged,
        academicSpecs: academicSpecsMerged,
      };
    }
  } catch (e) {}

  return MOCK_SITE_SETTINGS;
}

// 2. Update Site Settings (ADMIN only)
export async function updateSiteBuilderAction(
  data: SiteSettingsData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdminRole();

    MOCK_SITE_SETTINGS = {
      primaryColor: data.primaryColor || DEFAULT_SITE_SETTINGS.primaryColor,
      secondaryColor: data.secondaryColor || DEFAULT_SITE_SETTINGS.secondaryColor,
      pageHeaders: {
        ...DEFAULT_SITE_SETTINGS.pageHeaders,
        ...(data.pageHeaders || {}),
      },
      homeBlocks: data.homeBlocks || [],
      academicSpecs: {
        ...DEFAULT_SITE_SETTINGS.academicSpecs,
        ...(data.academicSpecs || {}),
      },
    };

    try {
      const existing = await prisma.siteSetting.findFirst();
      if (existing) {
        await prisma.siteSetting.update({
          where: { id: existing.id },
          data: {
            primaryColor: MOCK_SITE_SETTINGS.primaryColor,
            secondaryColor: MOCK_SITE_SETTINGS.secondaryColor,
            pageHeaders: JSON.parse(JSON.stringify(MOCK_SITE_SETTINGS.pageHeaders)),
            homeBlocks: JSON.parse(JSON.stringify(MOCK_SITE_SETTINGS.homeBlocks)),
            academicSpecs: JSON.parse(JSON.stringify(MOCK_SITE_SETTINGS.academicSpecs)),
          },
        });
      } else {
        await prisma.siteSetting.create({
          data: {
            id: "default",
            primaryColor: MOCK_SITE_SETTINGS.primaryColor,
            secondaryColor: MOCK_SITE_SETTINGS.secondaryColor,
            pageHeaders: JSON.parse(JSON.stringify(MOCK_SITE_SETTINGS.pageHeaders)),
            homeBlocks: JSON.parse(JSON.stringify(MOCK_SITE_SETTINGS.homeBlocks)),
            academicSpecs: JSON.parse(JSON.stringify(MOCK_SITE_SETTINGS.academicSpecs)),
          },
        });
      }
    } catch (e) {
      console.error("Prisma update error in updateSiteBuilderAction:", e);
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/website");
    revalidatePath("/articles");
    revalidatePath("/members");
    revalidatePath("/join-us");
    revalidatePath("/collections");
    revalidatePath("/editorial-board");
    revalidatePath("/publication-ethics");
    revalidatePath("/contact");

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update site settings" };
  }
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

// 6. Get Public Website Data for Homepage
export async function getPublicWebsiteData() {
  const settings = await getSiteSettings();
  const partners = await getPartners();

  let hoursCount = 0;
  let articlesCount = 0;
  let membersCount = 0;

  try {
    const totalHoursAgg = await prisma.member.aggregate({
      _sum: { volunteerHours: true },
    });
    if (totalHoursAgg._sum.volunteerHours) {
      hoursCount = totalHoursAgg._sum.volunteerHours;
    }
    const countArticles = await prisma.article.count({
      where: { status: "PUBLISHED" },
    });
    articlesCount = countArticles;

    const countMembers = await prisma.member.count({
      where: { status: "ACTIVE" },
    });
    membersCount = countMembers;
  } catch (e) {}

  const dynamicStats = [
    { label: "ساعة تطوعية موثقة", value: `+${hoursCount}` },
    { label: "مقالة ورقة بحثية", value: `+${articlesCount}` },
    { label: "عضواً فاعلاً في الكادر", value: `+${membersCount}` },
    { label: "أقسام وتخصصات رئيسية", value: "4" },
  ];

  let featuredArticles: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    publishedAt: string;
    readTime: string;
    author: { name: string };
  }> = [];

  try {
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED", type: "BLOG" },
      take: 3,
      orderBy: { createdAt: "desc" },
    });

    featuredArticles = articles.map((art) => ({
      id: art.id,
      title: art.title,
      slug: art.slug,
      excerpt: art.excerpt || "",
      category: "بحوث وتقنيات",
      publishedAt: art.createdAt.toISOString().split("T")[0],
      readTime: "5 دقائق",
      author: {
        name: "محرر بروميثيوس",
      },
    }));
  } catch (e) {}

  return {
    settings,
    dynamicStats,
    featuredArticles,
    partners,
  };
}
