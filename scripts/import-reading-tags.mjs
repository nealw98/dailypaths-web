#!/usr/bin/env node
/**
 * Topic tagging: compare two passes, then load the one you keep.
 *
 *   Compare the two tools, outside the database:
 *     node scripts/import-reading-tags.mjs --diff gemini.csv notebooklm.txt
 *
 *   Check one pass on its own (counts, orphans, conflicts, bad rows):
 *     node scripts/import-reading-tags.mjs --in gemini.csv
 *
 *   Generate the SQL to load it:
 *     node scripts/import-reading-tags.mjs --in final.csv --sql
 *
 * Input format is sniffed per file:
 *   CSV       — date,slug,primary_topic,topic_2,topic_3,keywords,notes
 *   NotebookLM— "# topic: <slug|title>" headings, then
 *               "central | 01-02 | Title | why" lines
 *
 * --sql writes UPDATE statements to scripts/out/. It never touches the database;
 * read the file, then run it in the Supabase SQL editor.
 */

import 'dotenv/config';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const TOPICS = new Map([
  ['letting-go', 'Letting Go'],
  ['living-with-active-drinking', 'Living With Active Drinking'],
  ['anger-and-resentment', 'Anger and Resentment'],
  ['fear-and-worry', 'Fear and Worry'],
  ['guilt-blame-shame', 'Guilt, Blame, and Shame'],
  ['detachment-with-love', 'Detachment with Love'],
  ['helping-or-enabling', 'Helping or Enabling?'],
  ['boundaries', 'Boundaries and Saying No'],
  ['getting-yourself-back', 'Getting Yourself Back'],
  ['one-day-at-a-time', 'One Day at a Time'],
  ['higher-power-and-trust', 'Higher Power and Trust'],
  ['gratitude', 'Gratitude'],
  ['alcoholism-as-a-disease', 'Alcoholism as a Disease'],
  ['youre-not-alone', "You're Not Alone"],
]);
const BACKGROUND = new Set(['alcoholism-as-a-disease', 'youre-not-alone']);
const MIN_PER_TOPIC = 12;
const MAX_PER_TOPIC = 45;
const DIM = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/* ─────────────────────────── args ─────────────────────────── */

const argv = process.argv.slice(2);
const flag = n => argv.includes(`--${n}`);
const val = n => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : undefined; };

const diffPair = (() => {
  const i = argv.indexOf('--diff');
  return i >= 0 ? [argv[i + 1], argv[i + 2]].filter(Boolean) : null;
})();
const single = val('in');

if (!diffPair && !single) {
  console.error('Need --in <file> or --diff <fileA> <fileB>. See the header of this file.');
  process.exit(1);
}
if (diffPair && diffPair.length !== 2) {
  console.error('--diff takes two files.');
  process.exit(1);
}

/* ─────────────────────────── helpers ─────────────────────────── */

const norm = s => String(s || '').toLowerCase()
  .replace(/[‘’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const sqlStr = s => `'${String(s).replace(/'/g, "''")}'`;

function monthDay(doy) {
  let d = doy;
  for (let m = 0; m < 12; m++) { if (d <= DIM[m]) return { m: m + 1, d }; d -= DIM[m]; }
  return { m: 12, d: 31 };
}

/** Minimal RFC4180 parser — keyword cells contain commas and quotes. */
function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r') cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows.filter(r => r.some(v => v.trim() !== ''));
}

/* ─────────────────────────── the real readings ─────────────────────────── */

const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_ANON_KEY;
if (!url || !key) { console.error('Missing SUPABASE_URL / SUPABASE_ANON_KEY in .env'); process.exit(1); }

const readings = await fetch(
  `${url}/rest/v1/readings?select=id,day_of_year,title&order=day_of_year&limit=400`,
  { headers: { apikey: key, Authorization: `Bearer ${key}` } }
).then(r => r.json());

const byDate = new Map();
for (const r of readings) {
  const { m, d } = monthDay(r.day_of_year);
  byDate.set(`${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`, r);
}

/* ─────────────────────────── load one pass ─────────────────────────── */

/**
 * Normalise either input shape to:
 *   { name, byDate: Map<date, {topics:[slug], keywords:[], strengths:Map}>,
 *     problems: [], conflicts: [], orphans: [] }
 */
function loadPass(path) {
  const text = readFileSync(path, 'utf-8');
  const name = basename(path);
  const problems = [];
  const claims = new Map();      // date -> [{topic, strength, note}]
  const keywords = new Map();    // date -> [kw]

  const addClaim = (date, topic, strength, note, where) => {
    if (!byDate.has(date)) { problems.push(`${where}: date "${date}" is not one of the 366 readings`); return; }
    if (!TOPICS.has(topic)) { problems.push(`${where}: "${topic}" is not a known topic slug`); return; }
    if (!claims.has(date)) claims.set(date, []);
    const list = claims.get(date);
    if (!list.some(c => c.topic === topic)) list.push({ topic, strength, note });
  };
  const checkTitle = (date, given, where) => {
    if (!given || !byDate.has(date)) return;
    const real = byDate.get(date);
    if (norm(real.title) !== norm(given)) {
      problems.push(`${where}: title mismatch for ${date} — file says "${given}", database says "${real.title}"`);
    }
  };

  const firstLine = text.split('\n').find(l => l.trim()) || '';
  const isCsv = /(^|,)\s*date\s*(,|$)/i.test(firstLine) && firstLine.includes(',');

  if (isCsv) {
    const rows = parseCsv(text);
    const header = rows[0].map(h => h.trim().toLowerCase());
    const col = n => header.indexOf(n);
    const iDate = col('date'), iPri = col('primary_topic');
    if (iDate < 0 || iPri < 0) throw new Error(`${name}: CSV needs "date" and "primary_topic" columns`);
    const iT2 = col('topic_2'), iT3 = col('topic_3');
    const iKw = col('keywords'), iNote = col('notes'), iSlug = col('slug');

    for (let n = 1; n < rows.length; n++) {
      const r = rows[n], where = `${name}:${n + 1}`;
      const date = (r[iDate] || '').trim();
      if (iSlug >= 0 && byDate.has(date)) {
        const slug = (r[iSlug] || '').trim();
        const real = byDate.get(date);
        if (slug && !norm(slug).includes(norm(real.title).slice(0, 18))) {
          problems.push(`${where}: slug "${slug}" doesn't look like ${date} "${real.title}"`);
        }
      }
      const note = iNote >= 0 ? (r[iNote] || '').trim() : '';
      const pri = (r[iPri] || '').trim();
      if (pri && pri.toUpperCase() === 'NEEDS-REVIEW') {
        problems.push(`${where}: ${date} marked NEEDS-REVIEW — ${note || 'no reason given'}`);
      } else if (pri) addClaim(date, pri, 'central', note, where);
      for (const i of [iT2, iT3]) {
        if (i < 0) continue;
        const t = (r[i] || '').trim();
        if (t) addClaim(date, t, 'partial', '', where);
      }
      if (iKw >= 0) {
        const kws = [...new Set((r[iKw] || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean))];
        if (kws.length) keywords.set(date, kws);
      }
    }
  } else {
    const titleToSlug = new Map([...TOPICS].map(([s, t]) => [norm(t), s]));
    let topic = null;
    text.split('\n').forEach((raw, n) => {
      const line = raw.trim();
      if (!line) return;
      const where = `${name}:${n + 1}`;
      const head = line.match(/^#{0,3}\s*topic\s*:\s*(.+)$/i);
      if (head) {
        const v = head[1].trim();
        topic = TOPICS.has(v) ? v : titleToSlug.get(norm(v)) || null;
        if (!topic) problems.push(`${where}: unrecognised topic heading "${v}"`);
        return;
      }
      const parts = line.replace(/^[-*]\s*/, '').split('|').map(s => s.trim());
      if (parts.length < 3) return;
      const strength = parts[0].toLowerCase();
      if (strength !== 'central' && strength !== 'partial') return;
      if (!topic) { problems.push(`${where}: match line before any "# topic:" heading`); return; }
      checkTitle(parts[1], parts[2], where);
      addClaim(parts[1], topic, strength, parts[3] || '', where);
    });
  }

  // Reconcile each reading's claims into an ordered topics array
  const out = new Map();
  const conflicts = [], orphans = [];
  for (const [date, reading] of byDate) {
    const list = claims.get(date) || [];
    if (!list.length) { orphans.push({ date, title: reading.title }); continue; }
    const centrals = list.filter(c => c.strength === 'central');
    const partials = list.filter(c => c.strength === 'partial');

    let primary = null;
    if (centrals.length === 1) primary = centrals[0];
    else if (!centrals.length && partials.length === 1) primary = partials[0];
    else {
      conflicts.push({
        date, title: reading.title,
        reason: centrals.length > 1 ? 'central in several topics' : 'no central match, several partials',
        topics: (centrals.length > 1 ? centrals : partials).map(c => c.topic),
      });
      continue;
    }
    const rest = list.filter(c => c !== primary)
      .sort((a, b) => (a.strength === 'central' ? 0 : 1) - (b.strength === 'central' ? 0 : 1))
      .slice(0, 2);
    out.set(date, {
      reading,
      topics: [primary.topic, ...rest.map(c => c.topic)],
      keywords: keywords.get(date) || [],
    });
  }
  return { name, byDate: out, problems, conflicts, orphans };
}

/* ─────────────────────────── reporting ─────────────────────────── */

function bandReport(pass) {
  const pri = new Map([...TOPICS.keys()].map(s => [s, 0]));
  const any = new Map([...TOPICS.keys()].map(s => [s, 0]));
  for (const v of pass.byDate.values()) {
    v.topics.forEach((t, i) => {
      any.set(t, any.get(t) + 1);
      if (i === 0) pri.set(t, pri.get(t) + 1);
    });
  }
  return { pri, any };
}

function printPass(pass) {
  const { pri, any } = bandReport(pass);
  console.log(`\n── ${pass.name} ──`);
  console.log(`tagged: ${pass.byDate.size} / 366   orphans: ${pass.orphans.length}   conflicts: ${pass.conflicts.length}`);
  console.log(`\n${'topic'.padEnd(30)} ${'primary'.padStart(8)} ${'any'.padStart(5)}   band`);
  for (const slug of TOPICS.keys()) {
    const p = pri.get(slug), a = any.get(slug);
    let band;
    if (BACKGROUND.has(slug)) {
      band = a === 0 ? 'background — empty, as intended'
        : `background — collecting ${a}; consider making it a collection`;
    } else if (p === 0) band = 'NOT STARTED';
    else if (p < MIN_PER_TOPIC) band = `under ${MIN_PER_TOPIC} — too thin`;
    else if (p > MAX_PER_TOPIC) band = `over ${MAX_PER_TOPIC} — split or sub-group`;
    else band = 'ok';
    console.log(`${slug.padEnd(30)} ${String(p).padStart(8)} ${String(a).padStart(5)}   ${band}`);
  }
  if (pass.conflicts.length) {
    console.log(`\nconflicts needing a tie-break:`);
    for (const c of pass.conflicts.slice(0, 12)) {
      console.log(`  ${c.date} ${c.title} — ${c.reason}: ${c.topics.join(', ')}`);
    }
    if (pass.conflicts.length > 12) console.log(`  … and ${pass.conflicts.length - 12} more`);
  }
  if (pass.problems.length) {
    console.log(`\nproblems (${pass.problems.length}):`);
    for (const p of pass.problems.slice(0, 20)) console.log(`  ${p}`);
    if (pass.problems.length > 20) console.log(`  … and ${pass.problems.length - 20} more`);
  }
}

/* ─────────────────────────── diff mode ─────────────────────────── */

if (diffPair) {
  const [a, b] = diffPair.map(loadPass);
  printPass(a);
  printPass(b);

  const agree = [], disagree = [], onlyA = [], onlyB = [], neither = [];
  for (const [date, reading] of byDate) {
    const ta = a.byDate.get(date), tb = b.byDate.get(date);
    if (ta && tb) {
      (ta.topics[0] === tb.topics[0] ? agree : disagree)
        .push({ date, title: reading.title, a: ta.topics[0], b: tb.topics[0] });
    } else if (ta) onlyA.push({ date, title: reading.title, a: ta.topics[0] });
    else if (tb) onlyB.push({ date, title: reading.title, b: tb.topics[0] });
    else neither.push({ date, title: reading.title });
  }

  const both = agree.length + disagree.length;
  console.log(`\n══ comparison ══`);
  console.log(`both assigned a primary:   ${both}`);
  console.log(`  agreed:                  ${agree.length}${both ? `  (${(agree.length / both * 100).toFixed(1)}%)` : ''}`);
  console.log(`  disagreed:               ${disagree.length}`);
  console.log(`only ${a.name}:${' '.repeat(Math.max(1, 18 - a.name.length))}${onlyA.length}`);
  console.log(`only ${b.name}:${' '.repeat(Math.max(1, 18 - b.name.length))}${onlyB.length}`);
  console.log(`neither:                   ${neither.length}`);

  // Which pairs of topics get confused for each other
  const pairs = new Map();
  for (const d of disagree) {
    const k = [d.a, d.b].sort().join('  vs  ');
    pairs.set(k, (pairs.get(k) || 0) + 1);
  }
  if (pairs.size) {
    console.log(`\nmost common disagreements:`);
    for (const [k, n] of [...pairs.entries()].sort((x, y) => y[1] - x[1]).slice(0, 12)) {
      console.log(`  ${String(n).padStart(3)}  ${k}`);
    }
  }

  const outDir = join(ROOT, 'scripts', 'out');
  mkdirSync(outDir, { recursive: true });
  const rows = ['date,title,' + `${a.name}_primary,${b.name}_primary,status`];
  const esc = s => /[",]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  for (const d of disagree) rows.push([d.date, esc(d.title), d.a, d.b, 'disagree'].join(','));
  for (const d of onlyA) rows.push([d.date, esc(d.title), d.a, '', `only ${a.name}`].join(','));
  for (const d of onlyB) rows.push([d.date, esc(d.title), '', d.b, `only ${b.name}`].join(','));
  for (const d of neither) rows.push([d.date, esc(d.title), '', '', 'neither'].join(','));
  const diffPath = join(outDir, 'tag-diff.csv');
  writeFileSync(diffPath, rows.join('\n') + '\n', 'utf-8');
  console.log(`\nEverything needing a decision → ${diffPath} (${rows.length - 1} rows)`);
  console.log('Resolve it into one CSV, then: --in final.csv --sql');
  process.exit(0);
}

/* ─────────────────────────── single pass ─────────────────────────── */

const pass = loadPass(single);
printPass(pass);

if (pass.orphans.length) {
  const outDir = join(ROOT, 'scripts', 'out');
  mkdirSync(outDir, { recursive: true });
  const p = join(outDir, 'orphans.txt');
  writeFileSync(p, pass.orphans.map(o => `${o.date} | ${o.title}`).join('\n') + '\n', 'utf-8');
  console.log(`\nOrphan list → ${p}  (paste into Prompt C)`);
}

if (flag('sql')) {
  const outDir = join(ROOT, 'scripts', 'out');
  mkdirSync(outDir, { recursive: true });
  const sql = [
    `-- Topic tags and keywords from ${pass.name}`,
    `-- Generated by scripts/import-reading-tags.mjs — review before running.`,
    `-- ${pass.byDate.size} readings tagged. ${pass.orphans.length} untagged, ${pass.conflicts.length} unresolved.`,
    '',
    'begin;',
    '',
  ];
  let kwCount = 0;
  for (const { reading, topics, keywords } of pass.byDate.values()) {
    const sets = [`topics = array[${topics.map(sqlStr).join(', ')}]::text[]`];
    if (keywords.length) { sets.push(`keywords = array[${keywords.map(sqlStr).join(', ')}]::text[]`); kwCount++; }
    sql.push(`update public.readings set ${sets.join(', ')} where id = ${sqlStr(reading.id)};`);
  }
  sql.push('', 'commit;', '');
  const p = join(outDir, 'reading-tags.sql');
  writeFileSync(p, sql.join('\n'), 'utf-8');
  console.log(`\nSQL → ${p}  (${pass.byDate.size} readings, ${kwCount} with keywords)`);
  console.log('Review it, then run it in the Supabase SQL editor.');
} else {
  console.log('\n(add --sql to generate the UPDATE statements)');
}
