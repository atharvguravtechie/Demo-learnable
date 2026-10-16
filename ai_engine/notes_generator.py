import json
import os

from dotenv import load_dotenv
from google import genai

load_dotenv()
def generate_notes(topic: str, sources: list[dict]) -> dict:
    """दिलेल्या topic आणि sources वर आधारित study notes तयार करते."""

    if not isinstance(topic, str) or not topic.strip():
        raise ValueError("Topic रिकामा नसावा.")

    if not isinstance(sources, list):
        raise TypeError("sources ही list असावी.")

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY मिळाली नाही. .env फाइल तपासा."
        )

    client = genai.Client(api_key=api_key)

    source_text = "\n".join(
        f"Title: {source.get('title', '')}\n"
        f"URL: {source.get('url', '')}\n"
        f"Snippet: {source.get('snippet', '')}"
        for source in sources
    )

    prompt = f"""
Create concise, student-friendly study notes about: {topic}

Use the supplied source material as the factual basis when available.
If no source material is supplied, create general educational notes
using your existing knowledge and clearly label them as general notes,
not as research-verified content.
Do not invent sources or claim unsupported facts.
If source material is insufficient, clearly disclose this.

Include:
1. Topic overview
2. Key concepts and definitions
3. Explanations and examples
4. Summary
5. Practice questions

Source material:
{source_text if source_text else "No external sources supplied."}

Return readable plain text with clear headings.
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
    )

    content = response.text

    if not content:
        raise RuntimeError("Gemini कडून notes मिळाल्या नाहीत.")

    return {
        "title": topic.strip(),
        "content": content,
        "sources": sources,
    }