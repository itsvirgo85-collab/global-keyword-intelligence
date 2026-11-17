import { NextResponse } from "next/server";
import { classifyIntent, isLongTail, isQuestion, wordCount } from "@/lib/intent";
import { questionPrefixes } from "@/lib/languages";
import { getCountry } from "@/lib/countries";
import type { KeywordResult } from "@/lib/types";

// GET /api/suggestions?q=llc+cost&country=US&language=en
// Server-side Google Autocomplete fan-out + Datamuse fallback.
// Returns REAL suggestions only. Volume/CPC/KD are always null here —
// they come only from a connected provider or a CSV import.
const UA = "Mozilla/5.0 (compatible; GlobalKeywordIntelligence/0.1; +https://example.com)";

async function fetchAutocomplete(q: string, hl: string): Promise<string[]> {
  try {
    const res = await fetch(
      `https://suggestqueries.google.com/complete/search?client=firefox&hl=${encodeURIComponent(hl)}&q=${encodeURIComponent(q)}`,
      { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as [string, string[]];
    return Array.isArray(data?.[1]) ? data[1] : [];
  } catch {
    return [];
  }
}

async function fetchDatamuse(seed: string): Promise<string[]> {
  try {
    const res = await fetch(
      `https://api.datamuse.com/words?ml=${encodeURIComponent(seed)}&max=20`,
      { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { word: string }[];
    return data.map((d) => d.word).filter(Boolean);
  } catch {
    return [];
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const seed = (url.searchParams.get("q") || "").trim();
  const country = (url.searchParams.get("country") || "US").toUpperCase();
  const language = (url.searchParams.get("language") || getCountry(country)?.defaultLanguage || "en").toLowerCase();
  if (!seed) {
    return NextResponse.json({ error: "Missing required query parameter: q (seed keyword)" }, { status: 400 });
  }
  const retrievedAt = new Date().toISOString();
  const queries = new Set<string>([seed]);
  for (const p of questionPrefixes(language)) queries.add(`${p} ${seed}`);
  for (const letter of "abcdefghijklmnopqrstuvwxyz") queries.add(`${seed} ${letter}`);
  // Fan-out in small batches so one slow query cannot stall the whole run.
  const all: string[] = [];
  const list = [...queries];
  for (let i = 0; i < list.length; i += 8) {
    const batch = await Promise.all(list.slice(i, i + 8).map((q) => fetchAutocomplete(q, language)));
    for (const s of batch) all.push(...s);
  }
  const datamuse = await fetchDatamuse(seed);
  const seen = new Map<string, { sources: string[] }>();
  const add = (kw: string, source: string) => {
    const key = kw.trim().toLowerCase();
    if (!key || key === seed.toLowerCase()) return;
    const ex = seen.get(key);
    if (ex) { if (!ex.sources.includes(source)) ex.sources.push(source); }
    else seen.set(key, { sources: [source] });
  };
  all.forEach((s) => add(s, "Google Autocomplete"));
  datamuse.forEach((s) => add(s, "Datamuse"));
  // Keep the seed itself as the first result, labelled as the seed.
  const results: KeywordResult[] = [
    {
      keyword: seed, country, language, intent: classifyIntent(seed), wordCount: wordCount(seed),
      isQuestion: isQuestion(seed), isLongTail: isLongTail(seed), sources: ["Seed keyword"],
      retrievedAt, volume: null, cpc: null, kd: null, competition: null, currency: null, provider: null,
    },
    ...[...seen.entries()].map(([key, v]) => {
      const keyword = key; // Autocomplete returns lowercase; original spelling is preserved as returned
      return {
        keyword, country, language, intent: classifyIntent(keyword), wordCount: wordCount(keyword),
        isQuestion: isQuestion(keyword), isLongTail: isLongTail(keyword), sources: v.sources,
        retrievedAt, volume: null, cpc: null, kd: null, competition: null, currency: null, provider: null,
      } as KeywordResult;
    }),
  ];
  return NextResponse.json({
    seed, country, language, retrievedAt,
    count: results.length,
    sources: ["Google Autocomplete", "Datamuse"],
    note: "Suggestions only — not verified search volume. Volume, CPC and KD are Not available until a provider or CSV import supplies them.",
    results,
  });
}
