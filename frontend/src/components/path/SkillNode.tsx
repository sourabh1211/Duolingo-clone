"use client";

import { useRouter } from "next/navigation";
import type { Skill, UnitColor } from "@/lib/types";
import { BookIcon, CheckIcon, CrownIcon, DumbbellIcon, StarIcon, TrophyIcon } from "@/components/ui/Icons";
import { UNIT_THEME } from "./theme";

interface Props {
  skill: Skill;
  color: UnitColor;
  offset: number;
  isOpen: boolean;
  onToggle: () => void;
}

const ICONS = { star: StarIcon, book: BookIcon, dumbbell: DumbbellIcon, trophy: TrophyIcon };

/** One circular lesson node on the path, with its progress ring and start popover. */
export function SkillNode({ skill, color, offset, isOpen, onToggle }: Props) {
  const router = useRouter();
  const theme = UNIT_THEME[color];
  const locked = skill.state === "locked";
  const isTrophy = skill.icon === "trophy";
  const completed = skill.state === "completed";

  const fill = locked ? "rgb(var(--locked))" : isTrophy && completed ? "#ffc800" : theme.main;
  const shadow = locked ? "rgb(var(--locked-shadow))" : isTrophy && completed ? "#e5a400" : theme.shadow;
  const iconColor = locked ? "rgb(var(--locked-icon))" : "#fff";
  const Icon = completed && !isTrophy ? null : ICONS[skill.icon];
  const ring = skill.state === "active" ? skill.lessons_completed / skill.lessons_total : 0;

  const R = 46;
  const C = 2 * Math.PI * R;

  return (
    // The transform creates a stacking context, so the open node must sit above its siblings
    // or the next node on the path would cover its popover.
    <div className={`relative flex justify-center ${isOpen ? "z-20" : ""}`} style={{ transform: `translateX(${offset}px)` }}>
      <div className="relative h-[98px] w-[98px]">
        {/* progress ring (only around the node you're working on) */}
        {skill.state === "active" && (
          <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden>
            <circle cx="50" cy="50" r={R} fill="none" stroke="rgb(var(--line))" strokeWidth="8" />
            <circle
              cx="50" cy="50" r={R} fill="none" stroke={theme.main} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - ring)} className="transition-[stroke-dashoffset] duration-700"
            />
          </svg>
        )}

        {skill.state === "active" && !isOpen && (
          <div
            className="absolute -top-12 left-1/2 z-[5] animate-bob whitespace-nowrap rounded-xl border-2 border-line bg-surface px-4 py-2.5 text-[15px] font-extrabold uppercase tracking-wide"
            style={{ color: theme.main }}
          >
            {skill.lessons_completed === 0 ? "Start" : "Jump here"}
            <span className="absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-line bg-surface" />
          </div>
        )}

        <button
          onClick={onToggle}
          aria-label={`${skill.title}, ${skill.state}`}
          aria-expanded={isOpen}
          className="absolute left-1/2 top-1/2 flex h-[57px] w-[70px] -translate-x-1/2 -translate-y-[60%] items-center justify-center rounded-[50%] transition-transform active:translate-y-[-50%]"
          style={{ background: fill, boxShadow: `0 8px 0 ${shadow}` }}
        >
          {Icon ? <Icon color={iconColor} className="h-8 w-8" /> : <CheckIcon />}
        </button>

        {completed && skill.crowns > 0 && !isTrophy && (
          <span className="absolute -right-1 bottom-1 flex items-center rounded-full bg-surface px-1 text-xs font-black text-yellow-dark" title={`${skill.crowns} crown`}>
            <CrownIcon className="h-5 w-5" />
            {skill.crowns > 1 && skill.crowns}
          </span>
        )}
      </div>

      {isOpen && (
        <div
          className="absolute top-[104px] z-20 w-[300px] animate-pop rounded-2xl p-4 text-left"
          style={{ background: locked ? "rgb(var(--surface))" : theme.main, border: locked ? "2px solid rgb(var(--line))" : "none" }}
          onClick={(e) => e.stopPropagation()}
        >
          <span
            className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45"
            style={{ background: locked ? "rgb(var(--surface))" : theme.main, borderLeft: locked ? "2px solid rgb(var(--line))" : undefined, borderTop: locked ? "2px solid rgb(var(--line))" : undefined }}
          />
          <h3 className={`text-lg font-extrabold ${locked ? "text-muted" : "text-white"}`}>{skill.title}</h3>
          <p className={`mb-4 font-bold ${locked ? "text-muted" : "text-white/85"}`}>
            {locked
              ? "Complete all levels above to unlock this!"
              : completed
                ? "You finished this! Practice to keep it fresh."
                : `Lesson ${skill.lessons_completed + 1} of ${skill.lessons_total}`}
          </p>
          {locked ? (
            <button disabled className="btn w-full">Locked</button>
          ) : (
            <button
              className="btn w-full bg-white"
              style={{ color: theme.main, ["--btn-shadow" as string]: "rgba(0,0,0,.18)" }}
              onClick={() => router.push(`/lesson/${skill.next_lesson_id}`)}
            >
              {completed ? "Practice +5 XP" : "Start +10 XP"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
