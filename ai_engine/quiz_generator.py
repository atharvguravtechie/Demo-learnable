import json
import os

from google import genai


def generate_quiz(topic: str, notes: dict) -> dict:
    """Notes वर आधारित MCQ quiz तयार करते."""

    if not isinstance(topic, str) or not topic.strip():
        raise ValueError("Topic रिकामा नसावा.")

    if not isinstance(notes, dict):
        raise TypeError("notes ही dictionary असावी.")

    content = notes.get("content", "")

    if not isinstance(content, str) or not content.strip():
        raise ValueError("Notes मध्ये content आवश्यक आहे.")

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise RuntimeError("GEMINI_API_KEY मिळाली नाही.")

    client = genai.Client(api_key=api_key)

    prompt = f"""
Create 3 to 5 multiple-choice questions about {topic}.
Use only the supplied notes as the factual basis.

Notes:
{content}

Return ONLY valid JSON in this format:
{{
  "title": "Quiz title",
  "questions": [
    {{
      "id": "q1",
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "Option A",
      "explanation": "Why this answer is correct"
    }}
  ]
}}

Each question must have four options.
correct_answer must exactly match one option.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={"response_mime_type": "application/json"},
    )

    if not response.text:
        raise RuntimeError("Gemini कडून quiz मिळाली नाही.")

    try:
        quiz = json.loads(response.text)
    except json.JSONDecodeError as exc:
        raise RuntimeError("Gemini ने valid JSON दिले नाही.") from exc

    questions = quiz.get("questions")

    if not isinstance(questions, list) or not 3 <= len(questions) <= 5:
        raise RuntimeError("Quiz मध्ये 3 ते 5 प्रश्न आवश्यक आहेत.")

    for question in questions:
        if (
            not isinstance(question, dict)
            or not isinstance(question.get("options"), list)
            or len(question["options"]) != 4
            or question.get("correct_answer") not in question["options"]
            or not question.get("explanation")
        ):
            raise RuntimeError("Quiz मधील प्रश्नांची रचना चुकीची आहे.")

    return {
        "title": quiz.get("title", topic.strip()),
        "questions": questions,
    }