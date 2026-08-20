import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.NEXTAUTH_SECRET || "prometheus_super_secret_jwt_key_change_in_production";
const encodedKey = new TextEncoder().encode(secretKey);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookieToken = req.cookies.get("prometheus_session")?.value;

  let session: any = null;
  if (cookieToken) {
    try {
      const { payload } = await jwtVerify(cookieToken, encodedKey, {
        algorithms: ["HS256"],
      });
      session = payload;
    } catch (e) {
      session = null;
    }
  }

  // 1. Protected Admin Routes Authentication & RBAC Rules
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const userRoles: string[] = Array.isArray(session.roles) ? session.roles : [];
    const isAdmin = userRoles.includes("ADMIN");
    const isHR = userRoles.includes("HR_EDITOR");
    const isWriterOrEditor = userRoles.includes("AUTHOR") || userRoles.includes("POST_EDITOR");

    // Task 1 RBAC: Master Admin Only for User Accounts Management
    if (pathname.startsWith("/admin/users") && !isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    // Task 1 RBAC: Writer/Author can ONLY access Articles Dashboard
    if (pathname.startsWith("/admin/members") || pathname.startsWith("/admin/certificates") || pathname.startsWith("/admin/applications")) {
      if (!isAdmin && !isHR) {
        return NextResponse.redirect(new URL("/admin/articles", req.url));
      }
    }

    // Task 1 RBAC: HR Editor can ONLY access HR/Members Dashboard
    if (pathname.startsWith("/admin/articles") || pathname.startsWith("/admin/collections")) {
      if (!isAdmin && !isWriterOrEditor) {
        return NextResponse.redirect(new URL("/admin/members", req.url));
      }
    }
  }

  // 2. Redirect Authenticated Users Away from Login Page
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
