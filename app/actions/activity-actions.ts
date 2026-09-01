"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import {
  ActivityType,
  ActivityStatus,
  SessionFormStatus,
} from "@prisma/client";

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface ActivityRecord {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  type: ActivityType;
  totalSessions: number;
  status: ActivityStatus;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  sessionsCount?: number;
  participantsCount?: number;
  createdAt: string;
}

export interface ActivityDetailRecord extends ActivityRecord {
  sessions: {
    id: string;
    sessionNumber: number;
    title: string;
    description: string | null;
    formStatus: SessionFormStatus;
    expiresAt: string | null;
    isExpired: boolean;
    attendanceCount: number;
    createdAt: string;
  }[];
  participants: {
    id: string;
    nameAr: string;
    nameEn: string;
    email: string;
    uniqueCode: string;
    attendedSessionsCount: number;
    totalSessions: number;
    attendanceRatio: string; // e.g. "3/4"
    attendancePercentage: number; // e.g. 75
    records: {
      sessionId: string;
      sessionNumber: number;
      sessionTitle: string;
      feedback: string | null;
      attendedAt: string;
    }[];
  }[];
}

export interface ParticipantVerificationResult {
  participant: {
    id: string;
    nameAr: string;
    nameEn: string;
    email: string;
    uniqueCode: string;
    createdAt: string;
  };
  activities: {
    activityId: string;
    activityTitle: string;
    activitySlug: string;
    activityType: ActivityType;
    totalSessions: number;
    attendedSessionsCount: number;
    attendanceRatio: string;
    attendancePercentage: number;
    isPassed: boolean;
    sessions: {
      sessionId: string;
      sessionNumber: number;
      sessionTitle: string;
      attendedAt: string;
    }[];
  }[];
  totalAttendedSessions: number;
}

// Helper: Authentication check for ADMIN and HR_EDITOR
async function requireActivityAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required. Please log in.");
  }
  const hasAccess =
    session.roles.includes("ADMIN") || session.roles.includes("HR_EDITOR");
  if (!hasAccess) {
    throw new Error("Unauthorized: Only ADMIN and HR_EDITOR roles can manage activities.");
  }
  return session;
}

// Generate a random unique participant code like "PMT-8K92F4"
function generateUniqueCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomPart = "";
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PMT-${randomPart}`;
}

// Helper to create Arabic/English slugs
function generateSlug(text: string): string {
  return (
    text
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9\u0621-\u064A\u0660-\u0669\-]+/g, "")
      .replace(/(^-|-$)+/g, "") +
    "-" +
    Date.now().toString().slice(-4)
  );
}

// ==========================================
// ADMIN ACTIONS
// ==========================================

// 1. Get All Activities for Admin Dashboard
export async function getAdminActivitiesList(): Promise<ActivityRecord[]> {
  await requireActivityAuth();

  try {
    const activities = await prisma.activity.findMany({
      include: {
        sessions: {
          include: {
            attendanceRecords: {
              select: { participantId: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return activities.map((act) => {
      // Calculate unique participants count across all sessions of this activity
      const uniqueParticipantIds = new Set<string>();
      act.sessions.forEach((s) => {
        s.attendanceRecords.forEach((r) => uniqueParticipantIds.add(r.participantId));
      });

      return {
        id: act.id,
        title: act.title,
        slug: act.slug,
        description: act.description,
        coverImage: act.coverImage,
        type: act.type,
        totalSessions: act.totalSessions,
        status: act.status,
        location: act.location,
        startDate: act.startDate?.toISOString() || null,
        endDate: act.endDate?.toISOString() || null,
        sessionsCount: act.sessions.length,
        participantsCount: uniqueParticipantIds.size,
        createdAt: act.createdAt.toISOString(),
      };
    });
  } catch (err: any) {
    console.error("Error fetching admin activities list:", err);
    return [];
  }
}

// 2. Get Single Activity Details with Sessions and Participants for Admin
export async function getAdminActivityById(
  activityId: string
): Promise<ActivityDetailRecord | null> {
  await requireActivityAuth();

  try {
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        sessions: {
          include: {
            attendanceRecords: {
              include: {
                participant: true,
              },
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: { sessionNumber: "asc" },
        },
      },
    });

    if (!activity) return null;

    const now = new Date();

    // Map sessions
    const formattedSessions = activity.sessions.map((s) => {
      const isExpired = !!(s.expiresAt && now > new Date(s.expiresAt));
      const effectiveStatus: SessionFormStatus =
        s.formStatus === "OPEN" && !isExpired ? "OPEN" : "CLOSED";

      return {
        id: s.id,
        sessionNumber: s.sessionNumber,
        title: s.title,
        description: s.description,
        formStatus: effectiveStatus,
        expiresAt: s.expiresAt?.toISOString() || null,
        isExpired,
        attendanceCount: s.attendanceRecords.length,
        createdAt: s.createdAt.toISOString(),
      };
    });

    // Aggregate participants across all sessions of this activity
    const participantMap = new Map<
      string,
      {
        id: string;
        nameAr: string;
        nameEn: string;
        email: string;
        uniqueCode: string;
        records: {
          sessionId: string;
          sessionNumber: number;
          sessionTitle: string;
          feedback: string | null;
          attendedAt: string;
        }[];
      }
    >();

    activity.sessions.forEach((session) => {
      session.attendanceRecords.forEach((record) => {
        const p = record.participant;
        if (!participantMap.has(p.id)) {
          participantMap.set(p.id, {
            id: p.id,
            nameAr: p.nameAr,
            nameEn: p.nameEn,
            email: p.email,
            uniqueCode: p.uniqueCode,
            records: [],
          });
        }
        participantMap.get(p.id)!.records.push({
          sessionId: session.id,
          sessionNumber: session.sessionNumber,
          sessionTitle: session.title,
          feedback: record.feedback,
          attendedAt: record.createdAt.toISOString(),
        });
      });
    });

    const totalSessions = activity.totalSessions || Math.max(activity.sessions.length, 1);

    const formattedParticipants = Array.from(participantMap.values()).map((p) => {
      const attendedCount = p.records.length;
      const ratio = `${attendedCount}/${totalSessions}`;
      const percentage = Math.min(Math.round((attendedCount / totalSessions) * 100), 100);

      return {
        id: p.id,
        nameAr: p.nameAr,
        nameEn: p.nameEn,
        email: p.email,
        uniqueCode: p.uniqueCode,
        attendedSessionsCount: attendedCount,
        totalSessions,
        attendanceRatio: ratio,
        attendancePercentage: percentage,
        records: p.records,
      };
    });

    // Sort participants by highest attendance then by name
    formattedParticipants.sort(
      (a, b) => b.attendedSessionsCount - a.attendedSessionsCount || a.nameAr.localeCompare(b.nameAr)
    );

    return {
      id: activity.id,
      title: activity.title,
      slug: activity.slug,
      description: activity.description,
      coverImage: activity.coverImage,
      type: activity.type,
      totalSessions: activity.totalSessions,
      status: activity.status,
      location: activity.location,
      startDate: activity.startDate?.toISOString() || null,
      endDate: activity.endDate?.toISOString() || null,
      createdAt: activity.createdAt.toISOString(),
      sessions: formattedSessions,
      participants: formattedParticipants,
    };
  } catch (err: any) {
    console.error("Error fetching activity detail:", err);
    return null;
  }
}

import fs from "fs/promises";
import path from "path";

// 3. Create Activity with Automatic Session Generation
export async function createActivityAction(prevState: any, formData: FormData) {
  await requireActivityAuth();

  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || "";
  let coverImage = formData.get("coverImage")?.toString().trim() || "";
  const coverImageFile = formData.get("coverImageFile") as File | null;
  const location = formData.get("location")?.toString().trim() || "";
  const rawType = formData.get("type")?.toString();
  const rawStatus = formData.get("status")?.toString();
  const totalSessionsStr = formData.get("totalSessions")?.toString() || "1";
  const startDateStr = formData.get("startDate")?.toString();
  const endDateStr = formData.get("endDate")?.toString();

  if (!title) {
    return { error: "عنوان النشاط أو الدورة مطلوب." };
  }

  // Handle direct file upload from device
  if (coverImageFile && typeof coverImageFile === "object" && coverImageFile.size > 0) {
    try {
      const bytes = await coverImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "activities");
      await fs.mkdir(uploadsDir, { recursive: true });

      const ext = path.extname(coverImageFile.name) || ".png";
      const cleanName = coverImageFile.name.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30);
      const filename = `act-${Date.now()}-${cleanName}${ext}`;
      const filePath = path.join(uploadsDir, filename);
      await fs.writeFile(filePath, buffer);
      coverImage = `/uploads/activities/${filename}`;
    } catch (uploadErr) {
      console.error("Error saving uploaded activity image file:", uploadErr);
      try {
        const bytes = await coverImageFile.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");
        coverImage = `data:${coverImageFile.type || "image/png"};base64,${base64}`;
      } catch {}
    }
  }

  const type = (rawType as ActivityType) || ActivityType.COURSE;
  const status = (rawStatus as ActivityStatus) || ActivityStatus.UPCOMING;
  const totalSessions = Math.max(parseInt(totalSessionsStr, 10) || 1, 1);
  const slug = generateSlug(title);

  const startDate = startDateStr ? new Date(startDateStr) : null;
  const endDate = endDateStr ? new Date(endDateStr) : null;

  try {
    // Generate initial sessions data array
    const sessionsCreateData = Array.from({ length: totalSessions }).map((_, i) => ({
      sessionNumber: i + 1,
      title: totalSessions === 1 ? "الجلسة الرئيسية" : `المحاضرة / الجلسة ${i + 1}`,
      description: `جلسة الحضور المباشرة رقم ${i + 1}`,
      formStatus: SessionFormStatus.CLOSED,
    }));

    const newActivity = await prisma.activity.create({
      data: {
        title,
        slug,
        description: description || null,
        coverImage: coverImage || null,
        type,
        totalSessions,
        status,
        location: location || null,
        startDate,
        endDate,
        sessions: {
          create: sessionsCreateData,
        },
      },
    });

    revalidatePath("/admin/activities");
    revalidatePath("/activities");

    return { success: true, activityId: newActivity.id };
  } catch (err: any) {
    console.error("Error creating activity:", err);
    return { error: err.message || "حدث خطأ أثناء إنشاء النشاط أو الدورة." };
  }
}

// 4. Update Activity & Synchronize Total Sessions if Increased
export async function updateActivityAction(prevState: any, formData: FormData) {
  await requireActivityAuth();

  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || "";
  let coverImage = formData.get("coverImage")?.toString().trim() || "";
  const coverImageFile = formData.get("coverImageFile") as File | null;
  const location = formData.get("location")?.toString().trim() || "";
  const rawType = formData.get("type")?.toString();
  const rawStatus = formData.get("status")?.toString();
  const totalSessionsStr = formData.get("totalSessions")?.toString() || "1";
  const startDateStr = formData.get("startDate")?.toString();
  const endDateStr = formData.get("endDate")?.toString();

  if (!id || !title) {
    return { error: "معرف النشاط وعنوانه مطلوبان." };
  }

  // Handle direct file upload from device
  if (coverImageFile && typeof coverImageFile === "object" && coverImageFile.size > 0) {
    try {
      const bytes = await coverImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "activities");
      await fs.mkdir(uploadsDir, { recursive: true });

      const ext = path.extname(coverImageFile.name) || ".png";
      const cleanName = coverImageFile.name.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30);
      const filename = `act-${Date.now()}-${cleanName}${ext}`;
      const filePath = path.join(uploadsDir, filename);
      await fs.writeFile(filePath, buffer);
      coverImage = `/uploads/activities/${filename}`;
    } catch (uploadErr) {
      console.error("Error saving uploaded activity image file:", uploadErr);
      try {
        const bytes = await coverImageFile.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");
        coverImage = `data:${coverImageFile.type || "image/png"};base64,${base64}`;
      } catch {}
    }
  }

  const type = (rawType as ActivityType) || ActivityType.COURSE;
  const status = (rawStatus as ActivityStatus) || ActivityStatus.UPCOMING;
  const totalSessions = Math.max(parseInt(totalSessionsStr, 10) || 1, 1);

  const startDate = startDateStr ? new Date(startDateStr) : null;
  const endDate = endDateStr ? new Date(endDateStr) : null;

  try {
    const existing = await prisma.activity.findUnique({
      where: { id },
      include: { sessions: true },
    });

    if (!existing) {
      return { error: "النشاط المطلوب غير موجود." };
    }

    // If new totalSessions is greater than existing sessions count, create the missing sessions
    const existingCount = existing.sessions.length;
    if (totalSessions > existingCount) {
      const extraSessions = Array.from({ length: totalSessions - existingCount }).map(
        (_, i) => ({
          activityId: id,
          sessionNumber: existingCount + i + 1,
          title: `المحاضرة / الجلسة ${existingCount + i + 1}`,
          description: `جلسة الحضور المباشرة رقم ${existingCount + i + 1}`,
          formStatus: SessionFormStatus.CLOSED,
        })
      );

      await prisma.activitySession.createMany({
        data: extraSessions,
      });
    }

    await prisma.activity.update({
      where: { id },
      data: {
        title,
        description: description || null,
        coverImage: coverImage || null,
        type,
        totalSessions,
        status,
        location: location || null,
        startDate,
        endDate,
      },
    });

    revalidatePath("/admin/activities");
    revalidatePath(`/admin/activities/${id}`);
    revalidatePath("/activities");
    revalidatePath(`/activities/${existing.slug}`);

    return { success: true };
  } catch (err: any) {
    console.error("Error updating activity:", err);
    return { error: err.message || "حدث خطأ أثناء تعديل النشاط." };
  }
}

// 5. Delete Activity
export async function deleteActivityAction(activityId: string) {
  await requireActivityAuth();

  try {
    await prisma.activity.delete({
      where: { id: activityId },
    });

    revalidatePath("/admin/activities");
    revalidatePath("/activities");
    return { success: true };
  } catch (err: any) {
    console.error("Error deleting activity:", err);
    return { error: err.message || "فشل حذف النشاط." };
  }
}

// 6. Toggle Session Form Status & Expiration Timer
export async function toggleSessionFormAction(
  sessionId: string,
  targetStatus: "OPEN" | "CLOSED",
  expirationMinutes?: number
) {
  await requireActivityAuth();

  try {
    let expiresAt: Date | null = null;
    if (targetStatus === "OPEN" && expirationMinutes && expirationMinutes > 0) {
      expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);
    }

    const session = await prisma.activitySession.update({
      where: { id: sessionId },
      data: {
        formStatus: targetStatus === "OPEN" ? SessionFormStatus.OPEN : SessionFormStatus.CLOSED,
        expiresAt: targetStatus === "OPEN" ? expiresAt : null,
      },
      include: {
        activity: true,
      },
    });

    revalidatePath(`/admin/activities/${session.activityId}`);
    revalidatePath(`/attendance/${sessionId}`);
    revalidatePath(`/activities/${session.activity.slug}`);

    return {
      success: true,
      status: targetStatus,
      expiresAt: expiresAt?.toISOString() || null,
    };
  } catch (err: any) {
    console.error("Error toggling session form status:", err);
    return { error: err.message || "حدث خطأ أثناء تحديث حالة استمارة الحضور." };
  }
}

// 7. Update Session Title / Description
export async function updateSessionInfoAction(
  sessionId: string,
  title: string,
  description?: string
) {
  await requireActivityAuth();

  try {
    const updated = await prisma.activitySession.update({
      where: { id: sessionId },
      data: {
        title: title.trim(),
        description: description?.trim() || null,
      },
    });

    revalidatePath(`/admin/activities/${updated.activityId}`);
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "فشل تعديل بيانات الجلسة." };
  }
}

// ==========================================
// PUBLIC ATTENDANCE FORM ACTIONS
// ==========================================

// 8. Fetch Session Metadata for Attendance Form Verification
export async function getPublicSessionForAttendance(sessionId: string) {
  try {
    const session = await prisma.activitySession.findUnique({
      where: { id: sessionId },
      include: {
        activity: {
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

    if (!session) {
      return { found: false, isOpen: false, session: null };
    }

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
        activity: session.activity,
      },
    };
  } catch (err: any) {
    console.error("Error fetching session for attendance:", err);
    return { found: false, isOpen: false, session: null };
  }
}

// 9. Submit Attendance Form (Find or Create Participant + Attendance Record + Prevent Duplicate)
export async function submitAttendanceAction(prevState: any, formData: FormData) {
  const sessionId = formData.get("sessionId")?.toString();
  const nameAr = formData.get("nameAr")?.toString().trim();
  const nameEn = formData.get("nameEn")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const feedback = formData.get("feedback")?.toString().trim() || "";

  if (!sessionId || !nameAr || !nameEn || !email) {
    return {
      error: "يرجى ملء جميع الحقول الإلزامية (الاسم بالعربية، الاسم بالإنجليزية، والبريد الإلكتروني).",
    };
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "يرجى إدخال بريد إلكتروني صالح وصحيح." };
  }

  try {
    // Verify Session is OPEN & Not Expired
    const session = await prisma.activitySession.findUnique({
      where: { id: sessionId },
      include: { activity: true },
    });

    if (!session) {
      return { error: "رمز الجلسة أو المحاضرة غير صحيح." };
    }

    const now = new Date();
    if (
      session.formStatus !== SessionFormStatus.OPEN ||
      (session.expiresAt && now > new Date(session.expiresAt))
    ) {
      return {
        error: "استمارة تسجيل الحضور لهذه الجلسة مغلقة حالياً أو انتهت المدة المحددة للتسجيل.",
      };
    }

    // Find or Create Participant
    let participant = await prisma.participant.findUnique({
      where: { email },
    });

    if (!participant) {
      // Generate a unique code that does not collide
      let uniqueCode = generateUniqueCode();
      let isCodeUnique = false;
      let attempts = 0;

      while (!isCodeUnique && attempts < 5) {
        const existingCode = await prisma.participant.findUnique({
          where: { uniqueCode },
        });
        if (!existingCode) {
          isCodeUnique = true;
        } else {
          uniqueCode = generateUniqueCode();
          attempts++;
        }
      }

      participant = await prisma.participant.create({
        data: {
          nameAr,
          nameEn,
          email,
          uniqueCode,
        },
      });
    } else {
      // Update participant names if provided with fresh casing
      if (nameAr || nameEn) {
        participant = await prisma.participant.update({
          where: { id: participant.id },
          data: {
            nameAr: nameAr || participant.nameAr,
            nameEn: nameEn || participant.nameEn,
          },
        });
      }
    }

    // Check for Duplicate Attendance Record
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
        error: "تم تسجيل حضورك في هذه الجلسة مسبقاً! يمكنك التحقق من سجل حضورك عبر رمز الاستجابة السريعة (QR).",
        alreadySubmitted: true,
        uniqueCode: participant.uniqueCode,
        nameAr: participant.nameAr,
        nameEn: participant.nameEn,
        sessionTitle: session.title,
        activityTitle: session.activity.title,
      };
    }

    // Create New Attendance Record
    await prisma.attendanceRecord.create({
      data: {
        participantId: participant.id,
        sessionId: session.id,
        feedback: feedback || null,
      },
    });

    revalidatePath(`/admin/activities/${session.activityId}`);
    revalidatePath(`/activities/${session.activity.slug}`);
    revalidatePath(`/verify/${participant.uniqueCode}`);

    return {
      success: true,
      uniqueCode: participant.uniqueCode,
      nameAr: participant.nameAr,
      nameEn: participant.nameEn,
      sessionTitle: session.title,
      activityTitle: session.activity.title,
      activitySlug: session.activity.slug,
    };
  } catch (err: any) {
    console.error("Error submitting attendance:", err);
    return { error: err.message || "حدث خطأ أثناء تسجيل الحضور. يرجى المحاولة مرة أخرى." };
  }
}

// ==========================================
// PUBLIC SHOWCASE & QR VERIFICATION ACTIONS
// ==========================================

// 10. Get Public Activities Catalog
export async function getPublicActivities(type?: ActivityType) {
  try {
    const activities = await prisma.activity.findMany({
      where: {
        status: { in: [ActivityStatus.UPCOMING, ActivityStatus.ONGOING, ActivityStatus.COMPLETED] },
        ...(type ? { type } : {}),
      },
      include: {
        sessions: {
          select: { id: true, sessionNumber: true, title: true },
          orderBy: { sessionNumber: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return activities.map((act) => ({
      id: act.id,
      title: act.title,
      slug: act.slug,
      description: act.description,
      coverImage: act.coverImage,
      type: act.type,
      totalSessions: act.totalSessions,
      status: act.status,
      location: act.location,
      startDate: act.startDate?.toISOString() || null,
      endDate: act.endDate?.toISOString() || null,
      sessions: act.sessions,
    }));
  } catch (err) {
    console.error("Error fetching public activities:", err);
    return [];
  }
}

// 11. Get Public Activity Details by Slug with Public Attendees List
export async function getPublicActivityBySlug(slug: string) {
  try {
    const decodedSlug = decodeURIComponent(slug);
    const activity = await prisma.activity.findUnique({
      where: { slug: decodedSlug },
      include: {
        sessions: {
          include: {
            attendanceRecords: {
              include: {
                participant: {
                  select: {
                    id: true,
                    nameAr: true,
                    nameEn: true,
                    uniqueCode: true,
                  },
                },
              },
            },
          },
          orderBy: { sessionNumber: "asc" },
        },
      },
    });

    if (!activity) return null;

    // Aggregate public attendee list
    const attendeeMap = new Map<
      string,
      {
        nameAr: string;
        nameEn: string;
        uniqueCode: string;
        attendedSessionsCount: number;
      }
    >();

    activity.sessions.forEach((session) => {
      session.attendanceRecords.forEach((record) => {
        const p = record.participant;
        if (!attendeeMap.has(p.id)) {
          attendeeMap.set(p.id, {
            nameAr: p.nameAr,
            nameEn: p.nameEn,
            uniqueCode: p.uniqueCode,
            attendedSessionsCount: 0,
          });
        }
        attendeeMap.get(p.id)!.attendedSessionsCount += 1;
      });
    });

    const totalSessions = activity.totalSessions || Math.max(activity.sessions.length, 1);

    const attendeesList = Array.from(attendeeMap.values()).map((p) => ({
      nameAr: p.nameAr,
      nameEn: p.nameEn,
      uniqueCode: p.uniqueCode,
      attendedSessionsCount: p.attendedSessionsCount,
      totalSessions,
      attendanceRatio: `${p.attendedSessionsCount}/${totalSessions}`,
      attendancePercentage: Math.min(
        Math.round((p.attendedSessionsCount / totalSessions) * 100),
        100
      ),
    }));

    // Sort by highest attendance ratio
    attendeesList.sort((a, b) => b.attendedSessionsCount - a.attendedSessionsCount);

    return {
      id: activity.id,
      title: activity.title,
      slug: activity.slug,
      description: activity.description,
      coverImage: activity.coverImage,
      type: activity.type,
      totalSessions: activity.totalSessions,
      status: activity.status,
      location: activity.location,
      startDate: activity.startDate?.toISOString() || null,
      endDate: activity.endDate?.toISOString() || null,
      sessions: activity.sessions.map((s) => ({
        id: s.id,
        sessionNumber: s.sessionNumber,
        title: s.title,
        description: s.description,
      })),
      attendees: attendeesList,
    };
  } catch (err) {
    console.error("Error fetching public activity by slug:", err);
    return null;
  }
}

// 12. Participant Verification by Unique Code
export async function getParticipantVerification(
  uniqueCode: string
): Promise<ParticipantVerificationResult | null> {
  try {
    const cleanCode = uniqueCode.trim().toUpperCase();

    const participant = await prisma.participant.findUnique({
      where: { uniqueCode: cleanCode },
      include: {
        attendanceRecords: {
          include: {
            session: {
              include: {
                activity: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!participant) return null;

    // Group attendance records by Activity
    const activityMap = new Map<
      string,
      {
        activity: {
          id: string;
          title: string;
          slug: string;
          type: ActivityType;
          totalSessions: number;
        };
        sessions: {
          sessionId: string;
          sessionNumber: number;
          sessionTitle: string;
          attendedAt: string;
        }[];
      }
    >();

    participant.attendanceRecords.forEach((record) => {
      const act = record.session.activity;
      if (!activityMap.has(act.id)) {
        activityMap.set(act.id, {
          activity: {
            id: act.id,
            title: act.title,
            slug: act.slug,
            type: act.type,
            totalSessions: act.totalSessions,
          },
          sessions: [],
        });
      }

      activityMap.get(act.id)!.sessions.push({
        sessionId: record.session.id,
        sessionNumber: record.session.sessionNumber,
        sessionTitle: record.session.title,
        attendedAt: record.createdAt.toISOString(),
      });
    });

    const activitiesList = Array.from(activityMap.values()).map(({ activity, sessions }) => {
      const attendedCount = sessions.length;
      const totalSessions = activity.totalSessions || 1;
      const ratio = `${attendedCount}/${totalSessions}`;
      const percentage = Math.min(Math.round((attendedCount / totalSessions) * 100), 100);

      return {
        activityId: activity.id,
        activityTitle: activity.title,
        activitySlug: activity.slug,
        activityType: activity.type,
        totalSessions,
        attendedSessionsCount: attendedCount,
        attendanceRatio: ratio,
        attendancePercentage: percentage,
        isPassed: percentage >= 75, // 75% attendance threshold for certificate/completion
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
      activities: activitiesList,
      totalAttendedSessions: participant.attendanceRecords.length,
    };
  } catch (err) {
    console.error("Error verifying participant by code:", err);
    return null;
  }
}
