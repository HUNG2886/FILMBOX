"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useIsClient, useLocalStorageString } from "@/lib/client";

const STORAGE_KEY = "dramabox-demo-banner-dismissed";

export function AppInstallBanner() {
  const isClient = useIsClient();
  const stored = useLocalStorageString(STORAGE_KEY);
  const [dismissed, setDismissed] = useState(false);
  const { toast } = useToast();
  const t = useTranslations("Banner");

  const open = useMemo(() => {
    if (!isClient) return false;
    if (dismissed) return false;
    return stored !== "1";
  }, [dismissed, isClient, stored]);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
        >
          <div className="relative mx-auto flex max-w-lg items-center gap-3 rounded-2xl border border-card-border bg-card p-3 pr-10 shadow-lg sm:gap-4 sm:p-4">
            <button
              type="button"
              onClick={dismiss}
              className="absolute right-2 top-2 rounded-full p-1 text-muted transition hover:bg-background hover:text-foreground"
              aria-label={t("close")}
            >
              <X className="h-4 w-4" />
            </button>
            <div className="bg-brand-gradient flex h-12 w-12 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14">
              <span className="ml-0.5 inline-block h-0 w-0 border-y-[8px] border-l-[14px] border-y-transparent border-l-white" />
            </div>
            <p className="min-w-0 flex-1 text-sm leading-snug text-foreground">{t("body")}</p>
            <button
              type="button"
              onClick={() =>
                toast({
                  title: t("openToastTitle"),
                  description: t("openToastDesc"),
                  type: "warning",
                })
              }
              className="btn-primary shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition"
            >
              {t("openApp")}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
