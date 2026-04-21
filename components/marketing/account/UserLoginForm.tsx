"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { loginUserAction } from "@/lib/user/actions";

type Props = {
  locale: string;
  error?: "missing" | "invalid" | "ratelimit" | "notuser";
};

export function UserLoginForm({ locale, error }: Props) {
  const t = useTranslations("UserAuth");
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "";

  return (
    <form
      action={loginUserAction}
      className="glass-panel gradient-border mx-auto mt-8 w-full max-w-sm space-y-4 rounded-3xl p-6 shadow-[0_20px_40px_-20px_var(--glow)]"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="next" value={nextPath} />

      <div>
        <label htmlFor="user-email" className="mb-1 block text-sm font-medium text-foreground">
          {t("email")}
        </label>
        <input
          id="user-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="user-password"
          className="mb-1 block text-sm font-medium text-foreground"
        >
          {t("password")}
        </label>
        <input
          id="user-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
        />
      </div>

      {error === "missing" && <p className="text-sm text-warning">{t("errMissing")}</p>}
      {error === "invalid" && <p className="text-sm text-warning">{t("errInvalid")}</p>}
      {error === "ratelimit" && <p className="text-sm text-warning">{t("errRateLimit")}</p>}
      {error === "notuser" && <p className="text-sm text-warning">{t("errNotUser")}</p>}

      <button
        type="submit"
        className="btn-primary shine-on-hover w-full rounded-full py-2.5 text-sm font-semibold"
      >
        {t("signIn")}
      </button>

      <p className="text-center text-sm text-muted">
        {t("noAccount")}{" "}
        <Link href="/account/register" className="text-accent hover:underline">
          {t("registerLink")}
        </Link>
      </p>
    </form>
  );
}
