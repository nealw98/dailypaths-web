/**
 * The Traditions and Concepts collections.
 *
 * 63 reflections carry a step_theme of "Tradition N" or "Concept N" rather than
 * "Step N" — 35 and 28 of them. Their category pill has rendered as dead text
 * because reading.mjs matches only /^Step (\d+)$/, and nothing else on the site
 * links to them by subject: they were reachable only through their month and the
 * previous/next chain. These two pages give them a home and the pills a
 * destination.
 *
 * Each entry is an anchor (#tradition-3), so a pill lands on the right section
 * without 24 thin pages — the smallest Concept carries a single reflection.
 *
 * The wording of the Traditions and Concepts themselves is not here. Supply it in
 * TRADITION_ENTRIES/CONCEPT_ENTRIES as `text` when it has been written and
 * checked, and each section will render it; until then the sections carry their
 * reflections alone rather than invented copy.
 */

import { wrapInLayout } from './base.mjs';
import { bp } from '../helpers/config.mjs';
import { readingSlug } from '../helpers/slug-utils.mjs';
import { COLLECTION_PAGES } from '../helpers/collection-pages.mjs';

const ORDINALS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];

/** Twelve entries each, awaiting their text. */
export const TRADITION_ENTRIES = ORDINALS.map((word, i) => ({ number: i + 1, word }));
export const CONCEPT_ENTRIES = ORDINALS.map((word, i) => ({ number: i + 1, word }));

const COLLECTIONS = {
  '/traditions/': {
    ...COLLECTION_PAGES.find(page => page.path === '/traditions/'),
    entries: TRADITION_ENTRIES,
    label: 'Tradition',
    slugPrefix: 'tradition',
    lede: 'The Traditions help Al-Anon groups stay united and focused on helping families and friends affected by alcoholism. They address how groups make decisions, welcome members, support themselves, and protect anonymity. Written for groups, they also offer principles we can apply in our own recovery: listening to others, keeping our focus, and placing principles above personalities.',
    metaSubject: 'the Twelve Traditions of Al-Anon',
  },
  '/concepts/': {
    ...COLLECTION_PAGES.find(page => page.path === '/concepts/'),
    entries: CONCEPT_ENTRIES,
    label: 'Concept',
    slugPrefix: 'concept',
    lede: 'The Concepts of Service describe how responsibility and authority are shared throughout Al-Anon’s service structure. They address participation, delegation, clear roles, and the importance of hearing minority voices. We can apply these principles in our own recovery by sharing responsibility without taking over, trusting others to do their part, and listening when someone sees things differently.',
    metaSubject: 'the Twelve Concepts of Service in Al-Anon',
  },
};

/** The step_theme values that belong to a collection, e.g. "Tradition 3". */
export function collectionReadings(readings, label) {
  const pattern = new RegExp(`^${label} (\\d+)$`);
  const byNumber = new Map();
  for (const reading of readings) {
    const match = pattern.exec((reading.step_theme || '').trim());
    if (!match) continue;
    const number = Number(match[1]);
    if (!byNumber.has(number)) byNumber.set(number, []);
    byNumber.get(number).push(reading);
  }
  for (const list of byNumber.values()) list.sort((a, b) => a.day_of_year - b.day_of_year);
  return byNumber;
}

/**
 * Render /traditions/ or /concepts/.
 *
 * @param {string} path - '/traditions/' or '/concepts/'
 * @param {Array} readings - all 366 readings
 */
export function renderCollectionPage(path, readings) {
  const collection = COLLECTIONS[path];
  if (!collection) throw new Error(`Unknown collection page: ${path}`);

  const byNumber = collectionReadings(readings, collection.label);
  const total = [...byNumber.values()].reduce((sum, list) => sum + list.length, 0);

  const sections = collection.entries.map(entry => {
    const entryReadings = byNumber.get(entry.number) || [];
    const anchor = `${collection.slugPrefix}-${entry.number}`;
    const items = entryReadings.map(reading => `
              <li class="ma-reading-item">
                <a href="${bp(`/${readingSlug(reading.day_of_year, reading.title)}/`)}" class="ma-reading-link">
                  <span class="ma-reading-day">${reading.display_date}</span>
                  <span class="ma-reading-title">${reading.title || 'Daily Reading'}</span>
                </a>
              </li>`).join('\n');

    const count = entryReadings.length === 1 ? '1 reflection' : `${entryReadings.length} reflections`;
    return `
          <section class="ma-week" id="${anchor}">
            <h2 class="ma-week-heading">${collection.label} ${entry.word} <span>${count}</span></h2>
            ${entry.text ? `<p class="ma-step-statement">${entry.text}</p>` : ''}
            ${items ? `<ul class="ma-week-list">\n${items}\n            </ul>` : ''}
          </section>`;
  }).join('\n');

  const bodyContent = `
    <div class="wrap section--md">
      <nav class="ma-back-nav">
        <a href="${bp('/reflections/')}" class="ma-back-link">&larr; All reflection collections</a>
      </nav>

      <header class="ma-header">
        <p class="eyebrow ma-collection-eyebrow">${total} reflections</p>
        <h1 class="ma-title">${collection.title}</h1>
        <div class="ma-introduction"><p>${collection.lede}</p></div>
      </header>

      <div class="ma-chapters">
${sections}
      </div>

      <nav class="ma-month-nav" aria-label="Other collections">
        <a href="${bp('/reflections/')}">All reflection collections</a>
      </nav>
    </div>`;

  return wrapInLayout({
    title: `${collection.title} — Daily Reflections | Daily Paths`,
    description: `${total} daily reflections written alongside ${collection.metaSubject}.`,
    canonicalPath: path,
    bodyContent,
    bodyClass: 'page-month-archive',
  });
}
