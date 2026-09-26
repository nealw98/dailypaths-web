#!/usr/bin/env node
/**
 * Capture reader favorites into data/favorites-snapshot.json.
 *
 * The site build reads that file instead of querying Supabase, so the ordering of
 * "Keep reading" cards, the favorites page, and the featured readings on
 * principle pages change only when this runs.
 *
 *   node scripts/capture-favorites.mjs
 *
 * Runs quarterly from .github/workflows/refresh-favorites.yml, and on demand.
 * Refuses to write an empty snapshot, so a bad response can't wipe the ordering.
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
