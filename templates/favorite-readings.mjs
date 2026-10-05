import { wrapInLayout } from './base.mjs';
import { terminalBand } from './ui.mjs';
import { bp } from '../helpers/config.mjs';
import { readingSlug } from '../helpers/slug-utils.mjs';
import { loadFavoriteReadings, readingTeaser } from '../helpers/favorite-readings.mjs';

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

  const excerptFor = reading => {
    const text = String(reading.opening || reading.body || '')
      .replace(/\\n/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/<[^>]*>/g, '')
      .replace(/\*\*?|__?/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (text.length <= 175) return text;
    const sentenceEnds = [...text.slice(0, 175).matchAll(/[.!?](?=\s|$)/g)];
    const end = sentenceEnds.find(match => match.index >= 80)?.index;
    return end !== undefined ? text.slice(0, end + 1) : text.slice(0, 150).replace(/\s+\S*$/, '') + '…';
  };

  const cards = favorites.map((reading, index) => {
    const thought = readingTeaser(reading, Infinity);
    const excerpt = excerptFor(reading);
    const href = bp(`/${readingSlug(reading.day_of_year, reading.title)}/`);
    return `
          <li class="favorite-reading">
            <article class="favorite-reading-card">
              <span class="favorite-reading-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
              <div class="favorite-reading-content">
                <span class="favorite-reading-date">${escapeHtml(reading.display_date)}</span>
                <h2 class="favorite-reading-title">${escapeHtml(reading.title || 'Daily Reading')}</h2>
                ${thought ? `<p class="favorite-reading-thought">${escapeHtml(thought)}</p>` : ''}
                ${excerpt ? `<p class="favorite-reading-excerpt">${escapeHtml(excerpt)}</p>` : ''}
                <a class="favorite-reading-cta" href="${href}">Read the reflection <span aria-hidden="true">&rarr;</span></a>
              </div>
            </article>
          </li>`;
  }).join('');

  function escapeHtml(value) {
    return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  const bodyContent = `
    <div class="wrap section--md">
      <nav class="ma-back-nav">
        <a href="${bp('/reflections/')}" class="ma-back-link">&larr; All reflection collections</a>
      </nav>
      <header class="ma-header favorite-readings-header">
        <h1 class="ma-title">Favorite Readings</h1>
        <p class="ma-subtitle">The reflections readers return to most.</p>
      </header>
      <ol class="favorite-reading-list">${cards}
      </ol>
    </div>
    ${terminalBand()}`;

  return wrapInLayout({
    title: 'Favorite Daily Reflections — Daily Paths',
    description: 'Ten reader favorite daily reflections, each with its Thought for the Day and an excerpt from the reading.',
    canonicalPath: '/reflections/favorites/',
    bodyContent,
    bodyClass: 'page-month-archive page-favorite-readings',
    navSection: 'reflection',
    hasAppPanel: true,
  });
}
