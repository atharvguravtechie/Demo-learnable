import { useEffect, useState } from "react";
import {
  BookOpen,
  Search,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowLeft,
  FileText,
  Loader2,
  GraduationCap,
} from "lucide-react";
import {
  parseSyllabus,
  getSyllabusTopics,
  createSyllabusTopic,
  deleteSyllabusTopic,
  updateTopicProgress,
} from "../services/api";


export default function Syllabus({ onSelectTopic }) {
  const [topics, setTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(true);

  const [search, setSearch] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newChapter, setNewChapter] = useState("My Topics");
  const [activeTopic, setActiveTopic] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [syllabusText, setSyllabusText] = useState("");
  const [parsingSyllabus, setParsingSyllabus] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadTopics() {
      try {
        const result = await getSyllabusTopics();
        if (!cancelled) {
          setTopics((result?.topics || []).map((topic) => ({
            id: topic.id,
            title: topic.title,
            chapter: topic.unit || "Syllabus Topics",
            duration: "15 min",
            completed: topic.status === "reviewed",
            notes: "",
          })));
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(error?.message || "Could not load topics from the backend.");
        }
      } finally {
        if (!cancelled) setLoadingTopics(false);
      }
    }

    loadTopics();
    return () => { cancelled = true; };
  }, []);

  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(search.toLowerCase())
  );

  const completedCount = topics.filter((topic) => topic.completed).length;

  async function handleParseSyllabus(event) {
    event.preventDefault();

    if (!syllabusText.trim()) {
      setMessage("Please enter your syllabus first.");
      return;
    }

    setParsingSyllabus(true);
    setMessage("");

    try {
      const result = await parseSyllabus(syllabusText);
      const parsedTopics = (result?.topics || []).map((topic, index) => ({
        id: topic.id || `parsed-${Date.now()}-${index}`,
        title: topic.title || `Topic ${index + 1}`,
        chapter: topic.unit || "Syllabus Topics",
        duration: "15 min",
        completed: topic.status === "reviewed",
        notes: "",
      }));

      if (parsedTopics.length === 0) {
        setMessage("No topics were found. Try including unit names and topic titles.");
        return;
      }

      // The parser saves topics in SQLite. Reload from the database so IDs
      // and completion status in the UI match the persisted records.
      const saved = await getSyllabusTopics();
      setTopics((saved?.topics || []).map((topic) => ({
        id: topic.id,
        title: topic.title,
        chapter: topic.unit || "Syllabus Topics",
        duration: "15 min",
        completed: topic.status === "reviewed",
        notes: "",
      })));

      setSearch("");
      setMessage(`Successfully parsed and saved ${parsedTopics.length} topics.`);
    } catch (error) {
      console.error("Syllabus parsing failed:", error);
      setMessage(
        error?.message || "Failed to parse syllabus. Check that the backend is running and try again."
      );
    } finally {
      setParsingSyllabus(false);
    }
  }

  async function addTopic(event) {
    event.preventDefault();
    const title = newTopic.trim();

    if (!title) {
      setMessage("Please enter a topic name.");
      return;
    }

    const alreadyExists = topics.some(
      (topic) => topic.title.toLowerCase() === title.toLowerCase()
    );

    if (alreadyExists) {
      setMessage("This topic already exists.");
      return;
    }

    const topic = {
      id: `custom-${Date.now()}`,
      title,
      chapter: newChapter.trim() || "My Topics",
      duration: "15 min",
      completed: false,
      notes: "",
    };

    try {
      await createSyllabusTopic({
        id: topic.id,
        title: topic.title,
        unit: topic.chapter,
      });
      setTopics((previous) => [...previous, topic]);
      setNewTopic("");
      setMessage("Topic saved successfully!");
    } catch (error) {
      setMessage(error?.message || "Could not save this topic to the database.");
    }
  }

  async function deleteTopic(id) {
    try {
      await deleteSyllabusTopic(id);
      setTopics((previous) => previous.filter((topic) => topic.id !== id));
      if (activeTopic?.id === id) setActiveTopic(null);
      setMessage("Topic deleted.");
    } catch (error) {
      setMessage(error?.message || "Could not delete this topic from the database.");
    }
  }

  async function toggleCompleted(id) {
    const currentTopic = topics.find((topic) => topic.id === id) || activeTopic;
    if (!currentTopic) return;

    const nextCompleted = !currentTopic.completed;
    try {
      await updateTopicProgress(id, nextCompleted ? "reviewed" : "not_started");
      setTopics((previous) =>
        previous.map((topic) =>
          topic.id === id ? { ...topic, completed: nextCompleted } : topic
        )
      );
      setActiveTopic((previous) =>
        previous?.id === id ? { ...previous, completed: nextCompleted } : previous
      );
      setMessage(nextCompleted ? "Progress saved." : "Topic marked incomplete.");
    } catch (error) {
      setMessage(error?.message || "Could not save topic progress.");
    }
  }

  async function generateNotes(topic) {
    setGenerating(true);
    setMessage("");

    try {
      // Local demo notes are retained so this page still works independently
      // of the AI notes endpoint. Replace with generateNotes API when desired.
      await new Promise((resolve) => setTimeout(resolve, 350));

      const generatedNotes = `# ${topic.title}

## 1. Introduction
${topic.title} is an important topic to understand as part of your studies.

## 2. Simple Explanation
Study the main definition, purpose, important concepts, and how ${topic.title} works.

## 3. Key Points
- Understand the definition.
- Learn the main concepts and terminology.
- Review important examples.
- Practice explaining the topic in your own words.

## 4. Exam Preparation
1. Define ${topic.title}.
2. Explain its important features.
3. Describe how it works, with an example.
4. Write its advantages and disadvantages where applicable.

## 5. Quick Revision
Review the definition, key concepts, examples, and important exam questions before your test.

Note: These are sample notes, not verified AI-generated subject content.`;

      setTopics((previous) =>
        previous.map((item) =>
          item.id === topic.id ? { ...item, notes: generatedNotes } : item
        )
      );

      setActiveTopic({ ...topic, notes: generatedNotes });
    } catch (error) {
      console.error("Could not generate notes:", error);
      setMessage("Could not generate notes. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  function openStudy(topic) {
    if (onSelectTopic) {
      onSelectTopic(topic);
      return;
    }

    if (topic.notes) {
      setActiveTopic(topic);
    } else {
      generateNotes(topic);
    }
  }

  // STUDY NOTES VIEW
  if (activeTopic) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setActiveTopic(null)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
          Back to My Syllabus
        </button>

        <div className="rounded-2xl bg-linear-to-r from-indigo-600 to-violet-600 p-6 text-white sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/15 p-3">
              <BookOpen size={28} />
            </div>
            <div>
              <p className="text-sm text-indigo-100">{activeTopic.chapter}</p>
              <h1 className="mt-1 text-2xl font-bold">{activeTopic.title}</h1>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-indigo-100">
            Your study material for this topic.
          </p>
        </div>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-5 flex items-center gap-2">
            <FileText className="text-indigo-600" size={23} />
            <h2 className="text-xl font-bold text-slate-900">Study Notes</h2>
          </div>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-700">
            {activeTopic.notes}
          </pre>
          <button
            type="button"
            onClick={() => toggleCompleted(activeTopic.id)}
            className={`mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold transition ${
              activeTopic.completed
                ? "bg-emerald-100 text-emerald-700"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            <CheckCircle2 size={19} />
            {activeTopic.completed
              ? "Completed — Mark as Incomplete"
              : "Mark as Completed"}
          </button>
        </article>
      </div>
    );
  }

  // MAIN SYLLABUS VIEW
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-indigo-600">
          <BookOpen size={18} />
          Learning Library
        </div>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">My Syllabus</h1>
        <p className="mt-2 text-slate-500">
          Add your own topics, generate study material, and learn at your own pace.
        </p>
      </div>

      {/* Banner */}
      <div className="rounded-2xl bg-linear-to-r from-indigo-600 to-violet-600 p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-white/15 p-3">
            <GraduationCap size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Your Personal Learning Space</h2>
            <p className="mt-2 text-sm leading-6 text-indigo-100">
              Add any subject or topic. Generate notes and track your learning progress in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Syllabus Progress</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {completedCount} / {topics.length} topics completed
            </p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-3">
            <CheckCircle2 className="text-emerald-600" size={26} />
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{
              width: `${topics.length ? (completedCount / topics.length) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Parse syllabus with backend */}
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
          {parsingSyllabus && <Loader2 size={18} className="animate-spin" />}
          {parsingSyllabus ? "Extracting Topics..." : "Extract Topics"}
        </button>
        {message && (
          <p className="mt-3 text-sm text-slate-600" role="status">
            {message}
          </p>
        )}
      </form>

      {/* Add Topic Form */}
      <form
        onSubmit={addTopic}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="rounded-lg bg-indigo-50 p-2">
            <Plus className="text-indigo-600" size={21} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Add Your Own Topic</h2>
        </div>

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Topic name
        </label>
        <input
          value={newTopic}
          onChange={(event) => setNewTopic(event.target.value)}
          placeholder="e.g. Hill Climbing Algorithm"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        <label className="mb-2 mt-4 block text-sm font-medium text-slate-700">
          Subject or chapter
        </label>
        <input
          value={newChapter}
          onChange={(event) => setNewChapter(event.target.value)}
          placeholder="e.g. Artificial Intelligence — Chapter 3"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        <button
          type="submit"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
        >
          <Plus size={19} />
          Add Topic
        </button>
        {message && (
          <p className="mt-3 text-sm text-indigo-600" role="status">
            {message}
          </p>
        )}
      </form>

      {/* Search */}
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <Search size={19} className="text-slate-400" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search your topics..."
          className="w-full outline-none"
        />
      </div>

      {/* Topic List */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          My Topics ({filteredTopics.length})
        </h2>
        <div className="space-y-4">
          {loadingTopics && (
            <p className="text-sm text-slate-500">Loading topics from your database...</p>
          )}
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`rounded-xl p-3 ${
                      topic.completed ? "bg-emerald-50" : "bg-indigo-50"
                    }`}
                  >
                    {topic.completed ? (
                      <CheckCircle2 className="text-emerald-600" size={23} />
                    ) : (
                      <BookOpen className="text-indigo-600" size={23} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{topic.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{topic.chapter}</p>
                    <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={14} />
                      {topic.duration}
                    </p>
                    {topic.completed && (
                      <span className="mt-2 inline-block rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                        Completed
                      </span>
                    )}
                    {topic.notes && (
                      <span className="ml-2 mt-2 inline-block rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                        Notes available
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => openStudy(topic)}
                    disabled={generating}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50 sm:flex-none"
                  >
                    {generating ? (
                      <Loader2 className="animate-spin" size={17} />
                    ) : (
                      <Sparkles size={17} />
                    )}
                    {topic.notes ? "Study Notes" : "Generate Notes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTopic(topic.id)}
                    aria-label={`Delete ${topic.title}`}
                    className="rounded-xl border border-rose-200 p-2.5 text-rose-600 transition hover:bg-rose-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredTopics.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <BookOpen className="mx-auto text-slate-400" size={36} />
              <h3 className="mt-3 font-bold text-slate-800">No topics found</h3>
              <p className="mt-2 text-sm text-slate-500">
                Try another search or add a new topic above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
