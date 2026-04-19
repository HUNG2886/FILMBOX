import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { articles } from "@/lib/content-articles";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Content" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const t = await getTranslations("Content");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        {t("introBefore")}{" "}
        <code className="rounded bg-card px-1 py-0.5 text-xs">/content/[slug]</code>
        {t("introAfter")}
      </p>
      <ul className="mt-8 space-y-4">
        {articles.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/content/${a.slug}`}
              className="block rounded-xl border border-card-border bg-card p-4 transition hover:border-accent/40"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-accent">{a.tag}</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">{a.title}</h2>
              <p className="mt-2 text-sm text-muted">{a.excerpt}</p>
              <p className="mt-2 text-xs text-muted">{a.date}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
