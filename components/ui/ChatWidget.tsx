"use client";

/**
 * ENCOMM AI Assistant — website chat widget.
 * Renders ONLY when NEXT_PUBLIC_CHAT_URL is set (build-time env), so a deploy
 * without the relay URL configured stays exactly as before — no broken UI.
 * Talks to the ENCOMM WebChat relay (Hermes agent on encomm-webchat profile).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import styles from "./ChatWidget.module.css";

const RELAY_URL = (process.env.NEXT_PUBLIC_CHAT_URL || "").replace(/\/$/, "");
const SID_KEY = ["enc", "comm", "widget", "sid"].join("-");
const POLL_MS = 2500;

type Msg = { role: "user" | "assistant"; text: string; local?: boolean };

const STR = {
  en: {
    title: "ENCOMM AI",
    subtitle: "Ask us anything",
    open: "Open the ENCOMM AI assistant",
    close: "Close the assistant",
    greeting:
      "Hello! I'm ENCOMM's AI assistant. Ask me about our services, products, or how we can help your business.",
    placeholder: "Write your question…",
    send: "Send",
    thinking: "Thinking",
    offline:
      "The assistant is temporarily unavailable. Please email us at info@encomm.ai.",
    busy: "I'm still working on your previous message — one moment.",
    rate: "Too many messages — please wait a moment and try again.",
    error: "Something went wrong. Please try again, or email info@encomm.ai.",
    poweredBy: "Powered by ENCOMM",
  },
  el: {
    title: "ENCOMM AI",
    subtitle: "Ρωτήστε μας οτιδήποτε",
    open: "Άνοιγμα του AI βοηθού ENCOMM",
    close: "Κλείσιμο του βοηθού",
    greeting:
      "Γεια σας! Είμαι ο AI βοηθός της ENCOMM. Ρωτήστε με για τις υπηρεσίες και τα προϊόντα μας, ή πώς μπορούμε να βοηθήσουμε την επιχείρησή σας.",
    placeholder: "Γράψτε την ερώτησή σας…",
    send: "Αποστολή",
    thinking: "Σκέφτεται",
    offline:
      "Ο βοηθός δεν είναι διαθέσιμος αυτή τη στιγμή. Στείλτε μας email στο info@encomm.ai.",
    busy: "Επεξεργάζομαι ακόμα το προηγούμενο μήνυμά σας — μια στιγμή.",
    rate: "Πάρα πολλά μηνύματα — περιμένετε λίγο και δοκιμάστε ξανά.",
    error: "Κάτι πήγε στραβά. Δοκιμάστε ξανά ή στείλτε email στο info@encomm.ai.",
    poweredBy: "Powered by ENCOMM",
  },
} as const;

function getSessionId(): string {
  try {
    let sid = window.localStorage.getItem(SID_KEY);
    if (!sid || !/^[A-Za-z0-9_-]{6,64}$/.test(sid)) {
      const rnd =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID().replace(/-/g, "")
          : Math.random().toString(36).slice(2) + Date.now().toString(36);
      sid = `w-${rnd}`.slice(0, 64);
      window.localStorage.setItem(SID_KEY, sid);
    }
    return sid;
  } catch {
    return `w-${Date.now().toString(36)}`;
  }
}

export function ChatWidget() {
  const { language } = useLanguage();
  const t = STR[language] ?? STR.en;

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [online, setOnline] = useState(true);
  const [unseen, setUnseen] = useState(false);

  const sidRef = useRef<string>("");
  const afterRef = useRef(0); // server-side message count already seen
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    sidRef.current = getSessionId();
    setMounted(true);
    setMsgs([{ role: "assistant", text: t.greeting, local: true }]);
    // health probe
    fetch(`${RELAY_URL}/healthz`, { method: "GET" })
      .then((r) => setOnline(r.ok))
      .catch(() => setOnline(false));
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, []);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    });
  }, []);

  const poll = useCallback(async () => {
    try {
      const r = await fetch(
        `${RELAY_URL}/api/chat?session_id=${encodeURIComponent(sidRef.current)}&after=${afterRef.current}`,
      );
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      setOnline(true);
      if (Array.isArray(j.messages) && j.messages.length > 0) {
        const fresh: Msg[] = j.messages
          .filter((m: Msg) => m.role === "assistant")
          .map((m: Msg) => ({ role: "assistant", text: m.text }));
        afterRef.current = j.total;
        if (fresh.length) {
          setMsgs((prev) => [...prev, ...fresh]);
          setPending(false);
          setUnseen((u) => u); // keep badge state; cleared on open
          scrollToBottom();
        }
      } else if (typeof j.total === "number") {
        afterRef.current = Math.max(afterRef.current, j.total);
      }
      if (j.pending === 0 && j.messages?.length === 0 && pending) {
        // server finished without new assistant message (edge case) — stop spinner
        setPending(false);
      }
      if (j.pending > 0) schedulePoll();
      else if (pending) schedulePoll(); // local state may lag one tick
    } catch {
      setOnline(false);
      setPending(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, scrollToBottom]);

  const schedulePoll = useCallback(() => {
    if (pollRef.current) clearTimeout(pollRef.current);
    pollRef.current = setTimeout(poll, POLL_MS);
  }, [poll]);

  useEffect(() => () => { if (pollRef.current) clearTimeout(pollRef.current); }, []);

  useEffect(() => { scrollToBottom(); }, [msgs, scrollToBottom]);

  useEffect(() => {
    if (open) {
      setUnseen(false);
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || pending || !online) return;
    setInput("");
    setMsgs((prev) => [...prev, { role: "user", text }]);
    setPending(true);
    try {
      const r = await fetch(`${RELAY_URL}/api/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ session_id: sidRef.current, message: text }),
      });
      if (r.status === 409) {
        setMsgs((p) => [...p, { role: "assistant", text: t.busy, local: true }]);
        setPending(false);
        return;
      }
      if (r.status === 429) {
        setMsgs((p) => [...p, { role: "assistant", text: t.rate, local: true }]);
        setPending(false);
        return;
      }
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setOnline(true);
      schedulePoll();
    } catch {
      setOnline(false);
      setPending(false);
      setMsgs((p) => [...p, { role: "assistant", text: t.error, local: true }]);
    }
  }, [input, pending, online, schedulePoll, t]);

  if (!RELAY_URL || !mounted) return null;

  return (
    <>
      {/* floating toggle */}
      <button
        type="button"
        className={`${styles.fab} ${open ? styles.fabOpen : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? t.close : t.open}
        aria-expanded={open}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 3a8 8 0 0 1 8 8v2.4a3.6 3.6 0 0 1-3.6 3.6H15a1 1 0 0 1-1-1v-3.2a1 1 0 0 1 1-1h2.3V11a5.3 5.3 0 0 0-10.6 0v.8H9a1 1 0 0 1 1 1V16a1 1 0 0 1-1 1H8.6A4.6 4.6 0 0 1 4 12.4V11a8 8 0 0 1 8-8Z"
              stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
            />
            <circle cx="20.5" cy="3.5" r="3" fill="var(--violet, #7958ff)" />
          </svg>
        )}
      </button>

      {/* panel */}
      <div
        className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
        role="dialog"
        aria-label={t.title}
        aria-hidden={!open}
      >
        <div className={styles.header}>
          <div>
            <div className={styles.title}>
              {t.title}
              <span className={`${styles.dot} ${online ? styles.dotOn : styles.dotOff}`} />
            </div>
            <div className={styles.subtitle}>{online ? t.subtitle : t.offline}</div>
          </div>
          <button
            type="button"
            className={styles.headerClose}
            onClick={() => setOpen(false)}
            aria-label={t.close}
          >
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={styles.messages} ref={listRef}>
          {msgs.map((m, i) => (
            <div key={i} className={`${styles.msg} ${m.role === "user" ? styles.msgUser : styles.msgBot}`}>
              {m.text}
            </div>
          ))}
          {pending && (
            <div className={`${styles.msg} ${styles.msgBot}`}>
              <span className={styles.thinking}>
                {t.thinking}
                <span className={styles.dots}>
                  <i>.</i><i>.</i><i>.</i>
                </span>
              </span>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.inputRow}>
            <input
              ref={inputRef}
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={online ? t.placeholder : t.offline}
              maxLength={1500}
              disabled={!online || pending}
              aria-label={t.placeholder}
            />
            <button
              type="button"
              className={styles.send}
              onClick={send}
              disabled={!online || pending || !input.trim()}
              aria-label={t.send}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className={styles.poweredBy}>{t.poweredBy}</div>
        </div>
      </div>

      {unseen && !open && <span className={styles.badge} aria-hidden />}
    </>
  );
}
