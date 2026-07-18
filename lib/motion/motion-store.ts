"use client";

/**
 * motion-store — a singleton mutable store for per-frame motion data.
 *
 * The DOM/R3F write side updates `motion` every frame. Consumers read it
 * inside their own rAF / useFrame loops WITHOUT causing React re-renders.
 *
 * React-facing consumers that need coarse values (e.g. quality tier) read
 * those through MotionProvider context instead.
 */

export type MotionData = {
  /** Page scroll progress 0..1. */
  progress: number;
  /** Smoothed absolute scroll velocity (px/frame-ish). */
  velocity: number;
  /** Cursor normalized to -1..1, origin = viewport center. */
  cursorX: number;
  cursorY: number;
  /** Cursor normalized 0..1 (pixel space). */
  cursorPX: number;
  cursorPY: number;
  cursorInside: boolean;
  /** Active section id (without #). */
  activeSection: string;
  /** WebGL quality tier. */
  quality: "high" | "medium" | "low";
};

export const motion: MotionData = {
  progress: 0,
  velocity: 0,
  cursorX: 0,
  cursorY: 0,
  cursorPX: 0.5,
  cursorPY: 0.5,
  cursorInside: false,
  activeSection: "top",
  quality: "medium",
};

export function setMotion(patch: Partial<MotionData>): void {
  Object.assign(motion, patch);
}
