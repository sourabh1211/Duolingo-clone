"use client";

import { useState } from "react";
import { sounds } from "@/lib/sound";
import { speak } from "@/lib/speech";
import type { ExerciseProps } from "./types";
import { PromptTitle, SpeechBubble } from "./Prompt";
import { WordTile } from "./WordTile";

/** Build the translation by tapping words from the bank, or switch to typing. */
export function Translate({ exercise, locked, onAnswer }: ExerciseProps<"translate">) {
  const { prompt, sentence, speak: audio, bank } = exercise.payload;
  const [picked, setPicked] = useState<number[]>([]); // indexes into bank, in answer order
  const [keyboard, setKeyboard] = useState(false);
  const [typed, setTyped] = useState("");

  const update = (next: number[]) => {
    setPicked(next);
    onAnswer(next.length ? { text: next.map((i) => bank[i]).join(" ") } : null);
  };
  const add = (i: number) => {
    sounds.tap();
    if (!audio) speak(bank[i]); // speak Spanish words when building a Spanish answer
    update([...picked, i]);
  };

  return (
    <div>
      <PromptTitle>{prompt}</PromptTitle>
      <SpeechBubble text={sentence} audio={audio} />

      {keyboard ? (
        <textarea
          autoFocus
          value={typed}
          disabled={locked}
          onChange={(e) => {
            setTyped(e.target.value);
            onAnswer(e.target.value.trim() ? { text: e.target.value } : null);
          }}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
          placeholder={audio ? "Type in English" : "Type in Spanish"}
          className="h-36 w-full resize-none rounded-2xl border-2 border-line bg-line/20 p-4 text-lg outline-none focus:border-blue"
        />
      ) : (
        <>
          <div className="mb-8 flex min-h-[124px] flex-wrap content-start gap-2 border-y-2 border-line py-3 [background:repeating-linear-gradient(transparent,transparent_58px,rgb(var(--line))_58px,rgb(var(--line))_60px)]">
            {picked.map((i, pos) => (
              <WordTile key={`${i}-${pos}`} text={bank[i]} disabled={locked} onClick={() => update(picked.filter((_, p) => p !== pos))} />
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {bank.map((word, i) =>
              picked.includes(i) ? <WordTile key={i} text={word} ghost /> : <WordTile key={i} text={word} disabled={locked} onClick={() => add(i)} />,
            )}
          </div>
        </>
      )}

      <button
        className="mt-6 text-sm font-extrabold uppercase tracking-wide text-muted hover:text-blue"
        disabled={locked}
        onClick={() => {
          setKeyboard((k) => !k);
          setPicked([]);
          setTyped("");
          onAnswer(null);
        }}
      >
        {keyboard ? "Use word bank" : "Use keyboard"}
      </button>
    </div>
  );
}
