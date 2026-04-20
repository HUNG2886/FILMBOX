"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { logoutAction } from "@/lib/admin/actions";

export function AdminHeader() {
  const pathname = usePathname();
  const t = useTranslations("Admin");
  const isLogin = pathname === "/admin/login";

  return (
    <header className="border-b border-card-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-semibold text-muted hover:text-foreground">
            ← {t("backSite")}
          </Link>
          {!isLogin && (
            <>
              <Link href="/admin/movies" className="text-sm font-bold text-foreground">
                {t("title")}
              </Link>
              <Link
                href="/admin/movies"
                className={
                  pathname.startsWith("/admin/movies")
                    ? "text-sm font-medium text-accent"
                    : "text-sm font-medium text-muted hover:text-foreground"
                }
              >
                {t("navMovies")}
              </Link>
              <Link
                href="/admin/users"
                className={
                  pathname.startsWith("/admin/users")
                    ? "text-sm font-medium text-accent"
                    : "text-sm font-medium text-muted hover:text-foreground"
                }
              >
                {t("navUsers")}
              </Link>
            </>
          )}
          {isLogin && <span className="text-sm font-bold text-foreground">{t("title")}</span>}
        </div>
        {!isLogin && (
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-full border border-card-border px-3 py-1.5 text-sm text-muted transition hover:border-accent/50 hover:text-foreground"
            >
              {t("logout")}
            </button>
          </form>
        )}
      </div>
    </header>
  );
}
