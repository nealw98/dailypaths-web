import { wrapInLayout } from './base.mjs';
import { terminalBand } from './ui.mjs';
import { bp } from '../helpers/config.mjs';
import { readingSlug } from '../helpers/slug-utils.mjs';
import { loadFavoriteReadings, readingTeaser } from '../helpers/favorite-readings.mjs';
import { groupingTheme } from '../helpers/theme-destinations.mjs';

/**
 * Render the ten chosen reflections.
 *
 * The list is fixed in data/favorite-readings.json rather than ranked live, so
 * this page can be changed as often as you like without moving the sibling cards
 * on 366 reflection pages. Falls back to the highest-rated days when no list has
 * been chosen, which keeps the page populated on a fresh checkout.
 */
export function renderFavoriteReadingsPage(readings, ratingsMap = new Map()) {
  const byDay = new Map(readings.map(reading => [reading.day_of_year, reading]));
  const chosen = loadFavoriteReadings();

  const favorites = chosen
    ? chosen.map(day => byDay.get(day)).filter(Boolean)
    : [...readings].sort((a, b) => {
      const score = reading => {
        const stats = ratingsMap.get(reading.day_of_year) || {};
        return (stats.positive || 0) + (stats.favorites || 0);
      };
      return score(b) - score(a) || a.day_of_year - b.day_of_year;
    }).slice(0, 10);

  // These ten come from anywhere in the year rather than one group, so the theme
  // does tell the reader something here and does not repeat by construction. It is
  // the grouping theme, the same word the reflection's own pill carries.
  const cards = favorites.map(reading => {
    const teaser = readingTeaser(reading);
    const theme = groupingTheme(reading) || (reading.secondary_theme || '').trim();
    return `
          <a href="${bp(`/${readingSlug(reading.day_of_year, reading.title)}/`)}" class="kr-card">
            ${theme ? `<span class="kr-card-context">${theme}</span>` : ''}
            <span class="kr-card-date">${reading.display_date}</span>
            <span class="kr-card-title">${reading.title || 'Daily Reading'}</span>
            ${teaser ? `<span class="kr-card-teaser">${teaser}</span>` : ''}
            <span class="kr-card-cta">Read</span>
          </a>`;
  }).join('');

  const bodyContent = `
    <div class="wrap section--md">
      <nav class="ma-back-nav">
        <a href="${bp('/reflections/')}" class="ma-back-link">&larr; All reflection collections</a>
      </nav>
      <header class="ma-header favorite-readings-header">
        <h1 class="ma-title">Favorite Readings</h1>
        <p class="ma-subtitle">The reflections readers return to most.</p>
      </header>
      <div class="kr-grid">${cards}
      </div>
    </div>
    ${terminalBand()}`;

  return wrapInLayout({
    title: 'Favorite Daily Reflections — Daily Paths',
    description: 'Ten favorite Daily Paths reflections selected from across the year.',
    canonicalPath: '/reflections/favorites/',
    bodyContent,
    bodyClass: 'page-month-archive page-favorite-readings',
    navSection: 'reflection',
    hasAppPanel: true,
  });
}
