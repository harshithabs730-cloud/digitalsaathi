import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import { useSettings, useProgress } from "../context.jsx";
import { t } from "../i18n.js";

const timeAgo = (iso) => {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return mins + " min ago";
  if (mins < 1440) return Math.round(mins / 60) + " h ago";
  return Math.round(mins / 1440) + " d ago";
};

export default function Dashboard() {
  const { lang } = useSettings();
  const p = useProgress();

  const stats = [
    { icon: "📚", label: t(lang, "lessons_done"), value: `${p.completedCount}/${p.totalLessons}` },
    { icon: "🔥", label: t(lang, "streak"), value: p.streak },
    { icon: "🛡️", label: t(lang, "scams_checked"), value: p.scams },
    { icon: "⏱️", label: t(lang, "minutes"), value: p.totalMinutes },
  ];
  const donut = [
    { name: "Done", value: p.pct },
    { name: "Left", value: 100 - p.pct },
  ];

  return (
    <div className="page">
      <div className="row between">
        <h1>{t(lang, "nav_dashboard")}</h1>
        <button className="btn ghost small" onClick={() => window.confirm("Clear all progress?") && p.reset()}>{t(lang, "reset")}</button>
      </div>

      <section className="grid-4">
        {stats.map((s) => (
          <div key={s.label} className="card stat">
            <span className="stat-icon">{s.icon}</span>
            <strong>{s.value}</strong>
            <small>{s.label}</small>
          </div>
        ))}
      </section>

      <section className="grid-chart">
        <div className="card">
          <h3>{t(lang, "weekly")}</h3>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={p.week} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e6f3" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "#eef1fa" }} formatter={(v) => [v + " min", "Learning"]} />
                <Bar dataKey="minutes" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card donut">
          <h3>{t(lang, "overall")}</h3>
          <div className="chart-box small">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donut} dataKey="value" innerRadius="68%" outerRadius="90%" startAngle={90} endAngle={-270} stroke="none">
                  <Cell fill="#ffb020" />
                  <Cell fill="#e2e6f3" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-label">{p.pct}%</div>
          </div>
        </div>
      </section>

      <section className="grid-2">
        <div className="card">
          <h3>{t(lang, "skills")}</h3>
          {p.skills.map((s) => (
            <div key={s.name} className="skill">
              <div className="row between"><span>{s.name}</span><small>{s.done}/{s.total}</small></div>
              <div className="bar"><div style={{ width: s.pct + "%" }} /></div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>{t(lang, "badges")}</h3>
          <div className="badges">
            {p.badges.map((b) => (
              <div key={b.id} className={"badge" + (b.earned ? " earned" : "")} title={b.hint}>
                <span>{b.icon}</span>
                <strong>{b.name}</strong>
                <small>{b.earned ? "Earned" : b.hint}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card">
        <h3>{t(lang, "recent")}</h3>
        {p.log.length === 0 ? (
          <p className="muted">Nothing yet. Finish a lesson or check a message to see it here.</p>
        ) : (
          <ul className="log">
            {p.log.map((l, k) => (
              <li key={k}><span>{l.text}</span><small>{timeAgo(l.time)}</small></li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}