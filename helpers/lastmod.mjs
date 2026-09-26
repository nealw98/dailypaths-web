import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Truthful <lastmod> dates for the sitemap.
 *
 * The site rebuilds every morning whether or not a word changed, so stamping the
 * build date on all 400+ pages tells search engines the entire site changed
 * daily — which trains them to disregard the signal. Instead each page's
 * rendered HTML is hashed and compared with the previous build. A page's
 * recorded date moves only when its own content moves.
 *
 * The manifest is committed alongside docs/ so the dates survive between runs.
 * On the first build (no manifest yet) every page is dated today; from then on
 * the dates are real.
 */

const MANIFEST_VERSION = 1;

export function createLastmodIndex({ manifestPath, outDir, today }) {
  let previous = {};

  if (existsSync(manifestPath)) {
    try {
      const parsed = JSON.parse(readFileSync(manifestPath, 'utf-8'));
      if (parsed?.version === MANIFEST_VERSION && parsed.pages) previous = parsed.pages;
    } catch {
      // A damaged manifest re-dates every page once, rather than failing a build.
      console.warn('  Could not read the lastmod manifest; re-dating every page');
    }
  }

  const pages = {};
  let changed = 0;
  let missing = 0;

  /** Returns an ISO date for a sitemap path, or null when the page is absent. */
  function lastmodFor(urlPath) {
    if (pages[urlPath]) return pages[urlPath].lastmod;

    const file = join(outDir, urlPath.replace(/^\/+/, ''), 'index.html');
    if (!existsSync(file)) {
      missing++;
      return null;
    }

    const hash = createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 16);
    const before = previous[urlPath];
    const lastmod = before && before.hash === hash ? before.lastmod : today;
    if (!before || before.hash !== hash) changed++;

    pages[urlPath] = { hash, lastmod };
    return lastmod;
  }

  function save() {
    writeFileSync(
      manifestPath,
      JSON.stringify({ version: MANIFEST_VERSION, pages }, null, 2) + '\n',
      'utf-8'
    );
    const total = Object.keys(pages).length;
    console.log(`  Dated ${total} pages (${changed} changed since the last build)`);
    if (missing) console.warn(`  ${missing} sitemap path(s) had no page on disk`);
    return { total, changed, missing };
  }

  return { lastmodFor, save };
}
