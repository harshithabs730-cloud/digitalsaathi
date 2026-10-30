import { Link } from "react-router-dom";
import { useSettings, useProgress } from "../context.jsx";
import { t } from "../i18n.js";
import { LESSONS } from "../data/lessons.js";

export default function Home() {
  const { lang } = useSettings();
  const { completed, completedCount, totalLessons, pct } = useProgress();
  const next = LESSONS.find((l) => !completed[l.id]) || LESSONS[0];

  return (
    <div className="page">
      <section className="hero">
        <p className="eyebrow">DigitalSaathi</p>
        <h1>{t(lang, "hero_title")}</h1>
        <p className="lead">{t(lang, "hero_sub")}</p>
        <div className="hero-actions">
          <Link className="btn primary" to={`/lessons/${next.id}`}>{t(lang, "start")} →</Link>
          <Link className="btn ghost" to="/chat">💬 {t(lang, "ask")}</Link>
        </div>
      </section>

      <section className="grid-3">
        <Link to="/lessons" className="card feature">
          <span className="feature-icon">📚</span>
          <h3>{t(lang, "nav_lessons")}</h3>
          <p>{completedCount} / {totalLessons}</p>
          <div className="bar"><div style={{ width: pct + "%" }} /></div>
        </Link>
        <Link to="/scam" className="card feature">
          <span className="feature-icon">🛡️</span>
          <h3>{t(lang, "nav_scam")}</h3>
          <p>OTP, links, fake calls</p>
        </Link>
        <Link to="/dashboard" className="card feature">
          <span className="feature-icon">📊</span>
          <h3>{t(lang, "nav_dashboard")}</h3>
          <p>{pct}% {t(lang, "overall").toLowerCase()}</p>
        </Link>
      </section>
    </div>
  );
}