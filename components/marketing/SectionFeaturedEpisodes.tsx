"use client";

import { useTranslations } from "next-intl";
import { DramaPosterCard } from "@/components/marketing/DramaPosterCard";
import { ShelfRow } from "@/components/marketing/ShelfRow";
import type { Drama } from "@/lib/dramas-types";
import { CHANNEL } from "@/lib/routes";

type Props = {
  items: Drama[];
};

export function SectionFeaturedEpisodes({ items }: Props) {
  const t = useTranslations("Sections");

  if (items.length === 0) {
    return null;
  }

  return (
    <ShelfRow title={t("featured")} href={CHANNEL.hiddenGems}>
      {items.map((drama) => (
        <DramaPosterCard key={`${drama.bookId}-${drama.slug}`} drama={drama} />
      ))}
    </ShelfRow>
  );
}
