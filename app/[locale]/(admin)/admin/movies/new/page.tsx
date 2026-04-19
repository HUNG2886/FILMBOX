import { getTranslations } from "next-intl/server";
import { MovieForm } from "@/components/admin/MovieForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });
  return { title: t("newMovieTitle") };
}

export default async function NewMoviePage() {
  const t = await getTranslations("Admin");

  return (
    <div className="mx-auto max-w-xl px-4">
      <h1 className="pt-8 text-xl font-bold text-foreground">{t("newMovieHeading")}</h1>
      <MovieForm />
    </div>
  );
}
