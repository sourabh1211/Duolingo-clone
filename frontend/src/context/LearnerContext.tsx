"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import type { Me } from "@/lib/types";

type ToastKind = "info" | "success" | "error";
interface Toast {
  id: number;
  message: string;
  kind: ToastKind;
}

interface LearnerContextValue {
  me: Me | null;
  error: string | null;
  refresh: () => Promise<void>;
  setMe: (me: Me) => void;
  toast: (message: string, kind?: ToastKind) => void;
}

const LearnerContext = createContext<LearnerContextValue | null>(null);

/** Holds the logged-in learner's stats (streak, XP, hearts, gems) shared by every screen. */
export function LearnerProvider({ children }: { children: React.ReactNode }) {
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const refresh = useCallback(async () => {
    try {
      setMe(await api.me());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not reach the server");
    }
  }, []);

  useEffect(() => {
    refresh();
    // Hearts regenerate over time; poll gently so the counter stays honest.
    const t = setInterval(refresh, 60_000);
    return () => clearInterval(t);
  }, [refresh]);

  const toast = useCallback((message: string, kind: ToastKind = "info") => {
    const id = nextId.current++;
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  return (
    <LearnerContext.Provider value={{ me, error, refresh, setMe, toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-pop rounded-2xl border-2 border-b-4 px-5 py-3 font-bold shadow-sm ${
              t.kind === "error"
                ? "border-red-dark/40 bg-red-light text-red-dark"
                : t.kind === "success"
                  ? "border-green-dark/40 bg-green-light text-green-dark"
                  : "border-line bg-surface text-ink"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </LearnerContext.Provider>
  );
}

export function useLearner() {
  const ctx = useContext(LearnerContext);
  if (!ctx) throw new Error("useLearner must be used inside LearnerProvider");
  return ctx;
}
