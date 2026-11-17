"use client";
import { useState } from "react";
import { PageHeader } from "@/components/Sidebar";
import { parseKeywordCsv } from "@/lib/csv";

// Competitor Research — gap analysis from the user's own lists/CSV imports
// until a provider supplies measured competitor keywords. Labelled as such.
export default function CompetitorPage() {
  const [domains, setDomains] = useState("");
  const [ownCsv, setOwnCsv] = useState("");
  const [compCsv, setCompCsv] = useState("");
  const [result, setResult] = useState<{ shared: string[]; missing: string[]; ownOnly: string[] } | null>(null);
  const run = () => {
    const own = new Set(parseKeywordCsv(ownCsv || "keyword\n").map((r) => r.keyword.toLowerCase()));
    const comp = new Set(parseKeywordCsv(compCsv || "keyword\n").map((r) => r.keyword.toLowerCase()));
    setResult({
      shared: [...own].filter((k) => comp.has(k)),
      missing: [...comp].filter((k) => !own.has(k)),
      ownOnly: [...own].filter((k) => !comp.has(k)),
    });
  };
  return (
    <div>
      <PageHeader title="Competitor Research" subtitle="Enter 1–3 competitor domains. Without a provider, gap analysis runs on keyword lists you import — your keywords vs a competitor keyword CSV. Results are labelled measured vs estimated." />
      <div className="bg-white border rounded-lg p-4 mb-4 space-y-3">
        <label className="block text-xs font-semibold text-slate-600">Competitor domains (one per line, up to 3)
          <textarea value={domains} onChange={(e) => setDomains(e.target.value)} rows={3} placeholder={"example.com\ncompetitor.com"} className="w-full border rounded-lg px-3 py-2 mt-1 font-mono text-sm" />
        </label>
        <label className="block text-xs font-semibold text-slate-600">Your keywords (CSV, keyword column)
          <textarea value={ownCsv} onChange={(e) => setOwnCsv(e.target.value)} rows={4} placeholder={"keyword\nllc cost\nllc formation"} className="w-full border rounded-lg px-3 py-2 mt-1 font-mono text-sm" />
        </label>
        <label className="block text-xs font-semibold text-slate-600">Competitor keywords (CSV, keyword column)
          <textarea value={compCsv} onChange={(e) => setCompCsv(e.target.value)} rows={4} placeholder={"keyword\nllc cost\nbusiness formation"} className="w-full border rounded-lg px-3 py-2 mt-1 font-mono text-sm" />
        </label>
        <p className="text-xs text-slate-500">No provider connected: this gap analysis uses only the lists you pasted. It is not measured competitor ranking data. With DataForSEO / OpenSEO connected, this page will show measured organic keywords, positions and estimated traffic.</p>
        <button onClick={run} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold">Find keyword gaps</button>
      </div>
      {result && (
        <div className="grid md:grid-cols-3 gap-3">
          {([["Shared keywords", result.shared], ["Missing — competitor has, you don't", result.missing], ["Only you", result.ownOnly]] as const).map(([title, list]) => (
            <div key={title} className="bg-white border rounded-lg p-4">
              <h2 className="font-semibold text-sm">{title} ({list.length})</h2>
              <ul className="text-sm text-slate-700 mt-2 space-y-1">{list.map((k) => <li key={k}>{k}</li>)}{list.length === 0 && <li className="text-slate-400">None</li>}</ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
