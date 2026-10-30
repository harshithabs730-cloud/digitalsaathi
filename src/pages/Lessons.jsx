import { Link } from "react-router-dom";
import { useSettings, useProgress } from "../context.jsx";
import { t } from "../i18n.js";
import { LESSONS } from "../data/lessons.js";

export default function Lessons() {
  const { lang } = useSettings();
  const { completed } = useProgress();
  return (
    <div className="page">
      <h1>{t(lang, "nav_lessons")}</h1>
      <div className="grid-2">
        {LESSONS.map((l) => (
          <Link key={l.id} to={`/lessons/${l.id}`} className="card lesson">
            <div className="lesson-icon">{l.icon}</div>
            <div className="lesson-body">
              <span className="tag">{l.category}</span>
              <h3>{l.title}</h3>
              <p>{l.summary}</p>
              <small>{l.steps.length} steps · {l.minutes} min</small>
            </div>
            {completed[l.id] && <span className="done-badge" title="Completed">✓</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}