import type { Episode, Movie } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AccessRadio } from "@/components/admin/AccessRadio";
import { EpisodesCountField } from "@/components/admin/EpisodesCountField";
import { EpisodesEditor } from "@/components/admin/EpisodesEditor";
import { PosterUrlField } from "@/components/admin/PosterUrlField";
import { archiveMovieAction, createMovieAction, updateMovieAction } from "@/lib/admin/actions";
import { MOVIE_KINDS, normalizeMovieKind } from "@/lib/movie-kind";
import { MOVIE_STATUS } from "@/lib/movie-status";
import { PLAYBACK_TYPES } from "@/lib/playback-url";

type Props = {
  movie?: Movie;
  episodes?: Episode[];
};

export async function MovieForm({ movie, episodes = [] }: Props) {
  const t = await getTranslations("Admin");
  const action = movie ? updateMovieAction : createMovieAction;
  const m = movie;
  const initialKind = normalizeMovieKind(m?.kind);
  const initialEpisodes = episodes.map((e) => ({
    number: e.number,
    title: e.title ?? undefined,
    thumbnail: e.thumbnail ?? undefined,
    playbackType: e.playbackType ?? undefined,
    playbackUrl: e.playbackUrl ?? undefined,
    paid: e.paid,
  }));

  return (
    <form action={action} className="mx-auto max-w-xl space-y-4 py-8">
      {m && <input type="hidden" name="id" value={m.id} />}

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="title">
          {t("fieldTitle")} *
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={m?.title ?? ""}
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="kind">
          {t("fieldKind")}
        </label>
        <select
          id="kind"
          name="kind"
          defaultValue={initialKind}
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
        >
          {MOVIE_KINDS.map((k) => (
            <option key={k} value={k}>
              {t(`kind_${k.toLowerCase()}`)}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-muted">{t("kindHint")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="bookId">
            {t("fieldBookId")} *
          </label>
          <input
            id="bookId"
            name="bookId"
            required
            defaultValue={m?.bookId ?? ""}
            className="w-full rounded-lg border border-card-border bg-background px-3 py-2 font-mono text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="slug">
            {t("fieldSlug")} *
          </label>
          <input
            id="slug"
            name="slug"
            required
            defaultValue={m?.slug ?? ""}
            className="w-full rounded-lg border border-card-border bg-background px-3 py-2 font-mono text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="synopsis">
          {t("fieldSynopsis")}
        </label>
        <textarea
          id="synopsis"
          name="synopsis"
          rows={4}
          defaultValue={m?.synopsis ?? ""}
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <EpisodesCountField initialKind={initialKind} initialCount={m?.episodes ?? 1} />
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="shelfOrder">
            {t("fieldShelfOrder")}
          </label>
          <input
            id="shelfOrder"
            name="shelfOrder"
            type="number"
            defaultValue={m?.shelfOrder ?? 0}
            className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="tag">
          {t("fieldTag")}
        </label>
        <input
          id="tag"
          name="tag"
          defaultValue={m?.tag ?? ""}
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <PosterUrlField
        required
        defaultValue={m?.posterSrc ?? ""}
        label={t("fieldPoster")}
        placeholder={t("imageUrlHint")}
        hint={t("imageUrlSupportedHint")}
        previewAlt={m?.title ?? t("fieldPoster")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="playbackType">
            {t("fieldPlaybackType")}
          </label>
          <select
            id="playbackType"
            name="playbackType"
            defaultValue={m?.playbackType ?? ""}
            className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
          >
            <option value="">{t("playbackTypeNone")}</option>
            {PLAYBACK_TYPES.map((type) => (
              <option key={type} value={type}>
                {t(`playbackType_${type}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="playbackUrl">
            {t("fieldPlaybackUrl")}
          </label>
          <input
            id="playbackUrl"
            name="playbackUrl"
            defaultValue={m?.playbackUrl ?? ""}
            placeholder={t("playbackUrlHint")}
            className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <EpisodesEditor
        initialEpisodes={initialEpisodes}
        initialCount={m?.episodes ?? 1}
        initialKind={initialKind}
      />

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="status">
          {t("fieldStatus")}
        </label>
        <select
          id="status"
          name="status"
          defaultValue={m?.status ?? MOVIE_STATUS.DRAFT}
          className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
        >
          <option value={MOVIE_STATUS.DRAFT}>{t("statusDraft")}</option>
          <option value={MOVIE_STATUS.PUBLISHED}>{t("statusPublished")}</option>
          <option value={MOVIE_STATUS.ARCHIVED}>{t("statusArchived")}</option>
        </select>
      </div>

      <fieldset className="rounded-lg border border-card-border p-4">
        <legend className="px-1 text-sm font-medium text-foreground">{t("fieldShelves")}</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="showCarousel" defaultChecked={m?.showCarousel} />
            {t("shelfCarousel")}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="showRecommended" defaultChecked={m?.showRecommended} />
            {t("shelfRecommended")}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="showTrending" defaultChecked={m?.showTrending} />
            {t("shelfTrending")}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="showHidden" defaultChecked={m?.showHidden} />
            {t("shelfHidden")}
          </label>
        </div>
      </fieldset>

      <AccessRadio initialKind={initialKind} initialExclusive={!!m?.exclusive} />

      <div className="flex flex-wrap gap-3 pt-2">
        <button type="submit" className="btn-primary rounded-full px-6 py-2 text-sm font-semibold">
          {m ? t("save") : t("create")}
        </button>
        <Link
          href="/admin/movies"
          className="rounded-full border border-card-border px-6 py-2 text-sm font-medium text-muted hover:text-foreground"
        >
          {t("cancel")}
        </Link>
      </div>
    </form>
  );
}

export async function MovieArchiveForm({ movieId }: { movieId: string }) {
  const t = await getTranslations("Admin");
  return (
    <form action={archiveMovieAction} className="mx-auto max-w-xl border-t border-card-border py-6">
      <input type="hidden" name="id" value={movieId} />
      <button type="submit" className="text-sm font-medium text-warning hover:underline">
        {t("archive")}
      </button>
    </form>
  );
}
