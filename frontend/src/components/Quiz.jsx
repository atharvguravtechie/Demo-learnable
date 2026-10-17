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
} from "lucide-react";

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
    options: ["HTML", "CSS", "Breadth-First Search", "SQL"],
    answer: 2,
    explanation:
      "Breadth-First Search explores nodes level by level.",
  },
  {
    question: "Which data structure is commonly used in BFS?",
    options: ["Stack", "Queue", "Tree only", "Hash function"],
    answer: 1,
    explanation:
      "BFS commonly uses a queue to process nodes in FIFO order.",
  },
  {
    question: "Which search method uses heuristic information?",
    options: [
      "Heuristic search",
      "Linear search only",
      "Bubble sort",
      "Sequential file reading",
    ],
    answer: 0,
    explanation:
      "Heuristic search uses estimates to guide the search toward a goal.",
  },
  {
    question: "Which algorithm explores a branch deeply before backtracking?",
    options: [
      "Breadth-First Search",
      "Depth-First Search",
      "Binary search",
      "Bubble sort",
    ],
    answer: 1,
    explanation:
      "DFS explores deeply along a branch before backtracking.",
  },
  {
    question: "What does AI stand for?",
    options: [
      "Automated Internet",
      "Artificial Intelligence",
      "Advanced Input",
      "Applied Interface",
    ],
    answer: 1,
    explanation: "AI stands for Artificial Intelligence.",
  },
  {
    question: "What is the purpose of a goal test?",
    options: [
      "Check whether the goal state has been reached",
      "Increase memory size",
      "Change the programming language",
      "Remove every node",
    ],
    answer: 0,
    explanation:
      "A goal test checks whether the current state satisfies the goal condition.",
  },
  {
    question: "Which data structure is commonly associated with DFS?",
    options: ["Queue", "Stack", "Spreadsheet", "Database table"],
    answer: 1,
    explanation:
      "DFS commonly uses a stack, either explicitly or through recursion.",
  },
  {
    question: "What is a limitation of heuristic search?",
    options: [
      "It never evaluates states",
      "It always finds the optimal answer",
      "Its performance depends on the heuristic",
      "It cannot explore states",
    ],
    answer: 2,
    explanation:
      "A poor heuristic can guide the search inefficiently.",
  },
  {
    question: "Which is an example of an AI application?",
    options: [
      "An ordinary pencil",
      "A paper notebook",
      "A speech recognition assistant",
      "A basic light switch",
    ],
    answer: 2,
    explanation:
      "Speech recognition systems can use AI to interpret spoken language.",
  },
];

export default function Quiz() {
  const [subject, setSubject] = useState("Artificial Intelligence");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [difficulty, setDifficulty] = useState("Medium");
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({});
  const [finished, setFinished] = useState(false);
  const [showReview, setShowReview] = useState(false);

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

  function startQuiz() {
    if (selectedTopics.length === 0) {
      window.alert("Please select at least one topic.");
      return;
    }

    // Demo questions only. AI generation requires backend integration.
    const shuffled = [...sampleQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);

    setQuestions(shuffled);
    setCurrent(0);
    setSelected({});
    setFinished(false);
    setShowReview(false);
    setQuizStarted(true);
  }

  function selectAnswer(index) {
    if (finished) return;

    setSelected((previous) => ({
      ...previous,
      [current]: index,
    }));
  }

  function submitAnswer() {
    if (selected[current] === undefined) {
      window.alert("Please select an answer first.");
      return;
    }

    if (current === questions.length - 1) {
      setFinished(true);
      setShowReview(false);
    } else {
      setCurrent((previous) => previous + 1);
    }
  }

  function restartQuiz() {
    setQuizStarted(false);
    setQuestions([]);
    setCurrent(0);
    setSelected({});
    setFinished(false);
    setShowReview(false);
  }

  const score = questions.reduce(
    (total, question, index) =>
      total + (selected[index] === question.answer ? 1 : 0),
    0
  );

  const wrongAnswers = questions.length - score;
  const percentage = questions.length
    ? Math.round((score / questions.length) * 100)
    : 0;

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
            <p className="mt-3 text-sm text-slate-500">Questions per quiz</p>
            <p className="mt-1 text-2xl font-bold">10</p>
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
              <Sparkles className="mt-1 shrink-0 text-indigo-600" size={21} />

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
                  Questions: 10
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={startQuiz}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-4 font-bold text-white transition hover:bg-indigo-700"
          >
            <Sparkles size={20} />
            Generate Quiz
          </button>

          <p className="text-center text-xs text-slate-400">
            Demo mode: questions are sample questions, not AI-generated yet.
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
            <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-lg sm:p-8">
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

              <p className="mt-6 text-sm text-indigo-100">Your final score</p>

              <p className="mt-1 text-4xl font-bold">
                {score} / {questions.length}
              </p>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/25">
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <p className="mt-2 text-sm text-indigo-100">
                {percentage}% score
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <Target className="text-indigo-600" size={27} />
                <p className="mt-3 text-sm text-slate-500">Total Questions</p>
                <p className="mt-1 text-2xl font-bold">{questions.length}</p>
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
                <p className="mt-3 text-sm text-rose-700">Wrong Answers</p>
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
                Review your answers and explanations.
              </p>
            </div>

            {questions.map((item, index) => {
              const userAnswer = selected[index];
              const isCorrect = userAnswer === item.answer;

              return (
                <article
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2
                        className="mt-1 shrink-0 text-emerald-600"
                        size={22}
                      />
                    ) : (
                      <XCircle
                        className="mt-1 shrink-0 text-rose-600"
                        size={22}
                      />
                    )}

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
                    <div
                      className={`rounded-xl border p-3 ${
                        isCorrect
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-rose-200 bg-rose-50"
                      }`}
                    >
                      <p className="text-xs font-semibold uppercase text-slate-500">
                        Your Answer
                      </p>

                      <p className="mt-1 text-sm">
                        {userAnswer === undefined
                          ? "Not answered"
                          : `${String.fromCharCode(65 + userAnswer)}. ${item.options[userAnswer]}`}
                      </p>
                    </div>

                    {!isCorrect && (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                        <p className="text-xs font-semibold uppercase text-emerald-700">
                          Correct Answer
                        </p>

                        <p className="mt-1 text-sm font-semibold text-emerald-800">
                          {String.fromCharCode(65 + item.answer)}.{" "}
                          {item.options[item.answer]}
                        </p>
                      </div>
                    )}

                    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                      <p className="font-semibold text-indigo-700">
                        Explanation
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {item.explanation ||
                          "No explanation is available for this question."}
                      </p>
                    </div>
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

return null;
}
