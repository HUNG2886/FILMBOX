import { getTranslations } from "next-intl/server";
import { DocPageShell } from "@/components/marketing/DocPageShell";
import { siteEmails } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Careers" });
  return { title: t("metaTitle") };
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Careers" });
  const nav = await getTranslations({ locale, namespace: "Nav" });

  return (
    <DocPageShell homeLabel={nav("home")} title={t("title")}>
      <p>{t("p1")}</p>
      <p>
        {t("p2prefix")}{" "}
        <a href={`mailto:${siteEmails.jobs}`} className="text-accent hover:underline">
          {siteEmails.jobs}
        </a>
        {t("p2suffix")}
      </p>
      <p>{t("p3")}</p>
    </DocPageShell>
  );
}
