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
      <h1 className="text-brand-gradient mt-6 text-3xl font-extrabold sm:text-4xl">
        {title}
      </h1>
      <div className="glass-panel mt-6 space-y-4 rounded-2xl p-5 text-sm leading-relaxed text-muted sm:p-6">
        {children}
      </div>
      <p className="mt-10 text-sm text-muted">
        <Link href="/" className="text-accent hover:underline">
          ← {homeLabel}
        </Link>
      </p>
    </div>
  );
}
