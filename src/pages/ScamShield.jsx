import { useState } from "react";
import { useSettings, useProgress } from "../context.jsx";
import { t } from "../i18n.js";

const RULES = [
  { re: /\b(otp|pin|cvv|password)\b/i, pts: 30, why: "Asks for an OTP, PIN or password. Real banks never ask for these." },
  { re: /urgent|immediately|within \d+ ?(hours?|minutes?|mins?)|last chance|expire|blocked|suspended/i, pts: 20, why: "Creates panic or urgency so you act without thinking." },
  { re: /\bkyc\b|update.{0,20}(pan|aadhaar|aadhar|account)/i, pts: 25, why: "Fake KYC update requests are a very common trick." },
  { re: /lottery|you have won|you won|prize|cashback|free gift|reward/i, pts: 25, why: "Promises a prize or reward you never applied for." },
  { re: /bit\.ly|tinyurl|t\.co\/|goo\.gl|cutt\.ly|shorturl|rb\.gy/i, pts: 25, why: "Shortened link hides the real website." },
  { re: /http:\/\//i, pts: 15, why: "Link is not secure (starts with http, not https)." },
  { re: /\.apk\b|install.{0,25}app|anydesk|teamviewer|quicksupport|screen ?share/i, pts: 30, why: "Asks you to install an app or share your screen. Scammers use this to take control." },
  { re: /(send|pay|transfer|deposit).{0,30}(₹|rs\.?|inr|\d{3,})/i, pts: 15, why: "Asks you to send money." },
];

const SAMPLES = [
  "URGENT: Your SBI account will be blocked within 2 hours. Update KYC now http://bit.ly/sbi-kyc-update",
  "Congratulations! You won a prize of Rs 25,00,000. Share your OTP to claim.",
  "Your Swiggy order #4521 will arrive in 20 minutes.",
];

export function analyze(text) {
  const hits = RULES.filter((r) => r.re.test(text));
  const score = Math.min(100, hits.reduce((a, r) => a + r.pts, 0));
  const level = score >= 50 ? "high" : score >= 25 ? "medium" : "low";
  return { score, level, reasons: hits.map((h) => h.why) };
}

const ADVICE = {
  high: "Do not click, reply or share anything. Delete the message. If you already shared details or lost money, call 1930 and tell your bank at once.",
  medium: "Pause. Do not click links. Contact the company using the number printed on your card or on its official website to confirm.",
  low: "No common scam signs found, but stay alert. Never share OTP or PIN with anyone.",
};

export default function ScamShield() {
  const { lang } = useSettings();
  const { addScamCheck } = useProgress();
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const run = () => {
    if (!text.trim()) return;
    const r = analyze(text);
    setResult(r);
    addScamCheck(r.level);
  };

  return (
    <div className="page narrow">
      <h1>🛡️ {t(lang, "nav_scam")}</h1>
      <textarea
        className="scam-input"
        rows={5}
        value={text}
        onChange={(e) => { setText(e.target.value); setResult(null); }}
        placeholder={t(lang, "paste_here")}
      />
      <div className="chips">
        {SAMPLES.map((s, k) => (
          <button key={k} className="chip" onClick={() => { setText(s); setResult(null); }}>Try sample {k + 1}</button>
        ))}
      </div>
      <button className="btn primary" onClick={run}>{t(lang, "check")}</button>

      {result && (
        <section className={"card result " + result.level}>
          <div className="row between">
            <h2>{t(lang, "risk_" + result.level)}</h2>
            <strong className="score">{result.score}/100</strong>
          </div>
          <div className="meter"><div style={{ width: result.score + "%" }} /></div>
          {result.reasons.length > 0 && (
            <ul>
              {result.reasons.map((r, k) => <li key={k}>{r}</li>)}
            </ul>
          )}
          <p className="advice">{ADVICE[result.level]}</p>
        </section>
      )}
    </div>
  );
}