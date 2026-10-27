"""SQLAlchemy engine/session setup for SQLite."""
from collections.abc import Generator

from sqlalchemy import create_engine, event
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from .config import settings

if settings.database_kind == "turso":
    # Hosted libSQL over HTTPS (Linux/macOS driver, installed on Vercel only).
    engine = create_engine(
        settings.database_url,
        connect_args={"auth_token": settings.turso_auth_token},
        pool_pre_ping=True,  # drop connections the server has closed between invocations
    )
else:
    engine = create_engine(
        settings.database_url,
        connect_args={"check_same_thread": False},  # FastAPI may use the session across threads
    )


@event.listens_for(engine, "connect")
def _enable_sqlite_foreign_keys(dbapi_connection, _record):
    # SQLite ignores FOREIGN KEY constraints unless this pragma is on for each connection.
    try:
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()
    except Exception:  # pragma: no cover - some remote servers manage this themselves
        pass


SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
