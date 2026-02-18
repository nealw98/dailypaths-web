import { wrapInLayout } from './base.mjs';
import { homepageStructuredData } from '../helpers/seo.mjs';
import { textToHtmlParagraphs, renderQuote } from '../helpers/markdown.mjs';
import { dayToSlug } from '../helpers/slug-utils.mjs';
import { bp } from '../helpers/config.mjs';

/**
 * Generate the homepage HTML with today's reading.
 *
 * @param {Object} todayReading - Today's reading object
 * @param {Object} prevReading - Previous day's reading (for nav)
 * @param {Object} nextReading - Next day's reading (for nav)
 */
export function renderHomepage(todayReading, prevReading, nextReading) {
  const structuredData = homepageStructuredData();

  const slug = dayToSlug(todayReading.day_of_year);
  const prevSlug = dayToSlug(prevReading.day_of_year);
  const nextSlug = dayToSlug(nextReading.day_of_year);

  const quoteHtml = renderQuote(todayReading.quote);
  const openingHtml = textToHtmlParagraphs(todayReading.opening);
  const bodyHtml = textToHtmlParagraphs(todayReading.body);
  const applicationHtml = todayReading.application ? textToHtmlParagraphs(todayReading.application) : '';
  const thoughtHtml = todayReading.thought_for_day
    ? todayReading.thought_for_day.replace(/\\n/g, '\n').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')
    : '';

  const bodyContent = `
    <article class="reading-page">
      <div class="reading-container">
        <header class="reading-header">
          <p class="reading-date">${todayReading.display_date} &mdash; Today's Reading</p>
          <h1 class="reading-title">${todayReading.title}</h1>
        </header>

        <section class="reading-quote">
          ${quoteHtml}
        </section>

        <section class="reading-body">
          ${openingHtml}
          ${bodyHtml}
        </section>

        ${applicationHtml ? `
        <div class="reading-divider"></div>
        <section class="reading-application">
          ${applicationHtml}
        </section>
        ` : ''}

        ${thoughtHtml ? `
        <aside class="reading-thought">
          <p class="thought-label">Thought for the Day</p>
          <p class="thought-text">${thoughtHtml}</p>
        </aside>
        ` : ''}

        <nav class="reading-date-nav">
          ${todayReading.day_of_year > 1 ? `<a href="${bp(`/${prevSlug}/`)}" class="date-nav-prev">&larr; ${prevReading.display_date}</a>` : '<span></span>'}
          <span></span>
          ${todayReading.day_of_year < 366 ? `<a href="${bp(`/${nextSlug}/`)}" class="date-nav-next">${nextReading.display_date} &rarr;</a>` : '<span></span>'}
        </nav>

      </div>
    </article>


    <section class="home-about">
      <div class="home-container">
        <h2 class="section-title">About Al-Anon Daily Paths</h2>
        <p>
          Al-Anon Daily Paths offers 366 original daily reflections written for anyone
          whose life has been affected by someone else's drinking. Grounded in
          the principles of the Al-Anon program, each reading draws on the
          Twelve Steps, Traditions, and Concepts of Service to offer practical
          wisdom and quiet encouragement.
        </p>
        <p>
          These reflections are not official Al-Anon literature. They are
          original writings inspired by the spirit of recovery found in
          Al-Anon's program of hope.
        </p>
      </div>
    </section>

    <section class="home-app">
      <div class="home-container">
        <h2 class="section-title">Take your reflections anywhere</h2>
        <p>
          The Al-Anon Daily Paths app brings the full reading experience to your phone,
          with features designed for your daily practice.
        </p>
        <ul class="app-features">
          <li>Bookmark readings that speak to you</li>
          <li>Gentle daily reminders at the time you choose</li>
          <li>Dark mode for evening reading</li>
          <li>Read offline, anytime</li>
        </ul>
        <a href="https://apps.apple.com/app/id6755981862" class="app-store-link" target="_blank" rel="noopener noreferrer">
          <img src="${bp('/assets/app-store-badge.svg')}" alt="Download on the App Store" class="app-store-badge">
        </a>
      </div>
    </section>`;

  return wrapInLayout({
    title: 'Al-Anon Daily Paths \u2014 Daily Reflections for Recovery',
    description: 'Free daily Al-Anon reflections for your recovery journey. 366 original readings grounded in the Twelve Steps, written in the contemplative tradition of Al-Anon literature.',
    canonicalPath: '/',
    bodyContent,
    structuredData,
    bodyClass: 'page-home',
  });
}
