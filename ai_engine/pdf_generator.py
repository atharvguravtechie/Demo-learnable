
from pathlib import Path
import re
import html

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
)


def format_markdown(text: str) -> str:
    """Convert basic Markdown formatting into ReportLab markup."""

    text = html.escape(text, quote=False)

    # Bold: **text** or __text__
    text = re.sub(
        r"\*\*(.+?)\*\*",
        r"<b>\1</b>",
        text,
    )
    text = re.sub(
        r"__(.+?)__",
        r"<b>\1</b>",
        text,
    )

    # Italic: *text* or _text_
    text = re.sub(
        r"(?<!\*)\*([^*\n]+)\*(?!\*)",
        r"<i>\1</i>",
        text,
    )

    # Inline code: `text`
    text = re.sub(
        r"`([^`]+)`",
        r'<font name="Courier">\1</font>',
        text,
    )

    return text


def generate_pdf(notes: dict, output_path: str | None = None) -> str:
    """Generate a formatted PDF from study notes."""

    if not isinstance(notes, dict):
        raise TypeError("Notes must be a dictionary.")

    title = notes.get("title", "Study Notes")
    content = notes.get("content", "")

    if not isinstance(content, str) or not content.strip():
        raise ValueError("Notes must contain non-empty content.")

    if not isinstance(title, str) or not title.strip():
        title = "Study Notes"

    if output_path is None:
        safe_title = re.sub(
            r"[^A-Za-z0-9_-]+", "_", title
        ).strip("_")
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
        keepWithNext=True,
    )

    body_style = ParagraphStyle(
        "StudyBody",
        parent=styles["BodyText"],
        leading=15,
        spaceAfter=7,
    )

    bullet_style = ParagraphStyle(
        "StudyBullet",
        parent=body_style,
        leftIndent=18,
        firstLineIndent=-10,
    )

    document = SimpleDocTemplate(
        str(pdf_path),
        pagesize=A4,
        rightMargin=0.7 * inch,
        leftMargin=0.7 * inch,
        topMargin=0.7 * inch,
        bottomMargin=0.7 * inch,
        title=title,
        author="LearnAble",
    )

    story = [
        Paragraph("LearnAble Study Notes", title_style),
        Paragraph(format_markdown(title), styles["Heading1"]),
        Spacer(1, 10),
    ]

    for line in content.splitlines():
        text = line.strip()

        if not text:
            story.append(Spacer(1, 4))
            continue

        # Markdown heading: #, ##, ###, etc.
        heading_match = re.match(r"^(#{1,6})\s+(.+)$", text)

        if heading_match:
            heading_text = format_markdown(heading_match.group(2))
            story.append(Paragraph(heading_text, heading_style))
            continue

        # Bullet list: -, *, or +
        bullet_match = re.match(r"^[-*+]\s+(.+)$", text)

        if bullet_match:
            bullet_text = format_markdown(bullet_match.group(1))
            story.append(
                Paragraph(
                    bullet_text,
                    bullet_style,
                    bulletText="•",
                )
            )
            continue

        # Numbered list: 1. Item or 2) Item
        number_match = re.match(r"^(\d+)[.)]\s+(.+)$", text)

        if number_match:
            number = number_match.group(1)
            item_text = format_markdown(number_match.group(2))

            story.append(
                Paragraph(
                    item_text,
                    bullet_style,
                    bulletText=f"{number}.",
                )
            )
            continue

        # Remove Markdown horizontal rules
        if re.fullmatch(r"([-*_]\s*){3,}", text):
            story.append(Spacer(1, 6))
            continue

        story.append(
            Paragraph(format_markdown(text), body_style)
        )

    document.build(story)

    return str(pdf_path.resolve())
