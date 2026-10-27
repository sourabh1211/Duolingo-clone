"use client";

import { useState } from "react";
import { sounds } from "@/lib/sound";
import { speak } from "@/lib/speech";
import type { ExerciseProps } from "./types";
import { PromptTitle } from "./Prompt";
import { WordTile } from "./WordTile";

export function FillBlank({ exercise, locked, status, onAnswer }: ExerciseProps<"fill_blank">) {
  const { prompt, before, after, choices, translation } = exercise.payload;
  const [choice, setChoice] = useState<string | null>(null);

  const pick = (c: string | null) => {
    if (locked) return;
    sounds.tap();
    if (c) speak(`${before}${c}${after}`);
    setChoice(c);
    onAnswer(c ? { choice: c } : null);
  };

  const blankTone = status === "wrong" ? "text-red-dark" : status === "correct" ? "text-green-dark" : "";

  return (
    <div>
      <PromptTitle>{prompt}</PromptTitle>
      <p className="mb-2 flex flex-wrap items-end gap-y-3 text-2xl font-semibold">
        <span className="whitespace-pre">{before}</span>
        {choice ? (
          <span className={blankTone}><WordTile text={choice} onClick={() => pick(null)} disabled={locked} /></span>
        ) : (
          <span className="mx-1 inline-block h-11 w-24 border-b-2 border-ink" aria-label="blank" />
        )}
        <span className="whitespace-pre">{after}</span>
      </p>
      <p className="mb-10 text-muted">{translation}</p>
      <div className="flex flex-wrap justify-center gap-3">
        {choices.map((c) => (choice === c ? <WordTile key={c} text={c} ghost /> : <WordTile key={c} text={c} disabled={locked} onClick={() => pick(c)} />))}
      </div>
    </div>
  );
}
