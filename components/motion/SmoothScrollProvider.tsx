"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/motion-safe";

/**
 * SmoothScrollProvider
 *
 * Initializes Lenis smooth scrolling and keeps it in sync with the
 * GSAP ScrollTrigger ticker so scroll-bound animations stay accurate even
 * when the user scrolls quickly. Disabled entirely under prefers-reduced-motion
 * (Lenis is not started; native scrolling used).
 *
 * The site remains fully usable without this — Lenis only enhances.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      // Do not hijack anchor navigation; we keep native anchor scrolling.
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onRaf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger once fonts and layout settle.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const refreshTimer = window.setTimeout(refresh, 400);

    return () => {
      gsap.ticker.remove(onRaf);
      lenis.destroy();
      window.removeEventListener("load", refresh);
      window.clearTimeout(refreshTimer);
    };
  }, [reduced]);

  return <>{children}</>;
}
