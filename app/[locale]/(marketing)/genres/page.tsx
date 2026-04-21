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
      <h1 className="text-brand-gradient text-3xl font-extrabold sm:text-4xl">{t("title")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">{t("description")}</p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {genres.map((g) => (
          <li key={g.id}>
            <Link
              href={`/genres/${g.id}`}
              className="glass-panel gradient-border-hover flex items-center justify-between rounded-2xl px-4 py-3 text-foreground transition hover:-translate-y-0.5 hover:border-accent/40"
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
