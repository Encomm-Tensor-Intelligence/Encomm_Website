"use client";

import { useEffect, useLayoutEffect, useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * useReducedMotion — SSR-safe, uses useSyncExternalStore to subscribe to the
 * user's prefers-reduced-motion setting without cascading renders.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getServerSnapshot,
  );
}

/**
 * useIsClient — true only after hydration. Used to gate WebGL and other
 * client-only features to avoid SSR mismatch.
 */
export function useIsClient(): boolean {
  // useSyncExternalStore with a no-op subscription + differing server/client
  // snapshots is the canonical "mounted?" hook in React 19.
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/**
 * useIsomorphicLayoutEffect — useLayoutEffect on the client, useEffect on
 * the server. Avoids SSR warnings for layout-effect-driven animation setup.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
