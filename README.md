# Global Keyword Intelligence

A free-first, worldwide, multilingual keyword research SaaS — inspired by the
workflow of Ahrefs Keyword Explorer, built on real data only.

**Core principle: real data, transparent sources, no fabricated metrics.**
Search volume, CPC, paid competition and keyword difficulty are shown as
**“Not available” / “Insufficient data”** until a connected provider or a CSV
import actually supplies them. Nothing in this app invents a number.

## What it does

11 modules, all working pages:

| Module | What it does |
|---|---|
| Dashboard | Counts only from your own saved research. 3-step onboarding. |
| Keyword Explorer | Live Google Autocomplete + Datamuse suggestions for a seed + country + language. |
| Suggestions | Matching terms, questions, long-tail, commercial, transactional, informational, local. |
| Country Comparison | One seed across up to 5 countries — separate rows, currencies labelled, never merged. |
| SERP Analyzer | Live SERP when a SERP key is connected; honest manual-paste top-10 mode otherwise. |
| Competitor Research | Keyword-gap analysis from your own lists/CSVs; measured vs estimated labelled. |
| Opportunities | Transparent Opportunity Score 0–100 (documented heuristic, not an Ahrefs KD). |
| Clustering | Parent-topic + intent clusters; intents and country/language contexts never merged. |
| Saved Keywords | Save, tag, status (to-target / targeting / done), CSV export. |
| Projects | Country + language + seed + saved list, grouped and exportable. |
| Settings / Data Sources | Provider abstraction layer + CSV import (template included). |

One-click seeds: **“llc cost”** (US / English), **“hipoteca”** (Spain / Spanish),
**“krankenversicherung”** (Germany / German).

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in only the providers you use
npm run dev                  # http://localhost:3000
npm test                     # Vitest unit tests
npm run build                # production build
```

## Deploy (free tiers)

- **Vercel:** import this repo, set the env vars from `.env.example`, deploy.
  No build settings needed — Next.js is detected automatically.
- **Supabase:** create a free project, run
  `supabase/migrations/001_init.sql` in the SQL editor, then set
  `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  Enable Row Level Security + the policies noted at the end of the migration
  before going live with real users.
- Local persistence today is browser localStorage (Supabase-ready shape in
  `src/lib/storage.ts`); the SQL schema is ready for the server sync step.

## Environment variables

See `.env.example`. All provider keys are **server-side only** — never
`NEXT_PUBLIC_`, never committed. `.env.local` is git-ignored.

## Data sources & honesty rules

- **Google Autocomplete** (`suggestqueries.google.com/complete/search?client=firefox`)
  — free, no key. Suggestions only, **not** verified search volume.
  The API route fans out the seed with question prefixes and a–z.
- **Datamuse** — free fallback for related words. No volume/CPC/KD.
- **Google Trends (via pytrends)** — relative interest 0–100, **never**
  absolute volume. Optional worker; unofficial API.
- **DataForSEO** — volume, CPC, KD, SERP, backlinks. Pay-per-call
  (~$0.05/search, $1 free credit). Set `DATAFORSEO_LOGIN` /
  `DATAFORSEO_PASSWORD`.
- **Google Ads API** — real monthly searches + bid ranges. Needs an
  approved Ads account + developer token.
- **Google Search Console** — future phase; your own site's real data only.
- Paid competition is **never** organic difficulty. Volume is **never**
  traffic. Country volumes are **never** merged without labelling.

## Opportunity Score — the formula (0–100)

Long-tail 25 + Question 15 + Commercial value 20 + Specificity 20 +
Suggestion strength 20. Confidence is **low** until volume/KD come from a
provider or CSV import. See `src/lib/opportunity.ts`.

## KD bands

0–10 Very Easy · 11–30 Easy · 31–50 Medium · 51–70 Hard · 71–100 Very Hard.
Shown only with SERP/backlink evidence; otherwise “Insufficient data”.

## GitHub reuse — verified 17 Nov 2026 via the GitHub API

| Repo | Stars | Licence | Verdict |
|---|---|---|---|
| `every-app/open-seo` | 28,034 | MIT | **YES — fork as the production backend.** Keyword research, backlinks, rank tracking, site audit, AI visibility, MCP server. Owns no keyword index — all numbers come from DataForSEO on your key. |
| `towfiqi/serpbear` | 2,188 | MIT | **YES — rank tracking.** Unlimited domains/keywords, history, GSC import, 8 SERP providers. |
| `AgriciDaniel/keywordpro` | 303 | Apache-2.0 | **YES — exports.** Local-first research, guided reports, PDF/CSV/JSON exports. |
| `GeneralMills/pytrends` | 3,729 | licence unclear (NOASSERTION) | **Use carefully.** Trends only, relative not volume; verify its LICENCE before commercial use. |
| `CorgiCorner/bisibility` | 605 | AGPL-3.0 | **Study only.** AGPL requires sharing source if run as a hosted service. |
| `Joseymras/StackPress…` | 1 | MIT | **Do not build on it.** 150+ tools claimed, no community, unverified. |
| EchoSEO / UpgradeSEO | claimed ~2,100, API shows 3–4 | MIT | **Unverified.** Do not cite the 2,100 figure or fork until the canonical repo is confirmed. |

### The hard truth

No open-source repo owns an Ahrefs-scale keyword index. Every credible one
is a clean app over DataForSEO, Google Ads API, a SERP API, or free Google
endpoints. That is why this project is designed free-first with a provider
abstraction layer (`src/lib/providers.ts`): free suggestions now, paid
metrics only when you connect a key.

## What is verified / estimated / pending

- **Verified live:** Google Autocomplete suggestions (see Tests below);
  GitHub star/licence counts above (GitHub API, 17 Nov 2026).
- **Estimated (labelled heuristic):** rule-based intent, Opportunity Score,
  clustering parent topics.
- **Pending:** DataForSEO / Google Ads / SERP provider wiring (adapters are
  stubbed in `src/lib/providers.ts` — add the API calls behind the same
  interface); Supabase Auth + server sync for saved keywords/projects;
  Google Search Console OAuth; XLSX export (CSV works today and opens in Excel).

## Tests

```bash
npm test
```

Vitest unit tests cover intent classification, the Opportunity Score +
KD bands, clustering (including the never-merge-intents/countries rules)
and CSV import/export round-trips. 24 tests, all passing at last check.

## Project structure

```
src/app/            App Router pages (11 modules) + /api/suggestions
src/lib/            countries, languages, intent, opportunity, clustering,
                    providers (abstraction), csv, storage, types
src/components/     Sidebar, KeywordTable, ResearchPanel
supabase/migrations/001_init.sql
tests/              Vitest unit tests
```
