"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Copy, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  buildOrderCode,
  buildVietQRUrl,
  formatVnd,
  getPlanAmount,
  getPlanDays,
  type BankConfig,
  type PlanId,
} from "@/lib/payment-bank";

type Plan = {
  id: PlanId;
  days: number;
  highlight?: boolean;
};

type Props = {
  userId: string;
  plans: Plan[];
  bank: BankConfig;
  locale: string;
  defaultPlan?: PlanId;
};

export function PaymentBankSection({
  userId,
  plans,
  bank,
  locale,
  defaultPlan,
}: Props) {
  const t = useTranslations("UserVip.payment");
  const tVip = useTranslations("UserVip");
  const { toast } = useToast();

  const initialPlan: PlanId =
    defaultPlan ?? plans.find((p) => p.highlight)?.id ?? plans[0]?.id ?? "quarterly";

  const [plan, setPlan] = useState<PlanId>(initialPlan);

  const amount = getPlanAmount(plan);
  const memo = useMemo(
    () => buildOrderCode(userId, getPlanDays(plan)),
    [userId, plan],
  );
  const qrUrl = useMemo(
    () => buildVietQRUrl({ bank, amount, memo }),
    [bank, amount, memo],
  );

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      toast({ title: t("copied"), type: "success" });
      setTimeout(() => setCopiedKey((prev) => (prev === key ? null : prev)), 2000);
    } catch {
      toast({ title: t("copyFailed"), type: "warning" });
    }
  };

  const rows: Array<{ key: string; label: string; value: string; mono?: boolean }> = [
    { key: "bank", label: t("bankLabel"), value: bank.displayName },
    { key: "accNo", label: t("accountNoLabel"), value: bank.accountNo, mono: true },
    { key: "accName", label: t("accountNameLabel"), value: bank.accountName },
    {
      key: "amount",
      label: t("amountLabel"),
      value: formatVnd(amount, locale),
      mono: true,
    },
    { key: "memo", label: t("memoLabel"), value: memo, mono: true },
  ];

  return (
    <section
      id="payment"
      className="glass-panel-strong mt-10 scroll-mt-24 rounded-3xl p-6 shadow-[0_24px_60px_-30px_var(--glow)]"
      aria-labelledby="payment-title"
    >
      <h2 id="payment-title" className="text-brand-gradient text-xl font-bold">
        {t("sectionTitle")}
      </h2>

      <fieldset className="mt-5">
        <legend className="mb-2 text-sm font-medium text-foreground">
          {t("planLabel")}
        </legend>
        <div className="flex flex-wrap gap-2">
          {plans.map((p) => {
            const active = p.id === plan;
            return (
              <label
                key={p.id}
                className={`chip-glass cursor-pointer !px-4 !py-2 !text-sm transition ${
                  active
                    ? "border-accent/60 text-accent shadow-[0_0_12px_var(--glow)]"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <input
                  type="radio"
                  name="vip-plan"
                  value={p.id}
                  checked={active}
                  onChange={() => setPlan(p.id)}
                  className="sr-only"
                />
                <span className="font-medium">{tVip(`plan_${p.id}`)}</span>
                <span className="ml-2 text-muted">
                  · {formatVnd(getPlanAmount(p.id), locale)}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-6 md:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrUrl}
            alt={t("qrAlt")}
            width={260}
            height={260}
            className="h-64 w-64 rounded-xl border border-card-border bg-white object-contain"
          />
          <p className="text-xs text-muted">VietQR</p>
        </div>

        <dl className="divide-y divide-card-border rounded-xl border border-card-border bg-background">
          {rows.map((row) => (
            <div
              key={row.key}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <dt className="text-xs uppercase tracking-wide text-muted">
                  {row.label}
                </dt>
                <dd
                  className={`mt-0.5 truncate text-sm text-foreground ${
                    row.mono ? "font-mono" : "font-medium"
                  }`}
                  title={row.value}
                >
                  {row.value}
                </dd>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(row.value, row.key)}
                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-card-border px-3 py-1.5 text-xs font-medium text-muted transition hover:border-accent hover:text-accent"
                aria-label={`${t("copy")} ${row.label}`}
              >
                {copiedKey === row.key ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" aria-hidden />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                )}
                <span>{copiedKey === row.key ? t("copied") : t("copy")}</span>
              </button>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-6 rounded-xl border border-card-border bg-background p-4 text-sm text-muted">
        <h3 className="mb-2 text-sm font-semibold text-foreground">
          {t("instructionsTitle")}
        </h3>
        <ol className="list-decimal space-y-1 pl-5">
          <li>{t("step1")}</li>
          <li>{t("step2")}</li>
          <li>{t("step3")}</li>
        </ol>
        <p className="mt-3 text-xs">
          {t("activationNote")}{" "}
          <Link href="/support" className="text-accent hover:underline">
            {t("contactSupport")}
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
