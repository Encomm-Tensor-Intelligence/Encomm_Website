"use client";

import { approach } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Approach — DISCOVER · DESIGN · BUILD · INTEGRATE · EVOLVE.
 * Precise and credible rather than agency-generic.
 */
export function Approach() {
  return (
    <section
      id="approach"
      className="section-anchor relative overflow-hidden bg-surface-soft py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-4 md:px-8">
        <SectionHeading
          eyebrow="Approach"
          eyebrowIndex="A—01"
          title={
            <>
              A precise path from{" "}
              <span className="text-spectral">discovery to evolution</span>.
            </>
          }
          intro="The process is engineered to be predictable without being rigid."
          className="mb-14"
        />

        <ol className="relative grid grid-cols-1 gap-8 md:grid-cols-5 md:gap-4">
          {/* connecting line */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-[26px] hidden h-px bg-gradient-to-r from-transparent via-line-strong to-transparent md:block"
          />
          {approach.map((step, i) => (
            <li key={step.index} className="relative">
              <Reveal variant="fade-up" delay={i * 0.05}>
                <div className="flex flex-col gap-3">
                  <div className="relative z-10 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-line bg-surface font-mono text-[13px] text-violet shadow-soft">
                    {step.index}
                  </div>
                  <h3 className="font-display text-lg text-ink">{step.title}</h3>
                  <p className="text-[13.5px] leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
