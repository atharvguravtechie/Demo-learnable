
from backend.database import get_topics, get_quiz_stats, update_topic_status


def calculate_coverage(topics):
    """Calculate the percentage of topics that have been reviewed."""

    total_topics = len(topics)

    if total_topics == 0:
        return 0

    completed_topics = sum(
        1 for topic in topics
        if topic["status"] == "reviewed"
    )

    return round((completed_topics / total_topics) * 100, 2)


def calculate_quiz_percentage(score, total):
    """Calculate quiz percentage safely."""

    if total == 0:
        return 0

    return round((score / total) * 100, 2)


def get_progress():
    """Return topic progress and quiz performance."""

    topics = get_topics()

    total_topics = len(topics)

    completed_topics = sum(
        1 for topic in topics
        if topic["status"] == "reviewed"
    )

    coverage_percentage = calculate_coverage(topics)

    progress_topics = []

    for topic in topics:
        quiz_stats = get_quiz_stats(topic["id"])

        quiz_percentage = calculate_quiz_percentage(
            quiz_stats["correct"],
            quiz_stats["attempted"]
        )

        progress_topics.append({
            "id": topic["id"],
            "title": topic["title"],
            "status": topic["status"],
            "quiz_percentage": quiz_percentage
        })

    return {
        "total_topics": total_topics,
        "completed_topics": completed_topics,
        "coverage_percentage": coverage_percentage,
        "topics": progress_topics
    }


def update_progress(topic_id, status):
    """Update a topic's status."""

    update_topic_status(topic_id, status)

    return get_progress()
