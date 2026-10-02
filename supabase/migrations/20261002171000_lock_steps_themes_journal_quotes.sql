-- Applied October 2, 2026. Anyone may read; only signed-in admins may change.
-- Service-role access (Reading Room, edge functions, Supabase MCP) bypasses RLS.
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
