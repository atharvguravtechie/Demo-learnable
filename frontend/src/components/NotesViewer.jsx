import {
  BookOpen,
  Sparkles,
  Download,
} from "lucide-react";

export default function NotesViewer({
  notes,
  topic,
}) {
  function downloadNotes() {
    if (!notes) return;

    const blob = new Blob(
      [notes],
      { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `${topic || "learnable-notes"}.txt`;

    document.body.appendChild(link);

    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
            <BookOpen size={22} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              AI Study Notes
            </h2>

            <p className="text-sm text-slate-500">
              {topic || "Your selected topic"}
            </p>
          </div>

        </div>

        <button
          onClick={downloadNotes}
          disabled={!notes}
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download size={16} />
          Download
        </button>

      </div>

      {!notes ? (
        <div className="py-12 text-center">

          <Sparkles
            size={36}
            className="mx-auto text-violet-500"
          />

          <h3 className="mt-4 font-semibold text-slate-800">
            Your notes will appear here
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Select a topic and generate your study notes.
          </p>

        </div>
      ) : (
        <article className="whitespace-pre-wrap py-5 text-sm leading-7 text-slate-700">
          {notes}
        </article>
      )}

    </section>
  );
}