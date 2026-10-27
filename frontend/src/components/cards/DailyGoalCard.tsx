"use client";

import Link from "next/link";
import { useLearner } from "@/context/LearnerContext";
import { BoltIcon, ChestIcon } from "@/components/ui/Icons";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function DailyGoalCard() {
  const { me } = useLearner();
  if (!me) return null;
  const done = Math.min(me.xp_today, me.daily_goal_xp);
  return (
    <section className="rounded-2xl border-2 border-line p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-extrabold">Daily Quests</h2>
        <Link href="/quests" className="text-sm font-extrabold uppercase tracking-wide text-blue">View all</Link>
      </div>
      <div className="flex items-center gap-4">
        <BoltIcon className="h-9 w-9 shrink-0" />
        <div className="flex-1">
          <p className="mb-2 text-[17px] font-extrabold">Earn {me.daily_goal_xp} XP</p>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <ProgressBar value={done / me.daily_goal_xp} color="#ffc800" />
              <span className="absolute inset-0 text-center text-xs font-bold leading-4 text-muted">{done} / {me.daily_goal_xp}</span>
            </div>
            <ChestIcon className="h-8 w-8 shrink-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
