
from pathlib import Path
import re

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    KeepTogether,
)


def generate_pdf(notes: dict, output_path: str | None = None) -> str:
    """Generate a downloadable PDF from study notes."""

    if not isinstance(notes, dict):
        raise TypeError("Notes must be a dictionary.")

    title = notes.get("title", "Study Notes")
    content = notes.get("content", "")

    if not isinstance(content, str) or not content.strip():
        raise ValueError("Notes must contain non-empty content.")

    if not isinstance(title, str) or not title.strip():
        title = "Study Notes"

    if output_path is None:
        safe_title = re.sub(r"[^A-Za-z0-9_-]+", "_", title).strip("_")
        safe_title = safe_title[:60] or "study_notes"
        output_path = str(Path.cwd() / f"{safe_title}.pdf")

    pdf_path = Path(output_path)
    pdf_path.parent.mkdir(parents=True, exist_ok=True)

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "StudyTitle",
        parent=styles["Title"],
        alignment=TA_CENTER,
        textColor=colors.HexColor("#1F4E79"),
        spaceAfter=18,
    )
    heading_style = ParagraphStyle(
        "StudyHeading",
        parent=styles["Heading2"],
        textColor=colors.HexColor("#1F4E79"),
        spaceBefore=12,
        spaceAfter=6,
    )
    body_style = styles["BodyText"]
    body_style.leading = 15
    body_style.spaceAfter = 7

    document = SimpleDocTemplate(
        str(pdf_path),
        pagesize=A4,
        rightMargin=0.7 * inch,
        leftMargin=0.7 * inch,
        topMargin=0.7 * inch,
        bottomMargin=0.7 * inch,
        title=title,
    )

    story = [Paragraph("LearnAble Study Notes", title_style)]
    story.append(Paragraph(title, styles["Heading1"]))
    story.append(Spacer(1, 10))

    for line in content.splitlines():
        text = line.strip()

        if not text:
            story.append(Spacer(1, 5))
            continue

        escaped = (
            text.replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
        )

        if (
            len(text) < 80
            and (
                text.endswith(":")
                or text.lower().startswith(
                    ("1. topic", "2. key", "3. detailed", "4. summary",
                     "5. practice", "topic overview", "key concepts",
                     "explanation", "summary", "practice questions")
                )
            )
        ):
            story.append(KeepTogether([Paragraph(escaped, heading_style)]))
        else:
            story.append(Paragraph(escaped, body_style))

    document.build(story)

    return str(pdf_path.resolve())
