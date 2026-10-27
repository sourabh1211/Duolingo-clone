"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { sounds } from "@/lib/sound";
import type { Answer, AnswerResult, CompleteResult, SessionStart } from "@/lib/types";
import { useLearner } from "@/context/LearnerContext";
import { Mascot } from "@/components/ui/Mascot";
import { Button } from "@/components/ui/Button";
import { ExerciseView } from "./exercises";
import { FeedbackBar } from "./FeedbackBar";
import { LessonHeader } from "./LessonHeader";
import { LessonComplete } from "./LessonComplete";
import { OutOfHeartsModal, QuitModal } from "./LessonModals";

const REFILL_COST = 350;

type Source = { kind: "lesson"; lessonId: number } | { kind: "practice" };

/**
 * The core lesson loop.
 * - `queue` holds exercise indexes still to solve; a missed exercise goes to the back,
 *   so a lesson only ends once everything has been answered correctly.
 * - Every answer is checked by the server, which also owns hearts.
 */
export function LessonPlayer({ source }: { source: Source }) {
  const router = useRouter();
  const { me, refresh, toast } = useLearner();

  const [session, setSession] = useState<SessionStart | null>(null);
  const [loadError, setLoadError] = useState<{ status: number; message: string } | null>(null);
  const [queue, setQueue] = useState<number[]>([]);
  const [solved, setSolved] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [combo, setCombo] = useState(0);
  const [attempt, setAttempt] = useState(0); // remounts the exercise view, even for a retried item
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [quitOpen, setQuitOpen] = useState(false);
  const [outOfHearts, setOutOfHearts] = useState(false);
  const [completion, setCompletion] = useState<CompleteResult | null>(null);
  const started = useRef(false);

  const start = useCallback(async () => {
    try {
      const s = source.kind === "practice" ? await api.startPractice() : await api.startLesson(source.lessonId);
      setSession(s);
      setQueue(s.exercises.map((_, i) => i));
      setHearts(s.hearts);
    } catch (e) {
      setLoadError(e instanceof ApiError ? { status: e.status, message: e.message } : { status: 0, message: "Could not start the lesson" });
    }
  }, [source]);

  useEffect(() => {
    if (started.current) return; // guards against StrictMode's double effect in dev
    started.current = true;
    start();
  }, [start]);

  const current = session && queue.length ? session.exercises[queue[0]] : null;
  const total = session?.exercises.length ?? 1;

  const submit = useCallback(
    async (a: Answer) => {
      if (!session || !current || busy || result) return;
      setBusy(true);
      try {
        const r = await api.answer(session.session_id, current.id, a);
        (r.correct ? sounds.correct : sounds.wrong)();
        setResult(r);
        setHearts(r.hearts);
        setCombo((c) => (r.correct ? c + 1 : 0));
        if (r.correct) setSolved((n) => n + 1);
      } catch (e) {
        toast(e instanceof Error ? e.message : "Something went wrong", "error");
      } finally {
        setBusy(false);
      }
    },
    [session, current, busy, result, toast],
  );

  const finish = useCallback(async () => {
    if (!session) return;
    setBusy(true);
    try {
      setCompletion(await api.complete(session.session_id));
      refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not finish the lesson", "error");
    } finally {
      setBusy(false);
    }
  }, [session, refresh, toast]);

  const advance = useCallback(() => {
    if (!result) return;
    if (result.out_of_hearts) {
      setOutOfHearts(true);
      return;
    }
    const [head, ...rest] = queue;
    const nextQueue = result.correct ? rest : [...rest, head];
    setQueue(nextQueue);
    setResult(null);
    setAnswer(null);
    setAttempt((n) => n + 1);
    if (nextQueue.length === 0) finish();
  }, [result, queue, finish]);

  // Enter = Check / Continue
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || quitOpen || outOfHearts || completion) return;
      // Buttons in the bottom bar handle Enter natively; handling it here too would advance twice.
      if (e.target instanceof HTMLButtonElement && e.target.closest("footer")) return;
      e.preventDefault(); // stop a focused exercise tile from also reacting to Enter
      if (result) advance();
      else if (answer) submit(answer);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [result, answer, advance, submit, quitOpen, outOfHearts, completion]);

  const quit = async () => {
    if (session && !completion) await api.abandon(session.session_id).catch(() => {});
    refresh();
    router.push("/learn");
  };

  const refill = async () => {
    try {
      await api.refillHearts();
      refresh();
      toast("Hearts refilled!", "success");
      router.push("/learn");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Refill failed", "error");
    }
  };

  if (loadError) {
    const noHearts = loadError.status === 409;
    return (
      <Centered>
        <Mascot mood="sad" className="h-36 w-36" />
        <h1 className="text-2xl font-extrabold">{noHearts ? "You're out of hearts" : "This lesson isn't available"}</h1>
        <p className="max-w-sm text-muted">{noHearts ? "Refill your hearts or practice to earn one back." : loadError.message}</p>
        <div className="flex w-full max-w-xs flex-col gap-3">
          {noHearts && <Button variant="secondary" full onClick={() => router.push("/practice")}>Practice to earn hearts</Button>}
          <Button variant="ghost" full onClick={() => router.push("/learn")}>Back to learning</Button>
        </div>
      </Centered>
    );
  }

  if (!session) {
    return (
      <Centered>
        <Mascot className="h-32 w-32 animate-pulse" />
        <p className="font-extrabold uppercase tracking-wide text-muted">Loading…</p>
      </Centered>
    );
  }

  if (completion) {
    return <LessonComplete result={completion} practice={session.is_practice} onDone={() => router.push("/learn")} />;
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <LessonHeader progress={solved / total} hearts={hearts} practice={session.is_practice} onClose={() => setQuitOpen(true)} />

      <main className="mx-auto flex w-full max-w-[600px] flex-1 flex-col justify-center px-4 py-8">
        {combo >= 3 && !result && (
          <p className="mb-2 animate-pop text-sm font-extrabold uppercase tracking-wide text-orange">{combo} in a row!</p>
        )}
        {current && (
          <ExerciseView
            key={attempt}
            exercise={current}
            locked={!!result}
            status={result ? (result.correct ? "correct" : "wrong") : "idle"}
            onAnswer={setAnswer}
            onSubmit={submit}
          />
        )}
      </main>

      <FeedbackBar
        result={result}
        canCheck={!!answer}
        showSkip={current?.type !== "match_pairs"}
        busy={busy}
        onCheck={() => answer && submit(answer)}
        onSkip={() => submit({})}
        onContinue={advance}
      />

      <QuitModal open={quitOpen} onStay={() => setQuitOpen(false)} onQuit={quit} />
      <OutOfHeartsModal
        open={outOfHearts}
        gems={me?.gems ?? 0}
        refillCost={REFILL_COST}
        onRefill={refill}
        onPractice={() => router.push("/practice")}
        onQuit={quit}
      />
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">{children}</div>;
}
