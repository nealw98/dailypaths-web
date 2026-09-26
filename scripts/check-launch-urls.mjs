/**
 * Pre-launch check: would any address that is live today become a dead end?
 *
 * Compares the sitemap of a baseline (by default the deployed build on
 * origin/main) against the sitemap of the build in hand, and for every URL that
 * disappears, looks in the new build to see whether something still answers at
 * that address. A URL that vanishes with nothing left behind is a 404 waiting
 * to happen — for a reader with a bookmark, and for Google.
 *
 *   node scripts/check-launch-urls.mjs
 *   node scripts/check-launch-urls.mjs --build dist
 *   node scripts/check-launch-urls.mjs --baseline path/to/old-sitemap.xml
 *
 * Exits non-zero when a dropped URL has no page and no redirect.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;

const arg = name => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
};

const buildArg = arg('build') || 'docs';
const outDir = isAbsolute(buildArg) ? buildArg : join(root, buildArg);
const baselineArg = arg('baseline') || 'origin/main:docs/sitemap.xml';

const locsFrom = xml => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map(m => m[1].trim().replace(/^https?:\/\/[^/]+/i, ''))
  .map(p => (p.startsWith('/') ? p : `/${p}`));

// --- Load the baseline sitemap: a git ref, or a file on disk ---

function readBaseline(source) {
  if (source.includes(':') && !existsSync(source)) {
    try {
      return execFileSync('git', ['show', source], { cwd: root, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] });
    } catch {
      throw new Error(`Could not read ${source} from git. Fetch it first (git fetch origin main), or pass --baseline with a file.`);
    }
  }
  const path = isAbsolute(source) ? source : join(root, source);
  if (!existsSync(path)) throw new Error(`No baseline sitemap at ${source}`);
  return readFileSync(path, 'utf-8');
}

let baselineXml;
try {
  baselineXml = readBaseline(baselineArg);
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

const currentPath = join(outDir, 'sitemap.xml');
if (!existsSync(currentPath)) {
  console.error(`No sitemap at ${relative(root, currentPath)}. Build the site first.`);
  process.exit(1);
}

const before = locsFrom(baselineXml);
const after = locsFrom(readFileSync(currentPath, 'utf-8'));

if (before.length === 0) {
  console.error('The baseline sitemap lists no URLs; nothing to compare against.');
  process.exit(1);
}

// --- What happens at each address that is no longer advertised? ---

const refreshTarget = html => {
  const meta = html.match(/<meta\b[^>]*http-equiv=["']refresh["'][^>]*>/i)?.[0];
  if (!meta) return null;
  const url = meta.match(/url=([^"'\s;]+)/i)?.[1];
  return url ? url.replace(/^https?:\/\/[^/]+/i, '') : null;
};

const currentSet = new Set(after);
const dropped = before.filter(url => !currentSet.has(url));
const added = after.filter(url => !new Set(before).has(url));

const redirected = [];
const stillThere = [];
const dead = [];

for (const url of dropped) {
  const file = join(outDir, url.replace(/^\/+/, ''), 'index.html');
  if (!existsSync(file)) {
    dead.push({ url });
    continue;
  }
  const target = refreshTarget(readFileSync(file, 'utf-8'));
  if (target) redirected.push({ url, target });
  else stillThere.push({ url });
}

// --- Report ---

console.log(`\nBaseline ${baselineArg} — ${before.length} URLs`);
console.log(`Build    ${relative(root, outDir) || '.'} — ${after.length} URLs\n`);

if (redirected.length) {
  console.log(`  ${redirected.length} dropped and redirected:`);
  for (const { url, target } of redirected.slice(0, 20)) console.log(`    ${url} → ${target}`);
  if (redirected.length > 20) console.log(`    ...and ${redirected.length - 20} more`);
  console.log('');
}

if (stillThere.length) {
  console.log(`  ${stillThere.length} dropped from the sitemap but still published:`);
  for (const { url } of stillThere.slice(0, 20)) console.log(`    ${url}`);
  if (stillThere.length > 20) console.log(`    ...and ${stillThere.length - 20} more`);
  console.log('  (fine if deliberate — they simply stop being advertised)\n');
}

if (added.length) {
  console.log(`  ${added.length} new:`);
  for (const url of added.slice(0, 20)) console.log(`    ${url}`);
  if (added.length > 20) console.log(`    ...and ${added.length - 20} more`);
  console.log('');
}

if (dead.length === 0) {
  console.log('  No address loses its page. Nothing would 404.\n');
  process.exit(0);
}

console.log(`  ${dead.length} WOULD 404 — live today, gone with no redirect:`);
for (const { url } of dead.slice(0, 40)) console.log(`    ${url}`);
if (dead.length > 40) console.log(`    ...and ${dead.length - 40} more`);
console.log('');

process.exit(1);
