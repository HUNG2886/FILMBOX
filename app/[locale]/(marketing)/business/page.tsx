import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Business" });
  return { title: t("metaTitle") };
}

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const t = await getTranslations("Business");

  const emailLink = (chunks: ReactNode) => (
    <a href={`mailto:${String(chunks)}`} className="text-accent hover:underline">
      {chunks}
    </a>
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        {t("introBefore")}{" "}
        <code className="rounded bg-card px-1 py-0.5 text-xs">/business</code> {t("introAfter")}
      </p>
      <ul className="mt-8 list-decimal space-y-4 pl-5 text-sm text-muted">
        <li>{t.rich("item1", { email: emailLink })}</li>
        <li>{t.rich("item2", { email: emailLink })}</li>
        <li>{t.rich("item3", { email: emailLink })}</li>
      </ul>
      <p className="mt-10 text-sm text-muted">
        <Link href="/" className="text-accent hover:underline">
          {t("backHome")}
        </Link>
      </p>
    </div>
  );
}
