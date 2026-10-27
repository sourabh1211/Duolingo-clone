🦊 lingoleap — Learn Languages, One Leap at a Time

<p align="center">
<strong>A gamified, full-stack language learning experience.</strong>
<br />
Learn Spanish through interactive lessons, build daily streaks, earn XP, and compete with friends — all in one playful learning experience.
</p>

<p align="center">
<img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js 14" />
<img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
<img src="https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
<img src="https://img.shields.io/badge/Playwright-Tested-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" />
</p>

<p align="center">
<a href="#-getting-started">Get Started</a> •
<a href="#-features">Features</a> •
<a href="#-architecture">Architecture</a> •
<a href="#-deployment">Deployment</a>
</p>

✨ About the Project

lingoleap is a full-stack language learning web application inspired by the engaging mechanics of gamified learning platforms.

Follow a visual learning path, complete bite-sized lessons, practice vocabulary and grammar, earn experience points, maintain your daily streak, and climb the weekly leaderboard.

The experience combines an interactive Next.js frontend with a FastAPI backend that handles lesson sessions, answer validation, progress tracking, hearts, rewards, and achievements.

Meet Pip, the original fox mascot that guides learners throughout their journey. 🦊

Built as a learning project exploring full-stack development, interactive UI design, REST APIs, database modeling, and automated testing.
🚀 Features
📚 Interactive Learning
Visual, zigzag learning path with three units and nine skills.
Active, completed, and locked lesson states.
Lesson progress rings, crowns, and reward chests.
Unit-specific guidebooks with translations and grammar explanations.
Spanish pronunciation tiles with browser-based audio.
🎮 Gamified Lessons
Five exercise types:
Multiple choice
Translation with a word bank or keyboard
Match the pairs
Fill in the blank
Type the answer
Instant answer feedback and progress tracking.
Incorrect exercises return to the queue until solved.
Keyboard shortcuts for faster navigation.
Lesson completion summaries with XP, accuracy, and time.
❤️ Progress & Rewards
Hearts that decrease when you make mistakes.
Automatic heart regeneration every 30 minutes.
Heart refills using gems.
Practice mode for earning hearts.
Daily streaks and longest streak tracking.
Configurable daily XP goals.
Daily quests and seven achievements.
Weekly Bronze league with a promotion zone.
👤 Profile & Social
Learner statistics and progress summaries.
Seven-day XP history chart.
Achievement tracking.
Weekly leaderboard with seeded rival learners.
Leaderboard unlock progression.
🎨 Modern User Experience
Responsive desktop, tablet, and mobile layouts.
Dark mode by default, with a light theme option.
Sidebar navigation and mobile bottom navigation.
Animated feedback, celebration screens, and confetti.
Browser speech synthesis and generated sound effects.
Bottom-sheet modals on mobile devices.
🛠️ Developer Experience
REST API with interactive Swagger documentation.
SQLAlchemy 2 ORM and SQLite persistence.
Automatically seeded demo data.
Controllable application clock for streak testing.
Developer utilities for resetting demo progress.
Pytest backend tests and Playwright end-to-end tests.
🧰 Tech Stack
Technology	Purpose
Next.js 14	Frontend framework and App Router
TypeScript	Type-safe frontend development
Tailwind CSS	Responsive styling and UI design
FastAPI	Backend REST API
SQLAlchemy 2	Database ORM
SQLite	Persistent relational data
Pydantic	API validation and schemas
Pytest	Backend and game-rule testing
Playwright	Browser automation and E2E testing
Nunito	Open-source interface typography
🖥️ Getting Started

Follow these steps to run lingoleap locally.

Prerequisites

Make sure you have installed:

Python 3.12–3.14
Node.js 18.18 or newer (Node.js 20+ recommended)
npm
Git
1. Clone the repository
bash
git clone <YOUR_REPOSITORY_URL>
cd lingoleap


Replace <YOUR_REPOSITORY_URL> with your GitHub repository URL.

2. Start the backend

Open a terminal:

bash
cd backend
python -m venv .venv


Activate the virtual environment.

Windows — PowerShell

powershell
.venv\Scripts\Activate.ps1


macOS / Linux

bash
source .venv/bin/activate


Install dependencies:

bash
pip install -r requirements-dev.txt


Start the API server:

bash
uvicorn app.main:app --reload --port 8000


The backend will be available at:

API: http://localhost:8000
Swagger documentation: http://localhost:8000/docs
ReDoc: http://localhost:8000/redoc

The database is initialized and seeded automatically on first startup.

3. Start the frontend

Open a second terminal:

bash
cd frontend
npm install
npm run dev


Open the application:

http://localhost:3000

That's it! Your local learning environment should now be ready. 🎉

⚡ Quick Setup with VS Code

Prefer using VS Code?

Open the repository folder.
Install the recommended extensions.
Run Terminal → Run Task → Setup: everything.
Open Run and Debug.
Select Full stack (backend + frontend) and start debugging.
Visit http://localhost:3000.
🧪 Testing

lingoleap includes automated tests for backend game rules and browser-based user flows.

Backend tests
bash
cd backend
pytest -q

Frontend end-to-end tests
bash
cd frontend
npx playwright install chromium
npx playwright test


Playwright can start the frontend and backend automatically when configured to do so. Activate the backend virtual environment first so the configured Python command resolves correctly.

🏗️ Architecture

lingoleap follows a client-server architecture with a typed frontend, a REST API, and a relational database.

text
lingoleap/
│
├── frontend/                 # Next.js application
│   ├── src/app/               # App Router pages
│   ├── src/components/        # UI and lesson components
│   ├── src/context/           # Shared learner state
│   ├── src/lib/               # API client, types and utilities
│   └── e2e/                   # Playwright tests
│
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── routers/           # REST API endpoints
│   │   ├── services/          # Game and progress logic
│   │   ├── seed/              # Course content and seed data
│   │   ├── models.py          # SQLAlchemy models
│   │   ├── schemas.py         # Pydantic schemas
│   │   ├── database.py        # Database configuration
│   │   └── clock.py           # Testable application clock
│   ├── tests/                 # Pytest test suite
│   └── requirements.txt
│
└── README.md

Request flow
text
┌──────────────────────────────┐
│       Next.js Frontend       │
│                              │
│ Learning Path · Lessons      │
│ Profile · Leaderboard        │
└──────────────┬───────────────┘
               │
               │ JSON / HTTP
               ▼
┌──────────────────────────────┐
│        FastAPI Backend       │
│                              │
│ Routers · Validation         │
│ Game Rules · Progress        │
│ XP · Hearts · Achievements   │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       SQLite Database        │
│                              │
│ Users · Lessons · Sessions   │
│ Answers · XP · Achievements  │
└──────────────────────────────┘

Key engineering decisions
Server-side answer validation: Correct answers are checked by the backend, not trusted from the browser.
Session-based lessons: Each lesson attempt records answers, mistakes, and completion status.
Lazy heart regeneration: Hearts regenerate when the learner's state is read, without requiring a background worker.
Deterministic exercise generation: Exercises are generated from structured course content.
Retry queue: Incorrect exercises are revisited until answered correctly.
Derived learning progress: Lesson lock states are calculated from skill completion.
Testable time: A controllable clock makes streak behavior testable without waiting for real days to pass.
🔌 API Overview

All API endpoints return JSON unless otherwise specified.

Method	Endpoint	Description
GET	/api/me	Get learner statistics
PATCH	/api/me/settings	Update learner settings
GET	/api/me/profile	Retrieve profile and achievements
GET	/api/course/path	Fetch units, skills, and progress
GET	/api/units/{id}/guidebook	Retrieve unit learning material
POST	/api/lessons/{id}/sessions	Start a lesson
POST	/api/practice/sessions	Start a practice session
POST	/api/sessions/{id}/answers	Submit an exercise answer
POST	/api/sessions/{id}/complete	Complete a lesson and award XP
POST	/api/sessions/{id}/abandon	Abandon a lesson
GET	/api/leaderboard	Fetch weekly league standings
POST	/api/shop/refill-hearts	Purchase a heart refill

For the complete request and response schemas, visit:

http://localhost:8000/docs

🎯 Game Mechanics
Mechanic	Rule
Lesson reward	10 XP
Perfect lesson bonus	+5 XP
Heart penalty	−1 heart per mistake
Heart regeneration	1 heart every 30 minutes
Heart refill	350 gems
Default daily goal	10 XP
Available daily goals	10, 20, 30, or 50 XP
Leaderboard unlock	After 10 completed lessons
Learning content	3 units and 9 skills
Achievements	7 unlockable achievements

These values reflect the current demo configuration and may be adjusted in the application settings or source code.

🌐 Deployment

The application is configured for deployment using Vercel for the frontend and Render for the backend.

Deployment architecture
text
           User's Browser
                  │
                  ▼
          Vercel / Next.js
                  │
                  │ /api/* rewrite
                  ▼
           Render / FastAPI
                  │
                  ▼
          SQLite or Turso

1. Deploy the backend to Render
Push your project to GitHub.
Create a new Blueprint in Render.
Connect your repository and use the existing render.yaml.
Configure CORS_ORIGINS with your frontend's production origin.
Deploy and verify the health endpoint.
text
https://YOUR-RENDER-SERVICE.onrender.com/api/health

2. Deploy the frontend to Vercel
Import the GitHub repository into Vercel.
Set the root directory to frontend.
Configure the BACKEND_URL environment variable with your Render backend URL, without an /api suffix.
Deploy the application.

Example:

env
BACKEND_URL=https://YOUR-RENDER-SERVICE.onrender.com

3. Verify the deployment

Open the deployed frontend and check that:

The learning path loads successfully.
Lesson sessions can be started and completed.
Progress and learner statistics update.
The health endpoint returns a successful response.

Production note: Render's persistent disks require a paid service. A free service's local SQLite data may not survive restarts or redeployments. For durable storage, configure a persistent disk or the supported Turso database option. Keep developer routes disabled in production.

🔐 Security & Design Notes
The backend owns lesson validation, heart deductions, and XP awards.
Exercise solutions are not sent with the initial lesson payload.
Developer endpoints should be disabled in production.
The demo currently uses a seeded default learner rather than full user authentication.
Production deployments should add authentication, authorization, rate limiting, and appropriate database backups before supporting real users.
🗺️ Roadmap

Potential future improvements include:

User registration and authentication.
Multiple language courses.
Speaking and pronunciation assessment.
Friend challenges and social learning.
Streak freezes and subscription features.
Expanded lessons and adaptive difficulty.
More leagues and competitive events.
Additional persistence and deployment options.

Some of these features are currently represented by UI placeholders.

🎨 Original Branding

lingoleap takes inspiration from the visual patterns of gamified language learning while maintaining its own identity.

Brand: lingoleap
Mascot: Pip the fox 🦊
Typography: Nunito
Visual style: Playful, colorful, responsive, and accessible
Learning focus: Spanish for English speakers

The project does not use Duolingo's owl, logo, wordmark, or proprietary font. All branding is designed around the original lingoleap identity.

🤝 Contributing

Contributions, bug reports, and ideas are welcome!

Fork the repository.
Create a feature branch:
bash
git checkout -b feature/your-feature

Make your changes and add tests where appropriate.
Run the backend and frontend test suites.
Commit your changes:
bash
git commit -m "feat: add your feature"

Push your branch and open a pull request.
📄 License

No license has been specified yet. Add a LICENSE file before distributing the project under an open-source license.

<p align="center">
<strong>🦊 lingoleap</strong>
<br />
Every word is progress. Every lesson is a leap.
<br /><br />
<sub>Built with Next.js, FastAPI, SQLAlchemy, and a love for learning.</sub>
</p>
