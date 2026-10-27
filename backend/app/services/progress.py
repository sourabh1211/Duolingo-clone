"""Builds the learning path with lock/unlock state for a learner."""
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from ..models import Course, Skill, SkillProgress, Unit


def ordered_skills(course: Course) -> list[Skill]:
    return [s for unit in course.units for s in unit.skills]


def load_course(db: Session, course_id: int) -> Course | None:
    return db.scalar(
        select(Course)
        .where(Course.id == course_id)
        .options(selectinload(Course.units).selectinload(Unit.skills).selectinload(Skill.lessons))
    )


def progress_by_skill(db: Session, user_id: int) -> dict[int, SkillProgress]:
    rows = db.scalars(select(SkillProgress).where(SkillProgress.user_id == user_id))
    return {r.skill_id: r for r in rows}


def skill_states(course: Course, progress: dict[int, SkillProgress]) -> dict[int, str]:
    """completed → all lessons done at least once; active → the next one to do; locked → the rest."""
    states: dict[int, str] = {}
    found_active = False
    for skill in ordered_skills(course):
        p = progress.get(skill.id)
        if p and p.crowns > 0:
            states[skill.id] = "completed"
        elif not found_active:
            states[skill.id] = "active"
            found_active = True
        else:
            states[skill.id] = "locked"
    return states


def next_lesson_index(skill: Skill, p: SkillProgress | None) -> int:
    """Lessons are played in order. `lessons_completed` resets to 0 each time a crown is earned,
    so replaying a finished skill starts again from its first lesson."""
    return (p.lessons_completed if p else 0) % len(skill.lessons)
