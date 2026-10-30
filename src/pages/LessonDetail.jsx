import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSettings, useProgress } from "../context.jsx";
import { t } from "../i18n.js";
import { LESSONS } from "../data/lessons.js";
import { speak, stopSpeaking } from "../speech.js";

export default function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useSettings();
  const { completeLesson } = useProgress();
  const lesson = LESSONS.find((l) => l.id === id);
  const [i, setI] = useState(0);

  useEffect(() => {
    setI(0);
    return stopSpeaking;
  }, [id]);

  if (!lesson) {
    return (
      <div className="page">
        <p>Lesson not found.</p>
        <Link to="/lessons" className="btn ghost">← {t(lang, "nav_lessons")}</Link>
      </div>
    );
  }

  const step = lesson.steps[i];
  const last = i === lesson.steps.length - 1;
  const finish = () => {
    completeLesson(lesson.id, lesson.minutes);
    navigate("/dashboard");
  };

  return (
    <div className="page narrow">
      <Link to="/lessons" className="back">← {t(lang, "nav_lessons")}</Link>
      <p className="eyebrow">{lesson.icon} {lesson.title}</p>
      <div className="dots">
        {lesson.steps.map((_, k) => (
          <span key={k} className={"dot" + (k <= i ? " on" : "")} />
        ))}
      </div>
      <article className="card step">
        <small>{t(lang, "step_of")} {i + 1} / {lesson.steps.length}</small>
        <h2>{step.title}</h2>
        <p className="step-text">{step.text}</p>
        <button className="btn ghost" onClick={() => speak(`${step.title}. ${step.text}`, lang)}>🔊 {t(lang, "listen")}</button>
      </article>
      <div className="row between">
        <button className="btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>← {t(lang, "back")}</button>
        {last ? (
          <button className="btn primary" onClick={finish}>✓ {t(lang, "finish")}</button>
        ) : (
          <button className="btn primary" onClick={() => setI(i + 1)}>{t(lang, "next")} →</button>
        )}
      </div>
    </div>
  );
}