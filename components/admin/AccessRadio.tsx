"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type Props = {
  initialKind: string;
  initialExclusive: boolean;
  kindInputId?: string;
};

/**
 * Drama-level Free/Paid switch. Only meaningful for SINGLE movies; for SERIES we
 * hide the radios (each episode has its own toggle) and still submit
 * `exclusive=false` via a hidden input so the server action never ends up
 * gating a whole series.
 */
export function AccessRadio({
  initialKind,
  initialExclusive,
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

  if (kind === "SERIES") {
    return (
      <fieldset className="rounded-lg border border-card-border p-4">
        <legend className="px-1 text-sm font-medium text-foreground">
          {t("accessLabel")}
        </legend>
        <p className="mt-1 text-xs text-muted">{t("accessSeriesHint")}</p>
        <input type="hidden" name="exclusive" value="false" />
      </fieldset>
    );
  }

  return (
    <fieldset className="rounded-lg border border-card-border p-4">
      <legend className="px-1 text-sm font-medium text-foreground">
        {t("accessLabel")}
      </legend>
      <div className="mt-2 flex flex-wrap gap-4 text-sm">
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="exclusive"
            value="false"
            defaultChecked={!initialExclusive}
          />
          {t("accessFree")}
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="exclusive"
            value="true"
            defaultChecked={initialExclusive}
          />
          {t("accessPaid")}
        </label>
      </div>
    </fieldset>
  );
}
