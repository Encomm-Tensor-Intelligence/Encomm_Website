# ENCOMM — Enterprise AI

The marketing website for **ENCOMM**, a Greek Enterprise AI company.
Built around an original visual concept called **LUMINOUS INTELLIGENCE** — a
bright, spatial AI laboratory where information transforms into understanding
and action.

> Built in Greece. Designed for the world.

---

## Highlights

- **Original visual concept** — white / pearl surfaces, controlled violet,
  lilac, cyan, and magenta spectral light, translucent materials, editorial
  whitespace. Intentionally **~88 % light** — not another dark AI website.
- **The ENCOMM Core** — a custom procedural 3D brand object (React Three Fiber)
  inspired by the geometry of the official logo. Translucent crystal shell,
  metallic layered core, illuminated data channels, particle network. Opens
  into architectural layers on scroll, with a polished SVG/CSS fallback for
  unsupported devices, mobile, and reduced-motion users.
- **Scroll narrative** — `SIGNAL → SENSE → SYSTEM → SCALE`, synchronized via
  Lenis + GSAP ScrollTrigger (no scroll hijacking).
- **Custom product demos** — the AI Assistant, Postmatrix, and Custom AI
  Systems sections ship their own hand-built UIs (not screenshots).
- **Accessible by default** — semantic landmarks, keyboard-operable
  navigation and mobile menu, visible focus, labelled fields, ARIA-described
  errors, `prefers-reduced-motion` support, decorative canvas hidden from AT.
- **Performance** — lazy-loaded 3D scene, capped WebGL DPR, off-screen pause,
  locally bundled variable fonts, no remote hotlinked assets.

---

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19** + **TypeScript** (strict mode, `noUncheckedIndexedAccess`)
- **Tailwind CSS v4** (CSS-first `@theme` tokens)
- **GSAP** + **ScrollTrigger** for scroll-driven motion
- **Lenis** for smooth scroll (synced to GSAP)
- **Three.js** + **React Three Fiber** + **Drei** for the ENCOMM Core
- **Vitest** for unit tests, **Playwright** for QA screenshots

---

## Local installation

**Prerequisites:** Node.js ≥ 20 (tested on Node 22).

```bash
npm install
```

## Development

```bash
npm run dev
```

The site starts on `http://localhost:3000` (or the next free port — check the
terminal output; on this machine it ran on `http://localhost:3001`).

## Production build

```bash
npm run build
npm run start
```

## Other commands

| Command                | Description                                       |
| ---------------------- | ------------------------------------------------- |
| `npm run dev`          | Start the dev server                              |
| `npm run build`        | Production build                                  |
| `npm run start`        | Run the production server                         |
| `npm run lint`         | ESLint (flat config)                              |
| `npm run typecheck`    | `tsc --noEmit`                                    |
| `npm run test`         | Vitest unit tests                                 |
| `npm run qa:shoot`     | Capture Playwright screenshots at 3 viewports     |

---

## Project structure

```
app/                     # Next.js App Router
  layout.tsx             # Root layout, metadata, JSON-LD, fonts
  page.tsx               # Home (composition of sections)
  globals.css            # Tailwind v4 + design tokens + base styles
  privacy/ terms/        # Placeholder legal pages (clearly marked)
  robots.ts sitemap.ts   # Metadata routes

components/
  brand/                 # BrandMark, EncommCore (3D + loader + fallback)
  motion/                # SmoothScrollProvider, Reveal, LineMask
  sections/              # Navigation, Hero, Narrative, Systems, ...
  demos/                 # AssistantDemo, PostmatrixDemo, CustomSystemDemo
  ui/                    # MagneticButton, FormField, Primitives

content/
  site-content.ts        # ← central copy, nav, footer, contact config

lib/
  fonts.ts               # Local variable font setup (next/font/local)
  cn.ts                  # className helper
  motion-safe.ts         # useReducedMotion, useIsClient, isomorphic layout
  contact-config.ts      # ← contact submission layer
  contact-validation.ts  # pure form validators (unit-tested)

public/
  brand/                 # Official logo PNGs + vector mark/lockup SVGs
  fonts/                 # Space Grotesk + Inter (woff2, locally bundled)
  icons/                 # Favicon, apple-touch, android-chrome
  og-image.png           # Social share image
  site.webmanifest

tests/                   # Vitest specs
scripts/                 # Icon generation + Playwright QA scripts
artifacts/screenshots/   # QA captures (gitignored)
```

---

## Content configuration

All copy, navigation items, footer links, and product descriptions live in a
single file:

```
content/site-content.ts
```

Edit values there; the UI consumes them by reference. This is where you change
headlines, system descriptions, capabilities, use cases, and the approach
steps.

---

## Contact endpoint configuration

The contact form is wired through a single documented layer:

```
lib/contact-config.ts
```

**Resolution order for the submission endpoint:**

1. `process.env.NEXT_PUBLIC_CONTACT_ENDPOINT`
2. `process.env.CONTACT_ENDPOINT`
3. `contact.endpoint` in `content/site-content.ts`

When **none** is set, the form runs in **demo mode**: it validates input,
simulates a submission locally, and **clearly states that no message was sent**
(it never impersonates a successful real delivery). The UI surfaces a small
"demo mode" notice on the contact section.

To enable real submissions, set an env var before building/running:

```bash
# .env.local
NEXT_PUBLIC_CONTACT_ENDPOINT="https://your-api.example.com/contact"
```

**Security:** never put secrets in client-reachable config. The form posts a
plain JSON payload; handle validation and persistence on your endpoint.

---

## Brand asset locations

Official raster logos (preserved unchanged):

```
public/brand/ENCOMM_logo_email_160px.png     # official 160px mark
public/brand/ENCOMM_logo_email_240px.png     # official 240px mark
public/brand/ENCOMM_logo_horizontal.png      # mark + wordmark
public/brand/ENCOMM_logo_hero_source.png     # source artwork
```

Vector marks (derived, used in UI for crispness at all DPRs):

```
public/brand/encomm-mark.svg      # standalone crystal mark
public/brand/encomm-lockup.svg    # mark + "ENCOMM / Enterprise AI" wordmark
```

Generated icons (favicon, apple-touch, android-chrome):

```
public/icons/   +   public/favicon.ico
```

### Replacing or improving the logo assets

1. Drop replacement PNGs into `public/brand/` (keep the original filenames
   intact, or update the references in `app/layout.tsx` and
   `public/site.webmanifest`).
2. To regenerate favicons / app icons from a new source mark, edit and re-run:

   ```bash
   python scripts/generate-icons.py
   ```

3. The vector `encomm-mark.svg` / `encomm-lockup.svg` are hand-authored.
   To use the raster mark in the nav/footer instead, swap the `<BrandMark />`
   component (in `components/brand/`) for an `<Image>` pointing at the PNG.

---

## Animation architecture

A single coordinated motion stack — no overlapping systems for the same element:

- **`SmoothScrollProvider`** (`components/motion/`) initializes Lenis once and
  syncs its `raf` to the GSAP ticker, so ScrollTrigger stays accurate even on
  fast scrolls. Disabled entirely under `prefers-reduced-motion`.
- **`Reveal`** wraps content in scroll-triggered entrances (`fade-up`,
  `scale-in`, `line-mask`, `fade`). Uses `fromTo` with
  `immediateRender: false` — **progressive enhancement**: content renders
  visible by default, and ScrollTrigger animates it when available. If JS or
  ScrollTrigger fails, content is never stuck hidden.
- **`MagneticButton`** adds restrained desktop magnetic translation (disabled
  on touch and reduced motion).
- **`LineMask`** wraps text lines in `overflow:hidden` for the editorial
  line-reveal effect.
- The **ENCOMM Core** reads scroll progress via a `ScrollTrigger.create` bound
  to the hero element; `openRef.current` (0 → 1) drives the layer-opening,
  particle network, and ambient rotation inside the R3F render loop.

Everything respects `prefers-reduced-motion` (checked via the SSR-safe
`useReducedMotion` hook, which uses `useSyncExternalStore`).

---

## Accessibility

The site aims for **WCAG 2.2 AA** behavior:

- Semantic landmarks (`header`, `nav`, `main`, `footer`), correct heading
  hierarchy, descriptive labels.
- "Skip to content" link as the first focusable element.
- Visible focus outlines (`:focus-visible`).
- Mobile menu is a real dialog (`role="dialog"`, `aria-modal`), with `Esc` to
  close, body scroll lock, return-focus, and a basic focus trap.
- Form fields use `<label>` + `aria-describedby` + `role="alert"` errors.
  Validation runs on blur and on submit; the first invalid field is focused.
- Decorative canvas is `aria-hidden`; the 3D Core has a meaningful SVG
  fallback that conveys the same brand metaphor.
- `prefers-reduced-motion` disables Lenis, GSAP entrances, the cursor light,
  and WebGL; the fallback core is shown and content appears instantly.
- No essential information is communicated by color alone.

---

## How to add verified case studies later

The site deliberately avoids fabricated client stories, metrics, and logos.
When ENCOMM has a verified case study:

1. Add a new entry to a `caseStudies` array in `content/site-content.ts`
   (model it on `useCases`, but add fields for the client name, a verified
   quote with attribution, and the case-study URL).
2. Render the new array in a section component under `components/sections/`.
3. Only ever show metrics that ENCOMM can substantiate. The
   `tests/site-content.test.ts` file includes a guard that fails if any use
   case contains quantified claims (`%`, `Nx`, `revenue`, `ROI`); extend that
   guard to cover new sections.

---

## Privacy & legal

`app/privacy/page.tsx` and `app/terms/page.tsx` are **structural
placeholders** — clearly marked as such in the rendered copy. Replace them
with verified legal language before public launch. Footer links point at them
and are ready to receive the real content.
