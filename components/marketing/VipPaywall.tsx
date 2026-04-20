import { Crown, Lock } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppUser } from "@/lib/user-session";

type Props = {
  user: AppUser | null;
  locale: string;
  backHref: string;
  backLabel: string;
  /** Path (with leading /<locale>) to return to after sign-in. */
  nextPath: string;
};

export async function VipPaywall({ user, locale, backHref, backLabel, nextPath }: Props) {
  const t = await getTranslations({ locale, namespace: "Paywall" });

  const encodedNext = encodeURIComponent(nextPath);
  const loginHref = `/account/login?next=${encodedNext}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-card-border bg-card p-8 text-center shadow-sm">
        <div className="badge-vip-soft mx-auto flex h-16 w-16 items-center justify-center rounded-full">
          {user ? <Crown className="h-8 w-8" /> : <Lock className="h-8 w-8" />}
        </div>
        <h1 className="mt-4 text-2xl font-bold text-foreground">
          {user ? t("vipOnlyTitle") : t("signInRequiredTitle")}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {user ? t("vipOnlyBody") : t("signInRequiredBody")}
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {user ? (
            <Link
              href="/account/vip"
              className="btn-primary rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              {t("upgradeCta")}
            </Link>
          ) : (
            <Link
              href={loginHref}
              className="btn-primary rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              {t("signInCta")}
            </Link>
          )}
          <Link
            href={backHref}
            className="rounded-full border border-card-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-card"
          >
            ← {backLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
