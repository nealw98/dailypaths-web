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
 * The page a destination names, without any anchor.
 *
 * A destination may point into a section — /traditions/#tradition-1 lands better
 * than the top of a 36-reflection page. The anchor belongs to the link; the page
 * is what decides grouping and what the card says, so two themes pointing at
 * different sections of one guide still count as leading to the same place.
 */
export function destinationPage(to) {
  return to ? to.split('#')[0] : to;
}

/**
 * A stored destination is re-resolved through themePath() when it names a theme
 * page, so a row recorded as /topics/self-worth/ keeps working once that page
 * moves to an address that follows its title. Any anchor is carried across.
 */
function resolve(to) {
  const [path, anchor] = to.split('#');
  const topicMatch = /^\/topics\/([a-z0-9-]+)\/$/.exec(path);
  const resolved = topicMatch ? themePath(topicMatch[1]) : path;
  return anchor ? `${resolved}#${anchor}` : resolved;
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
 * What this reflection is shown alongside, and why.
 *
 * A theme with a destination groups by that destination — reflections from across
 * the year that lead to the same place. A theme without one falls back to the
 * Step, Tradition or Concept the reflection belongs to, which every reflection
 * has and which holds 22 to 26 of them.
 *
 * That fallback is what makes the theme table optional rather than a
 * prerequisite. Assigning a theme upgrades its reflections from grouped-by-Step
 * to grouped-by-idea; leaving one unassigned costs a better grouping, not the
 * block itself. 51 of the unassigned themes are used by a single reflection, so
 * requiring all of them would have been one decision per page for no gain.
 */
export function readingGroup(reading) {
  const destination = themeDestination(reading.secondary_theme);
  // Grouped by the page, not the anchor: two themes pointing at different sections
  // of one guide lead to the same place, so their reflections are related.
  if (destination) return { kind: 'destination', key: `destination:${destinationPage(destination)}`, destination };
  const program = (reading.step_theme || '').trim();
  if (!program) return null;
  // A Step holds 22 to 26 reflections, but an individual Tradition or Concept holds
  // two to four — Concept Eleven holds one — so those group as a whole collection
  // instead. Grouping them by number left 19 reflections with no siblings at all.
  const collection = /^(Tradition|Concept)\b/.exec(program);
  return collection
    ? { kind: 'program', key: `program:${collection[1]}`, program, label: `the ${collection[1]}s` }
    : { kind: 'program', key: `program:${program}`, program, label: program };
}

/**
 * Every reflection in the same group, best first.
 *
 * Ordered by how many readers marked it positively, then by nearness in the year.
 * The reflection itself and its immediate neighbours — already linked as previous
 * and next — are left out.
 */
export function siblingReflections(reading, allReadings, { exclude = [], ratingsMap } = {}) {
  const group = readingGroup(reading);
  if (!group) return [];
  const skip = new Set([reading.day_of_year, ...exclude]);
  const score = other => (ratingsMap?.get(other.day_of_year) || {}).positive || 0;
  return allReadings
    .filter(other => !skip.has(other.day_of_year) && readingGroup(other)?.key === group.key)
    .sort((a, b) => {
      const byScore = score(b) - score(a);
      if (byScore) return byScore;
      const byDistance = Math.abs(a.day_of_year - reading.day_of_year) - Math.abs(b.day_of_year - reading.day_of_year);
      return byDistance || a.day_of_year - b.day_of_year;
    });
}

/**
 * The handful to show, chosen so their theme words differ.
 *
 * Grouping by destination is what makes variety possible; spending it is a
 * separate step. Sixteen reflections point at Surrender through the word "Trust",
 * and showing three of those would read as one idea repeated. So each pick
 * prefers a theme word not already on display, and one unlike the reading's own.
 * Once every word is spoken for the remaining slots fill by rank, because three
 * good reflections beat two and a gap.
 */
export function pickSiblings(reading, allReadings, { limit = 3, exclude = [], ratingsMap } = {}) {
  const candidates = siblingReflections(reading, allReadings, { exclude, ratingsMap });
  const chosen = [];
  const spoken = new Set([(reading.secondary_theme || '').trim()]);
  for (const candidate of candidates) {
    if (chosen.length === limit) break;
    const theme = (candidate.secondary_theme || '').trim();
    if (!spoken.has(theme)) {
      chosen.push(candidate);
      spoken.add(theme);
    }
  }
  for (const candidate of candidates) {
    if (chosen.length === limit) break;
    if (!chosen.includes(candidate)) chosen.push(candidate);
  }
  return chosen;
}
