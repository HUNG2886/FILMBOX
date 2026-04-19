import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { DramaPosterCard } from "@/components/marketing/DramaPosterCard";
import { routing } from "@/i18n/routing";
import { getChannelDramas } from "@/lib/dramas";

const SLUGS = ["must-sees", "trending", "hidden-gems"] as const;

type ChannelSlug = (typeof SLUGS)[number];

function isChannelSlug(s: string): s is ChannelSlug {
  return (SLUGS as readonly string[]).includes(s);
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => SLUGS.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "Channels" });
  if (!isChannelSlug(slug)) {
    return { title: t("metaFallback") };
  }
  const key = slug === "must-sees" ? "mustSees" : slug === "hidden-gems" ? "hiddenGems" : "trending";
  const title = t(`${key}.title`);
  return { title: `${title} — DramaBox (demo)` };
}

export default async function ChannelPage({ params }: Props) {
  const { slug } = await params;
  if (!isChannelSlug(slug)) notFound();

  const dramas = await getChannelDramas(
    slug === "must-sees" ? "must-sees" : slug === "hidden-gems" ? "hidden-gems" : "trending",
  );
  const t = await getTranslations("Channels");
  const key = slug === "must-sees" ? "mustSees" : slug === "hidden-gems" ? "hiddenGems" : "trending";
  const title = t(`${key}.title`);
  const description = t(`${key}.description`);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav className="text-sm text-muted">
        <Link href="/" className="hover:text-accent">
          {t("breadcrumbHome")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{title}</span>
      </nav>
      <h1 className="mt-4 text-2xl font-bold text-foreground">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {dramas.map((drama) => (
          <DramaPosterCard key={`${drama.bookId}-${drama.slug}`} drama={drama} />
        ))}
      </div>
    </div>
  );
}
