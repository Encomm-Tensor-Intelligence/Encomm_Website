"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { hero } from "@/content/site-content";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SplitChars } from "@/components/motion/Kinetic";
import {
  useReducedMotion,
  useIsomorphicLayoutEffect,
} from "@/lib/motion/use-scroll-state";

gsap.registerPlugin(ScrollTrigger);

// Lazy-load the 3D core; SSR off.
const EncommCore = dynamic(() => import("@/components/webgl/EncommCore"), {
  ssr: false,
});

/**
 * Cinematic hero. Pinned for ~280vh and choreographed in scroll beats:
 *  0–15%   boot, ENCOMM assembles from particles
 *  15–35%  core assembles
 *  35–55%  core opens
 *  55–75%  labels appear
 *  75–90%  processing streams
 *  90–100% aligns, headline + CTAs resolve
 */
export function Hero() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const encommWord = useRef<HTMLSpanElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const supporting = useRef<HTMLParagraphElement>(null);
  const ctas = useRef<HTMLDivElement>(null);
  const eyebrow = useRef<HTMLDivElement>(null);
  const scrollCue = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      // ENCOMM kinetic assembly
      const chars = encommWord.current?.querySelectorAll(".split-char") ?? [];
      if (chars.length) {
        gsap.set(chars, { yPercent: 120, opacity: 0, rotateZ: 8 });
        gsap.to(chars, {
          yPercent: 0,
          opacity: 1,
          rotateZ: 0,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.05,
          delay: 0.35,
        });
      }

      // Pinned scroll sequence — drive opacity/position by scroll progress.
      const trigger = document.querySelector("[data-hero-pin]") as HTMLElement | null;
      if (!trigger) return;

      // Hide post-boot content until later beats.
      gsap.set([headline.current, supporting.current, ctas.current, eyebrow.current], {
        opacity: 0,
        y: 30,
      });
      gsap.set(scrollCue.current, { opacity: 0 });

      // Eyebrow appears ~12%
      gsap.to(eyebrow.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger,
          start: "10% top",
          end: "16% top",
          scrub: 0.6,
        },
      });

      // Headline resolves 80–95%
      gsap.to(headline.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger,
          start: "78% top",
          end: "94% top",
          scrub: 0.6,
        },
      });

      gsap.to(supporting.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger,
          start: "82% top",
          end: "96% top",
          scrub: 0.6,
        },
      });

      gsap.to(ctas.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger,
          start: "86% top",
          end: "100% top",
          scrub: 0.6,
        },
      });

      // ENCOMM big word drifts up and fades as you scroll past boot.
      if (encommWord.current) {
        gsap.to(encommWord.current, {
          yPercent: -25,
          opacity: 0.15,
          filter: "blur(2px)",
          ease: "none",
          scrollTrigger: {
            trigger,
            start: "top top",
            end: "55% top",
            scrub: 0.5,
          },
        });
      }

      // Scroll cue shows after boot
      gsap.to(scrollCue.current, {
        opacity: 1,
        duration: 0.6,
        delay: 2.4,
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  // Cleanup ScrollTriggers on unmount.
  useEffect(() => {
    const el = root.current;
    return () => {
      if (!el) return;
      ScrollTrigger.getAll().forEach((st) => {
        // Only kill ScrollTriggers created inside this hero section.
        const trigger = st.trigger as HTMLElement | null;
        if (trigger && el.contains(trigger)) st.kill();
      });
    };
  }, []);

  return (
    <section
      ref={root}
      id="top"
      data-hero
      className="relative"
    >
      {/* Pin container — 280vh tall to give the scroll sequence room. */}
      <div ref={pin} data-hero-pin className="relative h-[280vh]">
        {/* Sticky stage */}
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {/* Ambient backgrounds */}
          <div className="spectral-wash pointer-events-none absolute inset-0" />
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />

          {/* 3D core fills the stage */}
          <div className="absolute inset-0">
            <EncommCoreLazy reduced={reduced} />
          </div>

          {/* Boot kinetic ENCOMM word — huge, centered behind the core */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span
              ref={encommWord}
              className="kinetic select-none text-[clamp(4rem,18vw,16rem)] text-ink/90"
              style={{
                mixBlendMode: "multiply",
                letterSpacing: "-0.04em",
              }}
            >
              <SplitChars text="ENCOMM" />
            </span>
          </div>

          {/* Eyebrow (appears ~12%) */}
          <div className="pointer-events-none absolute left-1/2 top-[14%] -translate-x-1/2">
            <div
              ref={eyebrow}
              className="glass flex items-center gap-2.5 rounded-full px-4 py-2"
            >
              <span className="status-dot" />
              <span className="eyebrow">{hero.eyebrow}</span>
            </div>
          </div>

          {/* Technical coordinates overlay */}
          <div className="pointer-events-none absolute inset-0 hidden md:block">
            <div className="coord absolute left-6 top-28">
              <div>LAT 37.98°N</div>
              <div>LON 23.72°E</div>
            </div>
            <div className="coord absolute right-6 top-28 text-right">
              <div>SYS · CORE/v2</div>
              <div>STATE · BOOTING</div>
            </div>
            <div className="coord absolute bottom-10 left-6">
              <div>NODES · 3200</div>
              <div>LINKS · ACTIVE</div>
            </div>
            <div className="coord absolute bottom-10 right-6 text-right">
              <div>SIGNAL · STABLE</div>
              <div>REFRACTION · 1.40</div>
            </div>
            {/* corner ticks */}
            <div className="absolute left-4 top-20 h-3 w-px bg-line-strong" />
            <div className="absolute left-4 top-20 h-px w-3 bg-line-strong" />
            <div className="absolute right-4 top-20 h-3 w-px bg-line-strong" />
            <div className="absolute right-4 top-20 h-px w-3 bg-line-strong" />
          </div>

          {/* Resolved hero content (appears at end of sequence) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[8%] z-10">
            <div className="mx-auto max-w-[1320px] px-4 md:px-8">
              <h1
                ref={headline}
                className="kinetic text-[clamp(2.6rem,7vw,5.4rem)] text-ink"
              >
                <span className="block">AI, made</span>
                <span className="block text-spectral">operational.</span>
              </h1>
              <p
                ref={supporting}
                className="mt-6 max-w-md text-base leading-relaxed text-muted md:text-lg"
              >
                Knowledge becomes understanding.
                <br />
                Understanding becomes action.
              </p>
              <div ref={ctas} className="mt-8 flex flex-wrap gap-3">
                <MagneticButton
                  href={hero.primaryCta.href}
                  variant="primary"
                  size="lg"
                >
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
            </div>
          </div>

          {/* Scroll cue */}
          <div
            ref={scrollCue}
            className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-2 text-faint">
              <span className="eyebrow !text-[9px]">Scroll to engage</span>
              <span className="relative block h-9 w-px overflow-hidden bg-line">
                <span className="absolute inset-x-0 top-0 h-3 animate-[heroCue_1.8s_var(--ease-in-out-quart)_infinite] bg-violet" />
              </span>
            </div>
          </div>

          <style>{`
            @keyframes heroCue {
              0% { transform: translateY(-100%); }
              100% { transform: translateY(360%); }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}

/** Wrap the lazy core so reduced-motion shows the CSS fallback. */
function EncommCoreLazy({ reduced }: { reduced: boolean }) {
  if (reduced) return <CoreFallback />;
  return <EncommCore quality="high" />;
}

/** CSS/SVG fallback for reduced motion. */
function CoreFallback() {
  return (
    <div className="core-fallback absolute inset-0 grid place-items-center">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 45%, rgba(106,77,255,0.18), transparent 70%)",
        }}
      />
      <svg viewBox="0 0 320 320" className="relative h-[60%] w-[60%]" role="presentation">
        <defs>
          <linearGradient id="hc-v" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#A07BFF" />
            <stop offset="1" stopColor="#5E48D6" />
          </linearGradient>
          <linearGradient id="hc-c" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#66D7F5" />
            <stop offset="1" stopColor="#9BE7FB" />
          </linearGradient>
        </defs>
        <g>
          <polygon points="160,30 270,90 270,230 160,290 50,230 50,90" fill="url(#hc-v)" />
          <polygon points="160,30 270,90 160,160" fill="#C9AEFF" />
          <polygon points="50,90 160,30 160,160" fill="url(#hc-c)" opacity="0.9" />
          <polygon points="160,290 50,230 160,160" fill="#5E48D6" />
          <rect x="120" y="128" width="80" height="9" rx="4" fill="#fff" />
          <rect x="120" y="155" width="80" height="9" rx="4" fill="#F2ECFF" />
          <rect x="120" y="182" width="80" height="9" rx="4" fill="#fff" />
          <rect x="120" y="128" width="9" height="63" rx="4" fill="#fff" />
        </g>
      </svg>
    </div>
  );
}
