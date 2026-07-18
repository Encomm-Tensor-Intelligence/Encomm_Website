"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { approach } from "@/content/site-content";
import {
  useReducedMotion,
  useIsomorphicLayoutEffect,
} from "@/lib/motion/use-scroll-state";

gsap.registerPlugin(ScrollTrigger);

const STAGE_ART: Record<string, string> = {
  Discover: "◎",
  Design: "◈",
  Build: "◆",
  Integrate: "⬡",
  Evolve: "✦",
};

/**
 * Approach — a scroll-controlled journey through DISCOVER → DESIGN → BUILD
 * → INTEGRATE → EVOLVE. One glowing signal travels the whole pipeline.
 */
export function Approach() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      // the traveling signal — scrubs across the pipeline with section progress
      gsap.fromTo(
        ".approach-signal",
        { left: "0%" },
        {
          left: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
            end: "bottom 70%",
            scrub: 0.6,
          },
        },
      );
      // each stage lights up as the signal passes
      el.querySelectorAll<HTMLElement>(".approach-stage").forEach((stage) => {
        gsap.fromTo(
          stage,
          { opacity: 0.35 },
          {
            opacity: 1,
            duration: 0.5,
            scrollTrigger: {
              trigger: stage,
              start: "left center",
              end: "right center",
              containerAnimation: undefined,
              toggleActions: "play reverse play reverse",
            },
          },
        );
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="approach"
      ref={root}
      className="section-anchor section-tint-b relative overflow-hidden py-20 md:py-28"
    >
      <div className="grid-bg-fine pointer-events-none absolute inset-0 opacity-30" />

      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <p className="eyebrow mb-5">
          <span className="text-violet">A—01</span> · Approach
        </p>
        <h2 className="kinetic mb-16 max-w-4xl text-[clamp(2.2rem,6vw,5rem)] text-ink">
          One signal through the{" "}
          <span className="text-spectral">whole pipeline</span>.
        </h2>

        {/* pipeline track */}
        <div className="relative">
          {/* base track */}
          <div className="absolute left-0 right-0 top-8 h-px bg-line md:top-12" />
          {/* gradient progress track */}
          <div className="approach-progress absolute left-0 top-8 h-px data-line md:top-12" style={{ width: "100%", opacity: 0.4 }} />

          {/* traveling signal */}
          <div
            className="approach-signal absolute top-8 z-10 -translate-x-1/2 -translate-y-1/2 md:top-12"
            aria-hidden="true"
          >
            <div className="relative">
              <div className="h-3.5 w-3.5 rounded-full bg-violet shadow-[0_0_24px_6px_rgba(106,77,255,0.6)]" />
              <div className="absolute inset-0 animate-ping rounded-full bg-violet/40" />
            </div>
          </div>

          {/* stages */}
          <ol className="relative grid grid-cols-1 gap-10 md:grid-cols-5 md:gap-4">
            {approach.map((s, i) => (
              <li
                key={s.index}
                className="approach-stage relative pt-20 md:pt-24"
              >
                {/* node on the track */}
                <div className="absolute left-0 top-8 -translate-y-1/2 md:top-12">
                  <div className="grid h-5 w-5 place-items-center rounded-full border border-line bg-white">
                    <div className="h-1.5 w-1.5 rounded-full bg-violet" />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span
                    className="font-display text-3xl text-violet"
                    aria-hidden="true"
                  >
                    {STAGE_ART[s.title]}
                  </span>
                  <div>
                    <span className="font-mono text-[10px] text-faint">
                      {s.index}
                    </span>
                    <h3 className="font-display text-xl text-ink md:text-2xl">
                      {s.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
                  {s.description}
                </p>
                {/* coordinate */}
                <p className="mt-3 font-mono text-[9px] text-faint">
                  STAGE · {s.index} · {(i + 1) * 20}%
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
