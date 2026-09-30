/**
 * Capture reflection_theme_destinations into data/theme-destinations.json.
 *
 *   npm run themes:capture
 *
 * The table is editorial and lives in Supabase; the build reads the captured file
 * so a build is reproducible and survives the database being unreachable. Nothing
 * captured it before, so the committed file drifted three days behind the table
 * and disagreed with it on seventeen themes — the build was rendering Go deeper
 * cards from destinations that had since been changed, and missing ones that had
 * since been set.
 *
 * Read-only. Run it after changing destinations in Supabase, and commit the result.
 */

import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'data/theme-destinations.json');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;
if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment');

const response = await fetch(`${url}/rest/v1/reflection_theme_destinations?select=theme,destination&order=theme`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
});
if (!response.ok) throw new Error(`Supabase fetch failed: ${response.status} ${response.statusText}`);

const rows = await response.json();
if (!Array.isArray(rows) || rows.length === 0) {
  throw new Error('reflection_theme_destinations came back empty; refusing to overwrite the capture with nothing.');
}

// A theme with no destination is a real state — it means "grouped, but nothing to
// link on to yet" — but the build treats absent and blank the same way, so only
// the pairs are written and the blanks are reported instead.
const pairs = rows.filter(r => r.theme && (r.destination || '').trim());
const blank = rows.length - pairs.length;

const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')).destinations || {} : {};
const destinations = Object.fromEntries(pairs
  .map(r => [r.theme.trim(), r.destination.trim()])
  .sort((a, b) => a[0].localeCompare(b[0])));

const added = Object.keys(destinations).filter(t => !previous[t]);
const removed = Object.keys(previous).filter(t => !destinations[t]);
const changed = Object.keys(destinations).filter(t => previous[t] && previous[t] !== destinations[t]);

writeFileSync(OUT, JSON.stringify({
  v: 1,
  captured: new Date().toISOString().slice(0, 10),
  source: 'Supabase reflection_theme_destinations',
  destinations,
}, null, 2) + '\n');

console.log(`  data/theme-destinations.json — ${Object.keys(destinations).length} themes with a destination, ${blank} without`);
if (added.length) console.log(`    + ${added.length} newly pointed: ${added.slice(0, 8).join(', ')}${added.length > 8 ? '…' : ''}`);
if (removed.length) console.log(`    − ${removed.length} no longer pointed: ${removed.slice(0, 8).join(', ')}${removed.length > 8 ? '…' : ''}`);
if (changed.length) console.log(`    ~ ${changed.length} moved: ${changed.map(t => `${t} → ${destinations[t]}`).slice(0, 5).join(', ')}${changed.length > 5 ? '…' : ''}`);
