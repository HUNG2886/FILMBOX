import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { UserLoginForm } from "@/components/marketing/account/UserLoginForm";
import { Link } from "@/i18n/navigation";
import { getUserSession } from "@/lib/user-session";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "UserAuth" });
  return { title: t("loginMetaTitle") };
}

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ e?: string; next?: string }>;
};

export default async function UserLoginPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;

  const existing = await getUserSession();
  if (existing) {
    redirect(`/${locale}/account`);
  }

  const err =
    sp.e === "missing" ||
    sp.e === "invalid" ||
    sp.e === "ratelimit" ||
    sp.e === "notuser"
      ? sp.e
      : undefined;
  const t = await getTranslations({ locale, namespace: "UserAuth" });

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-center text-2xl font-bold text-foreground">{t("loginHeading")}</h1>
      <p className="mt-2 text-center text-sm text-muted">{t("loginHint")}</p>
      <Suspense fallback={<div className="mt-8 h-56 animate-pulse rounded-2xl bg-card" />}>
        <UserLoginForm locale={locale} error={err} />
      </Suspense>
      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/" className="text-accent hover:underline">
          ← {t("backHome")}
        </Link>
      </p>
    </div>
  );
}
