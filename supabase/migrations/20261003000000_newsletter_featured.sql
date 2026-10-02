-- "New on Daily Paths" block in the daily email. At most one row is shown on a given day:
-- the most recent show_from among rows whose dates include today (New York time).
-- If no row is active, the email simply has no "New on Daily Paths" section.
create table public.newsletter_featured (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('article', 'guide')),
  title text not null,
  description text not null,
  path text not null check (path ~ '^/[a-z0-9/_-]+/$'),
  show_from date not null,
  show_until date not null check (show_until >= show_from),
  created_at timestamptz not null default now()
);
alter table public.newsletter_featured enable row level security;
revoke all on public.newsletter_featured from public, anon, authenticated;
grant select, insert, update, delete on public.newsletter_featured to service_role;
comment on table public.newsletter_featured is 'Daily email "New on Daily Paths" block. path is a site path such as /guides/finding-help/. kind decides the link wording: Read the article / Read the guide.';
