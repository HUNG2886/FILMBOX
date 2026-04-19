"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function ExclusiveBadge({ className }: Props) {
  const t = useTranslations("Badge");

  return (
    <span
      className={cn(
        "pointer-events-none absolute left-2 top-2 inline-flex max-w-[min(100%-1rem,8.5rem)] items-center rounded-md border border-white/20 bg-black/55 px-2 py-1 text-[10px] font-medium leading-none tracking-wide text-white/95 shadow-sm backdrop-blur-sm sm:text-[11px]",
        className,
      )}
      aria-hidden
    >
      {t("exclusive")}
    </span>
  );
}
