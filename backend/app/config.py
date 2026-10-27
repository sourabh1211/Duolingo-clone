"""Runtime settings, read once from environment variables (and backend/.env)."""
import os
from dataclasses import dataclass, field
from pathlib import Path

from dotenv import load_dotenv

# Load backend/.env no matter which folder the server is started from. Variables already set
# in the real environment (e.g. on Render, or by the tests) take priority over the file.
load_dotenv(Path(__file__).resolve().parent.parent / ".env", override=False)


def _bool(value: str | None, default: bool) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _database_url() -> str:
    """Pick the database in this order:

    1. TURSO_DATABASE_URL (hosted, SQLite-compatible libSQL): durable and shared by every
       server instance, which is what production on Vercel needs.
    2. DATABASE_URL: a local SQLite file (development).
    3. On Vercel without Turso: /tmp/lingo.db, the only writable folder. Works, but the data is
       temporary and not shared between instances (the health check reports this).
    """
    turso = os.getenv("TURSO_DATABASE_URL", "").strip()
    if turso:
        host = turso.split("://", 1)[-1].rstrip("/")  # libsql://db-org.turso.io -> db-org.turso.io
        return f"sqlite+libsql://{host}?secure=true"
    url = os.getenv("DATABASE_URL", "sqlite:///./lingo.db")
    if os.getenv("VERCEL") and url.startswith("sqlite") and "/tmp/" not in url:
        url = "sqlite:////tmp/lingo.db"
    return url


@dataclass(frozen=True)
class Settings:
    database_url: str = field(default_factory=_database_url)
    turso_auth_token: str = os.getenv("TURSO_AUTH_TOKEN", "").strip()
    cors_origins: list[str] = field(
        default_factory=lambda: [
            o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",") if o.strip()
        ]
    )
    # Also allow any *.vercel.app site (production and preview URLs of the frontend).
    cors_origin_regex: str | None = os.getenv("CORS_ORIGIN_REGEX", r"https://.*\.vercel\.app") or None
    heart_regen_minutes: int = int(os.getenv("HEART_REGEN_MINUTES", "30"))
    max_hearts: int = 5
    xp_per_lesson: int = 10
    perfect_lesson_bonus_xp: int = 5
    heart_refill_gem_cost: int = 350
    leaderboard_unlock_lessons: int = 10  # lessons a new learner must finish before joining a league
    # Testing helpers (time travel, reset). Turn off in production: ENABLE_DEV_ROUTES=false.
    enable_dev_routes: bool = _bool(os.getenv("ENABLE_DEV_ROUTES"), True)

    @property
    def database_kind(self) -> str:
        if self.database_url.startswith("sqlite+libsql://"):
            return "turso"
        on_vercel_tmp = bool(os.getenv("VERCEL")) and "/tmp/" in self.database_url
        return "sqlite-temporary" if on_vercel_tmp else "sqlite-file"


settings = Settings()
