// Mirrors backend/app/schemas.py

export interface CourseInfo {
  id: number;
  title: string;
  language_code: string;
  language_name: string;
  flag: string;
}

export interface Me {
  id: number;
  username: string;
  display_name: string;
  avatar_color: string;
  total_xp: number;
  gems: number;
  hearts: number;
  max_hearts: number;
  next_heart_in_seconds: number | null;
  streak: number;
  longest_streak: number;
  practiced_today: boolean;
  daily_goal_xp: number;
  xp_today: number;
  weekly_xp: number;
  lessons_completed: number;
  leaderboard_unlock_lessons: number;
  dev_tools: boolean;
  today: string;
  course: CourseInfo | null;
}

export type SkillState = "completed" | "active" | "locked";

export interface Skill {
  id: number;
  title: string;
  icon: "star" | "book" | "dumbbell" | "trophy";
  state: SkillState;
  lessons_total: number;
  lessons_completed: number;
  crowns: number;
  next_lesson_id: number | null;
}

export interface Unit {
  id: number;
  position: number;
  title: string;
  description: string;
  color: UnitColor;
  skills: Skill[];
}

export type UnitColor = "green" | "purple" | "blue";

export interface PathData {
  course: CourseInfo;
  units: Unit[];
}

export interface Choice {
  text: string;
  emoji: string | null;
}

export type Exercise =
  | { id: number; type: "multiple_choice"; payload: { prompt: string; variant: "picture" | "text"; choices: Choice[] } }
  | { id: number; type: "translate"; payload: { prompt: string; sentence: string; speak: string | null; bank: string[] } }
  | {
      id: number;
      type: "match_pairs";
      payload: { prompt: string; left: { key: string; text: string }[]; right: { key: string; text: string }[] };
    }
  | {
      id: number;
      type: "fill_blank";
      payload: { prompt: string; before: string; after: string; choices: string[]; translation: string };
    }
  | { id: number; type: "type_answer"; payload: { prompt: string; sentence: string; speak: string | null } };

export type Answer = Record<string, unknown>;

export interface SessionStart {
  session_id: number;
  lesson_id: number;
  skill_title: string;
  is_practice: boolean;
  hearts: number;
  exercises: Exercise[];
}

export interface AnswerResult {
  correct: boolean;
  solution: string;
  note: string | null;
  hearts: number;
  out_of_hearts: boolean;
}

export interface Achievement {
  key: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlocked_at: string | null;
  progress: number;
  threshold: number;
}

export interface CompleteResult {
  xp_earned: number;
  accuracy: number;
  seconds: number;
  streak: number;
  streak_extended: boolean;
  xp_today: number;
  daily_goal_xp: number;
  hearts: number;
  skill_completed: boolean;
  new_achievements: Achievement[];
}

export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  display_name: string;
  avatar_color: string;
  weekly_xp: number;
  is_me: boolean;
}

export interface Leaderboard {
  league: string;
  week_start: string;
  days_left: number;
  entries: LeaderboardEntry[];
}

export interface Profile {
  me: Me;
  joined: string;
  lessons_completed: number;
  skills_completed: number;
  achievements: Achievement[];
  last_7_days: { day: string; xp: number }[];
}

export interface GuidebookPhrase {
  text: string;
  translation: string;
}

export interface GuidebookSection {
  kind: "phrases" | "tip";
  title: string;
  body: string | null;
  phrases: GuidebookPhrase[];
}

export interface Guidebook {
  unit_id: number;
  unit_position: number;
  unit_title: string;
  description: string;
  color: UnitColor;
  language_code: string;
  sections: GuidebookSection[];
}
