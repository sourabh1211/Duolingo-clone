import type { UnitColor } from "@/lib/types";

export const UNIT_THEME: Record<UnitColor, { main: string; shadow: string }> = {
  green: { main: "#58cc02", shadow: "#58a700" },
  purple: { main: "#ce82ff", shadow: "#a568cc" },
  blue: { main: "#1cb0f6", shadow: "#1899d6" },
};

/** Horizontal offsets (px) that make the path snake left and right. */
const ZIGZAG = [0, 44, 70, 44, 0, -44, -70, -44];
export const offsetFor = (index: number) => ZIGZAG[index % ZIGZAG.length];
