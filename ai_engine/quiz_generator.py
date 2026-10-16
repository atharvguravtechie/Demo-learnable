import json
import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

MODEL_NAME = "gemini-3.5-flash-lite"


def generate_quiz(topic: str, notes: dict) -> dict:
    """Generate a multiple-choice quiz from study notes."""

    if not isinstance(topic, str) or not topic.strip():
        raise ValueError("Topic must not be empty.")

    if not isinstance(notes, dict):
        raise TypeError("Notes must be a dictionary.")

    content = notes.get("content", "")

    if not isinstance(content, str) or not content.strip():
        raise ValueError("Notes must contain non-empty content.")

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is missing.")

    prompt = f"""
Create five multiple-choice questions about {topic.strip()}.
Use only the supplied notes as the factual basis.

Notes:
{content}

Return only valid JSON with this structure:
{{
  "title": "Quiz title",
  "questions": [
    {{
      "id": "q1",
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "Option A",
      "explanation": "Explanation"
    }}
  ]
}}

Requirements:
- Exactly five questions.
- Each question must have four distinct options.
- correct_answer must exactly match one option.
- Include a non-empty explanation.
- Do not include Markdown code fences.
"""

    try:
        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
            config={"response_mime_type": "application/json"},
        )

        response_text = (response.text or "").strip()

        if not response_text:
            raise RuntimeError("The AI returned an empty quiz response.")

        quiz = json.loads(response_text)

    except json.JSONDecodeError as exc:
        raise RuntimeError("The AI returned invalid quiz JSON.") from exc
    except Exception as exc:
        raise RuntimeError(f"Quiz generation failed: {exc}") from exc

    if not isinstance(quiz, dict):
        raise RuntimeError("The quiz response must be a JSON object.")

    questions = quiz.get("questions")

    if not isinstance(questions, list) or len(questions) != 5:
        raise RuntimeError("The quiz must contain exactly five questions.")

    for index, question in enumerate(questions, start=1):
        if not isinstance(question, dict):
            raise RuntimeError(f"Question {index} must be an object.")

        options = question.get("options")
        answer = question.get("correct_answer")

        if (
            not isinstance(question.get("question"), str)
            or not question["question"].strip()
            or not isinstance(options, list)
            or len(options) != 4
            or not all(isinstance(option, str) and option.strip() for option in options)
            or len(set(options)) != 4
            or answer not in options
            or not isinstance(question.get("explanation"), str)
            or not question["explanation"].strip()
        ):
            raise RuntimeError(f"Question {index} has an invalid structure.")

        question["id"] = f"q{index}"

    return {
        "title": quiz.get("title") or topic.strip(),
        "questions": questions,
    }
