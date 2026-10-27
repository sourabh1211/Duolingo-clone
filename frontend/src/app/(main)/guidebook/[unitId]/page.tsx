"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Guidebook, GuidebookPhrase } from "@/lib/types";
import { speak } from "@/lib/speech";
import { Mascot } from "@/components/ui/Mascot";
import { ArrowLeftIcon, SpeakerIcon } from "@/components/ui/Icons";

const VOICE: Record<string, string> = { es: "es-ES" };

export default function GuidebookPage() {
  const { unitId } = useParams<{ unitId: string }>();
  const [gb, setGb] = useState<Guidebook | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.guidebook(Number(unitId)).then(setGb).catch((e) => setError(e.message));
  }, [unitId]);

  const voice = VOICE[gb?.language_code ?? "es"] ?? "es-ES";

  return (
    <div className="pb-10">
      <Link href="/learn" className="flex items-center gap-3 border-b-2 border-line pb-5 pt-2 text-xl font-bold text-muted hover:text-ink">
        <ArrowLeftIcon className="h-6 w-6" /> Back
      </Link>

      {error && <p className="mt-10 text-center font-bold text-muted">{error}</p>}

      {gb && (
        <>
          <header className="flex items-center gap-6 border-b-2 border-line py-6">
            <Mascot className="h-32 w-32 shrink-0 sm:h-40 sm:w-40" />
            <div>
              <h1 className="text-2xl font-extrabold sm:text-[28px]">{gb.unit_title} Guidebook</h1>
              <p className="mt-2 text-lg text-soft">Explore grammar tips and key phrases for this unit</p>
            </div>
          </header>

          {gb.sections.map((sec, i) => (
            <section key={i} className="pt-10">
              <p className="mb-1 font-extrabold uppercase tracking-wide text-blue">{sec.kind === "phrases" ? "Key phrases" : "Grammar tip"}</p>
              <h2 className="mb-6 text-2xl font-extrabold">{sec.title}</h2>

              {sec.kind === "phrases" ? (
                <ul className="flex flex-col gap-4 pl-2">
                  {sec.phrases.map((ph) => <PhraseBubble key={ph.text} phrase={ph} voice={voice} />)}
                </ul>
              ) : (
                <>
                  {sec.body?.split("\n\n").map((para, j) => (
                    <p key={j} className="mb-4 max-w-[60ch] text-lg leading-relaxed text-soft">{para}</p>
                  ))}
                  <div className="mt-2 overflow-hidden rounded-2xl border-2 border-line">
                    {sec.phrases.map((ph) => (
                      <div key={ph.text} className="grid grid-cols-1 gap-1 border-b-2 border-line px-4 py-3 last:border-0 sm:grid-cols-2 sm:gap-4">
                        <button onClick={() => speak(ph.text, voice)} className="flex items-center gap-3 text-left text-lg font-bold">
                          <SpeakerIcon className="h-6 w-6 shrink-0 text-blue" /> {ph.text}
                        </button>
                        <span className="pl-9 text-lg text-muted sm:pl-0">{ph.translation}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          ))}
        </>
      )}
    </div>
  );
}

/** A speech bubble: tap the speaker to hear it, hover or focus the dotted text to see the translation. */
function PhraseBubble({ phrase, voice }: { phrase: GuidebookPhrase; voice: string }) {
  return (
    <li className="relative w-fit max-w-full rounded-2xl border-2 border-line px-4 py-4">
      <span className="absolute -left-[9px] top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 border-b-2 border-l-2 border-line bg-surface" aria-hidden />
      <div className="relative flex items-center gap-3">
        <button onClick={() => speak(phrase.text, voice)} className="shrink-0 text-blue" aria-label={`Play "${phrase.text}"`}>
          <SpeakerIcon />
        </button>
        <span className="group relative">
          <span tabIndex={0} className="cursor-help text-lg font-bold underline decoration-muted decoration-dashed decoration-2 underline-offset-[7px] outline-none">
            {phrase.text}
          </span>
          <span className="pointer-events-none absolute bottom-full left-0 z-10 mb-3 hidden w-max max-w-[280px] rounded-xl border-2 border-line bg-surface px-3 py-2 text-base font-bold text-soft shadow-sm group-focus-within:block group-hover:block">
            {phrase.translation}
          </span>
        </span>
      </div>
    </li>
  );
}
