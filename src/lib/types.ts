// Shared types. A metric is `number | null` — null means "Not available",
// never a guessed number.
import type { Intent } from "./intent";

export interface KeywordResult {
  keyword: string;
  country: string; // ISO 3166-1 alpha-2
  language: string; // ISO 639-1
  intent: Intent;
  wordCount: number;
  isQuestion: boolean;
  isLongTail: boolean;
  sources: string[]; // e.g. ["Google Autocomplete", "Datamuse"]
  retrievedAt: string; // ISO date
  // Metrics below are null until a provider or CSV import supplies them.
  volume: number | null;
  cpc: number | null;
  kd: number | null;
  competition: number | null; // paid competition 0-1, NOT organic difficulty
  currency: string | null;
  provider: string | null;
}

export interface Cluster {
  id: string;
  parentTopic: string;
  intent: Intent;
  country: string;
  language: string;
  keywords: KeywordResult[];
}

export interface SavedKeyword extends KeywordResult {
  id: string;
  status: "to-target" | "targeting" | "done";
  notes: string;
  tags: string[];
  savedAt: string;
}

export interface Project {
  id: string;
  name: string;
  seed: string;
  country: string;
  language: string;
  createdAt: string;
  keywordIds: string[];
}

export type Availability = "Available" | "Limited" | "Unavailable";
