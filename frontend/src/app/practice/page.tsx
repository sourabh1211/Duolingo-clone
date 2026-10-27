"use client";

import { LessonPlayer } from "@/components/lesson/LessonPlayer";

const PRACTICE = { kind: "practice" as const };

export default function PracticePage() {
  return <LessonPlayer source={PRACTICE} />;
}
