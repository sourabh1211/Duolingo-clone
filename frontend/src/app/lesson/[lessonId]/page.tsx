"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const source = useMemo(() => ({ kind: "lesson" as const, lessonId: Number(lessonId) }), [lessonId]);
  return <LessonPlayer source={source} />;
}
