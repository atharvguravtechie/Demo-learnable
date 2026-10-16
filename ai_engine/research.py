
import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

MODEL_NAME = "gemini-3.5-flash-lite"


def research_topic(topic: str) -> list[dict]:
    """Find web sources for a given educational topic."""

    if not isinstance(topic, str) or not topic.strip():
        raise ValueError("Topic must not be empty.")

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is missing. Check your .env file."
        )

    try:
        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=(
                f"Research the educational topic: {topic.strip()}. "
                "Use Google Search grounding. Find relevant, "
                "reliable educational sources. Provide a concise "
                "explanation based on the sources."
            ),
            config=types.GenerateContentConfig(
                tools=[
                    types.Tool(
                        google_search=types.GoogleSearch()
                    )
                ]
            ),
        )

    except Exception as exc:
        raise RuntimeError(
            f"Topic research failed: {exc}"
        ) from exc

    sources = []
    seen_urls = set()

    candidates = response.candidates or []

    for candidate in candidates:
        metadata = candidate.grounding_metadata

        if metadata is None:
            continue

        chunks = metadata.grounding_chunks or []

        for chunk in chunks:
            web_source = chunk.web

            if web_source is None:
                continue

            url = web_source.uri
            title = web_source.title or "Untitled source"

            if not url or url in seen_urls:
                continue

            seen_urls.add(url)

            sources.append(
                {
                    "title": title,
                    "url": url,
                    "snippet": "",
                }
            )

    return sources
