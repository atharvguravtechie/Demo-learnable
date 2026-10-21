import { useEffect, useRef, useState } from "react";
import {
BookOpen,
Search,
Bell,
Menu,
Sparkles,
X,
CheckCheck,
BookOpenCheck,
Trophy,
Newspaper,
Clock,
ExternalLink,
} from "lucide-react";

const INITIAL_NOTIFICATIONS = [
{
id: 1,
type: "study",
title: "Daily Study Goal",
message: "Keep learning! Spend some time studying today to reach your daily goal.",
time: "Study reminder",
read: false,
},
{
id: 2,
type: "quiz",
title: "Quiz Challenge",
message: "Challenge yourself with a practice quiz and test your knowledge.",
time: "Practice",
read: false,
},
{
id: 3,
type: "news",
title: "AI Learning News",
message: "Explore how artificial intelligence is transforming education.",
time: "Learning news",
read: false,
},
{
id: 4,
type: "study",
title: "Learning Tip",
message: "Try the Pomodoro technique: study for 25 minutes, then take a 5-minute break.",
time: "Learning tip",
read: true,
},
];

const ICONS = {
study: BookOpenCheck,
quiz: Trophy,
news: Newspaper,
};

const COLORS = {
study: "bg-blue-100 text-blue-600",
quiz: "bg-purple-100 text-purple-600",
news: "bg-emerald-100 text-emerald-600",
};

export default function Navbar({ onMenuClick }) {
const [open, setOpen] = useState(false);
const [notifications, setNotifications] = useState(() => {
try {
const saved = localStorage.getItem("learnable-notifications");

  return saved
    ? JSON.parse(saved)
    : INITIAL_NOTIFICATIONS;
} catch {
  return INITIAL_NOTIFICATIONS;
}

});

const popupRef = useRef(null);
const unreadCount = notifications.filter(
(notification) => !notification.read
).length;

useEffect(() => {
try {
localStorage.setItem(
"learnable-notifications",
JSON.stringify(notifications)
);
} catch (error) {
console.error("Unable to save notifications:", error);
}
}, [notifications]);

useEffect(() => {
function handleOutsideClick(event) {
if (
popupRef.current &&
!popupRef.current.contains(event.target)
) {
setOpen(false);
}
}

function handleEscape(event) {
  if (event.key === "Escape") {
    setOpen(false);
  }
}

document.addEventListener("mousedown", handleOutsideClick);
document.addEventListener("touchstart", handleOutsideClick);
document.addEventListener("keydown", handleEscape);

return () => {
  document.removeEventListener("mousedown", handleOutsideClick);
  document.removeEventListener("touchstart", handleOutsideClick);
  document.removeEventListener("keydown", handleEscape);
};

}, []);

function markAllAsRead() {
setNotifications((previous) =>
previous.map((notification) => ({
...notification,
read: true,
}))
);
}

function markAsRead(id) {
setNotifications((previous) =>
previous.map((notification) =>
notification.id === id
? { ...notification, read: true }
: notification
)
);
}

function handleNotificationClick(notification) {
markAsRead(notification.id);

// These are sample notifications. Actual navigation
// can be connected to your app's pages later.
if (notification.type === "quiz") {
  setOpen(false);
} else if (notification.type === "study") {
  setOpen(false);
} else if (notification.type === "news") {
  setOpen(false);
}

}

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

    {/* Notifications and Profile */}
    <div className="flex items-center gap-3">

      {/* Notification Bell and Popup */}
      <div className="relative" ref={popupRef}>
        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          className={`relative rounded-xl p-2 transition ${
            open
              ? "bg-indigo-50 text-indigo-600"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          aria-label={`Notifications, ${unreadCount} unread`}
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <Bell size={21} />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div
            role="dialog"
            aria-label="Notifications"
            className="absolute right-0 top-12 z-[100] w-[min(360px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            {/* Popup Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Notifications
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {unreadCount > 0
                    ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                    : "You're all caught up!"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close notifications"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mark All as Read */}
            {unreadCount > 0 && (
              <div className="flex justify-end border-b border-slate-100 px-4 py-2">
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  <CheckCheck size={15} />
                  Mark all as read
                </button>
              </div>
            )}

            {/* Notification List */}
            <div className="max-h-[350px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <Bell
                    size={30}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    No notifications yet
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    New updates will appear here.
                  </p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon =
                    ICONS[notification.type] || Clock;

                  return (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() =>
                        handleNotificationClick(notification)
                      }
                      className={`flex w-full gap-3 border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50 ${
                        notification.read
                          ? "bg-white"
                          : "bg-indigo-50/60"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          COLORS[notification.type] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Icon size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-800">
                            {notification.title}
                          </p>

                          {!notification.read && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                          )}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-slate-600">
                          {notification.message}
                        </p>

                        <p className="mt-2 text-[11px] font-medium text-slate-400">
                          {notification.time}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Popup Footer */}
            <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
              <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
                <ExternalLink size={13} />
                LearnAble Learning Updates
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Profile */}
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