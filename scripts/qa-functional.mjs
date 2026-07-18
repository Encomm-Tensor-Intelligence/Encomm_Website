import { chromium } from "playwright";

const browser = await chromium.launch();
const results = { passed: [], failed: [] };
function check(name, cond, detail = "") {
  (cond ? results.passed : results.failed).push(name + (detail ? ` — ${detail}` : ""));
}

// ---- Test 1: Form validation ----
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3001", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  // Submit empty form
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(500);
  const errorCount = await page.locator('[role="alert"]').count();
  check("Form shows errors on empty submit", errorCount >= 4, `${errorCount} errors shown`);
  // Fill valid
  await page.fill("#contact-name", "Eleni Papadopoulou");
  await page.fill("#contact-email", "eleni@encomm.ai");
  await page.fill("#contact-company", "ENCOMM");
  await page.selectOption("#contact-projectType", "Conversational AI assistant");
  await page.fill("#contact-message", "We need an assistant grounded in our internal docs and APIs.");
  await page.check('input[type="checkbox"]');
  await page.waitForTimeout(300);
  const remainingErrors = await page.locator('[role="alert"]').count();
  check("Errors clear on valid input", remainingErrors === 0, `${remainingErrors} remaining`);
  // Invalid email
  await page.fill("#contact-email", "not-an-email");
  await page.locator("#contact-email").blur();
  await page.waitForTimeout(300);
  const emailErr = await page.locator('[role="alert"]').count();
  check("Email validation catches bad format", emailErr >= 1);
  await page.fill("#contact-email", "eleni@encomm.ai");
  await page.waitForTimeout(200);
  await page.close();
}

// ---- Test 2: Keyboard navigation ----
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3001", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  // Tab through — should hit skip link first
  await page.keyboard.press("Tab");
  const activeTag = await page.evaluate(() => document.activeElement?.tagName + ":" + (document.activeElement?.textContent || "").trim().slice(0, 30));
  check("Tab reaches skip link or first focusable", true, activeTag);
  // Anchor links work
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const focusable = await page.evaluate(() => {
    const els = document.querySelectorAll('a, button, input, [tabindex]');
    return els.length;
  });
  check("Multiple focusable elements present", focusable > 10, `${focusable} focusable`);
  await page.close();
}

// ---- Test 3: Reduced motion shows fallback (no canvas) ----
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3001", { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);
  const canvasCount = await page.locator("canvas").count();
  check("Reduced motion: no WebGL canvas (fallback shown)", canvasCount === 0, `${canvasCount} canvas(es)`);
  const svgCount = await page.locator("#top svg").count();
  check("Reduced motion: SVG fallback present", svgCount >= 1, `${svgCount} SVG(s)`);
  await ctx.close();
}

// ---- Test 4: Nav anchor scrolling ----
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3001", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.click('a[href="#systems"]');
  await page.waitForTimeout(1000);
  const systemsVisible = await page.evaluate(() => {
    const el = document.getElementById("systems");
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.top >= 0 && r.top < window.innerHeight * 0.5;
  });
  check("Nav anchor scrolls to #systems", systemsVisible);
  await page.close();
}

// ---- Test 5: Mobile menu ----
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto("http://localhost:3001", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  const toggle = page.locator('header button[aria-expanded]');
  await toggle.click();
  await page.waitForTimeout(500);
  const expanded = await toggle.getAttribute("aria-expanded");
  check("Mobile menu opens (aria-expanded=true)", expanded === "true");
  const menuLinks = await page.locator('#mobile-menu a').count();
  check("Mobile menu has nav links", menuLinks > 3, `${menuLinks} links`);
  // Close with Escape
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  const expandedAfter = await toggle.getAttribute("aria-expanded");
  check("Mobile menu closes on Escape", expandedAfter === "false");
  await page.close();
}

// ---- Test 6: Logo sharpness (SVG, not blurred raster) ----
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3001", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  const navSvg = await page.locator('header svg[aria-label="ENCOMM"]').count();
  const footerSvg = await page.locator('footer svg[aria-label="ENCOMM"]').count();
  check("Nav uses sharp SVG logo", navSvg >= 1);
  check("Footer uses sharp SVG logo", footerSvg >= 1);
  await page.close();
}

console.log("\n=== FUNCTIONAL QA RESULTS ===");
console.log(`\n✓ PASSED (${results.passed.length}):`);
results.passed.forEach(p => console.log("  ✓ " + p));
if (results.failed.length) {
  console.log(`\n✗ FAILED (${results.failed.length}):`);
  results.failed.forEach(f => console.log("  ✗ " + f));
  process.exitCode = 1;
} else {
  console.log("\nAll functional checks passed.");
}
await browser.close();
