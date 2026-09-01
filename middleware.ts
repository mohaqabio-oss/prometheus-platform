import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.NEXTAUTH_SECRET || "prometheus_super_secret_jwt_key_change_in_production";
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
    pathname.includes(".") // e.g. favicon.ico, images, robots.txt
  ) {
    return NextResponse.next();
  }

  // -------------------------------------------------------------
  // 2. Authentication & RBAC Rules for Admin Area (/admin)
  // -------------------------------------------------------------
  const cookieToken = req.cookies.get("prometheus_session")?.value;
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

    const userRoles: string[] = Array.isArray(session.roles) ? session.roles : [];
    const isAdmin = userRoles.includes("ADMIN");
    const isHR = userRoles.includes("HR_EDITOR");
    const isWriterOrEditor = userRoles.includes("AUTHOR") || userRoles.includes("POST_EDITOR");

    // RBAC: Users management is Master Admin only
    if (pathname.startsWith("/admin/users") && !isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    // RBAC: Writers/Authors restricted to articles
    if (
      (pathname.startsWith("/admin/members") ||
        pathname.startsWith("/admin/certificates") ||
        pathname.startsWith("/admin/applications")) &&
      !isAdmin &&
      !isHR
    ) {
      return NextResponse.redirect(new URL("/admin/articles", req.url));
    }

    // RBAC: HR Editor restricted to HR/Members
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
    // If request already starts with /post, pass through
    if (pathname.startsWith("/post")) {
      return NextResponse.next();
    }
    // Rewrite requests to the /post directory
    // e.g. post.pmthiq.online/ -> /post
    // e.g. post.pmthiq.online/editorial-board -> /post/editorial-board
    const url = req.nextUrl.clone();
    url.pathname = `/post${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  // Main Platform (pmthiq.online, www.pmthiq.online, localhost)
  // If someone directly visits /post on main domain, rewrite to 404 or journal
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
