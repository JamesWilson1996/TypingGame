from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import get_db_connection, init_db

app = FastAPI()
init_db()

# Allow React frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Score(BaseModel):
    name: str
    wpm: int
    accuracy: int

@app.post("/api/submit")
def submit_score(score: Score):
    conn = get_db_connection()
    conn.execute(
        "INSERT INTO scores (name, wpm, accuracy) VALUES (?, ?, ?)",
        (score.name, score.wpm, score.accuracy),
    )
    conn.commit()
    conn.close()
    return {"message": "Score saved successfully"}

@app.get("/api/leaderboard")
def get_leaderboard():
    conn = get_db_connection()
    rows = conn.execute(
        "SELECT name, wpm, accuracy FROM scores ORDER BY wpm DESC, accuracy DESC LIMIT 10"
    ).fetchall()
    conn.close()
    return [
        {"name": row["name"], "wpm": row["wpm"], "accuracy": row["accuracy"]}
        for row in rows
    ]

@app.post("/api/reset")
def reset_scores():
    """Delete all scores (truncate table)."""
    conn = get_db_connection()
    conn.execute("DELETE FROM scores")
    # Reset AUTOINCREMENT sequence if present (SQLite-specific)
    try:
        conn.execute("DELETE FROM sqlite_sequence WHERE name='scores'")
    except Exception:
        pass
    conn.commit()
    conn.close()
    return {"message": "Scores reset"}

@app.get("/api/results")
def get_results(
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    sort: str = Query("latest", pattern="^(latest|wpm|accuracy|name)$"),
    order: str = Query("desc", pattern="^(asc|desc)$"),
):
    """Return paginated results with total count. Supports sorting and pagination.

    sort: latest|wpm|accuracy|name
    order: asc|desc
    """
    # Build ORDER BY clause safely via whitelist
    if sort == "latest":
        primary = "id"
    elif sort == "wpm":
        primary = "wpm"
    elif sort == "accuracy":
        primary = "accuracy"
    elif sort == "name":
        primary = "name"
    else:
        primary = "id"

    direction = "DESC" if order.lower() == "desc" else "ASC"

    # For stable ordering, add tiebreakers
    if primary == "wpm":
        order_by = f"wpm {direction}, accuracy {direction}, id DESC"
    elif primary == "accuracy":
        order_by = f"accuracy {direction}, wpm {direction}, id DESC"
    elif primary == "name":
        order_by = f"name COLLATE NOCASE {direction}, id DESC"
    else:  # latest/id
        order_by = f"id {direction}"

    conn = get_db_connection()
    total_row = conn.execute("SELECT COUNT(*) as c FROM scores").fetchone()
    rows = conn.execute(
        f"SELECT id, name, wpm, accuracy FROM scores ORDER BY {order_by} LIMIT ? OFFSET ?",
        (limit, offset),
    ).fetchall()
    conn.close()
    return {
        "total": total_row["c"] if total_row else 0,
        "results": [
            {"id": r["id"], "name": r["name"], "wpm": r["wpm"], "accuracy": r["accuracy"]}
            for r in rows
        ],
    }
