"use client";
import { useState } from "react";
import { PageHeader } from "@/components/Sidebar";

interface SerpRow { position: number; url: string; domain: string; title: string; }

// SERP Analyzer — honest manual-paste mode when no SERP key is connected.
// Never presents a made-up top 10 as live Google data.
export default function SerpPage() {
  const [keyword, setKeyword] = useState("llc cost");
  const [pasted, setPasted] = useState("");
  const [rows, setRows] = useState<SerpRow[]>([]);
  const analyse = () => {
    const lines = pasted.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).slice(0, 10);
    setRows(lines.map((url, i) => {
      let domain = url;
      try { domain = new URL(url.startsWith("http") ? url : `https://${url}`).hostname; } catch { /* keep raw */ }
      return { position: i + 1, url, domain, title: "(title not supplied — paste URLs only)" };
    }));
  };
  const uniqueDomains = new Set(rows.map((r) => r.domain)).size;
  return (
    <div>
      <PageHeader title="SERP Analyzer" subtitle="Live Google top-10 requires a SERP provider key (see Settings). Until then, use manual mode below — pasted URLs are analysed as manual input, never shown as live Google data." />
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-sm">
        <strong>No SERP provider connected.</strong> Live SERP is Unavailable. Manual mode is available below.
      </div>
      <div className="bg-white border rounded-lg p-4 mb-4">
        <label className="block text-xs font-semibold text-slate-600">Keyword
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" />
        </label>
        <label className="block text-xs font-semibold text-slate-600 mt-3">Paste up to 10 result URLs, one per line
          <textarea value={pasted} onChange={(e) => setPasted(e.target.value)} rows={6} placeholder={"https://example.com/llc-cost\nhttps://example.org/…"}
            className="w-full border rounded-lg px-3 py-2 mt-1 font-mono text-sm" />
        </label>
        <button onClick={analyse} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold mt-3">Analyse pasted results</button>
      </div>
      {rows.length > 0 && (
        <div className="bg-white border rounded-lg overflow-x-auto">
          <p className="px-3 py-2 text-sm"><strong>Manual input for “{keyword}”.</strong> {uniqueDomains} unique domains in the top {rows.length}. {uniqueDomains <= 3 ? "Few unique domains — the SERP looks brand-dominated." : "Good domain diversity — newer pages may have room."} This is an analysis of URLs you pasted, not live Google data.</p>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left"><tr><th className="px-3 py-2">#</th><th className="px-3 py-2">Domain</th><th className="px-3 py-2">URL</th><th className="px-3 py-2">Title</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.position} className="border-t">
                  <td className="px-3 py-2">{r.position}</td><td className="px-3 py-2 font-medium">{r.domain}</td>
                  <td className="px-3 py-2 break-all text-xs">{r.url}</td><td className="px-3 py-2 text-slate-500">{r.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
