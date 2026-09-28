/**
 * The ten reflections shown on /reflections/favorites/.
 *
 * A fixed, chosen list rather than a live ranking. The page used to sort all 366
 * by reader ratings, which tied it to the favorites snapshot: refreshing it often
 * enough for the page to feel current would also have reshuffled the sibling cards
 * on every reflection page and the featured readings on every topic page, putting
 * 366 pages back on a nightly churn. Ten day numbers in a file cost nothing to
 * change and move nothing else.
 *
 * Cycle them whenever you like. `node scripts/capture-favorites.mjs --propose`
 * prints the current top of the ratings as a starting point.
 */

import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const CHOSEN_PATH = join(dirname(fileURLToPath(import.meta.url)), '../data/favorite-readings.json');

/**
 * The chosen days, in the order they should appear. Returns null when the file is
 * missing or unusable, so the caller can fall back rather than publish an empty
 * page.
 */
export function loadFavoriteReadings(path = CHOSEN_PATH) {
  if (!existsSync(path)) return null;
  try {
    const data = JSON.parse(readFileSync(path, 'utf8'));
    const days = (data.days || []).map(Number).filter(day => Number.isInteger(day) && day >= 1 && day <= 366);
    return days.length ? days : null;
  } catch (error) {
    console.warn(`  ⚠ data/favorite-readings.json unreadable (${error.message})`);
    return null;
  }
}

/** The one-line teaser under a reading's title, shared with the reflection pages. */
export function readingTeaser(reading) {
  const teaser = (reading.thought_for_day || '')
    .replace(/\\n/g, ' ')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .trim();
  return teaser.length > 0 && teaser.length <= 110 ? teaser : '';
}
