import { useState } from "react";

import {
  BookOpen,
  Search,
  Sparkles,
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

  const topics = initialTopics.filter((topic) =>
    topic.title.toLowerCase().includes(search.toLowerCase())
  );

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

      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">

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
          topics={topics}
          onSelectTopic={onSelectTopic}
        />
      </div>

    </div>
  );
}