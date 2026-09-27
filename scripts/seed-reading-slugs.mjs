#!/usr/bin/env node
/**
 * Freeze each reflection's URL, and recover the ones already abandoned.
 *
 * A reflection's address used to be derived from its title, so retitling it in
 * the Reading Room silently moved the page and left the old address dead. This
 * writes data/reading-slugs.json, which the build reads instead of deriving
 * slugs, so a title can change without the URL moving.
 *
 * Current addresses are taken from the deployed sitemap. Every earlier sitemap
 * in git history is then read to find addresses that were once live and are
 * not any more; those are recorded so the build can redirect them.
 *
 *   node scripts/seed-reading-slugs.mjs
 *   node scripts/seed-reading-slugs.mjs --ref origin/main --write
 *
 * Without --write it reports what it found and changes nothing.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MONTHS, DAYS_IN_MONTH, dayToSlug } from '../helpers/slug-utils.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const argOf = name => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
};
const ref = argOf('ref') || 'origin/main';
const write = process.argv.includes('--write');
const SITEMAP = 'docs/sitemap.xml';
const OUT = join(ROOT, 'data', 'reading-slugs.json');

/** "september-25" → 269 */
const dayByDatePrefix = new Map();
{
  let day = 0;
  for (let m = 0; m < 12; m++) {
    for (let d = 1; d <= DAYS_IN_MONTH[m]; d++) dayByDatePrefix.set(`${MONTHS[m]}-${d}`, ++day);
  }
}

const git = args => execFileSync('git', args, { cwd: ROOT, encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024 });

/** Reflection slugs in one sitemap, as day_of_year → slug. */
function readingSlugsIn(xml) {
  const found = new Map();
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const path = match[1].trim().replace(/^https?:\/\/[^/]+/i, '').replace(/^\/|\/$/g, '');
    const parts = path.match(/^([a-z]+-\d{1,2})(?:-(.+))?$/);
    if (!parts) continue;
    const day = dayByDatePrefix.get(parts[1]);
    if (day) found.set(day, path);
  }
  return found;
}

let commits;
try {
  commits = git(['log', ref, '--format=%H', '--', SITEMAP]).trim().split('\n').filter(Boolean);
} catch {
  console.error(`Could not read ${SITEMAP} history from ${ref}. Try: git fetch origin main`);
  process.exit(1);
}

if (commits.length === 0) {
  console.error(`No history for ${SITEMAP} on ${ref}.`);
  process.exit(1);
}

// The newest commit holds the addresses that are deployed right now. Freezing
// to these means launching 2.0 moves no reflection URL at all.
const current = readingSlugsIn(git(['show', `${commits[0]}:${SITEMAP}`]));
console.log(`\n${ref}: ${commits.length} sitemaps in history`);
console.log(`Current deployed addresses: ${current.size} reflections\n`);

const past = new Map();
let scanned = 0;
for (const commit of commits) {
  let xml;
  try {
    xml = git(['show', `${commit}:${SITEMAP}`]);
  } catch {
    continue;
  }
  scanned++;
  for (const [day, slug] of readingSlugsIn(xml)) {
    if (current.get(day) === slug) continue;
    if (!past.has(day)) past.set(day, new Set());
    past.get(day).add(slug);
  }
}

// An address that is some other reflection's current address is never a
// redirect, however it appears in history. The bare date form is not recorded
// either: the build already redirects it to whatever the current address is.
const live = new Set(current.values());
let abandoned = 0;
const pastOut = {};
for (const day of [...past.keys()].sort((a, b) => a - b)) {
  const slugs = [...past.get(day)].filter(s => !live.has(s) && s !== dayToSlug(day)).sort();
  if (slugs.length === 0) continue;
  pastOut[day] = slugs;
  abandoned += slugs.length;
}

console.log(`Scanned ${scanned} sitemaps.`);
console.log(`Abandoned addresses found: ${abandoned} across ${Object.keys(pastOut).length} reflections\n`);

for (const [day, slugs] of Object.entries(pastOut).slice(0, 25)) {
  console.log(`  day ${String(day).padStart(3)} → ${current.get(Number(day))}`);
  for (const s of slugs) console.log(`          was  ${s}`);
}
if (Object.keys(pastOut).length > 25) console.log(`  ...and ${Object.keys(pastOut).length - 25} more reflections\n`);

if (!write) {
  console.log(`\nNothing written. Re-run with --write to save ${relative(ROOT, OUT)}.\n`);
  process.exit(0);
}

const slugs = {};
for (const day of [...current.keys()].sort((a, b) => a - b)) slugs[day] = current.get(day);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ v: 1, frozenAt: new Date().toISOString().split('T')[0], slugs, past: pastOut }, null, 2) + '\n', 'utf-8');
console.log(`\nWrote ${relative(ROOT, OUT)} — ${Object.keys(slugs).length} frozen, ${abandoned} to redirect\n`);
