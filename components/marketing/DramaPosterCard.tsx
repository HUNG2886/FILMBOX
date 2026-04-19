"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Drama } from "@/lib/dramas-types";
import { movieHref } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { ExclusiveBadge } from "./ExclusiveBadge";

type Props = {
  drama: Drama;
  className?: string;
};

export function DramaPosterCard({ drama, className }: Props) {
  const reduceMotion = useReducedMotion();
  const t = useTranslations("Poster");
  const href = movieHref(drama);

  return (
    <Link
      href={href}
      aria-label={t("aria", { title: drama.title, count: drama.episodes })}
      className={cn(
        "group relative block w-[112px] shrink-0 snap-start rounded-xl sm:w-[132px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <motion.div
        className="relative aspect-[2/3] overflow-hidden rounded-xl border border-card-border bg-muted/20 shadow-sm transition group-hover:border-accent/40 group-hover:shadow-md"
        whileHover={reduceMotion ? undefined : { y: -6, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
      >
        <Image
          src={drama.posterSrc}
          alt={drama.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
          sizes="132px"
        />
        {drama.exclusive && <ExclusiveBadge />}
        <div className="poster-overlay absolute inset-x-0 bottom-0 px-1.5 pb-2 pt-8">
          <p className="line-clamp-2 text-center text-[11px] font-semibold leading-tight text-white drop-shadow sm:text-xs">
            {drama.title}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
