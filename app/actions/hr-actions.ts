"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { RoleType } from "@prisma/client";

export interface LocalCertificateRecord {
  id: string;
  certificateCode: string;
  title: string;
  description: string;
  issuedAt: string;
  memberName: string;
  memberDepartment: string;
  memberRole: string;
  volunteerHours: number;
}

export interface LocalMemberRecord {
  id: string;
  fullName: string;
  email: string;
  title: string;
  departmentName: string;
  volunteerHours: number;
  status: string;
  certificateCode?: string;
  createdAt: string;
}

let MOCK_HR_MEMBERS: LocalMemberRecord[] = [
  {
    id: "mem-1",
    fullName: "Karrar Al-Mansoor",
    email: "admin@prometheus.local",
    title: "Technical Lead & Software Architect",
    departmentName: "Technology",
    volunteerHours: 140,
    status: "ACTIVE",
    certificateCode: "PRM-2026-DEV-001",
    createdAt: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "mem-2",
    fullName: "Sarah Al-Hassani",
    email: "author@prometheus.local",
    title: "Research Director & Computational Biologist",
    departmentName: "Research",
    volunteerHours: 125,
    status: "ACTIVE",
    certificateCode: "PRM-2026-RES-002",
    createdAt: "2026-02-10T00:00:00.000Z",
  },
  {
    id: "mem-3",
    fullName: "Mustafa Tariq",
    email: "editor@prometheus.local",
    title: "Post Editor-in-Chief",
    departmentName: "Education",
    volunteerHours: 95,
    status: "ACTIVE",
    certificateCode: "PRM-2026-ED-003",
    createdAt: "2026-03-01T00:00:00.000Z",
  },
  {
    id: "mem-4",
    fullName: "Omar Al-Farooq",
    email: "hr@prometheus.local",
    title: "HR & Recruitment Coordinator",
    departmentName: "HR & Operations",
    volunteerHours: 85,
    status: "ACTIVE",
    certificateCode: "PRM-2026-HR-005",
    createdAt: "2026-04-12T00:00:00.000Z",
  },
];

let MOCK_HR_CERTIFICATES: LocalCertificateRecord[] = [
  {
    id: "cert-1",
    certificateCode: "PRM-2026-DEV-001",
    title: "Verified Certificate of Voluntary Contribution & Technical Leadership",
    description: "Awarded for completing 140 hours of software engineering and platform architecture development.",
    issuedAt: "2026-08-15T00:00:00.000Z",
    memberName: "Karrar Al-Mansoor",
    memberDepartment: "Technology",
    memberRole: "Technical Lead & Software Architect",
    volunteerHours: 140,
  },
  {
    id: "cert-2",
    certificateCode: "PRM-2026-RES-002",
    title: "Verified Certificate of Voluntary Research & Scientific Synthesis",
    description: "Awarded for 125 hours of computational biology research and literature synthesis.",
    issuedAt: "2026-08-10T00:00:00.000Z",
    memberName: "Sarah Al-Hassani",
    memberDepartment: "Research",
    memberRole: "Research Director",
    volunteerHours: 125,
  },
];

// Helper: Enforce HR_EDITOR or ADMIN permission
async function requireHRPermission() {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required. Please log in.");
  }
  const hasHR = session.roles.includes("ADMIN") || session.roles.includes("HR_EDITOR");
  if (!hasHR) {
    throw new Error("Unauthorized: HR_EDITOR or ADMIN role is required for member management.");
  }
  return session;
}

// 1. Create New Member
export async function createMemberAction(prevState: any, formData: FormData) {
  await requireHRPermission();

  const fullName = formData.get("fullName")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const title = formData.get("title")?.toString().trim() || "Voluntary Contributor";
  const departmentName = formData.get("departmentName")?.toString() || "Technology";
  const initialHours = parseFloat(formData.get("initialHours")?.toString() || "0");

  if (!fullName || !email) {
    return { error: "Full Name and Email address are required." };
  }

  try {
    // DB insertion attempt
    try {
      await prisma.member.create({
        data: {
          fullName,
          title,
          status: "ACTIVE",
          volunteerHours: Math.max(0, Math.floor(initialHours)),
          user: {
            connectOrCreate: {
              where: { email },
              create: { email },
            },
          },
        },
      });
    } catch (dbErr) {
      // Local mock fallback
      const newMember: LocalMemberRecord = {
        id: `mem-${Date.now()}`,
        fullName,
        email,
        title,
        departmentName,
        volunteerHours: initialHours,
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      };
      MOCK_HR_MEMBERS.unshift(newMember);
    }
  } catch (err: any) {
    return { error: err.message || "Failed to create member." };
  }

  revalidatePath("/admin/members");
  return { success: true };
}

// 2. Update Volunteer Logged Hours
export async function updateVolunteerHoursAction(memberId: string, addedHours: number) {
  await requireHRPermission();

  const mem = MOCK_HR_MEMBERS.find((m) => m.id === memberId);
  if (mem) {
    mem.volunteerHours += addedHours;
  }

  try {
    await prisma.member.update({
      where: { id: memberId },
      data: {
        volunteerHours: {
          increment: addedHours,
        },
      },
    });
  } catch (e) {}

  revalidatePath("/admin/members");
  revalidatePath("/members");
  return { success: true };
}

// 3. Issue Official Volunteer Certificate
export async function issueCertificateAction(prevState: any, formData: FormData) {
  await requireHRPermission();

  const memberId = formData.get("memberId")?.toString();
  const title = formData.get("title")?.toString().trim() || "Verified Certificate of Voluntary Contribution";
  const description = formData.get("description")?.toString().trim() || "";

  if (!memberId) {
    return { error: "Please select a team member." };
  }

  const mem = MOCK_HR_MEMBERS.find((m) => m.id === memberId);
  if (!mem) {
    return { error: "Member not found." };
  }

  const deptCode = mem.departmentName.substring(0, 3).toUpperCase();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
  const certificateCode = `PRM-2026-${deptCode}-${randomSuffix}`;

  const newCert: LocalCertificateRecord = {
    id: `cert-${Date.now()}`,
    certificateCode,
    title,
    description,
    issuedAt: new Date().toISOString(),
    memberName: mem.fullName,
    memberDepartment: mem.departmentName,
    memberRole: mem.title,
    volunteerHours: mem.volunteerHours,
  };

  MOCK_HR_CERTIFICATES.unshift(newCert);
  mem.certificateCode = certificateCode;

  try {
    await prisma.certificate.create({
      data: {
        certificateCode,
        title,
        description,
        memberId: mem.id,
      },
    });
  } catch (e) {}

  revalidatePath("/admin/certificates");
  revalidatePath("/admin/members");
  return { success: true, certificateCode };
}

// Helper to fetch list of members
export async function getAdminMembersList(): Promise<LocalMemberRecord[]> {
  try {
    const dbMembers = await prisma.member.findMany({
      include: {
        department: true,
        user: true,
        certificates: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbMembers.length > 0) {
      return dbMembers.map((m) => ({
        id: m.id,
        fullName: m.fullName,
        email: m.user?.email || "n/a",
        title: m.title || "Member",
        departmentName: m.department?.name || "General",
        volunteerHours: m.volunteerHours,
        status: m.status,
        certificateCode: m.certificates[0]?.certificateCode,
        createdAt: m.createdAt.toISOString(),
      }));
    }
  } catch (e) {}

  return MOCK_HR_MEMBERS;
}

// Helper to fetch list of issued certificates
export async function getAdminCertificatesList(): Promise<LocalCertificateRecord[]> {
  try {
    const dbCerts = await prisma.certificate.findMany({
      include: {
        member: {
          include: {
            department: true,
          },
        },
      },
      orderBy: { issuedAt: "desc" },
    });

    if (dbCerts.length > 0) {
      return dbCerts.map((c) => ({
        id: c.id,
        certificateCode: c.certificateCode,
        title: c.title,
        description: c.description || "",
        issuedAt: c.issuedAt.toISOString(),
        memberName: c.member.fullName,
        memberDepartment: c.member.department?.name || "General",
        memberRole: c.member.title || "Member",
        volunteerHours: c.member.volunteerHours,
      }));
    }
  } catch (e) {}

  return MOCK_HR_CERTIFICATES;
}

// Public Certificate Verification Helper (No auth required)
export async function verifyCertificateCode(code: string): Promise<LocalCertificateRecord | null> {
  const normalizedCode = code.trim().toUpperCase();

  try {
    const dbCert = await prisma.certificate.findUnique({
      where: { certificateCode: normalizedCode },
      include: {
        member: {
          include: {
            department: true,
          },
        },
      },
    });

    if (dbCert) {
      return {
        id: dbCert.id,
        certificateCode: dbCert.certificateCode,
        title: dbCert.title,
        description: dbCert.description || "",
        issuedAt: dbCert.issuedAt.toISOString(),
        memberName: dbCert.member.fullName,
        memberDepartment: dbCert.member.department?.name || "General",
        memberRole: dbCert.member.title || "Member",
        volunteerHours: dbCert.member.volunteerHours,
      };
    }
  } catch (e) {}

  const match = MOCK_HR_CERTIFICATES.find(
    (c) => c.certificateCode.toUpperCase() === normalizedCode
  );
  return match || null;
}
