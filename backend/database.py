
import sqlite3

DATABASE_NAME = "learnable.db"


def get_connection():
    """Connect to the LearnAble SQLite database."""
    connection = sqlite3.connect(DATABASE_NAME)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():
    """Create the required database tables if they do not exist."""

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS topics (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            unit TEXT,
            status TEXT NOT NULL DEFAULT 'not_started'
                CHECK (status IN ('not_started', 'reviewed'))
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS quiz_attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic_id TEXT,
            score INTEGER NOT NULL,
            total INTEGER NOT NULL,
            FOREIGN KEY (topic_id) REFERENCES topics(id)
        )
    """)

    connection.commit()
    connection.close()


def add_topic(topic_id, title, unit=""):
    """Save a topic in the database."""

    connection = get_connection()

    connection.execute(
        """
        INSERT INTO topics (id, title, unit)
        VALUES (?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            title = excluded.title,
            unit = excluded.unit
        """,
        (topic_id, title, unit)
    )

    connection.commit()
    connection.close()


def get_topics():
    """Return all saved topics."""

    connection = get_connection()

    rows = connection.execute(
        "SELECT id, title, unit, status FROM topics ORDER BY id"
    ).fetchall()

    connection.close()

    return [dict(row) for row in rows]


def update_topic_status(topic_id, status):
    """Change a topic's status."""

    if status not in ("not_started", "reviewed"):
        raise ValueError("Status must be not_started or reviewed.")

    connection = get_connection()

    cursor = connection.execute(
        "UPDATE topics SET status = ? WHERE id = ?",
        (status, topic_id)
    )

    connection.commit()
    updated = cursor.rowcount
    connection.close()

    if updated == 0:
        raise ValueError(f"Topic not found: {topic_id}")


def record_quiz_attempt(topic_id, score, total):
    """Save a quiz score."""

    if not isinstance(score, int) or isinstance(score, bool):
        raise ValueError("Score must be an integer.")

    if not isinstance(total, int) or isinstance(total, bool):
        raise ValueError("Total must be an integer.")

    if total <= 0 or score < 0 or score > total:
        raise ValueError("Invalid quiz score or total.")

    connection = get_connection()

    connection.execute(
        """
        INSERT INTO quiz_attempts (topic_id, score, total)
        VALUES (?, ?, ?)
        """,
        (topic_id, score, total)
    )

    connection.commit()
    connection.close()


def get_quiz_stats(topic_id=None):
    """Return the total correct and attempted questions."""

    connection = get_connection()

    if topic_id is None:
        row = connection.execute(
            """
            SELECT COALESCE(SUM(score), 0) AS correct,
                   COALESCE(SUM(total), 0) AS attempted
            FROM quiz_attempts
            """
        ).fetchone()
    else:
        row = connection.execute(
            """
            SELECT COALESCE(SUM(score), 0) AS correct,
                   COALESCE(SUM(total), 0) AS attempted
            FROM quiz_attempts
            WHERE topic_id = ?
            """,
            (topic_id,)
        ).fetchone()

    connection.close()

    return {
        "correct": row["correct"],
        "attempted": row["attempted"]
    }
