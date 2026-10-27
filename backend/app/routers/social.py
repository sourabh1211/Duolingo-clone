from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import clock
from ..config import settings
from ..database import get_db
from ..deps import get_current_user
from ..models import User
from ..schemas import LeaderboardEntry, LeaderboardOut, ShopOut
from ..services import gamification as g

router = APIRouter(prefix="/api", tags=["leaderboard & shop"])


@router.get("/leaderboard", response_model=LeaderboardOut)
def leaderboard(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Weekly league: every learner ranked by XP earned since Monday."""
    today = clock.today(db)
    rows = [(u, g.weekly_xp(db, u.id, today)) for u in db.scalars(select(User))]
    rows.sort(key=lambda r: (-r[1], r[0].display_name.lower()))
    start = g.week_start(today)
    return LeaderboardOut(
        league="Bronze",
        week_start=start,
        days_left=((start + timedelta(days=7)) - today).days,
        entries=[
            LeaderboardEntry(rank=i + 1, user_id=u.id, display_name=u.display_name,
                             avatar_color=u.avatar_color, weekly_xp=xp, is_me=u.id == user.id)
            for i, (u, xp) in enumerate(rows)
        ],
    )


@router.post("/shop/refill-hearts", response_model=ShopOut)
def refill_hearts(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    now = clock.now(db)
    g.refresh_hearts(user, now)
    if user.hearts >= settings.max_hearts:
        raise HTTPException(409, "Your hearts are already full")
    if user.gems < settings.heart_refill_gem_cost:
        raise HTTPException(402, "Not enough gems")
    user.gems -= settings.heart_refill_gem_cost
    g.gain_hearts(user, now, settings.max_hearts)
    db.commit()
    return ShopOut(gems=user.gems, hearts=user.hearts, max_hearts=settings.max_hearts)
