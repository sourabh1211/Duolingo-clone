# lingoleap: a Duolingo-style language learning app

A full-stack clone of the Duolingo web experience. You move along a learning path, play
lessons made of five exercise types, earn XP, keep a streak, lose and regain hearts, and
compete in a weekly league.

**Stack:** Next.js 14 (App Router, TypeScript, Tailwind CSS) · FastAPI · SQLAlchemy 2 · SQLite · Playwright

> The app recreates Duolingo's layout, palette, motion and UX patterns. It does **not** use
> Duolingo's trademarks: the owl, logo, wordmark and proprietary font are replaced by an
> original fox mascot ("Pip"), the name `lingoleap` (set in `frontend/src/lib/brand.ts`) and
> the open-source Nunito font.

---

## Quick start

Requirements: Python 3.12–3.14 and Node 18.18+ (Node 20+ recommended). On Windows no C++ build tools are needed: every Python package installs from a prebuilt wheel.

### Option A: VS Code (recommended)

1. Open the repository folder in VS Code and install the recommended extensions when prompted.
2. `Terminal → Run Task… → Setup: everything` (creates `backend/.venv` and installs packages).
3. `Run and Debug → Full stack (backend + frontend) → ▶`. The backend runs under the debugger, so breakpoints work.
4. Open http://localhost:3000.

### Option B: terminal

```bash
# backend
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt   # runtime + test tools
uvicorn app.main:app --reload --port 8000

# frontend (second terminal)
cd frontend
npm install
npm run dev
```

Settings live in `backend/.env` (database path, CORS origins, heart timer, dev routes) and
`frontend/.env` (`BACKEND_URL`, where `/api/*` is forwarded). Both ship with working local defaults, so there is
nothing to copy. Edit them in place. The backend loads its `.env` on startup, and real
environment variables (e.g. on Render) override it.

The database is created and seeded automatically on first start. To start over:
`python -m app.seed.seed --reset` (or **Settings → Developer tools → Reset demo** in the app).

Interactive API docs: http://localhost:8000/docs

### Tests

```bash
cd backend && pytest -q                       # API + game rules (10 tests)
cd frontend && npx playwright install chromium && npx playwright test   # e2e, desktop + mobile
```

Playwright starts both servers itself if they aren't running. Activate the backend venv first so `python` resolves to it.

---

## Features

| Area | What's implemented |
| --- | --- |
| Learning path | 3 units / 9 skills, zig-zag node path, sticky unit banners with a Guidebook button, completed / active / locked states, progress ring on the active skill, crowns, reward chests, "Jump here" marker, lesson popover |
| Guidebook | Per-unit page (from the banner's Guidebook button): key phrases in speech bubbles with audio and hover/tap translations, plus grammar tips with example tables; stored in the database |
| Sounds | Spanish vowels and tricky consonants as tappable tiles with audio |
| Right rail | Super upsell card (opens "coming soon"), Unlock Leaderboards card until 10 lessons are done, then the league card, Daily Quests |
| Top bar | Course flag, streak (grey until you practice today), gems, hearts, each opening a detail panel (next-heart timer, refill, practice) |
| Lesson player | Multiple choice (picture and text), translate with word bank or keyboard, match pairs, fill in the blank, type the answer; Check/Skip bar; green/red feedback bar; progress bar; hearts; missed exercises re-queued until solved; combo counter; Enter and 1–9 keyboard shortcuts |
| Celebration flow | Lesson complete (XP, accuracy, time, confetti), "day streak!" screen when the streak grows, achievement unlocked screen |
| Hearts | −1 per mistake, regenerate 1 every 30 min, refill for 350 gems, "practice to earn hearts" mode (mistakes are free, +1 heart on finish), out-of-hearts modal, quit confirmation |
| Gamification | XP, daily goal (10/20/30/50), daily quests, streak + longest streak, weekly Bronze league with promotion zone, 7 achievements |
| Profile | Stats, last-7-days XP chart, achievements with progress |
| Extras (bonus) | Text-to-speech audio (browser voices), synthesized sound effects, dark mode (the default; light mode in Settings), achievements, functioning leaderboard across seeded users |
| Placeholders | Super subscription, streak freeze, guidebook, notifications, friends, speaking exercises: shown as "Coming soon" |
| Responsive | Desktop: full sidebar + right rail · Tablet: icon sidebar + top bar · Phone: top bar + bottom nav, bottom-sheet modals |

---

## Architecture

```
┌────────────────────────── frontend/ (Next.js) ─────────────────────────┐
│ app/(main)/*      pages with sidebar + right rail (learn, leaderboard…) │
│ app/lesson/[id]   full-screen lesson player                             │
│ components/       ui · layout · path · lesson/exercises · cards         │
│ context/          LearnerContext: stats shared by all screens + toasts  │
│ lib/api.ts        typed fetch client (same-origin /api, proxied)        │
└──────────────────────────────┬─────────────────────────────────────────┘
                               │ JSON over HTTP (CORS)
┌──────────────────────────────▼──────── backend/ (FastAPI) ─────────────┐
│ routers/    me · course · lessons · social (leaderboard, shop) · dev   │
│ services/   answers (checking) · gamification (hearts, streak, XP,     │
│             achievements) · progress (lock states) · presenters        │
│ models.py   SQLAlchemy ORM   ·   schemas.py  Pydantic API contract     │
│ clock.py    controllable "now" for testing streaks                     │
│ seed/       content.py (course data) → generator.py (exercises)        │
└──────────────────────────────┬─────────────────────────────────────────┘
                               ▼
                         SQLite (lingo.db)
```

Key design decisions:

1. **The server owns all game state.** The client never receives answers. Each answer is posted
   to the active *lesson session*, checked on the server, and hearts are deducted there. A
   lesson can only be completed when every exercise has a correct answer recorded, so XP
   can't be faked from the browser.
2. **Routers are thin.** Rules live in `services/`, so they can be unit-tested without HTTP.
3. **Lazy heart regeneration.** No background job. `hearts_updated_at` is an anchor, and each
   read adds `floor(elapsed / 30 min)` hearts, then moves the anchor forward by exactly that
   many intervals so partial progress toward the next heart isn't lost.
4. **Streak rule.** Finishing a lesson sets `streak = streak + 1` if you last practiced
   yesterday, leaves it alone if you already practiced today, and resets it to 1 otherwise.
   The *displayed* streak is 0 once a full day has been missed (`current_streak()`).
5. **A controllable clock.** All date logic goes through `clock.now()`, which adds a day offset
   stored in the DB. `POST /api/dev/advance-day` lets you test streak continuation and
   breaking without waiting a day.
6. **Content is generated from data.** `seed/content.py` lists words and sentences per skill.
   `generator.py` deterministically builds 7 varied exercises per lesson, and review (trophy)
   skills mix the whole unit. Adding a skill means editing data, not code.
7. **Retry queue.** The lesson player keeps a queue of exercise indexes. A wrong answer moves
   the exercise to the back, as in the original app, and progress counts only correct answers.

---

## Database schema

```mermaid
erDiagram
    languages ||--o{ courses : has
    courses ||--o{ units : has
    units ||--o{ skills : has
    units ||--o{ guidebook_sections : explains
    guidebook_sections ||--o{ guidebook_phrases : lists
    skills ||--o{ lessons : has
    lessons ||--o{ exercises : has
    users ||--o{ skill_progress : tracks
    skills ||--o{ skill_progress : "progress of"
    users ||--o{ lesson_sessions : plays
    lessons ||--o{ lesson_sessions : "attempt of"
    lesson_sessions ||--o{ session_answers : records
    exercises ||--o{ session_answers : "answer to"
    users ||--o{ daily_xp : earns
    users ||--o{ user_achievements : unlocks
    achievements ||--o{ user_achievements : "granted as"
    courses ||--o{ users : "current course"

    languages { int id PK; string code UK; string name; string flag }
    courses { int id PK; int language_id FK; string from_language; string title }
    units { int id PK; int course_id FK; int position; string title; string description; string color }
    skills { int id PK; int unit_id FK; int position; string title; string icon }
    lessons { int id PK; int skill_id FK; int position }
    exercises { int id PK; int lesson_id FK; int position; string type; json payload; json solution }
    users { int id PK; string username UK; string display_name; bool is_default; int current_course_id FK; int total_xp; int gems; int hearts; datetime hearts_updated_at; int streak; int longest_streak; date last_active_date; int daily_goal_xp }
    skill_progress { int id PK; int user_id FK; int skill_id FK; int lessons_completed; int crowns; datetime completed_at }
    lesson_sessions { int id PK; int user_id FK; int lesson_id FK; string status; bool is_practice; int correct_count; int mistakes; int xp_earned; datetime started_at; datetime finished_at }
    session_answers { int id PK; int session_id FK; int exercise_id FK; json answer; bool is_correct; datetime created_at }
    daily_xp { int id PK; int user_id FK; date day; int xp; int lessons }
    guidebook_sections { int id PK; int unit_id FK; int position; string kind; string title; text body }
    guidebook_phrases { int id PK; int section_id FK; int position; string text; string translation }
    achievements { int id PK; string key UK; string title; string icon; string metric; int threshold }
    user_achievements { int id PK; int user_id FK; int achievement_id FK; datetime unlocked_at }
    app_state { string key PK; string value }
```

Notes:

- **Ordering.** Ordering uses `position` columns with `UNIQUE(parent_id, position)`, so the path order is explicit and can't contain duplicates.
- **Exercise data.** `exercises.payload` (sent to the client) and `exercises.solution` (server only) are JSON, because each exercise type has a different shape. Shapes are documented at the top of `services/answers.py`.
- **`daily_xp`.** One row per user per day. It feeds the daily goal, the 7-day chart and the weekly league, so no aggregate needs to be stored on `users`.
- **Skill progress.** `skill_progress.lessons_completed` counts progress toward the next crown and resets to 0 when a crown is earned. A skill is *completed* once `crowns ≥ 1`. Lock state is derived rather than stored: the first non-completed skill in path order is active and later ones are locked.
- **Guidebook.** `guidebook_sections` (kind = phrases or tip, with optional explanation text) hold ordered `guidebook_phrases` (text + translation). It's relational rather than one JSON blob so phrases can be reused, reordered, or linked to exercises later.
- **Integrity.** Foreign keys are enforced (SQLite `PRAGMA foreign_keys=ON`), and content tables cascade on delete.

---

## API overview

All endpoints are JSON and act as the default learner. Full schemas are at `/docs`.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/me` | Learner stats: hearts (+ seconds to next), streak, gems, XP today/week, lessons finished (for the leaderboard unlock), course |
| PATCH | `/api/me/settings` | Update `display_name`, `daily_goal_xp` |
| GET | `/api/me/profile` | Stats, 7-day XP history, achievements with progress |
| GET | `/api/units/{id}/guidebook` | Key phrases and grammar tips for a unit (readable even while locked) |
| GET | `/api/course/path` | Units → skills with `state`, ring progress, crowns, `next_lesson_id` |
| POST | `/api/lessons/{id}/sessions` | Start a lesson (403 if locked, 409 if no hearts); returns exercises **without answers** |
| POST | `/api/practice/sessions` | Start a practice session from a finished skill |
| POST | `/api/sessions/{id}/answers` | `{exercise_id, answer}` → `{correct, solution, note, hearts, out_of_hearts}` |
| POST | `/api/sessions/{id}/complete` | Award XP, update streak / skill progress / achievements; returns the summary |
| POST | `/api/sessions/{id}/abandon` | Quit a lesson |
| GET | `/api/leaderboard` | Weekly league standings |
| POST | `/api/shop/refill-hearts` | Spend 350 gems to refill hearts |
| POST | `/api/dev/advance-day` | Shift the clock by `{days}` (testing only; disable with `ENABLE_DEV_ROUTES=false`) |
| POST | `/api/dev/empty-hearts` · `/api/dev/reset` | Testing helpers |

Answer formats: multiple choice `{index}` · translate/type `{text}` · fill blank `{choice}` · match pairs `{pairs: [[l, r], …]}`.
Free-text answers ignore case, punctuation (including ¿ ¡) and extra spaces. Missing accents are accepted with a "Pay attention to the accents" note, as in the original.

---

## Deployment (Render backend + Vercel frontend)

The repository is configured to run FastAPI on Render and Next.js on Vercel. The frontend sends
requests to its own `/api/*` paths; `frontend/next.config.mjs` forwards those requests to Render.

```
browser ──► frontend (Vercel, Next.js) ──/api/* rewrite──► backend (Render, FastAPI) ──► SQLite
```

### 1. Push the project to GitHub

Render and Vercel both deploy from a Git repository. Push this project to GitHub and connect that
repository in each dashboard.

### 2. Deploy the backend to Render

1. In Render, choose **New → Blueprint**, connect the repository, and let Render read the
   repository's `render.yaml`.
2. The blueprint sets the backend root to `backend`, installs `requirements.txt`, starts Uvicorn,
   and checks `/api/health`. Set the prompted `CORS_ORIGINS` value to your eventual Vercel site,
   for example `https://lingoleap.vercel.app`. You can update it after deploying the frontend.
3. The blueprint uses `sqlite:////var/data/lingo.db` on a persistent disk mounted at `/var/data`.
   Persistent disks require a paid Render service and keep learner progress when the service
   restarts. If you use a free service instead, its local SQLite file is temporary; configure
   Turso using `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in Render to keep data durable, and
   remove the `disk` block from `render.yaml`.
4. Wait for the deploy, then check `https://<your-render-service>.onrender.com/api/health`.
   Expect `{"status":"ok","database":"sqlite-file"}` with the disk, or `"database":"turso"` with
   Turso. The first boot creates and seeds the database.
5. Keep `ENABLE_DEV_ROUTES=false` in production. The blueprint already sets this; it disables
   endpoints that can reset the database or alter the app clock.

### 3. Deploy the frontend to Vercel

1. In Vercel, import the same GitHub repository and set **Root Directory** to `frontend`.
   Vercel should detect Next.js; the build command is `npm run build`.
2. Add the environment variable `BACKEND_URL` with the Render service's base URL, such as
   `https://lingo-api.onrender.com` (no `/api` suffix). Apply it to Production and Preview if you
   want both environments to work, then deploy.
3. The Vercel build intentionally fails if `BACKEND_URL` is missing or points to localhost.
   Check `https://<your-vercel-site>/api/health`; it should return the backend health response.

### 4. Finish configuration and verify

Update Render's `CORS_ORIGINS` to the exact Vercel production origin, with no trailing slash, and
redeploy/restart the backend. The frontend's rewrite means normal app traffic is proxied
server-side, but keeping the allowed origin accurate is appropriate if the API is called directly.
Then open the Vercel site and try loading the learning path and completing a lesson. Check Render
logs if `/api/health` or app requests fail. Render's free web services may sleep when idle, so the
first request after inactivity can take longer.

No frontend source changes are required for deployment. The Render blueprint disables developer
routes by default; `frontend/src/lib/api.ts` still contains developer-tool calls, but they will
return 404 in production.

## Assumptions

- **Authentication** is simplified. Every request acts as the seeded default learner (`is_default`). Swapping `deps.get_current_user` for real auth touches no router.
- **One course** is seeded (Spanish for English speakers). The schema supports more.
- **Match pairs:** the payload exposes pair keys because instant per-tap feedback needs them. The server still verifies the full mapping. Mismatched taps don't cost hearts, as in the original.
- **Time zone:** days are computed in UTC.
- **Leaderboard unlock:** a learner joins the league after finishing 10 lessons (`leaderboard_unlock_lessons` in config). The seeded learner has 7, so the "Complete 3 more lessons" card shows.
- **Leaderboard:** there is a single "Bronze" league with all users. Rivals' weekly XP is seeded across the current week. Leagues reset Monday.
- **XP:** 10 XP per lesson, +5 for a perfect lesson, practice also gives XP. Heart regeneration is 30 min (`HEART_REGEN_MINUTES`).
- **Audio:** uses the browser's speech synthesis. Quality depends on the voices installed on the device.

---

## Matching the original UI

`npm run reference` (in `frontend/`) opens a real Chrome window on duolingo.com. **You log
in yourself**, then it saves full-page screenshots of the main screens at desktop, tablet and
mobile sizes into `reference/` (git-ignored). Use them to compare spacing and colors side
by side, and don't commit them or reuse their artwork.

## Project structure

```
backend/
  app/
    main.py            app, CORS, router wiring, seed on startup
    config.py          env-driven settings
    database.py        engine, session, FK pragma
    models.py          schema
    schemas.py         API contract
    clock.py           controllable time
    deps.py            current learner
    routers/           me, course, lessons, social, dev
    services/          answers, gamification, progress, presenters
    seed/              content, generator, seed
  tests/               pytest suite
frontend/
  src/app/             routes
  src/components/      ui/, layout/, path/, lesson/, cards/
  src/context/         LearnerContext
  src/lib/             api client, types, sound, speech, format, brand
  e2e/                 Playwright tests
  scripts/             capture-reference.mjs
.vscode/               debug configs, tasks, recommended extensions
```
