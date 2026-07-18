"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { nav, primaryNavCta } from "@/content/site-content";
import { cn } from "@/lib/cn";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { BrandMark } from "@/components/brand/BrandMark";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Compact nav after scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section detection via IntersectionObserver
  useEffect(() => {
    const ids = [
      ...nav.map((n) => n.href.replace("#", "")),
      "contact",
    ];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(`#${visible[0].target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Lock scroll when mobile menu open + restore on close + Esc + focus trap
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Tab" && menuPanelRef.current) {
        const focusables = menuPanelRef.current.querySelectorAll<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables.length) return;
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
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
    // focus first item
    const t = window.setTimeout(() => firstLinkRef.current?.focus(), 60);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div className="mx-auto max-w-[1320px] px-4 md:px-8">
        <nav
          aria-label="Primary"
          className={cn(
            "relative flex items-center justify-between gap-4 rounded-full border px-3 py-2 pl-4 transition-all duration-500",
            scrolled
              ? "border-line bg-surface/85 shadow-soft backdrop-blur-xl"
              : "border-transparent bg-surface/55 backdrop-blur-md",
          )}
        >
          <Link
            href="#top"
            className="flex items-center gap-2.5 rounded-full"
            aria-label="ENCOMM — home"
          >
            <BrandMark className="h-7 w-7" />
            <span className="font-display text-[17px] font-semibold tracking-[0.18em] text-ink">
              ENCOMM
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const isActive = active === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors duration-300",
                      isActive
                        ? "text-violet"
                        : "text-ink-soft hover:text-ink",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-3 -bottom-0.5 h-px origin-left bg-violet transition-transform duration-300",
                        isActive ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            <MagneticButton href={primaryNavCta.href} variant="primary" size="sm">
              {primaryNavCta.label}
            </MagneticButton>
          </div>

          {/* Mobile menu toggle */}
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

      {/* Mobile menu panel */}
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
        {/* backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-paper/80 backdrop-blur-xl transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        {/* panel */}
        <div
          ref={menuPanelRef}
          className={cn(
            "absolute inset-x-3 top-20 origin-top rounded-[28px] border border-line bg-surface p-3 shadow-lift transition-all duration-300 ease-out",
            open
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-2 scale-95 opacity-0",
          )}
        >
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  ref={item.href === nav[0]?.href ? firstLinkRef : undefined}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-4 py-4 text-ink transition-colors hover:bg-surface-soft"
                >
                  <span className="font-display text-lg">{item.label}</span>
                  <span aria-hidden="true" className="text-faint">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 border-t border-line p-2">
            <Link
              href={primaryNavCta.href}
              onClick={() => setOpen(false)}
              className="flex h-12 items-center justify-center rounded-2xl bg-ink font-display text-sm font-medium text-white"
            >
              {primaryNavCta.label}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
