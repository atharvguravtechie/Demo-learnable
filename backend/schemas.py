
from typing import Literal

from pydantic import BaseModel, Field


TopicStatus = Literal["not_started", "reviewed"]


# Syllabus
class SyllabusParseRequest(BaseModel):
    syllabus_text: str = Field(min_length=1)


class TopicResponse(BaseModel):
    id: str
    title: str
    unit: str = ""
    status: TopicStatus = "not_started"


class SyllabusParseResponse(BaseModel):
    topics: list[TopicResponse]


# Notes
class NotesGenerateRequest(BaseModel):
    topic_id: str
    topic_title: str


class NoteSource(BaseModel):
    title: str
    url: str
    snippet: str


class NotesGenerateResponse(BaseModel):
    topic_id: str
    title: str
    content: str
    sources: list[NoteSource] = []


# Quiz generation
class QuizGenerateRequest(BaseModel):
    topic_id: str
    topic_title: str


class QuizQuestionPublic(BaseModel):
    id: str
    question: str
    options: dict[str, str]
    # Never include correct_answer in this public model.


class QuizGenerateResponse(BaseModel):
    topic_id: str
    questions: list[QuizQuestionPublic]


# Quiz submission
class QuizAnswerSubmission(BaseModel):
    question_id: str
    selected_option: Literal["A", "B", "C", "D"]


class QuizSubmitRequest(BaseModel):
    topic_id: str
    answers: list[QuizAnswerSubmission]


class QuizSubmitResponse(BaseModel):
    score: int
    total: int
    percentage: float


# Progress
class TopicProgressResponse(BaseModel):
    id: str
    title: str
    status: TopicStatus
    quiz_percentage: float


class ProgressResponse(BaseModel):
    total_topics: int
    completed_topics: int
    coverage_percentage: float
    topics: list[TopicProgressResponse]


class ProgressUpdateRequest(BaseModel):
    status: TopicStatus
