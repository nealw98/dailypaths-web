/**
 * Pre-deploy check for the site index.
 *
 * Confirms that everything the sitemap advertises is a real, indexable page,
 * and that no redirect sends a reader in a circle or through an extra hop.
 * A search engine that meets either problem quietly drops the page, so this
 * runs before a deploy rather than after.
 *
 *   node scripts/check-sitemap.mjs [docs|dist]
 *
 * Exits non-zero when it finds a problem, so CI can stop a bad deploy.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { isAbsolute, join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const target = process.argv[2] || 'docs';
const outDir = isAbsolute(target) ? target : join(root, target);

if (!existsSync(outDir)) {
  console.error(`No build found at ${relative(root, outDir)}. Build the site first.`);
  process.exit(1);
}

const sitemapPath = join(outDir, 'sitemap.xml');
if (!existsSync(sitemapPath)) {
  console.error(`No sitemap.xml in ${relative(root, outDir)}.`);
  process.exit(1);
}

const problems = [];
const note = (kind, detail) => problems.push({ kind, detail });

// The private preview marks every page noindex on purpose, so that check only
// applies to a production build.
const robotsPath = join(outDir, 'robots.txt');
const isPreviewBuild = existsSync(robotsPath) && /^\s*Disallow:\s*\/\s*$/m.test(readFileSync(robotsPath, 'utf-8'));
if (isPreviewBuild) console.log('\nPreview build detected — skipping the noindex check.');

/** Strip the origin from a sitemap loc or redirect target, leaving the path. */
const toPath = value => {
  const trimmed = String(value || '').trim();
  const withoutOrigin = trimmed.replace(/^https?:\/\/[^/]+/i, '');
  return withoutOrigin.startsWith('/') ? withoutOrigin : `/${withoutOrigin}`;
};

const pageFor = urlPath => join(outDir, urlPath.replace(/^\/+/, ''), 'index.html');

const refreshTarget = html => {
  const meta = html.match(/<meta\b[^>]*http-equiv=["']refresh["'][^>]*>/i)?.[0];
  if (!meta) return null;
  const url = meta.match(/url=([^"'\s;]+)/i)?.[1];
  return url ? toPath(url) : null;
};

const isNoindex = html =>
  /<meta\b(?=[^>]*name=["']robots["'])[^>]*content=["'][^"']*noindex/i.test(html);

// --- 1. Every sitemap entry must be a real, indexable page ---

const sitemap = readFileSync(sitemapPath, 'utf-8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

if (locs.length === 0) note('sitemap', 'The sitemap lists no URLs at all.');

const seen = new Set();
for (const loc of locs) {
  const urlPath = toPath(loc);

  if (seen.has(urlPath)) note('duplicate', `${urlPath} is listed more than once`);
  seen.add(urlPath);

  const file = pageFor(urlPath);
  if (!existsSync(file)) {
    note('missing', `${urlPath} is in the sitemap but no page was built`);
    continue;
  }

  const html = readFileSync(file, 'utf-8');
  if (refreshTarget(html)) {
    note('redirect-listed', `${urlPath} is in the sitemap but is a redirect stub`);
  }
  if (!isPreviewBuild && isNoindex(html)) {
    note('noindex-listed', `${urlPath} is in the sitemap but asks not to be indexed`);
  }

  const href = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1];
  if (!href) {
    note('canonical', `${urlPath} has no canonical link`);
  } else if (toPath(href) !== urlPath) {
    note('canonical', `${urlPath} points its canonical at ${toPath(href)}`);
  }
}

// --- 2. No redirect may loop, chain, or dead-end ---

/** Every built page path, so redirects can be followed without guessing. */
const redirects = new Map();
const realPages = new Set();

(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    if (entry !== 'index.html') continue;
    const urlPath = `/${relative(outDir, dir).split('\\').join('/')}/`.replace('//', '/');
    const html = readFileSync(full, 'utf-8');
    const target = refreshTarget(html);
    if (target) redirects.set(urlPath, target);
    else realPages.add(urlPath);
  }
})(outDir);

for (const [from, to] of redirects) {
  const path = [from];
  let cursor = to;

  while (redirects.has(cursor)) {
    if (path.includes(cursor)) {
      note('loop', `${path.join(' \u2192 ')} \u2192 ${cursor} circles back`);
      cursor = null;
      break;
    }
    path.push(cursor);
    cursor = redirects.get(cursor);
    if (path.length > 8) {
      note('loop', `${from} redirects through more than 8 hops`);
      cursor = null;
      break;
    }
  }

  if (cursor === null) continue;

  if (path.length > 1) {
    note('chain', `${from} reaches ${cursor} through ${path.length - 1} extra hop(s)`);
  }
  if (!realPages.has(cursor)) {
    note('dead-end', `${from} redirects to ${cursor}, which was not built`);
  }
}

// --- Report ---

const counts = problems.reduce((acc, p) => ({ ...acc, [p.kind]: (acc[p.kind] || 0) + 1 }), {});

console.log(`\nChecked ${locs.length} sitemap URLs and ${redirects.size} redirects in ${relative(root, outDir) || '.'}\n`);

if (problems.length === 0) {
  console.log(`  ${realPages.size} pages built. No problems found.\n`);
  process.exit(0);
}

for (const [kind, count] of Object.entries(counts)) {
  console.log(`  ${kind}: ${count}`);
}
console.log('');
for (const { kind, detail } of problems.slice(0, 40)) {
  console.log(`  [${kind}] ${detail}`);
}
if (problems.length > 40) console.log(`  ...and ${problems.length - 40} more`);
console.log('');

process.exit(1);
