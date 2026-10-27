"""Pydantic models for request/response bodies (the public API contract)."""
from datetime import date, datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


class CourseInfo(BaseModel):
    id: int
    title: str
    language_code: str
    language_name: str
    flag: str


class MeOut(BaseModel):
    id: int
    username: str
    display_name: str
    avatar_color: str
    total_xp: int
    gems: int
    hearts: int
    max_hearts: int
    next_heart_in_seconds: int | None  # relative, so it is correct even with the dev clock offset
    streak: int
    longest_streak: int
    practiced_today: bool
    daily_goal_xp: int
    xp_today: int
    weekly_xp: int
    lessons_completed: int
    leaderboard_unlock_lessons: int  # leaderboard is locked until lessons_completed reaches this
    dev_tools: bool  # whether the /api/dev testing helpers are enabled
    today: date
    course: CourseInfo | None


class SettingsIn(BaseModel):
    display_name: str | None = Field(default=None, min_length=1, max_length=80)
    daily_goal_xp: Literal[10, 20, 30, 50] | None = None


class SkillOut(BaseModel):
    id: int
    title: str
    icon: str
    state: Literal["completed", "active", "locked"]
    lessons_total: int
    lessons_completed: int
    crowns: int
    next_lesson_id: int | None


class UnitOut(BaseModel):
    id: int
    position: int
    title: str
    description: str
    color: str
    skills: list[SkillOut]


class PathOut(BaseModel):
    course: CourseInfo
    units: list[UnitOut]


class ExerciseOut(BaseModel):
    id: int
    type: str
    payload: dict[str, Any]


class SessionStartOut(BaseModel):
    session_id: int
    lesson_id: int
    skill_title: str
    is_practice: bool
    hearts: int
    exercises: list[ExerciseOut]


class AnswerIn(BaseModel):
    exercise_id: int
    answer: dict[str, Any]


class AnswerOut(BaseModel):
    correct: bool
    solution: str
    note: str | None
    hearts: int
    out_of_hearts: bool


class AchievementOut(BaseModel):
    key: str
    title: str
    description: str
    icon: str
    unlocked: bool = True
    unlocked_at: datetime | None = None
    progress: int = 0
    threshold: int = 0


class CompleteOut(BaseModel):
    xp_earned: int
    accuracy: int  # percent
    seconds: int
    streak: int
    streak_extended: bool
    xp_today: int
    daily_goal_xp: int
    hearts: int
    skill_completed: bool
    new_achievements: list[AchievementOut]


class LeaderboardEntry(BaseModel):
    rank: int
    user_id: int
    display_name: str
    avatar_color: str
    weekly_xp: int
    is_me: bool


class LeaderboardOut(BaseModel):
    league: str
    week_start: date
    days_left: int
    entries: list[LeaderboardEntry]


class ProfileOut(BaseModel):
    me: MeOut
    joined: datetime
    lessons_completed: int
    skills_completed: int
    achievements: list[AchievementOut]
    last_7_days: list[dict[str, Any]]  # [{day, xp}]


class ShopOut(BaseModel):
    gems: int
    hearts: int
    max_hearts: int


class GuidebookPhraseOut(BaseModel):
    text: str
    translation: str


class GuidebookSectionOut(BaseModel):
    kind: Literal["phrases", "tip"]
    title: str
    body: str | None
    phrases: list[GuidebookPhraseOut]


class GuidebookOut(BaseModel):
    unit_id: int
    unit_position: int
    unit_title: str
    description: str
    color: str
    language_code: str
    sections: list[GuidebookSectionOut]
