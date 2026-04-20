"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type Props = {
  initialKind: string;
  initialCount: number;
  kindInputId?: string;
};

/**
 * Số tập input. For SINGLE movies the number of episodes is fixed at 1 so we
 * render a hidden input instead of the visible number field. Keeps the id
 * "episodes" so EpisodesEditor's DOM subscription still resolves.
 */
export function EpisodesCountField({
  initialKind,
  initialCount,
  kindInputId = "kind",
}: Props) {
  const t = useTranslations("Admin");
  const [kind, setKind] = useState(initialKind);

  useEffect(() => {
    const select = document.getElementById(kindInputId) as HTMLSelectElement | null;
    if (!select) return;
    const sync = () => setKind(select.value);
    sync();
    select.addEventListener("change", sync);
    return () => select.removeEventListener("change", sync);
  }, [kindInputId]);

  if (kind === "SINGLE") {
    return <input type="hidden" id="episodes" name="episodes" value="1" />;
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium" htmlFor="episodes">
        {t("fieldEpisodes")} *
      </label>
      <input
        id="episodes"
        name="episodes"
        type="number"
        min={1}
        required
        defaultValue={Math.max(1, initialCount)}
        className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
      />
    </div>
  );
}
