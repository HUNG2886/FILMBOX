import { getTranslations } from "next-intl/server";
import { setUserVipAction } from "@/lib/admin/actions";
import { UserDeleteForm } from "@/components/admin/UserDeleteForm";
import { prisma } from "@/lib/prisma";
import { formatVipUntil, isVipActive } from "@/lib/vip";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AdminUsers" });
  return { title: t("metaTitle") };
}

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AdminUsers" });

  const users = await prisma.user.findMany({
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      email: true,
      role: true,
      vipUntil: true,
      createdAt: true,
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-foreground">{t("heading")}</h1>
        <p className="text-xs text-muted">{t("totalLabel", { count: users.length })}</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-card-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-card-border bg-card/80 text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">{t("colEmail")}</th>
              <th className="px-3 py-2 font-medium">{t("colRole")}</th>
              <th className="px-3 py-2 font-medium">{t("colVip")}</th>
              <th className="px-3 py-2 font-medium">{t("colCreated")}</th>
              <th className="px-3 py-2 font-medium">{t("colActions")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const vipActive = isVipActive(u);
              const isAdminRow = u.role === "admin";
              return (
                <tr key={u.id} className="border-b border-card-border/80 hover:bg-card/40">
                  <td className="px-3 py-2 font-medium text-foreground">{u.email}</td>
                  <td className="px-3 py-2 text-muted">
                    <span
                      className={
                        isAdminRow
                          ? "rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent"
                          : "rounded-full bg-card px-2 py-0.5 text-xs"
                      }
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-muted">
                    {vipActive ? (
                      <span className="text-accent">
                        {t("vipUntilLabel", {
                          date: formatVipUntil(u.vipUntil!, locale),
                        })}
                      </span>
                    ) : (
                      <span>{t("vipFree")}</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-muted">
                    {u.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                  </td>
                  <td className="px-3 py-2">
                    {isAdminRow ? (
                      <span className="text-xs text-muted">{t("adminProtected")}</span>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        <form action={setUserVipAction} className="flex items-center gap-1">
                          <input type="hidden" name="id" value={u.id} />
                          <select
                            name="days"
                            defaultValue="30"
                            className="rounded-md border border-card-border bg-background px-2 py-1 text-xs"
                          >
                            <option value="30">{t("vip30")}</option>
                            <option value="90">{t("vip90")}</option>
                            <option value="365">{t("vip365")}</option>
                            <option value="revoke">{t("vipRevoke")}</option>
                          </select>
                          <button
                            type="submit"
                            className="rounded-md border border-accent/40 px-2 py-1 text-xs font-medium text-accent transition hover:bg-accent/10"
                          >
                            {t("applyBtn")}
                          </button>
                        </form>
                        <UserDeleteForm
                          userId={u.id}
                          email={u.email}
                          label={t("deleteBtn")}
                          confirmMessage={t("deleteConfirm")}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <p className="mt-6 text-center text-sm text-muted">{t("empty")}</p>
      )}
    </div>
  );
}
