const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Convert day_of_year (1-366) to a URL slug like "january-1" or "december-31"
 */
export function dayToSlug(dayOfYear) {
  let remaining = dayOfYear;
  for (let m = 0; m < 12; m++) {
    if (remaining <= DAYS_IN_MONTH[m]) {
      return `${MONTHS[m]}-${remaining}`;
    }
    remaining -= DAYS_IN_MONTH[m];
  }
  return 'december-31';
}

/**
 * Convert a theme name to a URL slug like "self-care" or "detachment"
 */
export function themeToSlug(theme) {
  return theme
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Get month index (0-11) from day_of_year
 */
export function dayToMonthIndex(dayOfYear) {
  let remaining = dayOfYear;
  for (let m = 0; m < 12; m++) {
    if (remaining <= DAYS_IN_MONTH[m]) {
      return m;
    }
    remaining -= DAYS_IN_MONTH[m];
  }
  return 11;
}

/**
 * Convert day_of_year (1-366) to an ISO date string like "2026-01-01".
 * Uses the current year so <time datetime> stays accurate per build.
 */
export function dayToIsoDate(dayOfYear) {
  const year = new Date().getFullYear();
  let remaining = dayOfYear;
  for (let m = 0; m < 12; m++) {
    if (remaining <= DAYS_IN_MONTH[m]) {
      const mm = String(m + 1).padStart(2, '0');
      const dd = String(remaining).padStart(2, '0');
      return `${year}-${mm}-${dd}`;
    }
    remaining -= DAYS_IN_MONTH[m];
  }
  return `${year}-12-31`;
}

/**
 * Frozen reflection addresses, set once per build.
 *
 * A reflection's slug used to follow its title, so editing a title in the
 * Reading Room moved the page and abandoned its old address. The build now
 * hands this map in, and every caller — pages, sitemap, internal links, the
 * email feed, redirects — resolves the same stored address rather than
 * recomputing one from the current title.
 */
let frozenReadingSlugs = null;

export function useFrozenReadingSlugs(slugs) {
  frozenReadingSlugs = slugs;
}

/**
 * Build a descriptive reading slug: "march-2-the-nature-of-willingness"
 *
 * Returns the frozen address when one is on file, so the title is free to change.
 */
export function readingSlug(dayOfYear, title) {
  const frozen = frozenReadingSlugs?.get(dayOfYear);
  if (frozen) return frozen;

  const dateSlug = dayToSlug(dayOfYear);
  const titleSlug = (title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return titleSlug ? `${dateSlug}-${titleSlug}` : dateSlug;
}

/**
 * Build a descriptive step slug: "al-anon-step-1-honesty"
 */
export function stepSlug(number, principle) {
  const prinSlug = (principle || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return prinSlug ? `al-anon-step-${number}-${prinSlug}` : `al-anon-step-${number}`;
}

/**
 * Return the stable URL slug for a Step record. A record may retain a legacy
 * path even when its display principle changes.
 */
export function stepRecordSlug(step) {
  return step?.pathSlug || stepSlug(step?.number, step?.principle);
}

export { MONTHS, DAYS_IN_MONTH };
