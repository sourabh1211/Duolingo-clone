"""Generates varied lesson exercises from a skill's vocabulary and sentences.

Generation is deterministic (seeded RNG) so every fresh database has identical content.
Each lesson mixes all five exercise types, like a real lesson does.
"""
import random
import re

Word = tuple[str, str, str]  # (spanish, english, emoji)
Sentence = tuple[str, str, list[str]]  # (spanish, english, other accepted english)

_STRIP = re.compile(r"[.,!?¿¡]")


def _tokens(sentence: str) -> list[str]:
    return [t for t in _STRIP.sub("", sentence).split() if t]


def _distractor_tokens(rng: random.Random, pool: list[str], exclude: list[str], n: int) -> list[str]:
    lowered = {t.lower() for t in exclude}
    candidates = sorted({t for t in pool if t.lower() not in lowered})
    rng.shuffle(candidates)
    return candidates[:n]


def multiple_choice_picture(rng, words: list[Word], target: Word) -> dict:
    others = rng.sample([w for w in words if w != target], 2)
    choices = [target, *others]
    rng.shuffle(choices)
    return {
        "type": "multiple_choice",
        "payload": {
            "prompt": f'Which one of these is "{target[1]}"?',
            "variant": "picture",
            "choices": [{"text": w[0], "emoji": w[2]} for w in choices],
        },
        "solution": {"index": choices.index(target), "text": target[0]},
    }


def multiple_choice_text(rng, words: list[Word], target: Word) -> dict:
    others = rng.sample([w for w in words if w != target], 2)
    choices = [target, *others]
    rng.shuffle(choices)
    return {
        "type": "multiple_choice",
        "payload": {
            "prompt": f'How do you say "{target[1]}"?',
            "variant": "text",
            "choices": [{"text": w[0], "emoji": None} for w in choices],
        },
        "solution": {"index": choices.index(target), "text": target[0]},
    }


def match_pairs(rng, words: list[Word]) -> dict:
    picked = rng.sample(words, min(5, len(words)))
    left = [{"key": f"p{i}", "text": w[0]} for i, w in enumerate(picked)]
    right = [{"key": f"p{i}", "text": w[1]} for i, w in enumerate(picked)]
    rng.shuffle(left)
    rng.shuffle(right)
    return {"type": "match_pairs", "payload": {"prompt": "Tap the matching pairs", "left": left, "right": right}, "solution": {}}


def translate_to_english(rng, sentences: list[Sentence], target: Sentence) -> dict:
    es, en, alts = target
    answer_tokens = _tokens(en)
    pool = [t for s in sentences for t in _tokens(s[1])]
    bank = answer_tokens + _distractor_tokens(rng, pool, answer_tokens, 3)
    rng.shuffle(bank)
    return {
        "type": "translate",
        "payload": {"prompt": "Write this in English", "sentence": es, "speak": es, "bank": bank},
        "solution": {"answers": [en, *alts]},
    }


def translate_to_spanish(rng, sentences: list[Sentence], target: Sentence) -> dict:
    es, en, _ = target
    answer_tokens = _tokens(es)
    pool = [t for s in sentences for t in _tokens(s[0])]
    bank = answer_tokens + _distractor_tokens(rng, pool, answer_tokens, 3)
    rng.shuffle(bank)
    return {
        "type": "translate",
        "payload": {"prompt": "Write this in Spanish", "sentence": en, "speak": None, "bank": bank},
        "solution": {"answers": [es]},
    }


def fill_blank(rng, sentences: list[Sentence], target: Sentence) -> dict:
    es, en, _ = target
    raw = es.split()
    # Blank a content word (longest bare token), never leading punctuation-only tokens.
    index = max(range(len(raw)), key=lambda i: (len(_STRIP.sub("", raw[i])), -i))
    answer = _STRIP.sub("", raw[index])
    trailing = raw[index][len(raw[index].rstrip(".,!?")):]
    leading = raw[index][: len(raw[index]) - len(raw[index].lstrip("¿¡"))]
    pool = [t for s in sentences for t in _tokens(s[0]) if len(t) > 2]
    choices = [answer, *_distractor_tokens(rng, pool, [answer], 2)]
    rng.shuffle(choices)
    return {
        "type": "fill_blank",
        "payload": {
            "prompt": "Fill in the blank",
            "before": " ".join(raw[:index]) + (" " if index else "") + leading,
            "after": trailing + (" " if index < len(raw) - 1 else "") + " ".join(raw[index + 1 :]),
            "choices": choices,
            "translation": en,
        },
        "solution": {"answer": answer},
    }


def type_answer(rng, target: Sentence | Word) -> dict:
    if len(target) == 3 and isinstance(target[2], list):  # sentence
        es, en, alts = target
        answers = [en, *alts]
    else:  # word: accept with or without the article
        es, en, _ = target
        answers = [en, en.removeprefix("the ")]
    return {
        "type": "type_answer",
        "payload": {"prompt": "Type this in English", "sentence": es, "speak": es},
        "solution": {"answers": answers},
    }


def build_lesson(seed: str, words: list[Word], sentences: list[Sentence], lesson_index: int) -> list[dict]:
    """Seven exercises in Duolingo's usual rhythm: recognize → match → build → recall."""
    rng = random.Random(seed)
    w = words[:]
    s = sentences[:]
    rng.shuffle(w)
    rng.shuffle(s)
    # Rotate so consecutive lessons emphasise different items.
    w = w[lesson_index:] + w[:lesson_index]
    s = s[lesson_index * 2 :] + s[: lesson_index * 2]
    return [
        multiple_choice_picture(rng, words, w[0]),
        match_pairs(rng, words),
        translate_to_english(rng, sentences, s[0]),
        fill_blank(rng, sentences, s[1]),
        multiple_choice_text(rng, words, w[1]),
        translate_to_spanish(rng, sentences, s[2]),
        type_answer(rng, s[3] if lesson_index % 2 else w[2]),
    ]
