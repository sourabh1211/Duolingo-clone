"""Turns ORM objects into response schemas (kept out of routers so they stay thin)."""
from sqlalchemy.orm import Session

from .. import clock
from ..config import settings
from sqlalchemy import func, select

from ..models import Course, LessonSession, User
from ..schemas import CourseInfo, MeOut
from . import gamification as g


def course_info(course: Course) -> CourseInfo:
    return CourseInfo(
        id=course.id,
        title=course.title,
        language_code=course.language.code,
        language_name=course.language.name,
        flag=course.language.flag,
    )


def me_out(db: Session, user: User) -> MeOut:
    now = clock.now(db)
    today = now.date()
    next_heart = g.next_heart_at(user)
    course = db.get(Course, user.current_course_id) if user.current_course_id else None
    return MeOut(
        id=user.id,
        username=user.username,
        display_name=user.display_name,
        avatar_color=user.avatar_color,
        total_xp=user.total_xp,
        gems=user.gems,
        hearts=user.hearts,
        max_hearts=settings.max_hearts,
        next_heart_in_seconds=max(0, int((next_heart - now).total_seconds())) if next_heart else None,
        streak=g.current_streak(user, today),
        longest_streak=user.longest_streak,
        practiced_today=user.last_active_date == today,
        daily_goal_xp=user.daily_goal_xp,
        xp_today=g.xp_on(db, user.id, today),
        weekly_xp=g.weekly_xp(db, user.id, today),
        lessons_completed=db.scalar(
            select(func.count()).select_from(LessonSession).where(
                LessonSession.user_id == user.id, LessonSession.status == "completed"
            )
        )
        or 0,
        leaderboard_unlock_lessons=settings.leaderboard_unlock_lessons,
        dev_tools=settings.enable_dev_routes,
        today=today,
        course=course_info(course) if course else None,
    )


def refreshed(db: Session, user: User) -> User:
    """Apply heart regeneration before returning state, and persist it."""
    g.refresh_hearts(user, clock.now(db))
    db.commit()
    return user
