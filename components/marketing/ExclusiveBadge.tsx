"use client";

import { Sparkles } from "lucide-react";
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
        "chip-glass pointer-events-none absolute left-2 top-2 !px-2 !py-0.5 !text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm sm:!text-[11px]",
        className,
      )}
      style={{
        background:
          "linear-gradient(135deg, color-mix(in oklab, var(--brand-1), transparent 30%), color-mix(in oklab, var(--brand-2), transparent 30%))",
        borderColor: "color-mix(in oklab, var(--brand-2), transparent 45%)",
      }}
      aria-hidden
    >
      <Sparkles className="h-3 w-3" aria-hidden />
      {t("exclusive")}
    </span>
  );
}
