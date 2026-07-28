"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/motion/use-scroll-state";
import { useLanguage } from "@/lib/i18n";

const ACCENTS: Record<string, { from: string; to: string }> = {
  "uc-enterprise": { from: "#6a4dff", to: "#4fd4f5" },
  "uc-public": { from: "#4fd4f5", to: "#6a4dff" },
  "uc-support": { from: "#e58bf0", to: "#6a4dff" },
  "uc-commerce": { from: "#6a4dff", to: "#e58bf0" },
  "uc-education": { from: "#4fd4f5", to: "#e58bf0" },
  "uc-marketing": { from: "#e58bf0", to: "#4fd4f5" },
};

const SOURCE_ICONS: Record<string, string> = {
  Documents: "▤",
  Intranet: "◳",
  Databases: "◧",
  "Policy docs": "▤",
  Website: "◳",
  "Forms API": "◧",
  "Help docs": "▤",
  "Product API": "◧",
  CRM: "◉",
  "Product catalog": "▤",
  "Inventory API": "◧",
  "Order DB": "◧",
  "Course materials": "▤",
  "Student systems": "◧",
  "Brand docs": "▤",
  Analytics: "◐",
  "Social APIs": "◧",
};

/**
 * UseCaseExplorer — immersive scenario switcher.
 * Categories arranged around a curved ribbon; selecting one morphs the
 * workflow diagram, source nodes, and accent color.
 */
export function UseCaseExplorer() {
  const { content, copy } = useLanguage();
  const { useCases } = content;
  const reduced = useReducedMotion();
  const [activeId, setActiveId] = useState(useCases[0]!.id);
  const active = useCases.find((u) => u.id === activeId) ?? useCases[0]!;
  const accent = ACCENTS[active.id] ?? ACCENTS["uc-enterprise"]!;

  return (
    <section
      id="use-cases"
      className="section-anchor section-tint-b relative min-h-[100svh] overflow-hidden py-20 md:py-28"
    >
      <div className="grid-bg-fine pointer-events-none absolute inset-0 opacity-30" />

      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <p className="eyebrow mb-5">
          <span className="text-violet">U—01</span> · {copy.useCases.eyebrow}
        </p>
        <h2 className="kinetic mb-12 max-w-4xl text-[clamp(2.2rem,6vw,5rem)] text-ink">
          {copy.useCases.lineOne}{" "}
          <span className="text-spectral">{copy.useCases.accent}</span>.
        </h2>

        {/* category ribbon — curved arrangement */}
        <div className="relative mb-12 flex flex-wrap justify-center gap-2 md:gap-3">
          {useCases.map((u, i) => {
            const isActive = u.id === activeId;
            const offset = (i - (useCases.length - 1) / 2) * 4;
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => setActiveId(u.id)}
                data-cursor="OPEN"
                className="group relative rounded-full border px-4 py-2.5 text-[12px] font-medium transition-all duration-300"
                style={{
                  borderColor: isActive ? accent.from : "var(--color-line)",
                  background: isActive ? `${accent.from}14` : "rgba(255,255,255,0.6)",
                  color: isActive ? accent.from : "var(--color-ink-soft)",
                  transform: `translateY(${isActive ? -4 : Math.abs(offset) * 0.5}px)`,
                  backdropFilter: "blur(6px)",
                }}
              >
                <span className="relative z-10">{u.category}</span>
                {isActive ? (
                  <motion.span
                    layoutId="uc-active-dot"
                    className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                    style={{ background: accent.from }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* morphing workflow panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={reduced ? false : { opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduced ? undefined : { opacity: 0, y: -20, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[28px] border border-line glass p-6 md:p-10"
          >
            {/* accent glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                background: `radial-gradient(60% 60% at 80% 30%, ${accent.from}1f, transparent 70%)`,
              }}
            />

            <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
              {/* left: challenge + behavior */}
              <div>
                <p className="eyebrow mb-3">{copy.useCases.challenge}</p>
                <p className="font-display text-xl text-ink md:text-2xl">
                  {active.challenge}
                </p>
                <p className="eyebrow mb-3 mt-6">{copy.useCases.behavior}</p>
                <p className="text-[15px] leading-relaxed text-muted">
                  {active.behavior}
                </p>
              </div>

              {/* right: workflow diagram */}
              <div>
                <p className="eyebrow mb-3">{copy.useCases.workflow}</p>
                {/* source nodes → assistant → outcome */}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {active.sources.map((s) => (
                      <span
                        key={s}
                        className="flex items-center gap-1 rounded-lg border bg-white px-2 py-1 text-[11px]"
                        style={{ borderColor: `${accent.from}40` }}
                      >
                        <span style={{ color: accent.from }}>
                          {SOURCE_ICONS[s] ?? "▢"}
                        </span>
                        <span className="text-ink-soft">{s}</span>
                      </span>
                    ))}
                  </div>

                  {/* flow arrows */}
                  <div className="flex items-center gap-2 pl-2">
                    <div
                      className="h-px flex-1"
                      style={{
                        background: `linear-gradient(90deg, ${accent.from}, ${accent.to})`,
                      }}
                    />
                    <span style={{ color: accent.from }}>↓</span>
                  </div>

                  {/* core */}
                  <div
                    className="flex items-center gap-3 rounded-xl border bg-white px-3 py-3"
                    style={{ borderColor: `${accent.from}40` }}
                  >
                    <div
                      className="grid h-9 w-9 place-items-center rounded-lg text-white"
                      style={{
                        background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
                      }}
                    >
                      ⬡
                    </div>
                    <span className="text-[13px] font-medium text-ink">
                      {copy.useCases.intelligence}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pl-2">
                    <div
                      className="h-px flex-1"
                      style={{
                        background: `linear-gradient(90deg, ${accent.to}, ${accent.from})`,
                      }}
                    />
                    <span style={{ color: accent.to }}>↓</span>
                  </div>

                  <div className="rounded-xl border border-line bg-surface-soft px-3 py-3">
                    <p className="text-[13px] leading-relaxed text-ink-soft">
                      {active.workflow}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="relative mt-8 font-mono text-[10px] text-faint">
              {copy.useCases.disclaimer}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
