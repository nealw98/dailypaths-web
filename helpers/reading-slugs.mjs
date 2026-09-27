import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { readingSlug } from './slug-utils.mjs';

/**
 * A reflection's URL, frozen so that editing its title does not move it.
 *
 * Addresses used to be derived from the title, so retitling a reflection in the
 * Reading Room published it at a new URL and left the old one dead — fifteen of
 * them, recovered from the deployed sitemap's git history. The Steps already
 * solved this: stepRecordSlug() prefers a stored pathSlug over the derived one,
 * which is why Step One lives at /al-anon-step-1-honesty/ while its principle
 * reads "Acceptance". This does the same for reflections.
 *
 * Titles can now be edited freely. The address only ever changes if someone
 * edits this file on purpose.
 */

const VERSION = 1;

export function loadReadingSlugs(path) {
  if (!existsSync(path)) return null;

  const parsed = JSON.parse(readFileSync(path, 'utf-8'));
  if (parsed?.v !== VERSION || !parsed.slugs) {
    throw new Error(`Unrecognized reading slug map at ${path}; refusing to build with it.`);
  }

  const slugs = new Map();
  for (const [day, slug] of Object.entries(parsed.slugs)) slugs.set(Number(day), slug);

  const past = new Map();
  for (const [day, list] of Object.entries(parsed.past || {})) past.set(Number(day), list);

  return { frozenAt: parsed.frozenAt, slugs, past, path };
}

/**
 * Returns { slugFor, retiredSlugs, save }.
 *
 * slugFor falls back to deriving from the title only for a reflection the map
 * has never seen, and records it so the address is frozen from then on.
 */
export function createSlugResolver(map, readings) {
  const slugs = map ? new Map(map.slugs) : new Map();
  const past = map ? new Map(map.past) : new Map();
  const added = [];

  for (const reading of readings) {
    if (slugs.has(reading.day_of_year)) continue;
    const derived = readingSlug(reading.day_of_year, reading.title);
    slugs.set(reading.day_of_year, derived);
    added.push({ day: reading.day_of_year, slug: derived });
  }

  const live = new Set(slugs.values());

  /** Every address that should forward to a current one, as [from, to]. */
  const retiredSlugs = [];
  for (const [day, list] of past) {
    const target = slugs.get(day);
    if (!target) continue;
    for (const old of list) {
      // Never forward an address that is currently some reflection's own.
      if (live.has(old)) continue;
      retiredSlugs.push([old, target]);
    }
  }

  return {
    slugs,
    retiredSlugs,
    added,
    save(path = map?.path) {
      if (!path || added.length === 0) return 0;
      const out = {};
      for (const day of [...slugs.keys()].sort((a, b) => a - b)) out[day] = slugs.get(day);
      const pastOut = {};
      for (const day of [...past.keys()].sort((a, b) => a - b)) pastOut[day] = past.get(day);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(
        path,
        JSON.stringify({ v: VERSION, frozenAt: map?.frozenAt, slugs: out, past: pastOut }, null, 2) + '\n',
        'utf-8'
      );
      return added.length;
    },
  };
}
