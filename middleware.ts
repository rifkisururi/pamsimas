import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ROLE_ROUTES: Record<string, string> = {
  OWNER: "/admin/dashboard",
  OFFICER: "/officer/readings",
  CUSTOMER: "/customer/bills",
  COLLECTOR: "/cashier/payments",
};

async function readSession(request: NextRequest) {
  const token = request.cookies.get("pdam_session")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET || "");
    const { payload } = await jwtVerify(token, secret);
    return payload as { user?: { role?: string } };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await readSession(request);
  const role = session?.user?.role;

  if (pathname === "/login" && role) {
    const redirectUrl = ROLE_ROUTES[role] || "/login";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  const restricted =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/officer") ||
    pathname.startsWith("/customer") ||
    pathname.startsWith("/cashier");

  if (!restricted) return NextResponse.next();

  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin") && role !== "OWNER") {
    return NextResponse.redirect(new URL(ROLE_ROUTES[role] || "/login", request.url));
  }
  if (pathname.startsWith("/officer") && role !== "OFFICER") {
    return NextResponse.redirect(new URL(ROLE_ROUTES[role] || "/login", request.url));
  }
  if (pathname.startsWith("/customer") && role !== "CUSTOMER") {
    return NextResponse.redirect(new URL(ROLE_ROUTES[role] || "/login", request.url));
  }
  if (pathname.startsWith("/cashier") && role !== "COLLECTOR") {
    return NextResponse.redirect(new URL(ROLE_ROUTES[role] || "/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/admin/:path*", "/officer/:path*", "/customer/:path*", "/cashier/:path*"],
};
