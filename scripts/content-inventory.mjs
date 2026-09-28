#!/usr/bin/env node
/**
 * Every article and guide, where it lives, and what forwards to it.
 *
 * The catalogue has three sources that can disagree, and have: the Story Room,
 * which owns approved editorial content; the static catalogue in
 * helpers/content-catalog.mjs; and the pages that are live on dailypaths.org
 * today. A piece can be published in the Story Room at an address the site no
 * longer accepts, or live on the public site with nothing in the Story Room
 * behind it. Neither shows up by reading any one source.
 *
 * This reads all three and writes one table:
 *
 *   node scripts/content-inventory.mjs
 *     → editorial/content-inventory.csv    one row per piece, opens in a spreadsheet
 *     → editorial/content-inventory.md     the same, readable, grouped by status
 *
 * Nothing here writes to Supabase or the Story Room, and nothing here changes a
 * URL. It only reports. Fix what it finds in the place that owns it: content and
 * card text in the Story Room, deferral and suppression in helpers/launch-review.mjs,
 * addresses in helpers/theme-pages.mjs and build.mjs.
 *
 * The Story Room is read live when it can be reached and from
 * data/story-room-cache.json otherwise, so this runs without credentials. The
 * live site comes from origin/main's committed sitemap; run
 * `git fetch origin main` first if it is missing.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;

const { ARTICLES, GUIDES } = await import('../helpers/content-catalog.mjs');
const { LAUNCH_REVIEW } = await import('../helpers/launch-review.mjs');
const { ARTICLE_PLACEHOLDERS } = await import('../templates/article-placeholders.mjs');
const { MOVED_THEME_PAGES, themePath } = await import('../helpers/theme-pages.mjs');
const { TOPICS } = await import('../helpers/theme-data.mjs');
const { getPublished, validPath, CACHE_PATH } = await import('../helpers/story-room.mjs');
const { loadStoryRoomCache } = await import('../helpers/story-room-cache.mjs');

// --- The three sources ---------------------------------------------------

// Every item the Story Room publishes, before the site's own filtering, so the
// ones it drops can be reported rather than silently vanishing.
let snapshot = loadStoryRoomCache(CACHE_PATH);
let feedSource = snapshot ? `cache captured ${snapshot.capturedAt}` : 'no cache';
try {
  await getPublished();                       // refreshes the cache as a side effect
  const fresh = loadStoryRoomCache(CACHE_PATH);
  // Both the feed and the pages have to come from the same snapshot, or a word
  // count describes the version this ran before rather than the one it reports.
  if (fresh) { snapshot = fresh; feedSource = `live, captured ${fresh.capturedAt}`; }
} catch (err) {
  console.warn(`  Story Room unreachable (${err.message}); using the cache.`);
}
const feed = snapshot?.feed ?? [];

// What answers on dailypaths.org right now.
let live = new Set();
try {
  const xml = execFileSync('git', ['show', 'origin/main:docs/sitemap.xml'],
    { cwd: root, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] });
  live = new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(m => m[1].trim().replace(/^https?:\/\/[^/]+/i, '')));
} catch {
  console.warn('  No origin/main sitemap; run `git fetch origin main` for the live column.');
}

// --- Which old addresses forward where -----------------------------------

const redirects = {};                         // destination → [old addresses]
const forwards = (from, to) => (redirects[to] ??= []).push(from);

for (const [slug, to] of Object.entries(MOVED_THEME_PAGES)) forwards(`/topics/${slug}/`, to);
for (const topic of TOPICS) forwards(`/themes/${topic.slug}/`, themePath(topic.slug));
forwards('/themes/letting-go-of-control/', themePath('letting-go'));
forwards('/about-alanon/', '/guides/about-alanon/');
forwards('/guides/detachment/', '/guides/detachment-with-love/');
for (const slug of ['', 'courage-to-change/', 'paths-to-recovery/', 'one-day-at-a-time/', 'how-al-anon-works/']) {
  forwards(`/literature/${slug}`, '/guides/about-alanon/');
}

// --- Assemble one row per piece ------------------------------------------

// A piece is keyed by the address it lives at now. The Story Room may publish it
// at an older address, which linkedStories maps forward.
const rows = new Map();
const row = path => rows.get(path) ?? (rows.set(path, {
  path, title: '', kind: '', status: '', storyRoom: '', author: '', words: null, note: '',
}).get(path));

for (const item of feed) {
  const path = LAUNCH_REVIEW.linkedStories[item.id] || item.path;
  const r = row(path);
  r.title = item.card_title || item.title;
  r.kind = item.content_type === 'guide' ? 'Guide' : 'Article';
  r.author = item.author || '';
  r.storyRoom = item.id;
  r.publishedAt = item.published_at;
  r.cmsPath = item.path;
  const html = snapshot?.pages?.[item.path];
  if (html) {
    const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] || '';
    r.words = main.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  }

  if (!validPath(path)) {
    r.status = 'Unreachable';
    r.note = `Published at ${item.path}, which the site no longer accepts. Republish at a /guides/… or /articles/… address.`;
  } else if (LAUNCH_REVIEW.retiredPaths.includes(path)) {
    r.status = 'Suppressed';
    r.note = 'Dropped from the feed by launch-review. No page is built and nothing is submitted to search.';
  } else if (LAUNCH_REVIEW.deferred.includes(path)) {
    r.status = 'Deferred';
    r.note = 'Hidden from the preview listings, but a production build still lists it. Awaiting its rewrite.';
  } else {
    r.status = 'Published';
  }
  if (item.path !== path) {
    r.note ||= `The Story Room publishes this at ${item.path}; the site serves it at ${path}.`;
  }
}

// Anything in the static catalogue the Story Room has not accounted for.
for (const [items, kind] of [[ARTICLES, 'Article'], [GUIDES, 'Guide']]) {
  for (const item of items) {
    const r = row(item.path);
    r.title ||= item.title;
    r.kind ||= kind;
    if (!r.storyRoom) {
      r.status = 'Not in the Story Room';
      r.note = 'Built from a template in this repository. Editing it means changing code, not publishing.';
    }
  }
}

// Topic pages that never became an article or a guide.
for (const topic of TOPICS) {
  const path = themePath(topic.slug);
  if (path.startsWith('/topics/')) {
    const r = row(path);
    r.title ||= topic.name;
    r.kind ||= 'Topic page';
    if (!r.storyRoom) {
      r.status = 'Not in the Story Room';
      r.note = 'An inherited topic page. Not promoted as an article or a guide, and still at its /topics/ address.';
    }
  }
}

for (const item of ARTICLE_PLACEHOLDERS) {
  const r = row(item.path);
  r.title = item.title;
  r.kind = 'Article';
  r.status = 'Reserved';
  r.note = 'An address held for a piece that has not been written. Built noindex in the preview only.';
}

for (const r of rows.values()) {
  r.redirects = redirects[r.path] || [];
  r.live = live.has(r.path);
  // A live address that now forwards is still reachable; one that neither
  // answers nor forwards is the case worth seeing.
  r.liveElsewhere = r.redirects.filter(p => live.has(p));
}

// --- Output ---------------------------------------------------------------

const ORDER = ['Unreachable', 'Suppressed', 'Not in the Story Room', 'Deferred', 'Reserved', 'Published'];
const all = [...rows.values()].sort((a, b) =>
  ORDER.indexOf(a.status) - ORDER.indexOf(b.status) || a.kind.localeCompare(b.kind) || a.path.localeCompare(b.path));

const csvCell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
const csv = [['title', 'kind', 'status', 'url', 'forwards_from', 'in_story_room', 'story_room_id',
  'author', 'words', 'live_on_dailypaths_today', 'note'].join(',')];
for (const r of all) {
  csv.push([r.title, r.kind, r.status, r.path, r.redirects.join(' '), r.storyRoom ? 'yes' : 'no',
    r.storyRoom, r.author, r.words ?? '', r.live ? 'yes' : (r.liveElsewhere.length ? `via ${r.liveElsewhere.join(' ')}` : 'no'),
    r.note].map(csvCell).join(','));
}
writeFileSync(join(root, 'editorial/content-inventory.csv'), csv.join('\n') + '\n');

const EXPLAIN = {
  'Unreachable': 'Published in the Story Room, but at an address this site will not serve. Nobody can read it until it is republished at a /guides/… or /articles/… address.',
  'Suppressed': 'Deliberately dropped from the feed. No page is built and nothing reaches search. One line in helpers/launch-review.mjs restores it.',
  'Not in the Story Room': 'The page comes from a template in this repository, so editing it means a code change. Publishing it from the Story Room at the same address hands it over.',
  'Deferred': 'Hidden from the preview listings while it waits for a rewrite. Note that a production build lists it anyway — see A6 in LAUNCH-READINESS.md.',
  'Reserved': 'An address held for a piece that has not been written yet.',
  'Published': 'Published from the Story Room and served at the address below.',
};

const md = ['# Articles and guides — where everything stands', '',
  `Generated by \`npm run inventory\` on ${new Date().toISOString().slice(0, 10)}.`,
  `Story Room: ${feedSource}. Live site: ${live.size ? `${live.size} addresses from origin/main` : 'not available'}.`,
  '', 'Do not edit this file; it is regenerated. Change a piece where it is owned —',
  'content and card text in the Story Room, deferral in `helpers/launch-review.mjs`,',
  'addresses in `helpers/theme-pages.mjs` and `build.mjs`.', ''];

for (const status of ORDER) {
  const group = all.filter(r => r.status === status);
  if (!group.length) continue;
  md.push(`## ${status} — ${group.length}`, '', EXPLAIN[status], '',
    '| Piece | Kind | Address | Forwards from | Live today | Words |',
    '|---|---|---|---|---|---|');
  for (const r of group) {
    md.push(`| ${r.title} | ${r.kind} | \`${r.path}\` | ${r.redirects.map(p => `\`${p}\``).join('<br>') || '—'} | ${r.live ? 'yes' : (r.liveElsewhere.length ? `as \`${r.liveElsewhere[0]}\`` : 'no')} | ${r.words ?? '—'} |`);
  }
  md.push('');
  for (const r of group.filter(r => r.note && r.status !== 'Published')) md.push(`- **${r.title}** — ${r.note}`);
  md.push('');
}
writeFileSync(join(root, 'editorial/content-inventory.md'), md.join('\n') + '\n');

console.log(`\n${all.length} pieces: ` + ORDER.map(s => `${all.filter(r => r.status === s).length} ${s.toLowerCase()}`).join(', '));
console.log('\nWrote:');
console.log('  editorial/content-inventory.csv');
console.log('  editorial/content-inventory.md');
