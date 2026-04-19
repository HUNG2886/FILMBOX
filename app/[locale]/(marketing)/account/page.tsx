import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { DocPageShell } from "@/components/marketing/DocPageShell";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Account" });
  return { title: t("metaTitle") };
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Account" });
  const nav = await getTranslations({ locale, namespace: "Nav" });

  return (
    <DocPageShell homeLabel={nav("home")} title={t("title")}>
      <p>{t("p1")}</p>
      <p>{t("p2")}</p>
      <p>
        <Link href="/admin/login" className="text-accent hover:underline">
          {t("linkAdmin")}
        </Link>
      </p>
      <p>{t("p3")}</p>
    </DocPageShell>
  );
}
