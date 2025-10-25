from fastapi import FastAPI
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

@app.post("/api/submit")
def submit_score(score: Score):
    conn = get_db_connection()
    conn.execute("INSERT INTO scores (name, wpm) VALUES (?, ?)", (score.name, score.wpm))
    conn.commit()
    conn.close()
    return {"message": "Score saved successfully"}

@app.get("/api/leaderboard")
def get_leaderboard():
    conn = get_db_connection()
    rows = conn.execute("SELECT name, wpm FROM scores ORDER BY wpm DESC LIMIT 10").fetchall()
    conn.close()
    return [{"name": row["name"], "wpm": row["wpm"]} for row in rows]