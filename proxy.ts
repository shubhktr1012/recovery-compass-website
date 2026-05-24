import { NextResponse, type NextRequest } from "next/server";
import { getHostFromHeaders, isAdminHost } from "@/lib/admin/host";
import { updateSession } from "@/lib/supabase-middleware";

const cleanAdminRoutes = new Set([
  "/activity",
  "/diet-plans",
  "/engagement",
  "/overview",
  "/programs",
  "/purchases",
  "/sign-in",
  "/users",
]);

function getAdminRewritePath(pathname: string) {
  if (pathname === "/") {
    return "/admin/overview";
  }

  if (cleanAdminRoutes.has(pathname) || pathname.startsWith("/users/")) {
    return `/admin${pathname}`;
  }

  return null;
}

export async function proxy(request: NextRequest) {
  if (isAdminHost(getHostFromHeaders(request.headers))) {
    const rewritePath = getAdminRewritePath(request.nextUrl.pathname);

    if (rewritePath) {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = rewritePath;

      return await updateSession(request, (nextRequest) =>
        NextResponse.rewrite(rewriteUrl, { request: nextRequest })
      );
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
