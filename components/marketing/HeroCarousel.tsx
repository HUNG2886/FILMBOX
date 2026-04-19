"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { KeyboardEvent, useEffect, useState } from "react";
import type { Drama } from "@/lib/dramas-types";
import { movieHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Props = {
  items: Drama[];
};

export function HeroCarousel({ items }: Props) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();
  const t = useTranslations("Hero");
  const list = items;
  const activeIdx = list.length ? Math.min(index, list.length - 1) : 0;
  const current = list[activeIdx];
  const swipeThreshold = 30;

  const paginate = (nextDirection: number) => {
    if (list.length === 0) return;
    setDirection(nextDirection);
    setIndex((i) => (i + nextDirection + list.length) % list.length);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight") paginate(1);
    if (event.key === "ArrowLeft") paginate(-1);
  };

  useEffect(() => {
    if (list.length === 0) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % list.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [list.length]);

  if (!current || list.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
        <p className="rounded-2xl border border-dashed border-card-border bg-card/40 px-4 py-8 text-center text-sm text-muted">
          {t("emptyCarousel")}
        </p>
      </section>
    );
  }

  const detailHref = movieHref(current);

  return (
    <section
      className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6"
      aria-roledescription="carousel"
      aria-label={t("carouselLabel")}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <div className="overflow-hidden rounded-2xl border border-card-border bg-card shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${current.bookId}-${current.slug}`}
            drag={reduceMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) < swipeThreshold) return;
              paginate(info.offset.x < 0 ? 1 : -1);
            }}
            initial={{ opacity: 0, x: reduceMotion ? 0 : direction > 0 ? 26 : -26 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduceMotion ? 0 : direction > 0 ? -26 : 26 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch sm:gap-6 sm:p-6"
          >
            <Link
              href={detailHref}
              className="relative mx-auto aspect-[2/3] w-[42%] max-w-[180px] shrink-0 overflow-hidden rounded-xl sm:mx-0 sm:w-[200px]"
            >
              <Image
                src={current.posterSrc}
                alt={current.title}
                fill
                className="object-cover"
                sizes="200px"
                priority
              />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-2" aria-live="polite">
              <h2 className="text-lg font-bold leading-snug text-foreground sm:text-xl">
                <Link href={detailHref} className="hover:text-accent">
                  {current.title}
                </Link>
              </h2>
              <p className="text-sm font-medium text-accent">
                {t("episodes", { count: current.episodes })}
              </p>
              <p className="line-clamp-4 text-sm leading-relaxed text-muted sm:line-clamp-5">
                {current.synopsis}
              </p>
              {current.tag && (
                <span className="mt-1 inline-flex w-fit rounded-full border border-card-border bg-background px-3 py-1 text-xs text-muted">
                  {current.tag}
                </span>
              )}
              <div className="pt-1">
                <Link
                  href={detailHref}
                  className="inline-flex text-sm font-medium text-accent hover:underline"
                >
                  {t("viewDetails")}
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2 pb-4">
          {list.map((item, i) => (
            <motion.button
              key={`${item.bookId}-${item.slug}`}
              type="button"
              onClick={() => {
                setDirection(i > activeIdx ? 1 : -1);
                setIndex(i);
              }}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition",
                i === activeIdx ? "bg-accent" : "bg-muted/40 hover:bg-muted",
              )}
              aria-label={t("slide", { n: i + 1 })}
              aria-current={i === activeIdx}
              whileTap={{ scale: 0.85 }}
              whileHover={reduceMotion ? undefined : { scale: 1.15 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
