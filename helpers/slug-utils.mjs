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

export { MONTHS, DAYS_IN_MONTH };
