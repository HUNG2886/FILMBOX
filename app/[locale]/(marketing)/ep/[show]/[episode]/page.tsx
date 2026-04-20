import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getDramaByPath } from "@/lib/dramas";
import { episodeHref, movieHref } from "@/lib/routes";

const PAGE_SIZE = 50;

type Props = {
  params: Promise<{ locale: string; show: string; episode: string }>;
  searchParams?: Promise<{ page?: string | string[] }>;
};

function parseShowParam(show: string): { bookId: string; slug: string } | null {
  const idx = show.indexOf("_");
  if (idx <= 0) return null;
  const bookId = show.slice(0, idx).trim();
  const slug = show.slice(idx + 1).trim();
  if (!bookId || !slug) return null;
  return { bookId, slug };
}

function parseEpisodeNumber(segment: string): number {
  const m = segment.match(/Episode-(\d+)/i);
  if (!m) return 1;
  return Math.max(1, Number.parseInt(m[1], 10) || 1);
}

function parsePageParam(raw: string | string[] | undefined): number | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return null;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export async function generateMetadata({ params }: Props) {
  const { locale, show, episode } = await params;
  const parsed = parseShowParam(show);
  const t = await getTranslations({ locale, namespace: "Movie" });
  if (!parsed) return { title: t("metaFallback") };
  const drama = await getDramaByPath(parsed.bookId, parsed.slug);
  if (!drama) return { title: t("metaFallback") };
  const epNum = parseEpisodeNumber(episode);
  return {
    title: `${drama.title} — ${t("episodeLabel", { n: epNum })}`,
  };
}

export default async function EpisodePage({ params, searchParams }: Props) {
  const { show, episode } = await params;
  const parsed = parseShowParam(show);
  if (!parsed) notFound();

  const drama = await getDramaByPath(parsed.bookId, parsed.slug);
  if (!drama) notFound();

  const t = await getTranslations("Movie");
  const currentEpisode = Math.min(
    drama.episodes,
    Math.max(1, parseEpisodeNumber(episode)),
  );

  const ep = drama.episodesList?.find((e) => e.number === currentEpisode);
  const isSeries = drama.kind === "SERIES";
  const playbackType = ep?.playbackType ?? drama.playbackType;
  const playbackUrl = ep?.playbackUrl ?? drama.playbackUrl;

  const sp = (await searchParams) ?? {};
  const totalPages = Math.max(1, Math.ceil(drama.episodes / PAGE_SIZE));
  const requestedPage = parsePageParam(sp.page);
  const derivedPage = Math.ceil(currentEpisode / PAGE_SIZE);
  const currentPage = Math.min(
    totalPages,
    Math.max(1, requestedPage ?? derivedPage),
  );
  const pageStart = (currentPage - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(drama.episodes, currentPage * PAGE_SIZE);

  const currentEpisodePath = episodeHref(drama, currentEpisode);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const prevHref = `${currentEpisodePath}?page=${currentPage - 1}`;
  const nextHref = `${currentEpisodePath}?page=${currentPage + 1}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav className="text-sm text-muted">
        <Link href="/" className="hover:text-accent">
          {t("breadcrumbHome")}
        </Link>
        <span className="mx-2">/</span>
        <Link href={movieHref(drama)} className="hover:text-accent">
          {drama.title}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">
          {t("episodeLabel", { n: currentEpisode })}
        </span>
      </nav>

      <h1 className="mt-4 text-2xl font-bold text-foreground">{drama.title}</h1>
      <p className="mt-1 text-sm text-muted">
        {t("episodeLabel", { n: currentEpisode })}
        {ep?.title ? <span className="ml-2 text-foreground">— {ep.title}</span> : null}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="overflow-hidden rounded-xl border border-card-border bg-card">
          {playbackUrl ? (
            playbackType === "drive" || playbackType === "external" ? (
              <iframe
                src={playbackUrl}
                title={`${drama.title} player`}
                className="aspect-video w-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video className="aspect-video w-full bg-black" controls playsInline preload="metadata">
                <source src={playbackUrl} />
                {t("playbackNotSupported")}
              </video>
            )
          ) : (
            <p className="p-4 text-sm text-muted">{t("noPlayback")}</p>
          )}
        </div>

        <aside className="rounded-xl border border-card-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground">{t("episodesListTitle")}</h2>
          <p className="mt-1 text-xs text-muted">
            {isSeries ? t("perEpisodeHint") : t("singleSourceHint")}
          </p>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {Array.from({ length: pageEnd - pageStart + 1 }, (_, i) => pageStart + i).map((n) => {
              const active = n === currentEpisode;
              const item = drama.episodesList?.find((e) => e.number === n);
              const label = item?.title
                ? `${t("episodeLabel", { n })} — ${item.title}`
                : t("episodeLabel", { n });
              return (
                <Link
                  key={n}
                  href={episodeHref(drama, n)}
                  aria-label={label}
                  title={label}
                  className={
                    active
                      ? "flex aspect-square items-center justify-center rounded-md border border-accent bg-accent/15 text-xs font-semibold text-accent"
                      : "flex aspect-square items-center justify-center rounded-md border border-card-border bg-background text-xs font-medium text-foreground hover:border-accent/50"
                  }
                >
                  {n}
                </Link>
              );
            })}
          </div>

          {totalPages > 1 ? (
            <div className="mt-4 flex items-center justify-between text-xs">
              {hasPrev ? (
                <Link
                  href={prevHref}
                  className="rounded-md border border-card-border px-3 py-1.5 font-medium text-foreground hover:border-accent/50"
                >
                  {t("episodesPagePrev")}
                </Link>
              ) : (
                <span className="rounded-md border border-card-border px-3 py-1.5 font-medium text-muted opacity-50">
                  {t("episodesPagePrev")}
                </span>
              )}
              <span className="text-muted">
                {t("episodesPageLabel", { current: currentPage, total: totalPages })}
              </span>
              {hasNext ? (
                <Link
                  href={nextHref}
                  className="rounded-md border border-card-border px-3 py-1.5 font-medium text-foreground hover:border-accent/50"
                >
                  {t("episodesPageNext")}
                </Link>
              ) : (
                <span className="rounded-md border border-card-border px-3 py-1.5 font-medium text-muted opacity-50">
                  {t("episodesPageNext")}
                </span>
              )}
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
