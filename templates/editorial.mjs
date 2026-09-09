import { wrapInLayout } from './base.mjs';
import { terminalBand } from './ui.mjs';
import { bp } from '../helpers/config.mjs';
import { readingSlug } from '../helpers/slug-utils.mjs';
import { GUIDES, ARTICLES } from '../helpers/content-catalog.mjs';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain = value => String(value || '').replace(/<[^>]*>/g, '').replace(/\\n/g, ' ').replace(/[*_]/g, '').replace(/\s+/g, ' ').trim();

function articleCard(article) {
  return `<article class="sd-story"><a class="sd-story-image" href="${bp(article.path)}" tabindex="-1" aria-hidden="true"><img src="${bp('/assets/' + article.image)}" alt="" width="900" height="600" loading="lazy"></a><p class="sd-kicker">${esc(article.category)}</p><h3><a href="${bp(article.path)}">${esc(article.title)}</a></h3><p>${esc(article.description)}</p><a class="sd-text-link" href="${bp(article.path)}" aria-label="Read ${esc(article.title)}">Read the article <span aria-hidden="true">↗</span></a></article>`;
}

function guideRows() {
  return GUIDES.map((g, i) => `<li><a href="${bp(g.path)}"><span class="sd-guide-number" aria-hidden="true">0${i + 1}</span><span><h3>${esc(g.title)}</h3><p>${esc(g.description)}</p></span><span class="sd-guide-arrow" aria-hidden="true">↗</span></a></li>`).join('');
}

function emailInvitation() {
  // Render a working form only when an actual email provider endpoint is configured.
  const action = process.env.NEWSLETTER_ACTION;
  return `<section class="sd-email sd-wrap" aria-labelledby="email-heading"><div><p class="sd-kicker">A little space in your inbox</p><h2 id="email-heading">A reflection to return to.</h2><p>A quiet invitation to pause and come back to yourself.</p></div>${action ? `<form action="${esc(action)}" method="post"><label for="newsletter-email">Your email address</label><div class="sd-email-fields"><input id="newsletter-email" type="email" name="email" autocomplete="email" placeholder="you@example.com" required><button type="submit" class="sd-button">Subscribe</button></div><p class="sd-small">You can unsubscribe at any time. <a href="${bp('/privacy/')}">Privacy policy</a></p></form>` : `<div class="sd-email-soon"><p>Email reflections are coming soon.</p><a class="sd-text-link" href="${bp('/reflections/')}">Read a reflection today <span aria-hidden="true">↗</span></a></div>`}</section>`;
}

export function renderHomePage(reading) {
  const excerpt = plain(reading.opening).slice(0, 205).replace(/\s+\S*$/, '') + '…';
  return wrapInLayout({
    title: 'Daily Paths — A little space for yourself',
    description: 'Daily reflections, thoughtful articles, and practical guides for people affected by someone else’s drinking.',
    canonicalPath: '/', bodyClass: 'page-home', hasAppPanel: true,
    bodyContent: `<section class="sd-hero" aria-labelledby="reflection-title"><img class="sd-hero-image" src="${bp('/assets/articles/soft-daylight-window.webp')}" alt="A woman taking a quiet moment with a cup beside an open window" width="1672" height="941" fetchpriority="high"><div class="sd-hero-shade"></div><div class="sd-hero-inner sd-wrap"><p class="sd-kicker">Today’s reflection <span aria-hidden="true">·</span> <span data-today-date>${esc(reading.display_date)}</span></p><h1 id="reflection-title" data-today-title>${esc(reading.title)}</h1><p class="sd-hero-excerpt" data-today-excerpt>${esc(excerpt)}</p><a class="sd-button" data-today-cta href="${bp('/' + readingSlug(reading.day_of_year, reading.title) + '/')}">Read today’s reflection <span aria-hidden="true">↗</span></a><p class="sd-hero-note">A few moments. A different perspective.</p></div></section>
    <div class="sd-welcome sd-wrap"><p>You don’t have to figure it all out today.</p><a class="sd-text-link" href="${bp('/start/')}">New here? Start with this <span aria-hidden="true">↗</span></a></div>
    <section class="sd-section sd-wrap" aria-labelledby="articles-heading"><div class="sd-section-heading"><div><p class="sd-kicker">For the life you’re living</p><h2 id="articles-heading">A little understanding goes a long way.</h2></div><a class="sd-text-link" href="${bp('/articles/')}">All articles <span aria-hidden="true">↗</span></a></div><div class="sd-stories">${ARTICLES.slice(0,2).map(articleCard).join('')}</div></section>
    <section class="sd-guide-section" aria-labelledby="guides-heading"><div class="sd-guide-layout sd-wrap"><div class="sd-guide-intro"><p class="sd-kicker">The guides</p><h2 id="guides-heading">Ideas you can<br>come back to.</h2><p>Some words come up again and again. Take a closer look at what they mean in everyday life.</p><a class="sd-text-link" href="${bp('/guides/')}">Explore the guides <span aria-hidden="true">↗</span></a></div><ol class="sd-guide-list">${guideRows()}</ol></div></section>
    ${terminalBand({heading:'Make room for yourself,<br><em>every day.</em>',text:'A daily reflection. A place for your thoughts. Small ways to bring the focus back to you.'})}
    ${emailInvitation()}`,
  });
}

export function renderArticlesPage() {
  return wrapInLayout({ title:'Articles — Daily Paths', description:'Thoughtful reading about letting go, relationships, and finding your way back to yourself.', canonicalPath:'/articles/', bodyClass:'page-editorial', navSection:'articles', hasAppPanel:true,
    bodyContent:`<header class="sd-page-heading sd-wrap"><p class="sd-kicker">The reading room</p><h1>Something to sit with.</h1><p>Thoughts and perspectives for the moments that feel familiar.</p></header><section class="sd-stories sd-wrap sd-article-library" aria-label="Articles">${ARTICLES.map(articleCard).join('')}</section><div class="sd-wrap sd-more"><a class="sd-text-link" href="${bp('/topics/')}">Browse all existing topics <span aria-hidden="true">↗</span></a></div>${terminalBand()}`});
}

export function renderGuidesPage() {
  return wrapInLayout({ title:'Guides — Daily Paths', description:'Explore detachment, boundaries, support, and other essential ideas for people affected by someone else’s drinking.', canonicalPath:'/guides/', bodyClass:'page-editorial', navSection:'guides', hasAppPanel:true,
    bodyContent:`<header class="sd-page-heading sd-wrap"><p class="sd-kicker">The guides</p><h1>A place to begin.<br>A place to return.</h1><p>Explore one idea at a time, at your own pace.</p></header><section class="sd-wrap sd-guide-library" aria-label="Guides"><ol class="sd-guide-list">${guideRows()}</ol></section><aside class="sd-wrap sd-related-note"><p class="sd-kicker">A related read</p><h2><a href="${bp('/topics/letting-go/')}">Letting Go: Caring Without Carrying <span aria-hidden="true">↗</span></a></h2><p>On responsibility, control, and putting down what isn’t yours to carry.</p></aside>${terminalBand()}`});
}

export function renderReflectionsPage(reading) {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return wrapInLayout({ title:'Daily Reflections — Daily Paths', description:'A year of daily reflections. Read today’s reflection or find a reading by date.', canonicalPath:'/reflections/', bodyClass:'page-editorial', navSection:'reflection', hasAppPanel:true,
    bodyContent:`<header class="sd-page-heading sd-wrap"><p class="sd-kicker">One day at a time</p><h1>A moment for yourself.</h1><p>There is no need to catch up. Begin with today.</p><a class="sd-button" data-today-link href="${bp('/' + readingSlug(reading.day_of_year,reading.title) + '/')}">Read today’s reflection <span aria-hidden="true">↗</span></a></header><section class="sd-wrap sd-archive"><h2>Find a reflection by date</h2><nav class="sd-months" aria-label="Reflection months">${months.map((month,i)=>`<a href="${bp('/months/'+month.toLowerCase()+'/')}"><span class="sd-kicker">${String(i+1).padStart(2,'0')}</span><span>${month}</span><span aria-hidden="true">↗</span></a>`).join('')}</nav></section>${terminalBand()}`});
}
