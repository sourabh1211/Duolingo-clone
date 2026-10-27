"""Hearts, streaks, XP and achievements. All functions mutate the ORM objects; callers commit."""
from datetime import date, datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..config import settings
from ..models import Achievement, DailyXp, LessonSession, User, UserAchievement

REGEN = timedelta(minutes=settings.heart_regen_minutes)


# ───────────── Hearts ─────────────

def refresh_hearts(user: User, now: datetime) -> None:
    """Apply passive regeneration lazily (one heart per REGEN interval since the anchor)."""
    if user.hearts >= settings.max_hearts:
        user.hearts = settings.max_hearts
        return
    gained = int((now - user.hearts_updated_at) / REGEN)
    if gained <= 0:
        return
    user.hearts = min(settings.max_hearts, user.hearts + gained)
    user.hearts_updated_at = now if user.hearts == settings.max_hearts else user.hearts_updated_at + gained * REGEN


def next_heart_at(user: User) -> datetime | None:
    return None if user.hearts >= settings.max_hearts else user.hearts_updated_at + REGEN


def lose_heart(user: User, now: datetime) -> None:
    refresh_hearts(user, now)
    if user.hearts == settings.max_hearts:
        user.hearts_updated_at = now  # regeneration timer starts at the first lost heart
    user.hearts = max(0, user.hearts - 1)


def gain_hearts(user: User, now: datetime, amount: int) -> None:
    refresh_hearts(user, now)
    user.hearts = min(settings.max_hearts, user.hearts + amount)
    if user.hearts == settings.max_hearts:
        user.hearts_updated_at = now


# ───────────── Streak & XP ─────────────

def current_streak(user: User, today: date) -> int:
    """Streak shown to the learner. It is broken once a full day passes without activity."""
    if user.last_active_date is None:
        return 0
    if user.last_active_date >= today - timedelta(days=1):
        return user.streak
    return 0


def record_activity(db: Session, user: User, today: date, xp: int) -> bool:
    """Add XP for today and extend the streak. Returns True if this extended the streak today."""
    extended = False
    if user.last_active_date != today:
        user.streak = user.streak + 1 if user.last_active_date == today - timedelta(days=1) else 1
        user.last_active_date = today
        user.longest_streak = max(user.longest_streak, user.streak)
        extended = True

    row = db.scalar(select(DailyXp).where(DailyXp.user_id == user.id, DailyXp.day == today))
    if row is None:
        row = DailyXp(user_id=user.id, day=today, xp=0, lessons=0)
        db.add(row)
    row.xp += xp
    row.lessons += 1
    user.total_xp += xp
    return extended


def xp_on(db: Session, user_id: int, day: date) -> int:
    return db.scalar(select(DailyXp.xp).where(DailyXp.user_id == user_id, DailyXp.day == day)) or 0


def week_start(today: date) -> date:
    return today - timedelta(days=today.weekday())  # leagues reset on Monday


def weekly_xp(db: Session, user_id: int, today: date) -> int:
    return (
        db.scalar(
            select(func.coalesce(func.sum(DailyXp.xp), 0)).where(
                DailyXp.user_id == user_id, DailyXp.day >= week_start(today), DailyXp.day <= today
            )
        )
        or 0
    )


# ───────────── Achievements ─────────────

def metrics(db: Session, user: User, today: date) -> dict[str, int]:
    done = select(func.count()).select_from(LessonSession).where(
        LessonSession.user_id == user.id, LessonSession.status == "completed"
    )
    return {
        "streak": max(current_streak(user, today), user.longest_streak),
        "total_xp": user.total_xp,
        "lessons": db.scalar(done) or 0,
        "perfect_lessons": db.scalar(done.where(LessonSession.mistakes == 0)) or 0,
    }


def unlock_achievements(db: Session, user: User, now: datetime) -> list[Achievement]:
    """Grant any newly reached achievements and return them (for the celebration screen)."""
    owned = set(db.scalars(select(UserAchievement.achievement_id).where(UserAchievement.user_id == user.id)))
    values = metrics(db, user, now.date())
    new = []
    for ach in db.scalars(select(Achievement).order_by(Achievement.id)):
        if ach.id not in owned and values.get(ach.metric, 0) >= ach.threshold:
            db.add(UserAchievement(user_id=user.id, achievement_id=ach.id, unlocked_at=now))
            new.append(ach)
    return new
