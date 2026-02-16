import { wrapInLayout } from './base.mjs';
import { homepageStructuredData } from '../helpers/seo.mjs';

/**
 * Generate the homepage HTML.
 */
export function renderHomepage() {
  const structuredData = homepageStructuredData();

  const bodyContent = `
    <section class="hero">
      <div class="hero-inner">
        <h1 class="hero-title">Daily Paths</h1>
        <p class="hero-subtitle">366 original daily reflections for the Al-Anon journey</p>
        <p class="hero-description">
          Written in the contemplative tradition of Al-Anon literature,
          each reflection offers a moment of clarity, comfort, and connection
          for those affected by someone else's drinking.
        </p>
        <a href="#" class="btn-primary" data-today-link>Read Today's Reflection</a>
      </div>
    </section>

    <section class="home-explore">
      <div class="home-container">
        <h2 class="section-title">Explore the Readings</h2>
        <div class="explore-cards">
          <a href="/browse/" class="explore-card">
            <h3>Browse by Date</h3>
            <p>366 daily reflections, one for every day of the year, organized by month.</p>
          </a>
          <a href="/themes/" class="explore-card">
            <h3>Browse by Theme</h3>
            <p>Find readings on the topics that matter to you &mdash; detachment, surrender, hope, and more.</p>
          </a>
        </div>
      </div>
    </section>

    <section class="home-about">
      <div class="home-container">
        <h2 class="section-title">What is Daily Paths?</h2>
        <p>
          Daily Paths offers 366 original daily reflections written for anyone
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
          The Daily Paths app brings the full reading experience to your phone,
          with features designed for your daily practice.
        </p>
        <ul class="app-features">
          <li>Bookmark readings that speak to you</li>
          <li>Gentle daily reminders at the time you choose</li>
          <li>Dark mode for evening reading</li>
          <li>Read offline, anytime</li>
        </ul>
        <a href="https://apps.apple.com/app/id6755981862" class="app-store-link" target="_blank" rel="noopener noreferrer">
          <img src="/assets/app-store-badge.svg" alt="Download on the App Store" class="app-store-badge">
        </a>
      </div>
    </section>`;

  return wrapInLayout({
    title: 'Daily Paths \u2014 Al-Anon Daily Reflections for Recovery',
    description: 'Free daily Al-Anon reflections for your recovery journey. 366 original readings grounded in the Twelve Steps, written in the contemplative tradition of Al-Anon literature.',
    canonicalPath: '/',
    bodyContent,
    structuredData,
    bodyClass: 'page-home',
  });
}
