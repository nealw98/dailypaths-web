import { wrapInLayout } from './base.mjs';
import { terminalBand } from './ui.mjs';
import { bp } from '../helpers/config.mjs';
import { readingSlug } from '../helpers/slug-utils.mjs';

function engagement(stats = {}) {
  return (stats.positive || 0) + (stats.favorites || 0);
}

/** Render the ten readings with the highest combined positive/favorite score. */
export function renderFavoriteReadingsPage(readings, ratingsMap = new Map()) {
  const favorites = [...readings]
    .sort((a, b) => {
      const aStats = ratingsMap.get(a.day_of_year) || {};
      const bStats = ratingsMap.get(b.day_of_year) || {};
      const scoreDifference = engagement(bStats) - engagement(aStats);
      if (scoreDifference !== 0) return scoreDifference;
      if ((bStats.favorites || 0) !== (aStats.favorites || 0)) return (bStats.favorites || 0) - (aStats.favorites || 0);
      if ((bStats.positive || 0) !== (aStats.positive || 0)) return (bStats.positive || 0) - (aStats.positive || 0);
      return a.day_of_year - b.day_of_year;
    })
    .slice(0, 10);

  const readingItems = favorites.map((reading, index) => `
          <li class="ma-reading-item favorite-reading-item">
            <a href="${bp(`/${readingSlug(reading.day_of_year, reading.title)}/`)}" class="ma-reading-link">
              <span class="favorite-reading-rank">${String(index + 1).padStart(2, '0')}</span>
              <span class="ma-reading-day">${reading.display_date}</span>
              <span class="ma-reading-title">${reading.title || 'Daily Reading'}</span>
            </a>
          </li>`).join('');

  const bodyContent = `
    <div class="wrap section--md">
      <nav class="ma-back-nav">
        <a href="${bp('/reflections/')}" class="ma-back-link">&larr; All reflection collections</a>
      </nav>
      <header class="ma-header favorite-readings-header">
        <p class="eyebrow ma-collection-eyebrow">Across the year &middot; Top 10</p>
        <h1 class="ma-title">Favorite Readings</h1>
        <p class="ma-subtitle">The reflections readers return to most.</p>
        <p class="favorite-readings-method">Ranked by the combined total of positive responses and app favorites.</p>
      </header>
      <ol class="ma-week-list favorite-reading-list">
${readingItems}
      </ol>
    </div>
    ${terminalBand()}`;

  return wrapInLayout({
    title: 'Favorite Daily Reflections — Daily Paths',
    description: 'The ten Daily Paths reflections with the highest combined positive responses and app favorites across the year.',
    canonicalPath: '/reflections/favorites/',
    bodyContent,
    bodyClass: 'page-month-archive page-favorite-readings',
    navSection: 'reflection',
    hasAppPanel: true,
  });
}
