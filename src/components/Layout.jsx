import { NavLink, Outlet } from "react-router-dom";
import { useSettings } from "../context.jsx";
import { t, LANGS } from "../i18n.js";

const NAV = [
  ["/", "nav_home", "🏠"],
  ["/lessons", "nav_lessons", "📚"],
  ["/chat", "nav_chat", "💬"],
  ["/scam", "nav_scam", "🛡️"],
  ["/dashboard", "nav_dashboard", "📊"],
];

export default function Layout() {
  const { lang, setLang, bigText, toggleBigText } = useSettings();
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">🤝</span>
          <div>
            <strong>{t(lang, "appName")}</strong>
            <small>{t(lang, "tagline")}</small>
          </div>
        </div>
        <nav className="nav">
          {NAV.map(([to, key, icon]) => (
            <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
              <span className="nav-icon" aria-hidden="true">{icon}</span>
              <span>{t(lang, key)}</span>
            </NavLink>
          ))}
        </nav>
        <div className="prefs">
          <label className="pref">
            <span>{t(lang, "language")}</span>
            <select value={lang} onChange={(e) => setLang(e.target.value)}>
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </label>
          <button className={"toggle" + (bigText ? " on" : "")} onClick={toggleBigText} aria-pressed={bigText}>
            <span>Aa</span> {t(lang, "big_text")}
          </button>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}