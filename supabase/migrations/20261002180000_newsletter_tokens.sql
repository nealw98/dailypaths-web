-- Double opt-in: each subscriber gets one confirmation token and one unsubscribe
-- token, used only in links emailed to that address. Existing rows are backfilled
-- with a distinct random value each.
alter table public.newsletter_subscribers
  add column confirm_token uuid not null default gen_random_uuid(),
  add column unsubscribe_token uuid not null default gen_random_uuid(),
  add column confirmation_sent_at timestamptz;
create unique index newsletter_subscribers_confirm_token on public.newsletter_subscribers(confirm_token);
create unique index newsletter_subscribers_unsubscribe_token on public.newsletter_subscribers(unsubscribe_token);
-- Tables stay closed to anon/authenticated; only the service role (edge functions) reads these.
