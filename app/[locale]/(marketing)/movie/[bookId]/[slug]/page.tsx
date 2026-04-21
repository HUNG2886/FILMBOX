import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Crown, Film, Lock, PlayCircle, Tv } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getDramaByPath } from "@/lib/dramas";
import { hasPaidContent } from "@/lib/dramas-types";
import { episodeHref } from "@/lib/routes";
import { getUserSession } from "@/lib/user-session";
import { isVipActive } from "@/lib/vip";

type Props = { params: Promise<{ locale: string; bookId: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { bookId, slug, locale } = await params;
  const drama = await getDramaByPath(bookId, slug);
  const t = await getTranslations({ locale, namespace: "Movie" });
  return {
    title: drama ? `${drama.title} — FilmBox` : t("metaFallback"),
    description: drama?.synopsis?.slice(0, 160),
  };
}

export default async function MoviePage({ params }: Props) {
  const { locale, bookId, slug } = await params;
  const drama = await getDramaByPath(bookId, slug);
  if (!drama) notFound();

  const t = await getTranslations("Movie");
  const tp = await getTranslations("Paywall");

  const user = await getUserSession();
  const vipActive = isVipActive(user);
  // SINGLE-only gating at the movie level; SERIES gating is evaluated per-episode on /ep.
  const gated = drama.kind === "SINGLE" && !!drama.exclusive && !vipActive;
  const showVipBadge = hasPaidContent(drama);

  const watchPath = episodeHref(drama, 1);
  const localizedWatchPath = `/${locale}${watchPath}`;
  const loginHref = `/account/login?next=${encodeURIComponent(localizedWatchPath)}`;

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[380px] overflow-hidden sm:h-[440px]"
      >
        <Image
          src={drama.posterSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover opacity-50 blur-2xl saturate-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/75 to-background" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <nav className="text-sm text-muted">
          <Link href="/" className="hover:text-accent">
            {t("breadcrumbHome")}
          </Link>
          <span className="mx-2">/</span>
          <span className="line-clamp-1 text-foreground">{drama.title}</span>
        </nav>
        <div className="mt-8 flex flex-col gap-8 sm:flex-row">
          <div className="glass-panel gradient-border relative mx-auto aspect-[2/3] w-full max-w-[260px] shrink-0 overflow-hidden rounded-[1.75rem] p-1 shadow-[0_30px_60px_-25px_var(--glow)] sm:mx-0">
            <div className="relative h-full w-full overflow-hidden rounded-[1.5rem]">
              <Image
                src={drama.posterSrc}
                alt={drama.title}
                fill
                className="object-cover"
                sizes="260px"
                priority
              />
            </div>
            {showVipBadge && (
              <span className="badge-vip absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold">
                <Crown className="h-3 w-3" />
                VIP
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-brand-gradient text-3xl font-extrabold leading-tight sm:text-4xl">
              {drama.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="chip-glass">
                {drama.kind === "SERIES" ? (
                  <Tv className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <Film className="h-3.5 w-3.5" aria-hidden />
                )}
                {drama.kind === "SERIES"
                  ? t("kindSeriesLabel", { count: drama.episodes })
                  : t("kindSingleLabel")}
              </span>
              {drama.tag && <span className="chip-glass">{drama.tag}</span>}
              {showVipBadge && (
                <span className="chip-glass text-accent">
                  <Crown className="h-3.5 w-3.5" aria-hidden />
                  VIP
                </span>
              )}
            </div>
            <p className="mt-5 text-sm text-muted">
              <span className="font-semibold text-foreground">
                {t("actorsLabel")}:{" "}
              </span>
              {drama.tag || t("actorsUnknown")}
            </p>
            <div className="glass-panel mt-6 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-foreground">
                {t("synopsisLabel")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {drama.synopsis || t("noSynopsis")}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {gated ? (
                user ? (
                  <Link
                    href="/account/vip"
                    className="badge-vip shine-on-hover inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition"
                  >
                    <Crown className="h-4 w-4" />
                    {tp("upgradeCta")}
                  </Link>
                ) : (
                  <Link
                    href={loginHref}
                    className="badge-vip shine-on-hover inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition"
                  >
                    <Lock className="h-4 w-4" />
                    {tp("signInCta")}
                  </Link>
                )
              ) : (
                <Link
                  href={watchPath}
                  className="btn-primary shine-on-hover inline-flex items-center gap-2 rounded-full px-7 py-3 text-base font-semibold"
                >
                  <PlayCircle className="h-5 w-5" aria-hidden />
                  {t("watchNow")}
                </Link>
              )}
              {gated && (
                <p className="text-xs text-muted">{tp("gatedMovieHint")}</p>
              )}
            </div>

            <p className="mt-6 font-mono text-xs text-muted">
              {t("urlSample", { bookId, slug })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
