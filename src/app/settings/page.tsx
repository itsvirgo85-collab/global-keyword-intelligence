"use client";
import { useRef, useState } from "react";
import { PageHeader } from "@/components/Sidebar";
import { PROVIDERS } from "@/lib/providers";
import { CSV_TEMPLATE, CSV_TEMPLATE_HEADER, parseKeywordCsv, downloadCsv } from "@/lib/csv";
import { loadSaved, saveSaved, toSaved } from "@/lib/storage";
import { KeywordTable } from "@/components/KeywordTable";

export default function SettingsPage() {
  const [imported, setImported] = useState<ReturnType<typeof parseKeywordCsv>>([]);
  const [importMsg, setImportMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (file: File) => {
    const text = await file.text();
    const rows = parseKeywordCsv(text);
    setImported(rows);
    setImportMsg(`${rows.length} keywords imported from ${file.name}. Volume/CPC/KD are stored only where the file supplied them.`);
    if (rows.length > 0) {
      const existing = loadSaved();
      saveSaved([...existing, ...rows.map(toSaved)]);
    }
  };

  return (
    <div>
      <PageHeader title="Settings / Data Sources" subtitle="Provider abstraction layer. Keys are server-side only (env vars) — never in frontend code. No provider is required for the free-first MVP." />
      <h2 className="font-semibold mb-2">CSV import — add real metrics</h2>
      <div className="bg-white border rounded-lg p-4 mb-6">
        <p className="text-sm text-slate-600">Columns: <code className="bg-slate-100 px-1 rounded">{CSV_TEMPLATE_HEADER}</code>. Only <code>keyword</code> is required. UTF-8, Unicode preserved.</p>
        <div className="flex gap-2 mt-3">
          <button onClick={() => downloadCsv("keyword-template.csv", CSV_TEMPLATE)} className="text-xs font-semibold bg-slate-900 text-white px-3 py-2 rounded-lg">Download template</button>
          <button onClick={() => fileRef.current?.click()} className="text-xs font-semibold bg-indigo-600 text-white px-3 py-2 rounded-lg">Import CSV…</button>
          <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
        </div>
        {importMsg && <p className="text-sm text-emerald-700 mt-3">{importMsg}</p>}
        {imported.length > 0 && <div className="mt-4"><KeywordTable rows={imported} /></div>}
      </div>

      <h2 className="font-semibold mb-2">Providers</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {PROVIDERS.map((p) => (
          <div key={p.id} className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <p className="font-semibold">{p.name}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.status === "Available" ? "bg-emerald-100 text-emerald-800" : p.status === "Limited" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"}`}>{p.status}</span>
            </div>
            <p className="text-sm text-slate-600 mt-2"><strong>Provides:</strong> {p.provides.join(", ")}</p>
            <p className="text-sm text-slate-600"><strong>Cost:</strong> {p.cost}</p>
            <p className="text-sm text-slate-600"><strong>Terms:</strong> {p.licenceOrTerms}</p>
            <ul className="text-xs text-slate-500 mt-2 list-disc ml-4">{p.setup.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
        ))}
      </div>

      <h2 className="font-semibold mt-6 mb-2">KD bands — shown only with evidence</h2>
      <div className="bg-white border rounded-lg p-4 text-sm">
        <p>0–10 Very Easy · 11–30 Easy · 31–50 Medium · 51–70 Hard · 71–100 Very Hard. Without SERP/backlink evidence the app shows “Insufficient data”, never a made-up score.</p>
        <p className="text-slate-500 mt-2">Paid competition is never organic difficulty. Search volume is never traffic. Trends 0–100 is relative interest, not volume.</p>
      </div>
    </div>
  );
}
