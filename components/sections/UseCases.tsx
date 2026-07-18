"use client";

import { useState } from "react";
import { useCases } from "@/content/site-content";
import { Eyebrow, SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

/**
 * UseCaseExplorer — interactive patterns. Labelled "Example applications",
 * not client stories. No quantified claims.
 */
export function UseCaseExplorer() {
  const [activeId, setActiveId] = useState(useCases[0]!.id);
  const active = useCases.find((u) => u.id === activeId) ?? useCases[0]!;

  return (
    <section
      id="use-cases"
      className="section-anchor relative overflow-hidden bg-paper py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-4 md:px-8">
        <SectionHeading
          eyebrow="Use cases"
          eyebrowIndex="U—01"
          title={
            <>
              Example <span className="text-spectral">applications</span> across organizations.
            </>
          }
          intro="Patterns of how ENCOMM systems can be applied. Not client stories — capability demonstrations. Select a category to explore."
          className="mb-12"
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          {/* category list */}
          <Reveal variant="fade-up">
            <ul
              role="tablist"
              aria-label="Example application categories"
              className="flex flex-col gap-1"
            >
              {useCases.map((u) => {
                const isActive = u.id === active.id;
                return (
                  <li key={u.id}>
                    <button
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`uc-panel-${u.id}`}
                      id={`uc-tab-${u.id}`}
                      onClick={() => setActiveId(u.id)}
                      className={cn(
                        "group flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition-all duration-300",
                        isActive
                          ? "border-violet/30 bg-surface shadow-soft"
                          : "border-transparent bg-transparent hover:bg-surface/60",
                      )}
                    >
                      <span
                        className={cn(
                          "font-display text-[15px] transition-colors md:text-base",
                          isActive ? "text-ink" : "text-muted",
                        )}
                      >
                        {u.category}
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "text-violet transition-all duration-300",
                          isActive ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0",
                        )}
                      >
                        →
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          {/* panel */}
          <Reveal variant="fade-up" delay={0.05}>
            <div
              role="tabpanel"
              id={`uc-panel-${active.id}`}
              aria-labelledby={`uc-tab-${active.id}`}
              className="relative overflow-hidden rounded-[28px] border border-line bg-surface p-7 shadow-lift md:p-9"
            >
              <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
              <div className="relative">
                <Eyebrow>{active.category}</Eyebrow>

                <div className="mt-7 grid grid-cols-1 gap-7 md:grid-cols-2">
                  <Field label="Organizational challenge" value={active.challenge} />
                  <Field label="AI behavior" value={active.behavior} />
                </div>

                <div className="mt-7">
                  <div className="eyebrow mb-2">Connected information sources</div>
                  <div className="flex flex-wrap gap-2">
                    {active.sources.map((s) => (
                      <span key={s} className="chip">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-br from-violet to-cyan" />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-7 rounded-2xl border border-line bg-surface-soft p-5">
                  <div className="eyebrow mb-2">Resulting workflow</div>
                  <p className="text-[14px] leading-relaxed text-ink-soft">
                    {active.workflow}
                  </p>
                </div>

                <div className="mt-7 text-[11px] uppercase tracking-wider text-faint">
                  Example application · capability pattern, not a client story
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="eyebrow mb-2">{label}</div>
      <p className="text-[14px] leading-relaxed text-ink-soft">{value}</p>
    </div>
  );
}
