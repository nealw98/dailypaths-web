-- PENDING — NOT APPLIED. Run steps/themes only after the admin page fix
-- (js/admin.js: saves send the admin's token) is live on dailypaths.org, or the
-- live admin page cannot save. Run journal_quotes only after confirming the app
-- does not write to it with the public key. Same pattern as supabase/migrations/20261002170000_lock_stories.sql.
alter table public.steps enable row level security;
create policy "Anyone can read steps" on public.steps for select to anon, authenticated using (true);
create policy "Admins can change steps" on public.steps for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

alter table public.themes enable row level security;
create policy "Anyone can read themes" on public.themes for select to anon, authenticated using (true);
create policy "Admins can change themes" on public.themes for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

alter table public.journal_quotes enable row level security;
create policy "Anyone can read journal_quotes" on public.journal_quotes for select to anon, authenticated using (true);
create policy "Admins can change journal_quotes" on public.journal_quotes for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
