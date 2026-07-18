"use client";

import { type ReactNode, useMemo } from "react";

/**
 * Kinetic text utilities.
 *
 * Splits a string into per-character or per-word spans with stable keys so
 * GSAP/ScrollTrigger can animate them independently. Each span is
 * `.split-char` / `.split-word` (defined in globals.css) with inline-block.
 */

export function SplitChars({
  text,
  className,
}: {
  text: string;
  className?: string;
}): ReactNode {
  const chars = useMemo(() => Array.from(text), [text]);
  return (
    <span className={className} aria-label={text}>
      {chars.map((ch, i) => (
        <span
          key={`${i}-${ch}`}
          className="split-char"
          aria-hidden="true"
          style={{ willChange: "transform, opacity" }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

export function SplitWords({
  text,
  className,
}: {
  text: string;
  className?: string;
}): ReactNode {
  const words = useMemo(() => text.split(" "), [text]);
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={`${i}-${w}`} className="split-word" aria-hidden="true">
          {w}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}
