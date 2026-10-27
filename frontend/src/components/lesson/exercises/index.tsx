import type { Answer, Exercise } from "@/lib/types";
import { FillBlank } from "./FillBlank";
import { MatchPairs } from "./MatchPairs";
import { MultipleChoice } from "./MultipleChoice";
import { Translate } from "./Translate";
import { TypeAnswer } from "./TypeAnswer";
import type { Status } from "./types";

interface Props {
  exercise: Exercise;
  locked: boolean;
  status: Status;
  onAnswer: (a: Answer | null) => void;
  onSubmit: (a: Answer) => void;
}

/** Picks the component for an exercise type. Keyed by exercise id so state resets between them. */
export function ExerciseView({ exercise, ...rest }: Props) {
  switch (exercise.type) {
    case "multiple_choice":
      return <MultipleChoice exercise={exercise} {...rest} />;
    case "translate":
      return <Translate exercise={exercise} {...rest} />;
    case "match_pairs":
      return <MatchPairs exercise={exercise} {...rest} />;
    case "fill_blank":
      return <FillBlank exercise={exercise} {...rest} />;
    case "type_answer":
      return <TypeAnswer exercise={exercise} {...rest} />;
  }
}
