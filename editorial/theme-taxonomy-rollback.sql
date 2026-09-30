-- Undo all three files. Safe to run after any of them; each step is guarded.
--
-- secondary_theme was never modified, so there is nothing to restore there, and
-- no destination that existed beforehand was changed. This removes the 21 theme
-- rows the migration added and clears the 7 destinations it filled in.

BEGIN;

ALTER TABLE readings DROP CONSTRAINT IF EXISTS readings_link_theme_destination_fkey;
ALTER TABLE readings DROP COLUMN IF EXISTS link_theme;

-- Clear the destinations the migration set on rows that had none.
UPDATE reflection_theme_destinations SET destination = NULL WHERE theme IN (
  'Courage',
  'Fear',
  'Humility',
  'Practice',
  'Readiness',
  'Responsibility',
  'Service'
);

-- Remove the theme rows the migration added. Nothing references them once the
-- column is gone.
DELETE FROM reflection_theme_destinations WHERE theme IN (
  'Amends',
  'Character Defects',
  'Coming to Believe',
  'Hope and Gratitude',
  'Inventory',
  'Letting Go',
  'Living Amends',
  'Open-Mindedness',
  'People-Pleasing',
  'Prayer and Meditation',
  'Progress Not Perfection',
  'Resentment and Forgiveness',
  'Self-Awareness',
  'Self-Compassion',
  'Self-Focus',
  'Self-Worth',
  'Shame and Guilt',
  'Spiritual Growth',
  'Trust in a Higher Power',
  'Trusting Others',
  'Understanding the Disease'
);

SELECT count(*) AS vocabulary_rows FROM reflection_theme_destinations;  -- expect 132

COMMIT;
