import { getTranslations } from "next-intl/server";
import { DocPageShell } from "@/components/marketing/DocPageShell";
import { siteEmails } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "LegalDpo" });
  return { title: t("metaTitle") };
}

export default async function DpoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "LegalDpo" });
  const nav = await getTranslations({ locale, namespace: "Nav" });

  return (
    <DocPageShell homeLabel={nav("home")} title={t("title")}>
      <p>{t("p1")}</p>
      <p>
        {t("p2prefix")}{" "}
        <a href={`mailto:${siteEmails.dpo}`} className="text-accent hover:underline">
          {siteEmails.dpo}
        </a>
        {t("p2suffix")}
      </p>
      <p>{t("p3")}</p>
      <p>{t("p4")}</p>
    </DocPageShell>
  );
}
