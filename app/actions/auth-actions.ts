"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession, comparePassword, hashPassword } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { RoleType } from "@prisma/client";

// Hardcoded Seed Fallback Credentials for initial dev testing prior to PostgreSQL seeding
const SEED_FALLBACK_USERS: Record<
  string,
  {
    passwordHash: string; // bcrypt hash for 'password123'
    fullName: string;
    roles: RoleType[];
  }
> = {
  "admin@prometheus.local": {
    passwordHash: "$2a$10$7R6S92g/bH.V63i7dvhzX.Lp4H7R245O.N/N3oZ.1G8aQk.d5w/0.", // password123
    fullName: "Karrar Al-Mansoor (Admin)",
    roles: ["ADMIN"],
  },
  "hr@prometheus.local": {
    passwordHash: "$2a$10$7R6S92g/bH.V63i7dvhzX.Lp4H7R245O.N/N3oZ.1G8aQk.d5w/0.", // password123
    fullName: "Omar Al-Farooq (HR Lead)",
    roles: ["HR_EDITOR"],
  },
  "editor@prometheus.local": {
    passwordHash: "$2a$10$7R6S92g/bH.V63i7dvhzX.Lp4H7R245O.N/N3oZ.1G8aQk.d5w/0.", // password123
    fullName: "Mustafa Tariq (Editor-in-Chief)",
    roles: ["POST_EDITOR"],
  },
  "author@prometheus.local": {
    passwordHash: "$2a$10$7R6S92g/bH.V63i7dvhzX.Lp4H7R245O.N/N3oZ.1G8aQk.d5w/0.", // password123
    fullName: "Sarah Al-Hassani (Author)",
    roles: ["AUTHOR"],
  },
};

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Please provide both email address and password." };
  }

  try {
    let userFound = false;
    let userId = "";
    let userEmail = "";
    let fullName = "";
    let userRoles: RoleType[] = [];

    // 1. Try querying PostgreSQL database via Prisma if available
    try {
      const dbUser = await prisma.user.findUnique({
        where: { email },
      });

      if (dbUser && dbUser.password) {
        const isValid = await comparePassword(password, dbUser.password);
        if (isValid) {
          userFound = true;
          userId = dbUser.id;
          userEmail = dbUser.email;
          fullName = dbUser.fullName || dbUser.email.split("@")[0];
          userRoles = dbUser.roles && dbUser.roles.length > 0 ? dbUser.roles : [dbUser.role];
        }
      }
    } catch (dbErr) {
      console.error("Database error during login:", dbErr);
      // Prisma DB connection fallback
    }

    // 2. Fallback to Seed Test Accounts
    if (!userFound) {
      const fallback = SEED_FALLBACK_USERS[email];
      if (fallback) {
        // Accept 'password123' for test credentials
        if (password === "password123" || (await comparePassword(password, fallback.passwordHash))) {
          userFound = true;
          userId = `seed-${email}`;
          userEmail = email;
          fullName = fallback.fullName;
          userRoles = fallback.roles;
        }
      }
    }

    if (!userFound) {
      return { error: "Invalid email credentials or password. Please try again." };
    }

    // 3. Create HTTP-only Session Cookie
    await createSession(userId, userEmail, fullName, userRoles);

  } catch (error: any) {
    return { error: "An unexpected error occurred during login. Please try again." };
  }

  redirect("/admin/dashboard");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}