"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Props = {
  title: string;
  href?: string;
};

export function SectionHeading({ title, href = "#" }: Props) {
  const t = useTranslations("Sections");

  return (
    <div className="mb-4 flex items-end justify-between gap-2 sm:mb-5">
      <h2 className="relative pb-2 text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
        {title}
        <span
          aria-hidden
          className="absolute bottom-0 left-0 h-[3px] w-10 rounded-full bg-brand-gradient shadow-[0_0_12px_var(--glow)]"
        />
      </h2>
      <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.95 }}>
        <Link
          href={href}
          className="chip-glass shrink-0 hover:text-accent"
        >
          <span>{t("seeMore")}</span>
          <ChevronRight className="h-4 w-4" aria-hidden />
          <span className="sr-only">{t("seeMoreTitle", { title })}</span>
        </Link>
      </motion.div>
    </div>
  );
}
