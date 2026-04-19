import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/components/admin/LoginForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });
  return { title: t("loginTitle") };
}

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ e?: string; next?: string }>;
};

export default async function AdminLoginPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  const err =
    sp.e === "missing" || sp.e === "invalid" || sp.e === "ratelimit" ? sp.e : undefined;
  const t = await getTranslations("Admin");

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-center text-2xl font-bold text-foreground">{t("loginHeading")}</h1>
      <p className="mt-2 text-center text-sm text-muted">{t("loginHint")}</p>
      <Suspense fallback={<div className="mt-8 h-40 animate-pulse rounded-2xl bg-card" />}>
        <LoginForm locale={locale} error={err} />
      </Suspense>
    </div>
  );
}
