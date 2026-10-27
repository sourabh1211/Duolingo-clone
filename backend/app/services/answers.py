"""Answer checking for every exercise type.

Exercise shapes (payload = sent to client, solution = server only):

multiple_choice  payload {prompt, choices: [{text, emoji}], speak?}   solution {index, text}
translate        payload {prompt, sentence, bank: [str], target_lang}  solution {answers: [str]}
match_pairs      payload {prompt, left: [{key, text}], right: [{key, text}]}
                 (keys pair up; the client needs them for per-tap feedback) solution {}
fill_blank       payload {prompt, before, after, choices: [str], translation} solution {answer}
type_answer      payload {prompt, sentence, target_lang}               solution {answers: [str]}

Learner answers:
multiple_choice {index: int} | translate/type_answer {text: str}
match_pairs {pairs: [[leftKey, rightKey], ...]} | fill_blank {choice: str}
"""
import re
import unicodedata
from dataclasses import dataclass

from ..models import Exercise

_PUNCTUATION = re.compile(r"[^\w\s']", flags=re.UNICODE)


@dataclass
class CheckResult:
    correct: bool
    solution_text: str  # shown in the red/green feedback bar
    note: str | None = None  # e.g. "Watch out for accents!"


def normalize(text: str, keep_accents: bool = True) -> str:
    """Lowercase, drop punctuation (incl. ¿ ¡), collapse whitespace; optionally strip accents."""
    text = text.lower().replace("’", "'")
    if not keep_accents:
        text = "".join(c for c in unicodedata.normalize("NFKD", text) if not unicodedata.combining(c))
    text = _PUNCTUATION.sub(" ", text)
    return " ".join(text.split())


def _check_free_text(given: str, accepted: list[str]) -> CheckResult:
    display = accepted[0]
    exact = {normalize(a) for a in accepted}
    if normalize(given) in exact:
        return CheckResult(True, display)
    # Accept answers that only miss accents, but tell the learner (like the real app does).
    loose = {normalize(a, keep_accents=False) for a in accepted}
    if normalize(given, keep_accents=False) in loose:
        return CheckResult(True, display, note="Pay attention to the accents.")
    return CheckResult(False, display)


def check_answer(exercise: Exercise, answer: dict) -> CheckResult:
    sol, payload = exercise.solution, exercise.payload

    if exercise.type == "multiple_choice":
        return CheckResult(answer.get("index") == sol["index"], sol["text"])

    if exercise.type in {"translate", "type_answer"}:
        return _check_free_text(str(answer.get("text", "")), sol["answers"])

    if exercise.type == "fill_blank":
        return CheckResult(normalize(str(answer.get("choice", ""))) == normalize(sol["answer"]), sol["answer"])

    if exercise.type == "match_pairs":
        submitted = {tuple(p) for p in answer.get("pairs", []) if isinstance(p, list) and len(p) == 2}
        expected = {(item["key"], item["key"]) for item in payload["left"]}
        return CheckResult(submitted == expected, "All pairs matched")

    raise ValueError(f"Unknown exercise type: {exercise.type}")
