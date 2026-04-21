"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { FormEvent } from "react";

type Props = {
  defaultValue?: string;
  className?: string;
};

export function SearchForm({ defaultValue = "", className }: Props) {
  const router = useRouter();
  const t = useTranslations("Search");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const q = String(data.get("q") ?? "").trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  return (
    <form className={className} onSubmit={onSubmit}>
      <label className="relative block min-w-0 flex-1">
        <span className="sr-only">{t("label")}</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          name="q"
          type="search"
          placeholder={t("placeholder")}
          defaultValue={defaultValue}
          className="glass-panel h-10 w-full rounded-full px-3 py-2 pl-9 text-sm text-foreground placeholder:text-muted transition focus:border-accent focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent),transparent_75%)] focus:outline-none"
        />
      </label>
    </form>
  );
}
