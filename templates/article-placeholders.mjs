import {wrapInLayout} from './base.mjs';
import {bp} from '../helpers/config.mjs';

// Reserved addresses stay out of the article index until Story Room publishes them.
export const ARTICLE_PLACEHOLDERS = [
  {title:'What Happens After the Drinking Stops',path:'/articles/what-happens-after-the-drinking-stops/'},
];

export function renderArticlePlaceholder(article) {
  return wrapInLayout({
    title:`${article.title} | Daily Paths`,
    description:'This article is being written. Please check back soon.',
    canonicalPath:article.path,
    bodyClass:'content-article',navSection:'articles',noindex:true,
    bodyContent:`<article class="rd-article"><header><p class="sd-kicker">Article · Coming soon</p><h1>${article.title}</h1></header><div class="prose-reading"><p>This article is being written. Please check back soon.</p><p><a href="${bp('/articles/')}">Explore more articles</a></p></div></article>`,
  });
}
