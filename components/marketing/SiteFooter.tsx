"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getSocialUrls, siteEmails } from "@/lib/site-config";

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
      className="mt-4 border-t border-card-border bg-card/80"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-10">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">{t("aboutTitle")}</h3>
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
          <h3 className="mb-3 text-sm font-semibold text-foreground">{t("contactTitle")}</h3>
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
            <span className="bg-brand-gradient flex h-10 w-10 items-center justify-center rounded-xl">
              <span className="ml-0.5 inline-block h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-white" />
            </span>
            <span className="text-lg font-bold tracking-tight">FilmBox</span>
          </Link>
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">{t("community")}</p>
            <p className="mb-2 text-sm">
              <Link href="/community" className="text-muted transition hover:text-accent">
                {t("communityHub")}
              </Link>
            </p>
            <ul className="flex flex-wrap gap-4 text-sm text-muted">
              {socialRows.map((s) => {
                const href = socialUrls[s.key];
                return (
                  <li key={s.key}>
                    {href ? (
                      <a
                        href={href}
                        className="transition hover:text-accent"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {s.label}
                      </a>
                    ) : (
                      <span title={t("socialUnsetHint")}>{s.label}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="text-sm text-muted">
            {t("emailLabel")}{" "}
            <a href={`mailto:${siteEmails.feedback}`} className="text-accent hover:underline">
              {siteEmails.feedback}
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-card-border py-4 text-center text-xs text-muted">{t("disclaimer")}</div>
    </motion.footer>
  );
}
