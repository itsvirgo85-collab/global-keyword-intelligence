// Countries — ISO 3166-1 alpha-2, with currency, default language and region.
// Source: ISO 3166-1 + ISO 4217. Provider availability varies by country;
// the app must never claim equal data coverage for every country.
export interface Country {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  currency: string; // ISO 4217
  currencySymbol: string;
  defaultLanguage: string; // BCP 47 / ISO 639-1
  languages: string[];
  region: "North America" | "South America" | "Europe" | "Asia" | "Oceania" | "Africa" | "Middle East";
  googleAdsId?: number; // Google Ads geographic target ID where commonly known
}

const C = (
  code: string, name: string, currency: string, currencySymbol: string,
  defaultLanguage: string, languages: string[], region: Country["region"], googleAdsId?: number,
): Country => ({ code, name, currency, currencySymbol, defaultLanguage, languages, region, googleAdsId });

// [code, name, currency, symbol, defaultLang, languages, region, adsId]
const RAW: [string, string, string, string, string, string[], Country["region"], number?][] = [
  ["US", "United States", "USD", "$", "en", ["en", "es"], "North America", 2840],
  ["CA", "Canada", "CAD", "$", "en", ["en", "fr"], "North America", 2124],
  ["MX", "Mexico", "MXN", "$", "es", ["es", "en"], "North America", 2484],
  ["GB", "United Kingdom", "GBP", "£", "en", ["en"], "Europe", 2826],
  ["IE", "Ireland", "EUR", "€", "en", ["en"], "Europe", 2372],
  ["DE", "Germany", "EUR", "€", "de", ["de", "en"], "Europe", 2276],
  ["FR", "France", "EUR", "€", "fr", ["fr", "en"], "Europe", 2250],
  ["ES", "Spain", "EUR", "€", "es", ["es", "en", "ca"], "Europe", 2724],
  ["IT", "Italy", "EUR", "€", "it", ["it", "en"], "Europe", 2380],
  ["NL", "Netherlands", "EUR", "€", "nl", ["nl", "en"], "Europe", 2528],
  ["BE", "Belgium", "EUR", "€", "nl", ["nl", "fr", "de"], "Europe", 2056],
  ["CH", "Switzerland", "CHF", "CHF", "de", ["de", "fr", "it"], "Europe", 2756],
  ["AT", "Austria", "EUR", "€", "de", ["de"], "Europe", 2040],
  ["SE", "Sweden", "SEK", "kr", "sv", ["sv", "en"], "Europe", 2752],
  ["NO", "Norway", "NOK", "kr", "nb", ["nb", "en"], "Europe", 2578],
  ["DK", "Denmark", "DKK", "kr", "da", ["da", "en"], "Europe", 2208],
  ["FI", "Finland", "EUR", "€", "fi", ["fi", "sv", "en"], "Europe", 2246],
  ["PL", "Poland", "PLN", "zł", "pl", ["pl", "en"], "Europe", 2616],
  ["CZ", "Czechia", "CZK", "Kč", "cs", ["cs", "en"], "Europe", 2203],
  ["PT", "Portugal", "EUR", "€", "pt", ["pt", "en"], "Europe", 2620],
  ["GR", "Greece", "EUR", "€", "el", ["el", "en"], "Europe", 2300],
  ["TR", "Türkiye", "TRY", "₺", "tr", ["tr", "en"], "Europe", 2792],
  ["RO", "Romania", "RON", "lei", "ro", ["ro", "en"], "Europe", 2642],
  ["HU", "Hungary", "HUF", "Ft", "hu", ["hu", "en"], "Europe", 2348],
  ["UA", "Ukraine", "UAH", "₴", "uk", ["uk", "ru"], "Europe", 2804],
  ["PK", "Pakistan", "PKR", "₨", "en", ["en", "ur"], "Asia", 2586],
  ["IN", "India", "INR", "₹", "en", ["en", "hi"], "Asia", 2356],
  ["BD", "Bangladesh", "BDT", "৳", "bn", ["bn", "en"], "Asia", 2050],
  ["LK", "Sri Lanka", "LKR", "₨", "si", ["si", "ta", "en"], "Asia", 2144],
  ["NP", "Nepal", "NPR", "₨", "ne", ["ne", "en"], "Asia", 2524],
  ["JP", "Japan", "JPY", "¥", "ja", ["ja", "en"], "Asia", 2392],
  ["KR", "South Korea", "KRW", "₩", "ko", ["ko", "en"], "Asia", 2410],
  ["CN", "China", "CNY", "¥", "zh", ["zh", "en"], "Asia", 2156],
  ["TW", "Taiwan", "TWD", "NT$", "zh", ["zh", "en"], "Asia", 2158],
  ["HK", "Hong Kong", "HKD", "$", "zh", ["zh", "en"], "Asia", 2344],
  ["SG", "Singapore", "SGD", "$", "en", ["en", "zh", "ms"], "Asia", 2702],
  ["MY", "Malaysia", "MYR", "RM", "ms", ["ms", "en"], "Asia", 2458],
  ["ID", "Indonesia", "IDR", "Rp", "id", ["id", "en"], "Asia", 2360],
  ["TH", "Thailand", "THB", "฿", "th", ["th", "en"], "Asia", 2764],
  ["VN", "Vietnam", "VND", "₫", "vi", ["vi", "en"], "Asia", 2704],
  ["PH", "Philippines", "PHP", "₱", "en", ["en", "tl"], "Asia", 2608],
  ["AU", "Australia", "AUD", "$", "en", ["en"], "Oceania", 2036],
  ["NZ", "New Zealand", "NZD", "$", "en", ["en"], "Oceania", 2554],
  ["AE", "United Arab Emirates", "AED", "د.إ", "ar", ["ar", "en"], "Middle East", 2784],
  ["SA", "Saudi Arabia", "SAR", "﷼", "ar", ["ar", "en"], "Middle East", 2682],
  ["IL", "Israel", "ILS", "₪", "he", ["he", "ar", "en"], "Middle East", 2376],
  ["EG", "Egypt", "EGP", "£", "ar", ["ar", "en"], "Africa", 2818],
  ["ZA", "South Africa", "ZAR", "R", "en", ["en", "af", "zu"], "Africa", 2710],
  ["NG", "Nigeria", "NGN", "₦", "en", ["en"], "Africa", 2566],
  ["KE", "Kenya", "KES", "KSh", "en", ["en", "sw"], "Africa", 2404],
  ["GH", "Ghana", "GHS", "₵", "en", ["en"], "Africa", 2288],
  ["MA", "Morocco", "MAD", "د.م.", "ar", ["ar", "fr"], "Africa", 2504],
  ["BR", "Brazil", "BRL", "R$", "pt", ["pt", "en"], "South America", 2076],
  ["AR", "Argentina", "ARS", "$", "es", ["es"], "South America", 2032],
  ["CO", "Colombia", "COP", "$", "es", ["es"], "South America", 2170],
  ["CL", "Chile", "CLP", "$", "es", ["es"], "South America", 2152],
  ["PE", "Peru", "PEN", "S/", "es", ["es"], "South America", 2604],
  ["UY", "Uruguay", "UYU", "$", "es", ["es"], "South America", 2858],
  ["VE", "Venezuela", "VES", "Bs.", "es", ["es"], "South America", 2862],
  ["GT", "Guatemala", "GTQ", "Q", "es", ["es"], "North America", 2320],
  ["CR", "Costa Rica", "CRC", "₡", "es", ["es"], "North America", 2188],
  ["PA", "Panama", "PAB", "B/.", "es", ["es"], "North America", 2591],
  ["DO", "Dominican Republic", "DOP", "RD$", "es", ["es"], "North America", 2214],
  ["JM", "Jamaica", "JMD", "J$", "en", ["en"], "North America", 2388],
  ["IS", "Iceland", "ISK", "kr", "is", ["is", "en"], "Europe", 2352],
  ["HR", "Croatia", "EUR", "€", "hr", ["hr", "en"], "Europe", 2191],
  ["SI", "Slovenia", "EUR", "€", "sl", ["sl", "en"], "Europe", 2705],
  ["SK", "Slovakia", "EUR", "€", "sk", ["sk", "en"], "Europe", 2703],
  ["BG", "Bulgaria", "BGN", "лв", "bg", ["bg", "en"], "Europe", 2100],
  ["EE", "Estonia", "EUR", "€", "et", ["et", "en"], "Europe", 2233],
  ["LV", "Latvia", "EUR", "€", "lv", ["lv", "en"], "Europe", 2428],
  ["LT", "Lithuania", "EUR", "€", "lt", ["lt", "en"], "Europe", 2440],
  ["KZ", "Kazakhstan", "KZT", "₸", "kk", ["kk", "ru"], "Asia", 2398],
  ["UZ", "Uzbekistan", "UZS", "so'm", "uz", ["uz", "ru"], "Asia", 2860],
  ["MM", "Myanmar", "MMK", "K", "my", ["my", "en"], "Asia", 2104],
  ["KH", "Cambodia", "KHR", "៛", "km", ["km", "en"], "Asia", 2116],
  ["LA", "Laos", "LAK", "₭", "lo", ["lo", "en"], "Asia", 2418],
  ["MN", "Mongolia", "MNT", "₮", "mn", ["mn", "en"], "Asia", 2496],
  ["FJ", "Fiji", "FJD", "$", "en", ["en"], "Oceania", 2242],
  ["QA", "Qatar", "QAR", "﷼", "ar", ["ar", "en"], "Middle East", 2634],
  ["KW", "Kuwait", "KWD", "د.ك", "ar", ["ar", "en"], "Middle East", 2414],
  ["OM", "Oman", "OMR", "﷼", "ar", ["ar", "en"], "Middle East", 2512],
  ["JO", "Jordan", "JOD", "د.ا", "ar", ["ar", "en"], "Middle East", 2396],
  ["LB", "Lebanon", "LBP", "£", "ar", ["ar", "en"], "Middle East", 2422],
  ["IQ", "Iraq", "IQD", "ع.د", "ar", ["ar", "en"], "Middle East", 2368],
  ["DZ", "Algeria", "DZD", "د.ج", "ar", ["ar", "fr"], "Africa", 2012],
  ["TN", "Tunisia", "TND", "د.ت", "ar", ["ar", "fr"], "Africa", 2788],
  ["ET", "Ethiopia", "ETB", "Br", "am", ["am", "en"], "Africa", 2231],
  ["TZ", "Tanzania", "TZS", "TSh", "sw", ["sw", "en"], "Africa", 2834],
  ["UG", "Uganda", "UGX", "USh", "en", ["en", "sw"], "Africa", 2800],
  ["SN", "Senegal", "XOF", "CFA", "fr", ["fr"], "Africa", 2685],
  ["CI", "Côte d’Ivoire", "XOF", "CFA", "fr", ["fr"], "Africa", 2384],
  ["CM", "Cameroon", "XAF", "FCFA", "fr", ["fr", "en"], "Africa", 2120],
  ["EC", "Ecuador", "USD", "$", "es", ["es"], "South America", 2218],
  ["BO", "Bolivia", "BOB", "Bs", "es", ["es"], "South America", 2068],
  ["PY", "Paraguay", "PYG", "₲", "es", ["es", "gn"], "South America", 2600],
];

export const COUNTRIES: Country[] = RAW.map((r) => C(...r));
export const REGIONS = ["North America", "South America", "Europe", "Asia", "Oceania", "Africa", "Middle East"] as const;

export function getCountry(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code.toUpperCase());
}
export function countriesByRegion(region: string): Country[] {
  return COUNTRIES.filter((c) => c.region === region);
}
export const DEFAULT_COUNTRY = getCountry("US")!;
