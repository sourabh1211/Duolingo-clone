from app.database import SessionLocal
from app.models import Exercise


def _correct_answer(ex: dict) -> dict:
    """Build a correct answer from the server's solution (tests may peek at the DB)."""
    with SessionLocal() as db:
        sol = db.get(Exercise, ex["id"]).solution
    if ex["type"] == "multiple_choice":
        return {"index": sol["index"]}
    if ex["type"] in ("translate", "type_answer"):
        return {"text": sol["answers"][0]}
    if ex["type"] == "fill_blank":
        return {"choice": sol["answer"]}
    return {"pairs": [[i["key"], i["key"]] for i in ex["payload"]["left"]]}


def _active_lesson(client):
    path = client.get("/api/course/path").json()
    skill = next(s for u in path["units"] for s in u["skills"] if s["state"] == "active")
    return skill


def test_path_has_lock_states(client):
    states = [s["state"] for u in client.get("/api/course/path").json()["units"] for s in u["skills"]]
    assert states[:3] == ["completed", "completed", "active"]
    assert set(states[3:]) == {"locked"}


def test_locked_skill_cannot_start(client):
    path = client.get("/api/course/path").json()
    locked = next(s for u in path["units"] for s in u["skills"] if s["state"] == "locked")
    with SessionLocal() as db:
        from app.models import Lesson
        lesson_id = db.query(Lesson).filter_by(skill_id=locked["id"]).first().id
    assert client.post(f"/api/lessons/{lesson_id}/sessions").status_code == 403


def test_full_lesson_awards_xp_and_streak(client):
    before = client.get("/api/me").json()
    skill = _active_lesson(client)
    start = client.post(f"/api/lessons/{skill['next_lesson_id']}/sessions").json()
    for ex in start["exercises"]:
        r = client.post(f"/api/sessions/{start['session_id']}/answers",
                        json={"exercise_id": ex["id"], "answer": _correct_answer(ex)}).json()
        assert r["correct"], ex
    done = client.post(f"/api/sessions/{start['session_id']}/complete").json()
    assert done["xp_earned"] == 15  # perfect lesson bonus
    assert done["streak"] == before["streak"] + 1 and done["streak_extended"]
    after = client.get("/api/me").json()
    assert after["total_xp"] == before["total_xp"] + 15
    assert after["practiced_today"]


def test_wrong_answer_costs_heart_and_blocks_completion(client):
    skill = _active_lesson(client)
    start = client.post(f"/api/lessons/{skill['next_lesson_id']}/sessions").json()
    ex = start["exercises"][0]
    r = client.post(f"/api/sessions/{start['session_id']}/answers",
                    json={"exercise_id": ex["id"], "answer": {"index": 99}}).json()
    assert not r["correct"] and r["hearts"] == start["hearts"] - 1
    assert client.post(f"/api/sessions/{start['session_id']}/complete").status_code == 409


def test_running_out_of_hearts_fails_lesson(client):
    client.post("/api/dev/empty-hearts")
    skill = _active_lesson(client)
    assert client.post(f"/api/lessons/{skill['next_lesson_id']}/sessions").status_code == 409
    refill = client.post("/api/shop/refill-hearts").json()
    assert refill["hearts"] == 5 and refill["gems"] == 150


def test_streak_breaks_after_missed_day(client):
    assert client.get("/api/me").json()["streak"] == 4
    client.post("/api/dev/advance-day", json={"days": 2})
    assert client.get("/api/me").json()["streak"] == 0


def test_accent_tolerance():
    from app.services.answers import _check_free_text
    r = _check_free_text("adios amigo", ["Adiós, amigo."])
    assert r.correct and r.note


def test_leaderboard_includes_me(client):
    lb = client.get("/api/leaderboard").json()
    assert any(e["is_me"] for e in lb["entries"]) and lb["entries"][0]["rank"] == 1


def test_guidebook_has_phrases_and_tips(client):
    unit_id = client.get("/api/course/path").json()["units"][0]["id"]
    gb = client.get(f"/api/units/{unit_id}/guidebook").json()
    kinds = {s["kind"] for s in gb["sections"]}
    assert kinds == {"phrases", "tip"}
    assert gb["sections"][0]["phrases"][0]["translation"]
    assert client.get("/api/units/999/guidebook").status_code == 404


def test_leaderboard_unlock_counter(client):
    me = client.get("/api/me").json()
    assert me["lessons_completed"] == 7 and me["leaderboard_unlock_lessons"] == 10
    assert client.get("/api/health").json() == {"status": "ok", "database": "sqlite-file"}
