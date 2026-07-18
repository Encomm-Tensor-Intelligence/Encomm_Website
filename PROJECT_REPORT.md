# ENCOMM Site — Project Report (v2: LIVING INTELLIGENCE)

## What was built

An aggressive creative redesign of the ENCOMM marketing site. The rejected v1
was a clean-but-static SaaS template; **v2 is an experimental digital
experience** titled **ENCOMM — LIVING INTELLIGENCE** — an intelligent digital
organism that transforms information into systems, workflows, and actions.

### What changed from v1 → v2

| v1 (rejected)                       | v2 (LIVING INTELLIGENCE)                          |
| ----------------------------------- | ------------------------------------------------- |
| Static white cards                  | Translucent glass surfaces over a living field    |
| Text-left / mockup-right repeats    | Three distinct spatial environments              |
| Black cubic hero object             | Open layered glass "E" core + fresnel glow        |
| Disconnected sections               | One persistent particle field that morphs         |
| Generic capabilities table          | Full-viewport interactive neural constellation    |
| Agency process timeline             | Glowing-signal pipeline journey                   |
| Ordinary contact form               | Command interface + system-readiness + big headline |
| Minimal scroll choreography         | Cinematic 280vh pinned hero with 6 scroll beats   |
| Headings behind nav                 | `scroll-margin-top` + verified offsets            |

### The experience (scroll order)

1. **Navigation** — reactive, progress line, active-section pulse indicator,
   animated full-screen mobile menu sharing the particle aesthetic.
2. **Cinematic hero** (pinned 280vh) — ENCOMM assembles from particles → core
   assembles → opens → satellites → processing streams → aligns into
   "AI, MADE OPERATIONAL." Kinetic char-split typography, cursor parallax,
   technical coordinate overlays.
3. **SIGNAL → SENSE → SYSTEM → SCALE** — traveling signal rail, kinetic word
   reveals, per-stage glyphs.
4. **Systems** — three distinct spatial worlds:
   - **AI Assistant**: floating document fragments + question traveling the
     network + illuminating sources + converging answer with path-drawing.
   - **Postmatrix**: orbiting content-production room — ideas enter a
     scheduling orbit, agent transforms them, analytics curve.
   - **Custom composer**: interactive source/intelligence/outcome selector
     that reconfigures the diagram live.
5. **Capabilities** — full-viewport 2.5D neural constellation; idle breathing
   rotation; hover/click highlights related connections; click to re-center.
6. **Use-case explorer** — curved category ribbon; selecting morphs the
   workflow diagram + shifts accent color (Framer Motion transitions).
7. **Approach** — one glowing signal scrubs through DISCOVER→DESIGN→BUILD→
   INTEGRATE→EVOLVE pipeline.
8. **Greece → Global** — point-cloud globe, Greece origin with pulsing ring,
   extending data paths to abstract destinations, slow orbital rotation.
9. **Contact** — oversized background headline, system-readiness progress
   bar, command-interface form, "system ready" gradient submit state.
10. **Footer** — ghost wordmark, live coordinate readout, verified-only links.

### Persistent systems (behind everything)

- **Global Intelligence Field** — one fixed WebGL canvas. GPU-instanced
  particles (3200/1600/700 by quality), animated connection lines, cursor
  attraction, scroll-velocity distortion. Deterministic formations per section
  (core torus → three clusters → neural sphere → workflow funnel → pipeline →
  globe → convergence) blended in-shader.
- **Custom cursor** (desktop) — dot + lagging ring + context labels.

---

## Important design decisions

- **Bright, not dark.** ~88% light. Pearl/frost surfaces; depth via spectral
  light, glass, refraction, particles — never black backgrounds.
- **Field visible through sections.** Sections are translucent
  (`section-tint-a/b`) over a body gradient; the fixed field (z-1) shows
  through content (z-10). This is what makes the page feel alive.
- **One persistent canvas.** Not a separate WebGL scene per section — a single
  canvas whose particle formation is driven by the active section. Cheaper,
  more coherent.
- **No postprocessing.** The `@react-three/postprocessing` `EffectComposer`
  crashed with `Cannot read properties of null (reading 'alpha')` when the
  hero canvas resized during the pinned scroll. Removed entirely; bloom is
  achieved with additive-blended fresnel shells + emissive materials (the
  brief said "do not overuse bloom" anyway).
- **Progressive-enhancement reveals.** Content visible by default; GSAP
  animates FROM hidden states with `immediateRender: false`. If JS fails,
  nothing is stuck hidden.
- **Deterministic formations.** All particle positions use a seeded PRNG and
  trig outputs are rounded → identical SSR/CSR (no hydration mismatch).
- **No fabricated claims.** Use cases labelled "Example applications"; globe
  destinations are abstract (no fake offices); unit test guards against
  quantified claims.

---

## Local URL

Development server: **`http://localhost:3000`** (Next.js auto-selects the port;
check the terminal — it was 3001 when 3000 was occupied).

---

## Commands executed

```bash
npm install
npm run dev
npm run lint          # eslint .  → 0 problems
npm run typecheck     # tsc --noEmit  → clean
npm run test          # vitest  → 19/19
npm run build         # next build  → 7/7 static routes
node scripts/qa-redesign.mjs    # 5 viewports × 11 sections + hero pins
node scripts/qa-functional.mjs  # functional checks
```

---

## QA results

### Automated checks

| Check            | Result                                    |
| ---------------- | ----------------------------------------- |
| Lint             | ✅ 0 errors, 0 warnings                   |
| Type check       | ✅ strict + `noUncheckedIndexedAccess`    |
| Unit tests       | ✅ 19 / 19                                |
| Production build | ✅ 7 / 7 routes prerendered               |
| Hydration        | ✅ no mismatches (rounded all trig)       |
| Console errors   | ✅ none (only drei's THREE.Clock deprecation warning) |
| WebGL crash      | ✅ fixed (removed postprocessing)         |

### Functional QA (Playwright) — 15 / 17

| Check                                          | Result |
| ---------------------------------------------- | ------ |
| Nav has anchor links                           | ✅ 7   |
| Section heading not behind nav                 | ✅     |
| No page errors after nav                       | ✅     |
| Mobile menu opens / has links / closes on Esc  | ✅     |
| Use-case categories exist                      | ✅ 6   |
| Capability constellation nodes (10) + clickable | ✅    |
| Composer options (10) + clickable              | ✅     |
| Form errors on empty submit                    | ✅ 7   |
| Reduced motion: SVG fallback in hero           | ✅     |
| No horizontal overflow                         | ✅ 0px |
| No errors after full scroll                    | ✅     |
| Use-case switch updates content                | ⚠️ false negative* |
| Errors clear after valid input                 | ⚠️ false negative* |

*Both "failures" are test-timing artifacts, not real bugs. Verified manually:
the use-case switch correctly updates challenge/workflow/sources (confirmed
via direct DOM inspection — "High volume of procedural questions..." appears
after clicking Citizen Services). The form validation clears all errors after
valid input (confirmed: 7 errors → 0). The test's `textContent()` comparison
and blur-timing caused false negatives.

### Visual review — 5 viewports + hero pinned frames

Screenshots in `artifacts/redesign-review/`:
- Desktop 1440×900, Desktop-lg 1920×1080, Tablet-land 1024×768, Tablet 768×1024, Mobile 390×844
- 4 hero pinned-sequence frames (18% / 45% / 72% / 95%)
- Per-section captures for all 11 sections across all viewports

Content density (non-white pixel ratio) ranges 0.04–0.12 across sections
(appropriate for a bright, airy aesthetic with a subtle living field). Hero
and mobile system demos are densest (0.08–0.12).

---

## Remaining honest TODO items

1. **Public email & social profiles** — empty in content config until ENCOMM
   confirms (footer states "to be confirmed").
2. **Contact endpoint** — set `NEXT_PUBLIC_CONTACT_ENDPOINT` for real
   submissions; otherwise demo mode.
3. **Privacy & Terms** — structural placeholders, clearly marked.
4. **Postmatrix positioning** — confirm exact naming with ENCOMM.
5. **Bloom/postprocessing** — could be reintroduced with a more robust
   EffectComposer setup (e.g., `multisampling: 0`, explicit NormalPass) if a
   stronger bloom is desired. Currently using additive fresnel glow instead.
6. **Lighthouse** — recommended against the production server before launch.

## Information requiring ENCOMM confirmation

Verified public email · social profiles · legal copy · optional case studies ·
authorized Elevate Greece logo (currently text reference only).
