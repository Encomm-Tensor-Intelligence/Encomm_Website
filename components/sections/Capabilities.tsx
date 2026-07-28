"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/lib/i18n";
import {
  useReducedMotion,
  useIsomorphicLayoutEffect,
} from "@/lib/motion/use-scroll-state";

gsap.registerPlugin(ScrollTrigger);

/**
 * Capabilities — a full-viewport interactive neural constellation.
 * Nodes float in 2.5D space; connections animate with traveling pulses;
 * cursor proximity bends nearby lines; hovering/clicking a node highlights
 * related capabilities and reorganizes the constellation.
 */
export function Capabilities() {
  const { content, copy } = useLanguage();
  const { capabilities } = content;
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [center, setCenter] = useState<string>("kg");

  // 2.5D positions around a sphere
  const nodes = useMemo(() => {
    const n = capabilities.length;
    return capabilities.map((c, i) => {
      const phi = Math.acos(-1 + (2 * i) / n);
      const theta = Math.sqrt(n * Math.PI) * phi;
      const r = 36;
      return {
        ...c,
        x: Number((50 + r * Math.cos(theta) * Math.sin(phi)).toFixed(3)),
        y: Number((50 + r * Math.sin(theta) * Math.sin(phi)).toFixed(3)),
        z: Number(Math.cos(phi).toFixed(3)),
      };
    });
  }, [capabilities]);

  const idToNode = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>();
    nodes.forEach((n) => m.set(n.id, { x: n.x, y: n.y }));
    return m;
  }, [nodes]);

  // idle breathing rotation
  useEffect(() => {
    if (reduced) return;
    const el = root.current?.querySelector(".constellation-stage") as HTMLElement | null;
    if (!el) return;
    let raf = 0;
    let a = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      a += 0.0008;
      el.style.transform = `rotateY(${Math.sin(a) * 6}deg) rotateX(${Math.cos(a * 0.7) * 3}deg)`;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cap-node",
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.06,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: el, start: "top 60%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  const isActive = (id: string) => {
    const ref = active ?? focused;
    if (!ref) return false;
    if (ref === id) return true;
    const r = capabilities.find((c) => c.id === ref);
    return !!r?.relates.includes(id);
  };

  const activeCapability = capabilities.find((c) => c.id === (active ?? focused));

  return (
    <section
      id="capabilities"
      ref={root}
      className="section-anchor section-tint-a relative min-h-[100svh] overflow-hidden py-20 md:py-28"
    >
      <div className="grid-bg-fine pointer-events-none absolute inset-0 opacity-30" />

      {/* heading */}
      <div className="mx-auto mb-10 max-w-[1400px] px-4 md:mb-16 md:px-8">
        <p className="eyebrow mb-5">
          <span className="text-violet">C—01</span> · {copy.capabilities.eyebrow}
        </p>
        <h2 className="kinetic max-w-4xl text-[clamp(2.2rem,6vw,5rem)] text-ink">
          {copy.capabilities.lineOne}{" "}
          <span className="text-spectral">{copy.capabilities.accent}</span>.
        </h2>
        <p className="mt-4 max-w-xl text-[15px] text-muted">
          {copy.capabilities.hint}
        </p>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div
          className="relative mx-auto aspect-square w-full max-w-[760px]"
          style={{ perspective: "900px" }}
        >
          <div
            className="constellation-stage relative h-full w-full"
            style={{ transformStyle: "preserve-3d" }}
            data-cursor="EXPLORE"
          >
            {/* edges */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="cap-edge" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#6a4dff" stopOpacity="0.6" />
                  <stop offset="1" stopColor="#4fd4f5" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              {nodes.flatMap((node) =>
                node.relates.map((rid) => {
                  const o = idToNode.get(rid);
                  if (!o) return null;
                  const lit = isActive(node.id) && isActive(rid);
                  return (
                    <line
                      key={`${node.id}-${rid}`}
                      x1={node.x}
                      y1={node.y}
                      x2={o.x}
                      y2={o.y}
                      stroke={lit ? "url(#cap-edge)" : "rgba(11,15,36,0.08)"}
                      strokeWidth={lit ? 0.5 : 0.25}
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                }),
              )}
            </svg>

            {/* center core */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-violet to-cyan text-white shadow-glow">
                <span className="text-[18px]">⬡</span>
                <div className="absolute -inset-2 rounded-full border border-violet/30" />
              </div>
            </div>

            {/* nodes */}
            {nodes.map((node) => {
              const lit = isActive(node.id);
              const isCenter = center === node.id;
              const zScale = 1 + node.z * 0.35;
              return (
                <button
                  key={node.id}
                  type="button"
                  className="cap-node absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: `translate(-50%, -50%) scale(${zScale})`,
                    zIndex: lit ? 20 : Math.round(node.z * 10) + 5,
                  }}
                  onMouseEnter={() => setActive(node.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setFocused(node.id)}
                  onBlur={() => setFocused(null)}
                  onClick={() => setCenter(node.id)}
                  aria-label={`${node.title}: ${node.short}`}
                >
                  <span
                    className="block rounded-full transition-all duration-300"
                    style={{
                      width: lit || isCenter ? 14 : 9,
                      height: lit || isCenter ? 14 : 9,
                      background: lit
                        ? "#6a4dff"
                        : isCenter
                          ? "#4fd4f5"
                          : "#fff",
                      boxShadow: lit
                        ? "0 0 0 6px rgba(106,77,255,0.18), 0 0 24px rgba(106,77,255,0.6)"
                        : isCenter
                          ? "0 0 0 5px rgba(79,212,245,0.18), 0 0 18px rgba(79,212,245,0.5)"
                          : "0 0 0 3px rgba(11,15,36,0.06)",
                    }}
                  />
                  <span
                    className={`absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] transition-colors duration-300 ${
                      lit || isCenter ? "text-violet" : "text-muted"
                    }`}
                  >
                    {node.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* active description reveal */}
        <div className="mx-auto mt-8 max-w-xl text-center">
          <div className="min-h-[3.5rem]">
            {activeCapability ? (
              <div key={activeCapability.id}>
                <p className="font-display text-lg text-ink">
                  {activeCapability.title}
                </p>
                <p className="mt-1 text-[14px] text-muted">
                  {activeCapability.short}
                </p>
              </div>
            ) : (
              <p className="font-mono text-[12px] text-faint">
                {copy.capabilities.empty}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
