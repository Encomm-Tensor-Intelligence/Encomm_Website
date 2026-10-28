# ENCOMM — LIVING INTELLIGENCE

The marketing website for **ENCOMM**, a Greek Enterprise AI company.
An experimental digital experience that feels like an intelligent digital
organism continuously transforming information into systems, workflows, and
actions.

> Built in Greece. Designed for the world.

---

## What makes this different

This is **not** a static SaaS template. The site is one evolving scene:

- **Global Intelligence Field** — a single persistent WebGL canvas behind the
  entire page. Thousands of GPU-instanced particles, animated connection lines,
  cursor attraction, scroll-velocity distortion. The field **transforms
  formations** as the visitor moves between sections (core → systems clusters
  → neural sphere → workflow funnel → pipeline → globe → convergence).
- **The ENCOMM Core** — a procedural 3D brand object: open, architectural,
  layered glass-and-metal "E" structure with `MeshTransmissionMaterial`,
  fresnel iridescent glow shell, instanced orbiting satellites. Built in React
  Three Fiber; opens into layers on scroll.
- **Cinematic pinned hero** — 280vh scroll sequence: ENCOMM assembles from
  particles → core assembles → layers open → satellites emerge → processing →
  aligns into "AI, MADE OPERATIONAL."
- **Three distinct spatial system environments** — not repeated mockups:
  - **AI Assistant**: floating document fragments, question travels the
    network, sources illuminate, answer converges with live path-drawing.
  - **Postmatrix**: orbiting content-production control-room — ideas enter a
    scheduling orbit, agent nodes transform them, analytics curve travels.
  - **Custom AI Systems**: an interactive **system composer** — select a
    source, intelligence layer, and outcome; the diagram reconfigures live.
- **Neural constellation** — capabilities as a full-viewport interactive 2.5D
  network; hover/click highlights connections, idle breathing rotation.
- **Morphing use-case explorer** — scenario switching with workflow diagrams
  that transform and accent colors that shift per category.
- **Pipeline approach** — a glowing signal travels the full DISCOVER → DESIGN
  → BUILD → INTEGRATE → EVOLVE pipeline as you scroll.
- **Point-cloud globe** — Greece as origin, data paths extending to abstract
  destinations, slow orbital rotation.
- **Command-interface contact** — oversized background headline, system
  readiness progress, animated submit with "system ready" state.
- **Custom cursor** (desktop) — dot + delayed ring + context labels
  (VIEW / OPEN / DRAG / EXPLORE). Disabled on touch / reduced motion.
- **Kinetic typography** — oversized headlines, character-split reveals,
  spectral + iridescent gradient text.
- **Reactive navigation** — progress line, active-section indicator, animated
  full-screen mobile menu.

All on a **predominantly bright** canvas — pearl white, frosted glass, spectral
violet/lilac/cyan/magenta light. Depth comes from light, refraction, blur, and
particles — never from black backgrounds.

---

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first `@theme`)
- **GSAP** + **ScrollTrigger** · **Lenis** (smooth scroll, synced to GSAP)
- **Three.js** + **React Three Fiber** + **Drei** (3D field + core)
- **Framer Motion** (component transitions in use-cases / composer)
- **Custom GLSL** (particle field + fresnel shaders)
- **Vitest** (unit tests) · **Playwright** (visual + functional QA)

---

## Local installation

**Prerequisites:** Node.js ≥ 20 (tested on Node 22).

```bash
npm install
npm run dev
```

Then open **http://127.0.0.1:3000** in your browser. Keep the terminal window
running while you view the site.

The **EN / EL** control in the header switches the entire experience between
English and Greek and remembers the selected language on the same device.

## Commands

| Command              | Description                                         |
| -------------------- | --------------------------------------------------- |
| `npm run dev`        | Development server                                  |
| `npm run build`      | Production build                                    |
| `npm run start`      | Run the production server                           |
| `npm run lint`       | ESLint (flat config)                                |
| `npm run typecheck`  | `tsc --noEmit`                                      |
| `npm run test`       | Vitest unit tests                                   |
| `node scripts/qa-redesign.mjs`   | Playwright screenshots (5 viewports + hero pins) |
| `node scripts/qa-functional.mjs` | Playwright functional tests                       |

---

## Architecture

```
app/
  layout.tsx             # Metadata, JSON-LD, fonts, MotionProvider + GlobalField
  page.tsx               # Section composition
  globals.css            # Tailwind v4 tokens + design system + shaders CSS

components/
  webgl/                 # 3D layer
    IntelligenceField.tsx  # persistent GPU particle field (one canvas)
    EncommCore.tsx         # the procedural brand object
    GlobalField.tsx        # lazy-load + quality + fallback wrapper
    shaders.ts             # GLSL: field + fresnel
    formations.ts          # deterministic particle formations per section
  motion/
    MotionProvider.tsx     # Lenis + GSAP ticker + motion store
    Reveal.tsx             # progressive-enhancement scroll reveals
    Kinetic.tsx            # SplitChars / SplitWords
  spatial/                # the three system environments
    AssistantSpace.tsx     # floating knowledge network
    PostmatrixOrbit.tsx    # content scheduling orbit
    CustomComposer.tsx     # interactive system composer
  sections/               # page sections (redesigned)
  ui/                     # MagneticButton, FormField, CustomCursor, Primitives
  brand/BrandMark.tsx     # vector logo

lib/
  motion/
    motion-store.ts        # singleton per-frame store (cursor/scroll/velocity)
    use-scroll-state.ts    # hooks: reduced-motion, active-section, magnetic...
  fonts.ts                 # local variable fonts (Space Grotesk + Inter)
  contact-config.ts        # ← contact submission layer
  contact-validation.ts    # pure form validators (unit-tested)

content/site-content.ts    # ← central copy / nav / systems / capabilities
public/brand/              # official logo PNGs + vector mark/lockup SVGs
public/fonts/              # woff2 (no runtime font downloads)
tests/                     # Vitest specs
scripts/                   # QA + icon generation
artifacts/redesign-review/ # QA screenshots (gitignored)
```

### Motion architecture

One coordinated system — no overlapping animation libraries per element:

- **`motion-store`** — a mutable singleton updated every frame (cursor,
  scroll progress, velocity, active section). R3F `useFrame` loops and rAF
  loops read it directly without triggering React re-renders.
- **`MotionProvider`** — initializes Lenis (synced to GSAP ticker), writes to
  the store, detects WebGL quality tier (high / medium / low).
- **GSAP / ScrollTrigger** — owns all scroll-driven choreography (hero beats,
  reveals, narrative signal, pipeline, globe paths).
- **Framer Motion** — small component-level transitions (use-case panel
  morph, composer selection).
- **R3F render loop** — particle field + core read the motion store each frame.

### Performance modes

Automatic quality detection (`useWebGLQuality`): **HIGH** (desktop, strong GPU)
→ full particles + transmission + fresnel; **MEDIUM** (laptop/tablet) → reduced
counts; **LOW** (mobile / reduced motion) → CSS/SVG fallback, no WebGL.

- One persistent canvas (not one per section)
- Capped DPR, off-screen pause, additive blending (no expensive postprocessing)
- Lazy-loaded 3D scenes, locally bundled fonts, no remote assets

---

## Content configuration

All copy, nav, systems, capabilities, use cases, and contact config live in:

```
content/site-content.ts
```

## Contact form

The live contact form posts to the same-origin `/api/contact` route and delivers
project enquiries to `info@encomm.ai` through Resend. It includes server-side
validation, origin checks, a honeypot, completion-time checks, link filtering,
request-size limits and rate limiting.

Copy `.env.example` to `.env.local`, verify `encomm.ai` in Resend and set
`RESEND_API_KEY` before testing real delivery. Secrets are server-only and are
never sent to the browser.

## Accessibility

- Semantic landmarks, skip link, correct heading hierarchy
- Keyboard-operable mobile menu (dialog + focus trap + Esc + scroll lock)
- Form fields: `<label>` + `aria-describedby` + `role="alert"` errors
- `prefers-reduced-motion`: disables Lenis, GSAP, cursor light, WebGL →
  SVG fallback core + CSS particle layer
- Custom cursor disabled on touch / reduced motion / low quality
- No info by color alone; decorative canvas `aria-hidden`
- `scroll-margin-top: 110px` ensures headings never hide behind nav

## Brand assets

```
public/brand/ENCOMM_logo_email_160px.png   # official mark (preserved)
public/brand/encomm-mark.svg               # vector mark (nav/footer)
public/brand/encomm-lockup.svg             # mark + wordmark
```

Regenerate icons: `python scripts/generate-icons.py`

## Privacy & legal

The website includes bilingual Privacy, Terms and Cookie pages under `/en` and
`/el`. The company identity uses the official G.E.MI. record:

- ENCOMM Ι.Κ.Ε.
- G.E.MI. 189303806000
- Greek VAT 803095422
- 12 Voulgaroktonou, Kalamaria / Thessaloniki 55133, Greece

The legal copy must be reviewed whenever hosting, email delivery, analytics or
other data flows change.
