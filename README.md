# TypingGame — Timed Typing Speed Test

A simple typing speed game with a local leaderboard designed for running offline or on a local network. The app consists of a React (Vite) frontend and a FastAPI + SQLite backend, wired to run locally or via Docker Compose.

## Quick Start (Docker Compose)
Prerequisites: Docker and Docker Compose installed.

1) Clone the repo
- `git clone https://github.com/JamesWilson1996/TypingGame`
- `cd TypingGame`

2) Build and start the stack
- `docker compose build`
- `docker compose up -d`

3) Open the app
- Frontend: `http://localhost:8080`
- Backend (direct): `http://localhost:8000/api`

4) Stop the stack
- `docker compose down`

Notes
- The SQLite DB is stored inside the backend container (`/app/typing_game.db`). It will reset if the container is removed. To persist data across container recreations, add a volume:
  - Example (compose override):
    - under `backend:` add:
      - `volumes:`
      - `  - ./data:/app`  (then `.gitignore` the `data/` folder if needed)

## Local Development (Optional)
Run backend:
- `cd backend`
- `python -m venv .venv && . .venv/bin/activate` (Windows: `.venv\Scripts\activate`)
- `pip install -r requirements.txt`
- `uvicorn main:app --reload`

Run frontend:
- `cd frontend`
- `npm install`
- `npm run dev` → open the printed `http://localhost:5173`

Dev Proxy
- Vite proxies `/api` to `http://127.0.0.1:8000` (configured in `frontend/vite.config.js`), so the frontend can call relative `/api/...` in dev.

## Configuration
- Frontend API base: defaults to `"/api"` (same‑origin). You can override with `VITE_API_URL` at build time if hosting the API elsewhere.

## Useful Commands
- Reset leaderboard (Docker or local):
  - `curl -X POST http://localhost:8000/api/reset`

## Tests
- Backend unit tests (pytest):
  - `cd backend`
  - `pip install -r requirements-dev.txt`
  - `pytest -q`

## Security
- The reset endpoint is unauthenticated for convenience. Gate this behind an auth check or remove it before production use.
