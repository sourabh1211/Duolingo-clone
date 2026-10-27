"""A controllable clock.

Streaks depend on calendar days, which are painful to test by waiting. Every piece of
date logic asks this module for "now", and the dev endpoint can shift it forward by
whole days (the offset is stored in the app_state table so it survives restarts).
"""
from datetime import date, datetime, timedelta, timezone

from sqlalchemy.orm import Session

from .models import AppState

DAY_OFFSET_KEY = "day_offset"


def get_day_offset(db: Session) -> int:
    row = db.get(AppState, DAY_OFFSET_KEY)
    return int(row.value) if row else 0


def set_day_offset(db: Session, days: int) -> None:
    row = db.get(AppState, DAY_OFFSET_KEY)
    if row is None:
        db.add(AppState(key=DAY_OFFSET_KEY, value=str(days)))
    else:
        row.value = str(days)
    db.commit()


def now(db: Session) -> datetime:
    """Naive UTC datetime (SQLite has no timezone type), shifted by the dev offset."""
    real = datetime.now(timezone.utc).replace(tzinfo=None)
    return real + timedelta(days=get_day_offset(db))


def today(db: Session) -> date:
    return now(db).date()
