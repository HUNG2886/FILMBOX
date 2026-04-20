import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getDramaByPath } from "@/lib/dramas";
import { episodeHref } from "@/lib/routes";

type Props = { params: Promise<{ locale: string; bookId: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { bookId, slug, locale } = await params;
  const drama = await getDramaByPath(bookId, slug);
  const t = await getTranslations({ locale, namespace: "Movie" });
  return {
    title: drama ? `${drama.title} — DramaBox (demo)` : t("metaFallback"),
    description: drama?.synopsis?.slice(0, 160),
  };
}

export default async function MoviePage({ params }: Props) {
  const { bookId, slug } = await params;
  const drama = await getDramaByPath(bookId, slug);
  if (!drama) notFound();

  const t = await getTranslations("Movie");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav className="text-sm text-muted">
        <Link href="/" className="hover:text-accent">
          {t("breadcrumbHome")}
        </Link>
        <span className="mx-2">/</span>
        <span className="line-clamp-1 text-foreground">{drama.title}</span>
      </nav>
      <div className="mt-8 flex flex-col gap-8 sm:flex-row">
        <div className="relative mx-auto aspect-[2/3] w-full max-w-[240px] shrink-0 overflow-hidden rounded-2xl border border-card-border sm:mx-0">
          <Image src={drama.posterSrc} alt={drama.title} fill className="object-cover" sizes="240px" priority />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold text-foreground">{drama.title}</h1>
          <p className="mt-2 text-accent">{t("episodes", { count: drama.episodes })}</p>
          <p className="mt-4 text-sm text-muted">
            <span className="font-semibold text-foreground">{t("actorsLabel")}: </span>
            {drama.tag || t("actorsUnknown")}
          </p>
          <div className="mt-6 rounded-xl border border-card-border bg-card p-4">
            <h2 className="text-sm font-semibold text-foreground">{t("synopsisLabel")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {drama.synopsis || t("noSynopsis")}
            </p>
          </div>
          <div className="mt-6">
            <Link
              href={episodeHref(drama, 1)}
              className="btn-primary inline-flex rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              {t("watchNow")}
            </Link>
          </div>
          <p className="mt-6 font-mono text-xs text-muted">
            {t("urlSample", { bookId, slug })}
          </p>
        </div>
      </div>
    </div>
  );
}
