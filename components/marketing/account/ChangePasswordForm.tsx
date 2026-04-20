"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { changePasswordUserAction } from "@/lib/user/actions";

export function ChangePasswordForm() {
  const t = useTranslations("UserAuth");
  const searchParams = useSearchParams();
  const err = searchParams.get("pwerr");
  const ok = searchParams.get("pwok") === "1";

  return (
    <form
      action={changePasswordUserAction}
      className="space-y-3 rounded-2xl border border-card-border bg-card p-5"
    >
      <h2 className="text-base font-semibold text-foreground">{t("changePasswordTitle")}</h2>

      <div>
        <label htmlFor="pw-current" className="mb-1 block text-sm font-medium text-foreground">
          {t("currentPassword")}
        </label>
        <input
          id="pw-current"
          name="current"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="pw-next" className="mb-1 block text-sm font-medium text-foreground">
          {t("newPassword")}
        </label>
        <input
          id="pw-next"
          name="next"
          type="password"
          autoComplete="new-password"
          required
          minLength={10}
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-muted">{t("passwordHint")}</p>
      </div>

      {err === "missing" && <p className="text-sm text-warning">{t("errMissing")}</p>}
      {err === "short" && <p className="text-sm text-warning">{t("errShort")}</p>}
      {err === "weak" && <p className="text-sm text-warning">{t("errWeak")}</p>}
      {err === "invalid" && <p className="text-sm text-warning">{t("errCurrentInvalid")}</p>}
      {ok && <p className="text-sm text-accent">{t("passwordUpdated")}</p>}

      <button
        type="submit"
        className="btn-primary rounded-full px-5 py-2 text-sm font-semibold"
      >
        {t("updatePasswordBtn")}
      </button>
    </form>
  );
}
