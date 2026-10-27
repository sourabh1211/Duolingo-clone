"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Mascot } from "@/components/ui/Mascot";
import { Modal } from "@/components/ui/Modal";

/** Upsell card for the paid tier. Subscriptions are out of scope, so it opens a "coming soon" note. */
export function SuperCard() {
  const [open, setOpen] = useState(false);
  return (
    <section className="relative rounded-2xl border-2 border-line p-5">
      <span className="inline-block -skew-x-12 rounded-md bg-gradient-to-r from-[#26ff55] via-[#1cb0f6] to-[#a560e8] px-2.5 py-0.5 text-sm font-black italic tracking-wide text-white">
        SUPER
      </span>
      <div className="flex gap-3">
        <div className="flex-1">
          <h2 className="mb-2 mt-3 text-lg font-extrabold">Try Super for free</h2>
          <p className="text-soft">No ads, unlimited hearts and practice made for you.</p>
        </div>
        <Mascot mood="cheer" className="-mt-4 h-24 w-24 shrink-0 [filter:hue-rotate(160deg)_saturate(1.4)]" />
      </div>
      <Button className="mt-5 w-full" style={{ background: "#4b4bff", ["--btn-shadow" as string]: "#3434c8" }} onClick={() => setOpen(true)}>
        Start my free week
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} variant="sheet">
        <Mascot mood="think" className="mx-auto mb-2 h-24 w-24" />
        <h3 className="mb-2 text-2xl font-extrabold">Super is coming soon</h3>
        <p className="mb-6 text-muted">Subscriptions aren&apos;t available yet. Hearts refill over time or in the shop.</p>
        <Button variant="secondary" full onClick={() => setOpen(false)}>Got it</Button>
      </Modal>
    </section>
  );
}
