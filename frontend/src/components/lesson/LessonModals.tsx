"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Mascot } from "@/components/ui/Mascot";
import { GemIcon, HeartIcon } from "@/components/ui/Icons";

export function QuitModal({ open, onStay, onQuit }: { open: boolean; onStay: () => void; onQuit: () => void }) {
  return (
    <Modal open={open} onClose={onStay} variant="sheet" labelledBy="quit-title">
      <Mascot mood="sad" className="mx-auto mb-2 h-28 w-28" />
      <h2 id="quit-title" className="mb-2 text-2xl font-extrabold">Wait, don&apos;t go!</h2>
      <p className="mb-6 text-muted">You&apos;ll lose your progress if you quit now.</p>
      <div className="flex flex-col gap-3">
        <Button variant="secondary" full onClick={onStay}>Keep learning</Button>
        <button onClick={onQuit} className="py-3 font-extrabold uppercase tracking-wide text-red">End session</button>
      </div>
    </Modal>
  );
}

interface OutProps {
  open: boolean;
  gems: number;
  refillCost: number;
  onRefill: () => void;
  onPractice: () => void;
  onQuit: () => void;
}

export function OutOfHeartsModal({ open, gems, refillCost, onRefill, onPractice, onQuit }: OutProps) {
  return (
    <Modal open={open} variant="sheet" labelledBy="hearts-title">
      <div className="mb-3 flex justify-center gap-1">
        {Array.from({ length: 5 }, (_, i) => <HeartIcon key={i} className="h-9 w-9" dim />)}
      </div>
      <h2 id="hearts-title" className="mb-2 text-2xl font-extrabold">You ran out of hearts!</h2>
      <p className="mb-6 text-muted">Refill now, or practice a finished lesson to earn a heart back.</p>
      <div className="flex flex-col gap-3">
        <Button variant="ghost" full onClick={onRefill} disabled={gems < refillCost} className="justify-between text-ink">
          <span className="flex items-center gap-2"><HeartIcon className="h-6 w-6" /> Refill hearts</span>
          <span className="flex items-center gap-1 text-blue"><GemIcon className="h-5 w-5" /> {refillCost}</span>
        </Button>
        <Button variant="secondary" full onClick={onPractice}>Practice to earn hearts</Button>
        <button onClick={onQuit} className="py-3 font-extrabold uppercase tracking-wide text-muted">No thanks</button>
      </div>
    </Modal>
  );
}
