"use client";

import { useMemo, useState } from "react";
import { capabilities } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Capabilities — an interactive constellation rather than a flat icon grid.
 * Nodes are positioned around a hex ring; hovering/focusing a node
 * illuminates its related connections.
 */
export function Capabilities() {
  const [active, setActive] = useState<string | null>(null);

  // position around a circle
  const positioned = useMemo(() => {
    const n = capabilities.length;
    return capabilities.map((c, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      const r = 40; // % from center
      return {
        ...c,
        x: 50 + r * Math.cos(angle),
        y: 50 + r * Math.sin(angle),
      };
    });
  }, []);

  const idToNode = useMemo(() => {
    const m = new Map<string, { x: number; y: number; title: string }>();
    positioned.forEach((p) => m.set(p.id, p));
    return m;
  }, [positioned]);

  const isHighlighted = (id: string) => {
    if (!active) return false;
    if (active === id) return true;
    const a = capabilities.find((c) => c.id === active);
    return !!a?.relates.includes(id);
  };

  return (
    <section
      id="capabilities"
      className="section-anchor relative overflow-hidden bg-surface-soft py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-4 md:px-8">
        <SectionHeading
          eyebrow="Capabilities"
          eyebrowIndex="C—01"
          title={
            <>
              A connected platform of{" "}
              <span className="text-spectral">capabilities</span>, not a list of features.
            </>
          }
          intro="Hover or focus a node to see how capabilities connect. Each is concise and self-contained; together they form a coherent system."
          className="mb-14"
        />

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-8">
          {/* constellation */}
          <Reveal variant="scale-in">
            <div className="relative mx-auto aspect-square w-full max-w-[520px]">
              {/* concentric guides */}
              <div
                aria-hidden="true"
                className="absolute inset-[10%] rounded-full border border-line"
              />
              <div
                aria-hidden="true"
                className="absolute inset-[24%] rounded-full border border-line"
              />
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-spectral opacity-30 blur-2xl"
              />

              {/* edges */}
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                {positioned.flatMap((node) =>
                  node.relates.map((rId) => {
                    const other = idToNode.get(rId);
                    if (!other) return null;
                    const lit = active && (active === node.id || active === rId);
                    return (
                      <line
                        key={`${node.id}-${rId}`}
                        x1={node.x}
                        y1={node.y}
                        x2={other.x}
                        y2={other.y}
                        stroke={lit ? "#725CFF" : "rgba(16,20,38,0.10)"}
                        strokeWidth={lit ? 0.6 : 0.3}
                        strokeDasharray={lit ? "0" : "2 2"}
                      />
                    );
                  }),
                )}
              </svg>

              {/* center label */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="font-display text-[11px] uppercase tracking-[0.2em] text-faint">
                  ENCOMM
                </div>
                <div className="font-display text-sm text-ink">core</div>
              </div>

              {/* nodes */}
              {positioned.map((node) => {
                const lit = isHighlighted(node.id);
                return (
                  <button
                    key={node.id}
                    type="button"
                    onMouseEnter={() => setActive(node.id)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(node.id)}
                    onBlur={() => setActive(null)}
                    className="group absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    aria-label={`${node.title}: ${node.short}`}
                  >
                    <span
                      className="block h-3.5 w-3.5 rounded-full transition-all duration-300"
                      style={{
                        background: lit ? "#725CFF" : "#FFFFFF",
                        boxShadow: lit
                          ? "0 0 0 6px rgba(114,92,255,0.18), 0 0 20px rgba(114,92,255,0.5)"
                          : "0 0 0 4px rgba(16,20,38,0.06)",
                      }}
                    />
                    <span
                      className={`absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium transition-colors ${
                        lit ? "text-violet" : "text-muted"
                      }`}
                    >
                      {node.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* list / details */}
          <div>
            <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
              {capabilities.map((c) => {
                const lit = isHighlighted(c.id);
                return (
                  <li
                    key={c.id}
                    className="group bg-surface p-5 transition-colors duration-300"
                    style={{
                      background: lit ? "rgba(114,92,255,0.04)" : undefined,
                    }}
                    onMouseEnter={() => setActive(c.id)}
                    onMouseLeave={() => setActive(null)}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full transition-all duration-300"
                        style={{ background: lit ? "#725CFF" : "#C9AEFF" }}
                      />
                      <span className="font-display text-[14px] text-ink">
                        {c.title}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
                      {c.short}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
