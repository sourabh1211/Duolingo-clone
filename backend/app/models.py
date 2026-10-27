"""Database schema.

Content hierarchy (read-only, seeded):
    Language 1─* Course 1─* Unit 1─* Skill 1─* Lesson 1─* Exercise
                            Unit 1─* GuidebookSection 1─* GuidebookPhrase

Learner state (written by gameplay):
    User 1─* SkillProgress      (lessons finished per skill → progress ring / crown)
    User 1─* LessonSession      (one attempt at a lesson; answers are checked against it)
    User 1─* DailyXp            (XP per calendar day → daily goal, streak, weekly league)
    User *─* Achievement        (through UserAchievement)
"""
from datetime import date, datetime

from sqlalchemy import (
    JSON,
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


# ───────────────────────── Content ─────────────────────────


class Language(Base):
    __tablename__ = "languages"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(8), unique=True)  # BCP-47, e.g. "es"
    name: Mapped[str] = mapped_column(String(64))
    flag: Mapped[str] = mapped_column(String(8))  # emoji flag

    courses: Mapped[list["Course"]] = relationship(back_populates="language")


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(primary_key=True)
    language_id: Mapped[int] = mapped_column(ForeignKey("languages.id", ondelete="CASCADE"))
    from_language: Mapped[str] = mapped_column(String(8), default="en")
    title: Mapped[str] = mapped_column(String(120))

    language: Mapped[Language] = relationship(back_populates="courses")
    units: Mapped[list["Unit"]] = relationship(
        back_populates="course", order_by="Unit.position", cascade="all, delete-orphan"
    )


class Unit(Base):
    __tablename__ = "units"
    __table_args__ = (UniqueConstraint("course_id", "position"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id", ondelete="CASCADE"), index=True)
    position: Mapped[int] = mapped_column(Integer)
    title: Mapped[str] = mapped_column(String(120))
    description: Mapped[str] = mapped_column(String(255))
    color: Mapped[str] = mapped_column(String(16))  # theme key used by the frontend

    course: Mapped[Course] = relationship(back_populates="units")
    skills: Mapped[list["Skill"]] = relationship(
        back_populates="unit", order_by="Skill.position", cascade="all, delete-orphan"
    )
    guidebook: Mapped[list["GuidebookSection"]] = relationship(
        back_populates="unit", order_by="GuidebookSection.position", cascade="all, delete-orphan"
    )


class GuidebookSection(Base):
    """One block of a unit's guidebook: a set of key phrases, or a grammar tip with examples."""

    __tablename__ = "guidebook_sections"
    __table_args__ = (UniqueConstraint("unit_id", "position"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    unit_id: Mapped[int] = mapped_column(ForeignKey("units.id", ondelete="CASCADE"), index=True)
    position: Mapped[int] = mapped_column(Integer)
    kind: Mapped[str] = mapped_column(String(16))  # "phrases" | "tip"
    title: Mapped[str] = mapped_column(String(120))
    body: Mapped[str | None] = mapped_column(Text, nullable=True)  # explanation text for tips

    unit: Mapped["Unit"] = relationship(back_populates="guidebook")
    phrases: Mapped[list["GuidebookPhrase"]] = relationship(
        back_populates="section", order_by="GuidebookPhrase.position", cascade="all, delete-orphan"
    )


class GuidebookPhrase(Base):
    __tablename__ = "guidebook_phrases"
    __table_args__ = (UniqueConstraint("section_id", "position"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    section_id: Mapped[int] = mapped_column(ForeignKey("guidebook_sections.id", ondelete="CASCADE"), index=True)
    position: Mapped[int] = mapped_column(Integer)
    text: Mapped[str] = mapped_column(String(255))  # in the language being learned (spoken aloud)
    translation: Mapped[str] = mapped_column(String(255))  # shown on hover / tap

    section: Mapped[GuidebookSection] = relationship(back_populates="phrases")


class Skill(Base):
    __tablename__ = "skills"
    __table_args__ = (UniqueConstraint("unit_id", "position"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    unit_id: Mapped[int] = mapped_column(ForeignKey("units.id", ondelete="CASCADE"), index=True)
    position: Mapped[int] = mapped_column(Integer)
    title: Mapped[str] = mapped_column(String(120))
    icon: Mapped[str] = mapped_column(String(16))  # icon key: star | book | dumbbell | trophy

    unit: Mapped[Unit] = relationship(back_populates="skills")
    lessons: Mapped[list["Lesson"]] = relationship(
        back_populates="skill", order_by="Lesson.position", cascade="all, delete-orphan"
    )


class Lesson(Base):
    __tablename__ = "lessons"
    __table_args__ = (UniqueConstraint("skill_id", "position"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id", ondelete="CASCADE"), index=True)
    position: Mapped[int] = mapped_column(Integer)

    skill: Mapped[Skill] = relationship(back_populates="lessons")
    exercises: Mapped[list["Exercise"]] = relationship(
        back_populates="lesson", order_by="Exercise.position", cascade="all, delete-orphan"
    )


class Exercise(Base):
    """One challenge inside a lesson.

    `payload` is what the client is allowed to see (prompt, choices, word bank…).
    `solution` never leaves the server except as feedback after an answer is checked.
    The shape of both depends on `type`; see app/services/answers.py.
    """

    __tablename__ = "exercises"
    __table_args__ = (UniqueConstraint("lesson_id", "position"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    lesson_id: Mapped[int] = mapped_column(ForeignKey("lessons.id", ondelete="CASCADE"), index=True)
    position: Mapped[int] = mapped_column(Integer)
    type: Mapped[str] = mapped_column(String(32))
    payload: Mapped[dict] = mapped_column(JSON)
    solution: Mapped[dict] = mapped_column(JSON)

    lesson: Mapped[Lesson] = relationship(back_populates="exercises")


# ───────────────────────── Learners ─────────────────────────


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(40), unique=True)
    display_name: Mapped[str] = mapped_column(String(80))
    avatar_color: Mapped[str] = mapped_column(String(16), default="#1cb0f6")
    is_default: Mapped[bool] = mapped_column(Boolean, default=False)  # the "logged-in" learner
    current_course_id: Mapped[int | None] = mapped_column(ForeignKey("courses.id"), nullable=True)

    total_xp: Mapped[int] = mapped_column(Integer, default=0)
    gems: Mapped[int] = mapped_column(Integer, default=500)

    hearts: Mapped[int] = mapped_column(Integer, default=5)
    hearts_updated_at: Mapped[datetime] = mapped_column(DateTime)  # anchor for regeneration

    streak: Mapped[int] = mapped_column(Integer, default=0)
    longest_streak: Mapped[int] = mapped_column(Integer, default=0)
    last_active_date: Mapped[date | None] = mapped_column(Date, nullable=True)

    daily_goal_xp: Mapped[int] = mapped_column(Integer, default=20)
    created_at: Mapped[datetime] = mapped_column(DateTime)

    skill_progress: Mapped[list["SkillProgress"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    daily_xp: Mapped[list["DailyXp"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    achievements: Mapped[list["UserAchievement"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class SkillProgress(Base):
    __tablename__ = "skill_progress"
    __table_args__ = (UniqueConstraint("user_id", "skill_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id", ondelete="CASCADE"), index=True)
    lessons_completed: Mapped[int] = mapped_column(Integer, default=0)  # progress toward the next crown; resets to 0 when a crown is earned
    crowns: Mapped[int] = mapped_column(Integer, default=0)  # +1 every time all lessons are finished
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    user: Mapped[User] = relationship(back_populates="skill_progress")
    skill: Mapped[Skill] = relationship()


class LessonSession(Base):
    __tablename__ = "lesson_sessions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    lesson_id: Mapped[int] = mapped_column(ForeignKey("lessons.id", ondelete="CASCADE"), index=True)
    status: Mapped[str] = mapped_column(String(16), default="active")  # active | completed | failed | abandoned
    is_practice: Mapped[bool] = mapped_column(Boolean, default=False)  # practice refills hearts instead of costing them
    correct_count: Mapped[int] = mapped_column(Integer, default=0)
    mistakes: Mapped[int] = mapped_column(Integer, default=0)
    xp_earned: Mapped[int] = mapped_column(Integer, default=0)
    started_at: Mapped[datetime] = mapped_column(DateTime)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    lesson: Mapped[Lesson] = relationship()
    answers: Mapped[list["SessionAnswer"]] = relationship(back_populates="session", cascade="all, delete-orphan")


class SessionAnswer(Base):
    __tablename__ = "session_answers"

    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("lesson_sessions.id", ondelete="CASCADE"), index=True)
    exercise_id: Mapped[int] = mapped_column(ForeignKey("exercises.id", ondelete="CASCADE"))
    answer: Mapped[dict] = mapped_column(JSON)
    is_correct: Mapped[bool] = mapped_column(Boolean)
    created_at: Mapped[datetime] = mapped_column(DateTime)

    session: Mapped[LessonSession] = relationship(back_populates="answers")


class DailyXp(Base):
    __tablename__ = "daily_xp"
    __table_args__ = (UniqueConstraint("user_id", "day"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    day: Mapped[date] = mapped_column(Date, index=True)
    xp: Mapped[int] = mapped_column(Integer, default=0)
    lessons: Mapped[int] = mapped_column(Integer, default=0)

    user: Mapped[User] = relationship(back_populates="daily_xp")


class Achievement(Base):
    __tablename__ = "achievements"

    id: Mapped[int] = mapped_column(primary_key=True)
    key: Mapped[str] = mapped_column(String(40), unique=True)
    title: Mapped[str] = mapped_column(String(80))
    description: Mapped[str] = mapped_column(Text)
    icon: Mapped[str] = mapped_column(String(8))
    metric: Mapped[str] = mapped_column(String(32))  # streak | total_xp | lessons | perfect_lessons
    threshold: Mapped[int] = mapped_column(Integer)


class UserAchievement(Base):
    __tablename__ = "user_achievements"
    __table_args__ = (UniqueConstraint("user_id", "achievement_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    achievement_id: Mapped[int] = mapped_column(ForeignKey("achievements.id", ondelete="CASCADE"))
    unlocked_at: Mapped[datetime] = mapped_column(DateTime)

    user: Mapped[User] = relationship(back_populates="achievements")
    achievement: Mapped[Achievement] = relationship()


class AppState(Base):
    """Tiny key/value table for global app state (currently just the dev clock offset)."""

    __tablename__ = "app_state"

    key: Mapped[str] = mapped_column(String(40), primary_key=True)
    value: Mapped[str] = mapped_column(String(255))
