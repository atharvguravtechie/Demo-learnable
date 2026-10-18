
import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  LoaderCircle,
} from "lucide-react";
import { generateQuiz, submitQuiz } from "../services/api";

export default function Quiz({ topicTitle = "Artificial Intelligence",topicId, }) {
  const [questions, setQuestions] = useState([]);
  const [quizTopicId, setQuizTopicId] = useState("");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({});
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const question = questions[current];

async function startQuiz() {
  const title = topicTitle.trim() || "Artificial Intelligence";

  const id =
    topicId ||
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  setLoading(true);
  setError("");
  setQuestions([]);
  setSelected({});
  setCurrent(0);
  setFinished(false);
  setResult(null);

  try {
    const response = await generateQuiz({
      topic_id: id,
      topic_title: title,
    });

    if (!response.questions?.length) {
      throw new Error("The backend returned no quiz questions.");
    }

    setQuizTopicId(id);
    setQuestions(response.questions);
  } catch (err) {
    setError(
      err.message ||
        "Unable to generate the quiz. Check that the backend and AI API key are configured."
    );
  } finally {
    setLoading(false);
  }
}

  async function submitQuizAnswers() {
    setSubmitting(true);
    setError("");

    try {
      const answers = questions.map((item) => ({
        question_id: item.id,
        selected_option: selected[item.id],
      }));

const response = await submitQuiz({
  topic_id: quizTopicId,
  answers,
});

      setResult(response);
      setFinished(true);
    } catch (err) {
      setError(
        err.message || "Unable to submit your answers. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function restartQuiz() {
    setCurrent(0);
    setSelected({});
    setFinished(false);
    setResult(null);
    setError("");
  }

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <LoaderCircle
          size={36}
          className="mx-auto animate-spin text-indigo-600"
        />
        <h2 className="mt-4 text-lg font-bold text-slate-900">
          Generating your quiz...
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Your AI-generated questions are on their way.
        </p>
      </section>
    );
  }

  if (!questions.length) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="text-center">
          <Sparkles size={40} className="mx-auto text-indigo-600" />
          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Generate an AI Practice Quiz
          </h2>
          <p className="mt-2 text-slate-500">
            Topic: {topicTitle || "Artificial Intelligence"}
          </p>

          <button
            onClick={startQuiz}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            <Sparkles size={18} />
            Generate Quiz
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}
      </section>
    );
  }

  if (finished) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <CheckCircle2
          size={48}
          className="mx-auto text-emerald-500"
        />

        <h2 className="mt-4 text-2xl font-bold text-slate-900">
          Quiz completed!
        </h2>

        <p className="mt-2 text-slate-600">
          Your score: {result.score} / {result.total}
        </p>

        <p className="mt-1 text-lg font-semibold text-indigo-600">
          {result.percentage}%
        </p>

        <button
          onClick={restartQuiz}
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
        >
          <RotateCcw size={18} />
          Review or retry
        </button>

        <button
          onClick={startQuiz}
          className="ml-2 mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          <Sparkles size={18} />
          New Quiz
        </button>
      </section>
    );
  }

  const optionEntries = Object.entries(question.options || {});

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
          AI Practice Quiz
        </span>

        <span className="text-sm text-slate-500">
          Question {current + 1} of {questions.length}
        </span>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all"
          style={{
            width: `${((current + 1) / questions.length) * 100}%`,
          }}
        />
      </div>

      <h2 className="mt-6 text-lg font-bold text-slate-900">
        {question.question}
      </h2>

      <div className="mt-5 space-y-3">
        {optionEntries.map(([letter, option]) => {
          const isSelected = selected[question.id] === letter;

          return (
            <button
              key={letter}
              onClick={() =>
                setSelected((previous) => ({
                  ...previous,
                  [question.id]: letter,
                }))
              }
              className={`w-full rounded-xl border p-4 text-left text-sm transition ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
              }`}
            >
              <span className="mr-3 font-semibold">{letter}.</span>
              {option}
            </button>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        onClick={() => {
          setError("");

          if (current === questions.length - 1) {
            submitQuizAnswers();
          } else {
            setCurrent((previous) => previous + 1);
          }
        }}
        disabled={
          !selected[question.id] ||
          submitting
        }
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? (
          <>
            <LoaderCircle size={18} className="animate-spin" />
            Submitting...
          </>
        ) : current === questions.length - 1 ? (
          "Submit Quiz"
        ) : (
          "Next Question"
        )}
      </button>

      {current > 0 && (
        <button
          onClick={() => setCurrent((previous) => previous - 1)}
          disabled={submitting}
          className="mt-3 w-full rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Previous Question
        </button>
      )}
    </section>
  );
}
