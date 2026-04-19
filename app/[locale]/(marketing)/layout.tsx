import { setRequestLocale } from "next-intl/server";
import { AppInstallBanner } from "@/components/marketing/AppInstallBanner";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SiteHeader } from "@/components/marketing/SiteHeader";

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-full flex-col pb-28">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <AppInstallBanner />
    </div>
  );
}
