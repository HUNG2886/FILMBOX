"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/marketing/SectionHeading";

type Props = {
  title: string;
  href: string;
  children: React.ReactNode;
};

export function ShelfRow({ title, href, children }: Props) {
  const t = useTranslations("Sections");
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [hovering, setHovering] = useState(false);

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card =
      (el.querySelector(":scope > *") as HTMLElement | null)?.offsetWidth ??
      140;
    const gap = 12;
    el.scrollBy({ left: dir * (card + gap) * 3, behavior: "smooth" });
  }, []);

  return (
    <motion.section
      className="group/shelf relative mx-auto max-w-6xl px-4 py-6 sm:px-6"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <SectionHeading title={title} href={href} />
      <div className="relative">
        <div
          ref={scrollerRef}
          className="shelf-snap flex gap-3 overflow-x-auto pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </div>
        <button
          type="button"
          aria-label={t("scrollPrev")}
          onClick={() => scrollByCard(-1)}
          className={`glass-panel absolute left-1 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-foreground shadow-lg transition hover:text-accent sm:flex ${
            hovering ? "opacity-100" : "opacity-0"
          } pointer-events-auto focus-visible:opacity-100`}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <button
          type="button"
          aria-label={t("scrollNext")}
          onClick={() => scrollByCard(1)}
          className={`glass-panel absolute right-1 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-foreground shadow-lg transition hover:text-accent sm:flex ${
            hovering ? "opacity-100" : "opacity-0"
          } pointer-events-auto focus-visible:opacity-100`}
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </motion.section>
  );
}
