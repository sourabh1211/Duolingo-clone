import { Button } from "@/components/ui/Button";
import { CheckIcon, CloseIcon } from "@/components/ui/Icons";
import type { AnswerResult } from "@/lib/types";

const PRAISE = ["Nicely done!", "Amazing!", "Great job!", "Correct!", "You're on fire!"];

interface Props {
  result: AnswerResult | null;
  canCheck: boolean;
  showSkip: boolean;
  onCheck: () => void;
  onSkip: () => void;
  onContinue: () => void;
  busy: boolean;
}

/** The bottom bar: Skip/Check while answering, then the green/red result panel. */
export function FeedbackBar({ result, canCheck, showSkip, onCheck, onSkip, onContinue, busy }: Props) {
  if (!result) {
    return (
      <footer className="border-t-2 border-line">
        <div className="mx-auto flex max-w-[1000px] items-center justify-between gap-4 px-4 py-5 sm:py-8">
          {showSkip ? <Button variant="ghost" className="hidden text-muted sm:flex sm:w-[150px]" onClick={onSkip} disabled={busy}>Skip</Button> : <span />}
          <Button className="w-full sm:w-[150px]" disabled={!canCheck || busy} onClick={onCheck}>Check</Button>
        </div>
      </footer>
    );
  }

  const ok = result.correct;
  return (
    <footer className={`animate-slide-up ${ok ? "bg-green-light dark:bg-[#1f3a12]" : "bg-red-light dark:bg-[#3f1c1f]"}`} role="status">
      <div className="mx-auto flex max-w-[1000px] flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:py-8">
        <div className="flex items-center gap-4">
          <span className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white sm:flex dark:bg-white/10">
            {ok ? <CheckIcon className="h-10 w-10" color="#58cc02" /> : <span className="text-red"><CloseIcon className="h-9 w-9" /></span>}
          </span>
          <div className={ok ? "text-green-dark" : "text-red-dark"}>
            <p className="text-2xl font-extrabold">{ok ? PRAISE[Math.floor(Math.random() * PRAISE.length)] : "Correct solution:"}</p>
            {!ok && <p className="text-lg">{result.solution}</p>}
            {ok && result.note && <p className="text-lg">{result.note}</p>}
          </div>
        </div>
        <Button autoFocus variant={ok ? "primary" : "danger"} className="w-full sm:w-[150px]" onClick={onContinue}>
          {ok ? "Continue" : "Got it"}
        </Button>
      </div>
    </footer>
  );
}
