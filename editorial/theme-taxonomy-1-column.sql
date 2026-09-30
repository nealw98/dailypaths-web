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

-- FILE 1 of 3 — add the column. Purely additive: the column is nullable and
-- nothing reads it yet, so this cannot change a single page.

BEGIN;

-- Stop if the table is not the shape this expects. A wrong count makes the cast
-- fail, and the text being cast is the message.
SELECT CASE WHEN count(*) = 366 THEN 'ok'
            ELSE ('ABORT - expected 366 readings, found ' || count(*))::int::text
       END AS guard
FROM readings;

ALTER TABLE readings ADD COLUMN IF NOT EXISTS link_theme text;

COMMENT ON COLUMN readings.link_theme IS
  'Grouping theme (43 values) for related-reading links and the Go deeper destination. Distinct from secondary_theme, which is the finer descriptive tag that maps to the twelve topic pages and picks the hero image.';

-- Expect one row, all NULL.
SELECT count(*) AS readings, count(link_theme) AS filled FROM readings;

COMMIT;
