"use client";

import { useState } from "react";
import { sounds } from "@/lib/sound";
import { speak } from "@/lib/speech";
import type { ExerciseProps } from "./types";
import { PromptTitle } from "./Prompt";

type Side = "left" | "right";

/** Tap a word in each column; matched pairs grey out. Finishes itself when all are matched. */
export function MatchPairs({ exercise, onSubmit }: ExerciseProps<"match_pairs">) {
  const { prompt, left, right } = exercise.payload;
  const [sel, setSel] = useState<{ side: Side; key: string } | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [flash, setFlash] = useState<{ keys: [string, string]; ok: boolean } | null>(null);

  const tap = (side: Side, key: string, text: string) => {
    if (matched.includes(key) || flash) return;
    if (side === "left") speak(text);
    if (!sel || sel.side === side) {
      sounds.tap();
      setSel({ side, key });
      return;
    }
    const ok = sel.key === key;
    const pair: [string, string] = side === "left" ? [key, sel.key] : [sel.key, key];
    setFlash({ keys: pair, ok });
    setSel(null);
    (ok ? sounds.correct : sounds.wrong)();
    setTimeout(() => {
      setFlash(null);
      if (ok) {
        const next = [...matched, key];
        setMatched(next);
        if (next.length === left.length) onSubmit({ pairs: left.map((l) => [l.key, l.key]) });
      }
    }, 450);
  };

  const cls = (side: Side, key: string) => {
    const k = `${side}:${key}`;
    if (matched.includes(key)) return "border-line text-line pointer-events-none";
    if (flash) {
      const [l, r] = flash.keys;
      if (k === `left:${l}` || k === `right:${r}`)
        return flash.ok ? "border-green/70 bg-green-light text-green-dark" : "animate-shake border-red/70 bg-red-light text-red-dark";
    }
    if (sel && sel.side === side && sel.key === key) return "border-blue/70 bg-blue-light text-blue dark:bg-blue/15";
    return "border-line hover:bg-line/30";
  };

  const column = (side: Side, items: { key: string; text: string }[]) => (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <button key={item.key} onClick={() => tap(side, item.key, item.text)} className={`tile tile-press p-4 text-center text-lg font-bold ${cls(side, item.key)}`}>
          {item.text}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <PromptTitle>{prompt}</PromptTitle>
      <div className="grid grid-cols-2 gap-4">
        {column("left", left)}
        {column("right", right)}
      </div>
    </div>
  );
}
