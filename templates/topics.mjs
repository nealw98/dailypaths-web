import { wrapInLayout } from './base.mjs';
import { dayToSlug } from '../helpers/slug-utils.mjs';
import { bp } from '../helpers/config.mjs';
import {
  TOPICS, TOPIC_THEME_TAGS, TOPIC_PULL_QUOTES, TOPIC_TOOLS,
  TOPIC_INSIGHT_PROMPTS, TOPIC_FORM_QUESTIONS,
} from '../helpers/theme-data.mjs';

// Re-export TOPICS so build.mjs can continue importing from this file
export { TOPICS };

/**
 * Render the Topics index page — Premium Magazine Gallery.
 */
export function renderTopicsIndexPage() {
  const galleryCards = TOPICS.map(topic => `
          <a href="${bp(`/themes/${topic.slug}/`)}" class="ti-gallery-card">
            <h3 class="ti-gallery-card-title">${topic.name}</h3>
            <p class="ti-gallery-card-hook">${topic.shortDescription}</p>
            <span class="ti-gallery-card-cta">Explore &rarr;</span>
          </a>`).join('\n');

  const bodyContent = `
      <!-- Page Hero -->
      <header class="ti-hero">
        <div class="ti-hero-image">
          <img src="${bp('/assets/themes/themes-hero.jpg')}" alt="Forest path through morning light \u2014 Al-Anon recovery themes" />
          <div class="ti-hero-overlay"></div>
        </div>
        <div class="ti-hero-content">
          <h1 class="ti-hero-title">Al-Anon Themes</h1>
          <p class="ti-hero-desc">A curated exploration of the ideas that shape recovery &mdash; the threads that run through every stage of the Al-Anon journey.</p>
        </div>
      </header>

      <!-- Editorial Intro -->
      <div class="ti-editorial-intro">
        <p>Universal ideas that weave through the journey of recovery.</p>
      </div>

      <!-- Theme Gallery -->
      <div class="ti-gallery-wrap">
        <div class="ti-gallery-grid">
${galleryCards}
        </div>
      </div>

      <!-- Engine CTA -->
      <section class="ti-engine-cta bg-navy">
        <div class="ti-engine-cta-inner">
          <h2 class="ti-engine-cta-heading">Take your study of these principles further.</h2>
          <p class="ti-engine-cta-text">The Al-Anon Daily Paths app isn&rsquo;t just for reading&mdash;it&rsquo;s for growing. Use our private journaling tools to record your reflections on these themes and track your growth.</p>
          <div class="ti-engine-cta-badges">
            <a href="https://apps.apple.com/app/id6755981862" target="_blank" rel="noopener noreferrer" class="ti-engine-cta-badge-link">
              <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="Download on the App Store" class="ti-engine-cta-badge">
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.nealw98.dailypaths" target="_blank" rel="noopener noreferrer" class="ti-engine-cta-badge-link">
              <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" class="ti-engine-cta-badge ti-engine-cta-badge-play">
            </a>
          </div>
        </div>
      </section>

      `;

  return wrapInLayout({
    title: 'Al-Anon Themes &mdash; Ideas That Shape the Recovery Journey | Al-Anon Daily Paths',
    description: 'Explore 12 Al-Anon themes including detachment, powerlessness, boundaries, honesty, and more. Each theme includes reflections and curated daily readings for recovery.',
    canonicalPath: '/themes/',
    bodyContent,
    bodyClass: 'page-topics-index',
  });
}

/**
 * Render an individual topic page — premium editorial experience.
 *
 * Sections: Nav → Hero → Pull Quote → Editorial Intro (drop cap) →
 * Member Insight → Al-Anon Toolbox → App CTA → Featured Reflections → Daily Reflections
 *
 * @param {Object} topic - Topic object from TOPICS array
 * @param {Array} featuredReadings - Reading objects matching featuredDays
 * @param {Array} [allReadings] - All 366 readings (for theme-tag matching)
 */
export function renderTopicPage(topic, featuredReadings, allReadings = [], topicShares = []) {
  const idx = TOPICS.indexOf(topic);
  const prevTopic = TOPICS[(idx - 1 + TOPICS.length) % TOPICS.length];
  const nextTopic = TOPICS[(idx + 1) % TOPICS.length];

  const tools = TOPIC_TOOLS[topic.slug] || [];
  const pullQuote = TOPIC_PULL_QUOTES[topic.slug] || '';
  const themeTags = TOPIC_THEME_TAGS[topic.slug] || [];
  const insightPrompt = TOPIC_INSIGHT_PROMPTS[topic.slug] || `What is your experience with ${topic.name}?`;

  // Build theme-matched readings (excluding featured days)
  const featuredDaySet = new Set(topic.featuredDays || []);
  let themeReadings = [];
  if (allReadings.length > 0 && themeTags.length > 0) {
    themeReadings = allReadings.filter(
      r => r.secondary_theme && themeTags.includes(r.secondary_theme) && !featuredDaySet.has(r.day_of_year)
    );
  }

  // Dedupe additional readings against featured
  const seenDays = new Set(featuredReadings.map(r => r.day_of_year));
  const additionalReadings = themeReadings.filter(r => {
    if (seenDays.has(r.day_of_year)) return false;
    seenDays.add(r.day_of_year);
    return true;
  });

  const totalAdditionalCount = additionalReadings.length;

  // Group additional readings by secondary_theme
  const groupedReadings = new Map();
  for (const r of additionalReadings) {
    const theme = r.secondary_theme || 'Other';
    if (!groupedReadings.has(theme)) groupedReadings.set(theme, []);
    groupedReadings.get(theme).push(r);
  }

  const readingGroups = [...groupedReadings.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([theme, readings]) => {
      const cards = readings.map(r => {
        const slug = dayToSlug(r.day_of_year);
        return `
                  <a href="${bp(`/${slug}/`)}" class="topic-reading-card">
                    <span class="topic-reading-card-date">${r.display_date}</span>
                    <span class="topic-reading-card-title">${r.title}</span>
                  </a>`;
      }).join('\n');

      return `
              <div class="topic-reading-group">
                <h3 class="topic-reading-group-label">${theme}</h3>
                <div class="topic-readings-grid">
${cards}
                </div>
              </div>`;
    }).join('\n');

  // Build insight cards from approved shares — schema.org/Comment for EEAT
  const formQuestion = TOPIC_FORM_QUESTIONS[topic.slug] || `How has ${topic.name.toLowerCase()} shaped your recovery?`;

  function buildInsightCard(share, extraClass = '') {
    const name = (share.guest_author === true || !share.display_name)
      ? 'Anonymous'
      : share.display_name;
    const words = share.content.split(/\s+/);
    const needsTruncation = words.length > 45;
    return `
            <div class="insight-card${extraClass}" itemscope itemtype="https://schema.org/Comment">
              <div class="insight-card-text" data-insight-card-text itemprop="text">
                <p>${share.content.split('\n\n').map(p => p.trim()).join('</p><p>')}</p>
              </div>
              ${needsTruncation ? '<button class="insight-card-read-more" data-insight-read-more aria-expanded="false">Read the full reflection</button>' : ''}
              <p class="insight-card-attribution" itemprop="author">&mdash; ${name}</p>
            </div>`;
  }

  const firstThreeCards = topicShares.slice(0, 3).map(s => buildInsightCard(s)).join('\n');
  const extraCards = topicShares.slice(3).map(s => buildInsightCard(s, ' insight-card--hidden')).join('\n');
  const hasMore = topicShares.length > 3;

  // Toolbox items with compass SVG icon
  const compassSvg = '<svg class="topic-toolbox-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88"/></svg>';
  const toolboxItems = tools.map(t => `              <li>${compassSvg}<span>${t}</span></li>`).join('\n');

  // Featured reflection cards
  const featuredCards = featuredReadings.map(r => {
    const slug = dayToSlug(r.day_of_year);
    return `
          <a href="${bp(`/${slug}/`)}" class="topic-featured-card">
            <span class="topic-featured-badge">Top Rated</span>
            <span class="topic-featured-card-date">${r.display_date}</span>
            <span class="topic-featured-card-title">${r.title}</span>
          </a>`;
  }).join('\n');

  const bodyContent = `
    <article class="topic-editorial" itemscope itemtype="https://schema.org/Article">
      <!-- Theme Navigation -->
      <nav class="topic-nav-header">
        <a href="${bp(`/themes/${prevTopic.slug}/`)}" class="nav-prev">
          <span class="nav-arrow">&larr;</span>
          <span class="nav-label">${prevTopic.name}</span>
        </a>
        <a href="${bp('/themes/')}" class="nav-browse">All Themes</a>
        <a href="${bp(`/themes/${nextTopic.slug}/`)}" class="nav-next">
          <span class="nav-label">${nextTopic.name}</span>
          <span class="nav-arrow">&rarr;</span>
        </a>
      </nav>

      <!-- Hero Section -->
      <header class="topic-hero">
        <div class="topic-hero-image">
          <img src="${bp('/assets/themes/themes-hero.jpg')}" alt="Forest path \u2014 ${topic.name} in Al-Anon recovery" />
          <div class="topic-hero-overlay"></div>
        </div>
        <div class="topic-hero-content">
          <span class="topic-hero-label">Al-Anon Theme</span>
          <h1 class="topic-hero-title" itemprop="headline">${topic.name}</h1>
          <p class="topic-hero-desc" itemprop="description">${topic.shortDescription}</p>
        </div>
      </header>

      <!-- Pull Quote Bridge -->
      ${pullQuote ? `
      <div class="topic-pull-quote">
        <blockquote class="topic-pull-quote-text">
          &ldquo;${pullQuote}&rdquo;
        </blockquote>
      </div>` : ''}

      <!-- Editorial Intro with Drop Cap -->
      <section class="topic-editorial-intro">
        <div class="topic-editorial-intro-inner">
          ${topic.body}
        </div>
      </section>

      <!-- Theme Logic — contextual bridge above member insights -->
      ${topic.logic ? `
      <section class="topic-logic">
        <div class="topic-logic-inner">
          ${topic.logic}
        </div>
      </section>` : ''}

      <!-- Voices of the Fellowship — Member Insight Cards -->
      ${topicShares.length > 0 ? `
      <section class="topic-insight-cards" aria-label="Member insights on ${topic.name}">
        <div class="topic-insight-cards-inner">
          <span class="topic-insight-cards-label">Voices of the Fellowship</span>
          <h2 class="topic-insight-cards-heading">${insightPrompt}</h2>
          <div class="topic-insight-cards-grid" data-insight-grid>
${firstThreeCards}
${extraCards}
          </div>
          ${hasMore ? '<button class="topic-insight-show-more" data-insight-show-more>Show more community insights</button>' : ''}
        </div>
      </section>` : ''}

      <!-- Share Your Experience — Terracotta Block -->
      <div class="bg-terracotta">
        <div class="topic-insight-form-wrap">
          <h2 class="topic-insight-form-heading">Share Your Experience</h2>
          <p class="topic-insight-form-subhead">${formQuestion}</p>
          <form id="share-form-${topic.slug}" class="topic-share-form topic-insight-form" data-share-form data-topic-slug="${topic.slug}" data-supabase-url="${process.env.SUPABASE_URL}" data-supabase-key="${process.env.SUPABASE_ANON_KEY}">
            <label class="topic-share-label" for="share-name-${topic.slug}">Name</label>
            <input type="text" id="share-name-${topic.slug}" name="display_name" class="topic-share-input" placeholder="e.g., Sara M. (or anonymous)" required>
            <label class="topic-share-label" for="share-content-${topic.slug}">Your Insight</label>
            <textarea id="share-content-${topic.slug}" name="content" class="topic-share-textarea" rows="5" maxlength="3000" required></textarea>
            <p class="topic-share-counter"><span data-char-count>0</span>/3000 characters</p>
            <p class="topic-share-disclaimer"><em>By submitting, you consent to sharing your experience with the Daily Paths community.</em></p>
            <button type="submit" class="topic-insight-submit">Post Insight</button>
            <p class="topic-share-status" data-share-status></p>
          </form>
        </div>
      </div>

      <!-- App CTA — full-bleed navy transition -->
      <section class="topic-cta bg-navy">
        <div class="topic-cta-inner">
          <h2 class="topic-cta-heading">Apply ${topic.name} to your life, daily.</h2>
          <p class="topic-cta-text">Our journaling tools are designed to help you process ${topic.name} in real-time. Use the Al-Anon Daily Paths app to track your insights and receive daily reminders for your recovery journey.</p>
          <div class="topic-cta-badges">
            <a href="https://apps.apple.com/app/id6755981862" target="_blank" rel="noopener noreferrer" class="topic-cta-badge-link">
              <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="Download on the App Store" class="topic-cta-badge">
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.nealw98.dailypaths" target="_blank" rel="noopener noreferrer" class="topic-cta-badge-link">
              <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" class="topic-cta-badge topic-cta-badge-play">
            </a>
          </div>
        </div>
      </section>

      <!-- Featured Reflections -->
      ${featuredReadings.length > 0 ? `
      <section class="topic-featured-section">
        <h2 class="topic-featured-heading">Featured Reflections</h2>
        <p class="topic-featured-intro">${featuredReadings.length} hand-picked readings on ${topic.name.toLowerCase()}.</p>
        <div class="topic-featured-grid">
${featuredCards}
        </div>
      </section>` : ''}

      <!-- Daily Reflections on [Name] -->
      ${totalAdditionalCount > 0 ? `
      <section class="topic-readings-section">
        <h2 class="topic-readings-heading">Daily Reflections on ${topic.name}</h2>
        <p class="topic-readings-intro">
          ${totalAdditionalCount} additional reading${totalAdditionalCount === 1 ? '' : 's'} explore this theme.
        </p>
${readingGroups}
      </section>` : ''}

    </article>`;

  return wrapInLayout({
    title: `${topic.name} &mdash; Al-Anon Recovery Theme | Daily Paths`,
    description: (topic.metaDescription || topic.shortDescription) + ' Reflections and curated daily readings from Al-Anon Daily Paths.',
    canonicalPath: `/themes/${topic.slug}/`,
    bodyContent,
    bodyClass: 'page-topic-detail',
  });
}
