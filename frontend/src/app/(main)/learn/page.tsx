"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { PathData } from "@/lib/types";
import { LearningPath } from "@/components/path/LearningPath";
import { Mascot } from "@/components/ui/Mascot";

export default function LearnPage() {
  const [data, setData] = useState<PathData | null>(null);
  useEffect(() => {
    api.path().then(setData).catch(() => {});
  }, []);
  if (!data) {
    return (
      <div className="mt-24 flex flex-col items-center gap-3">
        <Mascot className="h-28 w-28 animate-pulse" />
      </div>
    );
  }
  return <LearningPath data={data} />;
}
