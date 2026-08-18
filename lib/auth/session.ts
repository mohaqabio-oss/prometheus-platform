import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { RoleType } from "@prisma/client";

const secretKey = process.env.NEXTAUTH_SECRET || "prometheus_super_secret_jwt_key_change_in_production";
const encodedKey = new TextEncoder().encode(secretKey);

export interface SessionPayload {
  userId: string;
  email: string;
  fullName: string;
  roles: RoleType[];
  expiresAt: Date;
}

export async function encrypt(payload: Omit<SessionPayload, "expiresAt">) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  return new SignJWT({ ...payload, expiresAt: expiresAt.toISOString() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined): Promise<SessionPayload | null> {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      fullName: payload.fullName as string,
      roles: payload.roles as RoleType[],
      expiresAt: new Date(payload.expiresAt as string),
    };
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: string, email: string, fullName: string, roles: RoleType[]) {
  const token = await encrypt({ userId, email, fullName, roles });
  const cookieStore = await cookies();
  cookieStore.set("prometheus_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("prometheus_session")?.value;
  return await decrypt(cookie);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("prometheus_session");
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
