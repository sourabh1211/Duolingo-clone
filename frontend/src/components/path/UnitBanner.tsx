import Link from "next/link";
import type { Unit } from "@/lib/types";
import { ArrowLeftIcon, NotebookIcon } from "@/components/ui/Icons";
import { UNIT_THEME } from "./theme";

export function UnitBanner({ unit }: { unit: Unit }) {
  const t = UNIT_THEME[unit.color];
  return (
    <div
      className="sticky top-[66px] z-10 flex items-center justify-between gap-4 rounded-2xl px-4 py-4 text-white sm:px-5 xl:top-6"
      style={{ background: t.main, boxShadow: `0 4px 0 ${t.shadow}` }}
    >
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-[15px] font-extrabold uppercase tracking-wide opacity-80">
          <ArrowLeftIcon className="h-4 w-4" /> Section 1, {unit.title}
        </p>
        <h2 className="mt-1 text-xl font-extrabold leading-tight sm:text-[22px]">{unit.description}</h2>
      </div>
      <Link
        href={`/guidebook/${unit.id}`}
        className="flex shrink-0 items-center gap-3 rounded-2xl border-2 px-3 py-3 text-[15px] font-extrabold uppercase tracking-wide transition-transform active:translate-y-[2px] sm:px-4"
        style={{ borderColor: "rgba(0,0,0,.2)", boxShadow: "0 2px 0 rgba(0,0,0,.2)" }}
        aria-label={`${unit.title} guidebook`}
      >
        <NotebookIcon />
        <span className="hidden sm:inline">Guidebook</span>
      </Link>
    </div>
  );
}
