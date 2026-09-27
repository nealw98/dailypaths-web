#!/usr/bin/env node
/**
 * Theme → destination worksheet.
 *
 * Every reflection carries a free-text theme in readings.secondary_theme. One day
 * that column decides two things: which article or guide the reflection's pill
 * points at, and which other reflections it is shown alongside. Both fall out of a
 * single list of theme → destination pairs, read in either direction.
 *
 * This writes that list out as a worksheet to fill in:
 *
 *   node scripts/theme-destinations.mjs
 *     → editorial/theme-destinations.csv     one row per theme in use
 *     → editorial/theme-destinations.md      the same, readable, plus the
 *                                            destinations you can choose from
 *
 *   node scripts/theme-destinations.mjs --sql
 *     → scripts/out/november-themes.sql      the 30 November repairs, as UPDATEs
 *
 * Nothing here writes to the database. --sql produces a file to read and then run
 * in the Supabase SQL editor, the same arrangement as import-reading-tags.mjs.
 *
 * Readings come from Supabase when SUPABASE_URL and SUPABASE_ANON_KEY are set, and
 * from docs/readings-manifest.json otherwise, so the worksheet can be regenerated
 * without credentials.
 */

// Optional: the worksheet falls back to the committed manifest, so it runs before
// npm install as well.
await import('dotenv/config').catch(() => {});
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { GUIDES, ARTICLES } from '../helpers/content-catalog.mjs';
import { TOPIC_THEME_TAGS } from '../helpers/theme-data.mjs';
import { themePath } from '../helpers/theme-pages.mjs';
import { STEPS } from '../templates/steps.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * November 1–30 was entered with a step number in the theme column. These are the
 * words that block is missing, proposed rather than decided: each is already in use
 * elsewhere except Meditation and Service, so the reflections join existing groups
 * instead of becoming thirty groups of one.
 */
const NOVEMBER_PROPOSALS = {
  306: 'Trust',          307: 'Prayer',          308: 'Simplicity',
  309: 'Patience',       310: 'Spiritual Connection', 311: 'Meditation',
  312: 'Detachment',     313: 'Meditation',      314: 'Faith',
  315: 'Surrender',      316: 'Self-Care',       317: 'Humility',
  318: 'Trust',          319: 'Serenity',        320: 'Control',
  321: 'Humility',       322: 'Trust',           323: 'Service',
  324: 'Prayer',         325: 'Fellowship',      326: 'Self-compassion',
  327: 'Presence',       328: 'Willingness',     329: 'Connection',
  330: 'Surrender',      331: 'Faith',           332: 'Willingness',
  333: 'Sanity',         334: 'Gratitude',       335: 'Humility',
};

const MISFILED = /^(step|tradition|concept)\s*\d+$/i;

/**
 * Two spellings of one theme each, to be merged in the data. Both spellings
 * already pointed at the same place, so the merge is tidying, not a change of
 * meaning.
 */
const MERGES = {
  'Self-care': 'Self-Care',
  'Self-acceptance': 'Self-Acceptance',
};

/**
 * Destinations settled by name: each theme word is the spiritual principle of the
 * Step it points at, so no judgment was involved. Approved 27 September.
 */
const APPROVED_DESTINATIONS = {
  Humility: '/steps/al-anon-step-7-humility/',
  Service: '/steps/al-anon-step-12-service/',
  Courage: '/steps/al-anon-step-4-courage/',
};

/** Where a theme may point. Pages that item 9 has still to build are marked. */
function destinations() {
  const pieces = [...GUIDES, ...ARTICLES].map(p => ({
    path: p.path, label: p.title, group: 'Articles & guides', built: true,
  }));
  const steps = STEPS.map(s => ({
    path: `/steps/${s.pathSlug}/`, label: `Step ${s.number} — ${s.principle}`,
    group: 'Steps', built: true,
  }));
  const hubs = [
    { path: '/traditions/', label: 'The Traditions', group: 'Hubs', built: false },
    { path: '/concepts/', label: 'The Concepts', group: 'Hubs', built: false },
  ];
  const seen = new Set();
  return [...pieces, ...steps, ...hubs].filter(d => !seen.has(d.path) && seen.add(d.path));
}

async function readings() {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    const { fetchAllReadings } = await import('../helpers/fetch-readings.mjs');
    const rows = await fetchAllReadings();
    return { source: 'Supabase', rows: rows.map(r => ({ day: r.day_of_year, title: r.title, theme: r.secondary_theme })) };
  }
  const file = join(root, 'docs/readings-manifest.json');
  const rows = JSON.parse(readFileSync(file, 'utf8'));
  return { source: 'docs/readings-manifest.json', rows: rows.map(r => ({ day: r.d, title: r.title, theme: r.theme })) };
}

/** Where each theme's reflections are sent today, via the inherited topic groups. */
function inheritedDestination() {
  const map = {};
  for (const [topic, tags] of Object.entries(TOPIC_THEME_TAGS)) {
    for (const tag of tags) map[tag] = themePath(topic);
  }
  return map;
}

const csvCell = value => {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

function main() {
  return readings().then(({ source, rows }) => {
    const inherited = inheritedDestination();
    const themes = new Map();

    for (const row of rows) {
      const theme = (row.theme || '').trim();
      if (!theme) continue;
      const proposed = MISFILED.test(theme) ? NOVEMBER_PROPOSALS[row.day] : null;
      const name = proposed || theme;
      if (!themes.has(name)) themes.set(name, { name, days: [], repaired: 0 });
      const entry = themes.get(name);
      entry.days.push(row);
      if (proposed) entry.repaired++;
    }

    const list = [...themes.values()]
      .map(t => ({ ...t, today: inherited[t.name] || '' }))
      .sort((a, b) => b.days.length - a.days.length || a.name.localeCompare(b.name));

    const header = ['theme', 'reflections', 'points_to_today', 'new_destination', 'status', 'sample_1', 'sample_2', 'sample_3'];
    const lines = [header.join(',')];
    for (const t of list) {
      const samples = t.days.slice(0, 3).map(d => d.title);
      lines.push([
        t.name, t.days.length, t.today, t.today,
        t.today ? 'carried over — change if you disagree' : 'NEEDS A DESTINATION',
        samples[0] || '', samples[1] || '', samples[2] || '',
      ].map(csvCell).join(','));
    }
    writeFileSync(join(root, 'editorial/theme-destinations.csv'), lines.join('\n') + '\n');

    const needed = list.filter(t => !t.today);
    const options = destinations();
    const md = [
      '# Theme → destination worksheet',
      '',
      `Generated by \`scripts/theme-destinations.mjs\` from ${source}. Fill in the`,
      'blank destinations in `editorial/theme-destinations.csv`, which opens in any',
      'spreadsheet. Proposals are proposals: change anything you disagree with.',
      '',
      `- **${list.length} themes** in use across ${list.reduce((n, t) => n + t.days.length, 0)} reflections`,
      `- **${list.length - needed.length}** already have a destination, carried over from the inherited topic groups`,
      `- **${needed.length}** need one — these are the rows to work through`,
      `- **30** November reflections are shown under their proposed theme, not the step number now in the column`,
      '',
      '## Destinations to choose from',
      '',
    ];
    for (const group of ['Articles & guides', 'Guides', 'Steps', 'Hubs']) {
      const rows = options.filter(o => o.group === group);
      if (!rows.length) continue;
      md.push(`### ${group}`, '');
      for (const o of rows) md.push(`- \`${o.path}\` — ${o.label}${o.built ? '' : ' *(not built yet — item 9)*'}`);
      md.push('');
    }
    md.push('## Themes needing a destination', '', '| Theme | Reflections | Sample titles |', '|---|---|---|');
    for (const t of needed) md.push(`| ${t.name} | ${t.days.length} | ${t.days.slice(0, 3).map(d => d.title).join(' · ')} |`);
    md.push('', '## Themes already pointed somewhere', '', '| Theme | Reflections | Points to today |', '|---|---|---|');
    for (const t of list.filter(x => x.today)) md.push(`| ${t.name} | ${t.days.length} | \`${t.today}\` |`);
    writeFileSync(join(root, 'editorial/theme-destinations.md'), md.join('\n') + '\n');

    if (process.argv.includes('--sql')) {
      mkdirSync(join(root, 'scripts/out'), { recursive: true });
      const quote = text => text.replaceAll("'", "''");
      const sql = [
        '-- November 1–30 was entered with a step number in secondary_theme.',
        '-- Proposed replacements, drawn from words already in use elsewhere.',
        '-- Read this before running it; nothing here has been applied.',
        '',
      ];
      for (const [day, theme] of Object.entries(NOVEMBER_PROPOSALS)) {
        const row = rows.find(r => r.day === Number(day));
        sql.push(`UPDATE readings SET secondary_theme = '${quote(theme)}' WHERE day_of_year = ${day}; -- ${row?.title ?? ''}`);
      }
      sql.push('', '-- The two spelling collisions. Both already led to the same place.', '');
      for (const [from, to] of Object.entries(MERGES)) {
        const affected = rows.filter(r => (r.theme || '').trim() === from).length;
        sql.push(`UPDATE readings SET secondary_theme = '${quote(to)}' WHERE secondary_theme = '${quote(from)}'; -- ${affected} reflection${affected === 1 ? '' : 's'}`);
      }
      writeFileSync(join(root, 'scripts/out/november-themes.sql'), sql.join('\n') + '\n');
      console.log(`  scripts/out/november-themes.sql — ${Object.keys(NOVEMBER_PROPOSALS).length + Object.keys(MERGES).length} statements to review, then run in Supabase`);
    }

    // The table the build reads, and the seed for the Reading Room's own table.
    // It has to be complete: the loader treats a present table as authoritative,
    // so a partial file would strip every theme missing from it.
    if (process.argv.includes('--seed')) {
      const destinations = {};
      for (const theme of list) {
        const to = APPROVED_DESTINATIONS[theme.name] || theme.today;
        if (to) destinations[theme.name] = to;
      }
      for (const [from, to] of Object.entries(MERGES)) {
        if (destinations[to] && !destinations[from]) destinations[from] = destinations[to];
      }
      const sorted = Object.fromEntries(Object.keys(destinations).sort().map(k => [k, destinations[k]]));
      writeFileSync(join(root, 'data/theme-destinations.json'),
        JSON.stringify({ v: 1, captured: new Date().toISOString().slice(0, 10), source: 'inherited theme groups, plus destinations settled by name', destinations: sorted }, null, 2) + '\n');
      console.log(`  data/theme-destinations.json — ${Object.keys(sorted).length} themes`);
    }

    console.log(`Read ${rows.length} reflections from ${source}`);
    console.log(`  ${list.length} themes — ${needed.length} still need a destination`);
    console.log('  editorial/theme-destinations.csv');
    console.log('  editorial/theme-destinations.md');
  });
}

main().catch(error => { console.error(error.message); process.exit(1); });
