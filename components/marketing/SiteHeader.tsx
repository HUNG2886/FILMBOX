"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Headphones, Menu, User, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { KeyboardEvent, useId, useMemo, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SearchForm } from "./SearchForm";
import { ThemeToggle } from "./ThemeToggle";

function tabActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const menuId = useId();
  const t = useTranslations("Nav");
  const th = useTranslations("Header");

  const navTabs = useMemo(
    () =>
      [
        { id: "for-you" as const, label: t("forYou"), href: "/" },
        { id: "browse" as const, label: t("browse"), href: "/genres" },
        { id: "resources" as const, label: t("resources"), href: "/content" },
      ] as const,
    [t],
  );

  const onHeaderKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  };

  return (
    <motion.header
      className="sticky top-0 z-40 border-b border-card-border bg-background/90 backdrop-blur-md"
      onKeyDown={onHeaderKeyDown}
      initial={reduceMotion ? false : { y: -24, opacity: 0 }}
      animate={reduceMotion ? undefined : { y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 pb-3 pt-3 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div whileHover={reduceMotion ? undefined : { scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/"
              className="bg-brand-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm"
              aria-label={th("brand")}
            >
              <span className="ml-0.5 inline-block h-0 w-0 border-y-[7px] border-l-[12px] border-y-transparent border-l-white" />
            </Link>
          </motion.div>

          <SearchForm className="relative min-w-0 flex-1" />

          <motion.div whileHover={reduceMotion ? undefined : { y: -1, scale: 1.03 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/support"
              className={cn(
                "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-card-border bg-card transition sm:h-10 sm:w-10",
                tabActive(pathname, "/support") ? "text-foreground" : "text-muted hover:text-foreground",
              )}
              aria-label={th("support")}
              title={th("support")}
            >
              <Headphones className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </motion.div>
          <motion.div whileHover={reduceMotion ? undefined : { y: -1, scale: 1.03 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/account"
              className={cn(
                "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-card-border bg-card transition sm:h-10 sm:w-10",
                tabActive(pathname, "/account") ? "text-foreground" : "text-muted hover:text-foreground",
              )}
              aria-label={th("account")}
              title={th("account")}
            >
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </motion.div>

          <ThemeToggle />
          <motion.button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-card-border bg-card text-muted transition hover:text-foreground sm:hidden"
            aria-label={menuOpen ? th("closeMenu") : th("openMenu")}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((v) => !v)}
            whileTap={{ scale: 0.95 }}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </motion.button>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-card-border/80 pt-2 sm:border-0 sm:pt-0">
          <nav className="flex gap-6" aria-label={t("categories")}>
            {navTabs.map((tab) => {
              const active = tabActive(pathname, tab.href);
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={cn(
                    "relative pb-1 text-sm font-medium transition",
                    active ? "text-accent" : "text-muted hover:text-foreground",
                  )}
                >
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <LanguageSwitcher />
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id={menuId}
              initial={reduceMotion ? false : { opacity: 0, y: -6 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-card-border bg-card p-3 sm:hidden"
            >
              <ul className="space-y-1 text-sm text-foreground">
                <li>
                  <Link
                    href="/"
                    className="block rounded-lg px-2 py-1.5 transition hover:bg-background"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t("home")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/genres"
                    className="block rounded-lg px-2 py-1.5 transition hover:bg-background"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t("browseGenres")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/content"
                    className="block rounded-lg px-2 py-1.5 transition hover:bg-background"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t("articlesResources")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="block rounded-lg px-2 py-1.5 transition hover:bg-background"
                    onClick={() => setMenuOpen(false)}
                  >
                    {th("support")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account"
                    className="block rounded-lg px-2 py-1.5 transition hover:bg-background"
                    onClick={() => setMenuOpen(false)}
                  >
                    {th("account")}
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
