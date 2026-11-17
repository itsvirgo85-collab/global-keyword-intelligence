"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/Sidebar";
import { loadSaved, loadProjects, loadHistory } from "@/lib/storage";

// Dashboard shows ONLY real counts from the user's own saved research.
// An empty store shows an empty dashboard — no invented traffic or revenue.
export default function Dashboard() {
  const [counts, setCounts] = useState({ saved: 0, projects: 0, searches: 0, lastRun: "" });
  useEffect(() => {
    const saved = loadSaved();
    const projects = loadProjects();
    const history = loadHistory();
    setCounts({
      saved: saved.length,
      projects: projects.length,
      searches: history.length,
      lastRun: history[0]?.at ?? "",
    });
  }, []);
  const cards = [
    { label: "Saved keywords", value: counts.saved, href: "/saved" },
    { label: "Projects", value: counts.projects, href: "/projects" },
    { label: "Searches run", value: counts.searches, href: "/explorer" },
    { label: "Last search", value: counts.lastRun ? new Date(counts.lastRun).toLocaleString() : "Never", href: "/explorer" },
  ];
  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Your research, counted only from what you have actually saved or run. Nothing here is invented." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="bg-white border rounded-lg p-4 hover:border-indigo-400">
            <p className="text-xs text-slate-500">{c.label}</p>
            <p className="text-2xl font-bold mt-1 truncate">{c.value}</p>
          </Link>
        ))}
      </div>
      <div className="bg-white border rounded-lg p-5 mb-4">
        <h2 className="font-semibold mb-3">Get started — 3 steps</h2>
        <ol className="list-decimal ml-5 space-y-2 text-sm text-slate-700">
          <li><strong>Try free suggestions.</strong> Open the <Link className="text-indigo-600 font-semibold" href="/explorer">Keyword Explorer</Link> and run a seed — no key needed. Try “llc cost” (US / English), “hipoteca” (Spain / Spanish) or “krankenversicherung” (Germany / German).</li>
          <li><strong>Add real metrics.</strong> Import a CSV with volume / CPC / KD in <Link className="text-indigo-600 font-semibold" href="/settings">Settings</Link>, or connect DataForSEO. Until then, volume / CPC / KD show “Not available”.</li>
          <li><strong>Save your first opportunity list.</strong> Save keywords from any table, then review them in <Link className="text-indigo-600 font-semibold" href="/opportunities">Opportunities</Link> and <Link className="text-indigo-600 font-semibold" href="/saved">Saved Keywords</Link>.</li>
        </ol>
      </div>
      <div className="bg-white border rounded-lg p-5">
        <h2 className="font-semibold mb-2">Data availability</h2>
        <ul className="text-sm text-slate-700 space-y-1">
          <li><strong className="text-emerald-700">Available:</strong> Google Autocomplete suggestions, Datamuse related words.</li>
          <li><strong className="text-amber-700">Limited:</strong> Google Trends (relative interest 0–100, not volume) — optional pytrends worker.</li>
          <li><strong className="text-slate-500">Unavailable until connected:</strong> search volume, CPC, paid competition, KD, live SERP, backlinks — connect DataForSEO, Google Ads API or a SERP provider in Settings.</li>
        </ul>
        <p className="text-xs text-slate-500 mt-3">Coverage varies by country and provider. A country selector does not mean equal data coverage everywhere.</p>
      </div>
    </div>
  );
}
