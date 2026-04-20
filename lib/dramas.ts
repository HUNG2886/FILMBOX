import type { Episode, Movie } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Drama, DramaEpisode } from "@/lib/dramas-types";
import { normalizeImageUrl } from "@/lib/image-url";
import { normalizeMovieKind } from "@/lib/movie-kind";
import { MOVIE_STATUS } from "@/lib/movie-status";

export type { Drama } from "@/lib/dramas-types";

type MovieWithEpisodes = Movie & { episodesRel?: Episode[] };

function episodeToDramaEpisode(e: Episode): DramaEpisode {
  return {
    number: e.number,
    title: e.title ?? undefined,
    thumbnail: e.thumbnail ? normalizeImageUrl(e.thumbnail) : undefined,
    playbackType: e.playbackType ?? undefined,
    playbackUrl: e.playbackUrl ?? undefined,
  };
}

export function movieToDrama(m: MovieWithEpisodes): Drama {
  return {
    id: m.id,
    bookId: m.bookId,
    slug: m.slug,
    title: m.title,
    episodes: m.episodes,
    synopsis: m.synopsis,
    tag: m.tag ?? undefined,
    posterSrc: normalizeImageUrl(m.posterSrc),
    kind: normalizeMovieKind(m.kind),
    playbackType: m.playbackType ?? undefined,
    playbackUrl: m.playbackUrl ?? undefined,
    exclusive: m.exclusive,
    episodesList: m.episodesRel?.map(episodeToDramaEpisode),
  };
}

const publishedWhere = { status: MOVIE_STATUS.PUBLISHED };

export async function getFeaturedCarousel(): Promise<Drama[]> {
  const rows = await prisma.movie.findMany({
    where: { ...publishedWhere, showCarousel: true },
    orderBy: [{ shelfOrder: "asc" }, { title: "asc" }],
  });
  return rows.map(movieToDrama);
}

export async function getRecommended(): Promise<Drama[]> {
  const rows = await prisma.movie.findMany({
    where: { ...publishedWhere, showRecommended: true },
    orderBy: [{ shelfOrder: "asc" }, { title: "asc" }],
  });
  return rows.map(movieToDrama);
}

export async function getTrending(): Promise<Drama[]> {
  const rows = await prisma.movie.findMany({
    where: { ...publishedWhere, showTrending: true },
    orderBy: [{ shelfOrder: "asc" }, { title: "asc" }],
  });
  return rows.map(movieToDrama);
}

export async function getFeaturedEpisodes(): Promise<Drama[]> {
  const rows = await prisma.movie.findMany({
    where: { ...publishedWhere, showHidden: true },
    orderBy: [{ shelfOrder: "asc" }, { title: "asc" }],
  });
  return rows.map(movieToDrama);
}

export async function getAllPublishedDramas(): Promise<Drama[]> {
  const rows = await prisma.movie.findMany({
    where: publishedWhere,
    orderBy: { title: "asc" },
  });
  return rows.map(movieToDrama);
}

export async function getDramaByPath(bookId: string, slug: string): Promise<Drama | undefined> {
  const row = await prisma.movie.findFirst({
    where: {
      bookId,
      slug,
      status: MOVIE_STATUS.PUBLISHED,
    },
    include: {
      episodesRel: { orderBy: { number: "asc" } },
    },
  });
  return row ? movieToDrama(row) : undefined;
}

export async function searchPublishedDramas(query: string): Promise<Drama[]> {
  const q = query.trim().toLowerCase();
  const rows = await prisma.movie.findMany({
    where: publishedWhere,
  });
  if (!q) {
    return rows.slice(0, 12).map(movieToDrama);
  }
  return rows
    .filter((m) => {
      const slug = m.slug.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        slug.includes(q.replace(/\s+/g, "-")) ||
        (m.tag?.toLowerCase().includes(q) ?? false)
      );
    })
    .map(movieToDrama);
}

export async function getChannelDramas(
  kind: "must-sees" | "trending" | "hidden-gems",
): Promise<Drama[]> {
  const flag =
    kind === "must-sees"
      ? "showRecommended"
      : kind === "trending"
        ? "showTrending"
        : "showHidden";
  const rows = await prisma.movie.findMany({
    where: { ...publishedWhere, [flag]: true },
    orderBy: [{ shelfOrder: "asc" }, { title: "asc" }],
  });
  return rows.map(movieToDrama);
}
