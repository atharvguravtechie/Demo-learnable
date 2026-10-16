const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function request(endpoint, options = {}) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    }
  );

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      message || `Request failed: ${response.status}`
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getHealth() {
  return request("/health");
}

export async function generateNotes(payload) {
  return request("/notes/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function generateQuiz(payload) {
  return request("/quiz/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getProgress() {
  return request("/progress");
}