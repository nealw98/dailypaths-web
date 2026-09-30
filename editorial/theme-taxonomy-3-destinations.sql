-- Daily Paths: the 43-theme grouping vocabulary.
--
-- Three files, run in order, each its own transaction. Stop after any of them.
--   1  theme-taxonomy-1-column.sql        add readings.link_theme
--   2  theme-taxonomy-2-backfill.sql      fill it for all 366 readings
--   3  theme-taxonomy-3-destinations.sql  teach the theme table the new names
--
-- readings.secondary_theme is never modified. It keeps driving the topic pages,
-- the hero photograph, the SEO metadata and the favourites page.
--
-- Undo: theme-taxonomy-rollback.sql
--
-- No dollar-quoted blocks anywhere: the Supabase SQL editor splits a script on
-- semicolons, and a dollar-quoted body holding any of its own arrives truncated.

-- FILE 3 of 3 — teach reflection_theme_destinations the new names.
--
-- That table is the theme vocabulary, not a lookup beside it: readings.secondary_theme
-- has a foreign key into it, which is why deleting its rows fails with 23503. So
-- nothing here deletes. Of the 43 grouping themes, 22 are already rows and
-- 21 are added. Existing destinations are never overwritten.

BEGIN;

-- The names that are not already in the vocabulary.
INSERT INTO reflection_theme_destinations (theme, destination) VALUES
  ('Acceptance', '/guides/surrender/'),
  ('Amends', '/guides/detachment-with-love/'),
  ('Boundaries', '/guides/boundaries/'),
  ('Character Defects', '/topics/self-worth/'),
  ('Coming to Believe', '/topics/higher-power/'),
  ('Connection', '/topics/fellowship/'),
  ('Courage', '/articles/letting-go/'),
  ('Detachment', '/guides/detachment-with-love/'),
  ('Faith', '/topics/higher-power/'),
  ('Fear', '/guides/surrender/'),
  ('Fellowship', '/topics/fellowship/'),
  ('Honesty', '/articles/the-stories-we-tell-ourselves/'),
  ('Hope and Gratitude', '/topics/gratitude-and-hope/'),
  ('Humility', '/guides/surrender/'),
  ('Identity', '/topics/self-worth/'),
  ('Inventory', '/articles/the-stories-we-tell-ourselves/'),
  ('Letting Go', '/guides/surrender/'),
  ('Living Amends', '/articles/the-stories-we-tell-ourselves/'),
  ('Open-Mindedness', '/topics/fellowship/'),
  ('Patience', '/topics/one-day-at-a-time/'),
  ('People-Pleasing', '/guides/boundaries/'),
  ('Powerlessness', '/guides/surrender/'),
  ('Practice', '/traditions/'),
  ('Prayer and Meditation', '/topics/higher-power/'),
  ('Progress Not Perfection', '/articles/the-stories-we-tell-ourselves/'),
  ('Readiness', '/guides/surrender/'),
  ('Resentment and Forgiveness', '/guides/surrender/'),
  ('Respect', '/guides/boundaries/'),
  ('Responsibility', '/articles/the-stories-we-tell-ourselves/'),
  ('Self-Awareness', '/articles/the-stories-we-tell-ourselves/'),
  ('Self-Care', '/topics/focus-on-yourself/'),
  ('Self-Compassion', '/topics/self-worth/'),
  ('Self-Focus', '/topics/focus-on-yourself/'),
  ('Self-Worth', '/topics/self-worth/'),
  ('Serenity', '/topics/one-day-at-a-time/'),
  ('Service', '/topics/gratitude-and-hope/'),
  ('Shame and Guilt', '/guides/surrender/'),
  ('Spiritual Growth', '/topics/higher-power/'),
  ('Surrender', '/guides/surrender/'),
  ('Trust in a Higher Power', '/topics/higher-power/'),
  ('Trusting Others', '/topics/higher-power/'),
  ('Understanding the Disease', '/topics/the-disease/'),
  ('Willingness', '/articles/letting-go/')
ON CONFLICT (theme) DO NOTHING;

-- Give a destination only to rows that have none. Where one is already set it is
-- an editorial decision already made, and is left alone.
UPDATE reflection_theme_destinations AS d SET destination = v.dest
FROM (VALUES
  ('Acceptance', '/guides/surrender/'),
  ('Amends', '/guides/detachment-with-love/'),
  ('Boundaries', '/guides/boundaries/'),
  ('Character Defects', '/topics/self-worth/'),
  ('Coming to Believe', '/topics/higher-power/'),
  ('Connection', '/topics/fellowship/'),
  ('Courage', '/articles/letting-go/'),
  ('Detachment', '/guides/detachment-with-love/'),
  ('Faith', '/topics/higher-power/'),
  ('Fear', '/guides/surrender/'),
  ('Fellowship', '/topics/fellowship/'),
  ('Honesty', '/articles/the-stories-we-tell-ourselves/'),
  ('Hope and Gratitude', '/topics/gratitude-and-hope/'),
  ('Humility', '/guides/surrender/'),
  ('Identity', '/topics/self-worth/'),
  ('Inventory', '/articles/the-stories-we-tell-ourselves/'),
  ('Letting Go', '/guides/surrender/'),
  ('Living Amends', '/articles/the-stories-we-tell-ourselves/'),
  ('Open-Mindedness', '/topics/fellowship/'),
  ('Patience', '/topics/one-day-at-a-time/'),
  ('People-Pleasing', '/guides/boundaries/'),
  ('Powerlessness', '/guides/surrender/'),
  ('Practice', '/traditions/'),
  ('Prayer and Meditation', '/topics/higher-power/'),
  ('Progress Not Perfection', '/articles/the-stories-we-tell-ourselves/'),
  ('Readiness', '/guides/surrender/'),
  ('Resentment and Forgiveness', '/guides/surrender/'),
  ('Respect', '/guides/boundaries/'),
  ('Responsibility', '/articles/the-stories-we-tell-ourselves/'),
  ('Self-Awareness', '/articles/the-stories-we-tell-ourselves/'),
  ('Self-Care', '/topics/focus-on-yourself/'),
  ('Self-Compassion', '/topics/self-worth/'),
  ('Self-Focus', '/topics/focus-on-yourself/'),
  ('Self-Worth', '/topics/self-worth/'),
  ('Serenity', '/topics/one-day-at-a-time/'),
  ('Service', '/topics/gratitude-and-hope/'),
  ('Shame and Guilt', '/guides/surrender/'),
  ('Spiritual Growth', '/topics/higher-power/'),
  ('Surrender', '/guides/surrender/'),
  ('Trust in a Higher Power', '/topics/higher-power/'),
  ('Trusting Others', '/topics/higher-power/'),
  ('Understanding the Disease', '/topics/the-disease/'),
  ('Willingness', '/articles/letting-go/')
) AS v(theme, dest)
WHERE d.theme = v.theme AND d.destination IS NULL;

-- Hold link_theme to the same vocabulary secondary_theme is held to, so a typo cannot
-- silently strip a reflection of its group. Requires file 2 to have run.
ALTER TABLE readings DROP CONSTRAINT IF EXISTS readings_link_theme_destination_fkey;
ALTER TABLE readings ADD CONSTRAINT readings_link_theme_destination_fkey
  FOREIGN KEY (link_theme) REFERENCES reflection_theme_destinations (theme);

-- Verify before committing.
SELECT count(*) AS vocabulary_rows FROM reflection_theme_destinations;  -- expect 153
SELECT count(*) AS unresolved FROM readings r
  LEFT JOIN reflection_theme_destinations d ON d.theme = r.link_theme
  WHERE d.theme IS NULL;  -- expect 0
SELECT count(*) AS without_destination FROM readings r
  JOIN reflection_theme_destinations d ON d.theme = r.link_theme
  WHERE d.destination IS NULL;  -- expect 0

COMMIT;
