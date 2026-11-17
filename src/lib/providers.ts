// Provider abstraction layer (PDF §7, §23).
// Every provider is an adapter behind this interface, so a paid provider can
// be added later without rewriting the app. Keys live in server-side env vars
// only — never in frontend code, never NEXT_PUBLIC_.
export type ProviderId = "autocomplete" | "datamuse" | "dataforseo" | "google-ads" | "trends" | "gsc" | "serp" | "serpbear" | "openseo";

export interface Provider {
  id: ProviderId;
  name: string;
  status: "Available" | "Limited" | "Unavailable" | "Not connected";
  provides: string[];
  cost: string;
  setup: string[];
  licenceOrTerms: string;
}

export const PROVIDERS: Provider[] = [
  {
    id: "autocomplete", name: "Google Autocomplete", status: "Available",
    provides: ["Keyword suggestions", "Long-tail expansion", "Question ideas"],
    cost: "Free, no key. Rate-limited from datacentre IPs.",
    setup: ["No setup — built into the Keyword Explorer."],
    licenceOrTerms: "Suggestions are NOT verified search volumes.",
  },
  {
    id: "datamuse", name: "Datamuse", status: "Available",
    provides: ["Related words", "Synonyms / semantically related terms"],
    cost: "Free, no key.",
    setup: ["No setup — fallback suggestion source."],
    licenceOrTerms: "Related words only; no volume, CPC or KD.",
  },
  {
    id: "dataforseo", name: "DataForSEO", status: "Not connected",
    provides: ["Search volume", "CPC", "Paid competition", "Keyword difficulty", "SERP", "Backlinks"],
    cost: "Pay-per-call, ~$0.05 per keyword search. $1 free credit on signup.",
    setup: ["Create an account at dataforseo.com", "Set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD in .env.local", "Restart the app"],
    licenceOrTerms: "Paid third-party API. Data quality is DataForSEO's, not Ahrefs'.",
  },
  {
    id: "google-ads", name: "Google Ads API (Keyword Planner)", status: "Not connected",
    provides: ["Average monthly searches", "Top-of-page bid range", "Advertiser competition"],
    cost: "Free API, but access needs an approved Ads account + developer token.",
    setup: ["Apply for Google Ads API access", "Set GOOGLE_ADS_* variables in .env.local"],
    licenceOrTerms: "Requires suitable account setup, authorisation and quota.",
  },
  {
    id: "trends", name: "Google Trends (via pytrends)", status: "Limited",
    provides: ["Relative interest over time (0-100)", "Related queries", "Rising queries"],
    cost: "Free, unofficial API.",
    setup: ["Optional Python worker using GeneralMills/pytrends (see README — licence unclear, verify before commercial use)"],
    licenceOrTerms: "Trends values are RELATIVE interest, never absolute search volume.",
  },
  {
    id: "gsc", name: "Google Search Console", status: "Unavailable",
    provides: ["Your own site's real clicks, impressions, positions"],
    cost: "Free.",
    setup: ["Planned for a future phase — OAuth integration not yet built."],
    licenceOrTerms: "First-party data only; never a substitute for external keyword volume.",
  },
  {
    id: "serp", name: "SERP API (SerpApi / Serper)", status: "Not connected",
    provides: ["Live Google top-10/20", "SERP features", "Snippets"],
    cost: "Pay-per-call; free tiers exist for small lists.",
    setup: ["Set SERP_API_KEY and SERP_API_PROVIDER in .env.local"],
    licenceOrTerms: "Never present a manually built list as live Google SERP data.",
  },
  {
    id: "serpbear", name: "SerpBear (open source, MIT)", status: "Not connected",
    provides: ["Rank tracking", "Ranking history", "GSC import"],
    cost: "Free app; you pay your chosen SERP provider per request.",
    setup: ["Self-host towfiqi/serpbear via Docker, or reuse its rank-tracking pattern (see README)"],
    licenceOrTerms: "MIT. 2,188 stars (verified 17 Nov 2026).",
  },
  {
    id: "openseo", name: "OpenSEO (open source, MIT)", status: "Not connected",
    provides: ["Keyword research", "Backlinks", "Rank tracking", "Site audit", "AI visibility", "MCP server"],
    cost: "Free to self-host; DataForSEO usage on your own key (~$0.05/search).",
    setup: ["Fork every-app/open-seo — recommended production backend (see README)"],
    licenceOrTerms: "MIT. 28,034 stars (verified 17 Nov 2026). Owns no keyword index.",
  },
];

export function providerStatus(id: ProviderId): Provider["status"] {
  return PROVIDERS.find((p) => p.id === id)?.status ?? "Unavailable";
}
// Server-side only: read a provider key. Returns null on the client.
export function serverEnv(name: string): string | null {
  if (typeof process === "undefined") return null;
  return process.env[name] ?? null;
}
