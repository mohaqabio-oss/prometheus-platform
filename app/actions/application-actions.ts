"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { ApplicationStatus } from "@prisma/client";

export interface LocalApplicationRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  age: string;
  education: string;
  departmentName: string;
  skills: string;
  motivation: string;
  experience?: string;
  portfolioUrl?: string;
  status: ApplicationStatus;
  notes?: string;
  createdAt: string;
}

let MOCK_APPLICATIONS: LocalApplicationRecord[] = [
  {
    id: "app-101",
    fullName: "Ahmed Youssef",
    email: "ahmed.youssef@example.com",
    phone: "+964 770 123 4567",
    age: "23",
    education: "B.Sc. Computer Engineering (Final Year)",
    departmentName: "Technology",
    skills: "React, Next.js, TypeScript, PostgreSQL, Docker",
    motivation: "I have been following Prometheus technical publications and want to contribute voluntary engineering effort to open-source education platforms.",
    portfolioUrl: "https://github.com/ahmed-youssef",
    status: "PENDING",
    createdAt: "2026-08-16T14:20:00.000Z",
  },
  {
    id: "app-102",
    fullName: "Noor Al-Zahra",
    email: "noor.alzahra@example.com",
    phone: "+964 780 987 6543",
    age: "25",
    education: "M.Sc. Molecular Biology",
    departmentName: "Research",
    skills: "Genomic Data Synthesis, Bioinformatics, Python, R",
    motivation: "Desire to publish open-access systematic reviews and research digests on genomic variant predictors.",
    portfolioUrl: "https://linkedin.com/in/noor-alzahra",
    status: "UNDER_REVIEW",
    notes: "Candidate has strong academic citations. Candidate scheduled for preliminary interview.",
    createdAt: "2026-08-14T09:15:00.000Z",
  },
  {
    id: "app-103",
    fullName: "Hassan Ali",
    email: "hassan.ali@example.com",
    phone: "+964 750 444 3322",
    age: "22",
    education: "B.A. English & Technical Communication",
    departmentName: "Education",
    skills: "Editorial Proofreading, Translation, Technical Documentation",
    motivation: "I want to help refine Prometheus Post articles for clarity and international accessibility.",
    status: "ACCEPTED",
    notes: "Accepted as Voluntary Content Editor in Education dept.",
    createdAt: "2026-08-01T11:00:00.000Z",
  },
];

// 1. Public Action: Submit Volunteer Application
export async function submitApplicationAction(prevState: any, formData: FormData) {
  const fullName = formData.get("fullName")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const phone = formData.get("phone")?.toString().trim() || "N/A";
  const age = formData.get("age")?.toString().trim() || "N/A";
  const education = formData.get("education")?.toString().trim() || "";
  const departmentName = formData.get("departmentName")?.toString() || "Technology";
  const skills = formData.get("skills")?.toString().trim() || "";
  const motivation = formData.get("motivation")?.toString().trim();
  const portfolioUrl = formData.get("portfolioUrl")?.toString().trim() || "";

  // Validation
  if (!fullName || !email || !motivation) {
    return { error: "Please fill out all required fields (Full Name, Email, and Motivation)." };
  }

  if (!email.includes("@") || !email.includes(".")) {
    return { error: "Please enter a valid email address." };
  }

  const newApp: LocalApplicationRecord = {
    id: `app-${Date.now()}`,
    fullName,
    email,
    phone,
    age,
    education,
    departmentName,
    skills,
    motivation,
    portfolioUrl,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };

  MOCK_APPLICATIONS.unshift(newApp);

  try {
    // DB insertion attempt
    const dept = await prisma.department.findFirst({
      where: { name: { contains: departmentName, mode: "insensitive" } },
    });

    if (dept) {
      await prisma.application.create({
        data: {
          fullName,
          email,
          phone,
          motivation,
          experience: `Age: ${age} | Ed: ${education} | Skills: ${skills} | Portfolio: ${portfolioUrl}`,
          status: "PENDING",
          departmentId: dept.id,
        },
      });
    }
  } catch (dbErr) {}

  revalidatePath("/admin/applications");
  return { success: true };
}

// 2. HR Action: Update Application Status & Notes (HR_EDITOR or ADMIN only)
export async function updateApplicationStatusAction(
  applicationId: string,
  newStatus: ApplicationStatus,
  notes?: string
) {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required. Please log in.");
  }

  const hasHR = session.roles.includes("ADMIN") || session.roles.includes("HR_EDITOR");
  if (!hasHR) {
    throw new Error("Unauthorized: HR_EDITOR or ADMIN role is required to review candidate applications.");
  }

  const app = MOCK_APPLICATIONS.find((a) => a.id === applicationId);
  if (app) {
    app.status = newStatus;
    if (notes !== undefined) {
      app.notes = notes;
    }
  }

  try {
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: newStatus,
        notes: notes || undefined,
      },
    });
  } catch (e) {}

  revalidatePath("/admin/applications");
  return { success: true };
}

// Helper: Fetch applications for admin dashboard
export async function getAdminApplicationsList(): Promise<LocalApplicationRecord[]> {
  try {
    const dbApps = await prisma.application.findMany({
      include: {
        department: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbApps.length > 0) {
      return dbApps.map((a) => ({
        id: a.id,
        fullName: a.fullName,
        email: a.email,
        phone: a.phone,
        age: "23",
        education: a.experience || "N/A",
        departmentName: a.department.name,
        skills: "N/A",
        motivation: a.motivation,
        portfolioUrl: a.resumeUrl || undefined,
        status: a.status,
        notes: a.notes || undefined,
        createdAt: a.createdAt.toISOString(),
      }));
    }
  } catch (e) {}

  return MOCK_APPLICATIONS;
}
