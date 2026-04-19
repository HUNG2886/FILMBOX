import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });
  return { title: t("moviesTitle") };
}

export default async function AdminMoviesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const t = await getTranslations("Admin");

  const movies = await prisma.movie.findMany({
    orderBy: [{ updatedAt: "desc" }],
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-foreground">{t("moviesHeading")}</h1>
        <Link
          href="/admin/movies/new"
          className="btn-primary rounded-full px-4 py-2 text-sm font-semibold"
        >
          {t("newMovie")}
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-card-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-card-border bg-card/80 text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">{t("colTitle")}</th>
              <th className="px-3 py-2 font-medium">{t("colBookId")}</th>
              <th className="px-3 py-2 font-medium">{t("colStatus")}</th>
              <th className="px-3 py-2 font-medium">{t("colUpdated")}</th>
              <th className="px-3 py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m.id} className="border-b border-card-border/80 hover:bg-card/40">
                <td className="px-3 py-2 font-medium text-foreground">{m.title}</td>
                <td className="px-3 py-2 font-mono text-xs text-muted">{m.bookId}</td>
                <td className="px-3 py-2 text-muted">{m.status}</td>
                <td className="px-3 py-2 text-muted">
                  {m.updatedAt.toISOString().slice(0, 16).replace("T", " ")}
                </td>
                <td className="px-3 py-2 text-right">
                  <Link
                    href={`/admin/movies/${m.id}/edit`}
                    className="text-accent hover:underline"
                  >
                    {t("edit")}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {movies.length === 0 && <p className="mt-6 text-center text-sm text-muted">{t("emptyMovies")}</p>}
    </div>
  );
}
