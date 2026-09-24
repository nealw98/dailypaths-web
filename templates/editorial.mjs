import { wrapInLayout } from './base.mjs';
import { terminalBand, hubIntro, APP_STORE_URL, PLAY_STORE_URL } from './ui.mjs';
import { IS_PREVIEW, bp } from '../helpers/config.mjs';
import { readingSlug } from '../helpers/slug-utils.mjs';
import { GUIDES, ARTICLES } from '../helpers/content-catalog.mjs';
import { launchItems } from '../helpers/launch-review.mjs';
import { renderReflectionsIndexPage } from './steps.mjs';
import { THEME_TO_TOPIC } from '../helpers/theme-data.mjs';
import { reflectionHeroImage } from '../helpers/reflection-images.mjs';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain = value => String(value || '').replace(/<[^>]*>/g, '').replace(/\\n/g, ' ').replace(/[*_]/g, '').replace(/\s+/g, ' ').trim();

function articleCard(article) {
  return `<article class="sd-story" data-cms-path="${esc(article.path)}"><a class="sd-story-image" href="${bp(article.path)}" tabindex="-1" aria-hidden="true"><img src="${(article.cms?article.image:bp('/assets/' + article.image))}" alt="" width="960" height="600" loading="lazy"></a><p class="sd-kicker">${esc(article.category)}${article.author && article.category === 'Personal Story' ? ` · ${esc(article.author)}` : ''}${article.reviewDraft ? ' · Placeholder' : ''}</p><h3><a href="${bp(article.path)}">${esc(article.title)}</a></h3><p class="cms-card-summary">${esc(article.description)}</p><a class="sd-text-link" href="${bp(article.path)}" aria-label="Read ${esc(article.title)}">Read the article</a></article>`;
}

function guideRows() {
  return launchItems(GUIDES, IS_PREVIEW).map((g, i) => `<li data-cms-path="${esc(g.path)}"><a href="${bp(g.path)}"><span class="sd-guide-number" aria-hidden="true">0${i + 1}</span><span><h3>${esc(g.title)}</h3><p>${esc(g.description)}${g.reviewDraft ? ' <small>Placeholder</small>' : ''}</p></span></a></li>`).join('');
}

function homepageStory(article, image) {
  return `<article class="ed-story" data-cms-path="${esc(article.path)}"><a class="ed-story-image" href="${bp(article.path)}" aria-label="${esc(article.title)}"><img src="${(article.cms&&article.image?article.image:bp('/assets/articles/' + image))}" alt="" width="800" height="1000" loading="lazy"></a><div class="ed-story-copy"><p class="ed-label">${esc(article.category)}${article.author && article.category === 'Personal Story' ? ` · ${esc(article.author)}` : ''}</p><h3><a href="${bp(article.path)}">${esc(article.title)}</a></h3><p class="cms-card-summary">${esc(article.description)}</p><a class="ed-link" href="${bp(article.path)}">Read the article</a></div></article>`;
}

export function renderHomePage(reading) {
  const opening = plain(reading.opening || reading.body);
  const excerpt = opening.length > 155 ? opening.slice(0, 155).replace(/\s+\S*$/, '') + '…' : opening;
  const guides = launchItems(GUIDES, IS_PREVIEW);
  const articles = launchItems(ARTICLES, IS_PREVIEW);
  const featuredGuides = ['/topics/powerlessness/', '/topics/boundaries/', '/topics/detachment/'].map(path => guides.find(g => g.path === path)).filter(Boolean);
  const featuredArticles = ['/topics/letting-go/', '/articles/the-line-i-kept-moving/'].map(path => articles.find(a => a.path === path)).filter(Boolean);
  const topic = reading.secondary_theme ? THEME_TO_TOPIC[reading.secondary_theme] : null;
  const heroImage = reflectionHeroImage(reading.day_of_year, topic?.slug);
  return wrapInLayout({
    title: 'Daily Paths — A little space for yourself',
    description: 'Daily reflections, thoughtful articles, and practical guides for people affected by someone else’s drinking.',
    canonicalPath: '/', bodyClass: 'page-home', hasAppPanel: true,
    bodyContent: `<section class="ed-hero" aria-labelledby="reflection-title"><img class="ed-hero-photo" data-today-hero src="${bp('/assets/' + heroImage)}" alt="" fetchpriority="high"><div class="ed-hero-content ed-wrap"><div class="ed-reflection-meta"><p class="ed-label">Today’s reflection <span aria-hidden="true"></span></p><p data-today-date>${esc(reading.display_date)}</p></div><h1 id="reflection-title" data-today-title>${esc(reading.title)}</h1>${excerpt ? `<p class="ed-hero-deck" data-today-excerpt>${esc(excerpt)}</p>` : ''}<a class="ed-button" data-today-cta href="${bp('/' + readingSlug(reading.day_of_year, reading.title) + '/')}">Read today’s reflection <span aria-hidden="true">→</span></a><p class="ed-keep-reading">Also worth reading: <a class="ed-link" href="${bp('/topics/letting-go/')}">Caring without carrying</a></p></div></section>
<section class="ed-start" aria-labelledby="start-heading"><div class="ed-start-inner ed-wrap"><div><p class="ed-label">Start here</p><h2 id="start-heading">Is someone else&rsquo;s drinking affecting your life?</h2><p>See whether Al-Anon may be for you, what a meeting is like, and where you can begin.</p></div><a class="ed-button" href="${bp(IS_PREVIEW ? '/guides/finding-help/' : '/start/')}">${IS_PREVIEW ? 'Find help' : 'Start here'} <span aria-hidden="true">→</span></a></div></section>
    <section class="ed-articles ed-wrap" aria-labelledby="articles-heading"><div class="ed-section-heading"><h2 id="articles-heading">For the life you’re living</h2><a class="ed-link" href="${bp('/articles/')}">All articles</a></div><div class="ed-stories">${featuredArticles.map(article => homepageStory(article, article.image.replace(/^articles\//, ''))).join('')}</div></section>
    <section class="ed-guides ed-wrap" aria-labelledby="guides-heading"><div class="ed-section-heading"><h2 id="guides-heading">Guides to come back to</h2><a class="ed-link ed-all-guides" href="${bp('/guides/')}">All guides</a></div><div class="ed-guide-row">${featuredGuides.map(g => `<article><h3><a href="${bp(g.path)}">${esc(g.title)}</a></h3><p>${esc(g.description)}</p></article>`).join('')}</div></section>
    <section class="ed-app" id="get-the-app" aria-labelledby="app-heading"><img class="ed-app-scene" src="${bp('/assets/articles/soft-daylight-journal.webp')}" alt="" width="1672" height="941" loading="lazy"><div class="ed-app-inner ed-wrap"><div class="ed-app-screen"><img src="${bp('/assets/Screenshots/today-actual.png')}" alt="The Daily Paths app showing today’s reflection and daily tools" width="944" height="2048" loading="lazy"></div><div class="ed-app-copy"><h2 id="app-heading">Make room for yourself,<br><em>every day.</em></h2><p>A daily reflection, a place for your thoughts,<br class="ed-wide-only"> and small ways to bring the focus back to you.</p><a class="ed-button" href="${APP_STORE_URL}" target="_blank" rel="noopener noreferrer">Get the Daily Paths app</a><p class="ed-app-platforms">For iPhone · <a href="${PLAY_STORE_URL}" target="_blank" rel="noopener noreferrer">Also on Android</a></p></div></div></section>`,
  });
}

export function renderArticlesPage() {
  return wrapInLayout({ title:'Articles — Daily Paths', description:'Thoughtful reading about letting go, relationships, and finding your way back to yourself.', canonicalPath:'/articles/', bodyClass:'page-editorial', navSection:'articles', hasAppPanel:true,
    bodyContent:`${hubIntro({ eyebrow:'The reading room', title:'Thoughtful insights in the everyday issues', description:'Thoughts and perspectives for the moments that feel familiar.', id:'articles-title' })}<section class="sd-stories sd-wrap sd-article-library" aria-label="Articles">${launchItems(ARTICLES, IS_PREVIEW).map(articleCard).join('')}</section>${terminalBand()}`});
}

export function renderGuidesPage() {
  return wrapInLayout({ title:'Guides — Daily Paths', description:'Explore detachment, boundaries, support, and other essential ideas for people affected by someone else’s drinking.', canonicalPath:'/guides/', bodyClass:'page-editorial', navSection:'guides', hasAppPanel:true,
    bodyContent:`${hubIntro({ eyebrow:'The guides', title:'A place to begin.<br>A place to return.', description:'Explore one idea at a time, at your own pace.', id:'guides-title' })}<section class="hub-reference-measure sd-guide-library" aria-label="Guides"><ol class="sd-guide-list">${guideRows()}</ol></section><aside class="hub-reference-measure sd-related-note"><p class="sd-kicker">A related read</p><h2><a href="${bp('/topics/letting-go/')}">Letting Go: Caring Without Carrying</a></h2><p>On responsibility, control, and putting down what isn’t yours to carry.</p></aside>${terminalBand()}`});
}

export function renderReflectionsPage(reading) {
  return renderReflectionsIndexPage(reading);
}
