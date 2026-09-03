"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { ProjectStatus, ProjectType, SessionFormStatus, RoleType } from "@prisma/client";

// ── Types & Interfaces ────────────────────────────────────────────────────────
export interface ProjectRecord {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  status: ProjectStatus;
  type: ProjectType;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  totalSessions: number;
  guestAuthors: string[];
  membersCount: number;
  articlesCount: number;
  sessionsCount: number;
  participantsCount: number;
  createdAt: string;
}

export interface ProjectSessionRecord {
  id: string;
  sessionNumber: number;
  title: string;
  description: string | null;
  formStatus: SessionFormStatus;
  expiresAt: string | null;
  isExpired: boolean;
  attendanceCount: number;
  createdAt: string;
}

export interface ProjectParticipantRecord {
  id: string;
  nameAr: string;
  nameEn: string;
  email: string;
  uniqueCode: string;
  attendedSessionsCount: number;
  totalSessions: number;
  attendanceRatio: string;
  attendancePercentage: number;
  records: {
    sessionId: string;
    sessionNumber: number;
    sessionTitle: string;
    feedback: string | null;
    attendedAt: string;
  }[];
}

export interface ProjectDetail extends ProjectRecord {
  members: { memberId: string; memberName: string; avatarUrl?: string; roleName: string }[];
  articles: { id: string; title: string; slug: string; type: string }[];
  partners: { id: string; name: string; slug: string; logoUrl: string; roleName?: string }[];
  sessions: ProjectSessionRecord[];
  participants: ProjectParticipantRecord[];
}

// ── Auth helper ───────────────────────────────────────────────────────────────
async function requireAuth(roles: RoleType[]) {
  const session = await getSession();
  if (!session) throw new Error("Authentication required.");
  const has = session.roles.includes("ADMIN" as RoleType) || roles.some((r) => session.roles.includes(r));
  if (!has) throw new Error("Unauthorized.");
  return session;
}

// ── Slug & Unique Code generators ─────────────────────────────────────────────
function generateSlug(title: string): string {
  return title
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\u0621-\u064A\u0660-\u0669\-]+/g, "")
    .replace(/(^-|-$)+/g, "")
    + "-" + Date.now().toString().slice(-4);
}

function generateUniqueCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomPart = "";
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PMT-${randomPart}`;
}

// ── Get all projects for Public / Catalog ─────────────────────────────────────
export async function getProjectsAction(type?: ProjectType): Promise<ProjectRecord[]> {
  try {
    const projects = await prisma.project.findMany({
      where: type ? { type } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        sessions: {
          include: {
            attendanceRecords: { select: { participantId: true } },
          },
        },
        _count: { select: { members: true, articles: true } },
      },
    });

    return projects.map((p) => {
      const uniqueParticipantIds = new Set<string>();
      p.sessions.forEach((s) => {
        s.attendanceRecords.forEach((r) => uniqueParticipantIds.add(r.participantId));
      });

      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description || null,
        coverImage: p.coverImage || null,
        status: p.status,
        type: p.type,
        location: p.location || null,
        startDate: p.startDate?.toISOString() || null,
        endDate: p.endDate?.toISOString() || null,
        totalSessions: p.totalSessions,
        guestAuthors: p.guestAuthors || [],
        membersCount: p._count.members,
        articlesCount: p._count.articles,
        sessionsCount: p.sessions.length,
        participantsCount: uniqueParticipantIds.size,
        createdAt: p.createdAt.toISOString(),
      };
    });
  } catch {
    return [];
  }
}

// ── Get project by slug (public) ──────────────────────────────────────────────
export async function getProjectBySlugAction(slug: string): Promise<ProjectDetail | null> {
  try {
    const decodedSlug = decodeURIComponent(slug);
    const p = await prisma.project.findUnique({
      where: { slug: decodedSlug },
      include: {
        members: { include: { member: true } },
        articles: { include: { article: true } },
        partners: { include: { partner: true } },
        sessions: {
          include: {
            attendanceRecords: {
              include: { participant: true },
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: { sessionNumber: "asc" },
        },
        _count: { select: { members: true, articles: true } },
      },
    });
    if (!p) return null;

    const now = new Date();
    const formattedSessions: ProjectSessionRecord[] = p.sessions.map((s) => {
      const isExpired = !!(s.expiresAt && now > new Date(s.expiresAt));
      const effectiveStatus: SessionFormStatus = s.formStatus === "OPEN" && !isExpired ? "OPEN" : "CLOSED";
      return {
        id: s.id,
        sessionNumber: s.sessionNumber,
        title: s.title,
        description: s.description || null,
        formStatus: effectiveStatus,
        expiresAt: s.expiresAt?.toISOString() || null,
        isExpired,
        attendanceCount: s.attendanceRecords.length,
        createdAt: s.createdAt.toISOString(),
      };
    });

    const participantMap = new Map<string, {
      id: string;
      nameAr: string;
      nameEn: string;
      email: string;
      uniqueCode: string;
      records: { sessionId: string; sessionNumber: number; sessionTitle: string; feedback: string | null; attendedAt: string }[];
    }>();

    p.sessions.forEach((s) => {
      s.attendanceRecords.forEach((r) => {
        const part = r.participant;
        if (!participantMap.has(part.id)) {
          participantMap.set(part.id, {
            id: part.id,
            nameAr: part.nameAr,
            nameEn: part.nameEn,
            email: part.email,
            uniqueCode: part.uniqueCode,
            records: [],
          });
        }
        participantMap.get(part.id)!.records.push({
          sessionId: s.id,
          sessionNumber: s.sessionNumber,
          sessionTitle: s.title,
          feedback: r.feedback,
          attendedAt: r.createdAt.toISOString(),
        });
      });
    });

    const totalSess = p.totalSessions || Math.max(p.sessions.length, 1);
    const formattedParticipants: ProjectParticipantRecord[] = Array.from(participantMap.values()).map((pt) => {
      const count = pt.records.length;
      return {
        id: pt.id,
        nameAr: pt.nameAr,
        nameEn: pt.nameEn,
        email: pt.email,
        uniqueCode: pt.uniqueCode,
        attendedSessionsCount: count,
        totalSessions: totalSess,
        attendanceRatio: `${count}/${totalSess}`,
        attendancePercentage: Math.min(Math.round((count / totalSess) * 100), 100),
        records: pt.records,
      };
    });

    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description || null,
      coverImage: p.coverImage || null,
      status: p.status,
      type: p.type,
      location: p.location || null,
      startDate: p.startDate?.toISOString() || null,
      endDate: p.endDate?.toISOString() || null,
      totalSessions: p.totalSessions,
      guestAuthors: p.guestAuthors || [],
      membersCount: p._count.members,
      articlesCount: p._count.articles,
      sessionsCount: p.sessions.length,
      participantsCount: formattedParticipants.length,
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
        roleName: pp.roleName || "شريك استراتيجي",
      })),
      sessions: formattedSessions,
      participants: formattedParticipants,
    };
  } catch {
    return null;
  }
}

// ── Admin: Get project by ID ──────────────────────────────────────────────────
export async function getAdminProjectById(id: string): Promise<ProjectDetail | null> {
  try {
    const p = await prisma.project.findUnique({
      where: { id },
      include: {
        members: { include: { member: true } },
        articles: { include: { article: true } },
        partners: { include: { partner: true } },
        sessions: {
          include: {
            attendanceRecords: {
              include: { participant: true },
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: { sessionNumber: "asc" },
        },
        _count: { select: { members: true, articles: true } },
      },
    });
    if (!p) return null;

    const now = new Date();
    const formattedSessions: ProjectSessionRecord[] = p.sessions.map((s) => {
      const isExpired = !!(s.expiresAt && now > new Date(s.expiresAt));
      const effectiveStatus: SessionFormStatus = s.formStatus === "OPEN" && !isExpired ? "OPEN" : "CLOSED";
      return {
        id: s.id,
        sessionNumber: s.sessionNumber,
        title: s.title,
        description: s.description || null,
        formStatus: effectiveStatus,
        expiresAt: s.expiresAt?.toISOString() || null,
        isExpired,
        attendanceCount: s.attendanceRecords.length,
        createdAt: s.createdAt.toISOString(),
      };
    });

    const participantMap = new Map<string, {
      id: string;
      nameAr: string;
      nameEn: string;
      email: string;
      uniqueCode: string;
      records: { sessionId: string; sessionNumber: number; sessionTitle: string; feedback: string | null; attendedAt: string }[];
    }>();

    p.sessions.forEach((s) => {
      s.attendanceRecords.forEach((r) => {
        const part = r.participant;
        if (!participantMap.has(part.id)) {
          participantMap.set(part.id, {
            id: part.id,
            nameAr: part.nameAr,
            nameEn: part.nameEn,
            email: part.email,
            uniqueCode: part.uniqueCode,
            records: [],
          });
        }
        participantMap.get(part.id)!.records.push({
          sessionId: s.id,
          sessionNumber: s.sessionNumber,
          sessionTitle: s.title,
          feedback: r.feedback,
          attendedAt: r.createdAt.toISOString(),
        });
      });
    });

    const totalSess = p.totalSessions || Math.max(p.sessions.length, 1);
    const formattedParticipants: ProjectParticipantRecord[] = Array.from(participantMap.values()).map((pt) => {
      const count = pt.records.length;
      return {
        id: pt.id,
        nameAr: pt.nameAr,
        nameEn: pt.nameEn,
        email: pt.email,
        uniqueCode: pt.uniqueCode,
        attendedSessionsCount: count,
        totalSessions: totalSess,
        attendanceRatio: `${count}/${totalSess}`,
        attendancePercentage: Math.min(Math.round((count / totalSess) * 100), 100),
        records: pt.records,
      };
    });

    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description || null,
      coverImage: p.coverImage || null,
      status: p.status,
      type: p.type,
      location: p.location || null,
      startDate: p.startDate?.toISOString() || null,
      endDate: p.endDate?.toISOString() || null,
      totalSessions: p.totalSessions,
      guestAuthors: p.guestAuthors || [],
      membersCount: p._count.members,
      articlesCount: p._count.articles,
      sessionsCount: p.sessions.length,
      participantsCount: formattedParticipants.length,
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
        roleName: pp.roleName || "شريك استراتيجي",
      })),
      sessions: formattedSessions,
      participants: formattedParticipants,
    };
  } catch {
    return null;
  }
}

// ── Participant Verification Action ───────────────────────────────────────────
export async function getParticipantVerification(code: string) {
  try {
    const participant = await prisma.participant.findFirst({
      where: {
        OR: [
          { uniqueCode: code },
          { id: code },
        ],
      },
      include: {
        attendanceRecords: {
          include: {
            session: {
              include: { project: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!participant) return null;

    const projectMap = new Map<string, {
      project: any;
      sessions: { sessionId: string; sessionNumber: number; sessionTitle: string; attendedAt: string }[];
    }>();

    participant.attendanceRecords.forEach((r) => {
      const proj = r.session.project;
      if (!projectMap.has(proj.id)) {
        projectMap.set(proj.id, {
          project: proj,
          sessions: [],
        });
      }
      projectMap.get(proj.id)!.sessions.push({
        sessionId: r.session.id,
        sessionNumber: r.session.sessionNumber,
        sessionTitle: r.session.title,
        attendedAt: r.createdAt.toISOString(),
      });
    });

    const activities = Array.from(projectMap.values()).map(({ project, sessions }) => {
      const totalSess = project.totalSessions || 1;
      const count = sessions.length;
      const pct = Math.min(Math.round((count / totalSess) * 100), 100);

      return {
        activityId: project.id,
        activityTitle: project.title,
        activitySlug: project.slug,
        activityType: project.type,
        totalSessions: totalSess,
        attendedSessionsCount: count,
        attendanceRatio: `${count}/${totalSess}`,
        attendancePercentage: pct,
        isPassed: pct >= 75,
        sessions,
      };
    });

    return {
      participant: {
        id: participant.id,
        nameAr: participant.nameAr,
        nameEn: participant.nameEn,
        email: participant.email,
        uniqueCode: participant.uniqueCode,
        createdAt: participant.createdAt.toISOString(),
      },
      activities,
    };
  } catch {
    return null;
  }
}

// ── Create project ────────────────────────────────────────────────────────────
export async function createProjectAction(prevState: any, formData: FormData) {
  await requireAuth(["ADMIN", "HR_EDITOR"]);

  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const coverImage = formData.get("coverImage")?.toString().trim() || null;
  const location = formData.get("location")?.toString().trim() || null;
  const rawStatus = formData.get("status")?.toString();
  const rawType = formData.get("type")?.toString();
  const totalSessionsStr = formData.get("totalSessions")?.toString() || "1";
  const startDateStr = formData.get("startDate")?.toString();
  const endDateStr = formData.get("endDate")?.toString();

  const status = (["PLANNED", "IN_PROGRESS", "COMPLETED"].includes(rawStatus || "")
    ? rawStatus
    : "PLANNED") as ProjectStatus;

  const type = (["PROJECT", "COURSE", "WORKSHOP", "LECTURE", "BOOTCAMP", "SEMINAR"].includes(rawType || "")
    ? rawType
    : "PROJECT") as ProjectType;

  const totalSessions = Math.max(parseInt(totalSessionsStr, 10) || 1, 1);
  const startDate = startDateStr ? new Date(startDateStr) : null;
  const endDate = endDateStr ? new Date(endDateStr) : null;

  const rawArticleIds = formData.get("articleIds")?.toString() || "[]";
  const rawPartnerRoles = formData.get("partnerRoles")?.toString() || formData.get("partnerIds")?.toString() || "[]";
  const rawMembers = formData.get("members")?.toString() || "[]";
  const rawGuestAuthors = formData.get("guestAuthors")?.toString() || "[]";

  let articleIds: string[] = [];
  let partnerRoles: { partnerId: string; roleName?: string }[] = [];
  let memberRoles: { memberId: string; roleName: string }[] = [];
  let guestAuthors: string[] = [];

  try { articleIds = JSON.parse(rawArticleIds); } catch { articleIds = []; }
  try {
    const parsed = JSON.parse(rawPartnerRoles);
    partnerRoles = parsed.map((item: any) => typeof item === "string" ? { partnerId: item, roleName: "شريك استراتيجي" } : item);
  } catch { partnerRoles = []; }
  try { memberRoles = JSON.parse(rawMembers); } catch { memberRoles = []; }
  try { guestAuthors = JSON.parse(rawGuestAuthors).filter((g: string) => g.trim() !== ""); } catch { guestAuthors = []; }

  if (!title) return { error: "عنوان المشروع أو الفعالية مطلوب." };

  const slug = generateSlug(title);

  const sessionsCreateData = Array.from({ length: totalSessions }).map((_, i) => ({
    sessionNumber: i + 1,
    title: totalSessions === 1 ? "الجلسة الرئيسية" : `المحاضرة / الجلسة ${i + 1}`,
    description: `جلسة رقم ${i + 1}`,
    formStatus: SessionFormStatus.CLOSED,
  }));

  try {
    await prisma.project.create({
      data: {
        title,
        slug,
        description,
        coverImage,
        status,
        type,
        location,
        startDate,
        endDate,
        totalSessions,
        guestAuthors,
        articles: articleIds.length > 0
          ? { create: articleIds.map((aid) => ({ articleId: aid })) }
          : undefined,
        partners: partnerRoles.length > 0
          ? { create: partnerRoles.map((p) => ({ partnerId: p.partnerId, roleName: p.roleName || "شريك استراتيجي" })) }
          : undefined,
        members: memberRoles.length > 0
          ? { create: memberRoles.map((m) => ({ memberId: m.memberId, roleName: m.roleName })) }
          : undefined,
        sessions: {
          create: sessionsCreateData,
        },
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
  await requireAuth(["ADMIN", "HR_EDITOR"]);

  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const coverImage = formData.get("coverImage")?.toString().trim() || null;
  const location = formData.get("location")?.toString().trim() || null;
  const rawStatus = formData.get("status")?.toString();
  const rawType = formData.get("type")?.toString();
  const totalSessionsStr = formData.get("totalSessions")?.toString() || "1";
  const startDateStr = formData.get("startDate")?.toString();
  const endDateStr = formData.get("endDate")?.toString();

  const status = (["PLANNED", "IN_PROGRESS", "COMPLETED"].includes(rawStatus || "")
    ? rawStatus
    : "PLANNED") as ProjectStatus;

  const type = (["PROJECT", "COURSE", "WORKSHOP", "LECTURE", "BOOTCAMP", "SEMINAR"].includes(rawType || "")
    ? rawType
    : "PROJECT") as ProjectType;

  const totalSessions = Math.max(parseInt(totalSessionsStr, 10) || 1, 1);
  const startDate = startDateStr ? new Date(startDateStr) : null;
  const endDate = endDateStr ? new Date(endDateStr) : null;

  const rawArticleIds = formData.get("articleIds")?.toString() || "[]";
  const rawPartnerRoles = formData.get("partnerRoles")?.toString() || formData.get("partnerIds")?.toString() || "[]";
  const rawMembers = formData.get("members")?.toString() || "[]";
  const rawGuestAuthors = formData.get("guestAuthors")?.toString() || "[]";

  let articleIds: string[] = [];
  let partnerRoles: { partnerId: string; roleName?: string }[] = [];
  let memberRoles: { memberId: string; roleName: string }[] = [];
  let guestAuthors: string[] = [];

  try { articleIds = JSON.parse(rawArticleIds); } catch { articleIds = []; }
  try {
    const parsed = JSON.parse(rawPartnerRoles);
    partnerRoles = parsed.map((item: any) => typeof item === "string" ? { partnerId: item, roleName: "شريك استراتيجي" } : item);
  } catch { partnerRoles = []; }
  try { memberRoles = JSON.parse(rawMembers); } catch { memberRoles = []; }
  try { guestAuthors = JSON.parse(rawGuestAuthors).filter((g: string) => g.trim() !== ""); } catch { guestAuthors = []; }

  if (!id || !title) return { error: "معرف المشروع والعنوان مطلوبان." };

  const slug = generateSlug(title);

  try {
    const existing = await prisma.project.findUnique({
      where: { id },
      include: { sessions: true },
    });

    if (existing && totalSessions > existing.sessions.length) {
      const existingCount = existing.sessions.length;
      const extraSessions = Array.from({ length: totalSessions - existingCount }).map((_, i) => ({
        projectId: id,
        sessionNumber: existingCount + i + 1,
        title: `المحاضرة / الجلسة ${existingCount + i + 1}`,
        description: `جلسة رقم ${existingCount + i + 1}`,
        formStatus: SessionFormStatus.CLOSED,
      }));
      await prisma.projectSession.createMany({ data: extraSessions });
    }

    await prisma.$transaction([
      prisma.project.update({
        where: { id },
        data: { title, slug, description, coverImage, status, type, location, startDate, endDate, totalSessions, guestAuthors },
      }),
      prisma.projectArticle.deleteMany({ where: { projectId: id } }),
      ...(articleIds.length > 0
        ? [prisma.projectArticle.createMany({
            data: articleIds.map((aid) => ({ projectId: id, articleId: aid })),
            skipDuplicates: true,
          })]
        : []),
      prisma.partnerProject.deleteMany({ where: { projectId: id } }),
      ...(partnerRoles.length > 0
        ? [prisma.partnerProject.createMany({
            data: partnerRoles.map((p) => ({ projectId: id, partnerId: p.partnerId, roleName: p.roleName || "شريك استراتيجي" })),
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

// ── Session Form Toggle & Attendance Actions ──────────────────────────────────
export async function toggleProjectSessionFormAction(
  sessionId: string,
  targetStatus: "OPEN" | "CLOSED",
  expirationMinutes?: number
) {
  await requireAuth(["ADMIN", "HR_EDITOR"]);

  try {
    let expiresAt: Date | null = null;
    if (targetStatus === "OPEN" && expirationMinutes && expirationMinutes > 0) {
      expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);
    }

    const session = await prisma.projectSession.update({
      where: { id: sessionId },
      data: {
        formStatus: targetStatus === "OPEN" ? SessionFormStatus.OPEN : SessionFormStatus.CLOSED,
        expiresAt: targetStatus === "OPEN" ? expiresAt : null,
      },
      include: { project: true },
    });

    revalidatePath(`/admin/projects/${session.projectId}/edit`);
    revalidatePath(`/attendance/${sessionId}`);

    return {
      success: true,
      status: targetStatus,
      expiresAt: expiresAt?.toISOString() || null,
    };
  } catch (err: any) {
    return { error: err.message || "حدث خطأ أثناء تغيير حالة استمارة الحضور." };
  }
}

export async function getPublicSessionForAttendance(sessionId: string) {
  try {
    const session = await prisma.projectSession.findUnique({
      where: { id: sessionId },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
            type: true,
            coverImage: true,
            totalSessions: true,
          },
        },
      },
    });

    if (!session) return { found: false, isOpen: false, session: null };

    const now = new Date();
    const isExpired = session.expiresAt ? now > new Date(session.expiresAt) : false;
    const isOpen = session.formStatus === SessionFormStatus.OPEN && !isExpired;

    return {
      found: true,
      isOpen,
      isExpired,
      session: {
        id: session.id,
        sessionNumber: session.sessionNumber,
        title: session.title,
        description: session.description,
        formStatus: session.formStatus,
        expiresAt: session.expiresAt?.toISOString() || null,
        project: session.project,
      },
    };
  } catch {
    return { found: false, isOpen: false, session: null };
  }
}

// Security Workflow: Public registration submission DOES NOT return QR code to submitter
export async function submitAttendanceAction(prevState: any, formData: FormData) {
  const sessionId = formData.get("sessionId")?.toString();
  const nameAr = formData.get("nameAr")?.toString().trim();
  const nameEn = formData.get("nameEn")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const feedback = formData.get("feedback")?.toString().trim() || "";

  if (!sessionId || !nameAr || !nameEn || !email) {
    return { error: "يرجى ملء جميع الحقول الإلزامية." };
  }

  try {
    const session = await prisma.projectSession.findUnique({
      where: { id: sessionId },
      include: { project: true },
    });

    if (!session) return { error: "رمز الجلسة أو المحاضرة غير صحيح." };

    const now = new Date();
    if (session.formStatus !== SessionFormStatus.OPEN || (session.expiresAt && now > new Date(session.expiresAt))) {
      return { error: "استمارة الحضور مغلقة حالياً أو انتهت مدتها." };
    }

    let participant = await prisma.participant.findUnique({ where: { email } });

    if (!participant) {
      let uniqueCode = generateUniqueCode();
      let attempts = 0;
      while (attempts < 5) {
        const exist = await prisma.participant.findUnique({ where: { uniqueCode } });
        if (!exist) break;
        uniqueCode = generateUniqueCode();
        attempts++;
      }
      participant = await prisma.participant.create({
        data: { nameAr, nameEn, email, uniqueCode },
      });
    } else {
      participant = await prisma.participant.update({
        where: { id: participant.id },
        data: { nameAr, nameEn },
      });
    }

    const existingAttendance = await prisma.attendanceRecord.findUnique({
      where: {
        participantId_sessionId: {
          participantId: participant.id,
          sessionId: session.id,
        },
      },
    });

    if (existingAttendance) {
      return {
        alreadySubmitted: true,
        message: "تم تسجيل حضورك في هذه الجلسة مسبقاً. شكراً لك!",
        nameAr: participant.nameAr,
        sessionTitle: session.title,
        projectTitle: session.project.title,
      };
    }

    await prisma.attendanceRecord.create({
      data: {
        participantId: participant.id,
        sessionId: session.id,
        feedback: feedback || null,
      },
    });

    revalidatePath(`/admin/projects/${session.projectId}/edit`);

    return {
      success: true,
      message: "شكراً لك! تم تسجيل حضورك بنجاح.",
      nameAr: participant.nameAr,
      sessionTitle: session.title,
      projectTitle: session.project.title,
    };
  } catch (err: any) {
    return { error: err.message || "حدث خطأ أثناء تسجيل الحضور." };
  }
}

// ── Delete project ────────────────────────────────────────────────────────────
export async function deleteProjectAction(id: string) {
  try {
    await requireAuth(["ADMIN", "HR_EDITOR"]);
    await prisma.project.delete({ where: { id } });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "فشل حذف المشروع." };
  }
}
