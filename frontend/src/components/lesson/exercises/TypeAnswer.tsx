"use client";

import { useEffect, useState } from "react";
import { speak } from "@/lib/speech";
import type { ExerciseProps } from "./types";
import { PromptTitle, SpeechBubble } from "./Prompt";

export function TypeAnswer({ exercise, locked, onAnswer }: ExerciseProps<"type_answer">) {
  const { prompt, sentence, speak: audio } = exercise.payload;
  const [text, setText] = useState("");
  useEffect(() => {
    if (audio) speak(audio);
  }, [audio]);

  return (
    <div>
      <PromptTitle>{prompt}</PromptTitle>
      <SpeechBubble text={sentence} audio={audio} />
      <textarea
        autoFocus
        value={text}
        disabled={locked}
        onChange={(e) => {
          setText(e.target.value);
          onAnswer(e.target.value.trim() ? { text: e.target.value } : null);
        }}
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        placeholder="Type in English"
        className="h-36 w-full resize-none rounded-2xl border-2 border-line bg-line/20 p-4 text-lg outline-none focus:border-blue"
      />
    </div>
  );
}
