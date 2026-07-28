"use client";

import Link from "next/link";
import { FaGithub, FaLinkedinIn, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { LocalizedSkipLink } from "@/components/ui/LocalizedSkipLink";
import {
  elevateRegistryUrl,
  marketingPages,
  serviceSlugs,
  type ServiceSlug,
} from "@/content/marketing-pages";
import { useLanguage } from "@/lib/i18n";

type MarketingPageProps =
  | { type: "about" }
  | { type: "service"; slug: ServiceSlug };

function MarketingHeader() {
  const { language } = useLanguage();
  const t = marketingPages[language];
  const root = `/${language}`;

  return (
    <header className="marketing-header">
      <Link
        className="marketing-brand"
        href={root}
        aria-label={language === "el" ? "Αρχική σελίδα ENCOMM" : "ENCOMM home"}
      >
        <img src="/encomm-logo-opt.webp" alt="" width="40" height="28" />
        <strong>ENCOMM</strong>
      </Link>
      <nav aria-label={t.chrome.navLabel}>
        <Link href={root}>{t.chrome.home}</Link>
        <Link href={`${root}/about`}>{t.chrome.about}</Link>
        <Link href={`${root}#projects`}>{t.chrome.work}</Link>
      </nav>
      <div>
        <LanguageToggle />
        <a className="marketing-header-cta" href="mailto:info@encomm.ai">
          {t.chrome.contact}<span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  );
}

function MarketingFooter() {
  const { language } = useLanguage();
  const t = marketingPages[language];
  const root = `/${language}`;

  return (
    <footer className="marketing-footer">
      <div className="marketing-footer-lead">
        <div>
          <span>{language === "el" ? "ENCOMM / ΕΠΙΧΕΙΡΗΣΙΑΚΟ AI" : "ENCOMM / ENTERPRISE AI"}</span>
          <h2>{t.chrome.footerLine}</h2>
        </div>
        <a href="mailto:info@encomm.ai">{t.chrome.contact}<span>↗</span></a>
      </div>
      <div className="marketing-footer-grid">
        <div className="marketing-footer-identity">
          <Link className="marketing-brand" href={root}>
            <img src="/encomm-logo-opt.webp" alt="" width="40" height="28" />
            <strong>ENCOMM</strong>
          </Link>
          <p>⌖ {t.chrome.registeredOffice}</p>
          <small>{t.chrome.registration}</small>
        </div>
        <div>
          <span>{t.chrome.services}</span>
          {serviceSlugs.map((slug) => (
            <Link href={`${root}/services/${slug}`} key={slug}>
              {t.services[slug].eyebrow}
            </Link>
          ))}
        </div>
        <div>
          <span>{t.chrome.support}</span>
          <a href="mailto:info@encomm.ai">info@encomm.ai</a>
          <Link href={`${root}/about`}>{t.chrome.about}</Link>
          <Link href={`${root}#projects`}>{t.chrome.work}</Link>
          <Link href={`${root}/privacy`}>{t.chrome.privacy}</Link>
          <Link href={`${root}/terms`}>{t.chrome.terms}</Link>
          <Link href={`${root}/cookies`}>{t.chrome.cookies}</Link>
        </div>
        <a className="marketing-elevate-link" href={elevateRegistryUrl} target="_blank" rel="noreferrer">
          <i>EG</i>
          <span><small>{t.chrome.registry}</small><strong>{t.chrome.registryTitle}</strong></span>
          <b aria-hidden="true">↗</b>
        </a>
      </div>
      <div className="marketing-footer-bottom">
        <span>{language === "el" ? "© 2026 ENCOMM · Με την υπογραφή της ENCOMM" : "© 2026 ENCOMM · Powered by ENCOMM"}</span>
        <div>
          <a href="https://github.com/Encomm-Tensor-Intelligence" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
          <span aria-disabled="true" aria-label="LinkedIn"><FaLinkedinIn /></span>
          <span aria-disabled="true" aria-label="X"><FaXTwitter /></span>
          <span aria-disabled="true" aria-label="YouTube"><FaYoutube /></span>
        </div>
      </div>
      <div className="marketing-footer-word" aria-hidden="true">ENCOMM</div>
    </footer>
  );
}

function PageCta() {
  const { language } = useLanguage();
  const t = marketingPages[language].chrome;

  return (
    <section className="marketing-cta">
      <span>{t.talkEyebrow}</span>
      <h2>{t.talkTitle}</h2>
      <p>{t.talkBody}</p>
      <a href={`mailto:info@encomm.ai?subject=${encodeURIComponent(
        language === "el" ? "Έργο AI με την ENCOMM" : "AI project with ENCOMM",
      )}`}>
        {t.talkCta}<i aria-hidden="true">↗</i>
      </a>
    </section>
  );
}

function AboutPage() {
  const { language } = useLanguage();
  const t = marketingPages[language].about;
  const unavailableLabel = language === "el"
    ? "Ο σύνδεσμος θα προστεθεί σύντομα"
    : "Link coming soon";

  return (
    <>
      <section className="about-hero marketing-shell" id="main-content" tabIndex={-1}>
        <div className="marketing-grid" aria-hidden="true" />
        <div className="about-hero-copy">
          <span>{t.eyebrow}</span>
          <h1>{t.title}<em>{t.accent}</em></h1>
          <p>{t.intro}</p>
          <small>{t.source}</small>
        </div>
        <div className="about-orbit" aria-hidden="true">
          <i /><i /><span>EN</span>
        </div>
        <div className="about-facts">
          {t.facts.map(([label, value]) => (
            <div key={label}><span>{label}</span><strong>{value}</strong></div>
          ))}
        </div>
      </section>

      <section className="about-story marketing-shell">
        <div>
          <span className="marketing-eyebrow">{t.storyEyebrow}</span>
          <h2>{t.storyTitle}</h2>
        </div>
        <div>{t.storyBody.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </section>

      <section className="about-philosophy marketing-shell">
        <div className="marketing-section-heading">
          <span className="marketing-eyebrow">{t.philosophyEyebrow}</span>
          <h2>{t.philosophyTitle}</h2>
        </div>
        <div className="about-principles">
          {t.philosophy.map((item) => (
            <article key={item.number}>
              <span>{item.number}</span><h3>{item.title}</h3><p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-technology">
        <div className="marketing-shell about-technology-inner">
          <div>
            <span className="marketing-eyebrow">{t.technologyEyebrow}</span>
            <h2>{t.technologyTitle}</h2>
          </div>
          <div>{t.technology.map((item, index) => <span key={item}><i>0{index + 1}</i>{item}</span>)}</div>
        </div>
      </section>

      <section className="about-team marketing-shell" id="team">
        <div className="marketing-section-heading">
          <span className="marketing-eyebrow">{t.teamEyebrow}</span>
          <h2>{t.teamTitle}</h2>
          <p>{t.teamIntro}</p>
        </div>
        <div className="team-grid">
          {t.team.map((person, index) => (
            <article key={person.name}>
              <div className="team-portrait">
                <img
                  src={person.image}
                  alt={person.imageAlt}
                  width="900"
                  height="1125"
                  loading="lazy"
                  decoding="async"
                />
                <small>0{index + 1}</small>
              </div>
              <div className="team-card-body">
                <div>
                  <h3>{person.name}</h3>
                  <p>{person.role}</p>
                </div>
                <div className="team-socials">
                  {[
                    {
                      label: "GitHub",
                      href: "github" in person.socials ? person.socials.github : undefined,
                      icon: <FaGithub />,
                    },
                    {
                      label: "X",
                      href: "x" in person.socials ? person.socials.x : undefined,
                      icon: <FaXTwitter />,
                    },
                    {
                      label: "LinkedIn",
                      href: "linkedin" in person.socials ? person.socials.linkedin : undefined,
                      icon: <FaLinkedinIn />,
                    },
                  ].map((social) => typeof social.href === "string" ? (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${person.name} — ${social.label}`}
                    >
                      {social.icon}
                    </a>
                  ) : (
                    <span
                      key={social.label}
                      aria-disabled="true"
                      aria-label={`${person.name} — ${social.label}: ${unavailableLabel}`}
                      title={unavailableLabel}
                    >
                      {social.icon}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-ecosystem marketing-shell">
        <div className="marketing-section-heading">
          <span className="marketing-eyebrow">{t.ecosystemEyebrow}</span>
          <h2>{t.ecosystemTitle}</h2>
          <p>{t.ecosystemIntro}</p>
        </div>
        <div className="ecosystem-grid">
          {t.ecosystem.map((item, index) => (
            <article key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.body}</p></article>
          ))}
        </div>
      </section>

      <section className="elevate-feature marketing-shell">
        <div className="elevate-feature-mark" aria-hidden="true">EG</div>
        <div>
          <span className="marketing-eyebrow">{t.elevateEyebrow}</span>
          <h2>{t.elevateTitle}</h2>
          <p>{t.elevateBody}</p>
        </div>
        <a href={elevateRegistryUrl} target="_blank" rel="noreferrer">{t.elevateCta}<span>↗</span></a>
      </section>
      <PageCta />
    </>
  );
}

function ServicePage({ slug }: { slug: ServiceSlug }) {
  const { language } = useLanguage();
  const pageSet = marketingPages[language];
  const t = pageSet.services[slug];
  const related = serviceSlugs.filter((item) => item !== slug);
  const root = `/${language}`;

  return (
    <>
      <section className="service-hero marketing-shell" id="main-content" tabIndex={-1}>
        <div className="marketing-grid" aria-hidden="true" />
        <div className="service-breadcrumb">
          <Link href={`${root}#capabilities`}>{pageSet.chrome.backToServices}</Link><span>/</span><strong>{t.eyebrow}</strong>
        </div>
        <div className="service-hero-layout">
          <span className="service-index">{t.index}</span>
          <div>
            <p>{t.eyebrow}</p>
            <h1>{t.title}<em>{t.accent}</em></h1>
            <div className="service-hero-summary">
              <p>{t.summary}</p><strong>{t.promise}</strong>
            </div>
          </div>
        </div>
        <div className="service-orbit" aria-hidden="true"><i /><i /><span>AI</span></div>
      </section>

      <section className="service-outcomes marketing-shell">
        <div className="marketing-section-heading">
          <span className="marketing-eyebrow">{t.outcomesTitle}</span>
        </div>
        <div>
          {t.outcomes.map((item, index) => (
            <article key={item.title}><span>0{index + 1}</span><h2>{item.title}</h2><p>{item.body}</p></article>
          ))}
        </div>
      </section>

      <section className="service-deliverables">
        <div className="marketing-shell service-deliverables-inner">
          <div>
            <span className="marketing-eyebrow">{t.deliverablesTitle}</span>
            <h2>ENCOMM<br /><em>{language === "el" ? "ΠΑΡΑΔΟΤΕΑ" : "OUTPUT"}</em></h2>
          </div>
          <div>{t.deliverables.map((item, index) => <span key={item}><i>{String(index + 1).padStart(2, "0")}</i>{item}</span>)}</div>
        </div>
      </section>

      <section className="service-process marketing-shell">
        <div className="marketing-section-heading">
          <span className="marketing-eyebrow">{t.processTitle}</span>
        </div>
        <div className="service-process-list">
          {t.process.map((step) => (
            <article key={step.number}><span>{step.number}</span><h2>{step.title}</h2><p>{step.body}</p><i aria-hidden="true">↗</i></article>
          ))}
        </div>
      </section>

      <section className="service-systems marketing-shell">
        <div>
          <span className="marketing-eyebrow">{t.systemsTitle}</span>
          <h2>{language === "el" ? <>ΣΥΝΔΕΔΕΜΕΝΑ<br />ΑΠΟ ΤΟΝ ΣΧΕΔΙΑΣΜΟ.</> : <>CONNECTED<br />BY DESIGN.</>}</h2>
        </div>
        <div>{t.systems.map((item) => <span key={item}>{item}</span>)}</div>
      </section>

      <section className="related-services marketing-shell">
        <span className="marketing-eyebrow">{pageSet.chrome.related}</span>
        <div>
          {related.map((relatedSlug) => (
            <Link href={`${root}/services/${relatedSlug}`} key={relatedSlug}>
              <span>{pageSet.services[relatedSlug].index}</span>
              <strong>{pageSet.services[relatedSlug].eyebrow}</strong>
              <i aria-hidden="true">↗</i>
            </Link>
          ))}
        </div>
      </section>
      <PageCta />
    </>
  );
}

export function MarketingPage(props: MarketingPageProps) {
  return (
    <main className="marketing-page">
      <LocalizedSkipLink />
      <MarketingHeader />
      {props.type === "about" ? <AboutPage /> : <ServicePage slug={props.slug} />}
      <MarketingFooter />
    </main>
  );
}
