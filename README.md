# Todo List Application

This repository contains a Todo list web application built with the following stack:

- **Backend:** [FastAPI](https://fastapi.tiangolo.com/) (Python) with SQLite database
- **Frontend:** [React](https://react.dev/) served as static files

The app allows you to create tasks with optional due dates and filter them by
status (all, active or completed). The UI uses the Bulma CSS framework for a
cleaner appearance.

## Project Structure

```
backend/       # FastAPI application
  main.py      # API endpoints and SQLite setup
  requirements.txt
frontend/      # React front‑end served as static files
  index.html
  index.js
README.md      # Project documentation
LICENSE
```

## Development

1. Create a virtual environment and install backend dependencies:

```bash
python -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
```

2. Run the API server:

```bash
uvicorn backend.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

3. Open `frontend/index.html` in your browser to use the React interface. The
   page lets you add tasks with due dates and filter the list using the tabs at
   the top.

## Database

SQLite is used as the database engine. A file named `todo.db` will be created automatically when the server starts.

## License

This project is licensed under the terms of the LICENSE file in this repository.
