"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useReducedMotion,
  useIsomorphicLayoutEffect,
} from "@/lib/motion/use-scroll-state";
import { useLanguage } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

type Item = {
  id: number;
  title: string;
  channel: "LinkedIn" | "X" | "Instagram";
  state: "idea" | "draft" | "scheduled" | "published";
};

const SEED: Item[] = [
  { id: 1, title: "Launch teaser", channel: "LinkedIn", state: "idea" },
  { id: 2, title: "AI myth-busting", channel: "X", state: "draft" },
  { id: 3, title: "Carousel · enterprise AI", channel: "Instagram", state: "scheduled" },
  { id: 4, title: "Weekly digest", channel: "X", state: "published" },
  { id: 5, title: "Customer story", channel: "LinkedIn", state: "idea" },
  { id: 6, title: "Team spotlight", channel: "Instagram", state: "draft" },
];

const STATE_FLOW = ["idea", "draft", "scheduled", "published"] as const;
const CHANNEL_COLOR: Record<Item["channel"], string> = {
  LinkedIn: "#6a4dff",
  X: "#4fd4f5",
  Instagram: "#e58bf0",
};

/**
 * PostmatrixOrbit — ideas float in, move through a circular scheduling orbit,
 * agent nodes transform them, analytics curve travels around. A content
 * control-room that stays bright and elegant.
 */
export function PostmatrixOrbit() {
  const { language } = useLanguage();
  const labels =
    language === "el"
      ? {
          titles: [
            "Teaser λανσαρίσματος",
            "Μύθοι και αλήθειες για το AI",
            "Carousel · enterprise AI",
            "Εβδομαδιαία σύνοψη",
            "Ιστορία πελάτη",
            "Η ομάδα στο προσκήνιο",
          ],
          orbit: "ΠΕΡΙΕΧΟΜΕΝΟ · ΤΡΟΧΙΑ",
          active: "Agent ενεργός",
          ideas: "Ιδέες",
          analytics: "Αναλυτικά",
          reach: "Απήχηση",
          engage: "Αλληλεπίδραση",
          schedule: "Πρόγραμμα",
          states: {
            idea: "ιδέα",
            draft: "πρόχειρο",
            scheduled: "προγραμματισμένο",
            published: "δημοσιευμένο",
          },
        }
      : {
          titles: SEED.map((item) => item.title),
          orbit: "CONTENT · ORBIT",
          active: "Agent active",
          ideas: "Ideas",
          analytics: "Analytics",
          reach: "Reach",
          engage: "Engage",
          schedule: "Schedule",
          states: {
            idea: "idea",
            draft: "draft",
            scheduled: "scheduled",
            published: "published",
          },
        };
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Item[]>(SEED);
  const [hovered, setHovered] = useState<number | null>(null);
  const rafRef = useRef(0);
  const angleRef = useRef(0);

  // Auto-advance one item through its lifecycle every few seconds when visible.
  useEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;
    let visible = false;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e) visible = e.isIntersecting;
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    const id = window.setInterval(
      () => {
        if (!visible) return;
        setItems((prev) => {
          // advance the earliest non-published item
          const idx = prev.findIndex((i) => i.state !== "published");
          if (idx < 0) return prev;
          const cur = STATE_FLOW.indexOf(prev[idx]!.state);
          const next = Math.min(STATE_FLOW.length - 1, cur + 1);
          const copy = prev.slice();
          copy[idx] = { ...copy[idx]!, state: STATE_FLOW[next]! };
          return copy;
        });
      },
      2600,
    );
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [reduced]);

  // Orbit rotation rAF — paused when off-screen.
  useEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;
    let visible = true;
    const io = new IntersectionObserver((entries) => {
      const e = entries[0];
      if (e) visible = e.isIntersecting;
    }, {
      threshold: 0.05,
    });
    io.observe(el);
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      if (!visible) return;
      angleRef.current += 0.0015;
      el.style.setProperty("--orbit-angle", `${angleRef.current}rad`);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      io.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pm-card",
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: el, start: "top 65%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  const orbitItems = items.filter((i) => i.state !== "idea");
  const ideas = items.filter((i) => i.state === "idea");
  const itemTitle = (item: Item) =>
    labels.titles[item.id - 1] ?? item.title;

  return (
    <div
      ref={root}
      data-cursor="DRAG"
      className="group relative aspect-[5/4] w-full overflow-hidden rounded-[28px] border border-line glass"
      style={{ "--orbit-angle": "0rad" } as React.CSSProperties}
    >
      <div className="grid-bg-fine pointer-events-none absolute inset-0 opacity-40" />

      {/* top bar */}
      <div className="absolute inset-x-3 top-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-violet to-magenta text-[12px] font-semibold text-white">
            P
          </div>
          <div className="leading-tight">
            <div className="text-[12px] font-medium text-ink">Postmatrix</div>
            <div className="font-mono text-[9px] text-faint">{labels.orbit}</div>
          </div>
        </div>
        <span className="chip">
          <span className="status-dot !h-1.5 !w-1.5" /> {labels.active}
        </span>
      </div>

      {/* ideas column (left) */}
      <div className="absolute left-3 top-1/2 w-[26%] -translate-y-1/2 space-y-1.5">
        <p className="eyebrow mb-2 !text-[9px]">{labels.ideas}</p>
        {ideas.map((it) => (
          <div
            key={it.id}
            data-cursor="OPEN"
            onMouseEnter={() => setHovered(it.id)}
            onMouseLeave={() => setHovered(null)}
            className="rounded-lg border border-dashed border-line bg-white/70 px-2 py-1.5 text-[10px] text-muted transition-all hover:-translate-y-0.5 hover:border-violet/40"
          >
            <span className="block truncate">{itemTitle(it)}</span>
          </div>
        ))}
      </div>

      {/* orbit ring */}
      <div className="absolute left-1/2 top-1/2 h-[58%] w-[42%] -translate-x-1/2 -translate-y-1/2">
        {/* ring */}
        <div className="absolute inset-0 rounded-full border border-line" />
        <div className="absolute inset-[12%] rounded-full border border-dashed border-line" />
        {/* center agent */}
        <div className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-violet to-cyan text-white shadow-glow">
          <span className="text-[14px]">✦</span>
        </div>

        {/* orbiting cards */}
        <div
          className="absolute inset-0"
          style={{ transform: "rotate(var(--orbit-angle))" }}
        >
          {orbitItems.map((it, i) => {
            const angle = (i / orbitItems.length) * Math.PI * 2;
            const r = 42;
            const x = Number((50 + Math.cos(angle) * r).toFixed(2));
            const y = Number((50 + Math.sin(angle) * r).toFixed(2));
            const isHovered = hovered === it.id;
            return (
              <div
                key={it.id}
                data-cursor="OPEN"
                onMouseEnter={() => setHovered(it.id)}
                onMouseLeave={() => setHovered(null)}
                className="pm-card absolute w-[88px] -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: `translate(-50%, -50%) rotate(calc(-1 * var(--orbit-angle))) scale(${isHovered ? 1.18 : 1})`,
                  zIndex: isHovered ? 10 : 1,
                  transition: "transform 0.3s var(--ease-out-quint)",
                }}
              >
                <div
                  className="rounded-lg border bg-white px-2 py-1.5 shadow-soft"
                  style={{ borderColor: `${CHANNEL_COLOR[it.channel]}55` }}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: CHANNEL_COLOR[it.channel] }}
                    />
                    <span className="font-mono text-[7px] uppercase text-faint">
                      {labels.states[it.state]}
                    </span>
                  </div>
                  <div className="truncate text-[9.5px] text-ink">{itemTitle(it)}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* analytics curve */}
        <svg
          className="pointer-events-none absolute -inset-4"
          viewBox="0 0 200 200"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="pm-curve" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#6a4dff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#6a4dff" stopOpacity="0.5" />
              <stop offset="1" stopColor="#4fd4f5" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M10,170 Q60,120 100,130 T190,60"
            fill="none"
            stroke="url(#pm-curve)"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* analytics (right) */}
      <div className="absolute right-3 top-1/2 w-[24%] -translate-y-1/2">
        <p className="eyebrow mb-2 !text-[9px]">{labels.analytics}</p>
        <div className="space-y-2">
          {[
            { l: labels.reach, v: 78 },
            { l: labels.engage, v: 54 },
            { l: labels.schedule, v: 92 },
          ].map((a) => (
            <div key={a.l}>
              <div className="mb-0.5 flex justify-between font-mono text-[8px] text-faint">
                <span>{a.l}</span>
                <span>{a.v}%</span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet to-cyan"
                  style={{ width: `${a.v}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
