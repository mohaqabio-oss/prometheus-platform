import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey =
  process.env.JWT_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "Prometheus_Super_Secret_Key_2026_!@";
const encodedKey = new TextEncoder().encode(secretKey);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // -------------------------------------------------------------
  // 1. Bypass static files, internal Next.js assets, and APIs
  // -------------------------------------------------------------
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname === "/sw.js" ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.webmanifest" ||
    pathname.includes(".") // e.g. favicon.ico, images, fonts, robots.txt
  ) {
    return NextResponse.next();
  }

  // -------------------------------------------------------------
  // 2. Authentication & RBAC Rules for Admin Area (/admin)
  // -------------------------------------------------------------
  const cookieToken =
    req.cookies.get("prometheus_session")?.value ||
    req.cookies.get("token")?.value ||
    req.cookies.get("session")?.value ||
    req.cookies.get("auth_token")?.value;

  let session: any = null;

  if (cookieToken) {
    try {
      const { payload } = await jwtVerify(cookieToken, encodedKey, {
        algorithms: ["HS256"],
      });
      session = payload;
    } catch {
      session = null;
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Extract roles flexibly whether stored as array (roles) or single value (role)
    const rawRoles = session.roles || session.role || [];
    const userRoles: string[] = Array.isArray(rawRoles)
      ? rawRoles.map(String)
      : typeof rawRoles === "string"
      ? [rawRoles]
      : [];

    if (session.role && typeof session.role === "string" && !userRoles.includes(session.role)) {
      userRoles.push(session.role);
    }

    const isAdmin = userRoles.includes("ADMIN");
    const isHR = userRoles.includes("HR_EDITOR");
    const isWriterOrEditor =
      userRoles.includes("AUTHOR") ||
      userRoles.includes("POST_EDITOR") ||
      userRoles.includes("WRITER");

    // Task 1 RBAC: Master Admin Only for User Accounts Management
    if (pathname.startsWith("/admin/users") && !isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    // Task 1 RBAC: Writers/Authors restricted to articles
    if (
      (pathname.startsWith("/admin/members") ||
        pathname.startsWith("/admin/certificates") ||
        pathname.startsWith("/admin/applications")) &&
      !isAdmin &&
      !isHR
    ) {
      return NextResponse.redirect(new URL("/admin/articles", req.url));
    }

    // Task 1 RBAC: HR Editor restricted to HR/Members
    if (
      (pathname.startsWith("/admin/articles") || pathname.startsWith("/admin/collections")) &&
      !isAdmin &&
      !isWriterOrEditor
    ) {
      return NextResponse.redirect(new URL("/admin/members", req.url));
    }

    return NextResponse.next();
  }

  // Redirect authenticated users away from login page
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  // -------------------------------------------------------------
  // 3. Subdomain Detection & URL Rewriting
  // -------------------------------------------------------------
  // Normalize host: strips port (e.g., "post.localhost:3000" -> "post.localhost")
  const currentHost = hostname.replace(/:\d+$/, "").toLowerCase();

  // Detect Academic Journal Subdomain (Production & Localhost)
  const isJournalSubdomain =
    currentHost === "post.pmthiq.online" ||
    currentHost === "post.localhost";

  if (isJournalSubdomain) {
    // Keep global shared routes intact
    if (
      pathname.startsWith("/admin") ||
      pathname === "/login" ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/verify") ||
      pathname.startsWith("/attendance") ||
      pathname.startsWith("/post")
    ) {
      return NextResponse.next();
    }
    const url = req.nextUrl.clone();
    url.pathname = `/post${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
