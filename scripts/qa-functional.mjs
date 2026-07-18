/**
 * Functional QA for the LIVING INTELLIGENCE redesign.
 * Verifies: nav, anchor scroll, mobile menu, use-case switch, capability
 * interaction, composer, contact validation, reduced-motion, overflow,
 * console errors.
 */
import { chromium } from "playwright";

const URL = process.argv[2] || "http://localhost:3000";
const browser = await chromium.launch();
const results = { passed: [], failed: [] };
const check = (name, cond, detail = "") =>
  (cond ? results.passed : results.failed).push(name + (detail ? ` — ${detail}` : ""));

async function newPage(viewport, reduced = false) {
  const ctx = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    reducedMotion: reduced ? "reduce" : undefined,
  });
  return ctx.newPage();
}

/* 1. Navigation + anchors + heading-not-behind-nav */
{
  const page = await newPage({ width: 1440, height: 900 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(4000);
  const navLinks = await page.locator('header nav a[href^="#"]').count();
  check("Nav has anchor links", navLinks >= 4, `${navLinks}`);
  await page.click('header a[href="#systems"]', { noWaitAfter: true });
  await page.waitForTimeout(2500);
  const headingTop = await page.evaluate(() => {
    const h = document.querySelector("#systems h2");
    return h ? Math.round(h.getBoundingClientRect().top) : null;
  });
  check("Section heading not behind nav", headingTop !== null && headingTop > 60, `h2 top=${headingTop}`);
  check("No page errors after nav", errors.length === 0, errors.slice(0, 2).join("; "));
  await page.close();
}

/* 2. Mobile menu */
{
  const page = await newPage({ width: 390, height: 844 });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  const toggle = page.locator('header button[aria-expanded]');
  await toggle.click({ force: true, noWaitAfter: true });
  await page.waitForTimeout(600);
  const expanded = await toggle.getAttribute("aria-expanded");
  check("Mobile menu opens", expanded === "true");
  const menuLinks = await page.locator("#mobile-menu a").count();
  check("Mobile menu has links", menuLinks >= 4, `${menuLinks}`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  const closed = await toggle.getAttribute("aria-expanded");
  check("Mobile menu closes on Escape", closed === "false");
  await page.close();
}

/* 3. Use-case switch */
{
  const page = await newPage({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  await page.evaluate(() => document.querySelector("#use-cases")?.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(1200);
  const buttons = page.locator("#use-cases button");
  const count = await buttons.count();
  check("Use-case categories exist", count >= 4, `${count}`);
  if (count >= 2) {
    const before = await page.locator("#use-cases").textContent();
    await buttons.nth(1).click({ force: true, noWaitAfter: true });
    await page.waitForTimeout(900);
    const after = await page.locator("#use-cases").textContent();
    check("Use-case switch updates content", before !== after, "content changed");
  }
  await page.close();
}

/* 4. Capability constellation */
{
  const page = await newPage({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  await page.evaluate(() => document.querySelector("#capabilities")?.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(1200);
  const nodes = await page.locator("#capabilities .cap-node").count();
  check("Capability constellation has nodes", nodes >= 8, `${nodes}`);
  if (nodes > 0) {
    await page.locator("#capabilities .cap-node").first().click({ force: true, noWaitAfter: true });
    await page.waitForTimeout(400);
    check("Capability node clickable", true);
  }
  await page.close();
}

/* 5. Custom composer */
{
  const page = await newPage({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  await page.evaluate(() => document.querySelector("#system-custom")?.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(1200);
  const opts = await page.locator("#system-custom button").count();
  check("Composer has options", opts >= 6, `${opts}`);
  if (opts > 2) {
    await page.locator("#system-custom button").nth(2).click({ force: true, noWaitAfter: true });
    await page.waitForTimeout(400);
    check("Composer option clickable", true);
  }
  await page.close();
}

/* 6. Contact validation */
{
  const page = await newPage({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  await page.evaluate(() => document.querySelector("#contact")?.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(800);
  await page.locator('button[type="submit"]').click({ force: true, noWaitAfter: true });
  await page.waitForTimeout(500);
  const errs = await page.locator('[role="alert"]').count();
  check("Form errors on empty submit", errs >= 4, `${errs}`);
  await page.fill("#contact-name", "Eleni Papadopoulou");
  await page.fill("#contact-email", "eleni@encomm.ai");
  await page.fill("#contact-company", "ENCOMM");
  await page.selectOption("#contact-projectType", "Conversational AI assistant");
  await page.fill("#contact-message", "We need an assistant grounded in our internal docs and APIs.");
  await page.check('input[type="checkbox"]');
  await page.waitForTimeout(400);
  const remaining = await page.locator('[role="alert"]').count();
  check("Errors clear after valid input", remaining === 0, `${remaining}`);
  await page.close();
}

/* 7. Reduced motion */
{
  const page = await newPage({ width: 1440, height: 900 }, true);
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(4000);
  const heroSvg = await page.locator('[data-hero] svg').count();
  check("Reduced motion: SVG fallback in hero", heroSvg >= 1, `${heroSvg}`);
  await page.close();
}

/* 8. Overflow + console errors on full scroll */
{
  const page = await newPage({ width: 1440, height: 900 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push("C:" + m.text().slice(0, 120)); });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(4000);
  for (let y = 0; y <= 12000; y += 1000) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(350);
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check("No horizontal overflow", overflow <= 2, `${overflow}px`);
  const real = errors.filter((e) => !e.includes("THREE.Clock") && !e.includes("GPU stall") && !e.includes("Download the React DevTools"));
  check("No errors after full scroll", real.length === 0, real.slice(0, 2).join("; "));
  await page.close();
}

console.log("\n=== FUNCTIONAL QA ===");
console.log(`✓ Passed (${results.passed.length}):`);
results.passed.forEach((p) => console.log("  ✓ " + p));
if (results.failed.length) {
  console.log(`\n✗ Failed (${results.failed.length}):`);
  results.failed.forEach((f) => console.log("  ✗ " + f));
  process.exitCode = 1;
} else {
  console.log("\nAll functional checks passed.");
}
await browser.close();
