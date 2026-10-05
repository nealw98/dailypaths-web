import { themePath } from '../helpers/theme-pages.mjs';
import { wrapInLayout } from './base.mjs';
import { terminalBand, hubIntro, storeBadges } from './ui.mjs';
import { IS_PREVIEW, bp } from '../helpers/config.mjs';
import { readingSlug } from '../helpers/slug-utils.mjs';
import { GUIDES, ARTICLES } from '../helpers/content-catalog.mjs';
import { launchItems } from '../helpers/launch-review.mjs';
import { renderReflectionsIndexPage } from './steps.mjs';
import { THEME_TO_TOPIC } from '../helpers/theme-data.mjs';
import { reflectionHeroImage } from '../helpers/reflection-images.mjs';
import { homepageStructuredData } from '../helpers/seo.mjs';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain = value => String(value || '').replace(/<[^>]*>/g, '').replace(/\\n/g, ' ').replace(/[*_]/g, '').replace(/\s+/g, ' ').trim();

function articleCard(article) {
  return `<article class="sd-story" data-cms-path="${esc(article.path)}"><a class="sd-story-image" href="${bp(article.path)}" tabindex="-1" aria-hidden="true"><img src="${(article.cms?article.image:bp('/assets/' + article.image))}" alt="" width="960" height="600" loading="lazy"></a><h3><a href="${bp(article.path)}">${esc(article.title)}</a></h3><p class="cms-card-summary">${esc(article.description)}</p><a class="sd-text-link" href="${bp(article.path)}" aria-label="Read ${esc(article.title)}">Read the article</a></article>`;
}

function guideRows() {
  return launchItems(GUIDES, IS_PREVIEW).map(g => {
    const hero = g.image ? `<span class="sd-guide-image"><img src="${g.cms ? esc(g.image) : bp('/assets/' + g.image)}" alt="${esc(g.alt || '')}" loading="lazy"></span>` : '';
    return `<li data-cms-path="${esc(g.path)}"${hero ? ' class="has-image"' : ''}><a href="${bp(g.path)}">${hero}<span class="sd-guide-copy"><h3>${esc(g.title)}</h3><p>${esc(g.description)}${g.reviewDraft ? ' <small>Placeholder</small>' : ''}</p></span></a></li>`;
  }).join('');
}

function homepageStory(article, image) {
  return `<article class="ed-story" data-cms-path="${esc(article.path)}"><a class="ed-story-image" href="${bp(article.path)}" aria-label="${esc(article.title)}"><img src="${(article.cms&&article.image?article.image:bp('/assets/articles/' + image))}" alt="" width="800" height="1000" loading="lazy"></a><div class="ed-story-copy">${article.author ? `<p class="ed-label">By ${esc(article.author)}</p>` : ''}<h3><a href="${bp(article.path)}">${esc(article.title)}</a></h3><p class="cms-card-summary">${esc(article.description)}</p><a class="ed-link" href="${bp(article.path)}">Read the article</a></div></article>`;
}

export function renderHomePage(reading, allReadings = []) {
  // The six days before today. Today's is the hero, so the band picks up where it
  // leaves off, and the year wraps at January 1. Built with real links rather than
  // filled in by script, so a crawler sees them; js/main.js advances them for the
  // reader the same way it advances the hero.
  const todayIdx = allReadings.findIndex(r => r.day_of_year === reading.day_of_year);
  const recentReadings = todayIdx < 0 ? [] : Array.from({ length: 6 }, (_, i) =>
    allReadings[(todayIdx - 1 - i + allReadings.length) % allReadings.length]).filter(Boolean);
  const opening = plain(reading.opening || reading.body);
  const excerpt = opening.length > 155 ? opening.slice(0, 155).replace(/\s+\S*$/, '') + '…' : opening;
  const guides = launchItems(GUIDES, IS_PREVIEW);
  const articles = launchItems(ARTICLES, IS_PREVIEW);
  const featuredGuides = [themePath('powerlessness'), themePath('boundaries'), themePath('detachment')].map(path => guides.find(g => g.path === path)).filter(Boolean);
  const featuredArticles = [themePath('letting-go'), '/articles/the-line-i-kept-moving/'].map(path => articles.find(a => a.path === path)).filter(Boolean);
  const topic = reading.secondary_theme ? THEME_TO_TOPIC[reading.secondary_theme] : null;
  const heroImage = reflectionHeroImage(reading.day_of_year, topic?.slug);
  return wrapInLayout({
    // The page's own subject first, then the brand. The search data says the
    // demand is for daily readings; "Daily Paths" alone matched none of it.
    title: 'Al-Anon Daily Reflections & Recovery Guides | Daily Paths',
    description: 'A new Al-Anon reflection every day, plus guides to detachment, boundaries and surrender for anyone affected by someone else’s drinking.',
    canonicalPath: '/', bodyClass: 'page-home', hasAppPanel: true,
    structuredData: homepageStructuredData(),
    bodyContent: `<section class="ed-hero" aria-labelledby="reflection-title"><img class="ed-hero-photo" data-today-hero src="${bp('/assets/' + heroImage)}" alt="" fetchpriority="high"><div class="ed-hero-content ed-wrap"><div class="ed-reflection-meta"><h1 class="ed-label">Al-Anon daily reflections <span aria-hidden="true"></span></h1><p data-today-date>${esc(reading.display_date)}</p></div><h2 id="reflection-title" data-today-title>${esc(reading.title)}</h2>${excerpt ? `<p class="ed-hero-deck" data-today-excerpt>${esc(excerpt)}</p>` : ''}<a class="ed-button" data-today-cta href="${bp('/' + readingSlug(reading.day_of_year, reading.title) + '/')}">Read today’s reflection <span aria-hidden="true">→</span></a><p class="ed-keep-reading">Also worth reading: <a class="ed-link" href="${bp('/articles/the-stories-we-tell-ourselves/')}">The Stories We Tell Ourselves</a></p></div></section>
<section class="ed-collection ed-wrap" aria-labelledby="collection-heading">
      <div class="ed-collection-intro">
        <div><h2 id="collection-heading">366 Al-Anon daily reflections, one for every day</h2></div>
        <div class="ed-collection-copy">
          <p>Every reading here is original, written for this collection rather than reprinted from anywhere else. Each month follows one of the Twelve Steps, so a reading sits in the company of the others written alongside it &mdash; you can follow the year as it comes, or go to whichever Step you are working.</p>
        </div>
      </div>
      ${recentReadings.length ? `<p class="ed-label ed-week-label">Earlier this week</p>
      <div class="ed-week">${recentReadings.map(r => `<a class="ed-day" href="${bp('/' + readingSlug(r.day_of_year, r.title) + '/')}"><span class="ed-day-date">${esc(r.display_date)}</span><span class="ed-day-title">${esc(r.title)}</span>${r.thought ? `<span class="ed-day-line">${esc(r.thought)}</span>` : ''}</a>`).join('')}</div>` : ''}
      <p class="ed-collection-links"><a class="ed-link" href="${bp('/reflections/')}">Browse the entire collection</a> <span class="ed-dot" aria-hidden="true">&middot;</span> <a class="ed-link" href="${bp('/reflections/favorites/')}">The ten readers return to most</a></p>
    </section>
<section class="ed-start" aria-labelledby="start-heading"><div class="ed-start-inner ed-wrap"><div><p class="ed-label">New to Al-Anon</p><h2 id="start-heading">Is someone else&rsquo;s drinking affecting your life?</h2></div><div class="ed-start-copy"><p>You may have come here because of someone else &mdash; a partner, a parent, a grown child &mdash; and because their drinking has begun to shape your days. You may recognise the checking, the covering, the bracing for the next argument, the conversations rehearsed in advance that never go the way you planned.</p><p>Al-Anon is a fellowship of people in that position. It is not treatment for the drinker, and it is not advice on how to make them stop. It is a room of people who have lived with the same thing, turning the attention back to their own lives.</p><p>You don&rsquo;t need a diagnosis, a referral, or a clear story to begin. You can spend your first meeting listening.</p><p>Daily Paths is an independent project, not part of Al-Anon Family Groups. The readings here are original writing grounded in the Twelve Steps, not Conference Approved Literature. For meeting times and official information, go to <a class="ed-link" href="https://al-anon.org/" target="_blank" rel="noopener noreferrer">al-anon.org</a>.</p><p class="ed-start-cta"><a class="ed-button" href="${bp('/guides/finding-help/')}">Start here <span aria-hidden="true">→</span></a></p></div></div></section>
    <section class="ed-articles ed-wrap" aria-labelledby="articles-heading"><div class="ed-section-heading"><h2 id="articles-heading">For the life you’re living</h2><a class="ed-link" href="${bp('/articles/')}">All articles</a></div><div class="ed-stories">${featuredArticles.map(article => homepageStory(article, article.image.replace(/^articles\//, ''))).join('')}</div></section>
    <section class="ed-guides ed-wrap" aria-labelledby="guides-heading"><div class="ed-section-heading"><h2 id="guides-heading">Guides to come back to</h2><a class="ed-link ed-all-guides" href="${bp('/guides/')}">All guides</a></div><div class="ed-guide-row">${featuredGuides.map(g => `<article><h3><a href="${bp(g.path)}">${esc(g.title)}</a></h3><p>${esc(g.description)}</p></article>`).join('')}</div></section>
    <section class="ed-app" id="get-the-app" aria-labelledby="app-heading"><img class="ed-app-scene" src="${bp('/assets/articles/soft-daylight-journal.webp')}" alt="" width="1672" height="941" loading="lazy"><div class="ed-app-inner ed-wrap"><div class="ed-app-screen"><img src="${bp('/assets/Screenshots/today-actual.png')}" alt="The Daily Paths app showing today’s reflection and daily tools" width="944" height="2048" loading="lazy"></div><div class="ed-app-copy"><h2 id="app-heading">Make room for yourself, <br><em>every day.</em></h2><p>A daily reflection, a place for your thoughts,<br class="ed-wide-only"> and small ways to bring the focus back to you.</p>${storeBadges()}</div></div></section>`,
  });
}

export function renderArticlesPage() {
  return wrapInLayout({ title:'Articles — Daily Paths', description:'Personal stories and articles about living with the effects of someone else’s drinking.', canonicalPath:'/articles/', bodyClass:'page-editorial', navSection:'articles', hasAppPanel:true,
    bodyContent:`${hubIntro({ title:'Articles', description:'Personal stories and articles about living with the effects of someone else’s drinking.', id:'articles-title' })}<section class="sd-stories sd-wrap sd-article-library" aria-labelledby="article-library-heading"><h2 class="visually-hidden" id="article-library-heading">All articles</h2>${launchItems(ARTICLES, IS_PREVIEW).map(articleCard).join('')}</section>${terminalBand().replace('<p class="sd-kicker">The Daily Paths app</p>', '')}`});
}

export function renderGuidesPage() {
  return wrapInLayout({ title:'Guides — Daily Paths', description:'Practical help with boundaries, detachment, surrender, and finding support.', canonicalPath:'/guides/', bodyClass:'page-editorial', navSection:'guides', hasAppPanel:true,
    bodyContent:`${hubIntro({ title:'Guides', description:'Practical help with boundaries, detachment, surrender, and finding support.', id:'guides-title' })}<section class="hub-reference-measure sd-guide-library" aria-labelledby="guide-library-heading"><h2 class="visually-hidden" id="guide-library-heading">All guides</h2><ol class="sd-guide-list">${guideRows()}</ol></section><aside class="hub-reference-measure sd-related-note"><p class="sd-kicker">Article</p><p class="sd-related-title"><a href="${bp(themePath('letting-go'))}">Letting Go</a></p><p>When worry keeps you rehearsing tomorrow and replaying yesterday.</p></aside>${terminalBand()}`});
}

export function renderReflectionsPage(reading, allReadings = []) {
  return renderReflectionsIndexPage(reading, allReadings);
}
