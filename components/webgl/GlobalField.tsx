"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useMotion } from "@/components/motion/MotionProvider";
import { useIsClient, useReducedMotion } from "@/lib/motion/use-scroll-state";

const IntelligenceField = dynamic(() => import("./IntelligenceField"), {
  ssr: false,
});

/**
 * GlobalField — the persistent intelligence field behind the whole page.
 *
 * One fixed full-viewport canvas. Quality-gated; lazy-mounted after first
 * paint so the HTML renders first. Under reduced motion or "low" quality we
 * show a lightweight CSS fallback instead of WebGL.
 *
 * pointer-events:none so it never blocks interaction.
 */
export default function GlobalField() {
  const mounted = useIsClient();
  const reduced = useReducedMotion();
  const { quality } = useMotion();
  const [shown, setShown] = useState(false);

  // Defer mount until after first paint + a short idle.
  useEffect(() => {
    if (!mounted) return;
    if (reduced) return;
    const t = window.setTimeout(() => setShown(true), 80);
    return () => window.clearTimeout(t);
  }, [mounted, reduced]);

  // Pause when tab hidden (the canvas is fixed but offscreen when tab hidden).
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const useWebGL = shown && !reduced && quality !== "low";

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1]"
      aria-hidden="true"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s" }}
    >
      {useWebGL ? (
        <IntelligenceField quality={quality} />
      ) : (
        <FieldFallback />
      )}
    </div>
  );
}

/** Lightweight CSS fallback — soft floating dots + grid. No WebGL. */
function FieldFallback() {
  return (
    <div className="absolute inset-0">
      <div className="grid-bg-fine absolute inset-0 opacity-40" />
      <div className="spectral-wash absolute inset-0 opacity-70" />
      {/* a handful of static glowing dots */}
      {[
        { x: 18, y: 22, c: "var(--color-violet)", s: 4 },
        { x: 82, y: 30, c: "var(--color-cyan)", s: 3 },
        { x: 70, y: 78, c: "var(--color-magenta)", s: 4 },
        { x: 28, y: 70, c: "var(--color-lilac)", s: 3 },
        { x: 50, y: 50, c: "var(--color-violet)", s: 5 },
      ].map((d, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.s,
            height: d.s,
            background: d.c,
            filter: "blur(1px)",
            opacity: 0.5,
            boxShadow: `0 0 20px 4px ${d.c}`,
          }}
        />
      ))}
    </div>
  );
}
