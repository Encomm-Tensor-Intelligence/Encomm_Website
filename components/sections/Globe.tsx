"use client";

import { useEffect, useMemo, useRef } from "react";
import { trust } from "@/content/site-content";
import {
  useReducedMotion,
  useIsomorphicLayoutEffect,
} from "@/lib/motion/use-scroll-state";
import { motion } from "@/lib/motion/motion-store";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Greece → Global — a bright spherical point-cloud globe with Greece as the
 * origin point and data paths extending outward. Slow orbital rotation.
 * No invented office/client locations — abstract destinations only.
 */

// Deterministic point cloud on a sphere (Fibonacci lattice).
function spherePoints(count: number, radius: number) {
  const pts: { x: number; y: number; z: number }[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push({
      x: Math.cos(theta) * r * radius,
      y: y * radius,
      z: Math.sin(theta) * r * radius,
    });
  }
  return pts;
}

// abstract destination points (no real city claims)
const DESTINATIONS = [
  { lat: 0.35, lon: 0.2 }, // NE
  { lat: -0.15, lon: 1.4 },
  { lat: 0.25, lon: -1.2 },
  { lat: -0.4, lon: 0.8 },
  { lat: 0.5, lon: 2.6 },
  { lat: -0.2, lon: -2.4 },
];

function sphericalToCartesian(lat: number, lon: number, r: number) {
  return {
    x: r * Math.cos(lat) * Math.cos(lon),
    y: r * Math.sin(lat),
    z: r * Math.cos(lat) * Math.sin(lon),
  };
}

export function Globe() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const points = useMemo(() => spherePoints(420, 160), []);
  const greece = useMemo(() => sphericalToCartesian(0.55, 0.45, 160), []);

  // Orbital rotation + scroll-driven path extension.
  useEffect(() => {
    if (reduced) return;
    const stage = stageRef.current;
    if (!stage) return;
    let raf = 0;
    let ry = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      ry += 0.0016;
      stage.style.transform = `rotateY(${ry}rad)`;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  // cursor parallax tilt
  useEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;
    const raf = () => {
      requestAnimationFrame(raf);
      const cx = motion.cursorX;
      const cy = motion.cursorY;
      el.style.setProperty("--tilt-x", `${cy * -6}deg`);
      el.style.setProperty("--tilt-y", `${cx * 8}deg`);
    };
    const id = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(id);
  }, [reduced]);

  // reveal text
  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".globe-path",
        { strokeDashoffset: 400 },
        {
          strokeDashoffset: 0,
          duration: 1.5,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 60%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="company"
      ref={root}
      className="section-anchor relative overflow-hidden py-20 md:py-32"
      style={
        {
          "--tilt-x": "0deg",
          "--tilt-y": "0deg",
        } as React.CSSProperties
      }
    >
      <div className="spectral-wash pointer-events-none absolute inset-0 opacity-60" />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-4 md:px-8 lg:grid-cols-2 lg:gap-16">
        {/* left text */}
        <div>
          <p className="eyebrow mb-5">
            <span className="text-violet">G—01</span> · Greece → Global
          </p>
          <h2 className="kinetic text-[clamp(2.4rem,6vw,5rem)] text-ink">
            <span className="block">Built in Greece.</span>
            <span className="block text-spectral">Designed for the world.</span>
          </h2>
          <p className="mt-7 max-w-md text-[16px] leading-relaxed text-muted">
            {trust.copy}
          </p>
          <ul className="mt-8 space-y-3">
            {trust.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[15px] text-ink-soft">
                <span
                  aria-hidden="true"
                  className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-violet to-cyan"
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 font-mono text-[11px] text-faint">
            ◦ Recognized member of Elevate Greece
          </p>
        </div>

        {/* right globe */}
        <div
          className="relative mx-auto aspect-square w-full max-w-[520px]"
          style={{
            transform: `rotateX(var(--tilt-x)) rotateY(var(--tilt-y))`,
            perspective: "1200px",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            ref={stageRef}
            className="relative h-full w-full"
            style={{ transformStyle: "preserve-3d" }}
            data-cursor="EXPLORE"
          >
            {/* SVG point cloud globe */}
            <svg
              viewBox="-200 -200 400 400"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="globe-core" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0" stopColor="#6a4dff" stopOpacity="0.3" />
                  <stop offset="1" stopColor="#6a4dff" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="globe-path-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#6a4dff" stopOpacity="0.9" />
                  <stop offset="1" stopColor="#4fd4f5" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              {/* inner glow */}
              <circle cx="0" cy="0" r="170" fill="url(#globe-core)" />
              {/* meridian rings */}
              {[60, 110, 160].map((r) => (
                <ellipse
                  key={r}
                  cx="0"
                  cy="0"
                  rx={r}
                  ry={r * 0.32}
                  fill="none"
                  stroke="rgba(11,15,36,0.08)"
                  strokeWidth="0.5"
                />
              ))}

              {/* point cloud */}
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={Number(p.x.toFixed(2))}
                  cy={Number(p.y.toFixed(2))}
                  r={p.z > 0 ? 1.4 : 0.7}
                  fill={p.z > 0 ? "#6a4dff" : "rgba(11,15,36,0.18)"}
                  opacity={p.z > 0 ? 0.7 : 0.3}
                />
              ))}

              {/* Greece origin */}
              <circle cx={Number(greece.x.toFixed(2))} cy={Number(greece.y.toFixed(2))} r="4" fill="#6a4dff" />
              <circle
                cx={greece.x}
                cy={greece.y}
                r="8"
                fill="none"
                stroke="#6a4dff"
                strokeWidth="1"
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  values="6;14;6"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;0;0.6"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* paths from Greece to abstract destinations */}
              {DESTINATIONS.map((d, i) => {
                const end = sphericalToCartesian(d.lat, d.lon, 160);
                const midX = Number(((greece.x + end.x) / 2).toFixed(2));
                const midY = Number((Math.min(greece.y, end.y) - 30).toFixed(2));
                const gx = Number(greece.x.toFixed(2));
                const gy = Number(greece.y.toFixed(2));
                const ex = Number(end.x.toFixed(2));
                const ey = Number(end.y.toFixed(2));
                return (
                  <path
                    key={i}
                    className="globe-path"
                    d={`M ${gx} ${gy} Q ${midX} ${midY} ${ex} ${ey}`}
                    fill="none"
                    stroke="url(#globe-path-grad)"
                    strokeWidth="1"
                    strokeDasharray="400"
                  />
                );
              })}
              {/* destination dots */}
              {DESTINATIONS.map((d, i) => {
                const end = sphericalToCartesian(d.lat, d.lon, 160);
                return (
                  <circle
                    key={`d-${i}`}
                    cx={Number(end.x.toFixed(2))}
                    cy={Number(end.y.toFixed(2))}
                    r="2.5"
                    fill="#4fd4f5"
                  />
                );
              })}
            </svg>
          </div>

          {/* caption */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between rounded-xl border border-line bg-white/70 px-3 py-2 backdrop-blur">
            <div className="leading-tight">
              <div className="text-[12px] font-medium text-ink">ENCOMM</div>
              <div className="font-mono text-[9px] text-faint">
                Athens · Greece → Global
              </div>
            </div>
            <span className="chip">Elevate Greece · member</span>
          </div>
        </div>
      </div>
    </section>
  );
}
