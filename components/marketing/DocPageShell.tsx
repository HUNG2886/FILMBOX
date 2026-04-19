import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type Props = {
  homeLabel: string;
  title: string;
  children: ReactNode;
};

export function DocPageShell({ homeLabel, title, children }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <nav className="text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent">
          {homeLabel}
        </Link>
        <span className="mx-2">/</span>
        <span className="line-clamp-2 text-foreground">{title}</span>
      </nav>
      <h1 className="mt-6 text-2xl font-bold text-foreground">{title}</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">{children}</div>
      <p className="mt-10 text-sm text-muted">
        <Link href="/" className="text-accent hover:underline">
          ← {homeLabel}
        </Link>
      </p>
    </div>
  );
}
