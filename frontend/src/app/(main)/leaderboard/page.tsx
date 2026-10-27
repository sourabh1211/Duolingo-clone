"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Leaderboard } from "@/lib/types";
import { NavLeague, ShieldLockIcon } from "@/components/ui/Icons";
import { useLearner } from "@/context/LearnerContext";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const LEAGUES = ["#cd7f32", "#c0c0c0", "#ffc800", "#ce82ff", "#1cb0f6"];
const MEDALS = ["#ffc800", "#c0c0c0", "#cd7f32"];
const PROMOTE = 5;

export default function LeaderboardPage() {
  const { me } = useLearner();
  const [board, setBoard] = useState<Leaderboard | null>(null);
  const remaining = me ? Math.max(0, me.leaderboard_unlock_lessons - me.lessons_completed) : 0;
  useEffect(() => {
    api.leaderboard().then(setBoard).catch(() => {});
  }, []);

  if (me && remaining > 0) {
    return (
      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <ShieldLockIcon className="h-28 w-28" />
        <h1 className="text-2xl font-extrabold">Unlock Leaderboards!</h1>
        <p className="max-w-sm text-lg text-soft">
          Complete {remaining} more lesson{remaining === 1 ? "" : "s"} to start competing with other learners.
        </p>
        <Link href="/learn"><Button>Start a lesson</Button></Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-center gap-3">
        {LEAGUES.map((c, i) => (
          <svg key={c} viewBox="0 0 32 32" className={`h-12 w-12 ${i ? "opacity-30 grayscale" : ""}`} aria-hidden>
            <path d="M16 2 28 6v9c0 7-5 12-12 15C9 27 4 22 4 15V6z" fill={c} />
          </svg>
        ))}
      </div>
      <h1 className="text-center text-2xl font-extrabold">{board?.league ?? "Bronze"} League</h1>
      <p className="mb-2 text-center text-muted">Top {PROMOTE} advance to the next league</p>
      <p className="mb-6 text-center font-extrabold text-yellow-dark">{board ? `${board.days_left} days` : ""}</p>
      <div className="border-t-2 border-line pt-2">
        {board?.entries.map((e) => (
          <div key={e.user_id}>
            <div className={`flex items-center gap-4 rounded-2xl px-4 py-3 ${e.is_me ? "bg-blue-light dark:bg-blue/15" : ""}`}>
              <span className="w-7 text-center text-lg font-extrabold" style={{ color: MEDALS[e.rank - 1] ?? (e.rank <= PROMOTE ? "#58cc02" : undefined) }}>
                {e.rank}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-black text-white" style={{ background: e.avatar_color }}>
                {e.display_name[0]}
              </span>
              <span className={`flex-1 text-lg font-bold ${e.is_me ? "text-blue" : ""}`}>{e.display_name}{e.is_me && " (you)"}</span>
              <span className="font-bold text-muted">{e.weekly_xp} XP</span>
            </div>
            {e.rank === PROMOTE && (
              <p className="my-2 flex items-center justify-center gap-2 text-sm font-extrabold uppercase tracking-wide text-green">
                <NavLeague className="h-5 w-5" /> Promotion zone
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
