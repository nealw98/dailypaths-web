#!/usr/bin/env node
/**
 * The four inherited pages, captured as drafts to create in the Story Room.
 *
 * Community & Fellowship, Focus on Yourself, Trusting a Higher Power and
 * Understanding the Disease came from the old site and have never been in the
 * Story Room, so they are the only content that can be edited solely by changing
 * code. This lifts each page's current copy, with the metadata a Story Room entry
 * needs, so creating the drafts is paste rather than retype.
 *
 *   node scripts/leftover-drafts.mjs
 *     → editorial/leftover-drafts/<slug>.md    one per page
 *
 * It reads the built pages in docs/, so build first if they are stale. It writes
 * nothing to Supabase or the Story Room — AGENTS.md keeps database writes on the
 * editorial side, which is why these are prepared rather than created.
 *
 * Captured once as a starting point, not a live mirror: once a draft exists in the
 * Story Room, that draft is the copy that matters.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const outDir = join(root, 'editorial/leftover-drafts');

const { TOPICS } = await import('../helpers/theme-data.mjs');

// Everything from here on is shared page furniture — the contribution prompt,
// the featured readings, the reading list and the app band — not article copy.
const FURNITURE = /Share Your Experience|Featured Reflections|Daily Reflections on|Make room for yourself/;

const SLUGS = ['higher-power', 'focus-on-yourself', 'fellowship', 'the-disease'];

const unescape = s => s.replace(/&(?:amp|lt|gt|quot|#39|rsquo|lsquo|ldquo|rdquo|nbsp|mdash|ndash);/g,
  m => ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&rsquo;': '’',
          '&lsquo;': '‘', '&ldquo;': '“', '&rdquo;': '”', '&nbsp;': ' ', '&mdash;': '—', '&ndash;': '–' }[m]));
const text = s => unescape(s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ')).trim();

mkdirSync(outDir, { recursive: true });
let made = 0;

for (const slug of SLUGS) {
  const file = join(root, 'docs/topics', slug, 'index.html');
  if (!existsSync(file)) { console.warn(`  No built page for /topics/${slug}/ — skipping.`); continue; }
  const html = readFileSync(file, 'utf-8');
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? '';
  const body = main.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '');
  const hero = html.match(/<img class="photo-hero-img" src="([^"]+)"[^>]*alt="([^"]*)"/);
  const topic = TOPICS.find(t => t.slug === slug) ?? {};
  const title = text(body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? topic.name ?? slug);

  const blocks = [];
  let reachedFurniture = false;
  for (const [, tag, inner] of body.matchAll(/<(h1|h2|h3|p|li|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const t = text(inner);
    if (!t || t === 'Article') continue;
    if (FURNITURE.test(t)) reachedFurniture = true;
    if (reachedFurniture || tag.toLowerCase() === 'h1') continue;
    blocks.push([tag.toLowerCase(), t]);
  }

  const md = [`# ${title}`, '',
    '> **Draft for the Story Room.** The existing copy from',
    `> \`/topics/${slug}/\`, lifted verbatim as a starting point.`,
    '> Not reviewed, not approved, not published. Inherited text is not launch copy.', '',
    '| | |', '|---|---|',
    `| Publish at | \`/topics/${slug}/\` |`,
    '| Content type | article — change to guide if the rewrite makes it one |',
    `| Card summary | ${topic.shortDescription ?? ''} |`,
    `| Hero | \`${hero?.[1] ?? '—'}\` |`,
    `| Hero alt | ${hero?.[2] ?? '—'} |`, '',
    'Keep the `/topics/` address until the rewrite settles a title. Moving it is',
    'one line in `helpers/theme-pages.mjs`, which writes the redirect too — see',
    '`HANDOFF.md` §1. Assigning its themes is the last step, not the first.', '',
    '---', ''];

  for (const [tag, t] of blocks) {
    if (tag === 'h2' || tag === 'h3') md.push(`## ${t}`, '');
    else if (tag === 'li') md.push(`- ${t}`);
    else if (tag === 'blockquote') md.push(`> ${t}`, '');
    else md.push(t, '');
  }

  // A live copy defect, reported where whoever rewrites the page will meet it.
  if (blocks.some(([, t]) => t.startsWith('of us grew up thinking'))) {
    md.push('', '---', '',
      '**Note:** the first paragraph begins "of us grew up thinking…" — a word is',
      'missing from the opening, and it is live on dailypaths.org that way today.',
      'The text is not in this repository, so it comes from the topics table in',
      'Supabase. Worth fixing there, or it disappears with the rewrite anyway.');
  }

  writeFileSync(join(outDir, `${slug}.md`), md.join('\n').trimEnd() + '\n');
  console.log(`  ${slug.padEnd(20)} ${String(blocks.reduce((n, [, t]) => n + t.split(' ').length, 0)).padStart(5)} words`);
  made++;
}

console.log(`\n${made} draft${made === 1 ? '' : 's'} in editorial/leftover-drafts/.`);
console.log('Paste each into the Story Room as a private draft; a draft changes nothing on the site.');
