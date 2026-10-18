import React, { useEffect, useState } from "react";
import {
User,
Target,
Bell,
Clock,
Palette,
Globe,
Save,
RotateCcw,
CheckCircle,
Moon,
Sun,
Settings as SettingsIcon,
} from "lucide-react";

const DEFAULT_SETTINGS = {
name: "",
email: "",
course: "B.Sc. Computer Science",
studyGoal: 60,
reminderEnabled: true,
reminderTime: "19:00",
notificationsEnabled: true,
language: "English",
theme: "Light",
};

const STORAGE_KEY = "learnable-settings";

export default function Settings() {
const [settings, setSettings] = useState(DEFAULT_SETTINGS);
const [saved, setSaved] = useState(false);
const [loading, setLoading] = useState(true);

useEffect(() => {
try {
const stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {
    const parsed = JSON.parse(stored);

    setSettings({
      ...DEFAULT_SETTINGS,
      ...parsed,
    });
  }
} catch (error) {
  console.error("Unable to load settings:", error);
} finally {
  setLoading(false);
}

}, []);

const updateSetting = (field, value) => {
setSettings((previous) => ({
...previous,
[field]: value,
}));

setSaved(false);

};

const saveSettings = () => {
try {
localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

  setSaved(true);

  window.setTimeout(() => {
    setSaved(false);
  }, 3000);
} catch (error) {
  console.error("Unable to save settings:", error);
  alert("Settings could not be saved. Please try again.");
}

};

const resetSettings = () => {
const confirmed = window.confirm(
"Are you sure you want to restore the default settings?"
);

if (!confirmed) return;

setSettings(DEFAULT_SETTINGS);
localStorage.setItem(
  STORAGE_KEY,
  JSON.stringify(DEFAULT_SETTINGS)
);
setSaved(true);

};

const inputClass =
"mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const sectionClass =
"rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6";

if (loading) {
return (
<div className="p-8 text-center text-gray-500">
Loading settings...
</div>
);
}

return (
<div className="mx-auto max-w-5xl space-y-6 p-4 text-gray-800 sm:p-6">
{/* Page heading */}
<div className="flex flex-wrap items-center justify-between gap-4">
<div>
<div className="mb-2 flex items-center gap-2 text-blue-600">
<SettingsIcon size={22} />
<span className="text-sm font-semibold">
PERSONAL PREFERENCES
</span>
</div>

      <h1 className="text-3xl font-bold">Settings</h1>

      <p className="mt-2 text-sm text-gray-500">
        Customize your LearnAble learning experience.
      </p>
    </div>

    <div className="rounded-xl bg-blue-50 p-4 text-blue-700">
      <SettingsIcon size={28} />
    </div>
  </div>

  {/* Save status */}
  {saved && (
    <div
      role="status"
      className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
    >
      <CheckCircle size={20} />
      Settings saved successfully!
    </div>
  )}

  {/* Profile settings */}
  <section className={sectionClass}>
    <div className="mb-5 flex items-center gap-3">
      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
        <User size={22} />
      </div>

      <div>
        <h2 className="text-lg font-bold">Profile Settings</h2>
        <p className="text-sm text-gray-500">
          Manage your personal information.
        </p>
      </div>
    </div>

    <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <label
          htmlFor="profile-name"
          className="text-sm font-semibold"
        >
          Full Name
        </label>

        <input
          id="profile-name"
          type="text"
          value={settings.name}
          onChange={(event) =>
            updateSetting("name", event.target.value)
          }
          placeholder="Enter your full name"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="profile-email"
          className="text-sm font-semibold"
        >
          Email Address
        </label>

        <input
          id="profile-email"
          type="email"
          value={settings.email}
          onChange={(event) =>
            updateSetting("email", event.target.value)
          }
          placeholder="Enter your email"
          className={inputClass}
        />
      </div>

      <div className="sm:col-span-2">
        <label
          htmlFor="profile-course"
          className="text-sm font-semibold"
        >
          Course / Education
        </label>

        <select
          id="profile-course"
          value={settings.course}
          onChange={(event) =>
            updateSetting("course", event.target.value)
          }
          className={inputClass}
        >
          <option>B.Sc. Computer Science</option>
          <option>B.Sc. Electronics and Computer Science</option>
          <option>BCA</option>
          <option>B.Tech / B.E.</option>
          <option>MCA</option>
          <option>M.Sc. Computer Science</option>
          <option>Other</option>
        </select>
      </div>
    </div>
  </section>

  {/* Study goals */}
  <section className={sectionClass}>
    <div className="mb-5 flex items-center gap-3">
      <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
        <Target size={22} />
      </div>

      <div>
        <h2 className="text-lg font-bold">Study Goals</h2>
        <p className="text-sm text-gray-500">
          Set your daily learning target.
        </p>
      </div>
    </div>

    <div className="rounded-xl bg-purple-50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold">Daily Study Goal</p>
          <p className="mt-1 text-sm text-gray-600">
            How many minutes do you want to study each day?
          </p>
        </div>

        <div className="text-right">
          <span className="text-3xl font-bold text-purple-700">
            {settings.studyGoal}
          </span>
          <span className="ml-1 text-sm text-purple-700">
            minutes
          </span>
        </div>
      </div>

      <input
        type="range"
        min="15"
        max="180"
        step="15"
        value={settings.studyGoal}
        onChange={(event) =>
          updateSetting("studyGoal", Number(event.target.value))
        }
        aria-label="Daily study goal in minutes"
        className="mt-5 w-full cursor-pointer accent-purple-600"
      />

      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>15 minutes</span>
        <span>180 minutes</span>
      </div>

      <p className="mt-4 text-sm text-purple-700">
        Your target: {settings.studyGoal / 60 > 0
          ? `${Math.floor(settings.studyGoal / 60)} hour${
              Math.floor(settings.studyGoal / 60) > 1 ? "s" : ""
            }${
              settings.studyGoal % 60
                ? ` ${settings.studyGoal % 60} minutes`
                : ""
            }`
          : `${settings.studyGoal} minutes`} per day.
      </p>
    </div>
  </section>

  {/* Study reminders */}
  <section className={sectionClass}>
    <div className="mb-5 flex items-center gap-3">
      <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
        <Clock size={22} />
      </div>

      <div>
        <h2 className="text-lg font-bold">Study Reminders</h2>
        <p className="text-sm text-gray-500">
          Choose when you prefer to study.
        </p>
      </div>
    </div>

    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="font-semibold">Daily Study Reminder</p>
        <p className="mt-1 text-sm text-gray-500">
          Save your preferred reminder time.
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={settings.reminderEnabled}
        onClick={() =>
          updateSetting(
            "reminderEnabled",
            !settings.reminderEnabled
          )
        }
        className={`relative h-7 w-12 rounded-full transition ${
          settings.reminderEnabled
            ? "bg-blue-600"
            : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            settings.reminderEnabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>
    </div>

    {settings.reminderEnabled && (
      <div className="mt-5 max-w-sm">
        <label
          htmlFor="reminder-time"
          className="text-sm font-semibold"
        >
          Preferred Reminder Time
        </label>

        <input
          id="reminder-time"
          type="time"
          value={settings.reminderTime}
          onChange={(event) =>
            updateSetting("reminderTime", event.target.value)
          }
          className={inputClass}
        />

        <p className="mt-2 text-xs text-gray-500">
          This saves your preferred time. Automatic reminders
          require a notification or scheduling service.
        </p>
      </div>
    )}
  </section>

  {/* Notifications */}
  <section className={sectionClass}>
    <div className="mb-5 flex items-center gap-3">
      <div className="rounded-xl bg-green-50 p-3 text-green-600">
        <Bell size={22} />
      </div>

      <div>
        <h2 className="text-lg font-bold">Notifications</h2>
        <p className="text-sm text-gray-500">
          Manage your notification preference.
        </p>
      </div>
    </div>

    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="font-semibold">Study Notifications</p>
        <p className="mt-1 text-sm text-gray-500">
          Enable study-related notification preferences.
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={settings.notificationsEnabled}
        onClick={() =>
          updateSetting(
            "notificationsEnabled",
            !settings.notificationsEnabled
          )
        }
        className={`relative h-7 w-12 rounded-full transition ${
          settings.notificationsEnabled
            ? "bg-blue-600"
            : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            settings.notificationsEnabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>
    </div>
  </section>

  {/* Appearance */}
  <section className={sectionClass}>
    <div className="mb-5 flex items-center gap-3">
      <div className="rounded-xl bg-pink-50 p-3 text-pink-600">
        <Palette size={22} />
      </div>

      <div>
        <h2 className="text-lg font-bold">Appearance</h2>
        <p className="text-sm text-gray-500">
          Choose your preferred theme.
        </p>
      </div>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      {[
        {
          name: "Light",
          icon: Sun,
          description: "A bright, clean learning interface.",
        },
        {
          name: "Dark",
          icon: Moon,
          description: "A darker interface preference.",
        },
      ].map((option) => {
        const Icon = option.icon;
        const selected = settings.theme === option.name;

        return (
          <button
            key={option.name}
            type="button"
            aria-pressed={selected}
            onClick={() => updateSetting("theme", option.name)}
            className={`rounded-xl border p-4 text-left transition ${
              selected
                ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon size={22} />
              <span className="font-semibold">
                {option.name} Mode
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              {option.description}
            </p>

            {selected && (
              <p className="mt-3 text-xs font-semibold text-blue-700">
                Selected
              </p>
            )}
          </button>
        );
      })}
    </div>

    <p className="mt-3 text-xs text-gray-500">
      The selected theme is saved as a preference. Applying it
      across the entire app requires connecting the theme to
      your main layout.
    </p>
  </section>

  {/* Language */}
  <section className={sectionClass}>
    <div className="mb-5 flex items-center gap-3">
      <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
        <Globe size={22} />
      </div>

      <div>
        <h2 className="text-lg font-bold">Language</h2>
        <p className="text-sm text-gray-500">
          Choose your preferred app language.
        </p>
      </div>
    </div>

    <div>
      <label
        htmlFor="app-language"
        className="text-sm font-semibold"
      >
        App Language
      </label>

      <select
        id="app-language"
        value={settings.language}
        onChange={(event) =>
          updateSetting("language", event.target.value)
        }
        className={inputClass}
      >
        <option>English</option>
        <option>Hindi</option>
        <option>Marathi</option>
      </select>

      <p className="mt-2 text-xs text-gray-500">
        This saves your language preference. Translating the
        entire app requires additional language support.
      </p>
    </div>
  </section>

  {/* Actions */}
  <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
    <button
      type="button"
      onClick={resetSettings}
      className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
    >
      <RotateCcw size={18} />
      Reset to Default
    </button>

    <button
      type="button"
      onClick={saveSettings}
      className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
    >
      <Save size={18} />
      Save Settings
    </button>
  </div>

  <p className="pb-4 text-center text-xs text-gray-400">
    LearnAble · Personalize your learning experience
  </p>
</div>

);
}