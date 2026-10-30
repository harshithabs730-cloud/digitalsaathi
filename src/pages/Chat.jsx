import { useEffect, useRef, useState } from "react";
import { useSettings } from "../context.jsx";
import { t } from "../i18n.js";
import { speak, createRecognizer } from "../speech.js";

// Keyword answers so the demo works offline.
// Later: replace getReply() with a fetch() to your backend + LLM.
const KNOWLEDGE = [
  { keys: ["otp", "pin", "cvv"], reply: "Never share your OTP, UPI PIN or CVV with anyone, not even someone saying they are from your bank. Banks never ask for these on a call or message." },
  { keys: ["upi", "pay", "payment", "qr", "gpay", "phonepe", "paytm"], reply: "To pay with UPI: open your payment app, tap Scan, scan the shop's QR code, type the amount and enter your UPI PIN. You only enter the PIN when you SEND money, never to receive it." },
  { keys: ["whatsapp", "message", "voice note"], reply: "In WhatsApp, open a chat, type in the box and press the green arrow. To send a voice note, press and hold the microphone, speak, then let go." },
  { keys: ["scam", "fraud", "fake", "cheat", "cheated", "link"], reply: "Stop and do not click or reply. Check it in the Scam Shield page. If you lost money, call the cyber crime helpline 1930 right away and report at cybercrime.gov.in." },
  { keys: ["wifi", "wi-fi", "internet", "data"], reply: "To connect to Wi-Fi: swipe down from the top, press and hold the Wi-Fi icon, choose your network and type the password." },
  { keys: ["call", "video", "contact"], reply: "To call, open the green Phone app, type the number and press the green button. For a video call, open the contact and tap the video camera icon." },
  { keys: ["password"], reply: "Use a password that is long and not your name or birth year. Do not use the same password everywhere and never tell it to anyone." },
  { keys: ["hello", "hi", "namaste", "hey"], reply: "Namaste! How can I help you today?" },
];

function getReply(text) {
  const q = text.toLowerCase();
  const hit = KNOWLEDGE.find((k) => k.keys.some((w) => q.includes(w)));
  return hit ? hit.reply : "I am still learning that one. Try asking about UPI, WhatsApp, OTP, calls, Wi-Fi or scams, or open a lesson from the Lessons page.";
}

export default function Chat() {
  const { lang } = useSettings();
  const [msgs, setMsgs] = useState([{ from: "saathi", text: t(lang, "welcome_chat") }]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const endRef = useRef(null);
  const recRef = useRef(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs]);

  const send = (text) => {
    const q = text.trim();
    if (!q) return;
    setMsgs((m) => [...m, { from: "me", text: q }]);
    setInput("");
    setTimeout(() => {
      const reply = getReply(q);
      setMsgs((m) => [...m, { from: "saathi", text: reply }]);
      if (voiceOn) speak(reply, lang);
    }, 450);
  };

  const mic = () => {
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const rec = createRecognizer(lang, (txt) => send(txt), () => setListening(false));
    if (!rec) {
      alert("Voice input needs Chrome or Edge.");
      return;
    }
    recRef.current = rec;
    setListening(true);
    rec.start();
  };

  const chips = ["How to pay with UPI?", "What is OTP?", "Is this link a scam?", "Send WhatsApp voice note"];

  return (
    <div className="page chat">
      <div className="row between">
        <h1>{t(lang, "nav_chat")}</h1>
        <label className="switch">
          <input type="checkbox" checked={voiceOn} onChange={(e) => setVoiceOn(e.target.checked)} /> 🔊
        </label>
      </div>
      <div className="chat-box" role="log" aria-live="polite">
        {msgs.map((m, k) => (
          <div key={k} className={"bubble " + m.from}>{m.text}</div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="chips">
        {chips.map((c) => (
          <button key={c} className="chip" onClick={() => send(c)}>{c}</button>
        ))}
      </div>
      <form className="composer" onSubmit={(e) => { e.preventDefault(); send(input); }}>
        <button type="button" className={"mic" + (listening ? " live" : "")} onClick={mic} aria-label={t(lang, "speak")}>🎤</button>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={listening ? t(lang, "listening") : t(lang, "type_msg")} />
        <button className="btn primary" type="submit">{t(lang, "send")}</button>
      </form>
    </div>
  );
}