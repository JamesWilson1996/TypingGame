import sqlite3

def get_db_connection():
    conn = sqlite3.connect("typing_game.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
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
    # In case the table existed without the accuracy column, try to add it
    try:
        conn.execute("ALTER TABLE scores ADD COLUMN accuracy INTEGER DEFAULT 0")
    except Exception:
        # Column likely already exists; ignore
        pass
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
