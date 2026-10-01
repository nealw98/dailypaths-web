import { readFileSync } from 'node:fs';
import { wrapInLayout } from '../base.mjs';
import { terminalBand, hubIntro } from '../ui.mjs';
import { STEPS } from '../steps.mjs';
import { bp } from '../../helpers/config.mjs';
import { stepRecordSlug } from '../../helpers/slug-utils.mjs';

export const TWELVE_STEPS_PATH = '/guides/twelve-steps/';
const TITLE = 'The Twelve Steps of Al-Anon';
// PLACEHOLDER intro — not approved launch copy. The Step cards below reuse the
// existing "12 Steps at a glance" key takeaways (helpers/steps-glance.json).
const SUBTITLE = 'Key takeaways and core principles for each Step, with a longer essay and a collection of daily reflections for every one.';
const INTRO = 'The Twelve Steps are the heart of the Al-Anon program. You do not have to take them in order, or all at once. Each card below summarizes one Step; read the essay for more, or go straight to the reflections gathered under it.';

const WORDS = ['One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve'];
const glance = JSON.parse(readFileSync(new URL('../../helpers/steps-glance.json', import.meta.url), 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function card(item) {
  const step = STEPS.find(s => s.number === item.number);
  const word = WORDS[item.number - 1];
  const points = item.points.map(p => {
    const i = p.indexOf(':');
    return `<li><strong>${esc(p.slice(0, i + 1))}</strong> ${esc(p.slice(i + 1).trim())}</li>`;
  }).join('');
  return `<article class="ts-card" aria-labelledby="ts-step-${item.number}">
      <h2 id="ts-step-${item.number}"><span class="ts-eyebrow">Step ${word}</span><span class="visually-hidden">: </span>${esc(item.title)}</h2>
      <p class="ts-principle"><span>Core principle</span> ${esc(item.principle)}</p>
      <ul>${points}</ul>
      <p class="ts-links"><a href="${bp(`/steps/${stepRecordSlug(step)}/`)}">Read the Step ${word} essay <span aria-hidden="true">&rarr;</span></a><a href="${bp(`/months/${step.monthSlug}/`)}">Step ${word} reflections <span aria-hidden="true">&rarr;</span></a></p>
    </article>`;
}

export function renderTwelveStepsGuide() {
  const bodyContent = `
    <nav class="collection-rail" aria-label="Breadcrumb"><div class="collection-rail-inner"><a href="${bp('/guides/')}">&larr; Back to Guides</a><span aria-current="page">The Twelve Steps</span></div></nav>
    ${hubIntro({ eyebrow: 'Guide', title: TITLE, subtitle: SUBTITLE, id: 'twelve-steps-title' })}
    <section class="ts-list sd-wrap" aria-label="The Twelve Steps">
      <p class="ts-intro">${INTRO}</p>
      ${glance.map(card).join('\n')}
    </section>
    ${terminalBand()}`;
  return wrapInLayout({
    title: `${TITLE} | Daily Paths`,
    description: 'A guide to the Twelve Steps of Al-Anon: key takeaways and core principles for each Step, with an essay and daily reflections for every one.',
    canonicalPath: TWELVE_STEPS_PATH,
    bodyContent,
    bodyClass: 'page-editorial page-twelve-steps',
    ogType: 'article',
    navSection: 'guides',
    hasAppPanel: true,
  });
}
