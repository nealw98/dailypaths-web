import { readFileSync } from 'node:fs';
import { wrapInLayout } from '../base.mjs';
import { terminalBand } from '../ui.mjs';
import { bp } from '../../helpers/config.mjs';
import { readingSlug } from '../../helpers/slug-utils.mjs';

const source = readFileSync(new URL('./boundaries.md', import.meta.url), 'utf8')
  .replace(/<!--[\s\S]*?-->/g, '').trim();
const title = 'Boundaries: Reclaiming Your Life';
const subtitle = 'A practical guide to setting limits when affected by someone else’s drinking.';
const headings = new Map([
  ['The Cost of Living Without Boundaries', 'Living Without Boundaries'],
  ['What Boundaries Are—and What They Are Not', 'Understanding Boundaries'],
  ['Boundaries in Everyday Life', 'Everyday Examples'],
  ['Setting and Maintaining Your Boundaries', 'Setting a Boundary'],
  ['Step 1: Tune Into Your Warning Signs (Check Your HALT)', 'Step 1: Notice Your Warning Signs'],
  ['Step 2: Separate What Is Yours from What Is Not', 'Step 2: Separate Your Responsibilities'],
  ['Step 3: State Your Limit Clearly and Calmly', 'Step 3: State Your Limit'],
  ['Step 4: Follow Through with Action', 'Step 4: Follow Through with Action'],
  ['Step 5: Practice “Detachment with Love”', 'Step 5: Practice Detachment with Love'],
]);
const anchor = text => text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s/g, '-');
const escape = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function inline(text) {
  return escape(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => `<a href="${href.startsWith('#') ? href : href === 'https://dailypaths.org/' ? bp('/reflections/') : href}">${label}</a>`);
}
function guideBody() {
  const text = source.slice(source.indexOf('## The Cost'));
  let insert = false;
  return text.split(/\n\s*\n/).map(block => {
    block = block.trim();
    if (block === '---') {
      if (insert) { insert = false; return '</aside>'; }
      // The final Markdown rule is only a manuscript separator.
      return '';
    }
    const insertNames = {'**Before you state your boundary**': 'preparation', '**When safety is at risk**': 'safety'};
    if (insertNames[block]) {
      insert = insertNames[block];
      return `<aside class="boundary-insert boundary-insert--${insertNames[block]}" aria-labelledby="${insertNames[block]}-title"><h3 id="${insertNames[block]}-title">${inline(block.slice(2,-2))}</h3>`;
    }
    const heading = block.match(/^(#{2,3}) (.+)$/);
    if (heading) {
      const [, marks, original] = heading;
      return `<h${marks.length} id="${anchor(original)}">${inline(headings.get(original) || original)}</h${marks.length}>`;
    }
    if (block.startsWith('> ')) return `<blockquote class="tg-thesis"><p>&ldquo;${inline(block.slice(2))}&rdquo;</p></blockquote>`;
    if (block.startsWith('- ')) return `<ul>${block.split('\n').map(line => `<li>${inline(line.slice(2))}</li>`).join('')}</ul>`;
    return `<p>${inline(block)}</p>`;
  }).join('\n');
}
const connections = [
  [99, 'Recognizing how another person’s crises can absorb your identity—and how to begin seeing your own choices again.'],
  [114, 'A family dinner shows what it can mean to leave on time and tolerate the discomfort of disapproval.'],
  [23, 'Separating care for someone from responsibility for their happiness.'],
];
export function renderBoundariesGuide(topic, readings) {
  const related = connections.map(([day, reason]) => {
    const reading = readings.find(r => r.day_of_year === day);
    if (!reading) throw new Error(`Boundaries guide: required reflection ${day} is missing`);
    return `<li><a href="${bp(`/${readingSlug(day, reading.title)}/`)}">${escape(reading.title)}</a><p>${reason}</p></li>`;
  }).join('\n');
  const contents = source.slice(source.indexOf('- [Understanding'), source.indexOf('## The Cost')).trim();
  const bodyContent = `
    <nav class="collection-rail" aria-label="Breadcrumb"><div class="collection-rail-inner"><a href="${bp('/guides/')}">&larr; Back to Guides</a><span aria-current="page">Boundaries</span></div></nav>
    <header class="boundary-hero"><div class="boundary-hero-copy"><p class="eyebrow">Guide</p><h1>${title}</h1><p class="boundary-hero-sub">${subtitle}</p></div><img src="${bp('/assets/themes/detachment-with-love.jpg')}" alt="A woman holding a cup on a sunlit porch, with a book and plants beside her." width="1200" height="800" fetchpriority="high"></header>
    <article class="rd-article boundaries-guide">
      <nav class="boundary-contents" aria-labelledby="contents-title"><h2 id="contents-title">In this guide</h2><ul>${contents.split('\n').map(line => `<li>${inline(line.slice(2))}</li>`).join('')}</ul></nav>
      <div class="prose-lora boundary-body">${guideBody()}</div>
      <section class="boundary-related prose-lora" aria-labelledby="related-title"><h2 id="related-title">Keep Reading</h2><ul>
        <li><a href="${bp('/topics/detachment/')}">Detachment Guide</a><p>Explore caring for someone without taking responsibility for their choices or the outcome.</p></li>
        ${related}
      </ul></section>
    </article>
    <dialog class="boundary-dialog" id="boundary-reading-view" aria-labelledby="boundary-dialog-title"><div class="boundary-dialog-toolbar"><button type="button" class="boundary-close" autofocus>Close</button></div><div class="boundary-dialog-content prose-lora"></div></dialog>
    <script src="${bp('/js/boundaries.js')}" defer></script>
    ${terminalBand()}`;
  return wrapInLayout({title: `${title} | Daily Paths`, description: subtitle, canonicalPath: '/topics/boundaries/', bodyContent, bodyClass: 'page-topic-detail page-boundaries', ogType: 'article', navSection: 'guides', hasAppPanel: true})
    .replace('</head>', `<link rel="stylesheet" href="${bp('/css/boundaries.css')}">\n</head>`);
}
