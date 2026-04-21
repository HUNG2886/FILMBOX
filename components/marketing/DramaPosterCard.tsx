"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
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

const TILT_RANGE = 8;
const SPRING = { stiffness: 220, damping: 18, mass: 0.4 } as const;

export function DramaPosterCard({ drama, className }: Props) {
  const reduceMotion = useReducedMotion();
  const t = useTranslations("Poster");
  const href = movieHref(drama);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [TILT_RANGE, -TILT_RANGE]), SPRING);
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-TILT_RANGE, TILT_RANGE]), SPRING);

  const handleMove = reduceMotion
    ? undefined
    : (e: React.MouseEvent<HTMLAnchorElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - rect.left) / rect.width - 0.5);
        py.set((e.clientY - rect.top) / rect.height - 0.5);
      };
  const handleLeave = reduceMotion
    ? undefined
    : () => {
        px.set(0);
        py.set(0);
      };

  return (
    <Link
      href={href}
      aria-label={t("aria", { title: drama.title, count: drama.episodes })}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn(
        "group relative block w-[116px] shrink-0 snap-start rounded-2xl sm:w-[140px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "[perspective:900px]",
        className,
      )}
    >
      <motion.div
        style={reduceMotion ? undefined : { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className="gradient-border gradient-border-hover relative aspect-[2/3] overflow-hidden rounded-2xl border border-card-border bg-muted/20 shadow-sm transition duration-300 will-change-transform group-hover:shadow-[0_20px_40px_-20px_var(--glow)]"
      >
        <Image
          src={drama.posterSrc}
          alt={drama.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.06]"
          sizes="140px"
        />
        {drama.exclusive && <ExclusiveBadge />}
        <div className="poster-overlay absolute inset-x-0 bottom-0 px-2 pb-2.5 pt-10">
          <p className="line-clamp-2 text-center text-[11px] font-semibold leading-tight text-white drop-shadow sm:text-xs">
            {drama.title}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
