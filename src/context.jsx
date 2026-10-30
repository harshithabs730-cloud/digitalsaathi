import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { LESSONS } from "./data/lessons.js";

const todayKey = (d = new Date()) => d.toLocaleDateString("en-CA");

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// ---------- settings ----------
const SettingsCtx = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => load("ds_settings", { lang: "en", bigText: false }));
  useEffect(() => {
    save("ds_settings", settings);
    document.documentElement.classList.toggle("big-text", settings.bigText);
    document.documentElement.lang = settings.lang;
  }, [settings]);
  const value = useMemo(
    () => ({
      ...settings,
      setLang: (lang) => setSettings((s) => ({ ...s, lang })),
      toggleBigText: () => setSettings((s) => ({ ...s, bigText: !s.bigText })),
    }),
    [settings]
  );
  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>;
}
export const useSettings = () => useContext(SettingsCtx);

// ---------- progress ----------
function seedActivity() {
  const demo = [12, 0, 25, 18, 30, 10];
  const out = {};
  demo.forEach((m, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    if (m) out[todayKey(d)] = m;
  });
  return out;
}
const initialProgress = () => ({ completed: {}, scams: 0, activity: seedActivity(), log: [] });

const ProgressCtx = createContext(null);

export function ProgressProvider({ children }) {
  const [p, setP] = useState(() => load("ds_progress", initialProgress()));
  useEffect(() => save("ds_progress", p), [p]);

  const addLog = (state, text) => ({
    ...state,
    log: [{ text, time: new Date().toISOString() }, ...state.log].slice(0, 8),
  });

  const completeLesson = useCallback((id, minutes) => {
    setP((s) => {
      const first = !s.completed[id];
      const key = todayKey();
      let next = {
        ...s,
        completed: { ...s.completed, [id]: true },
        activity: { ...s.activity, [key]: (s.activity[key] || 0) + minutes },
      };
      if (first) {
        const lesson = LESSONS.find((l) => l.id === id);
        next = addLog(next, `Completed lesson: ${lesson ? lesson.title : id}`);
      }
      return next;
    });
  }, []);

  const addScamCheck = useCallback((riskLabel) => {
    setP((s) => {
      const key = todayKey();
      const next = { ...s, scams: s.scams + 1, activity: { ...s.activity, [key]: (s.activity[key] || 0) + 1 } };
      return addLog(next, `Checked a message with Scam Shield (${riskLabel})`);
    });
  }, []);

  const reset = useCallback(() => setP({ completed: {}, scams: 0, activity: {}, log: [] }), []);

  const derived = useMemo(() => {
    const completedCount = Object.keys(p.completed).length;
    const totalMinutes = Object.values(p.activity).reduce((a, b) => a + b, 0);

    let streak = 0;
    const d = new Date();
    if (!p.activity[todayKey(d)]) d.setDate(d.getDate() - 1);
    while (p.activity[todayKey(d)]) {
      streak += 1;
      d.setDate(d.getDate() - 1);
    }

    const week = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      week.push({
        day: day.toLocaleDateString("en-IN", { weekday: "short" }),
        minutes: p.activity[todayKey(day)] || 0,
      });
    }

    const cats = {};
    LESSONS.forEach((l) => {
      cats[l.category] = cats[l.category] || { total: 0, done: 0 };
      cats[l.category].total += 1;
      if (p.completed[l.id]) cats[l.category].done += 1;
    });
    const skills = Object.entries(cats).map(([name, v]) => ({ name, ...v, pct: Math.round((v.done / v.total) * 100) }));

    const badges = [
      { id: "first", icon: "🌱", name: "First Step", hint: "Finish 1 lesson", earned: completedCount >= 1 },
      { id: "safe", icon: "🛡️", name: "Safe Surfer", hint: "Check 3 messages", earned: p.scams >= 3 },
      { id: "streak", icon: "🔥", name: "On a Roll", hint: "3-day streak", earned: streak >= 3 },
      { id: "grad", icon: "🎓", name: "Digital Graduate", hint: "Finish every lesson", earned: completedCount === LESSONS.length },
    ];

    return {
      completedCount,
      totalLessons: LESSONS.length,
      pct: Math.round((completedCount / LESSONS.length) * 100),
      totalMinutes, streak, week, skills, badges,
    };
  }, [p]);

  const value = useMemo(
    () => ({ ...p, ...derived, completeLesson, addScamCheck, reset }),
    [p, derived, completeLesson, addScamCheck, reset]
  );
  return <ProgressCtx.Provider value={value}>{children}</ProgressCtx.Provider>;
}
export const useProgress = () => useContext(ProgressCtx);