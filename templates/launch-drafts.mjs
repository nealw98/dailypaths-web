import {readFileSync} from 'node:fs';
import {wrapInLayout} from './base.mjs';
import {photoHero, terminalBand} from './ui.mjs';
import {bp} from '../helpers/config.mjs';
import {FIRST_MEETING} from '../helpers/launch-review.mjs';

const escape = value => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const anchor = value => value.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-');
function inline(value) {
  return escape(value).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => `<a href="${href.startsWith('/') ? bp(href) : href}">${label}</a>`)
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>');
}
const drafts = [
  {file:'detachment',path:'/topics/detachment/',label:'Detachment',kind:'Guide',image:'articles/detachment-hero.jpg',alt:'A roe deer watching from the edge of a forest'},
  {file:'finding-help',path:'/guides/finding-help/',label:'Finding Help',kind:'Guide',image:'hero-image.jpg',alt:'A sunlit path through a meadow'},
  {file:'first-meeting',path:FIRST_MEETING.path,label:FIRST_MEETING.title,kind:'Article',image:FIRST_MEETING.image,alt:FIRST_MEETING.alt},
];
export function renderLaunchDrafts() {
  return drafts.map(draft => {
    const source=readFileSync(new URL(`../editorial/launch-review/${draft.file}.md`,import.meta.url),'utf8').trim();
    const [heading,subtitle,...blocks]=source.split(/\n\s*\n/);
    const title=heading.replace(/^# /,'');
    const sections=blocks.filter(b=>b.startsWith('## ')).map(b=>b.slice(3));
    let insert=null;
    const body=blocks.map(block=>{
      if(block.startsWith(':::')) {
        if(block===':::') {insert=null;return '</aside>';}
        const match=block.match(/^:::(insert|safety) (.+)$/);
        if(!match) throw Error(`Unknown draft insert: ${block}`);
        insert=match[1];return `<aside class="launch-insert${insert==='safety'?' launch-safety':''}" aria-labelledby="${anchor(match[2])}"><h3 id="${anchor(match[2])}">${inline(match[2])}</h3>`;
      }
      if(block.startsWith('## '))return `<h2 id="${anchor(block.slice(3))}">${inline(block.slice(3))}</h2>`;
      if(block.startsWith('### '))return `<h3 id="${anchor(block.slice(4))}">${inline(block.slice(4))}</h3>`;
      if(block.startsWith('> '))return `<blockquote class="tg-thesis"><p>“${inline(block.slice(2))}”</p></blockquote>`;
      return `<p${insert==='safety'&&block.startsWith('For support')?' class="launch-safety-contacts"':''}>${inline(block)}</p>`;
    }).join('\n');
    if(insert)throw Error('Unclosed draft insert');
    const collection=draft.kind==='Guide'?'guides':'articles';
    const html=wrapInLayout({title:`${title} | Daily Paths`,description:subtitle,canonicalPath:draft.path,
      bodyClass:`page-topic-detail page-launch-draft ${draft.kind==='Guide'?'content-guide':'content-article'}`,navSection:collection,hasAppPanel:true,ogType:'article',
      bodyContent:`<nav class="collection-rail" aria-label="Breadcrumb"><div class="collection-rail-inner"><a href="${bp('/'+collection+'/')}">&larr; Back to ${draft.kind}s</a><span aria-current="page">${draft.label}</span></div></nav>
      <div class="launch-review-note" role="note"><strong>Placeholder content</strong><span>This page contains placeholder content. Neal will write the article or guide before launch.</span></div>
      ${photoHero({image:bp('/assets/'+draft.image),alt:draft.alt,eyebrow:draft.kind,title,subtitle,size:'lg',titleClass:'photo-hero-title--theme'})}
      <article class="rd-article launch-draft boundaries-guide"><nav class="boundary-contents" aria-labelledby="contents-title"><h2 id="contents-title">In this ${draft.kind.toLowerCase()}</h2><ul>${sections.map(s=>`<li><a href="#${anchor(s)}">${inline(s)}</a></li>`).join('')}</ul></nav><div class="prose-reading boundary-body">${body}</div><section id="readings" class="launch-daily-practice"><h2>Return to your daily practice</h2><p><a href="${bp('/reflections/')}">Explore Daily Reflections</a> for a moment to read, reflect, and turn your attention to today.</p></section></article>${terminalBand()}`
    }).replace('</head>',`<link rel="stylesheet" href="${bp('/css/boundaries.css')}"><link rel="stylesheet" href="${bp('/css/launch-review.css')}"></head>`);
    return {path:draft.path,html};
  });
}
