from datetime import timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .. import clock
from ..database import get_db
from ..deps import get_current_user
from ..models import Achievement, LessonSession, SkillProgress, User, UserAchievement
from ..schemas import AchievementOut, MeOut, ProfileOut, SettingsIn
from ..services import gamification as g
from ..services.presenters import me_out, refreshed

router = APIRouter(prefix="/api/me", tags=["learner"])


@router.get("", response_model=MeOut)
def get_me(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return me_out(db, refreshed(db, user))


@router.patch("/settings", response_model=MeOut)
def update_settings(body: SettingsIn, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if body.display_name is not None:
        user.display_name = body.display_name.strip()
    if body.daily_goal_xp is not None:
        user.daily_goal_xp = body.daily_goal_xp
    db.commit()
    return me_out(db, user)


@router.get("/profile", response_model=ProfileOut)
def get_profile(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    refreshed(db, user)
    today = clock.today(db)
    values = g.metrics(db, user, today)
    owned = {
        ua.achievement_id: ua.unlocked_at
        for ua in db.scalars(select(UserAchievement).where(UserAchievement.user_id == user.id))
    }
    achievements = [
        AchievementOut(
            key=a.key,
            title=a.title,
            description=a.description,
            icon=a.icon,
            unlocked=a.id in owned,
            unlocked_at=owned.get(a.id),
            progress=min(values.get(a.metric, 0), a.threshold),
            threshold=a.threshold,
        )
        for a in db.scalars(select(Achievement).order_by(Achievement.id))
    ]
    days = [today - timedelta(days=i) for i in range(6, -1, -1)]
    return ProfileOut(
        me=me_out(db, user),
        joined=user.created_at,
        lessons_completed=db.scalar(
            select(func.count()).select_from(LessonSession).where(
                LessonSession.user_id == user.id, LessonSession.status == "completed"
            )
        )
        or 0,
        skills_completed=db.scalar(
            select(func.count()).select_from(SkillProgress).where(
                SkillProgress.user_id == user.id, SkillProgress.crowns > 0
            )
        )
        or 0,
        achievements=achievements,
        last_7_days=[{"day": d.isoformat(), "xp": g.xp_on(db, user.id, d)} for d in days],
    )
