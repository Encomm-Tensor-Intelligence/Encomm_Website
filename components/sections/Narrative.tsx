"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitChars } from "@/components/motion/Kinetic";
import { useLanguage } from "@/lib/i18n";
import {
  useReducedMotion,
  useIsomorphicLayoutEffect,
} from "@/lib/motion/use-scroll-state";

gsap.registerPlugin(ScrollTrigger);

const STAGE_GLYPH: Record<string, string> = {
  signal: "◉",
  sense: "◈",
  system: "◆",
  scale: "✦",
};

/**
 * Narrative — SIGNAL → SENSE → SYSTEM → SCALE.
 * A continuous horizontal scroll-driven strip where each stage flows into
 * the next; oversized kinetic numbers + a traveling signal line.
 */
export function Narrative() {
  const { content, copy } = useLanguage();
  const { stages } = content;
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      // Traveling signal line — scrubs with section progress
      gsap.fromTo(
        ".narrative-signal",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          transformOrigin: "left center",
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
            end: "bottom 70%",
            scrub: 0.5,
          },
        },
      );
      // Each stage word: kinetic char slide-in
      el.querySelectorAll<HTMLElement>(".stage-word").forEach((word) => {
        const chars = word.querySelectorAll(".split-char");
        gsap.fromTo(
          chars,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.04,
            scrollTrigger: {
              trigger: word,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
      // Stage numbers count-up illusion via opacity stagger
      el.querySelectorAll<HTMLElement>(".stage-num").forEach((n) => {
        gsap.fromTo(
          n,
          { opacity: 0, scale: 0.7, filter: "blur(8px)" },
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: n,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="narrative"
      ref={root}
      className="section-anchor section-tint-a relative overflow-hidden py-24 md:py-36"
    >
      <div className="grid-bg-fine pointer-events-none absolute inset-0 opacity-40" />

      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        {/* Heading — oversized, split */}
        <div className="mb-16 md:mb-24">
          <p className="eyebrow mb-5">
            <span className="text-violet">N—01</span> · {copy.narrative.eyebrow}
          </p>
          <h2 className="kinetic text-[clamp(2.4rem,7vw,6rem)] text-ink">
            <span className="stage-word block">
              <SplitChars text={copy.narrative.lineOne} />
            </span>
            <span className="stage-word block text-spectral">
              <SplitChars text={copy.narrative.lineTwo} />
            </span>
          </h2>
        </div>

        {/* Traveling signal rail */}
        <div
          aria-hidden="true"
          ref={rail}
          className="relative mb-16 h-px w-full bg-line md:mb-20"
        >
          <div className="narrative-signal data-line absolute inset-0 origin-left" />
          {/* moving pulse */}
          <div className="absolute -top-1 left-0 h-3 w-3 -translate-x-1/2 rounded-full bg-violet shadow-[0_0_20px_4px_rgba(106,77,255,0.6)]" />
        </div>

        {/* Stages — horizontal flow on desktop, stacked on mobile */}
        <ol className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-4">
          {stages.map((s, i) => (
            <li
              key={s.key}
              className="group relative"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* connecting arrow between stages */}
              {i < stages.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-5 top-6 hidden text-line-strong md:block"
                >
                  →
                </span>
              ) : null}
              <div className="flex items-baseline gap-4">
                <span className="stage-num kinetic text-[clamp(3rem,5vw,4.5rem)] text-ink/15">
                  {s.index}
                </span>
                <span
                  className="text-2xl text-violet transition-transform duration-500 group-hover:scale-125"
                  aria-hidden="true"
                >
                  {STAGE_GLYPH[s.key]}
                </span>
              </div>
              <h3 className="stage-word mt-2 font-display text-2xl text-ink md:text-[26px]">
                <SplitChars text={s.title} />
              </h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-muted">
                {s.sentence}
              </p>
              <p className="mt-3 font-mono text-[11px] text-faint">
                {s.detail}
              </p>
              {/* hover scan line */}
              <div className="mt-4 h-px w-0 scanline transition-all duration-500 group-hover:w-full" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
