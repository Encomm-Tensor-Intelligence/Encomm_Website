"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useReducedMotion,
  useIsomorphicLayoutEffect,
} from "@/lib/motion/use-scroll-state";

gsap.registerPlugin(ScrollTrigger);

const QUESTION = "What's our refund policy for software purchased after March?";
const ANSWER =
  "Customers can request a refund within 30 days of purchase for software bought after March 1st. Commercial licenses are eligible at 50%.";
const SOURCES = [
  { label: "Refund Policy.pdf", type: "PDF", x: 8, y: 18, active: true },
  { label: "Terms · §4.2", type: "DOC", x: 78, y: 12, active: true },
  { label: "billing · /orders", type: "API", x: 70, y: 62, active: true },
  { label: "support.encomm.ai", type: "WEB", x: 14, y: 70, active: false },
  { label: "customers.db", type: "DB", x: 44, y: 8, active: true },
];

/**
 * AssistantSpace — floating document fragments in space, a question travels
 * the network, sources illuminate, an answer converges. Not a chat card.
 */
export function AssistantSpace() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [litSources, setLitSources] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string | null>(null);
  const played = useRef(false);

  const play = async () => {
    setTyped("");
    setShowAnswer(false);
    setLitSources(new Set());
    // light sources sequentially
    for (const s of SOURCES) {
      if (s.active) {
        await new Promise((r) => setTimeout(r, 160));
        setLitSources((prev) => new Set(prev).add(s.label));
      }
    }
    await new Promise((r) => setTimeout(r, 250));
    for (let i = 0; i <= QUESTION.length; i++) {
      setTyped(QUESTION.slice(0, i));
      await new Promise((r) => setTimeout(r, 22));
    }
    await new Promise((r) => setTimeout(r, 350));
    setShowAnswer(true);
  };

  useIsomorphicLayoutEffect(() => {
    if (reduced) {
      setTyped(QUESTION);
      setShowAnswer(true);
      setLitSources(new Set(SOURCES.filter((s) => s.active).map((s) => s.label)));
      return;
    }
    const el = root.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 65%",
      once: true,
      onEnter: () => {
        if (played.current) return;
        played.current = true;
        void play();
      },
    });
    return () => st.kill();
  }, [reduced]);

  // parallax on cursor inside the space
  useEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--px", String(x));
      el.style.setProperty("--py", String(y));
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [reduced]);

  const visibleSources = filter
    ? SOURCES.filter((s) => s.type === filter)
    : SOURCES;

  return (
    <div
      ref={root}
      data-cursor="EXPLORE"
      className="group relative aspect-[5/4] w-full overflow-hidden rounded-[28px] border border-line glass"
      style={
        {
          "--px": "0",
          "--py": "0",
        } as React.CSSProperties
      }
    >
      <div className="grid-bg-fine pointer-events-none absolute inset-0 opacity-40" />

      {/* floating source nodes */}
      {visibleSources.map((s) => {
        const lit = litSources.has(s.label);
        const depth = 1 + (s.x + s.y) / 200;
        return (
          <button
            key={s.label}
            type="button"
            onClick={() => setFilter(filter === s.type ? null : s.type)}
            data-cursor={lit ? "OPEN" : undefined}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              transform: `translate(-50%, -50%) translate3d(calc(var(--px) * ${depth * 18}px), calc(var(--py) * ${depth * 18}px), 0)`,
              zIndex: lit ? 5 : 2,
            }}
            aria-label={`${s.type} source: ${s.label}`}
          >
            <div
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] backdrop-blur transition-all duration-500 ${
                lit
                  ? "border-violet/40 bg-white shadow-[0_0_30px_-4px_rgba(106,77,255,0.5)]"
                  : "border-line bg-white/60 opacity-50"
              }`}
            >
              <span
                className="grid h-5 min-w-[36px] place-items-center rounded font-mono text-[8px] uppercase"
                style={{
                  background:
                    s.type === "PDF"
                      ? "rgba(106,77,255,0.12)"
                      : s.type === "API"
                        ? "rgba(229,139,240,0.12)"
                        : s.type === "WEB"
                          ? "rgba(79,212,245,0.12)"
                          : s.type === "DB"
                            ? "rgba(183,155,255,0.14)"
                            : "rgba(11,15,36,0.08)",
                  color:
                    s.type === "PDF"
                      ? "#6a4dff"
                      : s.type === "API"
                        ? "#e58bf0"
                        : s.type === "WEB"
                          ? "#0f9bc0"
                          : "#4d36e0",
                }}
              >
                {s.type}
              </span>
              <span className="font-mono text-ink-soft">{s.label}</span>
            </div>
          </button>
        );
      })}

      {/* connection paths from lit sources to the answer core */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {SOURCES.filter((s) => litSources.has(s.label)).map((s) => (
          <line
            key={s.label}
            x1={`${s.x}%`}
            y1={`${s.y}%`}
            x2="50%"
            y2="50%"
            stroke="rgba(106,77,255,0.4)"
            strokeWidth={1}
            strokeDasharray="3 3"
            className="path-draw"
            style={{
              strokeDashoffset: 0,
              animation: "dashFlow 8s linear infinite",
            }}
          />
        ))}
      </svg>

      {/* center core — question / answer */}
      <div className="absolute left-1/2 top-1/2 w-[62%] max-w-[340px] -translate-x-1/2 -translate-y-1/2">
        <div className="relative rounded-2xl border border-line bg-white/90 p-4 shadow-lift backdrop-blur">
          {/* grounded status */}
          <div className="mb-2 flex items-center justify-between">
            <span className="eyebrow flex items-center gap-1.5">
              <span className={`status-dot ${showAnswer ? "" : "animate-pulse"}`} />
              {showAnswer ? "Grounded response" : "Retrieving…"}
            </span>
            <span className="font-mono text-[9px] text-faint">AI · v1.0</span>
          </div>

          {/* question */}
          <div className="mb-2 rounded-lg bg-ink px-3 py-2 text-[12px] text-white">
            {typed || <span className="opacity-50">…</span>}
            {typed.length < QUESTION.length && typed.length > 0 ? (
              <span className="ml-0.5 inline-block h-3 w-px animate-pulse bg-white align-middle" />
            ) : null}
          </div>

          {/* answer */}
          {showAnswer ? (
            <p className="text-[12.5px] leading-relaxed text-ink-soft">
              {ANSWER}
            </p>
          ) : (
            <div className="flex items-center gap-1.5 py-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-violet"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* filter chips */}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
        {["PDF", "API", "WEB", "DB"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilter(filter === t ? null : t)}
            className={`rounded-full border px-2 py-1 font-mono text-[9px] transition-all ${
              filter === t
                ? "border-violet bg-violet/10 text-violet"
                : "border-line bg-white/70 text-faint hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <style>{`@keyframes dashFlow { to { stroke-dashoffset: -100; } }`}</style>
    </div>
  );
}
