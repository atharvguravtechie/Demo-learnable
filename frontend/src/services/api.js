
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Check whether the backend is running
export function getHealth() {
  return request("/health");
}

// Parse a pasted syllabus into topics
export function parseSyllabus(syllabusText) {
  return request("/syllabus/parse", {
    method: "POST",
    body: JSON.stringify({
      syllabus_text: syllabusText,
    }),
  });
}

// Generate notes for a selected topic
export function generateNotes(payload) {
  return request("/notes/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Generate quiz questions for a selected topic
export function generateQuiz(payload) {
  return request("/quiz/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Submit quiz answers and receive the score
export function submitQuiz(payload) {
  return request("/quiz/submit", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Retrieve overall and topic-level progress
export function getProgress() {
  return request("/progress");
}

// Update a topic's status
export function updateTopicProgress(topicId, status) {
  return request(
    `/progress/${encodeURIComponent(topicId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
}

// Download generated notes as a PDF
export async function downloadNotesPdf(topicId) {
  const response = await fetch(
    `${API_BASE_URL}/notes/${encodeURIComponent(topicId)}/pdf`
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `PDF download failed: ${response.status}`);
  }

  return response.blob();
}
