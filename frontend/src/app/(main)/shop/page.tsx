"use client";

import { api } from "@/lib/api";
import { useLearner } from "@/context/LearnerContext";
import { Button } from "@/components/ui/Button";
import { GemIcon, HeartIcon } from "@/components/ui/Icons";
import Link from "next/link";

export default function ShopPage() {
  const { me, refresh, toast } = useLearner();
  if (!me) return null;
  const full = me.hearts >= me.max_hearts;

  const refill = async () => {
    try {
      await api.refillHearts();
      await refresh();
      toast("Hearts refilled!", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Refill failed", "error");
    }
  };

  return (
    <div>
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-purple to-blue p-6 text-white">
        <p className="text-sm font-extrabold uppercase tracking-wider opacity-80">Super</p>
        <h1 className="text-2xl font-extrabold">Unlimited hearts, no ads</h1>
        <p className="mb-4 font-bold opacity-90">Subscriptions are coming soon.</p>
        <Button variant="white" disabled>Coming soon</Button>
      </div>

      <h2 className="mb-4 text-2xl font-extrabold">Hearts</h2>
      <div className="divide-y-2 divide-line border-y-2 border-line">
        <Row
          icon={<HeartIcon className="h-14 w-14" />}
          title="Refill hearts"
          text={full ? "You have full hearts." : "Get full hearts so you can keep learning."}
          action={
            <Button variant="ghost" disabled={full || me.gems < 350} onClick={refill} className="min-w-[120px]">
              <GemIcon className="h-5 w-5" /> 350
            </Button>
          }
        />
        <Row
          icon={<span className="text-5xl">🏋️</span>}
          title="Practice to earn hearts"
          text="Redo a finished lesson to earn a heart. Mistakes there are free."
          action={<Link href="/practice"><Button variant="ghost" className="min-w-[120px]">Practice</Button></Link>}
        />
      </div>

      <h2 className="mb-4 mt-10 text-2xl font-extrabold">Power-ups</h2>
      <div className="divide-y-2 divide-line border-y-2 border-line">
        <Row icon={<span className="text-5xl">🧊</span>} title="Streak Freeze" text="Keeps your streak if you miss a day." action={<Button variant="ghost" disabled className="min-w-[120px]">Soon</Button>} />
        <Row icon={<span className="text-5xl">⚡</span>} title="Double or nothing" text="Double your gems with a 7 day streak." action={<Button variant="ghost" disabled className="min-w-[120px]">Soon</Button>} />
      </div>
    </div>
  );
}

function Row({ icon, title, text, action }: { icon: React.ReactNode; title: string; text: string; action: React.ReactNode }) {
  return (
    <div className="flex items-center gap-5 py-6">
      <div className="flex w-16 justify-center">{icon}</div>
      <div className="flex-1">
        <p className="text-lg font-extrabold">{title}</p>
        <p className="text-muted">{text}</p>
      </div>
      {action}
    </div>
  );
}
