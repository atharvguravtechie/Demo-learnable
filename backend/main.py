
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.database import init_db
from backend.progress import get_progress, update_progress
from backend.schemas import ProgressUpdateRequest


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Prepare the database when the server starts.
    init_db()
    yield


app = FastAPI(
    title="LearnAble API",
    description="Backend for the LearnAble learning platform",
    version="1.0.0",
    lifespan=lifespan,
)


# Allow our local React/Vite frontend to communicate with the backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "project": "LearnAble",
    }


@app.get("/api/progress")
def read_progress():
    try:
        return get_progress()
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Could not retrieve learning progress.",
        ) from exc


@app.patch("/api/progress/{topic_id}")
def change_topic_progress(
    topic_id: str,
    request: ProgressUpdateRequest,
):
    try:
        return update_progress(topic_id, request.status)
    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Could not update topic progress.",
        ) from exc
