def parse_syllabus(syllabus_text: str) -> dict:
    """Syllabus मधून topics वेगळे करते."""

    if not isinstance(syllabus_text, str):
        raise TypeError("syllabus_text must be a string")

    topics = []
    seen_titles = set()
    current_unit = "Unit 1"

    for line in syllabus_text.splitlines():
        line = line.strip()

        if not line:
            continue

        # Unit चे नाव शोधणे
        if line.lower().startswith("unit "):
            current_unit = line.split(":")[0].strip()
            continue

        # Topic च्या सुरुवातीचा नंबर किंवा bullet काढणे
        title = line

        if line[0].isdigit() and "." in line:
            title = line.split(".", 1)[1].strip()
        elif line.startswith(("-", "*", "•")):
            title = line[1:].strip()

        # रिकामे किंवा duplicate topics टाळणे
        if not title:
            continue

        normalized_title = " ".join(title.lower().split())

        if normalized_title in seen_titles:
            continue

        seen_titles.add(normalized_title)

        topics.append({
            "id": f"topic-{len(topics) + 1}",
            "title": title,
            "unit": current_unit,
            "status": "not_started"
        })

    return {"topics": topics}