"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useLearner } from "@/context/LearnerContext";
import { Button } from "@/components/ui/Button";

const GOALS = [
  { xp: 10, label: "Casual" },
  { xp: 20, label: "Regular" },
  { xp: 30, label: "Serious" },
  { xp: 50, label: "Intense" },
];

export default function SettingsPage() {
  const { me, setMe, refresh, toast } = useLearner();
  const [dark, setDark] = useState(false);
  const [sound, setSound] = useState(true);
  const [name, setName] = useState("");

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setSound(localStorage.getItem("sound") !== "off");
  }, []);
  useEffect(() => {
    if (me) setName(me.display_name);
  }, [me]);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    localStorage.setItem("sound", next ? "on" : "off");
  };
  const save = async (body: { display_name?: string; daily_goal_xp?: number }) => {
    try {
      setMe(await api.updateSettings(body));
      toast("Changes saved", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not save", "error");
    }
  };
  const dev = async (fn: () => Promise<unknown>, msg: string) => {
    await fn();
    await refresh();
    toast(msg);
  };

  if (!me) return null;
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-2xl font-extrabold">Settings</h1>

      <Section title="Profile">
        <label className="mb-2 block font-bold" htmlFor="name">Name</label>
        <div className="flex gap-3">
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="flex-1 rounded-2xl border-2 border-line bg-line/20 px-4 text-lg outline-none focus:border-blue" />
          <Button variant="secondary" onClick={() => save({ display_name: name })} disabled={!name.trim() || name === me.display_name}>Save</Button>
        </div>
      </Section>

      <Section title="Daily goal">
        <div className="flex flex-col gap-2">
          {GOALS.map((g) => (
            <button
              key={g.xp}
              onClick={() => save({ daily_goal_xp: g.xp })}
              className={`tile tile-press flex justify-between p-4 text-lg font-bold ${me.daily_goal_xp === g.xp ? "border-blue/70 bg-blue-light text-blue dark:bg-blue/15" : ""}`}
            >
              <span>{g.label}</span>
              <span>{g.xp} XP per day</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Preferences">
        <Toggle label="Dark mode" on={dark} onChange={toggleDark} />
        <Toggle label="Sound effects" on={sound} onChange={toggleSound} />
      </Section>

      <Section title="Coming soon">
        {["Notifications", "Privacy settings", "Speaking exercises", "Friends", "Manage subscription"].map((s) => (
          <div key={s} className="flex justify-between border-b-2 border-line py-3 last:border-0">
            <span className="font-bold">{s}</span>
            <span className="text-sm font-bold uppercase tracking-wide text-muted">Coming soon</span>
          </div>
        ))}
      </Section>

      {me.dev_tools && (
      <Section title="Developer tools">
        <p className="mb-4 text-muted">Simulate time to test streaks and hearts.</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" onClick={() => dev(() => api.dev.advanceDay(1), "Moved forward 1 day")}>+1 day</Button>
          <Button variant="ghost" onClick={() => dev(() => api.dev.advanceDay(2), "Skipped a day. Streak lost")}>Skip a day</Button>
          <Button variant="ghost" onClick={() => dev(api.dev.emptyHearts, "Hearts emptied")}>Empty hearts</Button>
          <Button variant="danger" onClick={() => dev(api.dev.reset, "Demo data restored")}>Reset demo</Button>
        </div>
      </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-extrabold">{title}</h2>
      <div className="rounded-2xl border-2 border-line p-5">{children}</div>
    </section>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between py-2">
      <span className="text-lg font-bold">{label}</span>
      <button
        role="switch"
        aria-checked={on}
        onClick={onChange}
        className={`relative h-8 w-14 rounded-full transition-colors ${on ? "bg-blue" : "bg-line"}`}
      >
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all ${on ? "left-7" : "left-1"}`} />
      </button>
    </label>
  );
}
