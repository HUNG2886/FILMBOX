import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { AccountPanel } from "@/components/marketing/account/AccountPanel";
import { UserLoginForm } from "@/components/marketing/account/UserLoginForm";
import { Link } from "@/i18n/navigation";
import { getUserSession } from "@/lib/user-session";

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
  const user = await getUserSession();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>

      {user ? (
        <div className="mt-6">
          <AccountPanel user={user} locale={locale} />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-muted">{t("guestIntro")}</p>
          <Suspense
            fallback={<div className="mt-8 h-56 animate-pulse rounded-2xl bg-card" />}
          >
            <UserLoginForm locale={locale} />
          </Suspense>
          <p className="text-center text-sm text-muted">
            <Link href="/account/register" className="text-accent hover:underline">
              {t("goRegister")}
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
