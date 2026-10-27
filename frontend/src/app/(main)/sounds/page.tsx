"use client";

import { speak } from "@/lib/speech";
import { SpeakerIcon } from "@/components/ui/Icons";

// Spanish sounds that trip up English speakers. Static reference content (not course progress).
const GROUPS = [
  {
    title: "Vowels",
    hint: "Spanish vowels are short and never change.",
    items: [
      { sound: "a", like: "ah", example: "casa" },
      { sound: "e", like: "eh", example: "mesa" },
      { sound: "i", like: "ee", example: "niño" },
      { sound: "o", like: "oh", example: "gato" },
      { sound: "u", like: "oo", example: "uno" },
    ],
  },
  {
    title: "Consonants",
    hint: "These differ most from English.",
    items: [
      { sound: "ñ", like: "ny", example: "mañana" },
      { sound: "ll", like: "y", example: "calle" },
      { sound: "rr", like: "rolled r", example: "perro" },
      { sound: "j", like: "h", example: "hijo" },
      { sound: "h", like: "silent", example: "hola" },
      { sound: "z", like: "th / s", example: "zapato" },
    ],
  },
];

export default function SoundsPage() {
  return (
    <div className="pb-10">
      <h1 className="text-center text-2xl font-extrabold">Let&apos;s learn Spanish sounds!</h1>
      <p className="mb-8 mt-2 text-center text-lg text-soft">Tap a tile to hear it. Get your ears used to Spanish.</p>
      {GROUPS.map((g) => (
        <section key={g.title} className="mb-10">
          <h2 className="text-xl font-extrabold">{g.title}</h2>
          <p className="mb-4 text-muted">{g.hint}</p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {g.items.map((it) => (
              <button
                key={it.sound}
                onClick={() => speak(it.example)}
                className="tile tile-press flex flex-col items-center gap-1 px-2 py-4 hover:bg-line/30"
                aria-label={`${it.sound}, sounds like ${it.like}, as in ${it.example}`}
              >
                <span className="text-3xl font-extrabold">{it.sound}</span>
                <span className="text-sm font-bold text-muted">{it.like}</span>
                <span className="mt-1 flex items-center gap-1 text-sm font-bold text-blue">
                  <SpeakerIcon className="h-4 w-4" /> {it.example}
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
