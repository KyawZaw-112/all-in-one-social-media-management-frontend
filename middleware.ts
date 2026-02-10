import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
    "/",
    "/login",
    "/auth",
    "/admin/login",
    "/privacy-policy",
    "/terms",
    "/subscribe",
    "/subscribe/success",
];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    /**
     * 1️⃣ NEVER touch API routes (critical)
     */
    if (
        pathname.startsWith("/api") ||
        pathname.startsWith("/payments") ||
        pathname.startsWith("/oauth") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon")
    ) {
        return NextResponse.next();
    }

    /**
     * 2️⃣ Allow public pages
     */
    if (PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path))) {
        return NextResponse.next();
    }

    /**
     * 3️⃣ Check auth cookie (Supabase)
     * We only CHECK existence here — validation happens server-side
     */
    const hasSession =
        req.cookies.has("sb-access-token") ||
        req.cookies.has("supabase-auth-token");

    /**
     * 4️⃣ Redirect unauthenticated users to login
     */
    if (!hasSession) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
          Match all pages except:
          - API routes
          - Static files
          - Images
        */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
