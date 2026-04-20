import type { MovieKind } from "@/lib/movie-kind";

export type DramaEpisode = {
  number: number;
  title?: string;
  thumbnail?: string;
  playbackType?: string;
  playbackUrl?: string;
  paid?: boolean;
};

export type Drama = {
  id: string;
  /** ID dạng số trong URL phim. */
  bookId: string;
  slug: string;
  title: string;
  episodes: number;
  synopsis: string;
  tag?: string;
  posterSrc: string;
  kind: MovieKind;
  playbackType?: string;
  playbackUrl?: string;
  exclusive?: boolean;
  episodesList?: DramaEpisode[];
};

/**
 * Whether any part of a drama requires VIP.
 * - SERIES: any episode marked `paid`.
 * - SINGLE: drama-level `exclusive` flag.
 */
export function hasPaidContent(drama: Drama): boolean {
  if (drama.kind === "SERIES") {
    return !!drama.episodesList?.some((e) => e.paid);
  }
  return !!drama.exclusive;
}

/**
 * Whether a specific episode requires VIP to play.
 * For SINGLE dramas, `epNumber` is ignored and the drama-level `exclusive` flag decides.
 */
export function isEpisodePaid(drama: Drama, epNumber: number): boolean {
  if (drama.kind === "SERIES") {
    return !!drama.episodesList?.find((e) => e.number === epNumber)?.paid;
  }
  return !!drama.exclusive;
}
