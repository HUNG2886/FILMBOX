import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatVipUntil, isVipActive } from "@/lib/vip";
import type { AppUser } from "@/lib/user-session";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { LogoutButton } from "./LogoutButton";

type Props = {
  user: AppUser;
  locale: string;
};

export async function AccountPanel({ user, locale }: Props) {
  const t = await getTranslations({ locale, namespace: "Account" });
  const tv = await getTranslations({ locale, namespace: "UserVip" });
  const ta = await getTranslations({ locale, namespace: "UserAuth" });

  const vipActive = isVipActive(user);
  const initial = user.email.slice(0, 1).toUpperCase();

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <section className="flex items-center gap-4 rounded-2xl border border-card-border bg-card p-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-xl font-bold text-white">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-foreground">{user.email}</p>
          {vipActive ? (
            <p className="mt-1 text-sm text-accent">
              {tv("vipBadge")} · {tv("vipUntil", { date: formatVipUntil(user.vipUntil!, locale) })}
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted">{tv("freeBadge")}</p>
          )}
        </div>
        {!vipActive && (
          <Link
            href="/account/vip"
            className="btn-primary shrink-0 rounded-full px-4 py-2 text-sm font-semibold"
          >
            {tv("upgradeBtn")}
          </Link>
        )}
      </section>

      <ChangePasswordForm />

      <div className="rounded-2xl border border-card-border bg-card p-5">
        <h2 className="mb-3 text-base font-semibold text-foreground">{t("sessionTitle")}</h2>
        <LogoutButton label={ta("signOut")} />
      </div>
    </div>
  );
}
