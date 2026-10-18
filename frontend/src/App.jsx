import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  generateNotes,
  downloadNotesPdf,
} from "./services/api";
import {
  getProgress,
  updateTopicProgress,
} from "./services/api";
import {
House,
BookOpen,
FileText,
Target,
ChartNoAxesColumnIncreasing,
Settings,
X,
Sparkles,
Bot,
} from "lucide-react";

import Navbar from "./components/navbar";
import Dashboard from "./pages/Dashboard";
import Syllabus from "./pages/Syllabus";
import NotesViewer from "./components/NotesViewer";
import Quiz from "./components/Quiz";
import Login from "./pages/Login.jsx";
import Register from "./pages/Resister.jsx";
import RobotTeacher from "./pages/RobotTeacher.jsx";

const navigation = [
{ id: "dashboard", label: "Dashboard", icon: House },
{ id: "syllabus", label: "My Syllabus", icon: BookOpen },
{ id: "notes", label: "AI Notes", icon: FileText },
{ id: "quiz", label: "Practice Quiz", icon: Target },
{ id: "teacher", label: "Robot Teacher", icon: Bot },
{
id: "progress",
label: "My Progress",
icon: ChartNoAxesColumnIncreasing,
},
{ id: "settings", label: "Settings", icon: Settings },
];

function LearnAbleDashboard() {
const [page, setPage] = useState("dashboard");
const [sidebarOpen, setSidebarOpen] = useState(false);
const [selectedTopic, setSelectedTopic] = useState("");
const [notes, setNotes] = useState("");
const [noteSources, setNoteSources] = useState([]);
const [notesLoading, setNotesLoading] = useState(false);
const [notesError, setNotesError] = useState("");
const [selectedTopicId, setSelectedTopicId] = useState("");
const [progressData, setProgressData] = useState(null);
const [progressLoading, setProgressLoading] = useState(false);
const [progressError, setProgressError] = useState("");

function navigate(destination) {
setPage(destination);
setSidebarOpen(false);
}


function handleSelectTopic(topic) {
  setSelectedTopic(topic.title);
  setSelectedTopicId(String(topic.id));
  setNotes("");
  setNoteSources([]);
  setNotesError("");
  setPage("notes");
  setSidebarOpen(false);
}

async function handleGenerateNotes() {
  const topicTitle = selectedTopic.trim();

  if (!topicTitle) {
    setNotesError("Please enter a topic first.");
    return;
  }

  const topicId =
    selectedTopicId ||
    topicTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  setNotesLoading(true);
  setNotesError("");
  setNotes("");

  try {
    const result = await generateNotes({
      topic_id: topicId,
      topic_title: topicTitle,
    });

    setSelectedTopicId(result.topic_id);
    setNotes(result.content);
    setNoteSources(result.sources || []);
  } catch (error) {
    setNotesError(
      error.message || "Unable to generate notes. Please try again."
    );
  } finally {
    setNotesLoading(false);
  }
}

async function handleDownloadNotesPdf() {
  if (!selectedTopicId || !notes) return;

  try {
    const blob = await downloadNotesPdf(selectedTopicId);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${selectedTopicId}-notes.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    setNotesError(
      error.message || "Unable to download the PDF. Please try again."
    );
  }
}

async function loadProgress() {
  setProgressLoading(true);
  setProgressError("");

  try {
    const data = await getProgress();
    setProgressData(data);
  } catch (error) {
    setProgressError(
      error.message || "Unable to load learning progress."
    );
  } finally {
    setProgressLoading(false);
  }
}

useEffect(() => {
  if (page === "progress") {
    loadProgress();
  }
}, [page]);

async function handleProgressUpdate(topicId, status) {
  setProgressError("");

  try {
    await updateTopicProgress(topicId, status);
    await loadProgress();
  } catch (error) {
    setProgressError(
      error.message || "Unable to update topic progress."
    );
  }
}


function renderPage() {
switch (page) {
case "dashboard":
return (
<Dashboard
onNavigate={navigate}
onGenerateNotes={handleGenerateNotes}
onStartQuiz={() => navigate("quiz")}
/>
);

  case "syllabus":
    return <Syllabus onSelectTopic={handleSelectTopic} />;

  
case "notes":
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          AI Notes Generator
        </h1>

        <p className="mt-2 text-slate-500">
          Generate organized study notes for any topic in your syllabus.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <label
          htmlFor="topic"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Enter your topic
        </label>

        <input
          id="topic"
          value={selectedTopic}
          onChange={(event) => {
            setSelectedTopic(event.target.value);
            setSelectedTopicId("");
          }}
          placeholder="Example: Breadth-First Search"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={handleGenerateNotes}
            disabled={notesLoading}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Sparkles size={18} />
            {notesLoading ? "Generating..." : "Generate AI Notes"}
          </button>

          <button
            onClick={() => {
              setNotes("");
              setNoteSources([]);
              setNotesError("");
            }}
            disabled={notesLoading}
            className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Clear Notes
          </button>
        </div>

        {notesError && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {notesError}
          </p>
        )}
      </div>

      <NotesViewer
        topic={selectedTopic}
        notes={notes}
        sources={noteSources}
        loading={notesLoading}
        onDownload={handleDownloadNotesPdf}
      />
    </div>
  );


  case "quiz":
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Practice Quiz
          </h1>

          <p className="mt-2 text-slate-500">
            Test your knowledge with practice questions.
          </p>
        </div>

       <Quiz
  topicTitle={selectedTopic || "Artificial Intelligence"}
  topicId={selectedTopicId}
/>
      </div>
    );

  case "teacher":
    return <RobotTeacher />;

 
case "progress":
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          My Progress
        </h1>
        <p className="mt-2 text-slate-500">
          Track your syllabus coverage and reviewed topics.
        </p>
      </div>

      {progressError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {progressError}
        </div>
      )}

      {progressLoading && !progressData ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">
          Loading your progress...
        </div>
      ) : progressData ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Total topics</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {progressData.total_topics}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Reviewed topics</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {progressData.completed_topics}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Syllabus coverage</p>
              <p className="mt-2 text-3xl font-bold text-indigo-600">
                {Math.round(progressData.coverage_percentage)}%
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900">
                Topic progress
              </h2>
              <button
                onClick={loadProgress}
                disabled={progressLoading}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Refresh
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {progressData.topics.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No topics yet. Parse your syllabus first to start tracking progress.
                </p>
              ) : (
                progressData.topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="border-b border-slate-100 pb-5 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {topic.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Quiz score: {topic.quiz_percentage}%
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          handleProgressUpdate(
                            topic.id,
                            topic.status === "reviewed"
                              ? "not_started"
                              : "reviewed"
                          )
                        }
                        disabled={progressLoading}
                        className={`rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-50 ${
                          topic.status === "reviewed"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-indigo-50 text-indigo-700"
                        }`}
                      >
                        {topic.status === "reviewed"
                          ? "✓ Reviewed"
                          : "Mark reviewed"}
                      </button>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, topic.quiz_percentage)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      ) : (
        !progressLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-slate-600">
              No progress data is available yet.
            </p>
            <button
              onClick={loadProgress}
              className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
            >
              Try again
            </button>
          </div>
        )
      )}
    </div>
  );


  case "settings":
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Settings
        </h1>

        <p className="mt-3 leading-7 text-slate-600">
          Profile, preferences, and study reminder settings
          will be implemented here.
        </p>
      </div>
    );

  default:
    return null;
}

}

return (
<div className="min-h-screen bg-slate-50">
<Navbar onMenuClick={() => setSidebarOpen(true)} />

  <div className="mx-auto flex max-w-[1600px]">
    {sidebarOpen && (
      <button
        aria-label="Close navigation"
        onClick={() => setSidebarOpen(false)}
        className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
      />
    )}

    <aside
      className={`fixed bottom-0 left-0 top-16 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:sticky lg:top-16 lg:z-0 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 lg:hidden">
        <span className="font-bold text-slate-900">
          Menu
        </span>

        <button
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
          className="rounded-lg p-2 hover:bg-slate-100"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Learning Space
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;
          const active = page === item.id;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                active
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon size={19} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="m-4 rounded-2xl bg-indigo-50 p-4">
        <Sparkles size={22} className="text-indigo-600" />

        <h3 className="mt-3 font-bold text-slate-900">
          Learn smarter
        </h3>

        <p className="mt-2 text-xs leading-5 text-slate-600">
          Your personalized learning experience starts here.
        </p>
      </div>
    </aside>

    <main className="min-w-0 flex-1 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {renderPage()}
      </div>
    </main>
  </div>
</div>

);
}

export default function App() {
return (
<BrowserRouter>
<Routes>
<Route path="/" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route
path="/dashboard"
element={<LearnAbleDashboard />}
/>
</Routes>
</BrowserRouter>
);
}