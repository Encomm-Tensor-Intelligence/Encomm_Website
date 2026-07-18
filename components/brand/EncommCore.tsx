"use client";

import { Suspense, lazy, useEffect, useRef, useState } from "react";
import EncommCoreFallback from "./EncommCoreFallback";
import { useReducedMotion, useIsClient } from "@/lib/motion-safe";

/**
 * Lazy-load the Three.js scene. Split into its own chunk so the rest of the
 * page can load and render before the ~three.js bundle hydrates.
 */
const EncommCore3D = lazy(() => import("./EncommCore3D"));

/**
 * Feature detection for a usable WebGL2 context.
 */
function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    return !!gl && typeof (gl as WebGLRenderingContext).getParameter === "function";
  } catch {
    return false;
  }
}

/**
 * Mobile detection — used to lower particle counts and DPR. Conservative:
 * falls back to "mobile" when CPU cores / memory hint at a weak device.
 */
function isMobileQuality(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  const isMobileUA = /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(ua);
  const lowMem =
    typeof (navigator as unknown as { deviceMemory?: number }).deviceMemory ===
      "number" &&
    (navigator as unknown as { deviceMemory?: number }).deviceMemory! <= 4;
  const lowCores =
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency <= 4;
  return isMobileUA || (lowMem && lowCores);
}

export default function EncommCore({ className }: { className?: string }) {
  const mounted = useIsClient();
  const reduced = useReducedMotion();
  const [supports, setSupports] = useState<boolean | null>(null);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  // Only resolve WebGL support after mount and only when in view.
  useEffect(() => {
    if (!mounted) return;
    // Respect reduced motion: skip WebGL detection entirely (fallback shows).
    if (reduced) return;
    // Observe hero visibility before initializing
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            setSupports(hasWebGL());
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted, reduced]);

  const show3D = supports === true && inView && !reduced;
  const quality: "full" | "mobile" = isMobileQuality() ? "mobile" : "full";

  return (
    <div ref={containerRef} className={className} aria-hidden="true">
      {show3D ? (
        <Suspense fallback={<FallbackView className="h-full w-full" />}>
          <EncommCore3D progressRef={progressRef} quality={quality} />
        </Suspense>
      ) : (
        <FallbackView className="h-full w-full" />
      )}
    </div>
  );
}

function FallbackView({ className }: { className?: string }) {
  return <EncommCoreFallback className={className} />;
}
