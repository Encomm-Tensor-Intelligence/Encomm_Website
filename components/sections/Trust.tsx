"use client";

import { trust } from "@/content/site-content";
import { Reveal, LineMask } from "@/components/motion/Reveal";

/**
 * Trust / Greece → Global.
 * Bright background. Restrained Elevate Greece mention (text only — no logo).
 * No invented certifications or badges.
 */
export function Trust() {
  return (
    <section
      id="company"
      className="section-anchor relative overflow-hidden bg-paper py-24 md:py-32"
    >
      <div className="spectral-wash pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1320px] px-4 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <Reveal variant="fade-up">
              <div className="eyebrow mb-6 inline-flex items-center gap-3 rounded-full border border-line bg-surface/70 px-3 py-1.5 backdrop-blur">
                <span className="status-dot" />
                Greece → Global
              </div>
            </Reveal>
            <h2 className="display-1 text-[clamp(2.2rem,5.4vw,4.2rem)] text-ink">
              <LineMask>Built in Greece.</LineMask>
              <LineMask>
                <span className="text-spectral">Designed for the world.</span>
              </LineMask>
            </h2>
            <Reveal variant="fade-up" delay={0.1}>
              <p className="mt-7 max-w-xl text-[16px] leading-relaxed text-muted">
                {trust.copy}
              </p>
            </Reveal>

            <Reveal variant="fade-up" delay={0.18}>
              <ul className="mt-8 flex flex-col gap-3">
                {trust.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 text-[15px] text-ink-soft"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-violet to-cyan"
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* abstract "spatial lab" panel — original procedural visual, not stock */}
          <Reveal variant="scale-in" delay={0.1}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-line bg-surface shadow-lift">
              <div className="core-fallback absolute inset-0" />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(60% 50% at 50% 40%, rgba(114,92,255,0.16), transparent 70%), radial-gradient(50% 45% at 30% 80%, rgba(102,215,245,0.14), transparent 70%)",
                }}
              />
              <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />

              {/* concentric system rings */}
              <svg
                viewBox="0 0 400 500"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="tr-arc" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#725CFF" />
                    <stop offset="1" stopColor="#66D7F5" />
                  </linearGradient>
                </defs>
                <g transform="translate(200 250)">
                  {[60, 110, 160, 210].map((r, i) => (
                    <circle
                      key={r}
                      r={r}
                      fill="none"
                      stroke="rgba(16,20,38,0.08)"
                      strokeWidth={1}
                      strokeDasharray={i % 2 ? "2 4" : "0"}
                    />
                  ))}
                  {/* arc segments */}
                  <path
                    d="M -160 0 A 160 160 0 0 1 0 -160"
                    fill="none"
                    stroke="url(#tr-arc)"
                    strokeWidth={1.5}
                  />
                  <path
                    d="M 110 0 A 110 110 0 0 1 0 110"
                    fill="none"
                    stroke="#C9AEFF"
                    strokeWidth={1.5}
                  />
                  {/* nodes */}
                  {Array.from({ length: 12 }).map((_, i) => {
                    const a = (i / 12) * Math.PI * 2;
                    const r = 110 + (i % 3) * 50;
                    // Round to avoid SSR/CSR float-precision hydration mismatch
                    const cx = Number((Math.cos(a) * r).toFixed(2));
                    const cy = Number((Math.sin(a) * r).toFixed(2));
                    return (
                      <circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r={2.5}
                        fill={i % 3 === 0 ? "#725CFF" : i % 3 === 1 ? "#66D7F5" : "#E7A8F5"}
                      />
                    );
                  })}
                  {/* center */}
                  <circle r={6} fill="#725CFF" />
                  <circle r={14} fill="none" stroke="#725CFF" strokeWidth={0.8} opacity={0.5} />
                </g>
              </svg>

              {/* footer chip */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-line bg-surface/85 px-4 py-3 backdrop-blur">
                <div className="leading-tight">
                  <div className="text-[13px] font-medium text-ink">ENCOMM</div>
                  <div className="text-[11px] text-faint">Enterprise AI · Athens, Greece</div>
                </div>
                <span className="chip">Elevate Greece · member</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
