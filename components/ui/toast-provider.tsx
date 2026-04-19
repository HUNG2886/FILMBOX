"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type ToastType = "info" | "success" | "warning";

type ToastInput = {
  title: string;
  description?: string;
  type?: ToastType;
  durationMs?: number;
};

type ToastItem = ToastInput & { id: string; type: ToastType };

type ToastContextValue = {
  toast: (input: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const toneStyles: Record<ToastType, string> = {
  info: "border-card-border bg-card text-foreground",
  success: "border-success/40 bg-card text-foreground",
  warning: "border-warning/40 bg-card text-foreground",
};

function ToastIcon({ type }: { type: ToastType }) {
  if (type === "success") return <CheckCircle2 className="h-4 w-4 text-success" />;
  if (type === "warning") return <TriangleAlert className="h-4 w-4 text-warning" />;
  return <Info className="h-4 w-4 text-accent" />;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("Toast");
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const ids = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = `t-${Date.now()}-${ids.current++}`;
      const durationMs = input.durationMs ?? 2800;

      setToasts((prev) => [
        ...prev,
        {
          ...input,
          id,
          type: input.type ?? "info",
        },
      ]);

      window.setTimeout(() => dismiss(id), durationMs);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 top-3 z-[70] flex justify-center px-3 sm:top-4"
      >
        <div className="flex w-full max-w-md flex-col gap-2">
          <AnimatePresence>
            {toasts.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "pointer-events-auto rounded-xl border px-3 py-2.5 shadow-lg backdrop-blur",
                  toneStyles[item.type],
                )}
              >
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0">
                    <ToastIcon type={item.type} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    {item.description ? (
                      <p className="mt-0.5 text-xs text-muted">{item.description}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => dismiss(item.id)}
                    className="rounded-md p-1 text-muted transition hover:bg-background hover:text-foreground"
                    aria-label={t("dismiss")}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
