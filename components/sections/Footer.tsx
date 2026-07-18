import Link from "next/link";
import { company, contact, footerNav } from "@/content/site-content";
import { BrandMark } from "@/components/brand/BrandMark";

/**
 * Footer — uses the original mark, navigation, and only verified channels.
 * Legal placeholders clearly marked for later completion in content config.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-paper">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1320px] px-4 py-16 md:px-8 md:py-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="#top"
              className="flex items-center gap-2.5"
              aria-label="ENCOMM — back to top"
            >
              <BrandMark className="h-7 w-7" />
              <span className="font-display text-[17px] font-semibold tracking-[0.18em] text-ink">
                ENCOMM
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted">
              {company.descriptor}. {company.country} → Global.
            </p>

            {/* Verified contact channels only */}
            <div className="mt-5 flex flex-col gap-2 text-[12.5px] text-faint">
              {contact.publicEmail ? (
                <a
                  href={`mailto:${contact.publicEmail}`}
                  className="hover:text-ink"
                >
                  {contact.publicEmail}
                </a>
              ) : (
                <span className="italic">
                  Public email — to be confirmed by ENCOMM
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
                  Social profiles — to be confirmed by ENCOMM
                </span>
              )}
            </div>
          </div>

          {/* nav groups */}
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
                      className="text-[13.5px] text-muted transition-colors hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-[12px] text-faint md:flex-row md:items-center">
          <div>
            © {year} {company.legalName}. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <span className="status-dot !h-1.5 !w-1.5" />
              Recognized member of Elevate Greece
            </span>
            {/* PLACEHOLDER — verified privacy/terms links before launch */}
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-ink">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
