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

export { MONTHS, DAYS_IN_MONTH };
