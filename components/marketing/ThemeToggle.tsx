"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { useIsClient } from "@/lib/client";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsClient();
  const { toast } = useToast();
  const t = useTranslations("Theme");

  if (!mounted) {
    return (
      <span
        className="inline-flex h-9 w-9 shrink-0 rounded-full border border-card-border bg-card"
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      type="button"
      onClick={() => {
        const nextTheme = isDark ? "light" : "dark";
        setTheme(nextTheme);
        toast({
          title: nextTheme === "dark" ? t("darkOn") : t("lightOn"),
          type: "success",
          durationMs: 1800,
        });
      }}
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-card-border bg-card text-foreground transition hover:border-accent/50 hover:text-accent",
      )}
      aria-label={isDark ? t("toLight") : t("toDark")}
      aria-pressed={isDark}
      whileTap={{ scale: 0.93 }}
      whileHover={{ y: -1, scale: 1.03 }}
    >
      <motion.span
        key={isDark ? "sun" : "moon"}
        initial={{ rotate: -20, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </motion.span>
    </motion.button>
  );
}
