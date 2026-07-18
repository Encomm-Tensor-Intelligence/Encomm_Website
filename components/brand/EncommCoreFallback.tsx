"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/motion-safe";

gsap.registerPlugin(ScrollTrigger);

/**
 * EncommCoreFallback
 *
 * Polished SVG/CSS fallback shown when WebGL is unavailable, on mobile
 * performance budget, or under prefers-reduced-motion (no scroll opening).
 * It mirrors the procedural crystal metaphor and rotates very gently.
 */
export default function EncommCoreFallback({
  className,
}: {
  className?: string;
}) {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = wrapRef.current;
    const core = coreRef.current;
    if (!el || !core) return;

    // gentle continuous rotation
    const tl = gsap.to(core, {
      rotateZ: 360,
      duration: 60,
      ease: "none",
      repeat: -1,
      transformOrigin: "160px 160px",
    });

    // slight parallax via scroll
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        gsap.to(core, {
          y: (self.progress - 0.5) * -24,
          duration: 0.4,
          overwrite: "auto",
        });
      },
    });

    return () => {
      tl.kill();
      st.kill();
    };
  }, [reduced]);

  return (
    <div
      ref={wrapRef}
      className={`core-fallback relative flex items-center justify-center overflow-hidden rounded-[36px] ${className ?? ""}`}
      aria-hidden="true"
    >
      {/* Soft spectral wash */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 45%, rgba(114,92,255,0.16), transparent 70%), radial-gradient(45% 40% at 30% 30%, rgba(102,215,245,0.12), transparent 70%), radial-gradient(45% 40% at 72% 70%, rgba(231,168,245,0.12), transparent 70%)",
        }}
      />
      {/* spatial grid */}
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />

      <svg
        viewBox="0 0 320 320"
        className="relative h-[78%] w-[78%]"
        role="presentation"
      >
        <defs>
          <linearGradient id="fb-violet" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#A07BFF" />
            <stop offset="1" stopColor="#5E48D6" />
          </linearGradient>
          <linearGradient id="fb-lilac" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#E4CFFF" />
            <stop offset="1" stopColor="#B79BFF" />
          </linearGradient>
          <linearGradient id="fb-cyan" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#66D7F5" />
            <stop offset="1" stopColor="#9BE7FB" />
          </linearGradient>
          <linearGradient id="fb-magenta" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#E7A8F5" />
            <stop offset="1" stopColor="#C088E8" />
          </linearGradient>
        </defs>

        <g ref={coreRef}>
          {/* hex crystal */}
          <polygon
            points="160,30 270,90 270,230 160,290 50,230 50,90"
            fill="url(#fb-violet)"
            opacity="0.96"
          />
          <polygon points="160,30 270,90 160,160" fill="url(#fb-lilac)" />
          <polygon points="270,90 270,230 160,160" fill="#7C66E8" />
          <polygon
            points="270,230 160,290 160,160"
            fill="url(#fb-magenta)"
            opacity="0.92"
          />
          <polygon points="160,290 50,230 160,160" fill="#5E48D6" />
          <polygon points="50,230 50,90 160,160" fill="#6E54D6" />
          <polygon
            points="50,90 160,30 160,160"
            fill="url(#fb-cyan)"
            opacity="0.92"
          />

          {/* E structure */}
          <rect x="120" y="128" width="80" height="10" rx="5" fill="#FFFFFF" />
          <rect x="120" y="155" width="80" height="10" rx="5" fill="#F2ECFF" />
          <rect x="120" y="182" width="80" height="10" rx="5" fill="#FFFFFF" />
          <rect x="120" y="128" width="10" height="64" rx="5" fill="#FFFFFF" />

          {/* data line accents */}
          <line
            x1="160"
            y1="160"
            x2="270"
            y2="90"
            stroke="#FFFFFF"
            strokeWidth="1"
            opacity="0.4"
          />
          <line
            x1="160"
            y1="160"
            x2="50"
            y2="90"
            stroke="#FFFFFF"
            strokeWidth="1"
            opacity="0.4"
          />
          <line
            x1="160"
            y1="160"
            x2="270"
            y2="230"
            stroke="#FFFFFF"
            strokeWidth="1"
            opacity="0.4"
          />
          <line
            x1="160"
            y1="160"
            x2="50"
            y2="230"
            stroke="#FFFFFF"
            strokeWidth="1"
            opacity="0.4"
          />
        </g>

        {/* orbiting particle dots (decorative) */}
        <g opacity="0.7">
          <circle cx="40" cy="160" r="3" fill="#66D7F5" />
          <circle cx="280" cy="160" r="3" fill="#C9AEFF" />
          <circle cx="160" cy="20" r="2.4" fill="#E7A8F5" />
          <circle cx="160" cy="300" r="2.4" fill="#9BE7FB" />
        </g>
      </svg>

      {/* contact shadow */}
      <div
        aria-hidden="true"
        className="absolute bottom-[12%] h-3 w-[55%] rounded-full bg-ink/20 blur-2xl"
      />
    </div>
  );
}
