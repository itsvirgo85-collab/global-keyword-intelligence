import Link from "next/link";

export const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/explorer", label: "Keyword Explorer" },
  { href: "/suggestions", label: "Suggestions" },
  { href: "/compare", label: "Country Comparison" },
  { href: "/serp", label: "SERP Analyzer" },
  { href: "/competitor", label: "Competitor Research" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/clustering", label: "Clustering" },
  { href: "/saved", label: "Saved Keywords" },
  { href: "/projects", label: "Projects" },
  { href: "/settings", label: "Settings / Data Sources" },
];

export function Sidebar({ active }: { active: string }) {
  return (
    <aside className="w-64 shrink-0 bg-slate-900 text-slate-200 min-h-screen p-5 hidden md:block">
      <div className="mb-6">
        <p className="text-white font-bold text-lg leading-tight">Global Keyword<br />Intelligence</p>
        <p className="text-xs text-slate-400 mt-1">Free-first · Worldwide · No invented metrics</p>
      </div>
      <nav className="space-y-1">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}
            className={`block rounded-lg px-3 py-2 text-sm ${active === item.href ? "bg-indigo-600 text-white" : "hover:bg-slate-800"}`}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8 rounded-lg bg-slate-800 p-3 text-xs text-slate-300">
        <p className="font-semibold text-white mb-1">Honesty rule</p>
        <p>Volume, CPC and KD show “Not available” until a provider or CSV import supplies them. Trends 0–100 is relative interest, not volume.</p>
      </div>
    </aside>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
    </header>
  );
}

export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
      {label}: <strong>{value}</strong>
    </span>
  );
}

export function NotAvailable({ what }: { what: string }) {
  return <span className="text-xs text-slate-500">Not available — {what}</span>;
}
