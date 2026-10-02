-- Daily send support. Both tables are closed to anon/authenticated; only the service role (edge functions) reads them.
create table public.newsletter_config (
  key text primary key,
  value text not null
);
alter table public.newsletter_config enable row level security;
revoke all on public.newsletter_config from public, anon, authenticated;
grant select, insert, update, delete on public.newsletter_config to service_role;
comment on table public.newsletter_config is 'send_secret authorizes the scheduled call to newsletter-daily. send_enabled must be the text true for any real send.';

-- Generated here so nobody has to invent or paste a secret. Stays inside the database and the function.
insert into public.newsletter_config(key, value) values
  ('send_secret', replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '')),
  ('send_enabled', 'false');

-- One row per calendar day (New York time). Claiming the row first is what prevents a second send of the same day.
create table public.newsletter_sends (
  send_date date primary key,
  reading_title text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  recipient_count integer
);
alter table public.newsletter_sends enable row level security;
revoke all on public.newsletter_sends from public, anon, authenticated;
grant select, insert, update, delete on public.newsletter_sends to service_role;
