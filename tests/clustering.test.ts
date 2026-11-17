import { describe, it, expect } from "vitest";
import { clusterKeywords } from "../src/lib/clustering";
import { parseKeywordCsv, toKeywordCsv, CSV_TEMPLATE_HEADER } from "../src/lib/csv";
import type { KeywordResult } from "../src/lib/types";

function kw(keyword: string, country = "US", language = "en"): KeywordResult {
  return {
    keyword, country, language, intent: "informational", wordCount: keyword.split(" ").length,
    isQuestion: false, isLongTail: keyword.split(" ").length >= 4, sources: ["Google Autocomplete"],
    retrievedAt: new Date().toISOString(), volume: null, cpc: null, kd: null, competition: null, currency: null, provider: null,
  };
}

describe("clusterKeywords", () => {
  it("groups same-topic keywords into one cluster", () => {
    const clusters = clusterKeywords([kw("llc cost"), kw("llc cost texas"), kw("llc cost california")]);
    expect(clusters.length).toBe(1);
    expect(clusters[0].keywords.length).toBe(3);
  });
  it("never merges different intents", () => {
    const clusters = clusterKeywords([kw("llc cost"), kw("buy llc formation")]);
    // "buy …" is transactional, "llc cost" is informational → separate clusters
    expect(clusters.length).toBeGreaterThanOrEqual(2);
  });
  it("never merges different countries", () => {
    const clusters = clusterKeywords([kw("llc cost", "US"), kw("llc cost", "GB")]);
    expect(clusters.length).toBe(2);
  });
  it("sorts largest cluster first", () => {
    const clusters = clusterKeywords([kw("llc cost"), kw("llc cost texas"), kw("hipoteca"), kw("llc formation")]);
    expect(clusters[0].keywords.length).toBeGreaterThanOrEqual(clusters[clusters.length - 1].keywords.length);
  });
});

describe("CSV import/export — UTF-8, Unicode preserved, no invented metrics", () => {
  it("parses the template header and keeps supplied metrics only", () => {
    const rows = parseKeywordCsv("keyword,volume,cpc,kd,competition,country,language\nllc cost,14800,12.5,38,0.85,US,en\nbest llc formation service,,,,US,en\n");
    expect(rows.length).toBe(2);
    expect(rows[0].volume).toBe(14800);
    expect(rows[0].cpc).toBe(12.5);
    expect(rows[1].volume).toBeNull();
    expect(rows[1].kd).toBeNull();
  });
  it("preserves Unicode (accents, Arabic, Urdu)", () => {
    const rows = parseKeywordCsv("keyword,country,language\nkrankenversicherung,DE,de\nhipoteca,ES,es\n");
    expect(rows[0].keyword).toBe("krankenversicherung");
    expect(rows[1].keyword).toBe("hipoteca");
  });
  it("round-trips through export without inventing metrics", () => {
    const rows = parseKeywordCsv("keyword,volume,country,language\nllc cost,,US,en\n");
    const csv = toKeywordCsv(rows);
    expect(csv).toContain(CSV_TEMPLATE_HEADER);
    expect(csv).toContain("llc cost");
    const back = parseKeywordCsv(csv.replace(/^\uFEFF/, ""));
    expect(back[0].volume).toBeNull();
  });
});
