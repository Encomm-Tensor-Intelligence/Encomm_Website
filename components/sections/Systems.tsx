"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { systems } from "@/content/site-content";
import { AssistantSpace } from "@/components/spatial/AssistantSpace";
import { PostmatrixOrbit } from "@/components/spatial/PostmatrixOrbit";
import { CustomComposer } from "@/components/spatial/CustomComposer";
import {
  useReducedMotion,
  useIsomorphicLayoutEffect,
} from "@/lib/motion/use-scroll-state";

gsap.registerPlugin(ScrollTrigger);

/**
 * Systems — three distinct spatial worlds presented as a pinned sequence.
 * Each system gets its own full-viewport stage with its own visual language.
 */
export function Systems() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const stages = gsap.utils.toArray<HTMLElement>(".system-stage");
      stages.forEach((stage, i) => {
        gsap.fromTo(
          stage.querySelector(".stage-content"),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: stage,
              start: "top 60%",
              end: "top 20%",
              scrub: 0.5,
              onEnter: () => setActive(i),
              onEnterBack: () => setActive(i),
            },
          },
        );
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="systems" ref={root} className="section-anchor relative">
      {/* Section intro */}
      <div className="mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
        <p className="eyebrow mb-5">
          <span className="text-violet">S—00</span> · Systems
        </p>
        <h2 className="kinetic max-w-4xl text-[clamp(2.2rem,6vw,5rem)] text-ink">
          Three ways intelligence becomes{" "}
          <span className="text-spectral">a working system</span>.
        </h2>
        {/* progress rail with active index */}
        <div className="mt-10 flex items-center gap-4">
          <div className="relative h-px flex-1 bg-line">
            <div
              className="data-line absolute inset-y-0 left-0 transition-all duration-500"
              style={{ width: `${((active + 1) / systems.length) * 100}%` }}
            />
          </div>
          <span className="font-mono text-[11px] text-faint">
            0{active + 1} / 0{systems.length}
          </span>
        </div>
      </div>

      {/* Three stages */}
      <div className="flex flex-col">
        {systems.map((sys, i) => (
          <article
            key={sys.id}
            id={sys.id}
            className="system-stage section-anchor relative min-h-[100svh] overflow-hidden py-16 md:py-24"
          >
            {/* alternating background tint */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  i === 0
                    ? "radial-gradient(60% 50% at 80% 30%, rgba(106,77,255,0.08), transparent 70%)"
                    : i === 1
                      ? "radial-gradient(60% 50% at 20% 30%, rgba(79,212,245,0.08), transparent 70%)"
                      : "radial-gradient(60% 50% at 50% 80%, rgba(229,139,240,0.08), transparent 70%)",
              }}
            />

            <div className="stage-content relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-4 md:grid-cols-12 md:gap-12 md:px-8">
              {/* copy */}
              <div
                className={
                  i % 2 === 1
                    ? "md:order-2 md:col-span-5 md:col-start-8"
                    : "md:order-1 md:col-span-5"
                }
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[12px] text-violet">
                    {sys.index}
                  </span>
                  <span className="h-px w-8 bg-line-strong" />
                  <span className="eyebrow !text-faint">{sys.eyebrow}</span>
                </div>
                <h3 className="mt-5 font-display text-[clamp(2rem,4vw,3.4rem)] leading-tight text-ink">
                  {sys.name}
                </h3>
                <p className="mt-3 text-lg text-violet-deep">{sys.line}</p>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
                  {sys.description}
                </p>
                <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {sys.features.slice(0, 6).map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-[13px] text-ink-soft"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-violet to-cyan"
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* spatial demo */}
              <div
                className={
                  i % 2 === 1
                    ? "md:order-1 md:col-span-6 md:col-start-1"
                    : "md:order-2 md:col-span-6 md:col-start-7"
                }
              >
                <StageRenderer id={sys.id} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function StageRenderer({ id }: { id: string }) {
  if (id === "system-assistant") return <AssistantSpace />;
  if (id === "system-postmatrix") return <PostmatrixOrbit />;
  return <CustomComposer />;
}
