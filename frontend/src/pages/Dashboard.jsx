import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Brain,
  FileText,
  Target,
  Flame,
} from "lucide-react";

import ProgressCard from "../components/ProgressCard";

export default function Dashboard({
  onNavigate,
  onGenerateNotes,
  onStartQuiz,
}) {
  const subjects = [
    {
      title: "Artificial Intelligence",
      description: "Search algorithms and intelligent systems",
      progress: 65,
      icon: Brain,
    },
    {
      title: "Python Programming",
      description: "Programming fundamentals and libraries",
      progress: 40,
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-8">

      {/* Welcome */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 p-6 text-white md:p-9">

        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">

          <div className="max-w-xl">

            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm">
              <Sparkles size={16} />
              Your AI learning companion
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
              Welcome back, Rishabh! 👋
            </h1>

            <p className="mt-3 leading-7 text-indigo-100">
              Learn smarter, understand concepts better, and
              prepare for your exams with personalized learning tools.
            </p>

            <button
              onClick={() => onNavigate("syllabus")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-indigo-700 transition hover:bg-indigo-50"
            >
              Start Learning
              <ArrowRight size={18} />
            </button>

          </div>

          <div className="hidden h-36 w-36 items-center justify-center rounded-3xl border border-white/20 bg-white/10 md:flex">
            <Brain size={80} strokeWidth={1.4} />
          </div>

        </div>

      </section>

      {/* Statistics */}
      <section>

        <div className="mb-4 flex items-center justify-between">

          <h2 className="text-xl font-bold text-slate-900">
            Your Learning Overview
          </h2>

          <span className="text-sm text-slate-500">
            Sample dashboard data
          </span>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <ProgressCard
            title="Subjects"
            value="4"
            subtitle="Subjects in your library"
            type="subjects"
          />

          <ProgressCard
            title="Quizzes"
            value="12"
            subtitle="Sample completed count"
            type="quizzes"
          />

          <ProgressCard
            title="Progress"
            value="65%"
            subtitle="Sample learning progress"
            type="progress"
          />

          <ProgressCard
            title="Study Time"
            value="8 hrs"
            subtitle="Sample weekly total"
            type="study"
          />

        </div>

      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Subjects */}
        <section className="space-y-4 xl:col-span-2">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-bold text-slate-900">
              Continue Learning
            </h2>

            <button
              onClick={() => onNavigate("syllabus")}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View all
            </button>

          </div>

          {subjects.map((subject) => {
            const Icon = subject.icon;

            return (
              <div
                key={subject.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >

                <div className="flex items-start gap-4">

                  <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                    <Icon size={24} />
                  </div>

                  <div className="flex-1">

                    <h3 className="font-bold text-slate-900">
                      {subject.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {subject.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-sm">

                      <span className="text-slate-500">
                        Sample progress
                      </span>

                      <span className="font-semibold text-indigo-600">
                        {subject.progress}%
                      </span>

                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className="h-full rounded-full bg-indigo-600"
                        style={{
                          width: `${subject.progress}%`,
                        }}
                      />

                    </div>

                  </div>

                </div>

                <button
                  onClick={() => onNavigate("syllabus")}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Continue Learning
                  <ArrowRight size={17} />
                </button>

              </div>
            );
          })}

        </section>

        {/* Quick Actions */}
        <section className="space-y-4">

          <h2 className="text-xl font-bold text-slate-900">
            AI Learning Tools
          </h2>

          <button
            onClick={onGenerateNotes}
            className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-indigo-300 hover:shadow-md"
          >

            <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
              <FileText size={24} />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">
                Generate Notes
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create topic-based study notes
              </p>
            </div>

          </button>

          <button
            onClick={onStartQuiz}
            className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-indigo-300 hover:shadow-md"
          >

            <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
              <Target size={24} />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">
                Practice Quiz
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Test your understanding
              </p>
            </div>

          </button>

          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">

            <div className="flex items-center gap-3">

              <Flame size={24} className="text-orange-500" />

              <h3 className="font-bold text-slate-900">
                Build Your Study Habit
              </h3>

            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Set a daily study goal and make time for consistent learning.
            </p>

          </div>

        </section>

      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-5 text-center text-sm text-slate-500">
        LearnAble · Learn at your own pace.
      </footer>

    </div>
  );
}