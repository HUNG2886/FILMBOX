"use client";

import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Header");

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-card-border bg-card/80 px-0.5 py-0.5 text-xs text-muted sm:gap-1 sm:px-1"
      role="group"
      aria-label={t("languagePicker")}
    >
      <Languages className="ml-1 hidden h-3.5 w-3.5 shrink-0 opacity-70 sm:block" aria-hidden />
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide transition sm:text-xs",
            locale === l
              ? "bg-background text-foreground shadow-sm"
              : "text-muted hover:text-foreground",
          )}
          aria-current={locale === l ? "true" : undefined}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
