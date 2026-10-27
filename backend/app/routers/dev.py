"""Testing helpers. Disabled when ENABLE_DEV_ROUTES=false."""
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from .. import clock
from ..database import get_db
from ..deps import get_current_user
from ..models import User

router = APIRouter(prefix="/api/dev", tags=["dev"])


class AdvanceIn(BaseModel):
    days: int = Field(default=1, ge=-30, le=30)


@router.get("/clock")
def get_clock(db: Session = Depends(get_db)):
    return {"now": clock.now(db), "today": clock.today(db), "day_offset": clock.get_day_offset(db)}


@router.post("/advance-day")
def advance_day(body: AdvanceIn, db: Session = Depends(get_db)):
    """Simulate time passing, e.g. to watch a streak continue (+1 day) or break (+2 days)."""
    clock.set_day_offset(db, clock.get_day_offset(db) + body.days)
    return get_clock(db)


@router.post("/empty-hearts")
def empty_hearts(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    user.hearts, user.hearts_updated_at = 0, clock.now(db)
    db.commit()
    return {"hearts": 0}


@router.post("/reset")
def reset(db: Session = Depends(get_db)):
    """Wipe and re-seed the database (content + demo learners)."""
    from ..seed.seed import run

    db.close()
    run(reset=True)
    return {"ok": True}
