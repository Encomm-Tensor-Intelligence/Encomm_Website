"use client";

import Link from "next/link";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { LocalizedSkipLink } from "@/components/ui/LocalizedSkipLink";
import {
  legalChrome,
  legalContent,
  legalReferenceLinks,
  type LegalType,
} from "@/content/legal-content";
import { company } from "@/content/company";
import { useLanguage } from "@/lib/i18n";

export function LegalContent({ type }: { type: LegalType }) {
  const { language } = useLanguage();
  const page = legalContent[language][type];
  const chrome = legalChrome[language];
  const root = `/${language}`;
  const legalLinks = [
    { type: "privacy" as const, label: chrome.privacy },
    { type: "terms" as const, label: chrome.terms },
    { type: "cookies" as const, label: chrome.cookies },
  ];

  return (
    <main className="legal-page">
      <LocalizedSkipLink />
      <header className="legal-header">
        <Link className="legal-brand" href={root} aria-label={chrome.home}>
          <img src="/encomm-logo-opt.webp" alt="" width="40" height="28" />
          <strong>ENCOMM</strong>
        </Link>
        <nav aria-label={chrome.legal}>
          <Link className="legal-home-link" href={root}>
            {chrome.homeNav}
          </Link>
          {legalLinks.map((item) => (
            <Link
              className={item.type === type ? "is-active" : ""}
              href={`${root}/${item.type}`}
              key={item.type}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <LanguageToggle />
      </header>

      <section className="legal-hero" id="main-content" tabIndex={-1}>
        <div className="legal-grid" aria-hidden="true" />
        <div>
          <span>{page.eyebrow}</span>
          <h1>{page.title}</h1>
          <p>{page.summary}</p>
          <small>{page.lastUpdated}</small>
        </div>
        <div className="legal-orbit" aria-hidden="true"><i /><span>§</span></div>
      </section>

      <div className="legal-layout">
        <aside>
          <span>{page.contentsLabel}</span>
          <nav>
            {page.sections.map((section) => (
              <a href={`#${section.id}`} key={section.id}>{section.title}</a>
            ))}
          </nav>
          <div>
            <span>{chrome.contact}</span>
            <a href="mailto:info@encomm.ai">info@encomm.ai</a>
          </div>
        </aside>

        <article className="legal-document">
          {page.sections.map((section) => (
            <section id={section.id} key={section.id}>
              <h2>{section.title}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets ? (
                <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>
              ) : null}
              {section.table ? (
                <div className="legal-table-wrap">
                  <table>
                    <thead><tr>{section.table.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
                    <tbody>
                      {section.table.rows.map((row) => (
                        <tr key={row.join("-")}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </section>
          ))}
        </article>
      </div>

      <section className="legal-references">
        <div>
          <span>{chrome.officialSources}</span>
          <p>{chrome.sourceNote}</p>
        </div>
        <div>
          {legalReferenceLinks.map((source, index) => (
            <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{source.label[language]}</strong>
              <i aria-hidden="true">↗</i>
            </a>
          ))}
        </div>
      </section>

      <footer className="legal-footer">
        <div>
          <Link className="legal-brand" href={root}>
            <img src="/encomm-logo-opt.webp" alt="" width="40" height="28" />
            <strong>ENCOMM</strong>
          </Link>
          <p>⌖ {language === "el" ? company.addressEl : company.addressEn}</p>
          <p>
            {language === "el" ? "Γ.Ε.ΜΗ." : "G.E.MI."} {company.gemi}
            {" · "}
            {language === "el" ? "Α.Φ.Μ." : "VAT"} {company.vat}
          </p>
        </div>
        <nav>
          {legalLinks.map((item) => (
            <Link href={`${root}/${item.type}`} key={item.type}>{item.label}</Link>
          ))}
        </nav>
        <div>
          <span>© 2026 ENCOMM</span>
          <span>{language === "el" ? "Με την υπογραφή της ENCOMM" : "Powered by ENCOMM"}</span>
        </div>
        <b aria-hidden="true">{language === "el" ? "ΝΟΜΙΚΑ" : "LEGAL"}</b>
      </footer>
    </main>
  );
}
