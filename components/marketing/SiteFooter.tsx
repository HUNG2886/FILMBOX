"use client";

import { motion } from "framer-motion";
import { ArrowRight, Link2, PlaySquare, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getSocialUrls, siteEmails } from "@/lib/site-config";

const SOCIAL_ICONS = {
  facebook: Share2,
  youtube: PlaySquare,
  tiktok: Link2,
} as const;

export function SiteFooter() {
  const t = useTranslations("Footer");
  const socialUrls = getSocialUrls();

  const aboutLinks = [
    { label: t("terms"), href: "/terms" as const },
    { label: t("privacy"), href: "/privacy" as const },
    { label: t("cookie"), href: "/cookies" as const },
    { label: t("dpo"), href: "/dpo" as const },
  ];

  const contactLinks = [
    { label: t("business"), href: "/business" as const },
    { label: t("careers"), href: "/careers" as const },
  ];

  const socialRows = [
    { key: "facebook" as const, label: t("socialFacebook") },
    { key: "youtube" as const, label: t("socialYoutube") },
    { key: "tiktok" as const, label: t("socialTiktok") },
  ];

  return (
    <motion.footer
      className="relative mt-6 border-t border-card-border/60"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-brand-gradient opacity-40"
      />

      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <div className="glass-panel-strong gradient-border relative isolate overflow-hidden rounded-[2rem] px-6 py-8 sm:px-10 sm:py-10">
          <div className="aurora-ring absolute inset-0 -z-10 opacity-60" aria-hidden />
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl space-y-2">
              <h3 className="text-brand-gradient text-xl font-extrabold sm:text-2xl">
                {t("ctaTitle")}
              </h3>
              <p className="text-sm text-muted sm:text-base">{t("ctaBody")}</p>
            </div>
            <Link
              href="/account/vip"
              className="btn-primary shine-on-hover inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
            >
              {t("ctaAction")}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-10">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            {t("aboutTitle")}
          </h3>
          <ul className="space-y-2 text-sm text-muted">
            {aboutLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            {t("contactTitle")}
          </h3>
          <ul className="space-y-2 text-sm text-muted">
            {contactLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-start gap-4 sm:col-span-2 lg:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="bg-brand-gradient flex h-10 w-10 items-center justify-center rounded-xl shadow-[0_0_18px_var(--glow)]">
              <span className="ml-0.5 inline-block h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-white" />
            </span>
            <span className="text-brand-gradient text-lg font-extrabold tracking-tight">
              FilmBox
            </span>
          </Link>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">{t("community")}</p>
            <p className="text-sm">
              <Link
                href="/community"
                className="text-muted transition hover:text-accent"
              >
                {t("communityHub")}
              </Link>
            </p>
            <ul className="flex flex-wrap gap-2 text-sm">
              {socialRows.map((s) => {
                const href = socialUrls[s.key];
                const Icon = SOCIAL_ICONS[s.key];
                const content = (
                  <>
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                    {s.label}
                  </>
                );
                return (
                  <li key={s.key}>
                    {href ? (
                      <a
                        href={href}
                        className="chip-glass hover:text-accent"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {content}
                      </a>
                    ) : (
                      <span
                        className="chip-glass opacity-60"
                        title={t("socialUnsetHint")}
                      >
                        {content}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="text-sm text-muted">
            {t("emailLabel")}{" "}
            <a
              href={`mailto:${siteEmails.feedback}`}
              className="text-accent hover:underline"
            >
              {siteEmails.feedback}
            </a>
          </p>
        </div>
      </div>
      <div className="relative border-t border-card-border/60 py-4 text-center text-xs text-muted">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-brand-gradient opacity-30"
        />
        {t("disclaimer")}
      </div>
    </motion.footer>
  );
}
