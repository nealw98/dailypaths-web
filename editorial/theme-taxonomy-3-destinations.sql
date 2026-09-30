-- Daily Paths: the 43-theme grouping vocabulary.
--
-- FILE 3 of 3 - teach reflection_theme_destinations the new names.
--
-- The table enforces unique names ignoring case, so Self-Awareness collides with
-- the Self-awareness already there. Renaming the existing rows would break the
-- foreign key secondary_theme has on them, so link_theme adopts their spelling
-- instead - four UPDATEs below. Nothing is deleted and no destination that is
-- already set is overwritten.
--
-- Every statement is on one line, and the file is small, because the editor
-- keeps only the last ~13 KB of a paste.

BEGIN;

-- Adopt the spelling the vocabulary already uses.
UPDATE readings SET link_theme = 'Self-awareness' WHERE link_theme = 'Self-Awareness';
UPDATE readings SET link_theme = 'Self-compassion' WHERE link_theme = 'Self-Compassion';
UPDATE readings SET link_theme = 'Self-focus' WHERE link_theme = 'Self-Focus';
UPDATE readings SET link_theme = 'Self-worth' WHERE link_theme = 'Self-Worth';

-- 17 grouping themes are not in the vocabulary in any spelling.
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Amends', '/guides/detachment-with-love/');
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Character Defects', '/topics/self-worth/');
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Coming to Believe', '/topics/higher-power/');
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Hope and Gratitude', '/topics/gratitude-and-hope/');
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Inventory', '/articles/the-stories-we-tell-ourselves/');
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Letting Go', '/guides/surrender/');
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Living Amends', '/articles/the-stories-we-tell-ourselves/');
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Open-Mindedness', '/topics/fellowship/');
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('People-Pleasing', '/guides/boundaries/');
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Prayer and Meditation', '/topics/higher-power/');
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Progress Not Perfection', '/articles/the-stories-we-tell-ourselves/');
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Resentment and Forgiveness', '/guides/surrender/');
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Shame and Guilt', '/guides/surrender/');
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Spiritual Growth', '/topics/higher-power/');
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Trust in a Higher Power', '/topics/higher-power/');
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Trusting Others', '/topics/higher-power/');
INSERT INTO reflection_theme_destinations (theme, destination) VALUES ('Understanding the Disease', '/topics/the-disease/');

-- 7 are there already but have no destination. Rows that have one keep it.
UPDATE reflection_theme_destinations SET destination = '/articles/letting-go/' WHERE theme = 'Courage' AND destination IS NULL;
UPDATE reflection_theme_destinations SET destination = '/guides/surrender/' WHERE theme = 'Fear' AND destination IS NULL;
UPDATE reflection_theme_destinations SET destination = '/guides/surrender/' WHERE theme = 'Humility' AND destination IS NULL;
UPDATE reflection_theme_destinations SET destination = '/traditions/' WHERE theme = 'Practice' AND destination IS NULL;
UPDATE reflection_theme_destinations SET destination = '/guides/surrender/' WHERE theme = 'Readiness' AND destination IS NULL;
UPDATE reflection_theme_destinations SET destination = '/articles/the-stories-we-tell-ourselves/' WHERE theme = 'Responsibility' AND destination IS NULL;
UPDATE reflection_theme_destinations SET destination = '/topics/gratitude-and-hope/' WHERE theme = 'Service' AND destination IS NULL;

-- Hold link_theme to the vocabulary, as secondary_theme already is.
ALTER TABLE readings DROP CONSTRAINT IF EXISTS readings_link_theme_destination_fkey;
ALTER TABLE readings ADD CONSTRAINT readings_link_theme_destination_fkey FOREIGN KEY (link_theme) REFERENCES reflection_theme_destinations (theme);

-- Verify before committing.
SELECT count(*) AS vocabulary_rows FROM reflection_theme_destinations;  -- expect 149
SELECT count(DISTINCT link_theme) AS grouping_themes FROM readings;  -- expect 43
SELECT count(*) AS unresolved FROM readings r LEFT JOIN reflection_theme_destinations d ON d.theme = r.link_theme WHERE d.theme IS NULL;  -- expect 0
SELECT count(*) AS without_destination FROM readings r JOIN reflection_theme_destinations d ON d.theme = r.link_theme WHERE d.destination IS NULL;  -- expect 0

COMMIT;
