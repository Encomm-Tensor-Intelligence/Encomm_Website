"use client";

import { systems } from "@/content/site-content";
import { Eyebrow } from "@/components/ui/Primitives";
import { Reveal } from "@/components/motion/Reveal";
import { AssistantDemo } from "@/components/demos/AssistantDemo";
import { PostmatrixDemo } from "@/components/demos/PostmatrixDemo";
import { CustomSystemDemo } from "@/components/demos/CustomSystemDemo";
import { cn } from "@/lib/cn";

/**
 * Systems section — three editorial, staggered product presentations.
 * NOT equal-sized pricing cards. Each system has its own custom-built UI demo
 * rendered directly in HTML/CSS/React (no copied screenshots).
 */
export function Systems() {
  return (
    <section
      id="systems"
      className="section-anchor relative overflow-hidden bg-paper py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-4 md:px-8">
        <Reveal variant="fade-up">
          <div className="mb-16 flex flex-col gap-5 md:mb-24 md:max-w-3xl">
            <Eyebrow index="S—00">Systems</Eyebrow>
            <h2 className="display-1 text-[clamp(2rem,5vw,3.6rem)] text-ink">
              Three ways ENCOMM turns{" "}
              <span className="text-spectral">intelligence into work</span>.
            </h2>
          </div>
        </Reveal>

        <div className="flex flex-col gap-24 md:gap-36">
          {systems.map((sys, i) => {
            const reversed = i % 2 === 1;
            return (
              <article
                key={sys.id}
                id={sys.id}
                className="section-anchor grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-12"
              >
                {/* copy column */}
                <div
                  className={cn(
                    "md:col-span-5",
                    reversed ? "md:order-2 md:col-start-8" : "md:order-1",
                  )}
                >
                  <Reveal variant="fade-up">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[12px] text-violet">
                        {sys.index}
                      </span>
                      <span className="h-px w-8 bg-line-strong" />
                      <span className="eyebrow !text-faint">{sys.eyebrow}</span>
                    </div>
                    <h3 className="mt-5 font-display text-[clamp(1.8rem,3.4vw,2.8rem)] text-ink">
                      {sys.name}
                    </h3>
                    <p className="mt-3 text-lg leading-snug text-violet-deep">
                      {sys.line}
                    </p>
                    <p className="mt-5 text-[15.5px] leading-relaxed text-muted">
                      {sys.description}
                    </p>
                    <ul className="mt-7 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {sys.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-[13.5px] text-ink-soft"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-violet to-cyan"
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </div>

                {/* demo column */}
                <div
                  className={cn(
                    "md:col-span-6",
                    reversed ? "md:order-1 md:col-start-1" : "md:order-2 md:col-start-7",
                  )}
                >
                  <Reveal variant="scale-in" delay={0.05}>
                    <DemoRenderer id={sys.id} />
                  </Reveal>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DemoRenderer({ id }: { id: string }) {
  if (id === "system-assistant") return <AssistantDemo />;
  if (id === "system-postmatrix") return <PostmatrixDemo />;
  return <CustomSystemDemo />;
}
