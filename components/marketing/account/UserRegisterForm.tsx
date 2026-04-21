"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { registerUserAction } from "@/lib/user/actions";

type Props = {
  locale: string;
  error?: "missing" | "invalid_email" | "weak" | "short" | "exists" | "ratelimit";
};

export function UserRegisterForm({ locale, error }: Props) {
  const t = useTranslations("UserAuth");
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "";
  const prefillEmail = searchParams.get("email") ?? "";

  return (
    <form
      action={registerUserAction}
      className="glass-panel gradient-border mx-auto mt-8 w-full max-w-sm space-y-4 rounded-3xl p-6 shadow-[0_20px_40px_-20px_var(--glow)]"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="next" value={nextPath} />

      <div>
        <label htmlFor="reg-email" className="mb-1 block text-sm font-medium text-foreground">
          {t("email")}
        </label>
        <input
          id="reg-email"
          name="email"
          type="email"
          defaultValue={prefillEmail}
          autoComplete="username"
          required
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="reg-password"
          className="mb-1 block text-sm font-medium text-foreground"
        >
          {t("password")}
        </label>
        <input
          id="reg-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={10}
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-muted">{t("passwordHint")}</p>
      </div>

      {error === "missing" && <p className="text-sm text-warning">{t("errMissing")}</p>}
      {error === "invalid_email" && (
        <p className="text-sm text-warning">{t("errInvalidEmail")}</p>
      )}
      {error === "short" && <p className="text-sm text-warning">{t("errShort")}</p>}
      {error === "weak" && <p className="text-sm text-warning">{t("errWeak")}</p>}
      {error === "exists" && <p className="text-sm text-warning">{t("errExists")}</p>}
      {error === "ratelimit" && <p className="text-sm text-warning">{t("errRateLimit")}</p>}

      <button
        type="submit"
        className="btn-primary shine-on-hover w-full rounded-full py-2.5 text-sm font-semibold"
      >
        {t("createAccount")}
      </button>

      <p className="text-center text-sm text-muted">
        {t("haveAccount")}{" "}
        <Link href="/account/login" className="text-accent hover:underline">
          {t("signInLink")}
        </Link>
      </p>
    </form>
  );
}
