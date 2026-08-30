-- Topic taxonomy v2 (August 2026 consolidation) + search keywords.
--
-- Two changes:
--   readings.topics    the tags — an ordered array, topics[0] is the primary
--   readings.keywords  search terms, for the site index and the app's search
--   themes             gains kind/is_active and the fourteen new topic rows
--
-- The site calls these "Topics"; the physical table stays `themes` because
-- js/admin.js, helpers/fetch-themes.mjs, scripts/seed-steps-themes.mjs and the
-- external-readings edge function all reference it by that name.
--
-- Nothing is deleted. The eight retired topics are deactivated so existing
-- member_shares rows and inbound links keep resolving.

-- ---------------------------------------------------------------------------
-- 1. The tags live on the reading
-- ---------------------------------------------------------------------------

-- Ordered: topics[1] in Postgres (topics[0] in the JSON export) is the primary
-- topic — the topic page that owns the reading. Two more are allowed after it.
alter table public.readings
  add column if not exists topics text[],
  add column if not exists keywords text[];

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'readings_topics_len_check') then
    alter table public.readings
      add constraint readings_topics_len_check
      check (topics is null or cardinality(topics) between 1 and 3);
  end if;
end $$;

-- Both are queried as "does this array contain X", which is what GIN is for.
-- The keywords index also serves the mobile app's search directly.
create index if not exists readings_topics_gin   on public.readings using gin (topics);
create index if not exists readings_keywords_gin on public.readings using gin (keywords);

-- ---------------------------------------------------------------------------
-- 2. themes gains a kind, an active flag, and an explicit order
-- ---------------------------------------------------------------------------

alter table public.themes
  add column if not exists kind text not null default 'readings',
  add column if not exists is_active boolean not null default true,
  add column if not exists sort_order smallint;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'themes_kind_check') then
    alter table public.themes
      add constraint themes_kind_check check (kind in ('readings', 'background'));
  end if;
end $$;

create unique index if not exists themes_slug_key on public.themes (slug);

-- ---------------------------------------------------------------------------
-- 3. Retire the eight topics the consolidation dropped (kept, not deleted)
-- ---------------------------------------------------------------------------

update public.themes
   set is_active = false
 where slug in (
   'powerlessness', 'letting-go-of-control', 'focus-on-yourself', 'self-worth',
   'honesty', 'gratitude-and-hope', 'the-disease', 'fellowship'
 );

-- ---------------------------------------------------------------------------
-- 4. The fourteen topics. `boundaries` and `one-day-at-a-time` already exist
--    and keep their essay copy; the rest are inserted.
-- ---------------------------------------------------------------------------

insert into public.themes (slug, name, short_description, kind, is_active, sort_order) values
  ('letting-go',                  'Letting Go',                  'Powerlessness, surrender, and the many ways we try to manage what isn''t ours.', 'readings',   true,  1),
  ('living-with-active-drinking',  'Living With Active Drinking',  'Getting through the day when the drinking hasn''t stopped.',                    'readings',   true,  2),
  ('anger-and-resentment',         'Anger and Resentment',         'What to do with the anger you were told not to have.',                          'readings',   true,  3),
  ('fear-and-worry',               'Fear and Worry',               'Waiting up, imagining the worst, living braced for the next thing.',            'readings',   true,  4),
  ('guilt-blame-shame',            'Guilt, Blame, and Shame',      'Whether you caused it, and what to do with the part that isn''t yours.',         'readings',   true,  5),
  ('detachment-with-love',         'Detachment with Love',         'Stepping out of the chaos without stepping away from the person.',              'readings',   true,  6),
  ('helping-or-enabling',          'Helping or Enabling?',         'The line between love and rescue, and how to tell where you are.',              'readings',   true,  7),
  ('boundaries',                   'Boundaries and Saying No',     'Saying no as an act of self-respect, not punishment.',                          'readings',   true,  8),
  ('getting-yourself-back',        'Getting Yourself Back',        'Reclaiming the life and the self that years of crisis eroded.',                 'readings',   true,  9),
  ('one-day-at-a-time',            'One Day at a Time',            'Putting down the future and the past, and keeping today.',                      'readings',   true, 10),
  ('higher-power-and-trust',       'Higher Power and Trust',       'Finding something to lean on — including if the word God is hard.',             'readings',   true, 11),
  ('gratitude',                    'Gratitude',                    'Noticing what''s here, on the days it doesn''t come naturally.',                'readings',   true, 12),
  ('alcoholism-as-a-disease',      'Alcoholism as a Disease',      'What the illness is, and why understanding it changes everything else.',        'background', true, 13),
  ('youre-not-alone',              'You''re Not Alone',            'Meetings, fellowship, and the end of doing this by yourself.',                  'background', true, 14)
on conflict (slug) do update set
  name              = excluded.name,
  short_description = excluded.short_description,
  kind              = excluded.kind,
  is_active         = true,
  sort_order        = excluded.sort_order;
