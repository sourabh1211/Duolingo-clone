from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import Base, engine
from .routers import course, dev, lessons, me, social


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Create tables and seed on first boot so a fresh deploy is immediately usable.
    from .seed.seed import run

    Base.metadata.create_all(engine)
    run(reset=False)
    yield


app = FastAPI(
    title="Lingo API",
    version="1.0.0",
    description="Backend for the Duolingo-style learning app",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=settings.cors_origin_regex,
    allow_methods=["*"],
    allow_headers=["*"],
)

for r in (me.router, course.router, lessons.router, social.router):
    app.include_router(r)
if settings.enable_dev_routes:
    app.include_router(dev.router)


@app.get("/api/health")
def health():
    """Liveness + database check. `database` tells you which storage is in use; "sqlite-temporary"
    means data will not survive restarts (set TURSO_DATABASE_URL for production)."""
    from sqlalchemy import text

    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"status": "ok", "database": settings.database_kind}
