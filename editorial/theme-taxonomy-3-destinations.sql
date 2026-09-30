-- Daily Paths: the 43-theme grouping vocabulary.
--
-- FILE 3 of 3 - teach reflection_theme_destinations the new names.
--
-- That table is the theme vocabulary, not a lookup beside it: readings.secondary_theme
-- has a foreign key into it, so deleting its rows fails with 23503. Nothing here
-- deletes and no existing destination is overwritten.
--
-- Every statement is on one line: the editor keeps only the last ~13 KB of a
-- paste, and a statement split across that boundary arrives unusable.

BEGIN;

-- 21 grouping themes are not yet rows in the vocabulary.
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Amends', '/guides/detachment-with-love/') ON CONFLICT (theme) DO NOTHING;
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Character Defects', '/topics/self-worth/') ON CONFLICT (theme) DO NOTHING;
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Coming to Believe', '/topics/higher-power/') ON CONFLICT (theme) DO NOTHING;
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Hope and Gratitude', '/topics/gratitude-and-hope/') ON CONFLICT (theme) DO NOTHING;
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Inventory', '/articles/the-stories-we-tell-ourselves/') ON CONFLICT (theme) DO NOTHING;
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Letting Go', '/guides/surrender/') ON CONFLICT (theme) DO NOTHING;
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Living Amends', '/articles/the-stories-we-tell-ourselves/') ON CONFLICT (theme) DO NOTHING;
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Open-Mindedness', '/topics/fellowship/') ON CONFLICT (theme) DO NOTHING;
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('People-Pleasing', '/guides/boundaries/') ON CONFLICT (theme) DO NOTHING;
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Prayer and Meditation', '/topics/higher-power/') ON CONFLICT (theme) DO NOTHING;
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Progress Not Perfection', '/articles/the-stories-we-tell-ourselves/') ON CONFLICT (theme) DO NOTHING;
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Resentment and Forgiveness', '/guides/surrender/') ON CONFLICT (theme) DO NOTHING;
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Self-Awareness', '/articles/the-stories-we-tell-ourselves/') ON CONFLICT (theme) DO NOTHING;
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Self-Compassion', '/topics/self-worth/') ON CONFLICT (theme) DO NOTHING;
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Self-Focus', '/topics/focus-on-yourself/') ON CONFLICT (theme) DO NOTHING;
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Self-Worth', '/topics/self-worth/') ON CONFLICT (theme) DO NOTHING;
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Shame and Guilt', '/guides/surrender/') ON CONFLICT (theme) DO NOTHING;
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Spiritual Growth', '/topics/higher-power/') ON CONFLICT (theme) DO NOTHING;
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Trust in a Higher Power', '/topics/higher-power/') ON CONFLICT (theme) DO NOTHING;
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Trusting Others', '/topics/higher-power/') ON CONFLICT (theme) DO NOTHING;
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Understanding the Disease', '/topics/the-disease/') ON CONFLICT (theme) DO NOTHING;

-- 7 are rows already but have no destination. Rows that have one keep it.
UPDATE reflection_theme_destinations SET destination = '/articles/letting-go/' WHERE theme = 'Courage' AND destination IS NULL;
UPDATE reflection_theme_destinations SET destination = '/guides/surrender/' WHERE theme = 'Fear' AND destination IS NULL;
UPDATE reflection_theme_destinations SET destination = '/guides/surrender/' WHERE theme = 'Humility' AND destination IS NULL;
UPDATE reflection_theme_destinations SET destination = '/traditions/' WHERE theme = 'Practice' AND destination IS NULL;
UPDATE reflection_theme_destinations SET destination = '/guides/surrender/' WHERE theme = 'Readiness' AND destination IS NULL;
UPDATE reflection_theme_destinations SET destination = '/articles/the-stories-we-tell-ourselves/' WHERE theme = 'Responsibility' AND destination IS NULL;
UPDATE reflection_theme_destinations SET destination = '/topics/gratitude-and-hope/' WHERE theme = 'Service' AND destination IS NULL;

-- Hold link_theme to the vocabulary, as secondary_theme already is, so a typo
-- is rejected rather than silently stripping a reflection of its group.
ALTER TABLE readings DROP CONSTRAINT IF EXISTS readings_link_theme_destination_fkey;
ALTER TABLE readings ADD CONSTRAINT readings_link_theme_destination_fkey FOREIGN KEY (link_theme) REFERENCES reflection_theme_destinations (theme);

-- Verify before committing.
SELECT count(*) AS vocabulary_rows FROM reflection_theme_destinations;  -- expect 153
SELECT count(*) AS unresolved FROM readings r LEFT JOIN reflection_theme_destinations d ON d.theme = r.link_theme WHERE d.theme IS NULL;  -- expect 0
SELECT count(*) AS without_destination FROM readings r JOIN reflection_theme_destinations d ON d.theme = r.link_theme WHERE d.destination IS NULL;  -- expect 0

COMMIT;
