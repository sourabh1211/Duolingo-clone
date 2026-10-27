"use client";

import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  /** "sheet" slides up from the bottom on mobile like the original app; "center" is a dialog. */
  variant?: "center" | "sheet";
  labelledBy?: string;
}

export function Modal({ open, onClose, children, variant = "center", labelledBy }: Props) {
  useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className={`fixed inset-0 z-50 flex animate-fade-in bg-black/50 ${
        variant === "sheet" ? "items-end sm:items-center" : "items-center"
      } justify-center sm:p-4`}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(e) => e.stopPropagation()}
        className={`w-full bg-surface p-6 text-center ${
          variant === "sheet" ? "animate-slide-up rounded-t-3xl sm:max-w-md sm:animate-pop sm:rounded-3xl" : "mx-4 max-w-md animate-pop rounded-3xl"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
