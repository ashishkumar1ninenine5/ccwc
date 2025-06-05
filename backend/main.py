from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
import sqlite3

app = FastAPI()
DB_PATH = "todo.db"


def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            "CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, completed INTEGER DEFAULT 0, due_date TEXT)"
        )
        # ensure due_date column exists for older databases
        cols = [r[1] for r in conn.execute("PRAGMA table_info(tasks)").fetchall()]
        if "due_date" not in cols:
            conn.execute("ALTER TABLE tasks ADD COLUMN due_date TEXT")


init_db()


class Task(BaseModel):
    id: int | None = None
    title: str
    completed: bool = False
    due_date: str | None = None


@app.get("/health")
def health() -> dict:
    """Simple health check endpoint."""
    return {"status": "ok"}


@app.get("/")
def index() -> FileResponse:
    """Serve the React front-end."""
    index_path = os.path.join("frontend", "index.html")
    return FileResponse(index_path)


@app.get("/index.js")
def index_js() -> FileResponse:
    """Serve the bundled React application."""
    js_path = os.path.join("frontend", "index.js")
    return FileResponse(js_path)


@app.get("/styles.css")
def styles_css() -> FileResponse:
    """Serve the Bulma-based stylesheet."""
    css_path = os.path.join("frontend", "styles.css")
    return FileResponse(css_path)


@app.get("/tasks")
def list_tasks(status: str | None = None):
    """List tasks filtered by status."""
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        query = "SELECT id, title, completed, due_date FROM tasks"
        if status == "active":
            query += " WHERE completed=0"
        elif status == "completed":
            query += " WHERE completed=1"
        query += " ORDER BY COALESCE(due_date, '')"
        rows = conn.execute(query).fetchall()
        return [dict(row) for row in rows]


@app.post("/tasks", status_code=201)
def create_task(task: Task):
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.execute(
            "INSERT INTO tasks (title, completed, due_date) VALUES (?, ?, ?)",
            (task.title, int(task.completed), task.due_date),
        )
        conn.commit()
        task.id = cur.lastrowid
        return task


@app.put("/tasks/{task_id}")
def update_task(task_id: int, task: Task):
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.execute(
            "UPDATE tasks SET title=?, completed=?, due_date=? WHERE id=?",
            (task.title, int(task.completed), task.due_date, task_id),
        )
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Task not found")
        return {**task.dict(), "id": task_id}


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int):
    with sqlite3.connect(DB_PATH) as conn:
        cur = conn.execute("DELETE FROM tasks WHERE id=?", (task_id,))
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Task not found")

