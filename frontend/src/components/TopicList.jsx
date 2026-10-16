import {
  BookOpen,
  CheckCircle2,
  Circle,
  ChevronRight,
} from "lucide-react";

export default function TopicList({
  topics = [],
  onSelectTopic,
}) {
  return (
    <div className="space-y-3">

      {topics.map((topic) => (
        <button
          key={topic.id}
          onClick={() => onSelectTopic?.(topic)}
          className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50/40"
        >

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <BookOpen size={20} />
            </div>

            <div>
              <h3 className="font-semibold text-slate-800">
                {topic.title}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {topic.duration || "10 min"} · {topic.chapter || "Study topic"}
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2">

            {topic.completed ? (
              <CheckCircle2
                size={20}
                className="text-emerald-500"
              />
            ) : (
              <Circle
                size={20}
                className="text-slate-300"
              />
            )}

            <ChevronRight
              size={18}
              className="text-slate-400"
            />

          </div>

        </button>
      ))}

      {topics.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          No topics available yet.
        </p>
      )}

    </div>
  );
}