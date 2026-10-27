"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Profile } from "@/lib/types";
import { BoltIcon, CrownIcon, FlameIcon, NavLeague } from "@/components/ui/Icons";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function ProfilePage() {
  const [p, setP] = useState<Profile | null>(null);
  useEffect(() => {
    api.profile().then(setP).catch(() => {});
  }, []);
  if (!p) return null;
  const { me } = p;
  const maxXp = Math.max(...p.last_7_days.map((d) => d.xp), 10);

  return (
    <div>
      <div className="mb-6 flex h-48 items-center justify-center rounded-2xl" style={{ background: `${me.avatar_color}33` }}>
        <span className="flex h-28 w-28 items-center justify-center rounded-full text-5xl font-black text-white" style={{ background: me.avatar_color }}>
          {me.display_name[0]}
        </span>
      </div>
      <h1 className="text-2xl font-extrabold">{me.display_name}</h1>
      <p className="text-muted">@{me.username}</p>
      <p className="mb-6 text-muted">Joined {new Date(p.joined).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</p>

      <h2 className="mb-4 text-2xl font-extrabold">Statistics</h2>
      <div className="mb-10 grid grid-cols-2 gap-4">
        <Stat icon={<FlameIcon className="h-7 w-7" />} value={me.streak} label="Day streak" />
        <Stat icon={<BoltIcon className="h-7 w-7" />} value={me.total_xp} label="Total XP" />
        <Stat icon={<NavLeague className="h-7 w-7" />} value="Bronze" label="Current league" />
        <Stat icon={<CrownIcon className="h-7 w-7" />} value={p.skills_completed} label="Skills finished" />
      </div>

      <h2 className="mb-4 text-2xl font-extrabold">This week</h2>
      <div className="mb-10 flex h-40 items-end gap-3 rounded-2xl border-2 border-line p-4">
        {p.last_7_days.map((d) => (
          <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-xs font-bold text-muted">{d.xp}</span>
            <div className="w-full rounded-t-lg bg-yellow" style={{ height: `${(d.xp / maxXp) * 80}px`, minHeight: 4 }} />
            <span className="text-xs font-bold text-muted">{new Date(`${d.day}T00:00:00`).toLocaleDateString(undefined, { weekday: "short" })}</span>
          </div>
        ))}
      </div>

      <h2 className="mb-4 text-2xl font-extrabold">Achievements</h2>
      <ul className="divide-y-2 divide-line rounded-2xl border-2 border-line">
        {p.achievements.map((a) => (
          <li key={a.key} className={`flex items-center gap-4 p-4 ${a.unlocked ? "" : "opacity-60"}`}>
            <span className={`flex h-16 w-16 items-center justify-center rounded-2xl text-4xl ${a.unlocked ? "bg-yellow/30" : "bg-line grayscale"}`}>{a.icon}</span>
            <div className="flex-1">
              <p className="text-lg font-extrabold">{a.title}</p>
              <p className="mb-2 text-muted">{a.description}</p>
              <div className="flex items-center gap-3">
                <ProgressBar value={a.progress / a.threshold} color="#ffc800" className="h-3" />
                <span className="text-sm font-bold text-muted">{a.progress}/{a.threshold}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border-2 border-line p-4">
      {icon}
      <div>
        <p className="text-xl font-extrabold">{value}</p>
        <p className="text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}
