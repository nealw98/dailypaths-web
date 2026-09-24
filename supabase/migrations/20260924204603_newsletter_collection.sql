create table public.newsletter_subscribers (
 id uuid primary key default gen_random_uuid(),
 email text not null unique check (email = lower(btrim(email)) and length(email) between 3 and 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
 status text not null default 'pending' check (status in ('pending','subscribed','unsubscribed','suppressed')),
 consent_version text not null default '2026-09-24',
 consent_at timestamptz not null default now(),
 signup_site text not null check (signup_site in ('development','production')),
 confirmed_at timestamptz,
 unsubscribed_at timestamptz,
 provider_contact_id text,
 created_at timestamptz not null default now()
);
alter table public.newsletter_subscribers enable row level security;
revoke all on public.newsletter_subscribers from public, anon, authenticated;
grant select,insert,update,delete on public.newsletter_subscribers to service_role;
comment on table public.newsletter_subscribers is 'Website opt-ins. Pending until email sending and address confirmation are connected. Never send broadcasts to pending or suppressed rows.';
create table public.newsletter_signup_limits (
 bucket text primary key check (length(bucket)=64),
 attempts integer not null,
 expires_at timestamptz not null
);
create index newsletter_signup_limits_expiry on public.newsletter_signup_limits(expires_at);
alter table public.newsletter_signup_limits enable row level security;
revoke all on public.newsletter_signup_limits from public, anon, authenticated;
grant select,insert,update,delete on public.newsletter_signup_limits to service_role;
create function public.newsletter_allow_signup(p_bucket text) returns boolean
language plpgsql security invoker set search_path = '' as $$
declare n integer;
begin
 delete from public.newsletter_signup_limits where expires_at < now();
 insert into public.newsletter_signup_limits(bucket,attempts,expires_at)
 values(p_bucket,1,now()+interval '2 hours')
 on conflict(bucket) do update set attempts=least(public.newsletter_signup_limits.attempts+1,7)
 returning attempts into n;
 return n<=6;
end;
$$;
revoke all on function public.newsletter_allow_signup(text) from public,anon,authenticated;
grant execute on function public.newsletter_allow_signup(text) to service_role;
