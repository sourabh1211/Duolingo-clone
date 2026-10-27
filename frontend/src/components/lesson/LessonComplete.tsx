"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Confetti } from "@/components/ui/Confetti";
import { Mascot } from "@/components/ui/Mascot";
import { BoltIcon, FlameIcon } from "@/components/ui/Icons";
import { formatDuration } from "@/lib/format";
import { sounds } from "@/lib/sound";
import type { CompleteResult } from "@/lib/types";

type Step = "summary" | "streak" | "achievements";

/** The celebration sequence after a lesson: stats → streak extended → new badges. */
export function LessonComplete({ result, practice, onDone }: { result: CompleteResult; practice: boolean; onDone: () => void }) {
  const steps: Step[] = [
    "summary",
    ...(result.streak_extended ? (["streak"] as Step[]) : []),
    ...(result.new_achievements.length ? (["achievements"] as Step[]) : []),
  ];
  const [i, setI] = useState(0);
  const step = steps[i];
  const next = () => (i + 1 < steps.length ? setI(i + 1) : onDone());

  useEffect(() => {
    sounds.complete();
  }, [step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // A focused button already handles Enter natively; don't advance twice.
      if (e.key === "Enter" && !(e.target instanceof HTMLButtonElement)) next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const accuracyLabel = result.accuracy === 100 ? "Amazing" : result.accuracy >= 80 ? "Good" : "Committed";

  return (
    <div className="flex min-h-screen flex-col">
      {step === "summary" && <Confetti />}
      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 text-center">
        {step === "summary" && (
          <>
            <Mascot mood="cheer" className="h-44 w-44 animate-pop" />
            <h1 className="text-3xl font-extrabold text-yellow sm:text-4xl">{practice ? "Practice complete!" : "Lesson complete!"}</h1>
            <div className="flex flex-wrap justify-center gap-4">
              <StatCard label="Total XP" color="#ffc800" icon={<BoltIcon className="h-5 w-5" />} value={`${result.xp_earned}`} />
              <StatCard label={accuracyLabel} color="#58cc02" icon={<span>🎯</span>} value={`${result.accuracy}%`} />
              <StatCard label="Speedy" color="#1cb0f6" icon={<span>⏱️</span>} value={formatDuration(result.seconds)} />
            </div>
            {practice && <p className="font-bold text-red">+1 heart earned</p>}
          </>
        )}
        {step === "streak" && (
          <div className="flex animate-pop flex-col items-center">
            <FlameIcon className="h-40 w-40" />
            <p className="text-[96px] font-black leading-none text-orange">{result.streak}</p>
            <h1 className="text-3xl font-extrabold text-orange">day streak!</h1>
            <p className="mt-4 max-w-sm text-muted">Practice each day so your streak keeps growing.</p>
          </div>
        )}
        {step === "achievements" && (
          <div className="flex animate-pop flex-col items-center gap-4">
            <h1 className="text-3xl font-extrabold">Achievement unlocked!</h1>
            {result.new_achievements.map((a) => (
              <div key={a.key} className="flex w-full max-w-sm items-center gap-4 rounded-2xl border-2 border-line p-4 text-left">
                <span className="text-5xl">{a.icon}</span>
                <div>
                  <p className="text-lg font-extrabold">{a.title}</p>
                  <p className="text-muted">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <footer className="border-t-2 border-line">
        <div className="mx-auto flex max-w-[1000px] justify-end px-4 py-5 sm:py-8">
          <Button className="w-full sm:w-[150px]" onClick={next} autoFocus>Continue</Button>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: string; color: string; icon: React.ReactNode }) {
  return (
    <div className="w-[136px] rounded-2xl border-2 pt-1" style={{ borderColor: color, background: color }}>
      <p className="pb-1 text-xs font-extrabold uppercase tracking-wider text-white">{label}</p>
      <p className="flex items-center justify-center gap-2 rounded-xl bg-surface py-4 text-xl font-extrabold" style={{ color }}>
        {icon} {value}
      </p>
    </div>
  );
}
