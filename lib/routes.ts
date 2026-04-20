import type { Drama } from "@/lib/dramas-types";

export function movieHref(drama: Pick<Drama, "bookId" | "slug">) {
  return `/movie/${drama.bookId}/${drama.slug}`;
}

export function episodeHref(
  drama: Pick<Drama, "bookId" | "slug">,
  episodeNumber: number,
) {
  const n = Number.isFinite(episodeNumber) && episodeNumber > 0 ? Math.floor(episodeNumber) : 1;
  return `/ep/${drama.bookId}_${drama.slug}/${drama.bookId}_Episode-${n}`;
}

export const CHANNEL = {
  mustSees: "/channel/must-sees",
  trending: "/channel/trending",
  hiddenGems: "/channel/hidden-gems",
} as const;
