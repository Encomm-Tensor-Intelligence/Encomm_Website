"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/motion-safe";

gsap.registerPlugin(ScrollTrigger);

type RevealVariant = "fade-up" | "fade" | "line-mask" | "scale-in";

type RevealProps = {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  stagger?: number;
  /** trigger when this element enters viewport; default "top 85%" */
  start?: string;
};

/**
 * Reveal — restrained scroll-triggered entrance.
 *
 * Variants:
 *  - fade-up     opacity + y(24px) -> 0
 *  - fade        opacity only
 *  - line-mask   animates .line-inner children; translateY(110%) -> 0
 *  - scale-in    opacity + scale(0.96) -> 1
 *
 * Respects prefers-reduced-motion (renders content visible immediately).
 */
export function Reveal({
  children,
  className,
  variant = "fade-up",
  delay = 0,
  stagger = 0.06,
  start = "top 85%",
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const fromVars =
        variant === "fade-up"
          ? { y: 24, opacity: 0 }
          : variant === "scale-in"
            ? { scale: 0.96, opacity: 0 }
            : { opacity: 0 };

      const toVars =
        variant === "fade-up" || variant === "scale-in"
          ? { y: 0, scale: 1, opacity: 1 }
          : { opacity: 1 };

      if (variant === "line-mask") {
        const targets = el.querySelectorAll<HTMLElement>(".line-inner");
        if (!targets.length) return;
        gsap.fromTo(
          targets,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 0.9,
            ease: "power4.out",
            stagger,
            delay,
            immediateRender: false,
            scrollTrigger: { trigger: el, start },
          },
        );
        return;
      }

      // fromTo with immediateRender:false so content stays visible until
      // ScrollTrigger takes over — progressive enhancement that degrades
      // gracefully if ScrollTrigger never fires.
      gsap.fromTo(el, fromVars, {
        ...toVars,
        duration: 0.85,
        ease: "power3.out",
        delay,
        immediateRender: false,
        scrollTrigger: { trigger: el, start },
      });
    }, el);

    // Safety: ensure ScrollTrigger recalculates after this effect runs so
    // elements already in viewport reveal promptly.
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [variant, delay, stagger, start, reduced]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * LineMask — wraps text in an overflow:hidden container with an inner span
 * that Reveal (variant="line-mask") animates.
 */
export function LineMask({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`line-mask ${className ?? ""}`}>
      <span className="line-inner">{children}</span>
    </span>
  );
}
