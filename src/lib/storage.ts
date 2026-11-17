// Local persistence (browser) — the Supabase-ready shape.
// Dashboard counts come ONLY from these records. Empty store = empty dashboard.
import type { Project, SavedKeyword, KeywordResult } from "./types";

const KEYS = { saved: "gki.savedKeywords", projects: "gki.projects", history: "gki.searchHistory" } as const;

export interface SearchHistoryEntry { seed: string; country: string; language: string; count: number; at: string; }

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const raw = window.localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : fallback; }
  catch { return fallback; }
}
function write(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadSaved(): SavedKeyword[] { return read<SavedKeyword[]>(KEYS.saved, []); }
export function saveSaved(list: SavedKeyword[]): void { write(KEYS.saved, list); }
export function loadProjects(): Project[] { return read<Project[]>(KEYS.projects, []); }
export function saveProjects(list: Project[]): void { write(KEYS.projects, list); }
export function loadHistory(): SearchHistoryEntry[] { return read<SearchHistoryEntry[]>(KEYS.history, []); }
export function addHistory(entry: SearchHistoryEntry): void {
  const h = loadHistory();
  h.unshift(entry);
  write(KEYS.history, h.slice(0, 50));
}
export function newSavedId(): string {
  return `kw_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
export function toSaved(kw: KeywordResult): SavedKeyword {
  return { ...kw, id: newSavedId(), status: "to-target", notes: "", tags: [], savedAt: new Date().toISOString() };
}
