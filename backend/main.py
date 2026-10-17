
import os
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from backend.database import (
    init_db,
    add_topic,
    record_quiz_attempt,
)
from backend.progress import get_progress, update_progress
from backend.schemas import (
    SyllabusParseRequest,
    SyllabusParseResponse,
    NotesGenerateRequest,
    NotesGenerateResponse,
    QuizGenerateRequest,
    QuizGenerateResponse,
    QuizQuestionPublic,
    QuizSubmitRequest,
    QuizSubmitResponse,
    ProgressUpdateRequest,
)

from ai_engine.syllabus_parser import parse_syllabus
from ai_engine.research import research_topic
from ai_engine.notes_generator import generate_notes
from ai_engine.quiz_generator import generate_quiz
from ai_engine.pdf_generator import generate_pdf


# Temporary storage for the current running server.
# These caches reset when the backend restarts.
notes_cache = {}
quiz_cache = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="LearnAble API",
    description="AI-powered personalized learning platform",
    version="1.0.0",
    lifespan=lifespan,
)

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
    return {"status": "healthy", "project": "LearnAble"}


@app.post(
    "/api/syllabus/parse",
    response_model=SyllabusParseResponse,
)
def parse_syllabus_endpoint(request: SyllabusParseRequest):
    try:
        result = parse_syllabus(request.syllabus_text)

        for topic in result["topics"]:
            add_topic(
                topic["id"],
                topic["title"],
                topic.get("unit", ""),
            )

        return result

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Could not parse and save the syllabus.",
        ) from exc


@app.post(
    "/api/notes/generate",
    response_model=NotesGenerateResponse,
)
def generate_notes_endpoint(request: NotesGenerateRequest):
    topic_id = request.topic_id
    topic_title = request.topic_title.strip()

    if not topic_title:
        raise HTTPException(
            status_code=400,
            detail="Topic title cannot be empty.",
        )

    try:
        # Research is attempted first. If it fails, notes generation
        # can still use the AI module's built-in fallback.
        try:
            sources = research_topic(topic_title)
        except Exception:
            sources = []

        notes = generate_notes(topic_title, sources)
        notes_cache[topic_id] = notes

        return {
            "topic_id": topic_id,
            "title": notes["title"],
            "content": notes["content"],
            "sources": notes.get("sources", []),
        }

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Could not generate study notes.",
        ) from exc


@app.post(
    "/api/quiz/generate",
    response_model=QuizGenerateResponse,
)
def generate_quiz_endpoint(request: QuizGenerateRequest):
    topic_id = request.topic_id
    topic_title = request.topic_title.strip()

    if not topic_title:
        raise HTTPException(
            status_code=400,
            detail="Topic title cannot be empty.",
        )

    try:
        # Reuse generated notes where available.
        notes = notes_cache.get(topic_id)

        # Generate notes if this topic has not been opened yet.
        if notes is None:
            try:
                sources = research_topic(topic_title)
            except Exception:
                sources = []

            notes = generate_notes(topic_title, sources)
            notes_cache[topic_id] = notes

        quiz = generate_quiz(topic_title, notes)

        # Keep correct answers on the backend. Never send them
        # to the frontend before the quiz is submitted.
        quiz_cache[topic_id] = quiz

        public_questions = []

        for question in quiz["questions"]:
            option_list = question["options"]

            public_questions.append(
                QuizQuestionPublic(
                    id=question["id"],
                    question=question["question"],
                    options={
                        "A": option_list[0],
                        "B": option_list[1],
                        "C": option_list[2],
                        "D": option_list[3],
                    },
                )
            )

        return {
            "topic_id": topic_id,
            "questions": public_questions,
        }

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=(
                "Could not generate the quiz. "
                "Check the AI API configuration and try again."
            ),
        ) from exc


@app.post(
    "/api/quiz/submit",
    response_model=QuizSubmitResponse,
)
def submit_quiz_endpoint(request: QuizSubmitRequest):
    quiz = quiz_cache.get(request.topic_id)

    if quiz is None:
        raise HTTPException(
            status_code=404,
            detail=(
                "Quiz not found. Generate the quiz again "
                "before submitting answers."
            ),
        )

    questions = {
        question["id"]: question
        for question in quiz["questions"]
    }

    submitted_ids = [
        answer.question_id for answer in request.answers
    ]

    if len(submitted_ids) != len(set(submitted_ids)):
        raise HTTPException(
            status_code=400,
            detail="A question cannot be answered more than once.",
        )

    if any(question_id not in questions for question_id in submitted_ids):
        raise HTTPException(
            status_code=400,
            detail="One or more submitted question IDs are invalid.",
        )

    if len(request.answers) != len(questions):
        raise HTTPException(
            status_code=400,
            detail="Please submit an answer for every question.",
        )

    score = 0

    for answer in request.answers:
        question = questions[answer.question_id]
        selected_index = ord(answer.selected_option) - ord("A")
        selected_text = question["options"][selected_index]

        if selected_text == question["correct_answer"]:
            score += 1

    total = len(questions)
    percentage = round((score / total) * 100, 2) if total else 0

    try:
        record_quiz_attempt(request.topic_id, score, total)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Could not save the quiz result.",
        ) from exc

    return {
        "score": score,
        "total": total,
        "percentage": percentage,
    }


@app.get("/api/notes/{topic_id}/pdf")
def download_notes_pdf(topic_id: str):
    notes = notes_cache.get(topic_id)

    if notes is None:
        raise HTTPException(
            status_code=404,
            detail="Generate the topic's notes before downloading its PDF.",
        )

    try:
        os.makedirs("generated_pdfs", exist_ok=True)

        output_path = os.path.join(
            "generated_pdfs",
            f"{uuid.uuid4().hex}.pdf",
        )

        pdf_path = generate_pdf(notes, output_path)

        safe_title = "".join(
            character if character.isalnum() else "_"
            for character in notes.get("title", "Study_Notes")
        ).strip("_") or "Study_Notes"

        return FileResponse(
            path=pdf_path,
            media_type="application/pdf",
            filename=f"{safe_title[:60]}.pdf",
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Could not generate the PDF.",
        ) from exc


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
