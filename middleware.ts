import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.NEXTAUTH_SECRET || "prometheus_super_secret_jwt_key_change_in_production";
const encodedKey = new TextEncoder().encode(secretKey);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookieToken = req.cookies.get("prometheus_session")?.value;

  let session = null;
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

  // 1. Protected Admin Routes
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
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
