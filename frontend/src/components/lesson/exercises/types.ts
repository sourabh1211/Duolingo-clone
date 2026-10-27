import type { Answer, Exercise } from "@/lib/types";

export type Status = "idle" | "correct" | "wrong";

export interface ExerciseProps<T extends Exercise["type"]> {
  exercise: Extract<Exercise, { type: T }>;
  /** true once the answer has been checked: inputs freeze */
  locked: boolean;
  status: Status;
  /** report the current answer (null = nothing to check yet) */
  onAnswer: (answer: Answer | null) => void;
  /** for exercises that finish themselves (match pairs) */
  onSubmit: (answer: Answer) => void;
}
