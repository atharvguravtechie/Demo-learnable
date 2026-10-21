import { useRef, useState } from "react";

import {
  FileText,
  Upload,
  BookOpen,
  Sparkles,
  Download,
  CheckCircle,
  LoaderCircle,
  FileUp,
  Trash2,
  ChevronDown,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

// Sample notes for common AI topics.
const SAMPLE_NOTES = {
  "Definition and History": [
    "Artificial Intelligence (AI) is a branch of computer science that develops systems capable of performing tasks that normally require human intelligence.",
    "AI systems can perform learning, reasoning, problem-solving, and decision-making.",
    "AI has evolved from rule-based systems to machine learning, deep learning, and generative AI.",
    "Examples include virtual assistants, recommendation systems, and autonomous robots.",
  ],

  "Applications of Artificial Intelligence": [
    "Healthcare: assists with medical image analysis and clinical decision support.",
    "Education: supports personalized learning and automated feedback.",
    "Banking: helps detect suspicious transactions and assess financial risk.",
    "Agriculture: supports crop monitoring and weather-based decisions.",
    "Transportation: assists route planning and autonomous driving research.",
  ],

  "Advantages and Disadvantages": [
    "Advantages: processes large amounts of data quickly.",
    "Advantages: automates repetitive tasks.",
    "Advantages: can operate continuously without fatigue.",
    "Disadvantages: development and maintenance can be expensive.",
    "Disadvantages: systems may produce inaccurate or biased results.",
    "Disadvantages: many AI systems depend on good-quality data.",
  ],

  "Breadth-First Search (BFS)": [
    "BFS is an uninformed search algorithm that explores nodes level by level.",
    "It uses a queue data structure that follows First In, First Out (FIFO).",
    "First, add the starting node to the queue.",
    "Remove the front node, visit it, and add its unvisited neighbours.",
    "Repeat until the goal is found or the queue becomes empty.",
    "BFS finds a shortest path when all edges have equal cost.",
    "Its main disadvantage is that it may consume considerable memory.",
  ],

  "Depth-First Search (DFS)": [
    "DFS explores one path as deeply as possible before backtracking.",
    "It can be implemented using a stack or recursion.",
    "Visit the starting node and explore an unvisited neighbour.",
    "Continue deeper until no unvisited neighbour remains, then backtrack.",
    "DFS often uses less memory than BFS.",
    "DFS does not generally find the shortest path.",
    "Applications include graph traversal, maze solving, and cycle detection.",
  ],

  "Heuristic Search": [
    "Heuristic search uses estimates to guide the search toward a goal.",
    "A heuristic function is commonly represented as h(n).",
    "The estimate helps prioritize promising states.",
    "Examples include Greedy Best-First Search and A* Search.",
    "Performance depends on the quality of the heuristic.",
  ],

  "Hill Climbing Algorithm": [
    "Hill climbing is a local search algorithm that repeatedly improves the current state.",
    "It evaluates neighbouring states and moves to a better state.",
    "The process stops when no neighbouring state offers improvement.",
    "Advantages include simplicity and low memory requirements.",
    "Disadvantages include local maxima, plateaus, and ridges.",
    "Applications include optimization and scheduling.",
  ],

  "Knowledge Representation Techniques": [
    "Knowledge representation organizes information so a computer can reason with it.",
    "Common techniques include logic, semantic networks, frames, and production rules.",
    "The appropriate representation depends on the problem.",
    "Good representations support efficient inference and consistent reasoning.",
  ],

  "Propositional Logic": [
    "Propositional logic represents statements that are either true or false.",
    "Logical operators include AND, OR, NOT, and implication.",
    "Truth tables describe the truth values of compound statements.",
    "It is used in digital circuits, formal reasoning, and knowledge representation.",
  ],

  "Predicate Logic": [
    "Predicate logic uses predicates, variables, and quantifiers.",
    "The universal quantifier means 'for all'.",
    "The existential quantifier means 'there exists'.",
    "It can represent relationships and properties of objects.",
    "It is more expressive than basic propositional logic.",
  ],
};

// Generate local demo notes.
function createNotesForTopic(topic) {
  if (SAMPLE_NOTES[topic]) {
    return SAMPLE_NOTES[topic];
  }

  return [
    `${topic} is an important topic that should be understood clearly.`,
    `Learn the definition and key concepts related to ${topic}.`,
    `Study the important principles and working process of ${topic}.`,
    `Review suitable examples and practical applications of ${topic}.`,
    `Prepare the advantages, disadvantages, and limitations of ${topic}, where applicable.`,
    `Revise important definitions and exam questions related to ${topic}.`,
    "These are demonstration notes, not AI-generated explanations. Connect an AI backend to generate accurate, detailed notes.",
  ];
}

// Download a text file.
function downloadTextFile(filename, content) {
  const blob = new Blob([content], {
    type: "text/plain;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Safely escape text before displaying it in the print window.
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function NotesViewer({ topic = "", notes = "" }) {
  const fileInputRef = useRef(null);

  const [subject, setSubject] = useState("");
  const [syllabusText, setSyllabusText] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [units, setUnits] = useState([]);
  const [generatedNotes, setGeneratedNotes] = useState([]);
  const [progress, setProgress] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [activeTopic, setActiveTopic] = useState("");
  const [expandedUnits, setExpandedUnits] = useState({});
  const [notice, setNotice] = useState("");

  const hasNotes = generatedNotes.length > 0;

  // Read uploaded syllabus.
  function handleFileChange(event) {
    const file = event.target.files?.[0];

    setFileError("");
    setNotice("");

    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    const isText =
      file.type === "text/plain" ||
      file.name.toLowerCase().endsWith(".txt");

    if (!isPdf && !isText) {
      setFileError("Please select a PDF or TXT syllabus file.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError("Please select a file smaller than 10 MB.");
      event.target.value = "";
      return;
    }

    setFileName(file.name);
    setUnits([]);
    setGeneratedNotes([]);
    setProgress(0);

    if (isText) {
      const reader = new FileReader();

      reader.onload = () => {
        setSyllabusText(String(reader.result || ""));
      };

      reader.onerror = () => {
        setFileError("Unable to read this text file.");
      };

      reader.readAsText(file);
    } else {
      setNotice(
        "PDF selected. Automatic PDF text extraction is not implemented yet. Copy the syllabus text from your PDF and paste it into the syllabus box."
      );
    }

    event.target.value = "";
  }

  // Convert syllabus text into units and topics.
  function parseSyllabus(text) {
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const result = [];
    let currentUnit = null;

    for (const line of lines) {
      const isUnit =
        /^(unit|module|chapter|section)\s*[-:.\d]/i.test(line);

      if (isUnit) {
        currentUnit = {
          unit: line,
          topics: [],
        };

        result.push(currentUnit);
        continue;
      }

      const cleaned = line
        .replace(/^(\d+[\.\)]|[-*•])\s*/, "")
        .trim();

      if (!cleaned) continue;

      if (!currentUnit) {
        currentUnit = {
          unit: "Topics",
          topics: [],
        };

        result.push(currentUnit);
      }

      currentUnit.topics.push(cleaned);
    }

    return result
      .map((unit) => ({
        ...unit,
        topics: [...new Set(unit.topics)],
      }))
      .filter((unit) => unit.topics.length > 0);
  }

  // Prepare demo notes for every topic.
  async function generateNotes() {
    setFileError("");
    setNotice("");

    if (!subject.trim()) {
      setFileError("Please enter the subject name first.");
      return;
    }

    if (!syllabusText.trim()) {
      setFileError(
        "Please paste your syllabus or upload a TXT file. For PDFs, paste the extracted text."
      );
      return;
    }

    const parsedUnits = parseSyllabus(syllabusText);

    if (parsedUnits.length === 0) {
      setFileError(
        "No topics were found. Add unit headings and topic names on separate lines."
      );
      return;
    }

    const totalTopics = parsedUnits.reduce(
      (total, unit) => total + unit.topics.length,
      0
    );

    setGenerating(true);
    setUnits(parsedUnits);
    setGeneratedNotes([]);
    setProgress(0);
    setActiveTopic("");

    setExpandedUnits(
      Object.fromEntries(
        parsedUnits.map((unit) => [unit.unit, true])
      )
    );

    const result = [];
    let completed = 0;

    for (const unit of parsedUnits) {
      for (const topicName of unit.topics) {
        // Demo delay. Real AI generation needs an AI backend.
        await new Promise((resolve) => setTimeout(resolve, 100));

        result.push({
          unit: unit.unit,
          topic: topicName,
          points: createNotesForTopic(topicName),
        });

        completed += 1;

        setProgress(
          Math.round((completed / totalTopics) * 100)
        );

        setGeneratedNotes([...result]);
      }
    }

    setGenerating(false);

    if (result.length > 0) {
      setActiveTopic(result[0].topic);

      setNotice(
        `Demo notes prepared for ${result.length} topics. Real AI generation can be added later.`
      );
    }
  }

  // Download all notes as TXT.
  function downloadNotes() {
    if (!hasNotes) return;

    const content = [
      subject,
      "=".repeat(Math.max(subject.length, 12)),
      "",
      "COMPLETE SUBJECT NOTES",
      "Generated by LearnAble",
      "",
      ...generatedNotes.flatMap((item) => [
        item.unit,
        "-".repeat(item.unit.length),
        "",
        item.topic,
        ...item.points.map(
          (point, index) => `${index + 1}. ${point}`
        ),
        "",
      ]),
    ].join("\n");

    const safeName =
      subject
        .trim()
        .replace(/[^a-z0-9]+/gi, "_")
        .replace(/^_+|_+$/g, "") || "Subject";

    downloadTextFile(
      `${safeName}_LearnAble_Notes.txt`,
      content
    );

    setNotice("Your complete notes have been downloaded as a TXT file.");
  }

  // Open a printable version of all notes.
  // In the print dialog, choose Save as PDF.
  function downloadPdf() {
    if (!hasNotes) return;

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      setNotice(
        "The print window was blocked. Allow pop-ups for this site and try again."
      );
      return;
    }

    const sections = generatedNotes
      .map(
        (item) => `
          <section class="topic">
            <h2>${escapeHtml(item.topic)}</h2>
            <ul>
              ${item.points
                .map(
                  (point) =>
                    `<li>${escapeHtml(point)}</li>`
                )
                .join("")}
            </ul>
          </section>
        `
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${escapeHtml(subject)} - LearnAble Notes</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #1e293b;
              max-width: 850px;
              margin: 35px auto;
              padding: 0 24px;
            }

            h1 {
              color: #4338ca;
              border-bottom: 2px solid #c7d2fe;
              padding-bottom: 12px;
            }

            h2 {
              color: #3730a3;
              font-size: 19px;
              margin-bottom: 10px;
            }

<<<<<<< temp
    document.body.appendChild(link);
    link.click();
    link.remove();
=======
            h3 {
              color: #475569;
              margin-top: 28px;
            }

            li {
              margin-bottom: 8px;
            }
>>>>>>> main

            .topic {
              margin-bottom: 26px;
              break-inside: avoid;
            }

            @media print {
              body {
                margin: 0;
                padding: 15px;
              }

              .topic {
                break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <h1>${escapeHtml(subject)} — Complete Notes</h1>
          <p>Generated using LearnAble.</p>
          ${sections}
          <script>
            window.onload = function () {
              window.focus();
              window.print();
            };
          <\/script>
        </body>
      </html>
    `);

    printWindow.document.close();

    setNotice(
      "In the print window, choose Save as PDF to save all your notes as one PDF."
    );
  }

  // Expand or collapse a unit.
  function toggleUnit(unitName) {
    setExpandedUnits((previous) => ({
      ...previous,
      [unitName]: !previous[unitName],
    }));
  }

  // Reset the form.
  function clearSyllabus() {
    setSubject("");
    setSyllabusText("");
    setFileName("");
    setFileError("");
    setNotice("");
    setUnits([]);
    setGeneratedNotes([]);
    setProgress(0);
    setActiveTopic("");
    setExpandedUnits({});

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // Find the selected topic.
  const selectedNote = generatedNotes.find(
    (item) => item.topic === activeTopic
  );

  return (
    <div className="space-y-6 text-slate-800">

      {/* Heading */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-indigo-600">
            <Sparkles size={21} />

            <span className="text-xs font-bold uppercase tracking-wider">
              LearnAble AI Studio
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Complete Syllabus Notes
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Turn your complete subject syllabus into organized,
            topic-wise study notes.
          </p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
          <BookOpen size={28} />
        </div>
      </div>

      {/* Demo information */}
      <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <AlertCircle size={20} className="mt-0.5 shrink-0" />

        <p>
          <strong>Frontend demo:</strong> This version organizes
          your syllabus and prepares sample notes. Real AI generation
          and automatic PDF reading require additional integration.
        </p>
      </div>

      {/* Input section */}
      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        {/* Subject name */}
        <div>
          <label
            htmlFor="subject-name"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Subject Name
          </label>

          <input
            id="subject-name"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="e.g. Artificial Intelligence"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* File upload */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="text-sm font-semibold text-slate-700">
              Upload Your Syllabus
            </label>

            {fileName && (
              <button
                type="button"
                onClick={() => {
                  setFileName("");
                  setFileError("");
                  setNotice("");

                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
              >
                <Trash2 size={13} />
                Remove file
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,application/pdf,text/plain"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 px-4 py-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
              {fileName ? (
                <FileText size={24} />
              ) : (
                <FileUp size={24} />
              )}
            </div>

            <span className="text-sm font-semibold text-slate-800">
              {fileName || "Choose syllabus PDF or TXT file"}
            </span>

            <span className="mt-2 text-xs text-slate-500">
              Maximum file size: 10 MB
            </span>

            <span className="mt-4 flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white">
              <Upload size={15} />
              Browse Files
            </span>
          </button>
        </div>

        {/* Syllabus text */}
        <div>
          <label
            htmlFor="syllabus-text"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Or paste the complete syllabus
          </label>

          <textarea
            id="syllabus-text"
            value={syllabusText}
            onChange={(event) => {
              setSyllabusText(event.target.value);
              setUnits([]);
              setGeneratedNotes([]);
              setProgress(0);
              setNotice("");
              setFileError("");
            }}
            placeholder={`Unit 1: Introduction to AI

Definition and History
Applications of Artificial Intelligence
Advantages and Disadvantages
Unit 2: Search Algorithms
Breadth-First Search (BFS)
Depth-First Search (DFS)
Heuristic Search
Hill Climbing Algorithm`}
            rows={9}
            className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <p className="mt-2 text-xs text-slate-500">
            Tip: Put each unit heading and topic on a separate line.
          </p>
        </div>

        {/* Error message */}
        {fileError && (
          <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={18} className="shrink-0" />
            <span>{fileError}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            disabled={generating}
            onClick={generateNotes}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {generating ? (
              <>
                <LoaderCircle size={19} className="animate-spin" />
                Preparing Notes... {progress}%
              </>
            ) : (
              <>
                <Sparkles size={19} />
                Generate Complete Notes
              </>
            )}
          </button>

          <button
            type="button"
            onClick={clearSyllabus}
            disabled={generating}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <Trash2 size={17} />
            Clear
          </button>
        </div>
      </section>

      {/* Status message */}
      {notice && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-900">
          {notice}
        </div>
      )}

      {/* Progress bar */}
      {generating && (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-semibold text-indigo-900">
              Preparing topic-wise notes
            </span>

            <span className="font-bold text-indigo-700">
              {progress}%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-indigo-100">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>
      )}

      {/* Generated notes */}
      {hasNotes && (
        <section className="space-y-5">

          {/* Results heading and downloads */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle size={21} className="text-emerald-600" />

                <h2 className="text-xl font-bold">
                  Your Notes
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {generatedNotes.length} topics prepared across{" "}
                {units.length} units.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={downloadNotes}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
              >
                <Download size={17} />
                Download TXT
              </button>

              <button
                type="button"
                onClick={downloadPdf}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                <Download size={17} />
                Save as PDF
              </button>
            </div>
          </div>

          {/* Two-column notes layout */}
          <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">

            {/* Unit and topic navigation */}
            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="mb-3 text-sm font-bold text-slate-800">
                Subject Contents
              </h3>

              <div className="space-y-2">
                {units.map((unit) => (
                  <div key={unit.unit}>
                    <button
                      type="button"
                      onClick={() => toggleUnit(unit.unit)}
                      className="flex w-full items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-100"
                    >
                      <span>{unit.unit}</span>

                      {expandedUnits[unit.unit] ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>

                    {expandedUnits[unit.unit] && (
                      <div className="mt-2 space-y-1 pl-2">
                        {unit.topics.map((topicName) => (
                          <button
                            key={topicName}
                            type="button"
                            onClick={() => setActiveTopic(topicName)}
                            className={`block w-full rounded-lg px-3 py-2 text-left text-xs ${
                              activeTopic === topicName
                                ? "bg-indigo-100 font-semibold text-indigo-700"
                                : "text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {topicName}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </aside>

            {/* Selected topic notes */}
            <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">

              {selectedNote ? (
                <>
                  <div className="mb-5 border-b border-slate-100 pb-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
                      {selectedNote.unit}
                    </p>

                    <h2 className="text-2xl font-bold leading-tight text-slate-900">
                      {selectedNote.topic}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Topic-wise study notes for {subject}.
                    </p>
                  </div>

                  <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                    <FileText size={18} className="text-indigo-600" />
                    Important Points
                  </h3>

                  <ul className="space-y-4">
                    {selectedNote.points.map((point, index) => (
                      <li
                        key={`${selectedNote.topic}-${index}`}
                        className="flex gap-3 text-sm leading-7 text-slate-700"
                      >
                        <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">
                          {index + 1}
                        </span>

                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
                    These are frontend demonstration notes. Verify
                    important facts with your textbook or class notes.
                    Connect an AI backend for detailed,
                    topic-specific generation.
                  </div>
                </>
              ) : (
                <div className="flex min-h-64 flex-col items-center justify-center text-center">
                  <BookOpen size={36} className="mb-3 text-indigo-300" />

                  <h3 className="font-bold text-slate-800">
                    Select a topic
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    Choose a topic from Subject Contents to view
                    its notes here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {!hasNotes && !generating && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
          <BookOpen size={36} className="mx-auto mb-3 text-slate-300" />

          <h3 className="font-bold text-slate-700">
            Your notes will appear here
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Enter your subject, paste the syllabus, and click
            Generate Complete Notes to organize your topics.
          </p>
        </div>
      )}

    </div>
  );
}
