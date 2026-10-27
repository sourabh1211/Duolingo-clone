"""The lesson loop: start a session → answer exercises → complete (or fail / abandon)."""
import random

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import clock
from ..config import settings
from ..database import get_db
from ..deps import get_current_user
from ..models import Exercise, Lesson, LessonSession, SessionAnswer, SkillProgress, User
from ..schemas import AchievementOut, AnswerIn, AnswerOut, CompleteOut, ExerciseOut, SessionStartOut
from ..services import gamification as g
from ..services.answers import check_answer
from ..services.progress import load_course, progress_by_skill, skill_states

router = APIRouter(prefix="/api", tags=["lessons"])


def _open_session(db: Session, user: User, lesson: Lesson, practice: bool) -> SessionStartOut:
    now = clock.now(db)
    # Only one active attempt at a time; leaving a lesson mid-way abandons it.
    for old in db.scalars(
        select(LessonSession).where(LessonSession.user_id == user.id, LessonSession.status == "active")
    ):
        old.status, old.finished_at = "abandoned", now
    session = LessonSession(user_id=user.id, lesson_id=lesson.id, is_practice=practice, started_at=now)
    db.add(session)
    db.commit()
    return SessionStartOut(
        session_id=session.id,
        lesson_id=lesson.id,
        skill_title=lesson.skill.title,
        is_practice=practice,
        hearts=user.hearts,
        exercises=[ExerciseOut(id=e.id, type=e.type, payload=e.payload) for e in lesson.exercises],
    )


def _owned_active_session(db: Session, user: User, session_id: int) -> LessonSession:
    session = db.get(LessonSession, session_id)
    if session is None or session.user_id != user.id:
        raise HTTPException(404, "Session not found")
    if session.status != "active":
        raise HTTPException(409, f"Session is already {session.status}")
    return session


@router.post("/lessons/{lesson_id}/sessions", response_model=SessionStartOut, status_code=201)
def start_lesson(lesson_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    lesson = db.get(Lesson, lesson_id)
    if lesson is None:
        raise HTTPException(404, "Lesson not found")
    course = load_course(db, user.current_course_id)
    if skill_states(course, progress_by_skill(db, user.id)).get(lesson.skill_id) == "locked":
        raise HTTPException(403, "This skill is still locked")
    g.refresh_hearts(user, clock.now(db))
    if user.hearts <= 0:
        raise HTTPException(409, "You have no hearts left")
    return _open_session(db, user, lesson, practice=False)


@router.post("/practice/sessions", response_model=SessionStartOut, status_code=201)
def start_practice(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Practice a lesson from a finished skill. Mistakes cost no hearts and finishing earns one back."""
    finished_skill_ids = [p.skill_id for p in progress_by_skill(db, user.id).values() if p.crowns > 0]
    if not finished_skill_ids:
        # Nothing finished yet: practice the very first lesson of the course.
        course = load_course(db, user.current_course_id)
        lesson = course.units[0].skills[0].lessons[0]
    else:
        lessons = list(db.scalars(select(Lesson).where(Lesson.skill_id.in_(finished_skill_ids))))
        lesson = random.choice(lessons)
    return _open_session(db, user, lesson, practice=True)


@router.post("/sessions/{session_id}/answers", response_model=AnswerOut)
def submit_answer(
    session_id: int, body: AnswerIn, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    session = _owned_active_session(db, user, session_id)
    exercise = db.get(Exercise, body.exercise_id)
    if exercise is None or exercise.lesson_id != session.lesson_id:
        raise HTTPException(400, "Exercise does not belong to this lesson")

    now = clock.now(db)
    result = check_answer(exercise, body.answer)
    db.add(SessionAnswer(session_id=session.id, exercise_id=exercise.id, answer=body.answer,
                         is_correct=result.correct, created_at=now))
    if result.correct:
        session.correct_count += 1
    else:
        session.mistakes += 1
        if not session.is_practice:
            g.lose_heart(user, now)
            if user.hearts == 0:
                session.status, session.finished_at = "failed", now
    db.commit()
    return AnswerOut(correct=result.correct, solution=result.solution_text, note=result.note,
                     hearts=user.hearts, out_of_hearts=session.status == "failed")


@router.post("/sessions/{session_id}/complete", response_model=CompleteOut)
def complete_session(session_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    session = _owned_active_session(db, user, session_id)
    lesson = session.lesson
    solved = {a.exercise_id for a in session.answers if a.is_correct}
    if any(e.id not in solved for e in lesson.exercises):
        raise HTTPException(409, "Every exercise must be answered correctly before finishing")

    now, today = clock.now(db), clock.today(db)
    xp = settings.xp_per_lesson + (settings.perfect_lesson_bonus_xp if session.mistakes == 0 else 0)
    session.status, session.finished_at, session.xp_earned = "completed", now, xp

    skill_completed = False
    if session.is_practice:
        g.gain_hearts(user, now, 1)
    else:
        progress = db.scalar(
            select(SkillProgress).where(SkillProgress.user_id == user.id, SkillProgress.skill_id == lesson.skill_id)
        )
        if progress is None:
            progress = SkillProgress(user_id=user.id, skill_id=lesson.skill_id, lessons_completed=0, crowns=0)
            db.add(progress)
        # Only the lesson that is "next" advances the ring; replays of other lessons just earn XP.
        if lesson.position - 1 == progress.lessons_completed:
            progress.lessons_completed += 1
            if progress.lessons_completed >= len(lesson.skill.lessons):
                progress.lessons_completed = 0
                progress.crowns += 1
                skill_completed = progress.crowns == 1
                progress.completed_at = progress.completed_at or now

    extended = g.record_activity(db, user, today, xp)
    db.flush()
    new_achievements = g.unlock_achievements(db, user, now)
    db.commit()

    total = session.correct_count + session.mistakes
    return CompleteOut(
        xp_earned=xp,
        accuracy=round(100 * session.correct_count / total) if total else 100,
        seconds=int((now - session.started_at).total_seconds()),
        streak=user.streak,
        streak_extended=extended,
        xp_today=g.xp_on(db, user.id, today),
        daily_goal_xp=user.daily_goal_xp,
        hearts=user.hearts,
        skill_completed=skill_completed,
        new_achievements=[
            AchievementOut(key=a.key, title=a.title, description=a.description, icon=a.icon,
                           unlocked_at=now, threshold=a.threshold, progress=a.threshold)
            for a in new_achievements
        ],
    )


@router.post("/sessions/{session_id}/abandon", status_code=204)
def abandon_session(session_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    session = _owned_active_session(db, user, session_id)
    session.status, session.finished_at = "abandoned", clock.now(db)
    db.commit()
