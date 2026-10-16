import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";

const sampleQuestions = [
  {
    question: "What is Artificial Intelligence?",
    options: [
      "A computer operating system",
      "A field of computer science",
      "A programming language",
      "A database",
    ],
    answer: 1,
    explanation:
      "Artificial Intelligence is a field of computer science focused on tasks that typically require human intelligence.",
  },
  {
    question: "Which of these is a search algorithm?",
    options: [
      "HTML",
      "CSS",
      "Breadth-First Search",
      "SQL",
    ],
    answer: 2,
    explanation:
      "Breadth-First Search is an algorithm that explores nodes level by level.",
  },
];

export default function Quiz({ questions = sampleQuestions }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({});
  const [finished, setFinished] = useState(false);

  const question = questions[current];

  if (!questions.length) {
    return (
      <p className="rounded-xl bg-white p-6 text-slate-500">
        No quiz questions available.
      </p>
    );
  }

  const score = questions.reduce(
    (total, item, index) =>
      total + (selected[index] === item.answer ? 1 : 0),
    0
  );

  function restartQuiz() {
    setCurrent(0);
    setSelected({});
    setFinished(false);
  }

  function submitAnswer() {
    if (selected[current] === undefined) return;

    if (current === questions.length - 1) {
      setFinished(true);
    } else {
      setCurrent((previous) => previous + 1);
    }
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
          Your score: {score} / {questions.length}
        </p>

        <button
          onClick={restartQuiz}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          <RotateCcw size={18} />
          Try again
        </button>

      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between gap-3">

        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
          Practice Quiz
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

        {question.options.map((option, index) => {
          const isSelected = selected[current] === index;

          return (
            <button
              key={option}
              onClick={() =>
                setSelected((previous) => ({
                  ...previous,
                  [current]: index,
                }))
              }
              className={`w-full rounded-xl border p-4 text-left text-sm transition ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
              }`}
            >
              <span className="mr-3 font-semibold">
                {String.fromCharCode(65 + index)}.
              </span>

              {option}
            </button>
          );
        })}

      </div>

      <button
        onClick={submitAnswer}
        disabled={selected[current] === undefined}
        className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {current === questions.length - 1
          ? "Finish Quiz"
          : "Next Question"}
      </button>

    </section>
  );
}