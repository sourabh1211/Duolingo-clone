"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLearner } from "@/context/LearnerContext";
import { NAV_ITEMS, isActive } from "./nav";

export function MobileNav() {
  const path = usePathname();
  const { me } = useLearner();
  const initial = me?.display_name[0]?.toUpperCase() ?? "";
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-[68px] items-center justify-around border-t-2 border-line bg-surface md:hidden">
      {NAV_ITEMS.map(({ href, label, Icon }) => {
        const active = isActive(path, href);
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 ${active ? "border-[#84d8ff] bg-panel dark:border-[#3f85a7]" : "border-transparent"}`}
          >
            <Icon initial={initial} />
          </Link>
        );
      })}
    </nav>
  );
}
