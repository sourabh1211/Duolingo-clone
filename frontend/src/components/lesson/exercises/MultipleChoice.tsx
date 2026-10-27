"use client";

import { useEffect, useState } from "react";
import { speak } from "@/lib/speech";
import { sounds } from "@/lib/sound";
import type { ExerciseProps } from "./types";
import { PromptTitle } from "./Prompt";

export function MultipleChoice({ exercise, locked, status, onAnswer }: ExerciseProps<"multiple_choice">) {
  const { prompt, variant, choices } = exercise.payload;
  const [selected, setSelected] = useState<number | null>(null);

  const choose = (i: number) => {
    if (locked) return;
    sounds.tap();
    setSelected(i);
    speak(choices[i].text);
    onAnswer({ index: i });
  };

  // Number keys pick an option, like the original.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= choices.length) choose(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const tone = (i: number) => {
    if (selected !== i) return "border-line hover:bg-line/30";
    if (status === "wrong") return "border-red/70 bg-red-light text-red-dark dark:bg-red/15";
    if (status === "correct") return "border-green/70 bg-green-light text-green-dark dark:bg-green/15";
    return "border-blue/70 bg-blue-light text-blue dark:bg-blue/15";
  };

  return (
    <div>
      <PromptTitle>{prompt}</PromptTitle>
      <div className={variant === "picture" ? "grid grid-cols-2 gap-3 sm:grid-cols-3" : "flex flex-col gap-3"}>
        {choices.map((c, i) => (
          <button
            key={i}
            onClick={() => choose(i)}
            disabled={locked && selected !== i}
            aria-pressed={selected === i}
            className={`tile tile-press flex ${variant === "picture" ? "flex-col justify-between p-3 sm:aspect-[3/4]" : "items-center gap-4 p-4"} text-left text-lg font-bold ${tone(i)}`}
          >
            {variant === "picture" ? (
              <>
                <span className="flex flex-1 items-center justify-center py-4 text-6xl sm:text-7xl">{c.emoji}</span>
                <span className="flex items-center justify-between">
                  <span>{c.text}</span>
                  <kbd className="hidden rounded-lg border-2 border-line px-2 text-sm text-muted sm:block">{i + 1}</kbd>
                </span>
              </>
            ) : (
              <>
                <kbd className="rounded-lg border-2 border-line px-2 text-sm text-muted">{i + 1}</kbd>
                <span>{c.text}</span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
