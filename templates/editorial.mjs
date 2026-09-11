import { wrapInLayout } from './base.mjs';
import { terminalBand, APP_STORE_URL, PLAY_STORE_URL } from './ui.mjs';
import { bp } from '../helpers/config.mjs';
import { readingSlug } from '../helpers/slug-utils.mjs';
import { GUIDES, ARTICLES } from '../helpers/content-catalog.mjs';
import { renderReflectionsIndexPage } from './steps.mjs';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain = value => String(value || '').replace(/<[^>]*>/g, '').replace(/\\n/g, ' ').replace(/[*_]/g, '').replace(/\s+/g, ' ').trim();

function articleCard(article) {
  return `<article class="sd-story"><a class="sd-story-image" href="${bp(article.path)}" tabindex="-1" aria-hidden="true"><img src="${bp('/assets/' + article.image)}" alt="" width="900" height="600" loading="lazy"></a><p class="sd-kicker">${esc(article.category)}</p><h3><a href="${bp(article.path)}">${esc(article.title)}</a></h3><p>${esc(article.description)}</p><a class="sd-text-link" href="${bp(article.path)}" aria-label="Read ${esc(article.title)}">Read the article <span aria-hidden="true">↗</span></a></article>`;
}

function guideRows() {
  return GUIDES.map((g, i) => `<li><a href="${bp(g.path)}"><span class="sd-guide-number" aria-hidden="true">0${i + 1}</span><span><h3>${esc(g.title)}</h3><p>${esc(g.description)}</p></span><span class="sd-guide-arrow" aria-hidden="true">↗</span></a></li>`).join('');
}

function emailInvitation() {
  const action = process.env.NEWSLETTER_ACTION;
  return `<section class="ed-email ed-wrap" aria-labelledby="email-heading"><h2 id="email-heading">A little perspective in your inbox.</h2><p>Daily reflections and new articles from Daily Paths.</p><form ${action ? `action="${esc(action)}" method="post"` : 'aria-describedby="email-status"'}><label class="sr-only" for="newsletter-email">Your email address</label><input id="newsletter-email" name="email" type="email" autocomplete="email" placeholder="Your email address" ${action ? 'required' : 'disabled'}><button class="ed-button" type="submit" ${action ? '' : 'disabled'}>Sign me up</button></form>${action ? `<p class="ed-email-note"><a href="${bp('/privacy/')}">Privacy</a> · Unsubscribe at any time.</p>` : '<p class="ed-email-note" id="email-status">Email signup is coming soon.</p>'}</section>`;
}

function homepageStory(article, image) {
  return `<article class="ed-story"><a class="ed-story-image" href="${bp(article.path)}" aria-label="${esc(article.title)}"><img src="${bp('/assets/articles/' + image)}" alt="" width="800" height="1000" loading="lazy"></a><div class="ed-story-copy"><p class="ed-label">Articles</p><h3><a href="${bp(article.path)}">${esc(article.title)}</a></h3><p>${esc(article.description)}</p><a class="ed-link" href="${bp(article.path)}">Read the article <span aria-hidden="true">⟶</span></a></div></article>`;
}

export function renderHomePage(reading) {
  const opening = plain(reading.opening || reading.body);
  const excerpt = opening.length > 155 ? opening.slice(0, 155).replace(/\s+\S*$/, '') + '…' : opening;
  const featuredGuides = [GUIDES[0], GUIDES[2], GUIDES[1]];
  return wrapInLayout({
    title: 'Daily Paths — A little space for yourself',
    description: 'Daily reflections, thoughtful articles, and practical guides for people affected by someone else’s drinking.',
    canonicalPath: '/', bodyClass: 'page-home', hasAppPanel: true,
    bodyContent: `<section class="ed-hero" aria-labelledby="reflection-title"><img class="ed-hero-photo" src="${bp('/assets/articles/editorial-window.webp')}" alt="A quiet moment with a cup by an open window" width="1672" height="941" fetchpriority="high"><div class="ed-hero-content ed-wrap"><div class="ed-reflection-meta"><p class="ed-label">Today’s reflection <span aria-hidden="true"></span></p><p data-today-date>${esc(reading.display_date)}</p></div><h1 id="reflection-title" data-today-title>${esc(reading.title)}</h1>${excerpt ? `<p class="ed-hero-deck" data-today-excerpt>${esc(excerpt)}</p>` : ''}<a class="ed-button" data-today-cta href="${bp('/' + readingSlug(reading.day_of_year, reading.title) + '/')}">Read today’s reflection <span aria-hidden="true">⟶</span></a><p class="ed-keep-reading">Keep reading: <a class="ed-link" href="${bp('/topics/letting-go/')}">Caring without carrying <span aria-hidden="true">⟶</span></a></p></div><p class="ed-photo-caption">A moment<br>of your own<br>can change<br>your perspective.<span aria-hidden="true"></span></p></section>
    <section class="ed-articles ed-wrap" aria-labelledby="articles-heading"><div class="ed-section-heading"><h2 id="articles-heading">For the life you’re living</h2><a class="ed-link" href="${bp('/articles/')}">Explore all articles <span aria-hidden="true">⟶</span></a></div><div class="ed-stories">${homepageStory(ARTICLES[0], 'editorial-doorway.webp')}${homepageStory(ARTICLES[1], 'editorial-phone.webp')}</div></section>
    <section class="ed-guides ed-wrap" aria-labelledby="guides-heading"><div class="ed-section-heading"><h2 id="guides-heading">Guides to come back to</h2><a class="ed-link ed-all-guides" href="${bp('/guides/')}">All guides <span aria-hidden="true">⟶</span></a></div><div class="ed-guide-row">${featuredGuides.map(g => `<article><h3><a href="${bp(g.path)}">${esc(g.title)} <span aria-hidden="true">⟶</span></a></h3><p>${esc(g.description)}</p></article>`).join('')}</div></section>
    <section class="ed-app" id="get-the-app" aria-labelledby="app-heading"><img class="ed-app-scene" src="${bp('/assets/articles/soft-daylight-journal.webp')}" alt="" width="1672" height="941" loading="lazy"><div class="ed-app-inner ed-wrap"><div class="ed-app-screen"><img src="${bp('/assets/Screenshots/today-actual.png')}" alt="The Daily Paths app showing today’s reflection and daily tools" width="944" height="2048" loading="lazy"></div><div class="ed-app-copy"><h2 id="app-heading">Make room for yourself,<br><em>every day.</em></h2><p>A daily reflection, a place for your thoughts,<br class="ed-wide-only"> and small ways to bring the focus back to you.</p><a class="ed-button" href="${APP_STORE_URL}" target="_blank" rel="noopener noreferrer">Get the Daily Paths app <span aria-hidden="true">⟶</span></a><p class="ed-app-platforms">For iPhone · <a href="${PLAY_STORE_URL}" target="_blank" rel="noopener noreferrer">Also on Android</a></p></div></div></section>
    ${emailInvitation()}`,
  });
}

export function renderArticlesPage() {
  return wrapInLayout({ title:'Articles — Daily Paths', description:'Thoughtful reading about letting go, relationships, and finding your way back to yourself.', canonicalPath:'/articles/', bodyClass:'page-editorial', navSection:'articles', hasAppPanel:true,
    bodyContent:`<header class="sd-page-heading sd-wrap"><p class="sd-kicker">The reading room</p><h1>Something to sit with.</h1><p>Thoughts and perspectives for the moments that feel familiar.</p></header><section class="sd-stories sd-wrap sd-article-library" aria-label="Articles">${ARTICLES.map(articleCard).join('')}</section>${terminalBand()}`});
}

export function renderGuidesPage() {
  return wrapInLayout({ title:'Guides — Daily Paths', description:'Explore detachment, boundaries, support, and other essential ideas for people affected by someone else’s drinking.', canonicalPath:'/guides/', bodyClass:'page-editorial', navSection:'guides', hasAppPanel:true,
    bodyContent:`<header class="sd-page-heading sd-wrap"><p class="sd-kicker">The guides</p><h1>A place to begin.<br>A place to return.</h1><p>Explore one idea at a time, at your own pace.</p></header><section class="sd-wrap sd-guide-library" aria-label="Guides"><ol class="sd-guide-list">${guideRows()}</ol></section><aside class="sd-wrap sd-related-note"><p class="sd-kicker">A related read</p><h2><a href="${bp('/topics/letting-go/')}">Letting Go: Caring Without Carrying <span aria-hidden="true">↗</span></a></h2><p>On responsibility, control, and putting down what isn’t yours to carry.</p></aside>${terminalBand()}`});
}

export function renderReflectionsPage(reading) {
  return renderReflectionsIndexPage(reading);
}
