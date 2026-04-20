import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getDramaByPath } from "@/lib/dramas";
import { episodeHref, movieHref } from "@/lib/routes";

type Props = {
  params: Promise<{ locale: string; show: string; episode: string }>;
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

export default async function EpisodePage({ params }: Props) {
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
          <div className="mt-3 grid gap-2">
            {Array.from({ length: drama.episodes }, (_, i) => i + 1).map((n) => {
              const active = n === currentEpisode;
              const item = drama.episodesList?.find((e) => e.number === n);
              return (
                <Link
                  key={n}
                  href={episodeHref(drama, n)}
                  className={
                    active
                      ? "flex items-center gap-3 rounded-lg border border-accent bg-accent/10 px-2 py-2"
                      : "flex items-center gap-3 rounded-lg border border-card-border bg-background px-2 py-2 hover:border-accent/50"
                  }
                >
                  <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded-md border border-card-border bg-background">
                    {item?.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.title ?? t("episodeLabel", { n })}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-muted">
                        {n}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={
                        active
                          ? "text-xs font-semibold text-accent"
                          : "text-xs font-semibold text-foreground"
                      }
                    >
                      {t("episodeLabel", { n })}
                    </p>
                    {item?.title ? (
                      <p className="line-clamp-1 text-[11px] text-muted">{item.title}</p>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
