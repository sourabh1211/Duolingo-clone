"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME } from "@/lib/brand";
import { useLearner } from "@/context/LearnerContext";
import { NAV_ITEMS, isActive } from "./nav";

/** Left navigation: full labels on desktop, icon-only rail on tablets, hidden on phones. */
export function Sidebar() {
  const path = usePathname();
  const { me } = useLearner();
  const initial = me?.display_name[0]?.toUpperCase() ?? "";
  return (
    <nav className="fixed inset-y-0 left-0 z-30 hidden w-[88px] flex-col border-r-2 border-line bg-surface px-3 pt-6 md:flex lg:w-[256px] lg:px-4">
      <Link href="/learn" className="mb-6 flex h-12 items-center justify-center lg:justify-start lg:px-4">
        <span className="hidden text-[32px] font-black tracking-tight text-green lg:block">{APP_NAME}</span>
        <span className="text-3xl font-black text-green lg:hidden">{APP_NAME[0]}</span>
      </Link>
      <ul className="flex flex-col gap-2">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = isActive(path, href);
          return (
            <li key={href}>
              <Link
                href={href}
                title={label}
                className={`flex h-[52px] items-center justify-center gap-5 rounded-xl border-2 px-3 text-[15px] font-extrabold uppercase tracking-[0.8px] lg:justify-start lg:px-4 ${
                  active ? "border-[#84d8ff] bg-panel text-blue dark:border-[#3f85a7]" : "border-transparent text-soft hover:bg-line/40"
                }`}
              >
                <Icon initial={initial} />
                <span className="hidden lg:inline">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
