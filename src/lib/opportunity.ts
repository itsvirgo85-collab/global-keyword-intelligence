// Opportunity Score — a DOCUMENTED heuristic, 0-100. NOT an Ahrefs KD,
// NOT search volume, NOT a ranking guarantee.
// Formula (weights sum to 100):
//   long-tail signal      25 pts — 4+ words, specific intent, less head-term competition
//   question signal       15 pts — question keywords are easier to answer well
//   commercial value      20 pts — commercial/transactional intent
//   specificity           20 pts — longer, more specific phrases
//   suggestion strength   20 pts — appeared in Autocomplete fan-out (real demand signal)
// Confidence is LOW unless volume/KD come from a provider or CSV import.
// When those exist, confidence rises and the score is re-weighted in providers.ts.
import { classifyIntent, isLongTail, isQuestion, wordCount } from "./intent";
import type { KeywordResult } from "./types";

export interface OpportunityBreakdown {
  longTail: number;
  question: number;
  commercial: number;
  specificity: number;
  suggestionStrength: number;
  total: number;
  confidence: "low" | "medium" | "high";
  reason: string;
}

export function scoreOpportunity(kw: KeywordResult): OpportunityBreakdown {
  const words = wordCount(kw.keyword);
  const intent = classifyIntent(kw.keyword);
  const longTail = isLongTail(kw.keyword) ? 25 : words === 3 ? 15 : words === 2 ? 8 : 0;
  const question = isQuestion(kw.keyword) ? 15 : 0;
  const commercial = intent === "transactional" ? 20 : intent === "commercial" ? 15 : intent === "local" ? 10 : 0;
  const specificity = Math.min(20, Math.max(0, (words - 1) * 5));
  const suggestionStrength = kw.sources.length >= 2 ? 20 : kw.sources.length === 1 ? 12 : 0;
  const total = Math.min(100, longTail + question + commercial + specificity + suggestionStrength);
  const hasMetrics = kw.volume !== null || kw.kd !== null;
  const confidence: OpportunityBreakdown["confidence"] = hasMetrics ? "medium" : "low";
  const reasonParts: string[] = [];
  if (isLongTail(kw.keyword)) reasonParts.push("long-tail (4+ words), usually less head-term competition");
  if (isQuestion(kw.keyword)) reasonParts.push("question keyword — easy to answer with a focused page");
  if (intent === "transactional" || intent === "commercial") reasonParts.push(`${intent} intent — closer to a conversion`);
  if (kw.sources.length >= 2) reasonParts.push("suggested by multiple real sources");
  if (!hasMetrics) reasonParts.push("no volume/KD yet — connect DataForSEO or import a CSV to confirm demand");
  return {
    longTail, question, commercial, specificity, suggestionStrength, total, confidence,
    reason: reasonParts.join("; ") || "Short head term — harder to win without volume/KD evidence.",
  };
}

// KD bands (PDF §8). A KD value is shown ONLY when SERP/backlink evidence exists;
// otherwise the UI must show "Insufficient data".
export type KdBand = "Very Easy" | "Easy" | "Medium" | "Hard" | "Very Hard";
export function kdBand(kd: number | null): KdBand | "Insufficient data" {
  if (kd === null || Number.isNaN(kd)) return "Insufficient data";
  if (kd <= 10) return "Very Easy";
  if (kd <= 30) return "Easy";
  if (kd <= 50) return "Medium";
  if (kd <= 70) return "Hard";
  return "Very Hard";
}
