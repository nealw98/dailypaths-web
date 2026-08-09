import { wrapInLayout } from './base.mjs';
import { readingSlug } from '../helpers/slug-utils.mjs';
import { bp } from '../helpers/config.mjs';
import { markdownToHtml } from '../helpers/markdown.mjs';
import { topicStructuredData, topicBreadcrumbStructuredData } from '../helpers/seo.mjs';
import {
  TOPICS, TOPIC_THEME_TAGS, TOPIC_PULL_QUOTES,
  TOPIC_INSIGHT_PROMPTS, TOPIC_FORM_QUESTIONS,
} from '../helpers/theme-data.mjs';
import { photoHero, detailRail, appPanel, readingCard } from './ui.mjs';

// Re-export TOPICS so build.mjs can continue importing from this file
export { TOPICS };

/**
 * Render the Themes index page — all twelve themes as cards.
 */
export function renderTopicsIndexPage() {
  const cards = TOPICS.map(topic => `
          <a href="${bp(`/themes/${topic.slug}/`)}" class="card-elevated theme-index-card">
            <span class="theme-index-title">${topic.name}</span>
            <span class="theme-index-line">${topic.shortDescription}</span>
            <span class="theme-index-cta">Explore &rarr;</span>
          </a>`).join('');

  const bodyContent = `
${photoHero({
    image: bp('/assets/themes/themes-hero.jpg'),
    alt: 'Forest path through morning light — the themes of Al-Anon recovery',
    title: 'Al-Anon Themes',
    subtitle: 'Universal ideas that weave through the journey of recovery.',
    size: 'sm',
  })}

    <section class="wrap section--md">
      <p class="lede" style="max-width:64ch;margin:0 0 28px">A curated exploration of the ideas that shape recovery &mdash; the threads that run through every stage of the Al-Anon journey.</p>
      <div class="theme-index-grid">${cards}
      </div>
    </section>

    <div class="wrap section--md" id="get-the-app">
      ${appPanel({
        tone: 'seafoam',
        heading: 'Take your study of these principles further.',
        text: 'Use the app&rsquo;s private journaling tools to record your reflections on these themes and track your growth.',
        context: 'themes',
      })}
    </div>`;

  return wrapInLayout({
    title: 'Al-Anon Themes — Ideas That Shape the Recovery Journey | Al-Anon Daily Paths',
    description: 'Explore 12 Al-Anon themes including detachment, powerlessness, boundaries, honesty, and more. Each theme includes reflections and curated daily readings for recovery.',
    canonicalPath: '/themes/',
    bodyContent,
    bodyClass: 'page-topics-index',
    navSection: 'themes',
    hasAppPanel: true,
  });
}

/**
 * Inject a strategic link to the Essentials "Letting Go" entry.
 * Only links the term on pages other than the detachment page itself.
 */
function injectEssentialsLinks(body, currentSlug) {
  if (currentSlug === 'detachment') return body;
  return body.replace(/\bdetachment\b/i, `<a href="${bp('/essentials/#let-go')}">$&</a>`);
}

/**
 * Render an individual theme page.
 *
 * Theme rail → photo hero → centered pull-quote → the essay in Lora →
 * Share Your Experience → Featured Reflections → grouped daily reflections →
 * app panel.
 *
 * @param {Object} topic - Topic object from TOPICS
 * @param {Array} featuredReadings - Top-rated readings for this theme
 * @param {Array} [allReadings] - All 366 readings (for theme-tag matching)
 * @param {Array} [topicShares] - Approved member shares
 */
export function renderTopicPage(topic, featuredReadings, allReadings = [], topicShares = []) {
  const idx = TOPICS.indexOf(topic);
  const prevTopic = TOPICS[(idx - 1 + TOPICS.length) % TOPICS.length];
  const nextTopic = TOPICS[(idx + 1) % TOPICS.length];

  const pullQuote = TOPIC_PULL_QUOTES[topic.slug] || '';
  const themeTags = TOPIC_THEME_TAGS[topic.slug] || [];
  const insightPrompt = TOPIC_INSIGHT_PROMPTS[topic.slug] || `What is your experience with ${topic.name}?`;
  const formQuestion = TOPIC_FORM_QUESTIONS[topic.slug] || `How has ${topic.name.toLowerCase()} shaped your recovery?`;

  // Theme-matched readings, excluding anything already featured
  const featuredDaySet = new Set(topic.featuredDays || []);
  let themeReadings = [];
  if (allReadings.length > 0 && themeTags.length > 0) {
    themeReadings = allReadings.filter(
      r => r.secondary_theme && themeTags.includes(r.secondary_theme) && !featuredDaySet.has(r.day_of_year)
    );
  }

  const seenDays = new Set(featuredReadings.map(r => r.day_of_year));
  const additionalReadings = themeReadings.filter(r => {
    if (seenDays.has(r.day_of_year)) return false;
    seenDays.add(r.day_of_year);
    return true;
  });

  // Group the remainder by their secondary theme
  const groupedReadings = new Map();
  for (const r of additionalReadings) {
    const key = r.secondary_theme || 'Other';
    if (!groupedReadings.has(key)) groupedReadings.set(key, []);
    groupedReadings.get(key).push(r);
  }

  const readingGroups = [...groupedReadings.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([groupName, items]) => {
      const cards = items.map(r => readingCard({
        href: bp(`/${readingSlug(r.day_of_year, r.title)}/`),
        date: r.display_date,
        title: r.title,
        tone: 'tinted',
      })).join('\n');

      return `
        <div>
          <div class="group-head">
            <span class="group-head-label">${groupName}</span>
            <span class="group-head-rule"></span>
          </div>
          <div class="reading-grid--tight">
${cards}
          </div>
        </div>`;
    }).join('\n');

  function buildInsightCard(share, extraClass = '') {
    const name = (share.guest_author === true || !share.display_name) ? 'Anonymous' : share.display_name;
    const words = share.content.split(/\s+/);
    const needsTruncation = words.length > 45;
    const paragraphs = share.content
      .split('\n\n')
      .map(p => `<p>${markdownToHtml(p.trim())}</p>`)
      .join('');
    return `
            <div class="insight-card${extraClass}">
              <div class="insight-card-text" data-insight-card-text>${paragraphs}</div>
              ${needsTruncation ? '<button type="button" class="insight-card-read-more" data-insight-read-more aria-expanded="false">Read the full reflection</button>' : ''}
              <p class="insight-card-attribution">&mdash; ${name}</p>
            </div>`;
  }

  const firstThreeCards = topicShares.slice(0, 3).map(s => buildInsightCard(s)).join('\n');
  const extraCards = topicShares.slice(3).map(s => buildInsightCard(s, ' insight-card--hidden')).join('\n');
  const hasMore = topicShares.length > 3;

  const featuredCards = featuredReadings.map(r => `
          <a href="${bp(`/${readingSlug(r.day_of_year, r.title)}/`)}" class="reading-card reading-card--outlined">
            <span class="featured-card-meta">Top rated &middot; ${r.display_date}</span>
            <span class="featured-card-title">${r.title}</span>
          </a>`).join('');

  const bodyContent = `
${detailRail({
    prevHref: bp(`/themes/${prevTopic.slug}/`),
    prevLabel: prevTopic.name,
    allHref: bp('/themes/'),
    allLabel: 'All Themes',
    nextHref: bp(`/themes/${nextTopic.slug}/`),
    nextLabel: nextTopic.name,
  })}

${photoHero({
    image: bp('/assets/themes/themes-hero.jpg'),
    alt: `Forest path through morning light — ${topic.name} in Al-Anon recovery`,
    eyebrow: 'Al-Anon theme',
    title: topic.name,
    subtitle: topic.shortDescription,
    size: 'lg',
    titleClass: 'photo-hero-title--theme',
  })}

    <article class="rd-article">
      ${pullQuote ? `<p class="pull-quote">&ldquo;${pullQuote}&rdquo;</p>` : ''}

      <div class="prose-lora">
        ${injectEssentialsLinks(markdownToHtml(topic.body || ''), topic.slug)}
      </div>

      ${topic.logic ? `<div class="prose-lora">${markdownToHtml(topic.logic)}</div>` : ''}

      ${topicShares.length > 0 ? `<section class="section--md" aria-label="Member insights on ${topic.name}">
        <p class="eyebrow">Voices of the fellowship</p>
        <h2 class="share-heading">${insightPrompt}</h2>
        <div class="insight-grid" data-insight-grid>
${firstThreeCards}
${extraCards}
        </div>
        ${hasMore ? '<button type="button" class="insight-show-more" data-insight-show-more>Show more community insights</button>' : ''}
      </section>` : ''}

      <div class="panel-outlined share-card">
        <h2 class="share-heading">Share Your Experience</h2>
        <p class="share-prompt">${formQuestion}</p>
        <form id="share-form-${topic.slug}" class="share-form" data-share-form data-topic-slug="${topic.slug}" data-supabase-url="${process.env.SUPABASE_URL}" data-supabase-key="${process.env.SUPABASE_ANON_KEY}">
          <label class="field" for="share-name-${topic.slug}">
            <span class="visually-hidden">Name</span>
            <input type="text" id="share-name-${topic.slug}" name="display_name" placeholder="Name" required>
          </label>
          <label class="field field--area" for="share-content-${topic.slug}">
            <span class="visually-hidden">Your insight</span>
            <textarea id="share-content-${topic.slug}" name="content" rows="4" maxlength="3000" placeholder="Your insight&hellip;" required></textarea>
          </label>
          <div class="share-footer">
            <p class="share-counter"><span data-char-count>0</span> / 3000 characters</p>
            <button type="submit" class="btn">Post insight</button>
          </div>
          <p class="share-consent">By submitting, you consent to sharing your experience with the Daily Paths community. Insights are reviewed before they appear.</p>
          <p class="share-status" data-share-status></p>
        </form>
      </div>
    </article>

    ${featuredReadings.length > 0 ? `<section class="wrap section--lg">
      <h2 class="section-title">Featured Reflections</h2>
      <p class="section-desc" style="margin-bottom:22px">${featuredReadings.length} hand-picked reading${featuredReadings.length === 1 ? '' : 's'} on ${topic.name.toLowerCase()}.</p>
      <div class="featured-grid">${featuredCards}
      </div>
    </section>` : ''}

    ${additionalReadings.length > 0 ? `<section class="wrap section--lg">
      <h2 class="section-title">Daily Reflections on ${topic.name}</h2>
      <p class="section-desc" style="margin-bottom:20px">${additionalReadings.length} additional reading${additionalReadings.length === 1 ? '' : 's'} explore this theme.</p>
      <div class="theme-groups">
${readingGroups}
      </div>
    </section>` : ''}

    <div class="wrap section--md" id="get-the-app">
      ${appPanel({
        tone: 'seafoam',
        heading: 'Apply this theme to your life, daily.',
        text: `Use the app&rsquo;s journaling tools to process ${topic.name.toLowerCase()} in real time.`,
        context: 'theme',
      })}
    </div>`;

  const structuredData = [
    topicStructuredData(topic),
    topicBreadcrumbStructuredData(topic),
  ];

  return wrapInLayout({
    title: `${topic.name} — Al-Anon Recovery Theme | Daily Paths`,
    description: (topic.metaDescription || topic.shortDescription) + ' Reflections and curated daily readings from Al-Anon Daily Paths.',
    canonicalPath: `/themes/${topic.slug}/`,
    bodyContent,
    bodyClass: 'page-topic-detail',
    structuredData,
    ogType: 'article',
    navSection: 'themes',
    hasAppPanel: true,
  });
}
