"use client";

import { useCallback, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion, useIsomorphicLayoutEffect } from "@/lib/motion-safe";

gsap.registerPlugin(ScrollTrigger);

const QUESTION =
  "What's our refund policy for software purchased after March?";
const ANSWER =
  "Customers can request a refund within 30 days of purchase for software bought after March 1st. Licenses used commercially are eligible at 50%.";
const SOURCES = [
  { label: "Refund Policy.pdf", type: "PDF", chip: "PDF" },
  { label: "support.encomm.ai/legal", type: "Web", chip: "Web" },
  { label: "billing API · /orders", type: "API", chip: "API" },
];

const CONNECTIONS = [
  { label: "PDFs", color: "violet" },
  { label: "Word", color: "violet" },
  { label: "Website", color: "cyan" },
  { label: "API", color: "magenta" },
  { label: "Database", color: "cyan" },
];

/**
 * AssistantDemo — a custom-built conversational AI UI demonstration.
 * Not a screenshot from another product. Animates in when scrolled into view.
 */
export function AssistantDemo() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const playedRef = useRef(false);

  const playSequence = useCallback(async () => {
    setTyped("");
    setShowAnswer(false);
    setShowSources(false);
    for (let i = 0; i <= QUESTION.length; i++) {
      setTyped(QUESTION.slice(0, i));
      // Sequential typing animation; await-in-loop is intentional here.
      await new Promise((r) => setTimeout(r, 18));
    }
    await new Promise((r) => setTimeout(r, 350));
    setShowAnswer(true);
    await new Promise((r) => setTimeout(r, 700));
    setShowSources(true);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (reduced) {
      setTyped(QUESTION);
      setShowAnswer(true);
      setShowSources(true);
      return;
    }
    const el = root.current;
    if (!el) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 70%",
      once: true,
      onEnter: () => {
        if (playedRef.current) return;
        playedRef.current = true;
        void playSequence();
      },
    });
    return () => st.kill();
  }, [reduced, playSequence]);

  return (
    <div ref={root} className="group relative">
      {/* outer shell */}
      <div className="relative overflow-hidden rounded-[28px] border border-line bg-surface p-2 shadow-lift transition-transform duration-500 group-hover:-translate-y-1">
        {/* window chrome */}
        <div className="flex items-center justify-between rounded-[22px] bg-surface-soft px-5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-violet to-violet-deep text-[12px] font-semibold text-white">
              E
            </div>
            <div className="leading-tight">
              <div className="text-[13px] font-medium text-ink">
                ENCOMM Assistant
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-faint">
                <span className="status-dot !h-1.5 !w-1.5" />
                Grounded · live demo
              </div>
            </div>
          </div>
          <span className="chip">v1.0 · demo</span>
        </div>

        {/* conversation area */}
        <div className="space-y-4 p-5 pt-6">
          {/* question bubble */}
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-ink px-4 py-3 text-[14px] leading-relaxed text-white">
              {typed}
              {!typed && <span className="opacity-50">…</span>}
              {typed.length < QUESTION.length && (
                <span className="ml-0.5 inline-block h-3.5 w-px animate-pulse bg-white align-middle" />
              )}
            </div>
          </div>

          {/* answer */}
          {showAnswer ? (
            <div className="flex gap-3">
              <div className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-lilac to-violet text-[12px] font-semibold text-ink">
                E
              </div>
              <div className="flex-1 rounded-2xl rounded-tl-md border border-line bg-surface-soft px-4 py-3">
                <div className="mb-2 flex items-center gap-2">
                  <span className="status-dot" />
                  <span className="text-[11px] font-medium uppercase tracking-wider text-violet-deep">
                    Grounded response
                  </span>
                </div>
                <p className="text-[14px] leading-relaxed text-ink-soft">
                  {ANSWER}
                </p>

                {showSources ? (
                  <div className="mt-4 border-t border-line pt-3">
                    <div className="mb-2 text-[11px] uppercase tracking-wider text-faint">
                      Source references
                    </div>
                    <ul className="space-y-1.5">
                      {SOURCES.map((s) => (
                        <li
                          key={s.label}
                          className="flex items-center gap-2 text-[12.5px] text-ink-soft"
                        >
                          <span className="grid h-5 min-w-[42px] place-items-center rounded bg-surface px-1.5 font-mono text-[9px] uppercase text-violet-deep ring-1 ring-line">
                            {s.chip}
                          </span>
                          <span className="truncate">{s.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="mt-4 flex items-center gap-2 text-[12px] text-faint">
                    <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-violet" />
                    Reviewing sources…
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <div className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-lilac to-violet text-[12px] font-semibold text-ink">
                E
              </div>
              <div className="rounded-2xl rounded-tl-md border border-line bg-surface-soft px-4 py-3">
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-violet"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* connection chips footer */}
        <div className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-4">
          <span className="text-[11px] uppercase tracking-wider text-faint">
            Connected
          </span>
          {CONNECTIONS.map((c) => (
            <span
              key={c.label}
              className="chip"
              style={{
                borderColor:
                  c.color === "violet"
                    ? "rgba(114,92,255,0.3)"
                    : c.color === "cyan"
                      ? "rgba(102,215,245,0.4)"
                      : "rgba(231,168,245,0.4)",
              }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{
                  background:
                    c.color === "violet"
                      ? "#725CFF"
                      : c.color === "cyan"
                        ? "#66D7F5"
                        : "#E7A8F5",
                }}
              />
              {c.label}
            </span>
          ))}
        </div>
      </div>

      {/* decorative data line */}
      <div
        aria-hidden="true"
        className="absolute -left-3 top-1/2 hidden h-px w-12 data-line md:block"
      />
    </div>
  );
}
