import { describe, expect, it } from "vitest";
import {
  nav,
  systems,
  capabilities,
  useCases,
  approach,
  stages,
} from "@/content/site-content";

describe("content integrity", () => {
  it("nav items point to anchors that exist as sections", () => {
    const hrefs = nav.map((n) => n.href);
    hrefs.forEach((h) => expect(h.startsWith("#")).toBe(true));
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("systems each have unique ids and required fields", () => {
    const ids = systems.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    systems.forEach((s) => {
      expect(s.name.length).toBeGreaterThan(0);
      expect(s.line.length).toBeGreaterThan(0);
      expect(s.features.length).toBeGreaterThan(2);
    });
  });

  it("stages cover SIGNAL→SENSE→SYSTEM→SCALE in order", () => {
    expect(stages.map((s) => s.key)).toEqual([
      "signal",
      "sense",
      "system",
      "scale",
    ]);
  });

  it("capability relations reference existing capabilities", () => {
    const ids = new Set(capabilities.map((c) => c.id));
    capabilities.forEach((c) =>
      c.relates.forEach((r) => expect(ids.has(r)).toBe(true)),
    );
  });

  it("approach has 5 ordered steps", () => {
    expect(approach.map((a) => a.index)).toEqual([
      "01",
      "02",
      "03",
      "04",
      "05",
    ]);
  });

  it("use cases never contain quantified claims", () => {
    // crude guard against fabricated metrics
    const banned = /\b\d+(\.\d+)?%|\b\d+x\b|saved|revenue|ROI/i;
    useCases.forEach((u) => {
      expect(banned.test(u.challenge)).toBe(false);
      expect(banned.test(u.workflow)).toBe(false);
    });
  });
});
