"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/Sidebar";
import { loadSaved, saveSaved } from "@/lib/storage";
import { downloadCsv, toKeywordCsv } from "@/lib/csv";
import { scoreOpportunity, kdBand } from "@/lib/opportunity";
import type { SavedKeyword } from "@/lib/types";

export default function SavedPage() {
  const [list, setList] = useState<SavedKeyword[]>([]);
  const [filter, setFilter] = useState("");
  useEffect(() => { setList(loadSaved()); }, []);
  const update = (next: SavedKeyword[]) => { setList(next); saveSaved(next); };
  const shown = list.filter((s) => s.keyword.toLowerCase().includes(filter.toLowerCase()));
  return (
    <div>
      <PageHeader title="Saved Keywords" subtitle="Keywords you saved from any research table. Stored in your browser (Supabase sync is the next step — see README). Status: to-target, targeting, done." />
      <div className="flex gap-3 mb-3">
        <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter saved keywords…" className="border rounded-lg px-3 py-2 bg-white flex-1" />
        <button onClick={() => downloadCsv("saved-keywords.csv", toKeywordCsv(shown))}
          className="text-xs font-semibold bg-slate-900 text-white px-3 py-2 rounded-lg">Export CSV</button>
      </div>
      {shown.length === 0 ? (
        <p className="text-sm text-slate-500 bg-white border rounded-lg p-4">Nothing saved yet. Save keywords from the Keyword Explorer, Suggestions or Opportunities pages.</p>
      ) : (
        <div className="bg-white border rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left"><tr>
              <th className="px-3 py-2">Keyword</th><th className="px-3 py-2">Country</th><th className="px-3 py-2">Intent</th>
              <th className="px-3 py-2">Volume</th><th className="px-3 py-2">KD</th><th className="px-3 py-2">Opportunity</th><th className="px-3 py-2">Status</th><th className="px-3 py-2"></th>
            </tr></thead>
            <tbody>
              {shown.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="px-3 py-2 font-medium" dir="auto">{s.keyword}</td>
                  <td className="px-3 py-2">{s.country} / {s.language}</td>
                  <td className="px-3 py-2">{s.intent}</td>
                  <td className="px-3 py-2">{s.volume ?? <span className="text-slate-400">Not available</span>}</td>
                  <td className="px-3 py-2">{s.kd === null ? "Insufficient data" : `${s.kd} · ${kdBand(s.kd)}`}</td>
                  <td className="px-3 py-2">{scoreOpportunity(s).total}/100</td>
                  <td className="px-3 py-2">
                    <select value={s.status} onChange={(e) => update(list.map((x) => x.id === s.id ? { ...x, status: e.target.value as SavedKeyword["status"] } : x))}
                      className="border rounded px-1 py-0.5 text-xs">
                      <option value="to-target">To target</option><option value="targeting">Targeting</option><option value="done">Done</option>
                    </select>
                  </td>
                  <td className="px-3 py-2"><button onClick={() => update(list.filter((x) => x.id !== s.id))} className="text-red-600 text-xs font-semibold">Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
