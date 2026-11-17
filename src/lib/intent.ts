// Intent classification — RULE-BASED heuristic, not provider intent.
// Labelled as such everywhere it is shown. Never present it as Google/Ahrefs intent.
export type Intent = "informational" | "commercial" | "transactional" | "navigational" | "local";

const RULES: { intent: Intent; patterns: RegExp[] }[] = [
  {
    intent: "transactional",
    patterns: [/\b(buy|purchase|order|checkout|price|pricing|cost|cheap|discount|deal|coupon|subscribe|sign up|download)\b/i, /\b(kaufen|preis|kosten|günstig|bestellen)\b/i, /\b(comprar|precio|costo|barato)\b/i, /\b(acheter|prix|pas cher)\b/i],
  },
  {
    intent: "commercial",
    patterns: [/\b(best|top|review|reviews|vs|versus|compare|comparison|alternative|alternatives)\b/i, /\b(beste|vergleich|test|erfahrungen)\b/i, /\b(mejor|comparar|opiniones|reseña)\b/i, /\b(meilleur|comparatif|avis)\b/i],
  },
  {
    intent: "local",
    patterns: [/\b(near me|nearby|in .+|near|location|directions|opening hours)\b/i, /\b(in der nähe|in meiner nähe)\b/i, /\b(cerca de mí|cerca)\b/i, /\b(près de moi)\b/i],
  },
  {
    intent: "navigational",
    patterns: [/\b(login|sign in|official|website|homepage|app|download app)\b/i, /\b(anmelden|offizielle)\b/i],
  },
  {
    intent: "informational",
    patterns: [/\b(what|how|why|when|where|who|guide|tutorial|meaning|definition|example|tips|learn)\b/i, /\b(was|wie|warum|anleitung|bedeutung)\b/i, /\b(qué|cómo|por qué|guía)\b/i, /\b(comment|pourquoi|guide)\b/i],
  },
];

export function classifyIntent(keyword: string): Intent {
  const text = keyword.trim();
  for (const rule of RULES) {
    if (rule.patterns.some((p) => p.test(text))) return rule.intent;
  }
  return "informational";
}

export function isQuestion(keyword: string): boolean {
  return /^(what|how|why|when|where|who|which|can|should|is|are|does|do|was|wie|was|warum|qué|cómo|por qué|comment|pourquoi|come|perché)\b/i.test(keyword.trim()) || keyword.trim().endsWith("?");
}
export function wordCount(keyword: string): number {
  return keyword.trim().split(/\s+/).filter(Boolean).length;
}
export function isLongTail(keyword: string): boolean {
  return wordCount(keyword) >= 4;
}
export const INTENT_LABEL: Record<Intent, string> = {
  informational: "Informational",
  commercial: "Commercial",
  transactional: "Transactional",
  navigational: "Navigational",
  local: "Local",
};
