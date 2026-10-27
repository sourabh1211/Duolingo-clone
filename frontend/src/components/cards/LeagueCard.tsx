"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Leaderboard } from "@/lib/types";
import { useLearner } from "@/context/LearnerContext";
import { NavLeague, ShieldLockIcon } from "@/components/ui/Icons";

export function LeagueCard() {
  const { me } = useLearner();
  const [board, setBoard] = useState<Leaderboard | null>(null);
  const remaining = me ? Math.max(0, me.leaderboard_unlock_lessons - me.lessons_completed) : 0;

  useEffect(() => {
    if (me && remaining === 0) api.leaderboard().then(setBoard).catch(() => {});
  }, [me, remaining]);

  if (!me) return null;

  if (remaining > 0) {
    return (
      <section className="rounded-2xl border-2 border-line p-5">
        <h2 className="mb-4 text-lg font-extrabold">Unlock Leaderboards!</h2>
        <div className="flex items-center gap-5">
          <ShieldLockIcon className="h-14 w-14 shrink-0" />
          <p className="text-soft">
            Complete {remaining} more lesson{remaining === 1 ? "" : "s"} to start competing
          </p>
        </div>
      </section>
    );
  }

  const mine = board?.entries.find((e) => e.is_me);
  return (
    <section className="rounded-2xl border-2 border-line p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-extrabold">{board?.league ?? "Bronze"} League</h2>
        <Link href="/leaderboard" className="text-sm font-extrabold uppercase tracking-wide text-blue">View league</Link>
      </div>
      <div className="flex items-center gap-4">
        <NavLeague className="h-12 w-12 shrink-0" />
        <p className="text-soft">
          {mine ? <>You&apos;re ranked <b className="text-ink">#{mine.rank}</b> with {mine.weekly_xp} XP this week.</> : "Loading your league…"}
        </p>
      </div>
    </section>
  );
}
