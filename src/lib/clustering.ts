// Clustering — parent topic + intent. Never merge different intents,
// and never merge different country/language contexts into one cluster.
import { classifyIntent, wordCount } from "./intent";
import type { Cluster, KeywordResult } from "./types";

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "for", "on", "with", "how", "what", "why",
  "is", "are", "best", "top", "near", "me", "der", "die", "das", "und", "für", "de", "la", "el",
  "que", "como", "por", "para", "le", "les", "des", "du",
]);

function parentTopic(keyword: string): string {
  const words = keyword.toLowerCase().replace(/[?.,!]/g, "").split(/\s+/).filter((w) => w && !STOPWORDS.has(w));
  // Parent topic = first two content words (the stable core of the phrase).
  return words.slice(0, 2).join(" ") || keyword.toLowerCase();
}

export function clusterKeywords(keywords: KeywordResult[]): Cluster[] {
  const map = new Map<string, Cluster>();
  for (const kw of keywords) {
    const intent = classifyIntent(kw.keyword);
    const topic = parentTopic(kw.keyword);
    // Key includes intent + country + language, so contexts never merge.
    const key = `${topic}|${intent}|${kw.country}|${kw.language}`;
    const existing = map.get(key);
    if (existing) {
      existing.keywords.push(kw);
    } else {
      map.set(key, {
        id: key,
        parentTopic: topic,
        intent,
        country: kw.country,
        language: kw.language,
        keywords: [kw],
      });
    }
  }
  return [...map.values()].sort((a, b) => b.keywords.length - a.keywords.length);
}

export function clusterSummary(clusters: Cluster[]): { clusters: number; keywords: number; largest: string } {
  const total = clusters.reduce((n, c) => n + c.keywords.length, 0);
  return {
    clusters: clusters.length,
    keywords: total,
    largest: clusters[0] ? `${clusters[0].parentTopic} (${clusters[0].keywords.length})` : "—",
  };
}
export { wordCount };
