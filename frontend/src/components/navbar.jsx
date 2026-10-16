import {
  BookOpen,
  Search,
  Bell,
  Menu,
  Sparkles,
} from "lucide-react";

export default function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-8">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <BookOpen size={23} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Learn<span className="text-indigo-600">Able</span>
            </h1>

            <p className="hidden text-xs text-slate-500 sm:block">
              Your AI learning companion
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="hidden max-w-md flex-1 md:block">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
            <Search size={18} className="text-slate-400" />

            <input
              type="search"
              placeholder="Search subjects, topics..."
              className="w-full bg-transparent text-sm outline-none"
              aria-label="Search subjects and topics"
            />
          </div>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <button
            className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell size={21} />

            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-indigo-600" />
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
              R
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Rishabh
              </p>

              <p className="flex items-center gap-1 text-xs text-slate-500">
                <Sparkles size={12} />
                Student
              </p>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}