import { getTranslations } from "next-intl/server";
import { Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getUserSession } from "@/lib/user-session";
import { formatVipUntil, isVipActive } from "@/lib/vip";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "UserVip" });
  return { title: t("metaTitle") };
}

type Plan = {
  id: "monthly" | "quarterly" | "yearly";
  days: number;
  priceLabelKey: "price30" | "price90" | "price365";
  highlight?: boolean;
};

const PLANS: Plan[] = [
  { id: "monthly", days: 30, priceLabelKey: "price30" },
  { id: "quarterly", days: 90, priceLabelKey: "price90", highlight: true },
  { id: "yearly", days: 365, priceLabelKey: "price365" },
];

export default async function VipUpgradePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "UserVip" });
  const user = await getUserSession();
  const vipActive = isVipActive(user);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">{t("pageTitle")}</h1>
        <p className="mt-3 text-sm text-muted">{t("pageSubtitle")}</p>
      </div>

      {!user && (
        <div className="mt-6 rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm text-foreground">
          {t("signInRequired")}{" "}
          <Link href="/account/login?next=/vip" className="font-semibold text-accent hover:underline">
            {t("signInLink")}
          </Link>
        </div>
      )}

      {vipActive && user?.vipUntil && (
        <div className="mt-6 rounded-2xl border border-accent/40 bg-accent/10 p-4 text-sm text-foreground">
          {t("alreadyVip", { date: formatVipUntil(user.vipUntil, locale) })}
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.id}
            className={`rounded-2xl border bg-card p-6 shadow-sm ${
              p.highlight
                ? "border-accent ring-2 ring-accent/40"
                : "border-card-border"
            }`}
          >
            <h2 className="text-lg font-semibold text-foreground">{t(`plan_${p.id}`)}</h2>
            <p className="mt-1 text-sm text-muted">{t(`days_${p.days}`)}</p>
            <p className="mt-4 text-2xl font-bold text-foreground">{t(p.priceLabelKey)}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {t("benefitExclusive")}
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {t("benefitNoAds")}
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {t("benefitDevices")}
              </li>
            </ul>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="mt-6 w-full cursor-not-allowed rounded-full border border-card-border bg-background px-4 py-2 text-sm font-semibold text-muted"
              title={t("mockDisabledTitle")}
            >
              {t("subscribeBtn")}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-card-border bg-card p-5 text-sm text-muted">
        <h3 className="mb-2 text-base font-semibold text-foreground">{t("demoNoticeTitle")}</h3>
        <p>{t("demoNoticeBody")}</p>
      </div>

      <p className="mt-8 text-center text-sm">
        <Link href="/account" className="text-accent hover:underline">
          ← {t("backAccount")}
        </Link>
      </p>
    </div>
  );
}
