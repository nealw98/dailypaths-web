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

  const lettingGo = TOPICS.find(topic => topic.slug === 'letting-go-of-control');
  const bodyContent = `
${photoHero({
    image: bp('/assets/themes/themes-hero.jpg'),
    alt: 'Forest path through morning light — the themes of Al-Anon recovery',
    title: 'Recovery Themes',
    subtitle: 'Original essays and daily reflections for the questions that follow us into recovery.',
    size: 'sm',
  })}

    <section class="wrap section--md">
      <p class="eyebrow">Theme guides</p>
      <h2 class="section-title">A place to follow an idea further</h2>
      <p class="lede theme-index-intro">The daily readings meet us in a moment. These guides gather related readings into a fuller exploration of the patterns, choices, and spiritual principles that shape recovery.</p>

      <a href="${bp(`/themes/${lettingGo.slug}/`)}" class="theme-feature">
        <div class="theme-feature-copy">
          <span class="eyebrow">Featured guide</span>
          <span class="theme-feature-title">${lettingGo.name}</span>
          <span class="theme-feature-line">${lettingGo.shortDescription}</span>
          <span class="theme-index-cta">Read the guide &rarr;</span>
        </div>
        <img src="${bp(`/assets/themes/${lettingGo.image}`)}" alt="${lettingGo.imageAlt}" loading="lazy">
      </a>

      <h2 class="section-title theme-index-all-title">Explore all themes</h2>
      <div class="theme-index-grid">${cards}
      </div>
    </section>

    <div class="wrap section--md" id="get-the-app">
      ${appPanel({
        tone: 'seafoam',
        heading: 'Carry these themes into your daily practice.',
        text: 'Use the app&rsquo;s private journaling tools to reflect on what you read and notice how your understanding changes over time.',
        context: 'themes',
      })}
    </div>`;

  return wrapInLayout({
    title: 'Recovery Themes — Essays & Daily Reflections | Daily Paths',
    description: 'Explore original recovery essays and connected daily reflections on letting go, detachment, boundaries, powerlessness, honesty, fellowship, and more.',
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

function renderLettingGoGuide(topic, allReadings, prevTopic, nextTopic) {
  const readingDays = [7, 18, 71, 247];
  const guideReadings = readingDays
    .map(day => allReadings.find(reading => reading.day_of_year === day))
    .filter(Boolean);

  const readingLink = (day, label) => {
    const reading = guideReadings.find(item => item.day_of_year === day);
    if (!reading) return label;
    return `<a href="${bp(`/${readingSlug(reading.day_of_year, reading.title)}/`)}">${label}</a>`;
  };

  const guideCards = guideReadings.map(reading => readingCard({
    href: bp(`/${readingSlug(reading.day_of_year, reading.title)}/`),
    date: reading.display_date,
    title: reading.title,
    tone: 'tinted',
  })).join('\n');

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
    image: bp(`/assets/themes/${topic.image}`),
    alt: topic.imageAlt,
    eyebrow: 'Recovery theme guide',
    title: topic.name,
    subtitle: topic.shortDescription,
    size: 'lg',
    titleClass: 'photo-hero-title--theme',
  })}

    <article class="rd-article theme-guide">
      <div class="prose-lora theme-guide-opening">
        <p>I&rsquo;ve spent so long trying to prevent disaster that it&rsquo;s second nature.</p>
        <p>When someone I love is struggling, letting go can feel like betrayal. I want the best for them. I can see the danger, the consequences, and all the things that might go wrong. If I can help, why shouldn&rsquo;t I?</p>
        <p>That question can keep me awake at night. It can also keep me managing another person&rsquo;s life while mine grows smaller around the effort.</p>
      </div>

      <p class="pull-quote">&ldquo;Letting go respects another person&rsquo;s dignity: their right to make their own decisions and live through their own journey.&rdquo;</p>

      <section class="theme-guide-section">
        <p class="eyebrow">What it means</p>
        <h2>Love without taking over</h2>
        <div class="prose-lora">
          <p>Letting go means returning another person&rsquo;s choices and consequences to them. It means keeping the focus on my side of the street: my choices, my boundaries, my conduct, and my care for myself.</p>
          <p>It asks me to stop playing Higher Power in someone else&rsquo;s life. They have a Higher Power, and I am not it. I cannot understand the totality of their journey or know which experience may finally reach them. If the idea of a Higher Power is difficult, I can begin with the simpler truth that life is bigger than either of us.</p>
          <p>${readingLink(7, 'Impossible Responsibilities')} describes the relief of putting down responsibilities that were never ours to carry. That is not abandonment. It is an honest return to the limits of our role.</p>
        </div>
      </section>

      <aside class="truth-callout">
        <span class="eyebrow">A return to the facts</span>
        <p>It is not my job to break through their denial. It is my job to confront my own.</p>
      </aside>

      <section class="theme-guide-section">
        <p class="eyebrow">What it does not mean</p>
        <h2>Letting go is not shutting down</h2>
        <div class="prose-lora">
          <p>It does not mean slamming the door, punishing someone with silence, or pretending their pain does not matter. I can listen with love without picking up the baton. I can acknowledge real difficulty without feeding self-pity, assigning blame, or taking responsibility for solving it.</p>
          <p>It also does not require me to accept manipulation. I can decline guilt, pressure, threats, and manufactured emergencies. At the same time, I have to look honestly at the ways I may manipulate too&mdash;through rescuing, pleading, monitoring, bargaining, or arranging consequences to force the outcome I want.</p>
        </div>
      </section>

      <aside class="manipulation-inventory">
        <div class="manipulation-inventory-heading">
          <span class="eyebrow">The manipulation mirror</span>
          <h2>Can I recognize in myself what I resist in someone else?</h2>
          <p>Seeing my own behavior clearly does not excuse theirs. It simply returns my attention to the part I can change.</p>
        </div>
        <div class="manipulation-inventory-grid">
          <div>
            <h3>What I recognize coming toward me</h3>
            <ul>
              <li>Guilt</li>
              <li>Threats</li>
              <li>Blame</li>
              <li>Urgent demands</li>
            </ul>
          </div>
          <div>
            <h3>What I may not recognize in myself</h3>
            <ul>
              <li>Rescuing</li>
              <li>Bargaining</li>
              <li>Monitoring</li>
              <li>Rehearsing</li>
            </ul>
          </div>
        </div>
        <p class="manipulation-inventory-close">I do not have to accept manipulation, and I do not have to use it.</p>
      </aside>

      <section class="theme-guide-section">
        <p class="eyebrow">A useful distinction</p>
        <h2>What is mine&mdash;and what isn&rsquo;t?</h2>
        <div class="mine-not-mine">
          <div>
            <h3>Mine</h3>
            <ul>
              <li>My choices and behavior</li>
              <li>What I will and will not do</li>
              <li>My boundaries and safety</li>
              <li>Getting support and caring for myself</li>
              <li>Facing the truth of the situation</li>
            </ul>
          </div>
          <div>
            <h3>Not mine</h3>
            <ul>
              <li>Their choices and recovery</li>
              <li>Their crisis and consequences</li>
              <li>Whether they accept help</li>
              <li>What other people think of my boundary</li>
              <li>Forcing them to see what I see</li>
            </ul>
          </div>
        </div>
      </section>

      <p class="pull-quote">&ldquo;Caring and carrying are not the same thing.&rdquo;</p>

      <section class="theme-guide-section">
        <p class="eyebrow">Everyday practice</p>
        <h2>Where letting go becomes concrete</h2>
        <div class="letting-go-scenarios">
          <div><h3>Monitoring</h3><p>Checking a phone, email, location, or story to manage my fear. I can step back and practice <a href="${bp('/themes/detachment/')}">detachment with love</a>.</p></div>
          <div><h3>Rescuing</h3><p>Paying, explaining, covering, or speaking on someone&rsquo;s behalf. I can let their choices meet their consequences and keep my <a href="${bp('/themes/boundaries/')}">boundaries</a>.</p></div>
          <div><h3>Rehearsing</h3><p>Planning the perfect words that will finally make them change. I can tell the truth once, then return the focus to <a href="${bp('/themes/focus-on-yourself/')}">my own life</a>.</p></div>
        </div>
        <div class="prose-lora">
          <p>${readingLink(71, 'Taking Responsibility Off My Shoulders')} asks a practical question: is this mine to carry, or is it something I need to release? The answer may not remove the pain, but it can show me my next honest action.</p>
        </div>
      </section>

      <section class="theme-guide-section letting-go-practice">
        <p class="eyebrow">A letting-go practice</p>
        <h2>Pause before picking it up</h2>
        <ol>
          <li><strong>Name it.</strong> What person, result, or crisis am I trying to control?</li>
          <li><strong>Check the facts.</strong> What do I actually know, apart from fear and prediction?</li>
          <li><strong>Separate the responsibilities.</strong> What belongs to me, and what belongs to them?</li>
          <li><strong>Ask for support.</strong> A meeting, sponsor, or trusted program friend can help me hear the truth.</li>
          <li><strong>Choose one action.</strong> Do what is mine, release the rest, and allow the discomfort to pass without using control for relief.</li>
        </ol>
      </section>

      <details class="reflection-questions">
        <summary>Questions for reflection</summary>
        <ul>
          <li>What is the fear beneath my urge to act?</li>
          <li>Am I afraid that setting a boundary makes me a bad person?</li>
          <li>What facts am I avoiding because control feels more hopeful?</li>
          <li>What would caring look like if I did not carry this?</li>
          <li>Can I trust their journey to a Higher Power and take care of the life in front of me?</li>
        </ul>
      </details>
    </article>

    ${guideReadings.length > 0 ? `<section class="wrap section--lg theme-reading-collection">
      <p class="eyebrow">Continue with the daily readings</p>
      <h2 class="section-title">Reflections on letting go</h2>
      <p class="section-desc">Four readings that approach the difference between caring, carrying, and completing what is actually ours to do.</p>
      <div class="featured-grid">${guideCards}</div>
    </section>` : ''}

    <section class="wrap section--md theme-sources">
      <p class="eyebrow">Grounded in the program</p>
      <p>This guide draws on recurring ideas in Al-Anon literature, including <cite>How Al-Anon Works</cite>, <cite>Paths to Recovery</cite>, and <cite>Courage to Change</cite>, together with the original Daily Paths readings linked above. Daily Paths is an independent project and is not affiliated with Al-Anon Family Group Headquarters, Inc.</p>
    </section>

    <div class="wrap section--md" id="get-the-app">
      ${appPanel({
        tone: 'seafoam',
        heading: 'Practice letting go, one day at a time.',
        text: 'Read, reflect, save what speaks to you, and use private journaling tools in the Daily Paths app.',
        context: 'theme',
      })}
    </div>`;

  return wrapInLayout({
    title: 'Letting Go in Al-Anon — Caring Without Carrying | Daily Paths',
    description: topic.metaDescription,
    canonicalPath: `/themes/${topic.slug}/`,
    bodyContent,
    bodyClass: 'page-topic-detail page-letting-go',
    structuredData: [topicStructuredData(topic), topicBreadcrumbStructuredData(topic)],
    ogType: 'article',
    navSection: 'themes',
    hasAppPanel: true,
  });
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

  if (topic.slug === 'letting-go-of-control') {
    return renderLettingGoGuide(topic, allReadings, prevTopic, nextTopic);
  }

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
