from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from ..models import GuidebookSection, Unit, User
from ..schemas import GuidebookOut, GuidebookPhraseOut, GuidebookSectionOut, PathOut, SkillOut, UnitOut
from ..services.presenters import course_info
from ..services.progress import load_course, next_lesson_index, progress_by_skill, skill_states

router = APIRouter(prefix="/api", tags=["course"])


@router.get("/course/path", response_model=PathOut)
def get_path(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """The learner's home path: units → skills with completed / active / locked state."""
    if user.current_course_id is None:
        raise HTTPException(404, "Learner has no course selected")
    course = load_course(db, user.current_course_id)
    progress = progress_by_skill(db, user.id)
    states = skill_states(course, progress)

    units = []
    for unit in course.units:
        skills = []
        for skill in unit.skills:
            p = progress.get(skill.id)
            state = states[skill.id]
            skills.append(
                SkillOut(
                    id=skill.id,
                    title=skill.title,
                    icon=skill.icon,
                    state=state,
                    lessons_total=len(skill.lessons),
                    lessons_completed=p.lessons_completed if p else 0,
                    crowns=p.crowns if p else 0,
                    next_lesson_id=None if state == "locked" else skill.lessons[next_lesson_index(skill, p)].id,
                )
            )
        units.append(
            UnitOut(
                id=unit.id,
                position=unit.position,
                title=unit.title,
                description=unit.description,
                color=unit.color,
                skills=skills,
            )
        )
    return PathOut(course=course_info(course), units=units)


@router.get("/units/{unit_id}/guidebook", response_model=GuidebookOut)
def get_guidebook(unit_id: int, db: Session = Depends(get_db), _user: User = Depends(get_current_user)):
    """Key phrases and grammar tips for one unit. Readable even while the unit is locked,
    like the original, so learners can preview what's coming."""
    unit = db.scalar(
        select(Unit)
        .where(Unit.id == unit_id)
        .options(selectinload(Unit.guidebook).selectinload(GuidebookSection.phrases))
    )
    if unit is None:
        raise HTTPException(404, "Unit not found")
    return GuidebookOut(
        unit_id=unit.id,
        unit_position=unit.position,
        unit_title=unit.title,
        description=unit.description,
        color=unit.color,
        language_code=unit.course.language.code,
        sections=[
            GuidebookSectionOut(
                kind=sec.kind,
                title=sec.title,
                body=sec.body,
                phrases=[GuidebookPhraseOut(text=p.text, translation=p.translation) for p in sec.phrases],
            )
            for sec in unit.guidebook
        ],
    )
