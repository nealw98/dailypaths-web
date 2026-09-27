/**
 * Where a reflection's theme sends the reader.
 *
 * Each reflection carries a free-text theme in readings.secondary_theme. One list
 * of theme → destination pairs decides two things from it, read in either
 * direction:
 *
 *   forwards   the Go deeper card on the reflection, and its pill
 *   backwards  the reflections shown alongside it — every other reflection whose
 *              theme lands on the same destination
 *
 * Grouping by destination rather than by exact theme is deliberate. Sixteen
 * reflections tagged "Trust" shown to each other read as duplicates; Trust,
 * Willingness and Self-will shown together read as three angles on one idea.
 *
 * The list itself is editorial and lives in the Reading Room, captured into
 * data/theme-destinations.json. Until that capture exists this falls back to the
 * inherited THEME_TO_TOPIC groups, so every page renders correctly today and
 * improves when the table lands.
 */

import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { THEME_TO_TOPIC } from './theme-data.mjs';
import { themePath } from './theme-pages.mjs';

const CACHE_PATH = join(dirname(fileURLToPath(import.meta.url)), '../data/theme-destinations.json');

let loaded;

/**
 * The captured table, or null when the Reading Room has not produced one yet.
 * A malformed or empty capture is treated as absent rather than allowed to
 * silently strip every reflection of its onward links.
 */
export function loadThemeDestinations(path = CACHE_PATH) {
  if (loaded !== undefined) return loaded;
  loaded = null;
  if (existsSync(path)) {
    try {
      const data = JSON.parse(readFileSync(path, 'utf8'));
      const entries = Object.entries(data.destinations || {}).filter(([theme, to]) => theme && to);
      if (entries.length) loaded = new Map(entries);
      else console.warn('  ⚠ data/theme-destinations.json holds no pairs — using the inherited theme groups');
    } catch (error) {
      console.warn(`  ⚠ data/theme-destinations.json unreadable (${error.message}) — using the inherited theme groups`);
    }
  }
  return loaded;
}

/** Only for tests: forget the memoized table. */
export function resetThemeDestinations() { loaded = undefined; }

/**
 * A stored destination is re-resolved through themePath() when it names a theme
 * page, so a row recorded as /topics/self-worth/ keeps working once that page
 * moves to an address that follows its title.
 */
function resolve(to) {
  const topicMatch = /^\/topics\/([a-z0-9-]+)\/$/.exec(to);
  return topicMatch ? themePath(topicMatch[1]) : to;
}

/** The path a theme sends the reader to, or null when it has no destination. */
export function themeDestination(theme) {
  const name = (theme || '').trim();
  if (!name) return null;
  const table = loadThemeDestinations();
  if (table) return table.has(name) ? resolve(table.get(name)) : null;
  const topic = THEME_TO_TOPIC[name];
  return topic ? themePath(topic.slug) : null;
}

/**
 * Reflections that share a destination, nearest first by day so the three shown
 * are not always the same three. The reflection itself, and its immediate
 * neighbours — already linked as previous and next — are left out.
 */
export function siblingReflections(reading, allReadings, exclude = []) {
  const destination = themeDestination(reading.secondary_theme);
  if (!destination) return [];
  const skip = new Set([reading.day_of_year, ...exclude]);
  return allReadings
    .filter(other => !skip.has(other.day_of_year) && themeDestination(other.secondary_theme) === destination)
    .sort((a, b) => {
      const distance = Math.abs(a.day_of_year - reading.day_of_year) - Math.abs(b.day_of_year - reading.day_of_year);
      return distance || a.day_of_year - b.day_of_year;
    });
}
