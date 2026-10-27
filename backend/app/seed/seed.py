"""Seeds the course, achievements, the default learner (with some progress) and rivals.

    python -m app.seed.seed          # seed only if the database is empty
    python -m app.seed.seed --reset  # drop everything and seed again
"""
import sys

from sqlalchemy.exc import IntegrityError, OperationalError
from datetime import timedelta

from sqlalchemy import select

from .. import clock
from ..database import Base, SessionLocal, engine
from ..models import (
    Achievement,
    Course,
    DailyXp,
    Exercise,
    GuidebookPhrase,
    GuidebookSection,
    Language,
    Lesson,
    LessonSession,
    Skill,
    SkillProgress,
    Unit,
    User,
)
from ..services import gamification as g
from . import content
from .generator import build_lesson


def _seed_course(db) -> Course:
    lang = Language(**content.LANGUAGE)
    course = Course(language=lang, from_language="en", title=content.COURSE_TITLE)
    db.add(course)

    for u_pos, unit_data in enumerate(content.UNITS, start=1):
        unit = Unit(course=course, position=u_pos, title=unit_data["title"],
                    description=unit_data["description"], color=unit_data["color"])
        db.add(unit)
        for g_pos, sec in enumerate(content.GUIDEBOOKS[u_pos - 1], start=1):
            section = GuidebookSection(unit=unit, position=g_pos, kind=sec["kind"], title=sec["title"],
                                       body=sec.get("body"))
            db.add(section)
            for p_pos, (text, translation) in enumerate(sec["phrases"], start=1):
                db.add(GuidebookPhrase(section=section, position=p_pos, text=text, translation=translation))
        regular = [s for s in unit_data["skills"] if not s.get("review")]
        for s_pos, skill_data in enumerate(unit_data["skills"], start=1):
            skill = Skill(unit=unit, position=s_pos, title=skill_data["title"], icon=skill_data["icon"])
            db.add(skill)
            if skill_data.get("review"):  # review skills mix the whole unit
                words = [w for s in regular for w in s["words"]]
                sentences = [x for s in regular for x in s["sentences"]]
            else:
                words, sentences = skill_data["words"], skill_data["sentences"]
            for l_pos in range(1, skill_data["lessons"] + 1):
                lesson = Lesson(skill=skill, position=l_pos)
                db.add(lesson)
                exercises = build_lesson(f"{u_pos}-{s_pos}-{l_pos}", words, sentences, l_pos - 1)
                for e_pos, ex in enumerate(exercises, start=1):
                    lesson.exercises.append(Exercise(position=e_pos, **ex))
    db.flush()
    return course


def _seed_learners(db, course: Course) -> None:
    now = clock.now(db)
    today = now.date()

    for key, title, desc, icon, metric, threshold in content.ACHIEVEMENTS:
        db.add(Achievement(key=key, title=title, description=desc, icon=icon, metric=metric, threshold=threshold))

    # The default learner: practiced the last 4 days (but not yet today) so the streak is
    # "at risk", one heart is regenerating, and Unit 1 is partly done.
    me = User(
        username="learner", display_name="Alex", avatar_color="#58cc02", is_default=True,
        current_course_id=course.id, gems=500, hearts=4, hearts_updated_at=now - timedelta(minutes=12),
        streak=4, longest_streak=9, last_active_date=today - timedelta(days=1),
        daily_goal_xp=20, created_at=now - timedelta(days=40), total_xp=0,
    )
    db.add(me)
    db.flush()

    skills = [s for u in course.units for s in u.skills]
    lessons_done = []
    for skill in skills[:2]:  # Basics and Greetings finished
        db.add(SkillProgress(user_id=me.id, skill_id=skill.id, lessons_completed=0, crowns=1,
                             completed_at=now - timedelta(days=3)))
        lessons_done += skill.lessons
    db.add(SkillProgress(user_id=me.id, skill_id=skills[2].id, lessons_completed=1, crowns=0))
    lessons_done.append(skills[2].lessons[0])

    # Spread those lessons over the past days so XP history, streak and stats agree.
    for i, lesson in enumerate(lessons_done):
        day = today - timedelta(days=1 + (i % 4))
        started = now.replace(year=day.year, month=day.month, day=day.day) - timedelta(minutes=5)
        perfect = i % 3 == 0
        xp = 15 if perfect else 10
        db.add(LessonSession(user_id=me.id, lesson_id=lesson.id, status="completed", is_practice=False,
                             correct_count=7, mistakes=0 if perfect else 1, xp_earned=xp,
                             started_at=started, finished_at=started + timedelta(minutes=3)))
        row = db.scalar(select(DailyXp).where(DailyXp.user_id == me.id, DailyXp.day == day))
        if row is None:
            row = DailyXp(user_id=me.id, day=day, xp=0, lessons=0)
            db.add(row)
            db.flush()
        row.xp += xp
        row.lessons += 1
        me.total_xp += xp
    me.total_xp += 120  # XP from earlier weeks
    db.flush()
    g.unlock_achievements(db, me, now)

    # Rivals for the weekly league. Their weekly XP is spread over the days of this week.
    days_this_week = (today - g.week_start(today)).days + 1
    for username, name, color, weekly, total in content.RIVALS:
        rival = User(username=username, display_name=name, avatar_color=color, current_course_id=course.id,
                     hearts=5, hearts_updated_at=now, streak=3, longest_streak=10,
                     last_active_date=today, total_xp=total, created_at=now - timedelta(days=90))
        db.add(rival)
        db.flush()
        per_day, remainder = divmod(weekly, days_this_week)
        for d in range(days_this_week):
            day = g.week_start(today) + timedelta(days=d)
            db.add(DailyXp(user_id=rival.id, day=day, xp=per_day + (remainder if d == 0 else 0), lessons=1))


def run(reset: bool = False) -> None:
    if reset:
        Base.metadata.drop_all(engine)
    try:
        Base.metadata.create_all(engine)
    except OperationalError:
        pass  # another instance created the tables at the same moment
    with SessionLocal() as db:
        if db.scalar(select(Language.id).limit(1)) is not None:
            return  # already seeded
        try:
            course = _seed_course(db)
            _seed_learners(db, course)
            db.commit()
        except IntegrityError:
            db.rollback()  # another server instance seeded first; its data wins
            return
    print("Database seeded.")


if __name__ == "__main__":
    run(reset="--reset" in sys.argv)
