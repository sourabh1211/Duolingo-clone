"use client";

import { useMemo } from "react";

const COLORS = ["#58cc02", "#1cb0f6", "#ff4b4b", "#ffc800", "#ce82ff", "#ff9600"];

export function Confetti({ pieces = 60 }: { pieces?: number }) {
  const bits = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2.2 + Math.random() * 1.6,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 8,
      })),
    [pieces],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {bits.map((b, i) => (
        <span
          key={i}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size * 0.45,
            background: b.color,
            animation: `confetti ${b.duration}s ${b.delay}s ease-in forwards`,
            transform: "translateY(-10vh)",
          }}
        />
      ))}
    </div>
  );
}
