import { wrapInLayout } from './base.mjs';
import { dayToSlug } from '../helpers/slug-utils.mjs';
import { bp } from '../helpers/config.mjs';
import {
  TOPICS, TOPIC_THEME_TAGS, TOPIC_PULL_QUOTES, TOPIC_TOOLS,
  DEFAULT_MEMBER_SHARE, MEMBER_SHARES,
} from '../helpers/theme-data.mjs';

// Re-export TOPICS so build.mjs can continue importing from this file
export { TOPICS };

/**
 * Render the Topics index page.
 */
export function renderTopicsIndexPage() {
  // 1-2-3 Hierarchy: Primary (hero), Secondary (duo), Tertiary (bento)
  const hero = TOPICS[0];
  const heroQuote = TOPIC_PULL_QUOTES[hero.slug] || '';
  const duo = [TOPICS[1], TOPICS[2]];
  const bento = TOPICS.slice(3);

  // Bento layout classes: asymmetric sizes (same approach that worked before)
  // Row 1: wide, narrow-tall, narrow-tall
  // Row 2: narrow, narrow, wide
  // Row 3: narrow-tall, wide, narrow
  const bentoClasses = [
    'ti-bento--wide',  'ti-bento--tall',  'ti-bento--tall',
    '',                 '',                 'ti-bento--wide',
    'ti-bento--tall',  'ti-bento--wide',  '',
  ];

  const bentoCards = bento.map((topic, i) => {
    const cls = bentoClasses[i] || '';
    return `
          <a href="${bp(`/principles/${topic.slug}/`)}" class="ti-bento-card${cls ? ' ' + cls : ''}">
            <div class="ti-bento-card-img">
              <img src="${bp(`/assets/themes/${topic.image}`)}" alt="${topic.imageAlt || topic.name}" />
            </div>
            <div class="ti-bento-card-gradient"></div>
            <div class="ti-bento-card-text">
              <h3 class="ti-bento-card-title">${topic.name}</h3>
              <p class="ti-bento-card-desc">${topic.shortDescription}</p>
            </div>
          </a>`;
  });

  // Duo cards
  const duoCards = duo.map(topic => {
    return `
          <a href="${bp(`/principles/${topic.slug}/`)}" class="ti-duo-card">
            <div class="ti-duo-card-img">
              <img src="${bp(`/assets/themes/${topic.image}`)}" alt="${topic.imageAlt || topic.name}" />
            </div>
            <div class="ti-duo-card-gradient"></div>
            <div class="ti-duo-card-text">
              <h3 class="ti-duo-card-title">${topic.name}</h3>
              <p class="ti-duo-card-desc">${topic.shortDescription}</p>
            </div>
          </a>`;
  }).join('\n');

  const bodyContent = `
      <!-- Page Hero -->
      <header class="ti-hero">
        <div class="ti-hero-image">
          <img src="${bp('/assets/themes/themes.jpg')}" alt="Al-Anon Themes" />
          <div class="ti-hero-overlay"></div>
        </div>
        <div class="ti-hero-content">
          <span class="ti-hero-label">Al-Anon Themes</span>
          <h1 class="ti-hero-title">Al-Anon Themes</h1>
          <p class="ti-hero-desc">A curated exploration of the ideas that shape recovery &mdash; the threads that run through every stage of the Al-Anon journey.</p>
        </div>
      </header>

      <!-- Editorial Intro -->
      <div class="ti-editorial-intro">
        <p>
          Recovery doesn&rsquo;t follow a straight line. Some days we need to practice letting go;
          other days we need to hold a boundary. These twelve themes are an invitation to explore
          the ideas that shape the Al-Anon journey &mdash; and the quiet, daily work of
          finding our way back to ourselves.
        </p>
      </div>

      <!-- Primary: Hero Feature (70/30) -->
      <div class="ti-hero-feature-wrap">
        <a href="${bp(`/principles/${hero.slug}/`)}" class="ti-hero-feature">
          <div class="ti-hero-feature-img">
            <img src="${bp(`/assets/themes/${hero.image}`)}" alt="${hero.imageAlt || hero.name}" />
            <span class="ti-hero-feature-overlap">&ldquo;${heroQuote}&rdquo;</span>
          </div>
          <div class="ti-hero-feature-body">
            <span class="ti-hero-feature-label">Featured Theme</span>
            <h2 class="ti-hero-feature-title">${hero.name}</h2>
            <p class="ti-hero-feature-desc">${hero.shortDescription}</p>
            <p class="ti-hero-feature-quote">&ldquo;${heroQuote}&rdquo;</p>
            <span class="ti-hero-feature-cta">Read &amp; Reflect &rarr;</span>
          </div>
        </a>
      </div>

      <!-- Quick Path -->
      <div class="ti-quickpath-wrap">
        <h2 class="ti-quickpath-heading">Where are you today?</h2>
        <div class="ti-quickpath-grid">
          <a href="${bp('/principles/powerlessness/')}" class="ti-quickpath-btn">Feeling Overwhelmed</a>
          <a href="${bp('/principles/boundaries/')}" class="ti-quickpath-btn">Setting Boundaries</a>
          <a href="${bp('/principles/gratitude-and-hope/')}" class="ti-quickpath-btn">Seeking Hope</a>
          <a href="${bp('/principles/fellowship/')}" class="ti-quickpath-btn">New to Al-Anon</a>
        </div>
      </div>

      <!-- Secondary: Featured Duo (50/50) -->
      <div class="ti-duo-wrap">
        <div class="ti-duo-grid">
${duoCards}
        </div>
      </div>

      <!-- Tertiary: Asymmetric Bento Grid -->
      <div class="ti-bento-wrap">
        <h2 class="ti-bento-heading">Explore All Themes</h2>
        <div class="ti-bento-grid">
${bentoCards.slice(0, 5).join('\n')}

          <!-- 12 Steps Internal Link Card — fills the empty tall slot -->
          <a href="${bp('/steps/')}" class="ti-steps-card">
            <span class="ti-steps-icon">&#x1F9ED;</span>
            <h3 class="ti-steps-title">The 12 Steps</h3>
            <p class="ti-steps-desc">
              Looking for the roadmap to recovery? Explore the foundational
              themes of Al-Anon, month by month.
            </p>
            <span class="ti-steps-link">Explore the Path &rarr;</span>
          </a>

${bentoCards.slice(5, 6).join('\n')}
        </div>
      </div>

      <!-- Mid-Grid Slim CTA Strip -->
      <div class="ti-slim-cta-wrap">
        <div class="ti-slim-cta">
          <p class="ti-slim-cta-text">Carry these themes in your pocket.</p>
          <div class="ti-slim-cta-actions">
            <a href="https://apps.apple.com/app/id6755981862" target="_blank" rel="noopener noreferrer" class="ti-slim-cta-btn">
              <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="Download on the App Store" class="ti-slim-cta-badge">
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.dailypaths" target="_blank" rel="noopener noreferrer" class="ti-slim-cta-btn">
              <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" class="ti-slim-cta-badge ti-slim-cta-badge-play">
            </a>
          </div>
        </div>
      </div>

      <!-- Remaining Bento Cards -->
      <div class="ti-bento-wrap ti-bento-wrap--continued">
        <div class="ti-bento-grid">
${bentoCards.slice(6).join('\n')}
        </div>
      </div>

      <!-- Community & Support — Resource Spotlight -->
      <div class="ti-community-wrap">
        <h3 class="ti-community-heading">You Don&rsquo;t Have to Do This Alone.</h3>
        <p class="ti-community-intro">
          Recovery is a shared journey. We encourage you to find a local or electronic
          meeting to connect with others who truly understand.
        </p>
        <div class="ti-community-card">
          <span class="ti-community-badge">Official Resource</span>
          <p class="ti-community-card-text">
            Al-Anon Family Groups maintains a worldwide directory of in-person and
            electronic meetings &mdash; free, confidential, and open to anyone affected
            by someone else&rsquo;s drinking.
          </p>
          <a href="https://al-anon.org/al-anon-meetings/find-an-al-anon-meeting/"
             target="_blank"
             rel="noopener noreferrer"
             title="Search for Al-Anon meetings on the official Al-Anon Family Groups website"
             class="ti-community-btn">
            Search the Official Meeting Directory&nbsp;&#8599;
          </a>
        </div>
      </div>`;

  return wrapInLayout({
    title: 'Al-Anon Themes &mdash; Ideas That Shape the Recovery Journey | Al-Anon Daily Paths',
    description: 'Explore 12 Al-Anon themes including detachment, powerlessness, boundaries, honesty, and more. Each theme includes reflections and curated daily readings for recovery.',
    canonicalPath: '/principles/',
    bodyContent,
    bodyClass: 'page-topics-index',
  });
}

/**
 * Render an individual topic page — editorial layout.
 *
 * @param {Object} topic - Topic object from TOPICS array
 * @param {Array} featuredReadings - Reading objects matching featuredDays
 * @param {Array} [allReadings] - All 366 readings (for theme-tag matching)
 */
export function renderTopicPage(topic, featuredReadings, allReadings = []) {
  const idx = TOPICS.indexOf(topic);
  const prevTopic = TOPICS[(idx - 1 + TOPICS.length) % TOPICS.length];
  const nextTopic = TOPICS[(idx + 1) % TOPICS.length];

  const tools = TOPIC_TOOLS[topic.slug] || [];
  const themeTags = TOPIC_THEME_TAGS[topic.slug] || [];

  // Build theme-matched readings from secondary_theme
  const featuredDaySet = new Set(topic.featuredDays || []);
  let themeReadings = [];
  if (allReadings.length > 0 && themeTags.length > 0) {
    themeReadings = allReadings.filter(
      r => r.secondary_theme && themeTags.includes(r.secondary_theme) && !featuredDaySet.has(r.day_of_year)
    );
  }

  // Combine: featured first, then theme-matched (deduped)
  const seenDays = new Set(featuredReadings.map(r => r.day_of_year));
  const additionalReadings = themeReadings.filter(r => {
    if (seenDays.has(r.day_of_year)) return false;
    seenDays.add(r.day_of_year);
    return true;
  });

  const allTopicReadings = [...featuredReadings, ...additionalReadings];
  const totalCount = allTopicReadings.length;

  // Group readings by secondary_theme
  const groupedReadings = new Map();
  for (const r of allTopicReadings) {
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

  // Member share — use specific share or default
  const memberShare = MEMBER_SHARES[topic.slug] || DEFAULT_MEMBER_SHARE;
  const shareParagraphs = memberShare.split('\n\n').map(p => `              <p>${p.trim()}</p>`).join('\n');

  // Core truths bullets
  const coreTruthItems = tools.map(t => `              <li>${t}</li>`).join('\n');

  const bodyContent = `
    <article class="topic-editorial" itemscope itemtype="https://schema.org/Article">
      <!-- Theme Navigation -->
      <nav class="topic-nav-header">
        <a href="${bp(`/principles/${prevTopic.slug}/`)}" class="nav-prev">
          <span class="nav-arrow">&larr;</span>
          <span class="nav-label">${prevTopic.name}</span>
        </a>
        <a href="${bp('/principles/')}" class="nav-browse">All Themes</a>
        <a href="${bp(`/principles/${nextTopic.slug}/`)}" class="nav-next">
          <span class="nav-label">${nextTopic.name}</span>
          <span class="nav-arrow">&rarr;</span>
        </a>
      </nav>

      <!-- Hero Section -->
      <header class="topic-hero">
        ${topic.image ? `
        <div class="topic-hero-image">
          <img src="${bp(`/assets/themes/${topic.image}`)}" alt="${topic.imageAlt || topic.name}" />
          <div class="topic-hero-overlay"></div>
        </div>` : ''}
        <div class="topic-hero-content">
          <span class="topic-hero-label">Al-Anon Theme</span>
          <h1 class="topic-hero-title" itemprop="headline">${topic.name}</h1>
          <p class="topic-hero-desc" itemprop="description">${topic.shortDescription}</p>
        </div>
      </header>

      <!-- The Definition -->
      <section class="topic-definition">
        <div class="topic-definition-inner">
          ${topic.body}
        </div>
      </section>

      <!-- Voice from the Path -->
      <section class="topic-share" aria-label="A member&rsquo;s experience with ${topic.name}">
        <div class="topic-share-inner">
          <h2 class="topic-share-heading">Voice from the Path</h2>
          <blockquote class="topic-share-body" itemprop="articleBody">
${shareParagraphs}
          </blockquote>
          <p class="topic-share-attribution">&mdash; An Al-Anon member</p>
        </div>
      </section>

      <!-- Core Truths -->
      ${tools.length > 0 ? `
      <section class="topic-truths">
        <div class="topic-truths-inner">
          <h2 class="topic-truths-heading">Understanding ${topic.name}</h2>
          <ul class="topic-truths-list">
${coreTruthItems}
          </ul>
        </div>
      </section>` : ''}

      <!-- CTA -->
      <section class="topic-cta">
        <div class="topic-cta-inner">
          <p class="topic-cta-text">Explore ${topic.name.toLowerCase()} and other themes of recovery with 366 original daily reflections from Al-Anon Daily Paths.</p>
          <div class="topic-cta-badges">
            <a href="https://apps.apple.com/app/id6755981862" target="_blank" rel="noopener noreferrer" class="topic-cta-badge-link">
              <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="Download on the App Store" class="topic-cta-badge">
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.dailypaths" target="_blank" rel="noopener noreferrer" class="topic-cta-badge-link">
              <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" class="topic-cta-badge topic-cta-badge-play">
            </a>
          </div>
        </div>
      </section>

      <!-- Daily Reflections on [Name] -->
      ${totalCount > 0 ? `
      <section class="topic-readings-section">
        <h2 class="topic-readings-heading">Daily Reflections on ${topic.name}</h2>
        <p class="topic-readings-intro">
          ${totalCount} reading${totalCount === 1 ? '' : 's'} explore this theme.
        </p>
${readingGroups}
      </section>` : ''}

    </article>`;

  return wrapInLayout({
    title: `${topic.name} &mdash; Al-Anon Recovery Theme | Daily Paths`,
    description: (topic.metaDescription || topic.shortDescription) + ' Reflections and curated daily readings from Al-Anon Daily Paths.',
    canonicalPath: `/principles/${topic.slug}/`,
    bodyContent,
    bodyClass: 'page-topic-detail',
  });
}
