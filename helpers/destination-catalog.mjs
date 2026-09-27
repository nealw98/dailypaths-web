/**
 * What sits at each address a theme can point to.
 *
 * The Go deeper card needs a kind, a title, a line of description and a call to
 * action for whatever the theme's destination turns out to be. Destinations are
 * wider than the articles and guides: sixteen reflections carry principle
 * vocabulary — Proportionality, Democracy, Unity, Charity — with no plausible
 * article home, so the Steps and the two collection pages are destinations too.
 *
 * Kept separate from theme-destinations.mjs, which stays free of templates so the
 * resolution logic can be imported anywhere without dragging the page catalog in.
 */

import { GUIDES, ARTICLES } from './content-catalog.mjs';
import { TOPICS } from './theme-data.mjs';
import { COLLECTION_PAGES } from './collection-pages.mjs';
import { destinationPage } from './theme-destinations.mjs';
import { STEPS, STEP_HOOKS } from '../templates/steps.mjs';

export { COLLECTION_PAGES };

const KIND_LABELS = { guide: 'Guide', article: 'Article', collection: 'Reflections', topic: 'Topic' };
const KIND_CTA = {
  guide: 'Read the guide',
  article: 'Read the article',
  collection: 'Explore the collection',
  topic: 'Read more',
};

let catalog;

/** path → { kind, label, title, description, cta } for every possible destination. */
export function destinationCatalog() {
  if (catalog) return catalog;
  catalog = new Map();

  const add = (path, kind, title, description) => {
    if (!path || catalog.has(path)) return;
    catalog.set(path, { path, kind, label: KIND_LABELS[kind], title, description, cta: KIND_CTA[kind] });
  };

  for (const guide of GUIDES) add(guide.path, 'guide', guide.title, guide.description);
  for (const article of ARTICLES) add(article.path, 'article', article.title, article.description);
  for (const step of STEPS) {
    add(`/steps/${step.pathSlug}/`, 'collection', `Step ${step.number} — ${step.principle}`,
      `${STEP_HOOKS[step.number]} Read every ${step.month} reflection on this Step.`);
  }
  for (const page of COLLECTION_PAGES) add(page.path, 'collection', page.title, page.description);
  // The theme pages still awaiting reclassification. Their addresses move with
  // their titles, so they are added last and only if nothing above claimed them.
  for (const topic of TOPICS) add(`/topics/${topic.slug}/`, 'topic', topic.name, topic.shortDescription);

  return catalog;
}

/**
 * What to show for a destination, or null for an address nothing is known about.
 * An anchor is stripped first: /guides/surrender/#three-cs is still the Surrender
 * guide, and the card describes the guide while the link keeps the section.
 */
export function destinationMeta(path) {
  if (!path) return null;
  return destinationCatalog().get(destinationPage(path)) || null;
}

/** Only for tests: forget the memoized catalog. */
export function resetDestinationCatalog() { catalog = undefined; }
