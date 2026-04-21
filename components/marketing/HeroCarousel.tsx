"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import type { Drama } from "@/lib/dramas-types";
import { movieHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Props = {
  items: Drama[];
};

export function HeroCarousel({ items }: Props) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const t = useTranslations("Hero");
  const list = items;
  const activeIdx = list.length ? Math.min(index, list.length - 1) : 0;
  const current = list[activeIdx];
  const swipeThreshold = 30;
  const containerRef = useRef<HTMLDivElement | null>(null);

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
    if (list.length === 0 || paused) return;
    const timer = window.setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      setDirection(1);
      setIndex((i) => (i + 1) % list.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [list.length, paused]);

  if (!current || list.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
        <p className="glass-panel rounded-3xl border-dashed px-4 py-10 text-center text-sm text-muted">
          {t("emptyCarousel")}
        </p>
      </section>
    );
  }

  const detailHref = movieHref(current);

  return (
    <section
      className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8"
      aria-roledescription="carousel"
      aria-label={t("carouselLabel")}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <div
        ref={containerRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="group relative isolate"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 rounded-[2rem]"
        >
          <div className="aurora-ring absolute inset-0 rounded-[2rem]" />
        </div>

        <div className="glass-panel-strong gradient-border relative overflow-hidden rounded-[2rem] shadow-2xl">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(60% 80% at 80% 20%, color-mix(in oklab, var(--brand-1), transparent 70%), transparent 70%), radial-gradient(60% 80% at 10% 90%, color-mix(in oklab, var(--brand-2), transparent 75%), transparent 70%)",
            }}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={`${current.bookId}-${current.slug}`}
              drag={reduceMotion ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) < swipeThreshold) return;
                paginate(info.offset.x < 0 ? 1 : -1);
              }}
              initial={{
                opacity: 0,
                x: reduceMotion ? 0 : direction > 0 ? 32 : -32,
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: reduceMotion ? 0 : direction > 0 ? -32 : 32,
              }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-stretch sm:gap-7 sm:p-8"
            >
              <Link
                href={detailHref}
                className="shine-on-hover cinematic-scanlines gradient-border relative mx-auto aspect-[2/3] w-[48%] max-w-[200px] shrink-0 overflow-hidden rounded-2xl shadow-[0_20px_50px_-20px_var(--glow)] sm:mx-0 sm:w-[220px]"
              >
                <motion.div
                  className="absolute inset-0"
                  initial={reduceMotion ? undefined : { scale: 1 }}
                  animate={reduceMotion ? undefined : { scale: 1.08 }}
                  transition={{ duration: 8, ease: "linear" }}
                  key={`kb-${current.bookId}-${current.slug}`}
                >
                  <Image
                    src={current.posterSrc}
                    alt={current.title}
                    fill
                    className="object-cover"
                    sizes="220px"
                    priority
                  />
                </motion.div>
              </Link>
              <div
                className="flex min-w-0 flex-1 flex-col justify-center gap-3"
                aria-live="polite"
              >
                <h2 className="text-brand-gradient text-2xl font-extrabold leading-tight sm:text-4xl">
                  <Link href={detailHref} className="hover:opacity-90">
                    {current.title}
                  </Link>
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="chip-glass">
                    <PlayCircle className="h-3.5 w-3.5" aria-hidden />
                    {t("episodes", { count: current.episodes })}
                  </span>
                  {current.tag && <span className="chip-glass">{current.tag}</span>}
                </div>
                <p className="line-clamp-4 text-sm leading-relaxed text-muted sm:line-clamp-5 sm:text-base">
                  {current.synopsis}
                </p>
                <div className="pt-2">
                  <Link
                    href={detailHref}
                    className="btn-primary shine-on-hover inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
                  >
                    {t("viewDetails")}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>
              <span
                className="chip-glass absolute bottom-3 right-3 !text-[10px] opacity-80"
                aria-hidden
              >
                {activeIdx + 1} / {list.length}
              </span>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-2 pb-5">
            {list.map((item, i) => (
              <motion.button
                key={`${item.bookId}-${item.slug}`}
                type="button"
                onClick={() => {
                  setDirection(i > activeIdx ? 1 : -1);
                  setIndex(i);
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === activeIdx
                    ? "w-8 bg-brand-gradient shadow-[0_0_14px_var(--glow)]"
                    : "w-3 bg-muted/40 hover:bg-muted",
                )}
                aria-label={t("slide", { n: i + 1 })}
                aria-current={i === activeIdx}
                whileTap={{ scale: 0.85 }}
                whileHover={reduceMotion ? undefined : { scale: 1.15 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
