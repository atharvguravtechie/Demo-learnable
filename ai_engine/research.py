def research_topic(topic: str) -> list[dict]:
    """Topic साठी खरे research sources शोधते."""

    if not isinstance(topic, str) or not topic.strip():
        raise ValueError("Topic रिकामा नसावा.")

    raise RuntimeError(
        "Search service अजून configure केलेली नाही. "
        "खरे sources मिळवण्यासाठी Search API जोडणे आवश्यक आहे."
    )