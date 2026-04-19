import { getTranslations } from "next-intl/server";
import { DocPageShell } from "@/components/marketing/DocPageShell";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "LegalPrivacy" });
  return { title: t("metaTitle") };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "LegalPrivacy" });
  const nav = await getTranslations({ locale, namespace: "Nav" });

  return (
    <DocPageShell homeLabel={nav("home")} title={t("title")}>
      <p>{t("p1")}</p>
      <p>{t("p2")}</p>
      <p>{t("p3")}</p>
      <p>{t("p4")}</p>
      <p>{t("p5")}</p>
      <p>{t("p6")}</p>
      <p>{t("p7")}</p>
    </DocPageShell>
  );
}
