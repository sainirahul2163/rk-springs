-- RFQ table and private drawing bucket. Service role only; no public policies.

create table if not exists public.rfqs (
  id uuid primary key default gen_random_uuid(),
  rfq_code text unique not null,
  created_at timestamptz not null default now(),
  name text not null,
  company text,
  phone text not null,
  email text,
  city text,
  spring_type text not null,
  quantity integer,
  target_date text,
  specs jsonb not null default '{}'::jsonb,
  notes text,
  files jsonb not null default '[]'::jsonb,
  sample_coming boolean not null default false,
  source_page text,
  utm jsonb not null default '{}'::jsonb,
  consent boolean not null,
  status text not null default 'new',
  user_agent text,
  ip_hash text
);

alter table public.rfqs enable row level security;

insert into storage.buckets (id, name, public)
values ('rfq-drawings', 'rfq-drawings', false)
on conflict (id) do nothing;
