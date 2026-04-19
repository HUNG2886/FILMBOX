import type { Drama } from "@/lib/dramas-types";

export function movieHref(drama: Pick<Drama, "bookId" | "slug">) {
  return `/movie/${drama.bookId}/${drama.slug}`;
}

export const CHANNEL = {
  mustSees: "/channel/must-sees",
  trending: "/channel/trending",
  hiddenGems: "/channel/hidden-gems",
} as const;
