import { useEffect, useState } from "react";
import {
Bot,
Sparkles,
Send,
Volume2,
VolumeX,
Pause,
Play,
RotateCcw,
BookOpen,
GraduationCap,
MessageCircle,
} from "lucide-react";

const teachingModes = [
{ label: "Beginner", value: "beginner" },
{ label: "Exam Preparation", value: "exam" },
{ label: "Detailed Explanation", value: "detailed" },
];

function createDemoLesson(topic, mode) {
const cleanTopic = topic.trim();

if (mode === "beginner") {
return `Hello, student! Welcome to LearnAble. Today, we are learning about ${cleanTopic}.

Let's understand it in simple language.

First, ${cleanTopic} is a topic that we can understand by learning its basic meaning, important concepts, and practical applications.

Here is how you should study it:

1. Understand the definition of ${cleanTopic}.
2. Learn its important features.
3. Study a simple example.
4. Revise the main points.

Remember, learning becomes easier when you understand the concept instead of memorizing everything.

Now, try explaining ${cleanTopic} in your own words!`;
}

if (mode === "exam") {
return `Welcome to your exam preparation lesson on ${cleanTopic}!

Focus on these important study points:

1. Definition: Learn a clear and accurate definition of ${cleanTopic}.
2. Key concepts: Understand its main principles and features.
3. Working: Learn how the concept works, step by step.
4. Example: Prepare one suitable example.
5. Advantages and limitations: Learn the important advantages and disadvantages, where applicable.

EXAM TIP:
Prepare a short definition, a detailed explanation, and an example. This will help you answer questions of different lengths.

Important: This is a general study guide. Connect an AI backend to generate verified, topic-specific notes and questions.`;
}

return `Welcome to your detailed lesson on ${cleanTopic}!

We will study this topic in an organized way.

PART 1 — INTRODUCTION
Begin by understanding what ${cleanTopic} means and why it is important.

PART 2 — CORE CONCEPTS
Identify the fundamental principles, terminology, and components associated with ${cleanTopic}.

PART 3 — HOW IT WORKS
Study the process step by step. Understand how the different components relate to one another.

PART 4 — PRACTICAL EXAMPLES
Connect the theory to practical applications. Examples make complex concepts easier to understand.

PART 5 — REVISION
Summarize the definition, important concepts, applications, advantages, and limitations where applicable.

Your next step is to connect the LearnAble AI backend. It will generate a detailed explanation specifically about your selected topic instead of this demonstration lesson.`;
}

export default function RobotTeacher() {
const [topic, setTopic] = useState("");
const [mode, setMode] = useState("beginner");
const [lesson, setLesson] = useState("");
const [isTeaching, setIsTeaching] = useState(false);
const [isPaused, setIsPaused] = useState(false);
const [status, setStatus] = useState("Ready to teach");
const [speechAvailable, setSpeechAvailable] = useState(false);

useEffect(() => {
setSpeechAvailable(
typeof window !== "undefined" &&
"speechSynthesis" in window &&
"SpeechSynthesisUtterance" in window
);

return () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};

}, []);

function startTeaching(event) {
event.preventDefault();

const selectedTopic = topic.trim();

if (!selectedTopic) {
  setStatus("Please enter a topic first.");
  return;
}

if ("speechSynthesis" in window) {
  window.speechSynthesis.cancel();
}

const newLesson = createDemoLesson(selectedTopic, mode);

setLesson(newLesson);
setIsTeaching(true);
setIsPaused(false);
setStatus("Lesson ready! Press Speak to hear your teacher.");

// This is a frontend demonstration lesson.
// Replace it with your AI backend API later.

}

function speakLesson() {
if (!lesson || !("speechSynthesis" in window)) {
setStatus("Speech is not supported in this browser.");
return;
}

window.speechSynthesis.cancel();

const utterance = new SpeechSynthesisUtterance(lesson);
utterance.rate = 0.9;
utterance.pitch = 1.1;

utterance.onstart = () => {
  setIsTeaching(true);
  setIsPaused(false);
  setStatus("Your robot is teaching you...");
};

utterance.onend = () => {
  setIsTeaching(false);
  setIsPaused(false);
  setStatus("Lesson completed! Great job.");
};

utterance.onerror = () => {
  setIsTeaching(false);
  setIsPaused(false);
  setStatus("Speech could not start. Please try again.");
};

window.speechSynthesis.speak(utterance);

}

function pauseTeaching() {
if (!("speechSynthesis" in window)) return;

if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
  window.speechSynthesis.pause();
  setIsPaused(true);
  setStatus("Lesson paused.");
}

}

function resumeTeaching() {
if (!("speechSynthesis" in window)) return;

if (window.speechSynthesis.paused) {
  window.speechSynthesis.resume();
  setIsPaused(false);
  setStatus("Your robot is teaching you...");
}

}

function stopTeaching() {
if ("speechSynthesis" in window) {
window.speechSynthesis.cancel();
}

setIsTeaching(false);
setIsPaused(false);
setStatus("Lesson stopped. Ready when you are!");

}

return (
<div className="space-y-6 pb-8">
<header>
<div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
<Sparkles size={17} />
YOUR PERSONAL AI TEACHER
</div>

    <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
      Meet your Robot Teacher
    </h1>

    <p className="mt-3 max-w-2xl text-slate-500">
      Choose a topic, start a lesson, and listen to your virtual teacher
      explain the material.
    </p>
  </header>

  <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
    {/* Robot window */}
    <section className="overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-indigo-100 px-5 py-4">
        <div>
          <h2 className="font-bold text-slate-900">LearnAble Bot</h2>
          <p className="mt-1 text-xs text-slate-500">
            Your virtual learning companion
          </p>
        </div>

        <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          Online
        </span>
      </div>

      <div className="relative flex min-h-[310px] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-100 px-4 py-8">
        <div className="absolute left-8 top-10 h-12 w-12 rounded-full bg-indigo-200/40 blur-xl" />
        <div className="absolute bottom-8 right-8 h-16 w-16 rounded-full bg-violet-300/40 blur-xl" />

        <div
          className={`relative flex flex-col items-center ${
            isTeaching && !isPaused ? "animate-bounce" : ""
          }`}
          style={{
            animationDuration: "2.5s",
          }}
        >
          {/* Antenna */}
          <div className="relative flex h-9 flex-col items-center justify-end">
            <span className="h-5 w-1.5 rounded-full bg-indigo-500" />
            <span className="absolute top-0 h-3 w-3 rounded-full bg-pink-400 shadow-md shadow-pink-200" />
          </div>

          {/* Robot head */}
          <div className="relative z-10 w-48 rounded-[2.5rem] border-4 border-indigo-200 bg-white p-4 shadow-xl shadow-indigo-200/60">
            {/* Ears */}
            <div className="absolute -left-3 top-12 h-10 w-3 rounded-l-full bg-indigo-400" />
            <div className="absolute -right-3 top-12 h-10 w-3 rounded-r-full bg-indigo-400" />

            {/* Eyes */}
            <div className="flex items-center justify-center gap-7 rounded-3xl bg-slate-900 px-5 py-6">
              <span
                className={`h-4 w-4 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)] ${
                  isTeaching && !isPaused ? "animate-pulse" : ""
                }`}
              />
              <span
                className={`h-4 w-4 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)] ${
                  isTeaching && !isPaused ? "animate-pulse" : ""
                }`}
              />
            </div>

            {/* Mouth */}
            <div className="mt-4 flex h-8 items-center justify-center">
              {isTeaching && !isPaused ? (
                <span className="h-5 w-10 animate-pulse rounded-full border-4 border-indigo-500 bg-indigo-100" />
              ) : (
                <span className="h-1.5 w-10 rounded-full bg-indigo-500" />
              )}
            </div>
          </div>

          {/* Robot body */}
          <div className="mt-2 flex h-16 w-28 items-center justify-center rounded-2xl border-4 border-indigo-200 bg-white shadow-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Bot size={23} />
            </div>
          </div>

          {/* Robot feet */}
          <div className="flex gap-8">
            <span className="h-4 w-7 rounded-b-lg bg-indigo-400" />
            <span className="h-4 w-7 rounded-b-lg bg-indigo-400" />
          </div>
        </div>

        <div className="relative z-10 mt-6 rounded-full border border-white bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
          {isTeaching && !isPaused
            ? "I'm teaching you!"
            : isPaused
            ? "Let's take a break!"
            : "Hello! What shall we learn?"}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
          <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600">
            <MessageCircle size={20} />
          </div>

          <div>
            <p className="font-semibold text-slate-800">Teacher status</p>
            <p className="mt-1 text-sm text-slate-500">{status}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={speakLesson}
            disabled={!lesson || !speechAvailable}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Volume2 size={17} />
            Speak
          </button>

          <button
            type="button"
            onClick={isPaused ? resumeTeaching : pauseTeaching}
            disabled={!lesson || !speechAvailable}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPaused ? <Play size={17} /> : <Pause size={17} />}
            {isPaused ? "Resume" : "Pause"}
          </button>

          <button
            type="button"
            onClick={stopTeaching}
            disabled={!lesson}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <VolumeX size={17} />
            Stop
          </button>
        </div>
      </div>
    </section>

    {/* Lesson setup and explanation */}
    <section className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
            <GraduationCap size={23} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Start a lesson
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Tell your robot what you want to learn.
            </p>
          </div>
        </div>

        <form onSubmit={startTeaching} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="teacher-topic"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Enter your topic
            </label>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
              <BookOpen size={19} className="shrink-0 text-slate-400" />

              <input
                id="teacher-topic"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder="e.g. Artificial Intelligence"
                className="w-full min-w-0 py-3 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="teacher-mode"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Teaching style
            </label>

            <select
              id="teacher-mode"
              value={mode}
              onChange={(event) => setMode(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {teachingModes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Send size={18} />
            Prepare My Lesson
          </button>

          <p className="text-xs leading-5 text-slate-500">
            Demo mode: this page uses sample teaching text and your
            browser's speech feature. Real AI-generated explanations will
            require the LearnAble backend.
          </p>
        </form>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Today's lesson
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {topic.trim() || "Your selected topic will appear here"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              stopTeaching();
              setLesson("");
            }}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            title="Clear lesson"
            aria-label="Clear lesson"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        <div className="mt-5 max-h-[360px] overflow-y-auto rounded-2xl bg-slate-50 p-4">
          {lesson ? (
            <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
              {lesson}
            </p>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                <Sparkles size={27} />
              </div>

              <p className="mt-4 font-semibold text-slate-800">
                Your lesson will appear here
              </p>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                Enter a topic above and press Prepare My Lesson to begin.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  </div>
</div>

);
}