"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { nav, primaryNavCta } from "@/content/site-content";
import { cn } from "@/lib/cn";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { BrandMark } from "@/components/brand/BrandMark";
import {
  useActiveSection,
  useReducedMotion,
} from "@/lib/motion/use-scroll-state";
import { motion } from "@/lib/motion/motion-store";

const SECTION_IDS = [
  "top",
  "systems",
  "capabilities",
  "use-cases",
  "approach",
  "company",
  "contact",
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const [progress, setProgress] = useState(0);

  // Compact after scroll + page progress for the nav progress line.
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: scroll lock, focus trap, Esc.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])',
        );
        if (!f.length) return;
        const first = f[0]!;
        const last = f[f.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => firstLinkRef.current?.focus(), 80);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "py-2.5" : "py-4",
        )}
      >
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <nav
            aria-label="Primary"
            data-cursor="EXPLORE"
            className={cn(
              "relative flex items-center justify-between gap-3 rounded-full border px-3 py-2 pl-3 transition-all duration-500",
              scrolled
                ? "border-line bg-frost shadow-soft backdrop-blur-xl"
                : "border-line/60 bg-frost/60 backdrop-blur-md",
            )}
          >
            {/* progress line at the top edge of the nav */}
            <div
              aria-hidden="true"
              className="absolute inset-x-3 top-0 h-px overflow-hidden rounded-full"
            >
              <div
                className="h-full origin-left data-line transition-transform duration-150"
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>

            <Link
              href="#top"
              className="flex items-center gap-2.5 rounded-full"
              aria-label="ENCOMM — back to top"
            >
              <span className="relative">
                <BrandMark className="h-7 w-7" />
                <span
                  className="absolute -inset-1 -z-10 rounded-full opacity-60 blur-md"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(106,77,255,0.5), transparent 70%)",
                  }}
                  aria-hidden="true"
                />
              </span>
              <span className="font-display text-[15px] font-semibold tracking-[0.2em] text-ink">
                ENCOMM
              </span>
            </Link>

            {/* Desktop nav with magnetic indicators */}
            <ul className="hidden items-center gap-0.5 md:flex">
              {nav.map((item) => {
                const id = item.href.replace("#", "");
                const isActive = active === id;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "relative rounded-full px-3.5 py-2 text-[13px] font-medium transition-all duration-300",
                        isActive
                          ? "text-violet"
                          : "text-ink-soft hover:text-ink",
                      )}
                      data-cursor={isActive ? undefined : "VIEW"}
                    >
                      <span className="relative z-10">{item.label}</span>
                      {isActive ? (
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full bg-violet/10 ring-1 ring-violet/25"
                          style={{ animation: "navPulse 2s ease-in-out infinite" }}
                        />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="hidden items-center md:flex">
              <MagneticButton href={primaryNavCta.href} variant="primary" size="sm">
                {primaryNavCta.label}
              </MagneticButton>
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span className="sr-only">Menu</span>
              <div className="relative h-3 w-4">
                <span
                  className={cn(
                    "absolute left-0 block h-0.5 w-4 bg-ink transition-all duration-300",
                    open ? "top-1.5 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-1.5 block h-0.5 w-4 bg-ink transition-all duration-300",
                    open ? "opacity-0" : "opacity-100",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-0.5 w-4 bg-ink transition-all duration-300",
                    open ? "top-1.5 -rotate-45" : "top-3",
                  )}
                />
              </div>
            </button>
          </nav>
        </div>
        <style>{`@keyframes navPulse { 0%,100% { opacity: 1 } 50% { opacity: 0.6 } }`}</style>
      </header>

      {/* Mobile full-screen menu — shares the particle aesthetic */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={cn(
          "fixed inset-0 z-40 md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
          style={{
            background:
              "radial-gradient(80% 60% at 50% 30%, rgba(244,246,252,0.92), rgba(238,241,251,0.96))",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        />
        {/* faint particle dots */}
        {reduced ? null : (
          <div className="pointer-events-none absolute inset-0 opacity-50">
            <div className="grid-bg-fine absolute inset-0" />
          </div>
        )}
        <div
          ref={panelRef}
          className={cn(
            "relative flex h-full flex-col justify-center px-6 transition-all duration-500",
            open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          <p className="eyebrow mb-8 text-center">ENCOMM · ENTERPRISE AI</p>
          <ul className="flex flex-col">
            {nav.map((item, i) => (
              <li key={item.href}>
                <Link
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between border-b border-line py-5"
                >
                  <span className="font-display text-3xl text-ink transition-colors group-hover:text-violet">
                    {item.label}
                  </span>
                  <span className="font-mono text-[11px] text-faint">
                    0{i + 1}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Link
              href={primaryNavCta.href}
              onClick={() => setOpen(false)}
              className="flex h-13 items-center justify-center rounded-full bg-ink font-display text-sm font-medium text-white"
            >
              {primaryNavCta.label}
            </Link>
          </div>
        </div>
      </div>

      {/* tiny live coord readout — bottom-left, desktop only */}
      <div className="pointer-events-none fixed bottom-4 left-4 z-40 hidden md:block">
        <div className="coord glass rounded-md px-2 py-1">
          <div>SEC · {motion.activeSection.toUpperCase()}</div>
          <div>SCROLL · {(progress * 100).toFixed(0)}%</div>
        </div>
      </div>
    </>
  );
}
