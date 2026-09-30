-- Daily Paths: the 43-theme grouping vocabulary.
--
-- FILE 2 of 3 — fill readings.link_theme for all 366 readings.
--
-- Run file 1 first. No foreign key exists on the column yet, so these names do
-- not have to be in the theme table until file 3 adds them.
--
-- One statement per theme, listing the days that carry it. Written this way so
-- every statement is short: a single 370-line UPDATE reached the editor
-- truncated and failed with "syntax error at end of input".
--
-- readings.secondary_theme is never modified.

BEGIN;

-- Acceptance — 10 readings
UPDATE readings SET link_theme = 'Acceptance' WHERE day_of_year IN (
  14, 83, 88, 173, 225, 230, 252, 272, 292, 349
);

-- Amends — 14 readings
UPDATE readings SET link_theme = 'Amends' WHERE day_of_year IN (
  223, 224, 226, 233, 234, 235, 239, 247, 248, 249, 253, 261, 263, 273
);

-- Boundaries — 8 readings
UPDATE readings SET link_theme = 'Boundaries' WHERE day_of_year IN (
  9, 23, 24, 31, 180, 210, 267, 345
);

-- Character Defects — 8 readings
UPDATE readings SET link_theme = 'Character Defects' WHERE day_of_year IN (
  133, 158, 159, 160, 165, 202, 266, 291
);

-- Coming to Believe — 10 readings
UPDATE readings SET link_theme = 'Coming to Believe' WHERE day_of_year IN (
  33, 35, 36, 46, 67, 74, 75, 76, 84, 86
);

-- Connection — 10 readings
UPDATE readings SET link_theme = 'Connection' WHERE day_of_year IN (
  1, 59, 85, 127, 132, 135, 138, 139, 212, 329
);

-- Courage — 5 readings
UPDATE readings SET link_theme = 'Courage' WHERE day_of_year IN (
  44, 79, 112, 131, 208
);

-- Detachment — 8 readings
UPDATE readings SET link_theme = 'Detachment' WHERE day_of_year IN (
  19, 211, 289, 301, 312, 341, 346, 356
);

-- Faith — 7 readings
UPDATE readings SET link_theme = 'Faith' WHERE day_of_year IN (
  39, 40, 81, 82, 162, 314, 318
);

-- Fear — 7 readings
UPDATE readings SET link_theme = 'Fear' WHERE day_of_year IN (
  72, 94, 128, 144, 204, 255, 362
);

-- Fellowship — 14 readings
UPDATE readings SET link_theme = 'Fellowship' WHERE day_of_year IN (
  37, 48, 87, 100, 108, 130, 142, 150, 242, 256, 302, 303, 325, 344
);

-- Honesty — 8 readings
UPDATE readings SET link_theme = 'Honesty' WHERE day_of_year IN (
  2, 50, 104, 109, 118, 136, 141, 143
);

-- Hope and Gratitude — 8 readings
UPDATE readings SET link_theme = 'Hope and Gratitude' WHERE day_of_year IN (
  12, 32, 34, 41, 96, 116, 334, 360
);

-- Humility — 13 readings
UPDATE readings SET link_theme = 'Humility' WHERE day_of_year IN (
  42, 58, 66, 124, 175, 182, 183, 184, 187, 245, 286, 321, 335
);

-- Identity — 7 readings
UPDATE readings SET link_theme = 'Identity' WHERE day_of_year IN (
  99, 102, 166, 170, 174, 178, 179
);

-- Inventory — 7 readings
UPDATE readings SET link_theme = 'Inventory' WHERE day_of_year IN (
  92, 93, 111, 216, 278, 285, 299
);

-- Letting Go — 16 readings
UPDATE readings SET link_theme = 'Letting Go' WHERE day_of_year IN (
  7, 16, 18, 43, 65, 68, 69, 71, 167, 188, 191, 222, 288, 320, 355, 357
);

-- Living Amends — 10 readings
UPDATE readings SET link_theme = 'Living Amends' WHERE day_of_year IN (
  250, 251, 254, 259, 260, 262, 264, 271, 274, 347
);

-- Open-Mindedness — 8 readings
UPDATE readings SET link_theme = 'Open-Mindedness' WHERE day_of_year IN (
  55, 151, 322, 359, 361, 363, 364, 365
);

-- Patience — 7 readings
UPDATE readings SET link_theme = 'Patience' WHERE day_of_year IN (
  47, 51, 172, 189, 192, 232, 309
);

-- People-Pleasing — 5 readings
UPDATE readings SET link_theme = 'People-Pleasing' WHERE day_of_year IN (
  20, 106, 114, 123, 366
);

-- Powerlessness — 5 readings
UPDATE readings SET link_theme = 'Powerlessness' WHERE day_of_year IN (
  3, 8, 11, 13, 298
);

-- Practice — 17 readings
UPDATE readings SET link_theme = 'Practice' WHERE day_of_year IN (
  26, 30, 52, 70, 117, 196, 198, 207, 213, 275, 277, 280, 297, 310, 336,
  348, 350
);

-- Prayer and Meditation — 11 readings
UPDATE readings SET link_theme = 'Prayer and Meditation' WHERE day_of_year IN (
  53, 161, 171, 190, 221, 228, 307, 308, 311, 313, 324
);

-- Progress Not Perfection — 8 readings
UPDATE readings SET link_theme = 'Progress Not Perfection' WHERE day_of_year IN (
  95, 115, 193, 206, 279, 293, 305, 330
);

-- Readiness — 8 readings
UPDATE readings SET link_theme = 'Readiness' WHERE day_of_year IN (
  153, 154, 156, 157, 164, 169, 176, 300
);

-- Resentment and Forgiveness — 7 readings
UPDATE readings SET link_theme = 'Resentment and Forgiveness' WHERE day_of_year IN (
  28, 217, 236, 258, 287, 296, 354
);

-- Respect — 7 readings
UPDATE readings SET link_theme = 'Respect' WHERE day_of_year IN (
  57, 77, 90, 98, 101, 240, 257
);

-- Responsibility — 13 readings
UPDATE readings SET link_theme = 'Responsibility' WHERE day_of_year IN (
  22, 29, 56, 97, 105, 126, 181, 218, 227, 229, 246, 282, 295
);

-- Self-Awareness — 14 readings
UPDATE readings SET link_theme = 'Self-Awareness' WHERE day_of_year IN (
  25, 38, 61, 107, 119, 120, 137, 197, 200, 203, 281, 283, 317, 358
);

-- Self-Care — 5 readings
UPDATE readings SET link_theme = 'Self-Care' WHERE day_of_year IN (
  17, 237, 270, 294, 316
);

-- Self-Compassion — 7 readings
UPDATE readings SET link_theme = 'Self-Compassion' WHERE day_of_year IN (
  78, 110, 194, 195, 326, 328, 331
);

-- Self-Focus — 5 readings
UPDATE readings SET link_theme = 'Self-Focus' WHERE day_of_year IN (
  6, 21, 113, 147, 231
);

-- Self-Worth — 6 readings
UPDATE readings SET link_theme = 'Self-Worth' WHERE day_of_year IN (
  27, 103, 186, 209, 290, 353
);

-- Serenity — 6 readings
UPDATE readings SET link_theme = 'Serenity' WHERE day_of_year IN (
  60, 199, 276, 284, 319, 327
);

-- Service — 10 readings
UPDATE readings SET link_theme = 'Service' WHERE day_of_year IN (
  54, 152, 241, 265, 268, 269, 323, 338, 342, 343
);

-- Shame and Guilt — 7 readings
UPDATE readings SET link_theme = 'Shame and Guilt' WHERE day_of_year IN (
  122, 125, 134, 140, 145, 146, 214
);

-- Spiritual Growth — 8 readings
UPDATE readings SET link_theme = 'Spiritual Growth' WHERE day_of_year IN (
  45, 121, 201, 333, 337, 339, 340, 351
);

-- Surrender — 10 readings
UPDATE readings SET link_theme = 'Surrender' WHERE day_of_year IN (
  15, 63, 64, 73, 80, 155, 168, 177, 185, 315
);

-- Trust in a Higher Power — 5 readings
UPDATE readings SET link_theme = 'Trust in a Higher Power' WHERE day_of_year IN (
  163, 205, 238, 306, 352
);

-- Trusting Others — 7 readings
UPDATE readings SET link_theme = 'Trusting Others' WHERE day_of_year IN (
  49, 89, 91, 129, 243, 244, 304
);

-- Understanding the Disease — 5 readings
UPDATE readings SET link_theme = 'Understanding the Disease' WHERE day_of_year IN (
  4, 5, 10, 148, 149
);

-- Willingness — 5 readings
UPDATE readings SET link_theme = 'Willingness' WHERE day_of_year IN (
  62, 215, 219, 220, 332
);

-- Verify before committing.
SELECT count(*) AS unfilled FROM readings WHERE link_theme IS NULL;  -- expect 0
SELECT count(DISTINCT link_theme) AS grouping_themes FROM readings;  -- expect 43
SELECT count(DISTINCT secondary_theme) AS old_themes_untouched FROM readings;  -- expect 132
SELECT link_theme, count(*) FROM readings GROUP BY 1 HAVING count(*) < 5;  -- expect 0 rows

COMMIT;
