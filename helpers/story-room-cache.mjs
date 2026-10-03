import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

/**
 * The last approved content the Story Room served, kept in the repo.
 *
 * The build used to stop dead when the Story Room did not answer — the right
 * call between its two options, since publishing with approved pages missing
 * is worse. But it meant a moment's trouble at 5am blocked every deploy,
 * including fixes with nothing to do with content, and the risk grew with each
 * article published: one call for the feed, then one per item.
 *
 * With this third option the build carries on from the last good answer and
 * says so loudly. The raw feed is cached rather than the filtered result, so a
 * change to the launch review still takes effect on a cached build.
 */

const VERSION = 1;

export function loadStoryRoomCache(path) {
  if (!existsSync(path)) return null;

  const parsed = JSON.parse(readFileSync(path, 'utf-8'));
  if (parsed?.v !== VERSION || !Array.isArray(parsed.feed) || !parsed.pages) {
    throw new Error(`Unrecognized Story Room cache at ${path}; refusing to build with it.`);
  }
  return { capturedAt: parsed.capturedAt, feed: parsed.feed, pages: parsed.pages, routes:parsed.routes||[] };
}

export function saveStoryRoomCache(path, { feed, pages, routes=[] }) {
  mkdirSync(dirname(path), { recursive: true });
  const ordered = {};
  for (const key of Object.keys(pages).sort()) ordered[key] = pages[key];
  writeFileSync(
    path,
    JSON.stringify({ v: VERSION, capturedAt: new Date().toISOString(), feed, pages: ordered, routes }, null, 2) + '\n',
    'utf-8'
  );
  return feed.length;
}
