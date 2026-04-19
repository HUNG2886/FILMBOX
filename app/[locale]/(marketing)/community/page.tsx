import { getTranslations } from "next-intl/server";
import { DocPageShell } from "@/components/marketing/DocPageShell";
import { getSocialUrls } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Community" });
  return { title: t("metaTitle") };
}

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Community" });
  const nav = await getTranslations({ locale, namespace: "Nav" });
  const urls = getSocialUrls();

  const rows: { key: keyof typeof urls; label: string }[] = [
    { key: "facebook", label: t("facebook") },
    { key: "youtube", label: t("youtube") },
    { key: "tiktok", label: t("tiktok") },
  ];

  return (
    <DocPageShell homeLabel={nav("home")} title={t("title")}>
      <p>{t("intro")}</p>
      <ul className="space-y-3">
        {rows.map(({ key, label }) => {
          const href = urls[key];
          return (
            <li key={key} className="flex flex-wrap items-baseline gap-2">
              <span className="font-medium text-foreground">{label}</span>
              {href ? (
                <a
                  href={href}
                  className="text-accent hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {href}
                </a>
              ) : (
                <span className="text-muted">{t("notConfigured")}</span>
              )}
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-muted">{t("envHint")}</p>
    </DocPageShell>
  );
}
