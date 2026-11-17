// Languages — ISO 639-1. Preserve original spelling, accents and scripts.
// RTL languages (ar, ur, he) render right-to-left in the UI.
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  rtl: boolean;
}

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", rtl: false },
  { code: "de", name: "German", nativeName: "Deutsch", rtl: false },
  { code: "fr", name: "French", nativeName: "Français", rtl: false },
  { code: "es", name: "Spanish", nativeName: "Español", rtl: false },
  { code: "it", name: "Italian", nativeName: "Italiano", rtl: false },
  { code: "pt", name: "Portuguese", nativeName: "Português", rtl: false },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", rtl: false },
  { code: "ar", name: "Arabic", nativeName: "العربية", rtl: true },
  { code: "ur", name: "Urdu", nativeName: "اردو", rtl: true },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", rtl: false },
  { code: "ja", name: "Japanese", nativeName: "日本語", rtl: false },
  { code: "ko", name: "Korean", nativeName: "한국어", rtl: false },
  { code: "zh", name: "Chinese", nativeName: "中文", rtl: false },
  { code: "sv", name: "Swedish", nativeName: "Svenska", rtl: false },
  { code: "nb", name: "Norwegian", nativeName: "Norsk", rtl: false },
  { code: "da", name: "Danish", nativeName: "Dansk", rtl: false },
  { code: "fi", name: "Finnish", nativeName: "Suomi", rtl: false },
  { code: "pl", name: "Polish", nativeName: "Polski", rtl: false },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", rtl: false },
  { code: "ru", name: "Russian", nativeName: "Русский", rtl: false },
];

export function getLanguage(code: string): Language | undefined {
  return LANGUAGES.find((l) => l.code === code);
}
export function isRtl(code: string): boolean {
  return getLanguage(code)?.rtl ?? false;
}
// Question-word prefixes per language, used for Autocomplete fan-out.
export const QUESTION_PREFIXES: Record<string, string[]> = {
  en: ["what is", "how to", "why", "best", "cheap", "near me", "how much does", "where to"],
  de: ["was ist", "wie", "warum", "beste", "günstig", "kosten", "wo"],
  fr: ["comment", "pourquoi", "meilleur", "prix", "où"],
  es: ["qué es", "cómo", "por qué", "mejor", "precio", "cerca de mí"],
  it: ["come", "perché", "migliore", "prezzo"],
  pt: ["como", "por que", "melhor", "preço"],
  nl: ["hoe", "waarom", "beste", "prijs"],
  ar: ["ما هو", "كيف", "لماذا", "أفضل"],
  ur: ["کیا ہے", "کیسے", "بہترین"],
  hi: ["क्या है", "कैसे", "सबसे अच्छा"],
  ja: ["とは", "方法", "おすすめ"],
  ko: ["이란", "방법", "추천"],
  zh: ["是什么", "怎么", "最好"],
};
export function questionPrefixes(lang: string): string[] {
  return QUESTION_PREFIXES[lang] ?? QUESTION_PREFIXES.en;
}
