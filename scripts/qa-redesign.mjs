/**
 * QA screenshot capture for the LIVING INTELLIGENCE redesign.
 * Captures per-section viewport shots + pinned hero frames at 5 viewports.
 * Full-page shots are skipped (too tall with WebGL — use section shots).
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "artifacts", "redesign-review");
mkdirSync(OUT, { recursive: true });

const URL = process.argv[2] || "http://localhost:3000";

const VIEWPORTS = [
  { label: "desktop", width: 1440, height: 900 },
  { label: "desktop-lg", width: 1920, height: 1080 },
  { label: "tablet-land", width: 1024, height: 768 },
  { label: "tablet", width: 768, height: 1024 },
  { label: "mobile", width: 390, height: 844 },
];

const SECTIONS = [
  "#top",
  "#narrative",
  "#systems",
  "#system-assistant",
  "#system-postmatrix",
  "#system-custom",
  "#capabilities",
  "#use-cases",
  "#approach",
  "#company",
  "#contact",
];

async function safeShot(page, opts) {
  try {
    await page.screenshot({ ...opts, timeout: 45000 });
    return true;
  } catch (e) {
    console.log(`  ! shot failed: ${opts.path ? "..." : ""} ${e.message.slice(0, 80)}`);
    return false;
  }
}

async function run() {
  const browser = await chromium.launch();
  const allErrors = [];

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    const errors = [];
    page.on("pageerror", (e) => {
      const msg = e.message.slice(0, 250);
      errors.push(msg);
      allErrors.push(`[${vp.label}] ${msg}`);
    });

    console.log(`\n=== ${vp.label} ${vp.width}x${vp.height} ===`);
    await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
    // Let WebGL + animations initialize and settle.
    await page.waitForTimeout(5000);
    await page.evaluate(() => window.scrollTo(0, 1));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);

    // hero boot
    await safeShot(page, { path: join(OUT, `${vp.label}-hero.png`) });

    // Pinned hero sequence frames (desktop only)
    if (vp.label === "desktop") {
      const heroPin = await page.$("[data-hero-pin]");
      if (heroPin) {
        const box = await heroPin.boundingBox();
        const totalScroll = (box?.height ?? 2800) - vp.height;
        for (const frac of [0.18, 0.45, 0.72, 0.95]) {
          await page.evaluate((y) => window.scrollTo(0, y), totalScroll * frac);
          await page.waitForTimeout(1400);
          await safeShot(page, { path: join(OUT, `hero-pin-${Math.round(frac * 100)}.png`) });
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(500);
      }
    }

    // section captures
    for (const sel of SECTIONS) {
      const el = await page.$(sel);
      if (!el) {
        console.log(`  ! ${sel} not found`);
        continue;
      }
      await el.scrollIntoViewIfNeeded({ timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(1400);
      // Capture the viewport at this scroll position (more reliable than element shot
      // for sections with fixed/transformed children).
      await safeShot(page, {
        path: join(OUT, `${vp.label}-${sel.replace("#", "")}.png`),
      });
    }

    await context.close();
    if (errors.length) console.log(`  errors: ${errors.length}`);
  }

  writeFileSync(
    join(ROOT, "artifacts", "redesign-console.json"),
    JSON.stringify({ url: URL, errors: allErrors }, null, 2),
  );

  await browser.close();
  console.log(`\nDone. ${allErrors.length} total errors. Screenshots in ${OUT}`);
  if (allErrors.length) {
    console.log("ERRORS:\n" + [...new Set(allErrors)].slice(0, 6).join("\n"));
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
