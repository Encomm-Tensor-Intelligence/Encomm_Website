# ENCOMM Site — Project Report

## What was built

A complete, production-quality marketing website for **ENCOMM** (Greek
Enterprise AI), implementing the **LUMINOUS INTELLIGENCE** creative concept —
a bright, spatial AI laboratory. The site is a single coherent scroll story
from a cinematic hero through to a validated contact form.

### Sections (in scroll order)

1. **Navigation** — floating, compacts on scroll, accessible mobile dialog.
2. **Cinematic hero** — asymmetric desktop layout, the procedural **ENCOMM
   Core** (React Three Fiber) on the right, eyebrow + headline + dual CTAs +
   scroll indicator on the left, cursor-responsive light (desktop only).
3. **SIGNAL → SENSE → SYSTEM → SCALE** — four-stage scroll narrative with
   per-stage diagrams, line-draw animations, and a scrubbed progress rail.
4. **Systems** — three staggered editorial product presentations, each with a
   custom-built UI demo:
   - **ENCOMM AI Assistant** — typing question → grounded answer with source
     references and connection chips.
   - **Postmatrix** — content calendar, AI suggestions, agent activity, feed
     sparkline.
   - **Custom AI Systems** — animated system diagram (Knowledge → Model →
     Agent → Workflow → Human review ↔ External system) with flowing
     particles, paused when off-screen.
5. **Capabilities** — interactive constellation (hover/focus illuminates
     related connections) paired with a detail grid.
6. **Use-case explorer** — tabbed "Example applications" across 6 patterns;
     explicitly labelled as patterns, not client stories, with no quantified
     claims.
7. **Approach** — DISCOVER · DESIGN · BUILD · INTEGRATE · EVOLVE.
8. **Greece → Global / Trust** — "Built in Greece. Designed for the world."
     with a restrained text reference to Elevate Greece membership (no logo,
     no invented certifications), on a bright background.
9. **Final CTA + Contact** — accessible form with full client-side validation,
     demo-mode submission layer, no fake "sent" state.
10. **Footer** — sharp vector logo, navigation, placeholder legal links,
    pending public email / social (clearly noted as unverified).

---

## Important design decisions

- **Luminous, not dark.** The site is ~88 % light (paper/pearl surfaces) with
  spectral violet/lilac/cyan/magenta as accent light only. Dark navy (`#101426`)
  is reserved for ink, small controls, and borders — never a full-screen
  background.
- **The ENCOMM Core is a branded metaphor, not a logo enlargement.** The
  official 160 px raster logo would be blurry as a hero. Instead I derived a
  procedural 3D crystal inspired by the logo's faceted hexagonal geometry and
  its violet/lilac/cyan material language. The official logo still appears,
  sharp and small, in nav and footer (as vector SVG for crispness at all
  DPRs).
- **Progressive-enhancement motion.** `Reveal` uses `fromTo` with
  `immediateRender: false`, so content is visible by default and only animates
  when ScrollTrigger takes over. If JS or GSAP fails, nothing is stuck hidden.
- **No fake claims.** No invented clients, metrics, testimonials, awards, or
  badges. Use cases are explicitly "Example applications / patterns." A unit
  test guards against quantified claims slipping into use-case content.
- **Contact honesty.** With no endpoint configured, the form runs in clearly
  labelled **demo mode** and never pretends a message was sent.
- **Single animation system per element.** Lenis drives smooth scroll and
  feeds GSAP's ticker; GSAP/ScrollTrigger owns all scroll-triggered motion;
  R3F owns the 3D render loop. No overlaps.
- **React Compiler compatibility.** R3F's imperative mutation of three.js
  objects and `Math.random` particle seeding are idiomatic and cannot satisfy
  the compiler's purity analysis; they're scoped to the render loop with a
  documented eslint-disable. The rest of the code passes the strict
  `react-hooks` rules clean.

---

## Main components

| Area            | File(s)                                                                    |
| --------------- | -------------------------------------------------------------------------- |
| 3D Core         | `components/brand/EncommCore.tsx`, `EncommCore3D.tsx`, `EncommCoreFallback.tsx` |
| Motion          | `components/motion/SmoothScrollProvider.tsx`, `Reveal.tsx`                 |
| UI primitives   | `components/ui/MagneticButton.tsx`, `FormField.tsx`, `Primitives.tsx`     |
| Brand           | `components/brand/BrandMark.tsx` (vector logo)                             |
| Sections        | `components/sections/` (Navigation, Hero, Narrative, Systems, Capabilities, UseCases, Approach, Trust, Contact, Footer) |
| Product demos   | `components/demos/` (AssistantDemo, PostmatrixDemo, CustomSystemDemo)      |
| Content config  | `content/site-content.ts`                                                  |
| Contact layer   | `lib/contact-config.ts`, `lib/contact-validation.ts`                       |
| Design tokens   | `app/globals.css` (Tailwind v4 `@theme`)                                   |

---

## Local URL

Development server: **`http://localhost:3001`** on this machine (port 3000
was in use). Next available port is used automatically — check the terminal.

---

## Commands executed

```bash
npm install
npm run dev          # development
npm run lint         # eslint .
npm run typecheck    # tsc --noEmit
npm run test         # vitest run
npm run build        # next build (production)
npm run qa:shoot     # Playwright screenshots (1440 / 768 / 390)
node scripts/qa-functional.mjs   # functional QA (form, a11y, nav, mobile menu)
```

---

## QA results

### Automated checks

| Check        | Result                                                  |
| ------------ | ------------------------------------------------------- |
| Lint         | ✅ pass (0 errors, 0 warnings)                          |
| Type check   | ✅ pass (`tsc --noEmit`, strict)                        |
| Unit tests   | ✅ 19 / 19 pass                                         |
| Production build | ✅ 7 / 7 routes prerendered (static)                |
| Hydration    | ✅ no mismatch errors (fixed a float-precision SSR/CSR diff in the Trust SVG) |
| Console errors | ✅ none on load                                       |

### Functional QA (Playwright)

| Check                                             | Result |
| ------------------------------------------------- | ------ |
| Form shows errors on empty submit (≥ 4 errors)    | ✅ 7 errors |
| Email validation catches bad format               | ✅ |
| All errors clear after valid input                | ✅ 0 remaining |
| Tab reaches skip link first                       | ✅ |
| 50 focusable elements                             | ✅ |
| Reduced motion → no WebGL canvas, SVG fallback    | ✅ |
| Nav anchor scrolls to #systems                    | ✅ |
| Mobile menu opens (`aria-expanded=true`)          | ✅ |
| Mobile menu has nav links                         | ✅ 6 links |
| Mobile menu closes on Escape                      | ✅ |
| Nav + footer use sharp vector logo                | ✅ |

### Responsive sizes tested

Screenshots captured for each of:

- **Desktop** 1440 × 900
- **Tablet** 768 × 1024
- **Mobile** 390 × 844

All in `artifacts/screenshots/`.

### Visual review notes

- Hero renders the ENCOMM Core (WebGL) on desktop with the asymmetric
  left-text / right-3D layout; mobile stacks vertically without overlap.
- Product demos (Assistant / Postmatrix / Custom) render their custom UIs
  cleanly at all three widths.
- All sections are content-complete across viewports (verified via DOM
  inspection and content-density measurement).
- One transient hydration warning (float precision in a decorative Trust SVG
  circle) was fixed by rounding computed coordinates.

---

## Remaining honest TODO items

These are intentional gaps, not bugs:

1. **Public contact email & social profiles** — `contact.publicEmail` and
   `contact.social` in `content/site-content.ts` are empty by design until
   ENCOMM confirms the verified channels. The footer clearly states these are
   "to be confirmed."
2. **Contact endpoint** — no backend is wired. Set
   `NEXT_PUBLIC_CONTACT_ENDPOINT` to enable real submissions; otherwise the
   form stays in clearly-labelled demo mode.
3. **Privacy & Terms** — `app/privacy/` and `app/terms/` are structural
   placeholders, marked as such in the rendered copy. Replace with verified
   legal language before launch.
4. **Postmatrix naming** — used per the brief's verified description. Confirm
   the exact product positioning with ENCOMM before launch.
5. **Optional ambient video** — the brief allows a generated bright cinematic
   ambient clip of the Core as an enhancement. Not included to avoid blocking
   the build on external generation and to keep the bundle lean. The
   procedural 3D Core is the foundation.
6. **Lighthouse / Core Web Vitals** — a formal Lighthouse pass against the
   production server (not dev) is recommended before launch for final
   perf scoring. The architecture (lazy 3D, capped DPR, off-screen pause,
   local fonts, no remote assets) is built to score well.

---

## Information that still requires confirmation from ENCOMM

- Verified public email address
- Verified social profiles (LinkedIn, etc.)
- Legal Privacy Notice and Terms of Service copy
- Optional: verified client case studies (to replace the "Example
  applications" framing) and any authorized awards / certifications / badges
  (currently none are displayed)
- Optional: the authorized Elevate Greece logo asset, if/when display is
  desired (currently referenced as text only, per the brief)
