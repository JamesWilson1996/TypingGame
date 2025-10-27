import sys
import sqlite3
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Ensure the backend module path is available whether tests are run from repo root or backend/
ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import main


def _setup_temp_db(tmp_path, monkeypatch):
    db_path = tmp_path / "test_typing_game.db"

    def _conn():
        conn = sqlite3.connect(str(db_path))
        conn.row_factory = sqlite3.Row
        return conn

    # Initialize schema for the temporary database
    conn = _conn()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            wpm INTEGER NOT NULL,
            accuracy INTEGER DEFAULT 0
        )
        """
    )
    conn.commit()
    conn.close()

    # Patch the app to use the temp DB for all connections
    monkeypatch.setattr(main, "get_db_connection", _conn)
    return db_path


def test_submit_and_leaderboard(tmp_path, monkeypatch):
    _setup_temp_db(tmp_path, monkeypatch)
    client = TestClient(main.app)

    # Submit a few scores (include a tiebreaker on accuracy)
    payloads = [
        {"name": "Alice", "wpm": 60, "accuracy": 95},
        {"name": "Bob", "wpm": 75, "accuracy": 90},
        {"name": "Cara", "wpm": 75, "accuracy": 98},  # should rank above Bob
    ]
    for p in payloads:
        r = client.post("/api/submit", json=p)
        assert r.status_code == 200

    r = client.get("/api/leaderboard")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 3
    # Ordered by wpm desc, then accuracy desc
    assert [d["name"] for d in data] == ["Cara", "Bob", "Alice"]


def test_results_pagination_and_sort(tmp_path, monkeypatch):
    _setup_temp_db(tmp_path, monkeypatch)
    client = TestClient(main.app)

    # Create multiple rows (ids increment)
    for i in range(1, 6):
        r = client.post(
            "/api/submit",
            json={"name": f"User{i}", "wpm": 50 + i, "accuracy": 80 + i},
        )
        assert r.status_code == 200

    # Default: latest (id desc), limit=20 default in API but we can request 2
    r = client.get("/api/results", params={"limit": 2, "offset": 0})
    assert r.status_code == 200
    body = r.json()
    assert body["total"] == 5
    assert len(body["results"]) == 2
    # Latest first: should include highest ids first (User5 then User4)
    assert [row["name"] for row in body["results"]] == ["User5", "User4"]

    # Sort by wpm asc
    r2 = client.get(
        "/api/results",
        params={"limit": 3, "offset": 0, "sort": "wpm", "order": "asc"},
    )
    assert r2.status_code == 200
    body2 = r2.json()
    names = [row["name"] for row in body2["results"]]
    # Lowest WPM first
    assert names[:3] == ["User1", "User2", "User3"]


def test_reset_endpoint(tmp_path, monkeypatch):
    _setup_temp_db(tmp_path, monkeypatch)
    client = TestClient(main.app)

    r = client.post("/api/submit", json={"name": "Tester", "wpm": 70, "accuracy": 99})
    assert r.status_code == 200

    r = client.post("/api/reset")
    assert r.status_code == 200
    assert r.json()["message"].lower().startswith("scores reset")

    # Verify empty
    r = client.get("/api/leaderboard")
    assert r.status_code == 200
    assert r.json() == []
