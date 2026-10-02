-- Anyone may read; only signed-in admins may change. Service-role access
-- (Reading Room, edge functions, Supabase MCP) bypasses RLS and is unaffected.
alter table public.stories enable row level security;
create policy "Anyone can read stories" on public.stories for select to anon, authenticated using (true);
create policy "Admins can change stories" on public.stories for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
