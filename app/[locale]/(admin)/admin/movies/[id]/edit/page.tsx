import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { MovieDeleteForm } from "@/components/admin/MovieDeleteForm";
import { MovieArchiveForm, MovieForm } from "@/components/admin/MovieForm";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });
  const m = await prisma.movie.findUnique({ where: { id } });
  return { title: m ? `${t("edit")}: ${m.title}` : t("editMovieTitle") };
}

export default async function EditMoviePage({ params }: Props) {
  const { id } = await params;
  const m = await prisma.movie.findUnique({
    where: { id },
    include: { episodesRel: { orderBy: { number: "asc" } } },
  });
  if (!m) notFound();

  const t = await getTranslations("Admin");

  return (
    <div className="mx-auto max-w-xl px-4">
      <h1 className="pt-8 text-xl font-bold text-foreground">
        {t("editMovieHeading")}: {m.title}
      </h1>
      <MovieForm movie={m} episodes={m.episodesRel} />
      <MovieArchiveForm movieId={m.id} />
      <MovieDeleteForm
        movieId={m.id}
        title={m.title}
        label={t("deleteForever")}
        confirmMessage={t("deleteConfirm", { title: m.title })}
      />
    </div>
  );
}
