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
  leadershipTier: string;
  volunteerHours: number;
  status: string;
  certificateCode?: string;
  createdAt: string;
  bio?: string | null;
}

let MOCK_HR_MEMBERS: LocalMemberRecord[] = [];

let MOCK_HR_CERTIFICATES: LocalCertificateRecord[] = [];

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
  const leadershipTier = formData.get("leadershipTier")?.toString().trim() || "Regular";
  const bio = formData.get("bio")?.toString().trim() || formData.get("biography")?.toString().trim() || null;
  const initialHours = parseFloat(formData.get("initialHours")?.toString() || "0");
  let profileImage = formData.get("profileImage")?.toString() || null;

  if (profileImage && profileImage.startsWith("blob:")) {
    profileImage = null;
  }

  const customSectionsJson = formData.get("customSections")?.toString();
  let customSections: any = null;
  if (customSectionsJson) {
    try {
      customSections = JSON.parse(customSectionsJson);
    } catch (e) {}
  }

  if (!fullName) {
    return { error: "Full Name is required." };
  }

  try {
    await prisma.member.create({
      data: {
        fullName,
        title,
        status: "ACTIVE",
        leadershipTier,
        bio: bio || undefined,
        volunteerHours: Math.max(0, Math.floor(initialHours)),
        avatarUrl: profileImage || undefined,
        profileImage: profileImage || undefined,
        departmentName: departmentName || "General",
        customSections: customSections || undefined,
      },
    });
  } catch (err: any) {
    console.error("Member creation DB error:", err);
    return { error: err.message || "Failed to create member." };
  }

  revalidatePath("/admin/members");
  revalidatePath("/members");
  return { success: true };
}

// 1b. Update Member
export async function updateMemberAction(prevState: any, formData: FormData) {
  await requireHRPermission();

  const id = formData.get("id")?.toString();
  const fullName = formData.get("fullName")?.toString().trim();
  const title = formData.get("title")?.toString().trim();
  const departmentName = formData.get("departmentName")?.toString();
  const leadershipTier = formData.get("leadershipTier")?.toString().trim();
  const bio = formData.get("bio")?.toString().trim() || formData.get("biography")?.toString().trim() || null;
  const volunteerHours = parseFloat(formData.get("volunteerHours")?.toString() || "0");
  const status = (formData.get("status")?.toString() || "ACTIVE") as any;
  let profileImage = formData.get("profileImage")?.toString() || null;

  if (profileImage && profileImage.startsWith("blob:")) {
    profileImage = null;
  }

  const customSectionsJson = formData.get("customSections")?.toString();
  let customSections: any = null;
  if (customSectionsJson) {
    try {
      customSections = JSON.parse(customSectionsJson);
    } catch (e) {}
  }

  if (!id || !fullName) {
    return { error: "Member ID and Full Name are required." };
  }

  try {
    await prisma.member.update({
      where: { id },
      data: {
        fullName,
        title,
        status,
        leadershipTier: leadershipTier || undefined,
        bio: bio !== null ? bio : undefined,
        volunteerHours: Math.max(0, Math.floor(volunteerHours)),
        avatarUrl: profileImage || undefined,
        profileImage: profileImage || undefined,
        departmentName: departmentName || undefined,
        customSections: customSections || undefined,
      },
    });
  } catch (err: any) {
    console.error("Member update DB error:", err);
    return { error: err.message || "Failed to update member." };
  }

  revalidatePath("/admin/members");
  revalidatePath("/members");
  return { success: true };
}

// 1c. Delete Member
export async function deleteMemberAction(memberId: string) {
  await requireHRPermission();

  try {
    await prisma.member.delete({
      where: { id: memberId },
    });
  } catch (err: any) {
    console.error("Member delete DB error:", err);
    return { error: err.message || "Failed to delete member." };
  }

  revalidatePath("/admin/members");
  revalidatePath("/members");
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

  const memberId = formData.get("memberId")?.toString().trim();
  const title = formData.get("title")?.toString().trim() || "شهادة توثيق مساهمة تطوعية معتمدة";
  const description = formData.get("description")?.toString().trim() || "";

  if (!memberId) {
    return { error: "يرجى اختيار عضو من القائمة." };
  }

  // 1. First, search for the Member in Prisma Database
  let dbMember: any = null;
  try {
    dbMember = await prisma.member.findUnique({
      where: { id: memberId },
    });
  } catch (e) {}

  let memberName = "";
  let memberDept = "General";
  let memberRole = "Member";
  let volunteerHours = 0;
  let targetMemberId = memberId;

  if (dbMember) {
    targetMemberId = dbMember.id;
    memberName = dbMember.fullName;
    memberDept = dbMember.departmentName || "General";
    memberRole = dbMember.title || "Member";
    volunteerHours = dbMember.volunteerHours || 0;
  } else {
    // Fallback: Check in-memory list if offline/mocking
    const mockMem = MOCK_HR_MEMBERS.find((m) => m.id === memberId);
    if (!mockMem) {
      return { error: "Member not found. لم يتم العثور على العضو في النظام." };
    }
    targetMemberId = mockMem.id;
    memberName = mockMem.fullName;
    memberDept = mockMem.departmentName;
    memberRole = mockMem.title;
    volunteerHours = mockMem.volunteerHours;
  }

  // 2. Generate Unique Certificate Code
  const deptCode = (memberDept || "GEN").substring(0, 3).toUpperCase();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
  const certificateCode = `PRM-2026-${deptCode}-${randomSuffix}`;

  const newCert: LocalCertificateRecord = {
    id: `cert-${Date.now()}`,
    certificateCode,
    title,
    description,
    issuedAt: new Date().toISOString(),
    memberName,
    memberDepartment: memberDept,
    memberRole,
    volunteerHours,
  };

  MOCK_HR_CERTIFICATES.unshift(newCert);

  // 3. Create Certificate Record in Database
  try {
    await prisma.certificate.create({
      data: {
        certificateCode,
        title,
        description,
        memberId: targetMemberId,
      },
    });
  } catch (e: any) {
    console.error("Certificate creation DB error:", e);
  }

  revalidatePath("/admin/certificates");
  revalidatePath("/admin/members");
  return { success: true, certificateCode };
}

// 4. Verify Certificate Code (Public Verification Page)
export async function verifyCertificateCode(code: string) {
  if (!code) return null;
  try {
    const cert = await prisma.certificate.findFirst({
      where: {
        certificateCode: {
          equals: code.trim(),
          mode: "insensitive",
        },
      },
      include: {
        member: true,
      },
    });

    if (cert) {
      return {
        id: cert.id,
        certificateCode: cert.certificateCode,
        title: cert.title,
        description: cert.description,
        issuedAt: cert.issuedAt.toISOString(),
        memberName: cert.member?.fullName || "عضو فريق بروميثيوس",
        memberDepartment: cert.member?.departmentName || "عام",
        memberRole: cert.member?.title || "عضو فريق بروميثيوس",
        volunteerHours: cert.member?.volunteerHours || 0,
      };
    }
  } catch (e) {}

  const mockCert = MOCK_HR_CERTIFICATES.find(
    (c) => c.certificateCode.toLowerCase() === code.trim().toLowerCase()
  );

  return mockCert || null;
}

// Fetch public members list for website with strict hierarchy sorting
export async function getPublicMembersAction() {
  try {
    const dbMembers = await prisma.member.findMany({
      where: { status: "ACTIVE" },
      orderBy: { joinDate: "desc" },
    });

    const tierPriority = (tier?: string | null) => {
      if (tier === "Founder & Leader") return 1;
      if (tier === "Department Leader") return 2;
      return 3;
    };

    const sortedMembers = dbMembers.sort((a, b) => {
      const pA = tierPriority(a.leadershipTier);
      const pB = tierPriority(b.leadershipTier);
      if (pA !== pB) return pA - pB;
      return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
    });

    return sortedMembers.map((m) => ({
      id: m.id,
      fullName: m.fullName,
      name: m.fullName,
      title: m.title || "عضو متطوع",
      role: m.title || "عضو متطوع",
      departmentName: m.departmentName || "عام",
      department: m.departmentName || "عام",
      leadershipTier: m.leadershipTier || "Regular",
      avatarUrl: m.avatarUrl || m.profileImage,
      photoUrl: m.avatarUrl || m.profileImage,
      volunteerHours: m.volunteerHours || 0,
      status: m.status,
      bio: m.bio,
    }));
  } catch (e: any) {
    console.error("Error fetching public members:", e);
    return [];
  }
}

// Helper to fetch list of members for Admin
export async function getAdminMembersList(): Promise<LocalMemberRecord[]> {
  try {
    const dbMembers = await prisma.member.findMany({
      include: {
        certificates: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbMembers.length > 0) {
      return dbMembers.map((m) => ({
        id: m.id,
        fullName: m.fullName,
        email: "n/a",
        title: m.title || "Member",
        departmentName: m.departmentName || "General",
        leadershipTier: m.leadershipTier || "Regular",
        volunteerHours: m.volunteerHours,
        status: m.status,
        bio: m.bio,
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
        member: true,
      },
      orderBy: { issuedAt: "desc" },
    });

    if (dbCerts.length > 0) {
      return dbCerts.map((c) => ({
        id: c.id,
        certificateCode: c.certificateCode,
        title: c.title,
        description: c.description,
        issuedAt: c.issuedAt.toISOString(),
        memberName: c.member?.fullName || "Non-system Member",
        memberDepartment: c.member?.departmentName || "General",
        memberRole: c.member?.title || "Member",
        volunteerHours: c.member?.volunteerHours || 0,
      }));
    }
  } catch (e) {}

  return MOCK_HR_CERTIFICATES;
}
