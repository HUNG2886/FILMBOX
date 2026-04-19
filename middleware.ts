import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/auth-jwt";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0];
  const isLocale = locale === "vi" || locale === "en";

  const isAdminLogin =
    isLocale && segments[1] === "admin" && segments[2] === "login";
  const isAdminProtected =
    isLocale &&
    segments[1] === "admin" &&
    segments.length >= 3 &&
    segments[2] !== "login";

  if (isAdminProtected) {
    const token = request.cookies.get("admin_session")?.value;
    const session = token ? await verifyAdminToken(token) : null;
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/admin/login`;
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (isAdminLogin) {
    const token = request.cookies.get("admin_session")?.value;
    const session = token ? await verifyAdminToken(token) : null;
    if (session) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/admin/movies`;
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
