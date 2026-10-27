"use client";

import { useEffect, useState } from "react";
import type { PathData } from "@/lib/types";
import { Mascot } from "@/components/ui/Mascot";
import { ChestIcon } from "@/components/ui/Icons";
import { SkillNode } from "./SkillNode";
import { UnitBanner } from "./UnitBanner";
import { offsetFor } from "./theme";

export function LearningPath({ data }: { data: PathData }) {
  const [openId, setOpenId] = useState<number | null>(null);

  // Close the popover when clicking anywhere else.
  useEffect(() => {
    const close = () => setOpenId(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  // Bring the node you should do next into view on load.
  useEffect(() => {
    document.querySelector("[data-active-node]")?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <div className="flex flex-col gap-10">
      {data.units.map((unit) => {
        const unitLocked = unit.skills.every((s) => s.state === "locked");
        // Alternate units snake in opposite directions, leaving room for the mascot.
        const dir = unit.position % 2 ? -1 : 1; // unit 1 snakes left with the mascot on the right
        return (
          <section key={unit.id} aria-label={unit.title}>
            <UnitBanner unit={unit} />
            <div className="relative mt-12 flex flex-col items-center gap-6">
              {unit.skills.map((skill, i) => (
                <div key={skill.id} className="w-full" {...(skill.state === "active" ? { "data-active-node": "" } : {})}
                  onClick={(e) => e.stopPropagation()}>
                  <SkillNode
                    skill={skill}
                    color={unit.color}
                    offset={dir * offsetFor(i)}
                    isOpen={openId === skill.id}
                    onToggle={() => setOpenId((cur) => (cur === skill.id ? null : skill.id))}
                  />
                  {/* a reward chest midway through each unit, like the original path */}
                  {i === 1 && (
                    <div className="flex justify-center py-2" style={{ transform: `translateX(${dir * (offsetFor(i) + 40)}px)` }}>
                      <ChestIcon className={`h-14 w-14 ${skill.state === "completed" ? "" : "opacity-40 grayscale"}`} />
                    </div>
                  )}
                </div>
              ))}
              <div className={`pointer-events-none absolute top-[200px] ${dir === 1 ? "left-0 sm:left-[8%]" : "right-0 sm:right-[8%]"} ${unitLocked ? "opacity-40 grayscale" : ""}`}>
                <Mascot mood={unitLocked ? "think" : "happy"} className="h-28 w-28 sm:h-36 sm:w-36" />
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
