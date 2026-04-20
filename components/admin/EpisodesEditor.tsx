"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { PLAYBACK_TYPES } from "@/lib/playback-url";

type InitialEpisode = {
  number: number;
  title?: string;
  thumbnail?: string;
  playbackType?: string;
  playbackUrl?: string;
  paid?: boolean;
};

type Props = {
  initialEpisodes: InitialEpisode[];
  initialCount: number;
  initialKind: string;
  episodesInputId?: string;
  kindInputId?: string;
};

export function EpisodesEditor({
  initialEpisodes,
  initialCount,
  initialKind,
  episodesInputId = "episodes",
  kindInputId = "kind",
}: Props) {
  const t = useTranslations("Admin");
  const [count, setCount] = useState(Math.max(1, initialCount));
  const [kind, setKind] = useState(initialKind);

  useEffect(() => {
    const select = document.getElementById(kindInputId) as HTMLSelectElement | null;
    if (!select) return;
    const sync = () => setKind(select.value);
    sync();
    select.addEventListener("change", sync);
    return () => select.removeEventListener("change", sync);
  }, [kindInputId]);

  const initialByNumber = useMemo(() => {
    const map = new Map<number, InitialEpisode>();
    for (const ep of initialEpisodes) map.set(ep.number, ep);
    return map;
  }, [initialEpisodes]);

  useEffect(() => {
    const input = document.getElementById(episodesInputId) as HTMLInputElement | null;
    if (!input) return;

    const sync = () => {
      const parsed = Number.parseInt(input.value, 10);
      if (Number.isFinite(parsed) && parsed > 0) {
        setCount(Math.min(500, Math.max(1, parsed)));
      }
    };
    sync();
    input.addEventListener("input", sync);
    input.addEventListener("change", sync);
    return () => {
      input.removeEventListener("input", sync);
      input.removeEventListener("change", sync);
    };
  }, [episodesInputId]);

  const rows = Array.from({ length: count }, (_, i) => i + 1);

  if (kind !== "SERIES") {
    return null;
  }

  return (
    <fieldset className="rounded-lg border border-card-border p-4">
      <legend className="px-1 text-sm font-medium text-foreground">
        {t("episodesEditorTitle")}
      </legend>
      <p className="mt-1 text-xs text-muted">{t("episodesEditorHint")}</p>
      <div className="mt-3 space-y-4">
        {rows.map((n) => {
          const init = initialByNumber.get(n);
          return (
            <EpisodeRow
              key={n}
              number={n}
              initial={init}
              labels={{
                number: t("episodeNumberLabel", { n }),
                title: t("fieldEpisodeTitle"),
                thumbnail: t("fieldEpisodeThumbnail"),
                playbackType: t("fieldPlaybackType"),
                playbackUrl: t("fieldPlaybackUrl"),
                playbackNone: t("playbackTypeNone"),
              urlHint: t("playbackUrlHint"),
              thumbnailHint: t("imageUrlHint"),
              thumbnailAlt: t("episodeThumbnailAlt", { n }),
                access: t("episodeAccessLabel"),
                free: t("episodeFree"),
                paid: t("episodePaid"),
              }}
            />
          );
        })}
      </div>
    </fieldset>
  );
}

type RowLabels = {
  number: string;
  title: string;
  thumbnail: string;
  playbackType: string;
  playbackUrl: string;
  playbackNone: string;
  urlHint: string;
  thumbnailHint: string;
  thumbnailAlt: string;
  access: string;
  free: string;
  paid: string;
};

function EpisodeRow({
  number,
  initial,
  labels,
}: {
  number: number;
  initial?: InitialEpisode;
  labels: RowLabels;
}) {
  const t = useTranslations("Admin");
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail ?? "");

  return (
    <div className="rounded-lg border border-card-border bg-background/50 p-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">{labels.number}</h4>
        {thumbnail ? (
          <div className="relative h-10 w-16 overflow-hidden rounded-md border border-card-border">
            <Image
              src={thumbnail}
              alt={labels.thumbnailAlt}
              fill
              sizes="64px"
              className="object-cover"
              unoptimized
            />
          </div>
        ) : null}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label
            className="mb-1 block text-xs font-medium text-muted"
            htmlFor={`ep_${number}_title`}
          >
            {labels.title}
          </label>
          <input
            id={`ep_${number}_title`}
            name={`ep_${number}_title`}
            defaultValue={initial?.title ?? ""}
            className="w-full rounded-md border border-card-border bg-background px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label
            className="mb-1 block text-xs font-medium text-muted"
            htmlFor={`ep_${number}_thumbnail`}
          >
            {labels.thumbnail}
          </label>
          <input
            id={`ep_${number}_thumbnail`}
            name={`ep_${number}_thumbnail`}
            defaultValue={initial?.thumbnail ?? ""}
            placeholder={labels.thumbnailHint}
            onChange={(e) => setThumbnail(e.currentTarget.value.trim())}
            className="w-full rounded-md border border-card-border bg-background px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label
            className="mb-1 block text-xs font-medium text-muted"
            htmlFor={`ep_${number}_playbackType`}
          >
            {labels.playbackType}
          </label>
          <select
            id={`ep_${number}_playbackType`}
            name={`ep_${number}_playbackType`}
            defaultValue={initial?.playbackType ?? ""}
            className="w-full rounded-md border border-card-border bg-background px-2 py-1.5 text-sm"
          >
            <option value="">{labels.playbackNone}</option>
            {PLAYBACK_TYPES.map((type) => (
              <option key={type} value={type}>
                {t(`playbackType_${type}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            className="mb-1 block text-xs font-medium text-muted"
            htmlFor={`ep_${number}_playbackUrl`}
          >
            {labels.playbackUrl}
          </label>
          <input
            id={`ep_${number}_playbackUrl`}
            name={`ep_${number}_playbackUrl`}
            defaultValue={initial?.playbackUrl ?? ""}
            placeholder={labels.urlHint}
            className="w-full rounded-md border border-card-border bg-background px-2 py-1.5 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <fieldset className="flex flex-wrap items-center gap-4 text-xs">
            <legend className="mr-2 text-muted">{labels.access}</legend>
            <label className="inline-flex items-center gap-1.5 text-foreground">
              <input
                type="radio"
                name={`ep_${number}_paid`}
                value="false"
                defaultChecked={!initial?.paid}
              />
              {labels.free}
            </label>
            <label className="inline-flex items-center gap-1.5 text-foreground">
              <input
                type="radio"
                name={`ep_${number}_paid`}
                value="true"
                defaultChecked={!!initial?.paid}
              />
              {labels.paid}
            </label>
          </fieldset>
        </div>
      </div>
    </div>
  );
}
