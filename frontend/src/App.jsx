import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

function navigate(destination) {
setPage(destination);
setSidebarOpen(false);
}

function handleSelectTopic(topic) {
setSelectedTopic(topic.title);
setNotes("");
setPage("notes");
setSidebarOpen(false);
}

function handleGenerateNotes() {
setSelectedTopic(
(current) => current || "Artificial Intelligence"
);
setNotes("");
setPage("notes");
setSidebarOpen(false);
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
            Prepare clear and organized notes for your studies.
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
            onChange={(event) =>
              setSelectedTopic(event.target.value)
            }
            placeholder="Example: Breadth-First Search"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <p className="mt-2 text-xs text-slate-500">
            Connect the AI backend to generate actual notes.
          </p>

          <button
            onClick={() => setNotes("")}
            className="mt-4 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            <Sparkles size={18} />
            Clear Notes
          </button>
        </div>

        <NotesViewer topic={selectedTopic} notes={notes} />
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

        <Quiz />
      </div>
    );

  case "teacher":
    return <RobotTeacher />;

  case "progress":
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="text-3xl font-bold text-slate-900">
          My Progress
        </h1>

        <p className="mt-3 leading-7 text-slate-600">
          Your learning progress will appear here once the backend
          progress API is connected.
        </p>
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