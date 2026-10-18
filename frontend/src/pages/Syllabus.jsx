import { useState } from "react";
import { parseSyllabus } from "../services/api";
import {
  BookOpen,
  Search,
  Sparkles,
  Loader2,
} from "lucide-react";

import TopicList from "../components/TopicList";

const initialTopics = [
  {
    id: 1,
    title: "Introduction to Artificial Intelligence",
    chapter: "Chapter 1",
    duration: "15 min",
    completed: false,
  },
  {
    id: 2,
    title: "Breadth-First Search",
    chapter: "Chapter 2",
    duration: "20 min",
    completed: false,
  },
  {
    id: 3,
    title: "Depth-First Search",
    chapter: "Chapter 2",
    duration: "20 min",
    completed: false,
  },
  {
    id: 4,
    title: "Heuristic Search",
    chapter: "Chapter 3",
    duration: "25 min",
    completed: false,
  },
];


export default function Syllabus({ onSelectTopic }) {
  const [search, setSearch] = useState("");
  const [syllabusText, setSyllabusText] = useState("");
  const [parsingSyllabus, setParsingSyllabus] = useState(false);
  const [message, setMessage] = useState("");
  const [topics, setTopics] = useState(initialTopics);

  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(search.toLowerCase())
  );

  async function handleParseSyllabus(event) {
    event.preventDefault();

    if (!syllabusText.trim()) {
      setMessage("Please paste your syllabus first.");
      return;
    }

    setParsingSyllabus(true);
    setMessage("");

    try {
      const result = await parseSyllabus(syllabusText);

      if (!result.topics || result.topics.length === 0) {
        setMessage("No topics were found. Try a clearer syllabus.");
        return;
      }

      const parsedTopics = result.topics.map((topic) => ({
        id: topic.id,
        title: topic.title,
        chapter: topic.unit || "Syllabus Topics",
        duration: "15 min",
        completed: topic.status === "reviewed",
      }));

      setTopics(parsedTopics);
      setSearch("");
      setMessage(`Successfully extracted ${parsedTopics.length} topics.`);
    } catch (error) {
      setMessage(`Could not parse syllabus: ${error.message}`);
    } finally {
      setParsingSyllabus(false);
    }
  }


  return (
    <div className="space-y-6">

      <div>
        <div className="flex items-center gap-2 text-sm text-indigo-600">
          <BookOpen size={18} />
          Learning Library
        </div>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          My Syllabus
        </h1>

        <p className="mt-2 text-slate-500">
          Explore topics and build your understanding step by step.
        </p>
      </div>

      <div className="rounded-2xl bg-linear-to-r from-indigo-600 to-violet-600 p-6 text-white">

        <div className="flex items-start gap-4">

          <div className="rounded-xl bg-white/15 p-3">
            <Sparkles size={26} />
          </div>

          <div>
            <h2 className="text-xl font-bold">
              Artificial Intelligence
            </h2>

            <p className="mt-2 text-sm leading-6 text-indigo-100">
              Learn search algorithms, heuristic techniques,
              knowledge representation, and more.
            </p>
          </div>
          
<form
  onSubmit={handleParseSyllabus}
  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
>
  <h2 className="text-lg font-bold text-slate-900">
    Generate Topics from Your Syllabus
  </h2>

  <p className="mt-2 text-sm text-slate-500">
    Paste your subject syllabus below to extract learning topics.
  </p>

  <textarea
    value={syllabusText}
    onChange={(event) => setSyllabusText(event.target.value)}
    placeholder={"Unit 1: Introduction to AI\nUnit 2: Search Algorithms\nUnit 3: Knowledge Representation"}
    rows={6}
    className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
  />

  <button
    type="submit"
    disabled={parsingSyllabus}
    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
  >
    {parsingSyllabus && (
      <Loader2 size={18} className="animate-spin" />
    )}
    {parsingSyllabus ? "Extracting Topics..." : "Extract Topics"}
  </button>

  {message && (
    <p className="mt-3 text-sm text-slate-600" role="status">
      {message}
    </p>
  )}
</form>

        </div>

      </div>

      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">

        <Search size={19} className="text-slate-400" />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search topics..."
          className="w-full outline-none"
        />

      </div>

      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          Topics
        </h2>

      <TopicList
         topics={filteredTopics}
          onSelectTopic={onSelectTopic}
      />
      </div>

    </div>
  );
}