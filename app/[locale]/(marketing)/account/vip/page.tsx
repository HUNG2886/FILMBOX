import { getTranslations } from "next-intl/server";
import { Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PaymentBankSection } from "@/components/marketing/account/PaymentBankSection";
import { getUserSession } from "@/lib/user-session";
import { getBankConfig, type PlanId } from "@/lib/payment-bank";
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
  id: PlanId;
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
  const bank = getBankConfig();

  const showPayment = !!user && !vipActive;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <h1 className="text-brand-gradient text-3xl font-extrabold sm:text-4xl">
          {t("pageTitle")}
        </h1>
        <p className="mt-3 text-sm text-muted">{t("pageSubtitle")}</p>
      </div>

      {!user && (
        <div className="glass-panel mt-6 rounded-2xl border-warning/40 p-4 text-sm text-foreground">
          {t("signInRequired")}{" "}
          <Link href="/account/login?next=/vip" className="font-semibold text-accent hover:underline">
            {t("signInLink")}
          </Link>
        </div>
      )}

      {vipActive && user?.vipUntil && (
        <div className="glass-panel mt-6 rounded-2xl border-accent/40 p-4 text-sm text-foreground">
          {t("alreadyVip", { date: formatVipUntil(user.vipUntil, locale) })}
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.id}
            className={`glass-panel rounded-3xl p-6 transition hover:border-accent/40 ${
              p.highlight
                ? "gradient-border shadow-[0_20px_40px_-20px_var(--glow)]"
                : ""
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
            {showPayment ? (
              <a
                href="#payment"
                data-plan={p.id}
                className="btn-primary shine-on-hover mt-6 block w-full rounded-full px-4 py-2.5 text-center text-sm font-semibold"
              >
                {t("subscribeBtn")}
              </a>
            ) : (
              <Link
                href={user ? "/account" : "/account/login?next=/vip"}
                className="glass-panel mt-6 block w-full rounded-full px-4 py-2.5 text-center text-sm font-semibold text-muted transition hover:text-accent"
              >
                {t("subscribeBtn")}
              </Link>
            )}
          </div>
        ))}
      </div>

      {showPayment && bank && (
        <PaymentBankSection
          userId={user.id}
          plans={PLANS.map((p) => ({
            id: p.id,
            days: p.days,
            highlight: p.highlight,
          }))}
          bank={bank}
          locale={locale}
        />
      )}

      {showPayment && !bank && (
        <div className="glass-panel mt-8 rounded-2xl p-5 text-sm text-muted">
          <h3 className="mb-2 text-base font-semibold text-foreground">
            {t("payment.fallbackTitle")}
          </h3>
          <p>{t("payment.fallbackBody")}</p>
          <p className="mt-3">
            <Link href="/support" className="text-accent hover:underline">
              {t("payment.contactSupport")}
            </Link>
          </p>
        </div>
      )}

      <p className="mt-8 text-center text-sm">
        <Link href="/account" className="text-accent hover:underline">
          ← {t("backAccount")}
        </Link>
      </p>
    </div>
  );
}
