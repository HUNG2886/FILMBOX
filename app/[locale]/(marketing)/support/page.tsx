import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { DocPageShell } from "@/components/marketing/DocPageShell";
import { siteEmails } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Support" });
  return { title: t("metaTitle") };
}

export default async function SupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Support" });
  const nav = await getTranslations({ locale, namespace: "Nav" });

  return (
    <DocPageShell homeLabel={nav("home")} title={t("title")}>
      <p>{t("p1")}</p>
      <p>
        {t("p2prefix")}{" "}
        <a href={`mailto:${siteEmails.feedback}`} className="text-accent hover:underline">
          {siteEmails.feedback}
        </a>
        {t("p2suffix")}
      </p>
      <p>{t("p3")}</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <Link href="/content" className="text-accent hover:underline">
            {t("linkResources")}
          </Link>
        </li>
        <li>
          <Link href="/business" className="text-accent hover:underline">
            {t("linkBusiness")}
          </Link>
        </li>
      </ul>
    </DocPageShell>
  );
}
