export const MOVIE_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;

export type MovieStatusValue = (typeof MOVIE_STATUS)[keyof typeof MOVIE_STATUS];
