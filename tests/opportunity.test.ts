import { describe, it, expect } from "vitest";
import { scoreOpportunity, kdBand } from "../src/lib/opportunity";
import type { KeywordResult } from "../src/lib/types";

function kw(keyword: string, sources: string[] = ["Google Autocomplete"]): KeywordResult {
  return {
    keyword, country: "US", language: "en", intent: "informational", wordCount: keyword.split(" ").length,
    isQuestion: keyword.startsWith("how"), isLongTail: keyword.split(" ").length >= 4,
    sources, retrievedAt: new Date().toISOString(),
    volume: null, cpc: null, kd: null, competition: null, currency: null, provider: null,
  };
}

describe("scoreOpportunity — documented heuristic, 0-100, NOT an Ahrefs KD", () => {
  it("scores a long-tail question higher than a short head term", () => {
    const longTail = scoreOpportunity(kw("how much does an llc cost in texas", ["Google Autocomplete", "Datamuse"]));
    const head = scoreOpportunity(kw("llc"));
    expect(longTail.total).toBeGreaterThan(head.total);
    expect(longTail.total).toBeLessThanOrEqual(100);
  });
  it("gives a question bonus", () => {
    const q = scoreOpportunity(kw("how to form an llc"));
    expect(q.question).toBe(15);
  });
  it("gives commercial/transactional intent points", () => {
    const t = scoreOpportunity(kw("buy llc formation package online"));
    expect(t.commercial).toBeGreaterThan(0);
  });
  it("is low confidence without volume/KD", () => {
    expect(scoreOpportunity(kw("llc cost")).confidence).toBe("low");
  });
  it("explains why in plain language", () => {
    const r = scoreOpportunity(kw("how much does an llc cost in texas"));
    expect(r.reason.length).toBeGreaterThan(10);
    expect(r.reason).toContain("long-tail");
  });
  it("breakdown parts sum to the total", () => {
    const r = scoreOpportunity(kw("best llc formation service for startups"));
    expect(r.longTail + r.question + r.commercial + r.specificity + r.suggestionStrength).toBe(r.total);
  });
});

describe("kdBand", () => {
  it("returns Insufficient data for null KD", () => {
    expect(kdBand(null)).toBe("Insufficient data");
  });
  it("maps bands 0-10 / 11-30 / 31-50 / 51-70 / 71-100", () => {
    expect(kdBand(5)).toBe("Very Easy");
    expect(kdBand(20)).toBe("Easy");
    expect(kdBand(40)).toBe("Medium");
    expect(kdBand(60)).toBe("Hard");
    expect(kdBand(90)).toBe("Very Hard");
  });
});
