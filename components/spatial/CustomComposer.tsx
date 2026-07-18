"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/motion/use-scroll-state";

type Column = "source" | "intel" | "outcome";

const OPTIONS: Record<Column, { id: string; label: string; sub: string }[]> = {
  source: [
    { id: "docs", label: "Documents", sub: "PDF · Word" },
    { id: "web", label: "Websites", sub: "Crawled" },
    { id: "db", label: "Database", sub: "Structured" },
    { id: "api", label: "API", sub: "External" },
  ],
  intel: [
    { id: "assistant", label: "Assistant", sub: "Q&A" },
    { id: "agent", label: "Agent", sub: "Autonomous" },
    { id: "workflow", label: "Workflow", sub: "Automated" },
  ],
  outcome: [
    { id: "review", label: "Human review", sub: "Approved" },
    { id: "system", label: "External system", sub: "Synced" },
    { id: "app", label: "Application", sub: "Embedded" },
  ],
};

/**
 * CustomComposer — an interactive "system composer".
 * The visitor selects a source, an intelligence layer, and an outcome.
 * The diagram reconfigures, lighting the path through the selected nodes.
 * Not real AI — an interactive product visualization.
 */
export function CustomComposer() {
  const reduced = useReducedMotion();
  const [sel, setSel] = useState<Record<Column, string>>({
    source: "docs",
    intel: "assistant",
    outcome: "review",
  });

  const activePath = useMemo(() => {
    const s = OPTIONS.source.find((o) => o.id === sel.source)!;
    const i = OPTIONS.intel.find((o) => o.id === sel.intel)!;
    const o = OPTIONS.outcome.find((o) => o.id === sel.outcome)!;
    return { s, i, o };
  }, [sel]);

  const Animate = reduced ? "div" : motion.div;

  return (
    <div
      data-cursor="EXPLORE"
      className="group relative aspect-[5/4] w-full overflow-hidden rounded-[28px] border border-line glass"
    >
      <div className="grid-bg-fine pointer-events-none absolute inset-0 opacity-40" />

      {/* header */}
      <div className="absolute inset-x-3 top-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-violet-deep to-cyan text-[12px] font-semibold text-white">
            ⌬
          </div>
          <div className="leading-tight">
            <div className="text-[12px] font-medium text-ink">System composer</div>
            <div className="font-mono text-[9px] text-faint">CONFIGURE · LIVE</div>
          </div>
        </div>
        <span className="chip">
          <span className="status-dot !h-1.5 !w-1.5" /> Reconfiguring
        </span>
      </div>

      {/* three columns of options */}
      <div className="absolute inset-x-3 top-16 bottom-3 grid grid-cols-3 gap-2">
        {(Object.keys(OPTIONS) as Column[]).map((col, colIdx) => (
          <div key={col} className="flex flex-col">
            <p className="eyebrow mb-2 text-center !text-[9px]">
              {col === "source"
                ? "Source"
                : col === "intel"
                  ? "Intelligence"
                  : "Outcome"}
            </p>
            <div className="flex flex-1 flex-col gap-1.5">
              {OPTIONS[col].map((opt) => {
                const active = sel[col] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    data-cursor="OPEN"
                    onClick={() => setSel((s) => ({ ...s, [col]: opt.id }))}
                    className={`relative rounded-lg border px-2 py-2 text-left transition-all duration-300 ${
                      active
                        ? "border-violet/50 bg-white shadow-[0_0_24px_-6px_rgba(106,77,255,0.6)]"
                        : "border-line bg-white/50 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="text-[11px] font-medium text-ink">
                      {opt.label}
                    </div>
                    <div className="font-mono text-[8px] text-faint">
                      {opt.sub}
                    </div>
                    {active ? (
                      <span
                        aria-hidden="true"
                        className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-violet shadow-[0_0_10px_2px_rgba(106,77,255,0.6)]"
                      />
                    ) : null}
                    {/* connector to next column */}
                    {active && colIdx < 2 ? (
                      <span
                        aria-hidden="true"
                        className="absolute right-[-9px] top-1/2 h-px w-[9px] data-line"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* active path summary bar at bottom */}
      <div className="absolute inset-x-3 bottom-3 rounded-xl border border-line bg-white/80 px-3 py-2 backdrop-blur">
        <div className="flex items-center gap-2 text-[10px]">
          <span className="font-mono text-violet">PATH</span>
          <Animate
            key={activePath.s.id}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded bg-violet/10 px-1.5 py-0.5 font-medium text-violet-deep"
          >
            {activePath.s.label}
          </Animate>
          <span className="text-faint">→</span>
          <Animate
            key={activePath.i.id}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded bg-cyan/15 px-1.5 py-0.5 font-medium text-violet-deep"
          >
            {activePath.i.label}
          </Animate>
          <span className="text-faint">→</span>
          <Animate
            key={activePath.o.id}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded bg-magenta/15 px-1.5 py-0.5 font-medium text-violet-deep"
          >
            {activePath.o.label}
          </Animate>
        </div>
      </div>
    </div>
  );
}
