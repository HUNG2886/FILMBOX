import type { MovieKind } from "@/lib/movie-kind";

export type DramaEpisode = {
  number: number;
  title?: string;
  thumbnail?: string;
  playbackType?: string;
  playbackUrl?: string;
};

export type Drama = {
  id: string;
  /** ID dạng số trong URL, giống pattern dramaboxdb */
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
