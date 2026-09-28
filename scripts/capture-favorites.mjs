#!/usr/bin/env node
/**
 * Capture reader favorites into data/favorites-snapshot.json.
 *
 * The site build reads that file instead of querying Supabase, so the ordering of
 * the sibling cards on reflection pages and the featured readings on principle
 * pages change only when this runs.
 *
 *   node scripts/capture-favorites.mjs
 *
 * Runs quarterly from .github/workflows/refresh-favorites.yml, and on demand.
 * Refuses to write an empty snapshot, so a bad response can't wipe the ordering.
 *
 *   node scripts/capture-favorites.mjs --propose
 *
 * Writes nothing. Prints the current top of the ratings, for cycling the ten in
 * data/favorite-readings.json — that list is chosen rather than ranked, so the
 * favorites page can change without moving anything else.
 */

import 'dotenv/config';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchAllReadings } from '../helpers/fetch-readings.mjs';
import { fetchReadingRatings } from '../helpers/fetch-ratings.mjs';
import { loadFavoritesSnapshot, saveFavoritesSnapshot } from '../helpers/favorites-snapshot.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const snapshotPath = join(ROOT, 'data', 'favorites-snapshot.json');

const previous = (() => {
  try {
    return loadFavoritesSnapshot(snapshotPath);
  } catch (err) {
    console.warn(`Could not read the existing snapshot (${err.message}); writing a fresh one.`);
    return null;
  }
})();

const readings = await fetchAllReadings();
const ratings = await fetchReadingRatings(readings);

// --propose only reads. The ten on the favorites page are chosen by hand; this
// just shows what readers are actually returning to, as a starting point.
if (process.argv.includes('--propose')) {
  const byDay = new Map(readings.map(reading => [reading.day_of_year, reading]));
  const scored = [...ratings.entries()]
    .map(([day, stats]) => ({ day, ...stats, score: (stats.positive || 0) + (stats.favorites || 0) }))
    .sort((a, b) => b.score - a.score || (b.favorites || 0) - (a.favorites || 0) || a.day - b.day)
    .slice(0, 20);
  console.log('\nHighest-rated reflections. Pick ten for data/favorite-readings.json:\n');
  console.log('  day  score  fav  pos   reflection');
  for (const row of scored) {
    const reading = byDay.get(row.day);
    console.log(`  ${String(row.day).padStart(3)}  ${String(row.score).padStart(5)}  ${String(row.favorites || 0).padStart(3)}  ${String(row.positive || 0).padStart(3)}   ${reading ? `${reading.display_date} — ${reading.title}` : '?'}`);
  }
  const months = new Set(scored.slice(0, 10).map(row => (byDay.get(row.day)?.display_date || '').split(' ')[0]));
  console.log(`\n  "days": [${scored.slice(0, 10).map(row => row.day).join(', ')}]`);
  console.log(`  Top ten span ${months.size} month(s) — worth spreading if they cluster.\n`);
  process.exit(0);
}

if (ratings.size === 0) {
  console.error('Supabase returned no reader favorites. Refusing to overwrite the snapshot with nothing.');
  process.exit(1);
}

const today = new Date().toISOString().split('T')[0];
const count = saveFavoritesSnapshot(snapshotPath, ratings, today);

console.log(`\nCaptured reader favorites for ${count} days on ${today}`);
console.log(`  ${relative(ROOT, snapshotPath)}`);
if (previous) {
  const moved = [...ratings.keys()].filter(day => {
    const before = previous.ratings.get(day);
    const after = ratings.get(day);
    if (!before) return true;
    return before.positive !== after.positive || before.favorites !== after.favorites;
  });
  console.log(`  Previous capture ${previous.capturedAt}; ${moved.length} day(s) changed since`);
}
console.log('');
