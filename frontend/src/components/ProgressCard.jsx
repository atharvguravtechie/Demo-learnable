import {
  BookOpen,
  Target,
  Trophy,
  Clock,
} from "lucide-react";

const icons = {
  subjects: BookOpen,
  quizzes: Target,
  progress: Trophy,
  study: Clock,
};

export default function ProgressCard({
  title,
  value,
  subtitle,
  type = "subjects",
}) {
  const Icon = icons[type] || BookOpen;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon size={22} />
        </div>
      </div>

      <h2 className="mt-5 text-3xl font-bold text-slate-900">
        {value}
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        {subtitle}
      </p>

    </div>
  );
}