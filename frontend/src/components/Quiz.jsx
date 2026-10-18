
import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Target,
  BookOpen,
  ArrowLeft,
  Sparkles,
  Brain,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";

import { generateQuiz, submitQuiz } from "../services/api";

const syllabus = {
  "Artificial Intelligence": [
    "Introduction to Artificial Intelligence",
    "Breadth-First Search (BFS)",
    "Depth-First Search (DFS)",
    "Heuristic Search",
    "Hill Climbing",
    "AO* Algorithm",
  ],
  Python: [
    "Python Basics",
    "Variables and Data Types",
    "Loops and Conditions",
    "Functions",
    "Lists and Dictionaries",
    "NumPy and Pandas",
  ],
  Java: [
    "Java Basics",
    "Classes and Objects",
    "Object-Oriented Programming",
    "Inheritance",
    "Polymorphism",
    "Exception Handling",
  ],
  DBMS: [
    "Introduction to DBMS",
    "ER Model",
    "SQL Queries",
    "Normalization",
    "Transactions",
    "Keys in DBMS",
  ],
  "Web Development": [
    "HTML Basics",
    "CSS Basics",
    "JavaScript",
    "React Basics",
    "Responsive Design",
    "Web Forms",
  ],
};

export default function Quiz({ topicTitle, topicId }) {
  const [subject, setSubject] = useState(
    topicTitle && Object.hasOwn(syllabus, topicTitle)
      ? topicTitle
      : "Artificial Intelligence"
  );

  const [selectedTopics, setSelectedTopics] = useState(
    topicTitle && !Object.hasOwn(syllabus, topicTitle)
      ? [topicTitle]
      : []
  );

  const [difficulty, setDifficulty] = useState("Medium");
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({});
  const [finished, setFinished] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);
  const [quizTopicId, setQuizTopicId] = useState("");

  const topics = syllabus[subject] || [];

  function toggleTopic(topic) {
    setSelectedTopics((previous) =>
      previous.includes(topic)
        ? previous.filter((item) => item !== topic)
        : [...previous, topic]
    );
  }

  function toggleAllTopics() {
    setSelectedTopics((previous) =>
      previous.length === topics.length ? [] : [...topics]
    );
  }

  function createTopicId(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function startQuiz() {
    if (selectedTopics.length === 0) {
      setError("Please select at least one topic.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const title =
        selectedTopics.length === 1
          ? selectedTopics[0]
          : `${subject}: ${selectedTopics.join(", ")}`;

      // Use the existing topic ID when launched from a selected syllabus topic.
      const id =
        selectedTopics.length === 1 && topicId
          ? topicId
          : createTopicId(title);

      const response = await generateQuiz({
        topic_id: id,
        topic_title: title,
      });

      if (
        !response ||
        !Array.isArray(response.questions) ||
        response.questions.length === 0
      ) {
        throw new Error("The backend did not return any quiz questions.");
      }

      const normalizedQuestions = response.questions.map((question, index) => {
        const rawOptions = question.options;

        // The backend returns options as { A: "...", B: "...", ... }.
        const options = Array.isArray(rawOptions)
          ? rawOptions.map((label, optionIndex) => ({
              value: String.fromCharCode(65 + optionIndex),
              label,
            }))
          : Object.entries(rawOptions || {}).map(([value, label]) => ({
              value,
              label,
            }));

        if (
          !question.id ||
          !question.question ||
          options.length !== 4 ||
          options.some(
            (option) =>
              typeof option.label !== "string" ||
              !option.label.trim()
          )
        ) {
          throw new Error(
            `Question ${index + 1} has an invalid format. Please try again.`
          );
        }

        return {
          id: question.id,
          question: question.question,
          options,
          explanation: question.explanation || "",
        };
      });

      setQuestions(normalizedQuestions);
      setQuizTopicId(id);
      setCurrent(0);
      setSelected({});
      setFinished(false);
      setShowReview(false);
      setResults(null);
      setQuizStarted(true);
    } catch (err) {
      console.error("Quiz generation error:", err);
      setError(
        err.message ||
          "Unable to generate the quiz. Check your backend and AI API configuration."
      );
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(optionValue) {
    if (finished || submitting) return;

    setSelected((previous) => ({
      ...previous,
      [current]: optionValue,
    }));
  }

  async function submitAnswer() {
    if (selected[current] === undefined) {
      setError("Please select an answer first.");
      return;
    }

    setError("");

    if (current < questions.length - 1) {
      setCurrent((previous) => previous + 1);
      return;
    }

    // Submit the complete quiz to the backend for server-side scoring.
    setSubmitting(true);

    try {
      const answers = questions.map((question, index) => ({
        question_id: question.id,
        selected_option: selected[index],
      }));

      const response = await submitQuiz({
        topic_id: quizTopicId,
        answers,
      });

      setResults(response);
      setFinished(true);
      setShowReview(false);
    } catch (err) {
      console.error("Quiz submission error:", err);
      setError(
        err.message ||
          "Unable to submit your answers. Please check the backend and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function restartQuiz() {
    setQuizStarted(false);
    setQuestions([]);
    setCurrent(0);
    setSelected({});
    setFinished(false);
    setShowReview(false);
    setResults(null);
    setError("");
  }

  const score = results?.score ?? 0;
  const total = results?.total ?? questions.length;
  const percentage =
    results?.percentage ??
    (questions.length ? Math.round((score / questions.length) * 100) : 0);
  const wrongAnswers = Math.max(0, total - score);

  // QUIZ SETUP
  if (!quizStarted) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 pb-10">
        <header>
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
            <Brain size={20} />
            LEARNABLE PRACTICE CENTER
          </div>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Practice Quiz
          </h1>

          <p className="mt-2 text-slate-500">
            Choose a subject, select topics, and test your knowledge.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <BookOpen className="text-indigo-600" size={28} />
            <p className="mt-3 text-sm text-slate-500">Subjects</p>
            <p className="mt-1 text-2xl font-bold">
              {Object.keys(syllabus).length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <Target className="text-violet-600" size={28} />
            <p className="mt-3 text-sm text-slate-500">
              Questions per quiz
            </p>
            <p className="mt-1 text-2xl font-bold">5</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <Sparkles className="text-emerald-600" size={28} />
            <p className="mt-3 text-sm text-slate-500">Difficulty</p>
            <p className="mt-1 text-2xl font-bold">{difficulty}</p>
          </div>
        </div>

        <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div>
            <label className="mb-2 block font-semibold text-slate-800">
              1. Select Subject
            </label>

            <select
              value={subject}
              onChange={(event) => {
                setSubject(event.target.value);
                setSelectedTopics([]);
                setError("");
              }}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500"
            >
              {Object.keys(syllabus).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <label className="font-semibold text-slate-800">
                2. Select Topics
              </label>

              <button
                type="button"
                onClick={toggleAllTopics}
                className="text-sm font-semibold text-indigo-600"
              >
                {selectedTopics.length === topics.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {topics.map((topic) => {
                const checked = selectedTopics.includes(topic);

                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleTopic(topic)}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                      checked
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                        checked
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {checked && <CheckCircle2 size={15} />}
                    </span>

                    <span className="text-sm font-medium text-slate-700">
                      {topic}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-sm text-slate-500">
              {selectedTopics.length} topic(s) selected
            </p>
          </div>

          <div>
            <label className="mb-3 block font-semibold text-slate-800">
              3. Select Difficulty
            </label>

            <div className="grid grid-cols-3 gap-3">
              {["Easy", "Medium", "Hard"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`rounded-xl border px-4 py-3 font-semibold transition ${
                    difficulty === level
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-200 text-slate-600 hover:border-indigo-300"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-indigo-50 p-4">
            <div className="flex items-start gap-3">
              <Sparkles
                className="mt-1 shrink-0 text-indigo-600"
                size={21}
              />

              <div>
                <p className="font-semibold text-indigo-900">
                  Your practice session
                </p>

                <p className="mt-1 text-sm leading-6 text-indigo-700">
                  Subject: {subject}
                  <br />
                  Topics selected: {selectedTopics.length}
                  <br />
                  Difficulty: {difficulty}
                  <br />
                  Questions: 5 AI-generated questions
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={startQuiz}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-4 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircle size={20} className="animate-spin" />
                Generating AI Quiz...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Quiz
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-400">
            Questions are generated from study notes by the LearnAble backend.
          </p>
        </section>
      </div>
    );
  }

  // RESULTS AND ANSWER REVIEW
  if (finished) {
    return (
      <section className="space-y-6">
        {!showReview ? (
          <>
            <div className="rounded-2xl bg-linear-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-lg sm:p-8">
              <Trophy size={45} className="mb-4" />

              <p className="text-sm text-indigo-100">
                PRACTICE QUIZ COMPLETED
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {percentage >= 80
                  ? "Excellent Work!"
                  : percentage >= 50
                    ? "Good Effort!"
                    : "Keep Practicing!"}
              </h2>

              <p className="mt-2 text-indigo-100">
                {subject} · {difficulty} difficulty
              </p>

              <p className="mt-6 text-sm text-indigo-100">
                Your final score
              </p>

              <p className="mt-1 text-4xl font-bold">
                {score} / {total}
              </p>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/25">
                <div
                  className="h-full rounded-full bg-white transition-all"
                  style={{
                    width: `${Math.max(0, Math.min(100, percentage))}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-sm text-indigo-100">
                {percentage}% score
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <Target className="text-indigo-600" size={27} />
                <p className="mt-3 text-sm text-slate-500">
                  Total Questions
                </p>
                <p className="mt-1 text-2xl font-bold">{total}</p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <CheckCircle2 className="text-emerald-600" size={27} />
                <p className="mt-3 text-sm text-emerald-700">
                  Correct Answers
                </p>
                <p className="mt-1 text-2xl font-bold text-emerald-700">
                  {score}
                </p>
              </div>

              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
                <XCircle className="text-rose-600" size={27} />
                <p className="mt-3 text-sm text-rose-700">
                  Wrong Answers
                </p>
                <p className="mt-1 text-2xl font-bold text-rose-700">
                  {wrongAnswers}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowReview(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
              >
                <BookOpen size={19} />
                Review Answers
              </button>

              <button
                type="button"
                onClick={restartQuiz}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw size={18} />
                Create Another Quiz
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <button
                type="button"
                onClick={() => setShowReview(false)}
                className="flex items-center gap-2 text-sm font-semibold text-indigo-600"
              >
                <ArrowLeft size={18} />
                Back to Results
              </button>

              <h2 className="mt-5 text-2xl font-bold">Answer Review</h2>

              <p className="mt-2 text-slate-500">
                Review the questions and the options you submitted.
              </p>

              <p className="mt-2 text-sm text-amber-700">
                The current submission API returns the overall score, not
                the correct option for each question.
              </p>
            </div>

            {questions.map((item, index) => {
              const userAnswer = selected[index];
              const selectedOption = item.options.find(
                (option) => option.value === userAnswer
              );

              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <BookOpen
                      className="mt-1 shrink-0 text-indigo-600"
                      size={22}
                    />

                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">
                        Question {index + 1}
                      </p>

                      <h3 className="mt-1 font-bold text-slate-900">
                        {item.question}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3">
                      <p className="text-xs font-semibold uppercase text-indigo-700">
                        Your Answer
                      </p>

                      <p className="mt-1 text-sm text-slate-800">
                        {selectedOption
                          ? `${selectedOption.value}. ${selectedOption.label}`
                          : "Not answered"}
                      </p>
                    </div>

                    {item.explanation && (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="font-semibold text-slate-700">
                          Explanation
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {item.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}

            <button
              type="button"
              onClick={restartQuiz}
              className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              <RotateCcw size={18} className="mr-2 inline" />
              Create Another Quiz
            </button>
          </>
        )}
      </section>
    );
  }

  // ACTIVE QUIZ
  const question = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
            <Brain size={20} />
            LEARNABLE PRACTICE CENTER
          </div>

          <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Practice Quiz
          </h1>

          <p className="mt-2 text-slate-500">
            {subject} · {difficulty} difficulty
          </p>
        </div>

        <div className="rounded-xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700">
          Question {current + 1} of {questions.length}
        </div>
      </header>

      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Question {current + 1}
        </p>

        <h2 className="mt-3 text-xl font-bold leading-relaxed text-slate-900 sm:text-2xl">
          {question.question}
        </h2>

        <div className="mt-6 space-y-3">
          {question.options.map((option) => {
            const isSelected = selected[current] === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => selectAnswer(option.value)}
                disabled={submitting}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                    isSelected
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {option.value}
                </span>

                <span className="flex-1 text-sm font-medium text-slate-700 sm:text-base">
                  {option.label}
                </span>

                {isSelected && (
                  <CheckCircle2
                    className="shrink-0 text-indigo-600"
                    size={20}
                  />
                )}
              </button>
            );
          })}
        </div>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => {
              setError("");
              if (current === 0) {
                restartQuiz();
              } else {
                setCurrent((previous) => previous - 1);
              }
            }}
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <ArrowLeft size={18} />
            {current === 0 ? "Exit Quiz" : "Previous"}
          </button>

          <button
            type="button"
            onClick={submitAnswer}
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Submitting...
              </>
            ) : current === questions.length - 1 ? (
              <>
                Submit Quiz
                <CheckCircle2 size={18} />
              </>
            ) : (
              <>
                Next Question
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
