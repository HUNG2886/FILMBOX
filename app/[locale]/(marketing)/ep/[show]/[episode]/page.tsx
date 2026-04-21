import { getTranslations } from "next-intl/server";
import { Crown, Lock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getDramaByPath } from "@/lib/dramas";
import { isEpisodePaid } from "@/lib/dramas-types";
import { episodeHref, movieHref } from "@/lib/routes";
import { getUserSession } from "@/lib/user-session";
import { isVipActive } from "@/lib/vip";

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
  const { locale, show, episode } = await params;
  const parsed = parseShowParam(show);
  if (!parsed) notFound();

  const drama = await getDramaByPath(parsed.bookId, parsed.slug);
  if (!drama) notFound();

  const t = await getTranslations("Movie");
  const tp = await getTranslations("Paywall");
  const currentEpisode = Math.min(
    drama.episodes,
    Math.max(1, parseEpisodeNumber(episode)),
  );

  const user = await getUserSession();
  const vipActive = isVipActive(user);
  const gated = isEpisodePaid(drama, currentEpisode) && !vipActive;

  const ep = drama.episodesList?.find((e) => e.number === currentEpisode);
  const isSeries = drama.kind === "SERIES";
  const playbackType = ep?.playbackType ?? drama.playbackType;
  const playbackUrl = ep?.playbackUrl ?? drama.playbackUrl;

  const currentPathForRedirect = `/${locale}/ep/${show}/${episode}`;
  const loginHref = `/account/login?next=${encodeURIComponent(currentPathForRedirect)}`;

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

      <h1 className="text-brand-gradient mt-4 text-2xl font-extrabold sm:text-3xl">
        {drama.title}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {t("episodeLabel", { n: currentEpisode })}
        {ep?.title ? (
          <span className="ml-2 text-foreground">— {ep.title}</span>
        ) : null}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="glass-panel-strong cinematic-scanlines relative overflow-hidden rounded-2xl p-2 shadow-[0_30px_60px_-25px_var(--glow)]">
          <div className="relative overflow-hidden rounded-[1rem]">
          {gated ? (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 bg-background/60 p-6 text-center">
              <div className="badge-vip-soft flex h-14 w-14 items-center justify-center rounded-full">
                {user ? <Crown className="h-7 w-7" /> : <Lock className="h-7 w-7" />}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {user ? tp("vipOnlyTitle") : tp("signInRequiredTitle")}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {user ? tp("vipOnlyBody") : tp("signInRequiredBody")}
                </p>
              </div>
              {user ? (
                <Link
                  href="/account/vip"
                  className="badge-vip inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
                >
                  <Crown className="h-4 w-4" />
                  {tp("upgradeCta")}
                </Link>
              ) : (
                <Link
                  href={loginHref}
                  className="badge-vip inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
                >
                  <Lock className="h-4 w-4" />
                  {tp("signInCta")}
                </Link>
              )}
            </div>
          ) : playbackUrl ? (
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
        </div>

        <aside className="glass-panel rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-foreground">{t("episodesListTitle")}</h2>
          <p className="mt-1 text-xs text-muted">
            {isSeries ? t("perEpisodeHint") : t("singleSourceHint")}
          </p>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {Array.from({ length: pageEnd - pageStart + 1 }, (_, i) => pageStart + i).map((n) => {
              const active = n === currentEpisode;
              const item = drama.episodesList?.find((e) => e.number === n);
              const paid = isEpisodePaid(drama, n);
              const label = item?.title
                ? `${t("episodeLabel", { n })} — ${item.title}${paid ? ` · ${tp("vipOnlyTitle")}` : ""}`
                : `${t("episodeLabel", { n })}${paid ? ` · ${tp("vipOnlyTitle")}` : ""}`;
              return (
                <Link
                  key={n}
                  href={episodeHref(drama, n)}
                  aria-label={label}
                  title={label}
                  className={
                    active
                      ? "badge-vip-soft relative flex aspect-square items-center justify-center rounded-lg text-xs font-semibold text-accent shadow-[0_0_14px_var(--glow)]"
                      : "glass-panel gradient-border-hover relative flex aspect-square items-center justify-center rounded-lg text-xs font-medium text-foreground transition hover:scale-[1.04] hover:border-accent/50"
                  }
                >
                  {n}
                  {paid && (
                    <span
                      aria-hidden
                      className="badge-vip-soft absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full"
                    >
                      <Crown className="h-2.5 w-2.5" />
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {totalPages > 1 ? (
            <div className="mt-4 flex items-center justify-between text-xs">
              {hasPrev ? (
                <Link
                  href={prevHref}
                  className="chip-glass font-medium text-foreground hover:text-accent"
                >
                  {t("episodesPagePrev")}
                </Link>
              ) : (
                <span className="chip-glass font-medium text-muted opacity-50">
                  {t("episodesPagePrev")}
                </span>
              )}
              <span className="text-muted">
                {t("episodesPageLabel", { current: currentPage, total: totalPages })}
              </span>
              {hasNext ? (
                <Link
                  href={nextHref}
                  className="chip-glass font-medium text-foreground hover:text-accent"
                >
                  {t("episodesPageNext")}
                </Link>
              ) : (
                <span className="chip-glass font-medium text-muted opacity-50">
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
