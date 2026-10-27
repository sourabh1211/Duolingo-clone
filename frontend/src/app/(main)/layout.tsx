"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { RightRail } from "@/components/layout/RightRail";
import { StatsBar } from "@/components/layout/StatsBar";
import { useLearner } from "@/context/LearnerContext";
import { Button } from "@/components/ui/Button";
import { BACKEND_URL } from "@/lib/api";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { error, refresh } = useLearner();
  return (
    <div className="min-h-screen">
      <Sidebar />
      {/* Phones and tablets show the stats in a top bar instead of the right column */}
      <header className="sticky top-0 z-20 border-b-2 border-line bg-surface px-4 py-2 md:ml-[88px] lg:ml-[256px] xl:hidden">
        <div className="mx-auto max-w-[600px]"><StatsBar /></div>
      </header>
      <div className="flex justify-center gap-12 px-4 pb-24 md:ml-[88px] md:px-6 lg:ml-[256px] xl:pb-6">
        <main className="w-full max-w-[600px] pt-6">
          {error ? (
            <div className="mt-20 flex flex-col items-center gap-4 text-center">
              <p className="text-xl font-extrabold">Can&apos;t reach the server</p>
              <p className="max-w-md text-soft">{error}</p>
              <p className="text-sm text-muted">
                Backend: <code className="rounded bg-line/50 px-1.5 py-0.5">{BACKEND_URL}</code>
              </p>
              <Button variant="secondary" onClick={refresh}>Try again</Button>
            </div>
          ) : (
            children
          )}
        </main>
        <RightRail />
      </div>
      <MobileNav />
    </div>
  );
}
