import { readFileSync } from 'node:fs';
import { wrapInLayout } from '../base.mjs';
import { photoHero, terminalBand } from '../ui.mjs';
import { bp } from '../../helpers/config.mjs';
import { readingSlug } from '../../helpers/slug-utils.mjs';
import { TOPIC_THEME_TAGS } from '../../helpers/theme-data.mjs';

// Approved manuscript and insert copy remain independently reviewable source text.
const manuscript = readFileSync(new URL('./surrender.md', import.meta.url), 'utf8');
const inserts = readFileSync(new URL('./surrender-inserts.md', import.meta.url), 'utf8');
const blocks = manuscript.trim().split(/\n\s*\n/);
const title = blocks[0].slice(2);
const subtitle = blocks[1];
const esc = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const anchor = text => text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
const insertSection = name => inserts.split(`## ${name}\n`)[1].split('\n## ')[0];
const rows = name => insertSection(name).split('\n').filter(line => line.startsWith('| ')).slice(2).map(line => line.split('|').slice(1, -1).map(cell => cell.trim()));
const selectedTitles = ['The Terror of Surrender', 'The Silence After Surrender', 'Powerlessness over Others'];

export function renderSurrenderGuide(topic, featuredReadings, readings) {
  const selected = selectedTitles.map(title => {
    const reading = readings.find(r => r.title.toLowerCase() === title.toLowerCase());
    if (!reading) throw new Error(`Surrender: required reflection missing: ${title}`);
    return reading;
  });
  const readingPath = r => bp(`/${readingSlug(r.day_of_year, r.title)}/`);
  function href(url) {
    if (url.startsWith('#')) return url;
    const related = selected.find(r => url.endsWith(`/${readingSlug(r.day_of_year, r.title)}/`));
    if (related) return readingPath(related);
    if (url === 'https://dailypaths.org/') return bp('/reflections/');
    if (url.startsWith('https://daily-paths-soft-daylight.nealw98.chatgpt.site/')) return bp(new URL(url).pathname);
    return url;
  }
  function inline(text) {
    return esc(text).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => `<a href="${esc(href(url))}">${label}</a>`)
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
  }
  function prose(block) {
    const heading = block.match(/^(#{2,3}) (.+)$/);
    if (heading) return `<h${heading[1].length} id="${anchor(heading[2])}">${inline(heading[2])}</h${heading[1].length}>`;
    if (block.startsWith('> ')) return `<blockquote class="tg-thesis"><p>&ldquo;${inline(block.slice(2))}&rdquo;</p></blockquote>`;
    if (block.startsWith('- ')) return `<ul>${block.split('\n').map(line => `<li>${inline(line.slice(2))}</li>`).join('')}</ul>`;
    return `<p>${inline(block)}</p>`;
  }
  const insert = (name, type, content) => `<aside class="surrender-insert surrender-insert--${type}" data-reading-insert aria-labelledby="${type}-title"><h3 id="${type}-title">${name}</h3>${content}</aside>`;
  const principles = insert('Spiritual Principles of Surrender', 'principles', `<dl>${rows('Spiritual Principles of Surrender').map(([name, text]) => `<div><dt>${inline(name)}</dt><dd>${inline(text)}</dd></div>`).join('')}</dl>`);
  const ropeCopy = insertSection('Dropping the Rope');
  const ropeSubtitle = ropeCopy.match(/Subtitle: \*\*(.+)\*\*/)[1];
  const ropeFooter = ropeCopy.match(/Footer: \*(.+)\*/)[1];
  const rope = insert('Dropping the Rope', 'rope', `<p class="surrender-insert-deck">${inline(ropeSubtitle)}</p><div class="rope-headings" aria-hidden="true"><span>When I Keep Pulling</span><span>When I Drop the Rope</span></div><div class="rope-pairs">${rows('Dropping the Rope').map(([left, leftText, right, rightText]) => `<div class="rope-pair"><div><span class="rope-side">When I Keep Pulling</span><h4>${inline(left)}</h4><p>${inline(leftText)}</p></div><div><span class="rope-side">When I Drop the Rope</span><h4>${inline(right)}</h4><p>${inline(rightText)}</p></div></div>`).join('')}</div><p class="surrender-insert-footer"><em>${inline(ropeFooter)}</em></p>`);
  const orbit = `<figure class="surrender-orbit" aria-label="When Life Revolves Around Theirs"><div class="surrender-orbit-art" data-reading-insert><h3 class="visually-hidden">When Life Revolves Around Theirs</h3><img src="${bp('/assets/guides/surrender/life-revolves-around-theirs.png')}" width="1536" height="1024" loading="lazy" alt="My sleep, mood, plans, friendships, and attention orbit around their life at the center." aria-describedby="orbit-transcript"></div><details class="orbit-text"><summary>Read the illustration as text</summary><div id="orbit-transcript"><h4>When Life Revolves Around Theirs</h4><p>At the center: <strong>Their life</strong></p><dl>${rows('When Life Revolves Around Theirs').map(([name, text]) => `<div><dt>${inline(name)}</dt><dd>${inline(text)}</dd></div>`).join('')}</dl><p><em>Their life becomes the center. Your own life waits.</em></p></div></details></figure>`;
  const body = [];
  for (let i = 4; i < blocks.length; i++) {
    const block = blocks[i];
    if (block === '---') {
      const end = blocks.indexOf('---', i + 1);
      if (end < 0) throw new Error('Unclosed manuscript insert');
      const group = blocks.slice(i + 1, end);
      const name = group[0].replaceAll('**', '');
      if (name === 'Spiritual Principles of Surrender') body.push(principles);
      else if (name === 'Before You Pick Up the Rope Again') body.push(insert(name, 'questions', `<div class="surrender-questions">${group[1].split('\n').map(q => `<p>${inline(q.slice(2))}</p>`).join('')}</div>`));
      else if (name === 'The Three Cs') body.push(`<div class="surrender-three-cs"><h4>${name}</h4>${group.slice(1).map(prose).join('')}</div>`);
      else if (name === 'Surrender and Safety') body.push(`<aside class="boundary-insert boundary-insert--safety" aria-labelledby="surrender-safety"><h3 id="surrender-safety">${name}</h3>${group.slice(1).map(prose).join('').replace('<strong>800-799-SAFE (7233)</strong>', '<a href="tel:8007997233"><strong>800-799-SAFE (7233)</strong></a>').replace('<strong>START to 88788</strong>', '<a href="sms:88788"><strong>START to 88788</strong></a>')}</aside>`);
      else throw new Error(`Unknown manuscript insert: ${name}`);
      i = end;
      continue;
    }
    body.push(prose(block));
    if (block.startsWith('The strain can show up')) body.push(orbit);
    if (block.startsWith('Dropping the rope can also mean')) body.push(rope);
  }
  const seen = new Set(selected.map(r => r.day_of_year));
  const wider = [...featuredReadings, ...readings.filter(r => TOPIC_THEME_TAGS.powerlessness.includes(r.secondary_theme))].filter(r => {
    if (seen.has(r.day_of_year)) return false;
    seen.add(r.day_of_year); return true;
  });
  const bodyContent = `<nav class="collection-rail" aria-label="Breadcrumb"><div class="collection-rail-inner"><a href="${bp('/guides/')}">&larr; Back to Guides</a><span aria-current="page">Surrender</span></div></nav>
    ${photoHero({image: bp(`/assets/${topic.image}`), alt: topic.imageAlt, eyebrow: 'Guide', title, subtitle, size: 'lg', titleClass: 'photo-hero-title--theme'})}
    <article class="rd-article boundaries-guide surrender-guide">
      <nav class="boundary-contents" aria-labelledby="contents-title"><h2 id="contents-title">In this guide</h2>${prose(blocks[3])}</nav>
      <div class="prose-lora boundary-body surrender-body">${body.join('\n')}</div>
      <details class="surrender-more"><summary>More reflections on surrender</summary><ul>${wider.map(r => `<li><a href="${readingPath(r)}">${esc(r.title)}</a></li>`).join('')}</ul></details>
    </article>
    <dialog class="boundary-dialog surrender-dialog" id="surrender-reading-view" aria-labelledby="surrender-dialog-title"><div class="boundary-dialog-toolbar"><button type="button" class="boundary-close" autofocus>Close</button></div><div class="boundary-dialog-content prose-lora"></div></dialog>
    <script src="${bp('/js/surrender.js')}" defer></script>${terminalBand()}`;
  return wrapInLayout({title: `${title} | Daily Paths`, description: subtitle, canonicalPath: '/topics/powerlessness/', bodyContent, bodyClass: 'page-topic-detail page-surrender', ogType: 'article', navSection: 'guides', hasAppPanel: true})
    .replace('</head>', `<link rel="stylesheet" href="${bp('/css/boundaries.css')}"><link rel="stylesheet" href="${bp('/css/surrender.css')}">\n</head>`);
}
