"use client";

import { useState } from "react";
import Link from "next/link";
import { useLearner } from "@/context/LearnerContext";
import { FlameIcon, GemIcon, HeartIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { formatMinutes } from "@/lib/format";

type Panel = "course" | "streak" | "gems" | "hearts" | null;

/** Flag · streak · gems · hearts. Each opens a small panel, like the original's top bar. */
export function StatsBar() {
  const { me } = useLearner();
  const [open, setOpen] = useState<Panel>(null);
  if (!me) return <div className="h-12" />;

  const toggle = (p: Panel) => setOpen((cur) => (cur === p ? null : p));
  const item = "flex h-11 items-center gap-2 rounded-xl px-2 text-[17px] font-extrabold hover:bg-line/40";

  return (
    <div className="relative" onMouseLeave={() => setOpen(null)}>
      <div className="flex items-center justify-between gap-1">
        <button className={item} onClick={() => toggle("course")} aria-label={`Course: ${me.course?.language_name}`}>
          <span className="text-[28px] leading-none">{me.course?.flag}</span>
        </button>
        <button className={`${item} ${me.practiced_today ? "text-orange" : "text-muted"}`} onClick={() => toggle("streak")} aria-label={`${me.streak} day streak`}>
          <FlameIcon dim={!me.practiced_today} /> {me.streak}
        </button>
        <button className={`${item} text-blue`} onClick={() => toggle("gems")} aria-label={`${me.gems} gems`}>
          <GemIcon /> {me.gems}
        </button>
        <button className={`${item} text-red`} onClick={() => toggle("hearts")} aria-label={`${me.hearts} hearts`}>
          <HeartIcon /> {me.hearts}
        </button>
      </div>

      {open && (
        <div className="absolute right-0 top-14 z-40 w-[min(360px,calc(100vw-2rem))] animate-fade-in rounded-2xl border-2 border-line bg-surface p-5 shadow-sm">
          {open === "course" && (
            <div className="flex items-center gap-4">
              <span className="text-5xl">{me.course?.flag}</span>
              <div>
                <p className="text-lg font-extrabold">{me.course?.language_name}</p>
                <p className="text-muted">More courses are coming soon.</p>
              </div>
            </div>
          )}
          {open === "streak" && (
            <div>
              <div className="flex items-center gap-3">
                <FlameIcon className="h-12 w-12" dim={!me.practiced_today} />
                <div>
                  <p className="text-xl font-extrabold">{me.streak} day streak</p>
                  <p className="text-muted">
                    {me.practiced_today ? "You've extended your streak today!" : "Do a lesson today to keep your streak going."}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted">Longest streak: {me.longest_streak} days</p>
            </div>
          )}
          {open === "gems" && (
            <div className="flex items-center gap-3">
              <GemIcon className="h-12 w-12" />
              <div>
                <p className="text-xl font-extrabold">{me.gems} gems</p>
                <p className="text-muted">Spend gems on heart refills in the shop.</p>
              </div>
            </div>
          )}
          {open === "hearts" && (
            <div className="text-center">
              <div className="mb-2 flex justify-center gap-1">
                {Array.from({ length: me.max_hearts }, (_, i) => (
                  <HeartIcon key={i} className="h-8 w-8" dim={i >= me.hearts} />
                ))}
              </div>
              <p className="text-xl font-extrabold">{me.hearts === me.max_hearts ? "You have full hearts" : `Next heart in ${formatMinutes(me.next_heart_in_seconds)}`}</p>
              <p className="mb-4 text-muted">You lose a heart for every mistake.</p>
              <div className="flex flex-col gap-3">
                <Link href="/shop"><Button variant="ghost" full disabled={me.hearts === me.max_hearts}>Refill hearts</Button></Link>
                <Link href="/practice"><Button variant="ghost" full>Practice to earn hearts</Button></Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
