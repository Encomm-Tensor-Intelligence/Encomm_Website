"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stages, type Stage } from "@/content/site-content";
import { Eyebrow } from "@/components/ui/Primitives";
import { useReducedMotion, useIsomorphicLayoutEffect } from "@/lib/motion-safe";

gsap.registerPlugin(ScrollTrigger);

const STAGE_ART: Record<Stage["key"], React.ReactNode> = {
  signal: (
    <svg viewBox="0 0 240 120" className="h-full w-full" aria-hidden="true">
      {/* signal sources feeding inward */}
      {[
        [20, 20],
        [20, 60],
        [20, 100],
        [120, 14],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={4} fill="#725CFF" className="stage-dot" />
          <line
            x1={x}
            y1={y}
            x2={120}
            y2={60}
            stroke="rgba(114,92,255,0.35)"
            strokeWidth={1}
            className="stage-line"
            strokeDasharray="3 3"
          />
        </g>
      ))}
      <circle cx={120} cy={60} r={14} fill="none" stroke="#5E48D6" strokeWidth={1.5} />
      <circle cx={120} cy={60} r={5} fill="#725CFF" />
    </svg>
  ),
  sense: (
    <svg viewBox="0 0 240 120" className="h-full w-full" aria-hidden="true">
      {/* mesh / sense network */}
      <g stroke="rgba(102,215,245,0.5)" strokeWidth={1} fill="none">
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={i} x1={30} y1={20 + i * 20} x2={210} y2={60} />
        ))}
      </g>
      <g fill="#66D7F5">
        {Array.from({ length: 5 }).map((_, i) => (
          <circle key={i} cx={30} cy={20 + i * 20} r={3} />
        ))}
      </g>
      <circle cx={210} cy={60} r={14} fill="none" stroke="#1A9EC4" strokeWidth={1.5} />
      <circle cx={210} cy={60} r={5} fill="#66D7F5" />
    </svg>
  ),
  system: (
    <svg viewBox="0 0 240 120" className="h-full w-full" aria-hidden="true">
      {/* deployed layers */}
      <g fill="none" strokeWidth={1.5}>
        <rect x={50} y={20} width={140} height={20} rx={4} stroke="#725CFF" />
        <rect x={50} y={50} width={140} height={20} rx={4} stroke="#C9AEFF" />
        <rect x={50} y={80} width={140} height={20} rx={4} stroke="#E7A8F5" />
      </g>
      <g fill="#725CFF">
        <circle cx={50} cy={30} r={3} />
        <circle cx={50} cy={60} r={3} fill="#C9AEFF" />
        <circle cx={50} cy={90} r={3} fill="#E7A8F5" />
      </g>
    </svg>
  ),
  scale: (
    <svg viewBox="0 0 240 120" className="h-full w-full" aria-hidden="true">
      {/* concentric scale rings */}
      <g fill="none" strokeWidth={1}>
        <circle cx={120} cy={60} r={14} stroke="#5E48D6" />
        <circle cx={120} cy={60} r={28} stroke="rgba(114,92,255,0.5)" />
        <circle cx={120} cy={60} r={42} stroke="rgba(114,92,255,0.3)" />
        <circle cx={120} cy={60} r={56} stroke="rgba(114,92,255,0.15)" />
      </g>
      <circle cx={120} cy={60} r={5} fill="#725CFF" />
    </svg>
  ),
};

export function Narrative() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // highlight each stage in turn via ScrollTrigger
      const items = gsap.utils.toArray<HTMLElement>(".stage-item");
      items.forEach((item) => {
        gsap.fromTo(
          item.querySelector(".stage-art"),
          { opacity: 0.35 },
          {
            opacity: 1,
            scrollTrigger: {
              trigger: item,
              start: "top 75%",
              end: "bottom 60%",
              toggleActions: "play reverse play reverse",
            },
          },
        );
        // draw lines
        const lines = item.querySelectorAll<SVGLineElement>(".stage-line");
        if (lines.length) {
          gsap.fromTo(
            lines,
            { strokeDashoffset: 200 },
            {
              strokeDashoffset: 0,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }
        // dot pulse
        const dots = item.querySelectorAll<SVGCircleElement>(".stage-dot");
        if (dots.length) {
          gsap.fromTo(
            dots,
            { scale: 0.6, transformOrigin: "center" },
            {
              scale: 1,
              duration: 0.6,
              stagger: 0.08,
              ease: "back.out(2)",
              scrollTrigger: {
                trigger: item,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }
      });

      // progress line
      const progressBar = el.querySelector<HTMLElement>(".narrative-progress-bar");
      if (progressBar) {
        gsap.fromTo(
          progressBar,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            transformOrigin: "left center",
            scrollTrigger: {
              trigger: el,
              start: "top 60%",
              end: "bottom 80%",
              scrub: 0.5,
            },
          },
        );
      }
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="narrative"
      ref={root}
      className="section-anchor relative bg-paper py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-4 md:px-8">
        <div className="mb-14 flex flex-col gap-4 md:mb-20">
          <Eyebrow index="N—01">The arc</Eyebrow>
          <h2 className="display-1 max-w-3xl text-[clamp(1.9rem,4.5vw,3.4rem)] text-ink">
            Raw information becomes{" "}
            <span className="text-spectral">useful action</span>.
          </h2>
        </div>

        {/* progress rail */}
        <div
          aria-hidden="true"
          className="relative mb-12 h-px w-full bg-line md:mb-16"
        >
          <div className="narrative-progress-bar data-line absolute inset-y-0 left-0 w-full origin-left" />
        </div>

        <ol className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {stages.map((s) => (
            <li key={s.key} className="stage-item group">
              <div className="flex h-full flex-col gap-5 border-t border-line pt-5">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[12px] text-violet">
                    {s.index}
                  </span>
                  <span className="font-display text-[11px] uppercase tracking-[0.18em] text-faint">
                    Stage
                  </span>
                </div>
                <h3 className="font-display text-2xl text-ink md:text-[28px]">
                  {s.title}
                </h3>

                <div className="stage-art relative h-[120px] w-full rounded-2xl border border-line bg-surface/60 p-3 transition-opacity duration-500">
                  {STAGE_ART[s.key]}
                </div>

                <p className="text-[14.5px] leading-relaxed text-ink-soft">
                  {s.sentence}
                </p>
                <p className="mt-auto text-[12.5px] italic text-faint">
                  {s.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
