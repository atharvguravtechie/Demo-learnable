import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

MODEL_NAME = "gemini-3.5-flash-lite"


def generate_notes(topic: str, sources: list[dict]) -> dict:
    """Generate study notes for a topic using Gemini."""

    if not isinstance(topic, str) or not topic.strip():
        raise ValueError("Topic must not be empty.")

    if not isinstance(sources, list):
        raise TypeError("Sources must be a list.")

    for source in sources:
        if not isinstance(source, dict):
            raise TypeError("Each source must be a dictionary.")

    clean_topic = topic.strip()

    source_text = "\n".join(
        f"Title: {source.get('title', '')}\n"
        f"URL: {source.get('url', '')}\n"
        f"Snippet: {source.get('snippet', '')}"
        for source in sources
    )

    api_key = os.getenv("GEMINI_API_KEY")

    if api_key:
        try:
            client = genai.Client(api_key=api_key)

            prompt = f"""
Create detailed, student-friendly study notes about:
{clean_topic}

Use supplied sources as factual evidence when available.
Never invent sources or claim that research was verified when it was not.

Include:
1. Topic overview
2. Key concepts and definitions
3. Detailed explanations
4. Examples
5. Summary
6. Five practice questions with answers

If sources are missing, clearly label the notes as general
educational content rather than research-verified content.

Source material:
{source_text if source_text else "No external sources supplied."}

Use clear headings and readable plain text.
"""

            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
            )

            content = (response.text or "").strip()

            if content:
                return {
                    "title": clean_topic,
                    "content": content,
                    "sources": sources,
                }

        except Exception:
            pass

    demo_content = f"""DEMO FALLBACK — NOT AI-GENERATED

Topic: {clean_topic}

Important:
Live AI generation was unavailable. This is a study outline,
not verified or complete study notes.

1. Topic Overview
Study the meaning, purpose, and importance of {clean_topic}.

2. Key Concepts
Identify the main terms, definitions, principles, and components
related to {clean_topic}. Verify them using your textbook.

3. Explanation and Examples
Write the key concepts in your own words. Add examples from
your syllabus, class notes, or recommended textbook.

4. Summary
Review the definitions, important concepts, and examples.

5. Practice Questions
1. What is {clean_topic}?
2. Explain its important concepts.
3. Describe one relevant example.
4. What are its main applications?
5. Summarize the topic in your own words.

These questions are prompts for revision, not verified answers.
"""

    return {
        "title": clean_topic,
        "content": demo_content,
        "sources": sources,
    }
