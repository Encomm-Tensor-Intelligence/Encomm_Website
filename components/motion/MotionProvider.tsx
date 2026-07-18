"use client";

/* eslint-disable react-hooks/set-state-in-effect --
 * MotionProvider sets one-time readiness/quality flags after Lenis and
 * cursor listeners attach. These are initialization signals, not cascading
 * state updates driven by render. */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion, useIsClient } from "@/lib/motion/use-scroll-state";
import { setMotion } from "@/lib/motion/motion-store";

/* ------------------------------------------------------------------ */
/*  Smooth scroll (Lenis) — synced to GSAP ticker                     */
/* ------------------------------------------------------------------ */

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  React-facing coarse state                                         */
/* ------------------------------------------------------------------ */

type MotionContextValue = {
  ready: boolean;
  reduced: boolean;
  quality: "high" | "medium" | "low";
};

const MotionContext = createContext<MotionContextValue>({
  ready: false,
  reduced: false,
  quality: "medium",
});

export function useMotion(): MotionContextValue {
  return useContext(MotionContext);
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const mounted = useIsClient();
  const [quality, setQuality] = useState<"high" | "medium" | "low">("medium");
  const [ready, setReady] = useState(false);

  // Quality detection once after mount.
  useEffect(() => {
    if (!mounted) return;
    if (reduced) {
      setQuality("low");
      setMotion({ quality: "low" });
      return;
    }
    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(
      ua,
    );
    const cores = navigator.hardwareConcurrency ?? 8;
    const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 8;
    const q: "high" | "medium" | "low" = isMobile
      ? "low"
      : cores <= 4 || mem <= 4
        ? "medium"
        : "high";
    setQuality(q);
    setMotion({ quality: q });
  }, [mounted, reduced]);

  // Lenis + scroll/velocity tracking → write to the motion store.
  useEffect(() => {
    if (reduced) {
      const onScroll = () => {
        const y = window.scrollY;
        const max = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        setMotion({ progress: Math.min(1, Math.max(0, y / max)) });
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      setReady(true);
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    let lastY = 0;
    let vel = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const progress = Math.min(1, Math.max(0, y / max));
      const instant = Math.abs(y - lastY);
      vel = vel * 0.82 + instant * 0.18;
      setMotion({ progress, velocity: vel });
      lastY = y;
      ScrollTrigger.update();
    };
    lenis.on("scroll", onScroll);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t1 = window.setTimeout(refresh, 300);
    const t2 = window.setTimeout(refresh, 1200);

    setReady(true);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      window.removeEventListener("load", refresh);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [reduced]);

  // Cursor tracking (desktop only) → write to the motion store.
  useEffect(() => {
    if (reduced) return;
    if (mounted && window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      setMotion({
        cursorPX: e.clientX / w,
        cursorPY: e.clientY / h,
        cursorX: (e.clientX / w) * 2 - 1,
        cursorY: (e.clientY / h) * 2 - 1,
        cursorInside: true,
      });
    };
    const onLeave = () => setMotion({ cursorInside: false });
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced, mounted]);

  const value = useMemo<MotionContextValue>(
    () => ({ ready, reduced, quality }),
    [ready, reduced, quality],
  );

  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  );
}
