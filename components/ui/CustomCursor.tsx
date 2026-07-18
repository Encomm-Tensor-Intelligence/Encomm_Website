"use client";

import { useEffect, useRef, useState } from "react";
import { useMotion } from "@/components/motion/MotionProvider";
import { useReducedMotion, useIsTouch } from "@/lib/motion/use-scroll-state";

/**
 * CustomCursor — refined desktop-only cursor.
 *
 * Central dot (instant) + delayed orbiting ring + context label.
 * Reads element data-cursor attributes ("VIEW", "OPEN", "DRAG", "EXPLORE")
 * to swap the label. Disabled on touch / reduced motion / low quality.
 *
 * Never hides the native cursor until the custom cursor is rendered and ready
 * (the body.cursor-ready class is added in a microtask after first paint).
 */
export default function CustomCursor() {
  const reduced = useReducedMotion();
  const touch = useIsTouch();
  const { quality } = useMotion();
  const [ready, setReady] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const target = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (reduced || touch || quality === "low") return;

    const raf = (t: number) => {
      void t;
      rafId = requestAnimationFrame(raf);
      // dot follows instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${target.current.x - 3}px, ${target.current.y - 3}px)`;
      }
      // ring lags
      ring.current.x += (target.current.x - ring.current.x) * 0.16;
      ring.current.y += (target.current.y - ring.current.y) * 0.16;
      if (ringRef.current) {
        const s = active ? 56 : 34;
        ringRef.current.style.width = `${s}px`;
        ringRef.current.style.height = `${s}px`;
        ringRef.current.style.transform = `translate(${ring.current.x - s / 2}px, ${ring.current.y - s / 2}px)`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate(${ring.current.x + 22}px, ${ring.current.y + 14}px)`;
      }
    };

    let rafId = requestAnimationFrame(raf);

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      // context detection
      const el = (e.target as HTMLElement)?.closest?.("[data-cursor]");
      const newLabel = el?.getAttribute("data-cursor") ?? null;
      if (newLabel !== label) setLabel(newLabel);
      const isInteractive = !!(
        el ??
        (e.target as HTMLElement)?.closest?.("a, button, input, textarea, select, [tabindex]")
      );
      if (isInteractive !== active) setActive(isInteractive);
    };

    const onDown = () => document.body.classList.add("cursor-down");
    const onUp = () => document.body.classList.remove("cursor-down");

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    // mark ready (hides native cursor via CSS)
    const ready = window.setTimeout(() => {
      setReady(true);
      document.body.classList.add("cursor-ready", "cursor-custom");
    }, 60);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.clearTimeout(ready);
      document.body.classList.remove("cursor-ready", "cursor-custom");
    };
  }, [reduced, touch, quality, active, label]);

  if (reduced || touch || quality === "low" || !ready) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      {label ? (
        <div ref={labelRef} className="cursor-label" aria-hidden="true">
          {label}
        </div>
      ) : null}
    </>
  );
}
