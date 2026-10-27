"use client";

import { useLearner } from "@/context/LearnerContext";
import { BoltIcon, ChestIcon, FlameIcon } from "@/components/ui/Icons";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function QuestsPage() {
  const { me } = useLearner();
  if (!me) return null;
  const quests = [
    { icon: <BoltIcon className="h-9 w-9" />, title: `Earn ${me.daily_goal_xp} XP`, value: me.xp_today, goal: me.daily_goal_xp },
    { icon: <FlameIcon className="h-9 w-9" />, title: "Extend your streak", value: me.practiced_today ? 1 : 0, goal: 1 },
    { icon: <span className="text-3xl">🎯</span>, title: "Earn 50 XP this week", value: me.weekly_xp, goal: 50 },
  ];
  return (
    <div>
      <div className="mb-8 rounded-2xl bg-purple p-6 text-white">
        <h1 className="text-2xl font-extrabold">Daily Quests</h1>
        <p className="font-bold opacity-90">Complete quests to earn rewards. Quests reset at midnight.</p>
      </div>
      <ul className="divide-y-2 divide-line rounded-2xl border-2 border-line">
        {quests.map((q) => (
          <li key={q.title} className="flex items-center gap-4 p-5">
            {q.icon}
            <div className="flex-1">
              <p className="mb-2 text-lg font-bold">{q.title}</p>
              <div className="relative">
                <ProgressBar value={q.value / q.goal} color="#ffc800" />
                <span className="absolute inset-0 text-center text-xs font-bold leading-4 text-muted">{Math.min(q.value, q.goal)} / {q.goal}</span>
              </div>
            </div>
            <ChestIcon className={`h-10 w-10 ${q.value >= q.goal ? "" : "opacity-50"}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}
