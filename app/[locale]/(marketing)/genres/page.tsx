import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { genres } from "@/lib/genres";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Genres" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function GenresPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const t = await getTranslations("Genres");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">{t("description")}</p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {genres.map((g) => (
          <li key={g.id}>
            <Link
              href={`/genres/${g.id}`}
              className="flex items-center justify-between rounded-xl border border-card-border bg-card px-4 py-3 text-foreground transition hover:border-accent/40 hover:bg-card-elevated"
            >
              <span className="font-medium">{g.name}</span>
              <span className="text-xs text-muted">#{g.id}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
