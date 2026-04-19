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
    <div className="mb-3 flex items-center justify-between gap-2 sm:mb-4">
      <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">{title}</h2>
      <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.95 }}>
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-0.5 text-sm font-medium text-muted transition hover:text-accent"
        >
          <span>{t("seeMore")}</span>
          <ChevronRight className="h-5 w-5" aria-hidden />
          <span className="sr-only">{t("seeMoreTitle", { title })}</span>
        </Link>
      </motion.div>
    </div>
  );
}
