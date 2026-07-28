"use client";

import Link from "next/link";
import { company, contact } from "@/content/site-content";
import { BrandMark } from "@/components/brand/BrandMark";
import { motion } from "@/lib/motion/motion-store";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const { language, content, copy } = useLanguage();
  const { footerNav } = content;
  const year = new Date().getFullYear();
  const [coord, setCoord] = useState("LAT 37.98 · LON 23.72");

  // tiny live readout: show active section + time
  useEffect(() => {
    const id = window.setInterval(() => {
      const now = new Date();
      const t = `${String(now.getUTCHours()).padStart(2, "0")}:${String(
        now.getUTCMinutes(),
      ).padStart(2, "0")}:${String(now.getUTCSeconds()).padStart(2, "0")} UTC`;
      setCoord(
        `${language === "el" ? "ΑΘΗΝΑ" : "ATHENS"} · ${t} · ${motion.activeSection.toUpperCase()}`,
      );
    }, 1000);
    return () => window.clearInterval(id);
  }, [language]);

  return (
    <footer className="relative overflow-hidden border-t border-line bg-paper">
      <div className="grid-bg-fine pointer-events-none absolute inset-0 opacity-30" />

      {/* big ghost wordmark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-8 select-none text-center"
      >
        <span className="kinetic text-[clamp(6rem,22vw,20rem)] leading-none text-ink/[0.05]">
          ENCOMM
        </span>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="#top"
              data-cursor="VIEW"
              className="flex items-center gap-2.5"
              aria-label={copy.navigation.backToTop}
            >
              <BrandMark className="h-7 w-7" />
              <span className="font-display text-[15px] font-semibold tracking-[0.2em] text-ink">
                ENCOMM
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted">
              {copy.footer.descriptor}. {copy.footer.country}.
            </p>

            <div className="mt-5 flex flex-col gap-2 text-[12px] text-faint">
              {contact.publicEmail ? (
                <a
                  href={`mailto:${contact.publicEmail}`}
                  className="hover:text-ink"
                >
                  {contact.publicEmail}
                </a>
              ) : (
                <span className="italic">
                  {copy.footer.publicEmail}
                </span>
              )}
              {contact.social.length > 0 ? (
                <div className="mt-2 flex gap-3">
                  {contact.social.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      className="rounded-full border border-line px-3 py-1 text-ink-soft hover:border-line-strong"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              ) : (
                <span className="italic">
                  {copy.footer.social}
                </span>
              )}
            </div>
          </div>

          {footerNav.map((group) => (
            <nav
              key={group.title}
              aria-label={group.title}
              className="flex flex-col gap-3"
            >
              <div className="eyebrow">{group.title}</div>
              <ul className="flex flex-col gap-2">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      data-cursor="VIEW"
                      className="group inline-flex items-center gap-1 text-[13.5px] text-muted transition-colors hover:text-ink"
                    >
                      <span className="transition-transform group-hover:translate-x-0.5">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-[12px] text-faint md:flex-row md:items-center">
          <div>© {year} {company.legalName}. {copy.footer.rights}</div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-1.5 font-mono">
              <span className="status-dot !h-1.5 !w-1.5" />
              {coord}
            </span>
            <Link href="/privacy" className="hover:text-ink">
              {copy.footer.privacy}
            </Link>
            <Link href="/terms" className="hover:text-ink">
              {copy.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
