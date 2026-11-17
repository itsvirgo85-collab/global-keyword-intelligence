-- Global Keyword Intelligence — Supabase PostgreSQL schema (001_init)
-- Run in the Supabase SQL editor or via `supabase db push`.
-- Every metric row carries provider, retrieval date, definition, country and language.
-- RLS: enable Row Level Security on user-owned tables and add policies per
-- authenticated user (see notes at the end). This file creates the tables;
-- enable RLS + policies before going live with real users.

create extension if not exists "pgcrypto";

create table if not exists countries (
  code char(2) primary key,
  name text not null,
  currency_code char(3) not null,
  currency_symbol text not null,
  default_language char(2) not null,
  region text not null,
  google_ads_id bigint,
  provider_availability text not null default 'limited'
);

create table if not exists languages (
  code char(2) primary key,
  name text not null,
  native_name text not null,
  rtl boolean not null default false
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists data_providers (
  id text primary key,
  name text not null,
  status text not null default 'not_connected',
  provides text[] not null default '{}',
  cost_note text,
  created_at timestamptz not null default now()
);

create table if not exists keywords (
  id uuid primary key default gen_random_uuid(),
  keyword text not null,
  country char(2) references countries(code),
  language char(2) references languages(code),
  created_at timestamptz not null default now(),
  unique (keyword, country, language)
);

create table if not exists keyword_metrics (
  id uuid primary key default gen_random_uuid(),
  keyword_id uuid references keywords(id) on delete cascade,
  provider text references data_providers(id),
  country char(2) references countries(code),
  language char(2) references languages(code),
  volume bigint,              -- monthly average, provider-defined; NULL = not available
  cpc numeric(10,2),          -- provider-defined bid metric; NULL = not available
  paid_competition numeric(3,2), -- 0-1, advertiser competition; NEVER organic KD
  kd integer,                 -- organic difficulty 0-100; NULL = insufficient data
  metric_definition text not null default 'Provider-defined; see data_providers.',
  retrieved_at timestamptz not null default now(),
  last_updated timestamptz not null default now()
);
create index if not exists idx_metrics_keyword on keyword_metrics(keyword_id);
create index if not exists idx_metrics_country on keyword_metrics(country, language);

create table if not exists keyword_suggestions (
  id uuid primary key default gen_random_uuid(),
  seed text not null,
  keyword text not null,
  country char(2) references countries(code),
  language char(2) references languages(code),
  source text not null, -- 'Google Autocomplete' | 'Datamuse' | 'CSV import'
  retrieved_at timestamptz not null default now()
);
create index if not exists idx_suggestions_seed on keyword_suggestions(seed, country, language);

create table if not exists keyword_history (
  id uuid primary key default gen_random_uuid(),
  keyword_id uuid references keywords(id) on delete cascade,
  volume bigint,
  cpc numeric(10,2),
  kd integer,
  observed_at timestamptz not null default now()
);

create table if not exists serp_results (
  id uuid primary key default gen_random_uuid(),
  keyword text not null,
  country char(2) references countries(code),
  language char(2) references languages(code),
  position integer not null,
  url text not null,
  domain text not null,
  title text,
  snippet text,
  source text not null, -- provider name, or 'manual paste'
  retrieved_at timestamptz not null default now()
);

create table if not exists competitor_domains (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  domain text not null,
  created_at timestamptz not null default now()
);

create table if not exists competitor_keywords (
  id uuid primary key default gen_random_uuid(),
  competitor_domain_id uuid references competitor_domains(id) on delete cascade,
  keyword text not null,
  position integer,
  estimated_traffic bigint,
  measured boolean not null default false, -- measured vs estimated, always labelled
  retrieved_at timestamptz not null default now()
);

create table if not exists keyword_clusters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  parent_topic text not null,
  intent text not null,
  country char(2) references countries(code),
  language char(2) references languages(code),
  keyword_ids uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists saved_keywords (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  keyword text not null,
  country char(2) references countries(code),
  language char(2) references languages(code),
  status text not null default 'to-target',
  notes text not null default '',
  tags text[] not null default '{}',
  saved_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  seed text not null,
  country char(2) references countries(code),
  language char(2) references languages(code),
  created_at timestamptz not null default now()
);

create table if not exists api_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  provider text references data_providers(id),
  endpoint text not null,
  calls integer not null default 1,
  recorded_at timestamptz not null default now()
);

create table if not exists data_refresh_logs (
  id uuid primary key default gen_random_uuid(),
  provider text references data_providers(id),
  status text not null,
  detail text,
  ran_at timestamptz not null default now()
);

-- Seed providers (statuses are honest defaults; update when a key is connected)
insert into data_providers (id, name, status, provides, cost_note) values
  ('autocomplete', 'Google Autocomplete', 'available', array['suggestions'], 'Free, no key'),
  ('datamuse', 'Datamuse', 'available', array['related words'], 'Free, no key'),
  ('dataforseo', 'DataForSEO', 'not_connected', array['volume','cpc','kd','serp','backlinks'], 'Pay-per-call, ~$0.05/search'),
  ('google-ads', 'Google Ads API', 'not_connected', array['volume','cpc','competition'], 'Free API; needs approved account'),
  ('trends', 'Google Trends (pytrends)', 'limited', array['relative interest'], 'Free, unofficial'),
  ('gsc', 'Google Search Console', 'unavailable', array['own-site clicks/impressions'], 'Free; future phase'),
  ('serp', 'SERP API', 'not_connected', array['live serp'], 'Pay-per-call; free tiers exist')
on conflict (id) do nothing;

-- RLS notes (apply before production):
--   alter table saved_keywords enable row level security;
--   create policy "users own rows" on saved_keywords for all
--     using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- Repeat for projects, competitor_domains, competitor_keywords, keyword_clusters, api_usage.
-- Reference tables (countries, languages, data_providers, keywords, keyword_metrics,
-- keyword_suggestions, serp_results) are read-only for authenticated users.
