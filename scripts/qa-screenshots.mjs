/**
 * QA screenshot capture.
 * Loads the site at 1440, 768, and 390 widths, captures full-page and
 * per-section screenshots, and writes console logs/errors to artifacts.
 *
 * Usage: node scripts/qa-screenshots.mjs [url]
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "artifacts", "screenshots");
mkdirSync(OUT, { recursive: true });

const URL = process.argv[2] || "http://localhost:3001";

const VIEWPORTS = [
  { label: "desktop", width: 1440, height: 900 },
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

async function run() {
  const browser = await chromium.launch();
  const collected = [];
  const errors = [];

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    const consoleLogs = [];
    page.on("console", (msg) => {
      consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    });
    page.on("pageerror", (err) => {
      errors.push(`[${vp.label}] PAGE ERROR: ${err.message}`);
    });

    console.log(`\n=== ${vp.label} ${vp.width}x${vp.height} ===`);
    await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
    // allow fonts, 3D scene, and ScrollTriggers to settle
    await page.waitForTimeout(3500);
    // Force a small real scroll to kick ScrollTrigger recalculations
    await page.evaluate(() => window.scrollTo(0, 1));
    await page.waitForTimeout(400);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);

    // Full page screenshot (top)
    await page.screenshot({
      path: join(OUT, `${vp.label}-hero.png`),
      fullPage: false,
    });

    // Per-section captures (scroll into view, then snapshot)
    for (const sel of SECTIONS) {
      const el = await page.$(sel);
      if (!el) {
        console.log(`  ! ${sel} not found`);
        continue;
      }
      // Smooth scroll to trigger ScrollTrigger naturally
      await el.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(1200);
      try {
        await el.screenshot({
          path: join(OUT, `${vp.label}-${sel.replace("#", "")}.png`),
        });
      } catch {
        await page.screenshot({
          path: join(OUT, `${vp.label}-${sel.replace("#", "")}-vp.png`),
        });
      }
    }

    // Full page full-length capture
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.screenshot({
      path: join(OUT, `${vp.label}-full.png`),
      fullPage: true,
    });

    collected.push({ vp: vp.label, consoleLogs });
    await context.close();
  }

  // Write console summary
  const summary = {
    url: URL,
    errors,
    perViewport: collected.map((c) => ({
      viewport: c.vp,
      consoleLineCount: c.consoleLogs.length,
      warnings: c.consoleLogs.filter((l) => l.startsWith("[warning]")).length,
      errors: c.consoleLogs.filter((l) => l.startsWith("[error]")).length,
      logs: c.consoleLogs,
    })),
  };
  writeFileSync(join(ROOT, "artifacts", "qa-console.json"), JSON.stringify(summary, null, 2));

  await browser.close();
  console.log(`\nDone. Screenshots in ${OUT}`);
  if (errors.length) {
    console.log("PAGE ERRORS:\n" + errors.join("\n"));
    process.exitCode = 1;
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
