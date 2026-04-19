"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { DramaPosterCard } from "@/components/marketing/DramaPosterCard";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import type { Drama } from "@/lib/dramas-types";
import { CHANNEL } from "@/lib/routes";

type Props = {
  items: Drama[];
};

export function SectionRecommended({ items }: Props) {
  const t = useTranslations("Sections");

  if (items.length === 0) {
    return null;
  }

  return (
    <motion.section
      className="mx-auto max-w-6xl px-4 py-6 sm:px-6"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <SectionHeading title={t("recommended")} href={CHANNEL.mustSees} />
      <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((drama) => (
          <DramaPosterCard key={`${drama.bookId}-${drama.slug}`} drama={drama} />
        ))}
      </div>
    </motion.section>
  );
}
