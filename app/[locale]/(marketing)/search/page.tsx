import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { DramaPosterCard } from "@/components/marketing/DramaPosterCard";
import { SearchForm } from "@/components/marketing/SearchForm";
import { searchPublishedDramas } from "@/lib/dramas";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SearchPage" });
  return { title: t("metaTitle") };
}

export default async function SearchPage({ searchParams, params }: Props) {
  const { q = "" } = await searchParams;
  await params;
  const t = await getTranslations("SearchPage");
  const results = await searchPublishedDramas(q);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
      <p className="mt-2 text-sm text-muted">
        {t("introBefore")}{" "}
        <code className="rounded bg-card px-1 py-0.5 text-xs">/search?q=...</code> {t("introAfter")}
      </p>
      <div className="mt-6 max-w-xl">
        <SearchForm defaultValue={q} />
      </div>
      <h2 className="mt-10 text-sm font-semibold text-muted">
        {q.trim() ? t("results", { count: results.length }) : t("suggestions")}
      </h2>
      <div className="mt-4 flex flex-wrap gap-3">
        {results.length === 0 ? (
          <p className="text-sm text-muted">{t("empty")}</p>
        ) : (
          results.map((drama) => (
            <DramaPosterCard key={`${drama.bookId}-${drama.slug}`} drama={drama} />
          ))
        )}
      </div>
      <p className="mt-10 text-sm text-muted">
        {t("moreGenres")}{" "}
        <Link href="/genres" className="text-accent hover:underline">
          {t("moreGenresLink")}
        </Link>
      </p>
    </div>
  );
}
