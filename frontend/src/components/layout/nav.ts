import { NavHome, NavLeague, NavMore, NavProfile, NavQuests, NavShop, NavSounds } from "@/components/ui/Icons";

export const NAV_ITEMS = [
  { href: "/learn", label: "Learn", Icon: NavHome },
  { href: "/sounds", label: "Sounds", Icon: NavSounds },
  { href: "/leaderboard", label: "Leaderboards", Icon: NavLeague },
  { href: "/quests", label: "Quests", Icon: NavQuests },
  { href: "/shop", label: "Shop", Icon: NavShop },
  { href: "/profile", label: "Profile", Icon: NavProfile },
  { href: "/settings", label: "More", Icon: NavMore },
] as const;

/** The guidebook belongs to the Learn tab. */
export const isActive = (path: string, href: string) =>
  path.startsWith(href) || (href === "/learn" && path.startsWith("/guidebook"));
