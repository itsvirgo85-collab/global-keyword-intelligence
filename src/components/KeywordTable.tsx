"use client";
import { useState } from "react";
import { classifyIntent } from "@/lib/intent";
import { scoreOpportunity, kdBand } from "@/lib/opportunity";
import { downloadCsv, toKeywordCsv } from "@/lib/csv";
import { loadSaved, saveSaved, toSaved } from "@/lib/storage";
import type { KeywordResult } from "@/lib/types";

export function KeywordTable({ rows, showOpportunity = false }: { rows: KeywordResult[]; showOpportunity?: boolean }) {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  if (rows.length === 0) {
    return <p className="text-sm text-slate-500 border rounded-lg p-4 bg-white">No keywords yet. Run a search, or import a CSV in Settings.</p>;
  }
  const save = (kw: KeywordResult) => {
    const list = loadSaved();
    if (list.some((s) => s.keyword === kw.keyword && s.country === kw.country)) return;
    saveSaved([...list, toSaved(kw)]);
    setSavedIds(new Set([...savedIds, kw.keyword]));
  };
  return (
    <div className="overflow-x-auto bg-white border rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left">
          <tr>
            <th className="px-3 py-2">Keyword</th>
            <th className="px-3 py-2">Intent*</th>
            <th className="px-3 py-2">Words</th>
            <th className="px-3 py-2">Volume</th>
            <th className="px-3 py-2">CPC</th>
            <th className="px-3 py-2">KD</th>
            {showOpportunity && <th className="px-3 py-2">Opportunity</th>}
            <th className="px-3 py-2">Source</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const opp = scoreOpportunity(r);
            return (
              <tr key={`${r.keyword}-${r.country}`} className="border-t">
                <td className="px-3 py-2 font-medium" dir="auto">{r.keyword}</td>
                <td className="px-3 py-2">{classifyIntent(r.keyword)}</td>
                <td className="px-3 py-2">{r.wordCount}{r.isLongTail ? " · long-tail" : ""}{r.isQuestion ? " · Q" : ""}</td>
                <td className="px-3 py-2">{r.volume ?? <span className="text-slate-400">Not available</span>}</td>
                <td className="px-3 py-2">{r.cpc ?? <span className="text-slate-400">Not available</span>}</td>
                <td className="px-3 py-2">{r.kd === null ? <span className="text-slate-400">Insufficient data</span> : `${r.kd} · ${kdBand(r.kd)}`}</td>
                {showOpportunity && <td className="px-3 py-2"><strong>{opp.total}</strong>/100 · {opp.confidence} confidence</td>}
                <td className="px-3 py-2 text-xs text-slate-500">{r.sources.join(", ")}</td>
                <td className="px-3 py-2">
                  <button onClick={() => save(r)} disabled={savedIds.has(r.keyword)}
                    className="text-indigo-600 text-xs font-semibold disabled:text-slate-400">
                    {savedIds.has(r.keyword) ? "Saved" : "Save"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="px-3 py-2 text-xs text-slate-500">* Intent is rule-based, not provider intent. Volume / CPC / KD appear only when a provider or CSV import supplies them.</p>
      <div className="px-3 pb-3">
        <button onClick={() => downloadCsv("keywords.csv", toKeywordCsv(rows))}
          className="text-xs font-semibold bg-slate-900 text-white px-3 py-1.5 rounded-lg">Export CSV (UTF-8)</button>
      </div>
    </div>
  );
}
