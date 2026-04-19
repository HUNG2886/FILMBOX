import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { DramaPosterCard } from "@/components/marketing/DramaPosterCard";
import { routing } from "@/i18n/routing";
import { getAllPublishedDramas } from "@/lib/dramas";
import { genres } from "@/lib/genres";

type Props = { params: Promise<{ locale: string; id: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => genres.map((g) => ({ locale, id: g.id })));
}

export async function generateMetadata({ params }: Props) {
  const { id, locale } = await params;
  const g = genres.find((x) => x.id === id);
  const t = await getTranslations({ locale, namespace: "Genres" });
  return {
    title: g ? `${g.name} — DramaBox (demo)` : t("detailMetaFallback"),
  };
}

export default async function GenreDetailPage({ params }: Props) {
  const { id } = await params;
  const g = genres.find((x) => x.id === id);
  if (!g) notFound();

  const t = await getTranslations("Genres");
  const allDramas = await getAllPublishedDramas();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav className="text-sm text-muted">
        <Link href="/genres" className="hover:text-accent">
          {t("breadcrumb")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{g.name}</span>
      </nav>
      <h1 className="mt-4 text-2xl font-bold text-foreground">{g.name}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        {t("detailIntroBefore")}{" "}
        <code className="rounded bg-card px-1 py-0.5 text-xs">{g.replaceName}</code>
        {t("detailIntroAfter")}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {allDramas.map((drama) => (
          <DramaPosterCard key={`${drama.bookId}-${drama.slug}`} drama={drama} />
        ))}
      </div>
    </div>
  );
}
