"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/Sidebar";
import { loadProjects, saveProjects, loadSaved } from "@/lib/storage";
import type { Project } from "@/lib/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [seed, setSeed] = useState("llc cost");
  const [country, setCountry] = useState("US");
  const [language, setLanguage] = useState("en");
  useEffect(() => { setProjects(loadProjects()); }, []);
  const create = () => {
    if (!name.trim()) return;
    const p: Project = { id: `pj_${Date.now().toString(36)}`, name: name.trim(), seed, country, language, createdAt: new Date().toISOString(), keywordIds: [] };
    const next = [p, ...projects];
    setProjects(next); saveProjects(next); setName("");
  };
  const savedCount = loadSaved().length;
  return (
    <div>
      <PageHeader title="Projects" subtitle="A project is a country + language + seed + saved keyword list. Projects group your research so it can be revisited and exported." />
      <div className="bg-white border rounded-lg p-4 mb-4 flex flex-wrap gap-3 items-end">
        <label className="flex-1 min-w-48 text-xs font-semibold text-slate-600">Project name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. LLC site — US launch" className="w-full border rounded-lg px-3 py-2 mt-1 font-normal" />
        </label>
        <label className="text-xs font-semibold text-slate-600">Seed
          <input value={seed} onChange={(e) => setSeed(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1 font-normal" />
        </label>
        <label className="text-xs font-semibold text-slate-600">Country
          <input value={country} onChange={(e) => setCountry(e.target.value.toUpperCase())} className="w-20 border rounded-lg px-3 py-2 mt-1 font-normal" />
        </label>
        <label className="text-xs font-semibold text-slate-600">Language
          <input value={language} onChange={(e) => setLanguage(e.target.value.toLowerCase())} className="w-20 border rounded-lg px-3 py-2 mt-1 font-normal" />
        </label>
        <button onClick={create} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold">Create project</button>
      </div>
      <p className="text-sm text-slate-500 mb-3">{projects.length} projects · {savedCount} saved keywords in total.</p>
      {projects.length === 0 ? (
        <p className="text-sm text-slate-500 bg-white border rounded-lg p-4">No projects yet. Create your first project above.</p>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p.id} className="bg-white border rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-slate-500">Seed “{p.seed}” · {p.country} / {p.language} · Created {new Date(p.createdAt).toLocaleDateString()}</p>
              </div>
              <button onClick={() => { const next = projects.filter((x) => x.id !== p.id); setProjects(next); saveProjects(next); }}
                className="text-red-600 text-xs font-semibold">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
