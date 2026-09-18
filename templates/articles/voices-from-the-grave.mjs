import { readFileSync } from 'node:fs';
import { wrapInLayout } from '../base.mjs';
import { photoHero, terminalBand } from '../ui.mjs';
import { bp, BASE_URL } from '../../helpers/config.mjs';
import { markdownToHtml } from '../../helpers/markdown.mjs';
import { VOICES_ARTICLE } from '../../helpers/content-catalog.mjs';

export { VOICES_ARTICLE };
// The supplied Markdown is the source of truth; integration does not rewrite it.
const copy = readFileSync(new URL('./voices-from-the-grave.md', import.meta.url), 'utf8');
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const inline = text => markdownToHtml(esc(text)).replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g, '<a href="$2">$1</a>');

export function renderVoicesFromTheGrave() {
  const flow = copy.trim().split(/\n\s*\n/).map(block => {
    if (block.startsWith('# ') || block === '---') return '';
    if (block.startsWith('> ')) return `<blockquote class="tg-thesis type-thesis-quote"><p>${inline(block.slice(2))}</p></blockquote>`;
    if (block.startsWith('### ')) return `<h2>${inline(block.slice(4))}</h2>
      <figure class="tg-diagram voices-insert"><img src="${bp('/assets/articles/voices-from-the-grave/when-the-past-starts-to-haunt-you.webp')}" alt="When the past starts to haunt you: recognize the voice, put its authority back in the past, find your own voice, let go and let God, and reach out. Full explanations follow." width="1254" height="1254" loading="lazy"></figure>`;
    if (block.startsWith('## ')) return `<h2>${inline(block.slice(3))}</h2>`;
    return `<p>${inline(block)}</p>`;
  }).join('\n');
  return wrapInLayout({
    title: `${VOICES_ARTICLE.title} | Daily Paths`,
    description: VOICES_ARTICLE.description,
    canonicalPath: VOICES_ARTICLE.path,
    bodyClass: 'page-topic-detail page-voices-article', navSection: 'articles', ogType: 'article', hasAppPanel: true,
    structuredData: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Article', headline: VOICES_ARTICLE.title,
      description: VOICES_ARTICLE.description,
      publisher: { '@type': 'Organization', name: 'Daily Paths' },
      mainEntityOfPage: BASE_URL + VOICES_ARTICLE.path,
    }),
    bodyContent: `<nav class="collection-rail" aria-label="Breadcrumb"><div class="collection-rail-inner"><a href="${bp('/articles/')}">&larr; Back to Articles</a><span aria-current="page">${VOICES_ARTICLE.title}</span></div></nav>
      ${photoHero({ image: bp('/assets/' + VOICES_ARTICLE.image), alt: VOICES_ARTICLE.alt, title: VOICES_ARTICLE.title, eyebrow: 'Finding your voice', subtitle: VOICES_ARTICLE.description, size: 'lg', titleClass: 'photo-hero-title--theme', width: 1672, height: 941 })}
      <article class="rd-article tg-article"><div class="tg-section prose-reading">${flow}</div></article>
      ${terminalBand()}`,
  });
}
