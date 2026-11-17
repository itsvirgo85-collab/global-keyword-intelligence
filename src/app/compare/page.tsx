"use client";
import { useState } from "react";
import { PageHeader } from "@/components/Sidebar";
import { COUNTRIES, getCountry } from "@/lib/countries";
import { downloadCsv } from "@/lib/csv";

interface Row { country: string; name: string; currency: string; volume: string; cpc: string; kd: string; source: string; }

export default function ComparePage() {
  const [seed, setSeed] = useState("llc cost");
  const [selected, setSelected] = useState<string[]>(["US", "GB", "CA", "AU", "DE"]);
  const [rows, setRows] = useState<Row[]>([]);
  const toggle = (code: string) => {
    setSelected((prev) => prev.includes(code) ? prev.filter((c) => c !== code) : prev.length >= 5 ? prev : [...prev, code]);
  };
  const run = () => {
    if (!seed.trim()) return;
    setRows(selected.map((code) => {
      const c = getCountry(code)!;
      return {
        country: code, name: c.name, currency: c.currency,
        volume: "Not available", cpc: "Not available", kd: "Insufficient data",
        source: "No provider connected — connect DataForSEO / Google Ads API or import a CSV in Settings.",
      };
    }));
  };
  return (
    <div>
      <PageHeader title="Country Comparison" subtitle="One seed keyword across up to 5 markets. Every country gets its own row — volumes are never combined without labelling, and currencies are never compared as if identical." />
      <div className="bg-white border rounded-lg p-4 mb-4">
        <label className="block text-xs font-semibold text-slate-600">Seed keyword
          <input value={seed} onChange={(e) => setSeed(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" />
        </label>
        <p className="text-xs font-semibold text-slate-600 mt-4 mb-2">Select up to 5 countries ({selected.length}/5)</p>
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
          {COUNTRIES.map((c) => (
            <button key={c.code} onClick={() => toggle(c.code)}
              className={`text-xs px-2.5 py-1 rounded-full border ${selected.includes(c.code) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white"}`}>
              {c.name} ({c.code})
            </button>
          ))}
        </div>
        <button onClick={run} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold mt-4">Compare</button>
      </div>
      {rows.length > 0 && (
        <div className="overflow-x-auto bg-white border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left"><tr>
              <th className="px-3 py-2">Country</th><th className="px-3 py-2">Currency</th>
              <th className="px-3 py-2">Volume</th><th className="px-3 py-2">CPC</th><th className="px-3 py-2">KD</th><th className="px-3 py-2">Source</th>
            </tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.country} className="border-t">
                  <td className="px-3 py-2 font-medium">{r.name} ({r.country})</td>
                  <td className="px-3 py-2">{r.currency}</td>
                  <td className="px-3 py-2 text-slate-500">{r.volume}</td>
                  <td className="px-3 py-2 text-slate-500">{r.cpc}</td>
                  <td className="px-3 py-2 text-slate-500">{r.kd}</td>
                  <td className="px-3 py-2 text-xs text-slate-500">{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-3 pb-3 pt-2">
            <button onClick={() => downloadCsv("country-comparison.csv", "keyword,country,volume,cpc,kd\n" + rows.map((r) => `${seed},${r.country},,,`).join("\n"))}
              className="text-xs font-semibold bg-slate-900 text-white px-3 py-1.5 rounded-lg">Export comparison CSV</button>
          </div>
        </div>
      )}
    </div>
  );
}
