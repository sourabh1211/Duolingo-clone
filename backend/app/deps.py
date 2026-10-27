"""Shared FastAPI dependencies."""
from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from .database import get_db
from .models import User


def get_current_user(db: Session = Depends(get_db)) -> User:
    """Authentication is out of scope for the assignment: every request acts as the seeded
    default learner. Swapping this for a real auth dependency would not touch any router."""
    user = db.scalar(select(User).where(User.is_default.is_(True)))
    if user is None:
        raise HTTPException(503, "No default learner found. Run `python -m app.seed.seed` first.")
    return user
