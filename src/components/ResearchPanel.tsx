"use client";
import { useMemo, useState } from "react";
import { COUNTRIES, getCountry } from "@/lib/countries";
import { LANGUAGES, isRtl } from "@/lib/languages";
import { clusterKeywords } from "@/lib/clustering";
import { scoreOpportunity } from "@/lib/opportunity";
import { addHistory } from "@/lib/storage";
import { KeywordTable } from "./KeywordTable";
import type { KeywordResult } from "@/lib/types";

export const SEEDS = [
  { seed: "llc cost", country: "US", language: "en", label: "llc cost — United States / English" },
  { seed: "hipoteca", country: "ES", language: "es", label: "hipoteca — Spain / Spanish" },
  { seed: "krankenversicherung", country: "DE", language: "de", label: "krankenversicherung — Germany / German" },
];

export function ResearchPanel({ mode }: { mode: "explorer" | "suggestions" | "opportunities" | "clustering" }) {
  const [seed, setSeed] = useState("llc cost");
  const [country, setCountry] = useState("US");
  const [language, setLanguage] = useState("en");
  const [results, setResults] = useState<KeywordResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<{ retrievedAt: string; count: number } | null>(null);
  const [intentFilter, setIntentFilter] = useState("all");
  const [questionOnly, setQuestionOnly] = useState(false);
  const [longTailOnly, setLongTailOnly] = useState(false);
  const [tab, setTab] = useState("all");

  const run = async (s?: string, c?: string, l?: string) => {
    const q = (s ?? seed).trim();
    if (!q) { setError("Enter a seed keyword."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`/api/suggestions?q=${encodeURIComponent(q)}&country=${c ?? country}&language=${l ?? language}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Suggestion request failed");
      setResults(data.results);
      setMeta({ retrievedAt: data.retrievedAt, count: data.count });
      addHistory({ seed: q, country: c ?? country, language: l ?? language, count: data.count, at: data.retrievedAt });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Suggestion request failed. Check your connection and try again.");
    } finally { setLoading(false); }
  };

  const filtered = useMemo(() => {
    let rows = results;
    if (intentFilter !== "all") rows = rows.filter((r) => r.intent === intentFilter);
    if (questionOnly) rows = rows.filter((r) => r.isQuestion);
    if (longTailOnly) rows = rows.filter((r) => r.isLongTail);
    if (mode === "suggestions") {
      if (tab === "questions") rows = rows.filter((r) => r.isQuestion);
      if (tab === "long-tail") rows = rows.filter((r) => r.isLongTail);
      if (tab === "commercial") rows = rows.filter((r) => r.intent === "commercial");
      if (tab === "transactional") rows = rows.filter((r) => r.intent === "transactional");
      if (tab === "informational") rows = rows.filter((r) => r.intent === "informational");
      if (tab === "local") rows = rows.filter((r) => r.intent === "local");
    }
    if (mode === "opportunities") {
      return [...rows].sort((a, b) => scoreOpportunity(b).total - scoreOpportunity(a).total);
    }
    return rows;
  }, [results, intentFilter, questionOnly, longTailOnly, tab, mode]);

  const clusters = useMemo(() => (mode === "clustering" ? clusterKeywords(filtered) : []), [filtered, mode]);
  const rtl = isRtl(language);
  const countryObj = getCountry(country);

  return (
    <div dir={rtl ? "rtl" : "ltr"}>
      <div className="bg-white border rounded-lg p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-end">
          <label className="flex-1 min-w-52">
            <span className="text-xs font-semibold text-slate-600">Seed keyword</span>
            <input value={seed} onChange={(e) => setSeed(e.target.value)} placeholder="e.g. llc cost"
              className="w-full border rounded-lg px-3 py-2 mt-1" />
          </label>
          <label>
            <span className="text-xs font-semibold text-slate-600">Country</span>
            <select value={country} onChange={(e) => { setCountry(e.target.value); const c = getCountry(e.target.value); if (c) setLanguage(c.defaultLanguage); }}
              className="w-full border rounded-lg px-3 py-2 mt-1">
              {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name} ({c.code}) — {c.currency}</option>)}
            </select>
          </label>
          <label>
            <span className="text-xs font-semibold text-slate-600">Language</span>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1">
              {(countryObj?.languages ?? ["en"]).map((code) => {
                const l = LANGUAGES.find((x) => x.code === code);
                return <option key={code} value={code}>{l ? `${l.name} (${l.nativeName})` : code}</option>;
              })}
            </select>
          </label>
          <button onClick={() => run()} disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50">
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">Source: Google Autocomplete + Datamuse — real suggestions, not verified volume. Volume / CPC / KD are Not available until a provider or CSV import supplies them.</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {SEEDS.map((s) => (
            <button key={s.label} onClick={() => { setSeed(s.seed); setCountry(s.country); setLanguage(s.language); run(s.seed, s.country, s.language); }}
              className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-medium">Try: {s.label}</button>
          ))}
        </div>
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        {meta && <p className="text-xs text-slate-500 mt-3">Retrieved {meta.retrievedAt} · {meta.count} suggestions · Country {country} · Language {language}</p>}
      </div>

      {results.length > 0 && (
        <div className="flex flex-wrap gap-3 items-center mb-3 text-sm">
          <select value={intentFilter} onChange={(e) => setIntentFilter(e.target.value)} className="border rounded-lg px-2 py-1.5 bg-white">
            <option value="all">All intents</option>
            <option value="informational">Informational</option>
            <option value="commercial">Commercial</option>
            <option value="transactional">Transactional</option>
            <option value="navigational">Navigational</option>
            <option value="local">Local</option>
          </select>
          <label className="flex items-center gap-1"><input type="checkbox" checked={questionOnly} onChange={(e) => setQuestionOnly(e.target.checked)} /> Questions only</label>
          <label className="flex items-center gap-1"><input type="checkbox" checked={longTailOnly} onChange={(e) => setLongTailOnly(e.target.checked)} /> Long-tail only (4+ words)</label>
          <span className="text-slate-500 text-xs">{filtered.length} shown of {results.length}</span>
        </div>
      )}

      {mode === "suggestions" && results.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {["all", "questions", "long-tail", "commercial", "transactional", "informational", "local"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium ${tab === t ? "bg-indigo-600 text-white" : "bg-white border"}`}>
              {t === "all" ? "Matching terms" : t}
            </button>
          ))}
        </div>
      )}

      {mode === "opportunities" && results.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-4 text-sm">
          <p className="font-semibold">How the Opportunity Score works (0–100, documented heuristic — not an Ahrefs KD)</p>
          <p className="text-slate-600 mt-1">Long-tail 25 + Question 15 + Commercial value 20 + Specificity 20 + Suggestion strength 20. Confidence is low until volume/KD come from a provider or CSV import.</p>
          <ul className="mt-3 space-y-2">
            {filtered.slice(0, 10).map((r) => {
              const o = scoreOpportunity(r);
              return <li key={r.keyword}><strong>{o.total}/100</strong> — <span dir="auto">{r.keyword}</span> · {o.reason}</li>;
            })}
          </ul>
        </div>
      )}

      {mode === "clustering" && results.length > 0 ? (
        <div className="space-y-3">
          {clusters.map((c) => (
            <div key={c.id} className="bg-white border rounded-lg p-4">
              <p className="font-semibold">{c.parentTopic} <span className="text-xs text-slate-500">· {c.intent} · {c.country}/{c.language} · {c.keywords.length} keywords</span></p>
              <p className="text-sm text-slate-600 mt-1">{c.keywords.map((k) => k.keyword).join(", ")}</p>
            </div>
          ))}
          {clusters.length === 0 && <p className="text-sm text-slate-500">No clusters — run a search first.</p>}
        </div>
      ) : (
        <KeywordTable rows={filtered} showOpportunity={mode === "opportunities"} />
      )}
    </div>
  );
}
