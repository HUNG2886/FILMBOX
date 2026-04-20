export const MOVIE_KINDS = ["SINGLE", "SERIES"] as const;

export type MovieKind = (typeof MOVIE_KINDS)[number];

export function isMovieKind(value: unknown): value is MovieKind {
  return typeof value === "string" && (MOVIE_KINDS as readonly string[]).includes(value);
}

export function normalizeMovieKind(value: unknown): MovieKind {
  return isMovieKind(value) ? value : "SINGLE";
}
