import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

/**
 * Reader favorites, captured on a schedule rather than read live.
 *
 * Favorites and ratings decide the "Keep reading" ordering, the favorites page,
 * and the auto-featured readings on principle pages. Reading them fresh on every
 * nightly rebuild meant those pages could reshuffle at any hour for reasons no
 * one asked for — and a brief Supabase outage published a site with no favorites
 * at all. A captured snapshot makes the ordering change only when we refresh it.
 */

const VERSION = 1;

export function loadFavoritesSnapshot(path) {
  if (!existsSync(path)) return null;

  const parsed = JSON.parse(readFileSync(path, 'utf-8'));
  if (parsed?.v !== VERSION || !parsed.days) {
    throw new Error(`Unrecognized favorites snapshot at ${path}; refusing to build with it.`);
  }

  const ratings = new Map();
  for (const [day, stats] of Object.entries(parsed.days)) ratings.set(Number(day), stats);
  return { capturedAt: parsed.capturedAt, ratings };
}

export function saveFavoritesSnapshot(path, ratings, capturedAt) {
  const days = {};
  for (const day of [...ratings.keys()].sort((a, b) => a - b)) days[day] = ratings.get(day);

  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify({ v: VERSION, capturedAt, days }, null, 2) + '\n', 'utf-8');
  return Object.keys(days).length;
}
