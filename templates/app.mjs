import { wrapInLayout } from './base.mjs';
import { bp } from '../helpers/config.mjs';
import { storeBadges } from './ui.mjs';

const screens = {
  '01': ['daily-reading', 'A daily reflection with its date, title, and reading text'],
  '02': ['journal', 'The journal screen with space to write a personal entry'],
  '03': ['spot-check', 'Spot Check prompts for what happened and how you feel'],
  '04': ['nightly-review', 'Nightly Review questions for reflecting on the day'],
  '05': ['speaker-library', 'Speaker recordings with listening and download controls'],
};
const screen = (number, title) => {
  const [file, alt] = screens[number];
  return `<figure class="app-screen">
    <img class="app-screen-image" src="${bp(`/assets/Screenshots/app/${file}.png`)}" alt="${alt}" width="944" height="2048" loading="${number === '01' ? 'eager' : 'lazy'}" decoding="async">
  </figure>`;
};

const features = [
  ['01', 'Daily Reflections', 'Read each day’s reflection and consider how it applies to your own life. Save favorite readings to return to later.'],
  ['02', 'Journal', 'Write about what’s on your mind, respond to a reading, or record something from your day. Keep a gratitude list alongside your journal entries.'],
  ['03', 'Spot Check', 'Use guided prompts to look at a difficult moment. Record what happened, how you’re feeling, and your part in the situation.'],
  ['04', 'Nightly Review', 'Look back over your day with a series of questions. Reflect on difficult moments and recognize what you did well.'],
  ['05', 'Speaker Library', 'Listen to Al-Anon speakers sharing their experience in recovery. Stream a recording or download it to listen to later.'],
];

export function renderAppPage() {
  const bodyContent = `<div class="app-page">
    <section class="app-intro app-measure" aria-labelledby="app-title">
      <h1 id="app-title">The Daily Paths app</h1>
      <p class="app-lede">Daily reflections and tools for practicing Al-Anon principles throughout the day.</p>
      ${storeBadges({ context: 'app-page' })}
      <p class="app-store-note">For iPhone and Android. See the stores for current pricing.</p>
    </section>
    <div class="app-measure" id="inside-the-app">
      ${features.map(([number, title, description]) => `<section class="app-feature" aria-labelledby="app-feature-${number}">
        ${screen(number, title)}
        <div class="app-feature-copy"><h2 id="app-feature-${number}">${title}</h2><p>${description}</p></div>
      </section>`).join('')}
      <p class="app-extras"><strong>Also included:</strong> familiar prayers and space to add your own.</p>
    </div>
    <section class="app-practical app-measure" aria-label="Practical information">
      <div><h2>Privacy</h2><p>Read about personal writing, storage, and optional backup in our <a href="${bp('/privacy/')}#app">Privacy Policy</a>.</p></div>
      <div><h2>About Daily Paths</h2><p>An independent project inspired by Al-Anon principles. It isn’t affiliated with Al-Anon Family Groups.</p></div>
    </section>
    <section class="app-download app-measure" id="download" aria-label="Download Daily Paths">
      <p>Download Daily Paths</p>
      ${storeBadges({ context: 'app-page' })}
      <a class="app-text-link" href="${bp('/support/')}">App support</a>
    </section>
  </div>`;
  return wrapInLayout({ title: 'The Daily Paths App — Features', description: 'Explore the Daily Paths app: daily reflections, a journal, gratitude, Spot Check, Nightly Review, and Al-Anon speaker recordings.', canonicalPath: '/app/', bodyClass: 'page-app', bodyContent }).replace('</head>', `<link rel="stylesheet" href="${bp('/css/app.css')}?v=app-page-3">\n</head>`);
}
