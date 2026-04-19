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
  exclusive?: boolean;
};
