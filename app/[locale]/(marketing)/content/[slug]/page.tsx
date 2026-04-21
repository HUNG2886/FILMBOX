import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { articles } from "@/lib/content-articles";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) => articles.map((a) => ({ locale, slug: a.slug })));
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params;
  const a = articles.find((x) => x.slug === slug);
  const t = await getTranslations({ locale, namespace: "Content" });
  return { title: a ? `${a.title} — FilmBox` : t("articleMetaFallback") };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) notFound();

  const t = await getTranslations("Content");

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <nav className="text-sm text-muted">
        <Link href="/content" className="hover:text-accent">
          {t("breadcrumb")}
        </Link>
        <span className="mx-2">/</span>
        <span className="line-clamp-1 text-foreground">{a.title}</span>
      </nav>
      <span className="chip-glass mt-6 !text-[10px] uppercase tracking-wide text-accent">
        {a.tag}
      </span>
      <h1 className="text-brand-gradient mt-3 text-3xl font-extrabold sm:text-4xl">
        {a.title}
      </h1>
      <p className="mt-2 text-sm text-muted">{a.date}</p>
      <div className="glass-panel mt-8 rounded-2xl p-5 sm:p-6">
        <p className="text-muted">{a.excerpt}</p>
        <p className="mt-4 text-sm leading-relaxed text-muted">{t("bodyPlaceholder")}</p>
      </div>
    </article>
  );
}
