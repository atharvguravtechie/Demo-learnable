
import {
  BookOpen,
  Sparkles,
  Download,
  ExternalLink,
} from "lucide-react";

export default function NotesViewer({
  notes,
  topic,
  sources = [],
  loading = false,
  onDownload,
}) {
  function downloadNotes() {
    if (onDownload) {
      onDownload();
      return;
    }

    if (!notes) return;

    // Temporary text download until PDF integration.
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
          disabled={!notes || loading}
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download size={16} />
          Download
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center" role="status">
          <Sparkles
            size={36}
            className="mx-auto animate-pulse text-violet-500"
          />
          <h3 className="mt-4 font-semibold text-slate-800">
            Generating your notes...
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Please wait while LearnAble prepares your study material.
          </p>
        </div>
      ) : !notes ? (
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
        <>
          <article className="whitespace-pre-wrap py-5 text-sm leading-7 text-slate-700">
            {notes}
          </article>

          {sources.length > 0 && (
            <div className="border-t border-slate-100 pt-4">
              <h3 className="mb-3 font-semibold text-slate-900">
                Sources
              </h3>

              <ul className="space-y-3">
                {sources.map((source, index) => (
                  <li key={`${source.url}-${index}`}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 font-medium text-indigo-600 hover:underline"
                    >
                      {source.title}
                      <ExternalLink size={14} />
                    </a>

                    {source.snippet && (
                      <p className="mt-1 text-sm text-slate-500">
                        {source.snippet}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
}
