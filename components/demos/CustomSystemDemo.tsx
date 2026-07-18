"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion, useIsomorphicLayoutEffect } from "@/lib/motion-safe";

gsap.registerPlugin(ScrollTrigger);

type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  accent: string;
  icon: React.ReactNode;
};

/**
 * CustomSystemDemo — visual system diagram.
 * Knowledge → AI model → Agent → Business workflow → Human review ↔ External system
 * Animated only while visible (ScrollTrigger toggles).
 */
export function CustomSystemDemo() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const flowRef = useRef<gsap.core.Timeline | null>(null);

  const nodes: Node[] = [
    {
      id: "knowledge",
      label: "Knowledge",
      x: 16,
      y: 78,
      accent: "#725CFF",
      icon: <DocIcon />,
    },
    {
      id: "model",
      label: "AI model",
      x: 36,
      y: 28,
      accent: "#66D7F5",
      icon: <ModelIcon />,
    },
    {
      id: "agent",
      label: "Agent",
      x: 56,
      y: 78,
      accent: "#E7A8F5",
      icon: <AgentIcon />,
    },
    {
      id: "workflow",
      label: "Business workflow",
      x: 76,
      y: 28,
      accent: "#725CFF",
      icon: <FlowIcon />,
    },
    {
      id: "human",
      label: "Human review",
      x: 90,
      y: 78,
      accent: "#C9AEFF",
      icon: <HumanIcon />,
    },
  ];

  const edges: [string, string][] = [
    ["knowledge", "model"],
    ["model", "agent"],
    ["agent", "workflow"],
    ["workflow", "human"],
    ["human", "model"],
  ];

  const idTo = (id: string) => nodes.find((n) => n.id === id)!;

  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // nodes pop in
      gsap.from(".cs-node", {
        scale: 0.7,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.8)",
        scrollTrigger: { trigger: el, start: "top 70%", once: true },
      });
      // draw edges
      gsap.fromTo(
        ".cs-edge",
        { strokeDashoffset: 600 },
        {
          strokeDashoffset: 0,
          duration: 1.4,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 70%", once: true },
        },
      );

      // perpetual particle along each edge, only while in view
      const tl = gsap.timeline({ repeat: -1 });
      el.querySelectorAll<SVGElement>(".cs-flow-particle").forEach((dot, i) => {
        const path = dot.dataset.path;
        if (!path) return;
        tl.fromTo(
          dot,
          { attr: { offsetDistance: "0%" } },
          {
            attr: { offsetDistance: "100%" },
            duration: 2.4,
            ease: "none",
            repeat: -1,
            delay: i * 0.3,
          },
          0,
        );
        // store to kill
      });
      flowRef.current = tl;

      // pause off-screen for performance
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) tl.play();
            else tl.pause();
          }
        },
        { threshold: 0.05 },
      );
      io.observe(el);
      el.dataset.observed = "true";
      // store cleanup via context revert
      return () => io.disconnect();
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={root} className="group relative">
      <div className="relative overflow-hidden rounded-[28px] border border-line bg-surface p-2 shadow-lift transition-transform duration-500 group-hover:-translate-y-1">
        <div className="flex items-center justify-between rounded-[22px] bg-surface-soft px-5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-violet-deep to-cyan text-[12px] font-semibold text-white">
              ⌬
            </div>
            <div className="leading-tight">
              <div className="text-[13px] font-medium text-ink">
                Custom AI system
              </div>
              <div className="text-[11px] text-faint">
                Architecture map · live demo
              </div>
            </div>
          </div>
          <span className="chip">
            <span className="status-dot !h-1.5 !w-1.5" />
            Flowing
          </span>
        </div>

        {/* diagram canvas */}
        <div className="relative aspect-[16/10] w-full bg-surface-soft p-3">
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />
          <svg viewBox="0 0 100 100" className="relative h-full w-full" preserveAspectRatio="none">
            <defs>
              {edges.map(([a, b], i) => {
                const na = idTo(a);
                const nb = idTo(b);
                const mx = (na.x + nb.x) / 2;
                const my = (na.y + nb.y) / 2;
                const cx = mx;
                const cy = my - 8;
                const d = `M ${na.x} ${na.y} Q ${cx} ${cy} ${nb.x} ${nb.y}`;
                const id = `cs-path-${i}`;
                return (
                  <path
                    key={id}
                    id={id}
                    d={d}
                    fill="none"
                    stroke="rgba(114,92,255,0.45)"
                    strokeWidth={0.5}
                    className="cs-edge"
                    strokeDasharray={600}
                  />
                );
              })}
            </defs>

            {/* edges */}
            {edges.map(([a, b], i) => {
              const na = idTo(a);
              const nb = idTo(b);
              const mx = (na.x + nb.x) / 2;
              const my = (na.y + nb.y) / 2;
              const cx = mx;
              const cy = my - 8;
              const d = `M ${na.x} ${na.y} Q ${cx} ${cy} ${nb.x} ${nb.y}`;
              return (
                <g key={`edge-${i}`}>
                  <path
                    d={d}
                    fill="none"
                    stroke="rgba(114,92,255,0.32)"
                    strokeWidth={0.4}
                    className="cs-edge"
                    strokeDasharray={600}
                  />
                </g>
              );
            })}

            {/* flow particles (using SMIL animateMotion referencing path id) */}
            {edges.map(([a, b], i) => {
              const na = idTo(a);
              const nb = idTo(b);
              const mx = (na.x + nb.x) / 2;
              const my = (na.y + nb.y) / 2;
              const cx = mx;
              const cy = my - 8;
              const d = `M ${na.x} ${na.y} Q ${cx} ${cy} ${nb.x} ${nb.y}`;
              return (
                <circle
                  key={`p-${i}`}
                  r={0.6}
                  fill="#66D7F5"
                  className="cs-flow-particle"
                >
                  <animateMotion
                    dur={`${2.6 + i * 0.3}s`}
                    repeatCount="indefinite"
                    path={d}
                    rotate="auto"
                  />
                </circle>
              );
            })}
          </svg>

          {/* nodes overlay (HTML for crisp text) */}
          <div className="pointer-events-none absolute inset-0">
            {nodes.map((n) => (
              <div
                key={n.id}
                className="cs-node absolute flex w-[22%] max-w-[160px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 rounded-xl border bg-surface/95 px-2 py-2 text-center shadow-soft backdrop-blur"
                style={{
                  left: `${n.x}%`,
                  top: `${n.y}%`,
                  borderColor: `${n.accent}55`,
                }}
              >
                <span
                  className="grid h-7 w-7 place-items-center rounded-lg"
                  style={{ background: `${n.accent}1a`, color: n.accent }}
                  aria-hidden="true"
                >
                  {n.icon}
                </span>
                <span className="text-[10.5px] font-medium text-ink">
                  {n.label}
                </span>
              </div>
            ))}
          </div>

          {/* external system badge */}
          <div
            className="cs-node absolute right-[2%] top-[6%] rounded-lg border border-line bg-surface/95 px-2 py-1 text-[10px] text-muted shadow-soft backdrop-blur"
            aria-hidden="true"
          >
            External system
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-line px-5 py-3 text-[11px] text-faint">
          <span>Knowledge → decision → action</span>
          <span className="text-violet-deep">Human-in-the-loop</span>
        </div>
      </div>
    </div>
  );
}

/* tiny inline icons */
function DocIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M6 3h9l4 4v14H6V3z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 12h7M9 16h7" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function ModelIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="5" cy="6" r="1.6" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="19" cy="6" r="1.6" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="5" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="19" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 7l3 3M17 7l-3 3M7 17l3-3M17 17l-3-3" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
function AgentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="8" width="14" height="10" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 4v4M3 12h2M19 12h2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9" cy="13" r="1" fill="currentColor" />
      <circle cx="15" cy="13" r="1" fill="currentColor" />
    </svg>
  );
}
function FlowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h6v4H4zM14 6h6v4h-6zM4 14h6v4H4zM14 14h6v4h-6z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 8h4M10 16h4M7 10v4M17 10v4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
function HumanIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 21c0-4 3-7 7-7s7 3 7 7" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
