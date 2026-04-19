"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { loginAction } from "@/lib/admin/actions";

type Props = {
  locale: string;
  error?: "missing" | "invalid" | "ratelimit";
};

export function LoginForm({ locale, error }: Props) {
  const t = useTranslations("Admin");
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "";

  return (
    <form action={loginAction} className="mx-auto mt-8 max-w-sm space-y-4 rounded-2xl border border-card-border bg-card p-6 shadow-sm">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="next" value={nextPath} />

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-foreground">
          {t("password")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
        />
      </div>

      {error === "missing" && <p className="text-sm text-warning">{t("errorMissing")}</p>}
      {error === "invalid" && <p className="text-sm text-warning">{t("errorInvalid")}</p>}
      {error === "ratelimit" && <p className="text-sm text-warning">{t("errorRateLimit")}</p>}

      <button type="submit" className="btn-primary w-full rounded-full py-2.5 text-sm font-semibold">
        {t("signIn")}
      </button>
    </form>
  );
}
