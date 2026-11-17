// CSV import / export — UTF-8, Unicode preserved.
// Import columns: keyword, volume, cpc, kd, competition, country, language
// Only the keyword column is required. Volume/CPC/KD are optional and are
// stored ONLY when present in the file — never guessed.
import type { KeywordResult } from "./types";
import { classifyIntent, isLongTail, isQuestion, wordCount } from "./intent";

export const CSV_TEMPLATE_HEADER = "keyword,volume,cpc,kd,competition,country,language";
export const CSV_TEMPLATE = `${CSV_TEMPLATE_HEADER}\nllc cost,14800,12.5,38,0.85,US,en\nbest llc formation service,,,,US,en\n`;

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "", inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; } else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

function toNum(v: string | undefined): number | null {
  if (v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function parseKeywordCsv(text: string, fallbackCountry = "US", fallbackLanguage = "en"): KeywordResult[] {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length < 2) return [];
  const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  const idx = (name: string) => header.indexOf(name);
  const retrievedAt = new Date().toISOString();
  const results: KeywordResult[] = [];
  for (const line of lines.slice(1)) {
    const cols = parseCsvLine(line);
    const keyword = cols[idx("keyword")] ?? "";
    if (!keyword) continue;
    results.push({
      keyword,
      country: (cols[idx("country")] || fallbackCountry).toUpperCase(),
      language: (cols[idx("language")] || fallbackLanguage).toLowerCase(),
      intent: classifyIntent(keyword),
      wordCount: wordCount(keyword),
      isQuestion: isQuestion(keyword),
      isLongTail: isLongTail(keyword),
      sources: ["CSV import"],
      retrievedAt,
      volume: toNum(cols[idx("volume")]),
      cpc: toNum(cols[idx("cpc")]),
      kd: toNum(cols[idx("kd")]),
      competition: toNum(cols[idx("competition")]),
      currency: null,
      provider: "CSV import",
    });
  }
  return results;
}

function esc(v: string | number | null): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toKeywordCsv(rows: KeywordResult[]): string {
  const header = CSV_TEMPLATE_HEADER;
  const lines = rows.map((r) =>
    [r.keyword, r.volume, r.cpc, r.kd, r.competition, r.country, r.language].map(esc).join(","),
  );
  return "\uFEFF" + [header, ...lines].join("\n");
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
