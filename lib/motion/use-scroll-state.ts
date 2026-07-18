"use client";

/**
 * Motion hooks for the LIVING INTELLIGENCE experience.
 *
 * Per-frame data (scroll, velocity, cursor) lives in lib/motion/motion-store
 * as a mutable singleton — read it inside rAF / useFrame loops. This file
 * holds the React-facing hooks (reduced motion, client detection, etc.).
 */

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { motion, setMotion } from "@/lib/motion/motion-store";

/* ------------------------------------------------------------------ */
/*  Media query detection (SSR-safe)                                  */
/* ------------------------------------------------------------------ */

function subscribeMedia(query: string, cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(query);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (cb) => subscribeMedia("(prefers-reduced-motion: reduce)", cb),
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export function useIsTouch(): boolean {
  return useSyncExternalStore(
    (cb) => subscribeMedia("(pointer: coarse)", cb),
    () => window.matchMedia("(pointer: coarse)").matches,
    () => false,
  );
}

export function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ------------------------------------------------------------------ */
/*  Element scroll progress (0..1)                                    */
/* ------------------------------------------------------------------ */

/**
 * useSectionProgress — 0..1 progress of an element traveling through the
 * viewport. Reads via a single rAF-throttled scroll listener; also writes
 * the active section to the motion store when used with an id.
 */
export function useSectionProgress<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
): number {
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = r.height + vh;
      const traveled = vh - r.top;
      const raw = total <= 0 ? 0 : traveled / total;
      setP(Math.min(1, Math.max(0, raw)));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);

  return p;
}

/* ------------------------------------------------------------------ */
/*  Active section observer — writes to motion store + React state    */
/* ------------------------------------------------------------------ */

export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    if (!ids.length) return;
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const id = visible[0].target.id;
          setActive(id);
          setMotion({ activeSection: id });
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.2, 0.5, 1] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  return active;
}

/* ------------------------------------------------------------------ */
/*  Magnetic interaction                                              */
/* ------------------------------------------------------------------ */

export function useMagnetic<T extends HTMLElement>(strength = 0.3) {
  const ref = useRef<T | null>(null);
  const reduced = useReducedMotion();
  const touch = useIsTouch();

  useEffect(() => {
    if (reduced || touch) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };
    const onLeave = () => {
      el.style.transform = "translate(0,0)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced, touch, strength]);

  return ref;
}

/** Convenience: read the live motion store in any component. */
export function useMotionStore() {
  return motion;
}
