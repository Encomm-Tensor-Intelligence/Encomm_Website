"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { hero } from "@/content/site-content";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal, LineMask } from "@/components/motion/Reveal";
import { useReducedMotion } from "@/lib/motion-safe";

// SSR off + lazy; the loader shows the SVG fallback meanwhile.
const EncommCore = dynamic(() => import("@/components/brand/EncommCore"), {
  ssr: false,
});

export function Hero() {
  const reduced = useReducedMotion();
  const lightRef = useRef<HTMLDivElement>(null);

  // cursor-responsive light inside hero (desktop only, restrained)
  useEffect(() => {
    if (reduced) return;
    const el = lightRef.current;
    if (!el) return;
    // Disable on coarse pointer (touch)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      el.style.background = `radial-gradient(420px circle at ${x}% ${y}%, rgba(114,92,255,0.10), transparent 60%)`;
    };
    const onLeave = () => {
      el.style.background = "transparent";
    };
    const parent = el.parentElement;
    parent?.addEventListener("mousemove", onMove);
    parent?.addEventListener("mouseleave", onLeave);
    return () => {
      parent?.removeEventListener("mousemove", onMove);
      parent?.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  return (
    <section
      id="top"
      data-hero
      className="section-anchor relative min-h-[100svh] overflow-hidden pt-28 md:pt-32"
    >
      {/* Spectral wash + grid background */}
      <div className="spectral-wash pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      {/* cursor light */}
      <div
        ref={lightRef}
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid min-h-[calc(100svh-8rem)] max-w-[1320px] grid-cols-1 items-center gap-10 px-4 pb-24 md:grid-cols-12 md:gap-6 md:px-8">
        {/* Left editorial column — asymmetric */}
        <div className="md:col-span-6 lg:col-span-5">
          <Reveal variant="fade-up">
            <div className="eyebrow mb-6 inline-flex items-center gap-3 rounded-full border border-line bg-surface/70 px-3 py-1.5 backdrop-blur">
              <span className="status-dot" />
              {hero.eyebrow}
            </div>
          </Reveal>

          <h1 className="display-1 text-[clamp(2.8rem,7.5vw,5.6rem)] text-ink">
            <LineMask>AI, made</LineMask>
            <LineMask>
              <span className="text-spectral">operational</span>
              <span className="text-ink">.</span>
            </LineMask>
          </h1>

          <Reveal variant="fade-up" delay={0.1}>
            <p className="mt-7 max-w-md text-[17px] leading-relaxed text-muted md:text-lg">
              {hero.supporting}
            </p>
          </Reveal>

          <Reveal variant="fade-up" delay={0.18}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <MagneticButton href={hero.primaryCta.href} variant="primary" size="lg">
                {hero.primaryCta.label}
              </MagneticButton>
              <MagneticButton
                href={hero.secondaryCta.href}
                variant="secondary"
                size="lg"
              >
                {hero.secondaryCta.label}
                <span aria-hidden="true" className="ml-1 text-violet">↘</span>
              </MagneticButton>
            </div>
          </Reveal>

          {/* small meta strip */}
          <Reveal variant="fade-up" delay={0.26}>
            <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-2 text-[12px] text-faint">
              <span className="inline-flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-violet" />
                Conversational AI
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-cyan" />
                Content & scheduling
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-magenta" />
                Custom AI systems
              </span>
            </div>
          </Reveal>
        </div>

        {/* Right core column */}
        <div className="relative md:col-span-6 lg:col-span-7">
          <div className="relative mx-auto aspect-square w-full max-w-[640px]">
            {/* Halo behind the core */}
            <div
              aria-hidden="true"
              className="absolute inset-[8%] rounded-full opacity-70 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(114,92,255,0.22), transparent 60%)",
              }}
            />
            {/* thin orbit ring */}
            <div
              aria-hidden="true"
              className="absolute inset-[6%] rounded-full border border-line"
            />
            <div
              aria-hidden="true"
              className="absolute inset-[18%] rounded-full border border-line"
            />
            <EncommCore className="absolute inset-0 h-full w-full" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 text-faint">
        <span className="eyebrow text-[10px]">Scroll</span>
        <span aria-hidden="true" className="relative block h-10 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-3 animate-[scrolldot_2s_var(--ease-in-out-quart)_infinite] bg-violet" />
        </span>
      </div>

      <style>{`
        @keyframes scrolldot {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(360%); }
        }
      `}</style>
    </section>
  );
}
