
from backend.progress import calculate_coverage, calculate_quiz_percentage
from backend.database import update_topic_status


def test_calculate_coverage():
    topics = [
        {"status": "reviewed"},
        {"status": "not_started"},
    ]

    assert calculate_coverage(topics) == 50.0


def test_calculate_coverage_with_no_topics():
    assert calculate_coverage([]) == 0


def test_calculate_quiz_percentage():
    assert calculate_quiz_percentage(4, 5) == 80.0


def test_calculate_quiz_percentage_with_no_questions():
    assert calculate_quiz_percentage(0, 0) == 0

def test_invalid_topic_status():
    import pytest

    with pytest.raises(ValueError, match="Status must be not_started or reviewed"):
        update_topic_status("topic-1", "invalid")
    
