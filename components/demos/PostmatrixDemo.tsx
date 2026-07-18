"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion, useIsomorphicLayoutEffect } from "@/lib/motion-safe";

gsap.registerPlugin(ScrollTrigger);

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Post = {
  day: number;
  hour: number; // 0..10 row
  title: string;
  channel: "LinkedIn" | "X" | "Instagram";
  state: "scheduled" | "draft" | "published";
  span?: number;
};

const POSTS: Post[] = [
  { day: 0, hour: 1, title: "Product launch teaser", channel: "LinkedIn", state: "scheduled", span: 2 },
  { day: 0, hour: 5, title: "AI myth-busting", channel: "X", state: "draft" },
  { day: 1, hour: 2, title: "Customer story outline", channel: "LinkedIn", state: "scheduled" },
  { day: 2, hour: 0, title: "Weekly digest", channel: "X", state: "published", span: 3 },
  { day: 3, hour: 4, title: "Carousel: enterprise AI", channel: "Instagram", state: "scheduled" },
  { day: 4, hour: 6, title: "Team spotlight", channel: "Instagram", state: "draft" },
  { day: 5, hour: 3, title: "Industry commentary", channel: "LinkedIn", state: "scheduled" },
];

const SUGGESTIONS = [
  "What enterprises get wrong about grounding",
  "3 patterns for agentic workflows",
  "From docs to deployed: a 90-day arc",
];

const CHANNEL_COLORS: Record<Post["channel"], string> = {
  LinkedIn: "#725CFF",
  X: "#66D7F5",
  Instagram: "#E7A8F5",
};

const STATE_LABEL: Record<Post["state"], string> = {
  scheduled: "Scheduled",
  draft: "Draft",
  published: "Live",
};

/**
 * PostmatrixDemo — custom content & scheduling visualization.
 */
export function PostmatrixDemo() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(".pm-post", {
        opacity: 0,
        y: 8,
        duration: 0.5,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 70%", once: true },
      });
      // agent activity pulse
      gsap.fromTo(
        ".pm-agent-bar",
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 1,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: "top 70%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={root} className="group relative">
      <div className="relative overflow-hidden rounded-[28px] border border-line bg-surface p-2 shadow-lift transition-transform duration-500 group-hover:-translate-y-1">
        {/* window chrome */}
        <div className="flex items-center justify-between rounded-[22px] bg-surface-soft px-5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-violet to-magenta text-[12px] font-semibold text-white">
              P
            </div>
            <div className="leading-tight">
              <div className="text-[13px] font-medium text-ink">Postmatrix</div>
              <div className="text-[11px] text-faint">Week · live demo</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="chip">
              <span className="status-dot !h-1.5 !w-1.5" />
              Agent active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[1.6fr_1fr]">
          {/* calendar */}
          <div className="rounded-2xl border border-line bg-surface-soft p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[12px] font-medium text-ink">Schedule</div>
              <div className="flex items-center gap-2 text-[10px] text-faint">
                {(["scheduled", "draft", "published"] as const).map((s) => (
                  <span key={s} className="inline-flex items-center gap-1">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{
                        background:
                          s === "scheduled"
                            ? "#725CFF"
                            : s === "draft"
                              ? "#9AA1B5"
                              : "#66D7F5",
                      }}
                    />
                    {STATE_LABEL[s]}
                  </span>
                ))}
              </div>
            </div>

            {/* day headers */}
            <div
              className="grid gap-1 text-[10px] text-faint"
              style={{ gridTemplateColumns: `28px repeat(${DAYS.length}, 1fr)` }}
            >
              <div />
              {DAYS.map((d) => (
                <div key={d} className="px-1 pb-1 text-center">
                  {d}
                </div>
              ))}
            </div>

            {/* grid with posts */}
            <div
              className="relative grid gap-1"
              style={{
                gridTemplateColumns: `28px repeat(${DAYS.length}, 1fr)`,
                gridAutoRows: "18px",
              }}
            >
              {Array.from({ length: 8 }).map((_, h) => (
                <FragmentRow key={h} hour={h} days={DAYS.length} />
              ))}

              {POSTS.map((p, i) => {
                const colStart = p.day + 2; // +1 for hour column, +1 for 1-indexing
                const rowStart = p.hour + 1;
                const rowSpan = p.span ?? 1;
                return (
                  <div
                    key={i}
                    className="pm-post relative overflow-hidden rounded-md border px-1.5 py-1 text-[10px] leading-tight"
                    style={{
                      gridColumnStart: colStart,
                      gridColumnEnd: `span 1`,
                      gridRowStart: rowStart,
                      gridRowEnd: `span ${rowSpan}`,
                      borderColor:
                        p.state === "published"
                          ? "rgba(102,215,245,0.5)"
                          : p.state === "draft"
                            ? "rgba(154,161,181,0.4)"
                            : `${CHANNEL_COLORS[p.channel]}55`,
                      background:
                        p.state === "published"
                          ? "rgba(102,215,245,0.10)"
                          : p.state === "draft"
                            ? "rgba(154,161,181,0.08)"
                            : `${CHANNEL_COLORS[p.channel]}12`,
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span
                        className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{
                          background:
                            p.state === "published"
                              ? "#66D7F5"
                              : p.state === "draft"
                                ? "#9AA1B5"
                                : CHANNEL_COLORS[p.channel],
                        }}
                      />
                      <span className="truncate text-ink-soft">{p.title}</span>
                    </div>
                    <div className="mt-0.5 truncate text-[9px] text-faint">
                      {p.channel} · {STATE_LABEL[p.state]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* side: suggestions + agent + analytics */}
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl border border-line bg-surface-soft p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[12px] font-medium text-ink">
                  AI suggestions
                </div>
                <span className="chip !py-0.5">New</span>
              </div>
              <ul className="space-y-1.5">
                {SUGGESTIONS.map((s) => (
                  <li
                    key={s}
                    className="flex items-start gap-2 rounded-lg bg-surface px-2 py-1.5 text-[11.5px] text-ink-soft ring-1 ring-line"
                  >
                    <span aria-hidden="true" className="text-violet">✦</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-line bg-surface-soft p-3">
              <div className="mb-2 text-[12px] font-medium text-ink">
                Smart-agent activity
              </div>
              <div className="space-y-2">
                {[
                  { label: "Drafting carousel", pct: 80 },
                  { label: "Scheduling queue", pct: 55 },
                  { label: "Analyzing feed", pct: 35 },
                ].map((a) => (
                  <div key={a.label}>
                    <div className="mb-1 flex justify-between text-[10px] text-faint">
                      <span>{a.label}</span>
                      <span>{a.pct}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                      <div
                        className="pm-agent-bar h-full rounded-full bg-gradient-to-r from-violet to-cyan"
                        style={{ width: `${a.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-surface-soft p-3">
              <div className="mb-2 text-[12px] font-medium text-ink">
                Feed analysis
              </div>
              <svg viewBox="0 0 200 50" className="h-12 w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="pm-spark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#725CFF" stopOpacity="0.4" />
                    <stop offset="1" stopColor="#725CFF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,38 L25,30 L50,34 L75,22 L100,26 L125,14 L150,18 L175,10 L200,12 L200,50 L0,50 Z"
                  fill="url(#pm-spark)"
                />
                <path
                  d="M0,38 L25,30 L50,34 L75,22 L100,26 L125,14 L150,18 L175,10 L200,12"
                  fill="none"
                  stroke="#725CFF"
                  strokeWidth="1.5"
                />
              </svg>
              <div className="mt-1 flex justify-between text-[10px] text-faint">
                <span>Reach · 7d</span>
                <span className="text-violet-deep">trending up</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FragmentRow({ hour, days }: { hour: number; days: number }) {
  return (
    <>
      <div className="flex items-start justify-end pr-1 text-[8px] text-faint">
        {`${9 + hour}`}
      </div>
      {Array.from({ length: days }).map((_, d) => (
        <div
          key={d}
          className="rounded-sm bg-surface/60 ring-1 ring-inset ring-line"
          style={{ gridColumnStart: d + 2, gridRowStart: hour + 1 }}
        />
      ))}
    </>
  );
}
