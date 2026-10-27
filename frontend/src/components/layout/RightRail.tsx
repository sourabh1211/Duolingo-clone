import { StatsBar } from "./StatsBar";
import { DailyGoalCard } from "@/components/cards/DailyGoalCard";
import { LeagueCard } from "@/components/cards/LeagueCard";
import { SuperCard } from "@/components/cards/SuperCard";

/** The sticky right column on wide screens. */
export function RightRail() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[368px] shrink-0 flex-col gap-6 overflow-y-auto py-6 xl:flex [&>*]:shrink-0">
      <StatsBar />
      <SuperCard />
      <LeagueCard />
      <DailyGoalCard />
      <footer className="flex flex-wrap justify-center gap-x-4 gap-y-1 px-4 text-sm font-bold text-muted">
        <span>About</span><span>Blog</span><span>Store</span><span>Efficacy</span><span>Careers</span><span>Privacy</span>
      </footer>
    </aside>
  );
}
