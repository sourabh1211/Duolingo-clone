import type {
  Answer,
  Guidebook,
  AnswerResult,
  CompleteResult,
  Leaderboard,
  Me,
  PathData,
  Profile,
  SessionStart,
} from "./types";

// Same-origin: next.config.mjs forwards /api/* to the backend (BACKEND_URL).
const BASE = "";

/** The backend the frontend was built to talk to (for error messages). */
export const BACKEND_URL = process.env.BACKEND_URL_DISPLAY ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "No response. Check your internet connection.");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    // A JSON {detail} comes from FastAPI; anything else means the backend itself wasn't reached.
    if (body?.detail) throw new ApiError(res.status, body.detail);
    throw new ApiError(res.status, explain(res.status));
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

function explain(status: number) {
  if (status === 401 || status === 403)
    return `The backend denied the request (${status}). Check BACKEND_URL and make sure backend access isn't blocked by deployment protection.`;
  if (status === 404) return "Nothing found at the backend URL (404). Check BACKEND_URL points at the backend project.";
  if (status >= 500) return `The backend failed or isn't running (${status}). Check the backend's logs.`;
  return `Request failed (${status}).`;
}

const post = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) });

export const api = {
  me: () => request<Me>("/api/me"),
  updateSettings: (body: { display_name?: string; daily_goal_xp?: number }) =>
    request<Me>("/api/me/settings", { method: "PATCH", body: JSON.stringify(body) }),
  profile: () => request<Profile>("/api/me/profile"),
  path: () => request<PathData>("/api/course/path"),
  guidebook: (unitId: number) => request<Guidebook>(`/api/units/${unitId}/guidebook`),
  startLesson: (lessonId: number) => post<SessionStart>(`/api/lessons/${lessonId}/sessions`),
  startPractice: () => post<SessionStart>("/api/practice/sessions"),
  answer: (sessionId: number, exerciseId: number, answer: Answer) =>
    post<AnswerResult>(`/api/sessions/${sessionId}/answers`, { exercise_id: exerciseId, answer }),
  complete: (sessionId: number) => post<CompleteResult>(`/api/sessions/${sessionId}/complete`),
  abandon: (sessionId: number) => post<void>(`/api/sessions/${sessionId}/abandon`),
  leaderboard: () => request<Leaderboard>("/api/leaderboard"),
  refillHearts: () => post<{ gems: number; hearts: number }>("/api/shop/refill-hearts"),
  dev: {
    advanceDay: (days = 1) => post("/api/dev/advance-day", { days }),
    emptyHearts: () => post("/api/dev/empty-hearts"),
    reset: () => post("/api/dev/reset"),
  },
};
