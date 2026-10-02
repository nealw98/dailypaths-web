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
    <figcaption>${title}</figcaption>
  </figure>`;
};

export function renderAppPage() {
  const bodyContent = `<div class="app-page">
    <section class="app-intro app-measure" aria-labelledby="app-title">
      <div class="app-intro-copy">
        <p class="app-eyebrow">The Daily Paths app</p>
        <h1 id="app-title">A little time.<br>A daily practice.<br><em>A life of your own.</em></h1>
        <p class="app-lede">When someone else’s drinking takes up so much room, it helps to have a place to come back to yourself.</p>
        <p>Carry Daily Paths with you: a reflection to begin with, a notebook for what’s on your mind, and tools for bringing the program into an ordinary day.</p>
        ${storeBadges({ context: 'app-page' })}
        <p class="app-store-note">Available for iPhone and Android. See your store for current pricing.</p>
        <a class="app-text-link" href="#inside-the-app">Take a look inside</a>
      </div>
      ${screen('01', 'Today’s reading')}
    </section>

    <section class="app-opening app-measure" id="inside-the-app" aria-labelledby="app-opening-title">
      <p class="app-eyebrow">From reading to practice</p>
      <h2 id="app-opening-title">Let a reading become<br>part of your day.</h2>
      <p>The website gives you something to read. The app gives you a place to stay with it. Write down what stood out, take an honest look at a difficult moment, or return in the evening to reflect on your day.</p>
    </section>

    <section class="app-feature app-measure" aria-labelledby="app-notebook-title">
      ${screen('02', 'Journal')}
      <div class="app-feature-copy">
        <p class="app-eyebrow">Make room for your own thoughts</p>
        <h2 id="app-notebook-title">Put it into words.</h2>
        <p>You don’t have to work everything out before you start writing. A few sentences about what happened, what you’re feeling, or what you need can be a place to begin.</p>
        <p>Keep a journal and a gratitude list alongside your readings. Save favorite reflections to return to when you need them.</p>
        <p class="app-margin-note">A place for what you notice.<br>And what you’re beginning to understand.</p>
      </div>
    </section>

    <section class="app-practice-band" aria-labelledby="app-practice-title">
      <div class="app-measure">
        <div class="app-practice-intro"><p class="app-eyebrow">In the middle of living</p><h2 id="app-practice-title">Pause now.<br>Reflect later.</h2><p>Some moments need a pause before you respond. Others make more sense when you look back at the end of the day.</p></div>
        <div class="app-practice-pair">
          <div class="app-practice-item"><h3>When something happens</h3><p>Use Spot Check to look at what happened, what you’re feeling, and your part in it.</p>${screen('03', 'Spot Check')}</div>
          <div class="app-practice-item"><h3>When the day is done</h3><p>Use Nightly Review to reflect on difficult moments and recognize what you did well.</p>${screen('04', 'Nightly Review')}</div>
        </div>
      </div>
    </section>

    <section class="app-feature app-feature--listening app-measure" aria-labelledby="app-listen-title">
      <div class="app-feature-copy"><p class="app-eyebrow">Hear another person’s experience</p><h2 id="app-listen-title">Take the fellowship<br>with you.</h2><p>Listen to Al-Anon speakers sharing their experience in recovery. Stream a recording or download one to listen to later.</p><p>Keep familiar prayers close, and add your own. A few words from someone else—or words you’ve made your own—can help you return to what matters.</p></div>
      ${screen('05', 'Speaker Library')}
    </section>

    <section class="app-practical app-measure" aria-labelledby="app-practical-title">
      <h2 id="app-practical-title">A few things to know</h2>
      <div class="app-practical-grid">
        <div><h3>Your writing is personal.</h3><p>Journal entries and other personal writing stay on your device unless you enable optional backup. Read about storage and backup in our <a href="${bp('/privacy/')}#app">Privacy Policy</a>.</p></div>
        <div><h3>Part of your practice.</h3><p>Daily Paths is an independent project inspired by Al-Anon principles. It isn’t affiliated with Al-Anon Family Groups, and it doesn’t replace meetings, sponsorship, or connection with others.</p></div>
      </div>
    </section>

    <section class="app-download app-measure" id="download" aria-labelledby="app-download-title">
      <p class="app-eyebrow">Daily Paths, wherever you are</p><h2 id="app-download-title">Begin with today.</h2><p>A reading. A few honest words. A moment to bring the focus back to you.</p>
      ${storeBadges({ context: 'app-page' })}
      <p class="app-store-note">Current pricing and device requirements are listed in each store.</p>
      <a class="app-text-link" href="${bp('/support/')}">Questions about the app?</a>
    </section>
  </div>`;
  return wrapInLayout({ title: 'The Daily Paths App — A Daily Recovery Practice', description: 'Bring Al-Anon principles into your day with Daily Paths: daily reflections, a journal, gratitude, Spot Check, Nightly Review, and speaker recordings.', canonicalPath: '/app/', bodyClass: 'page-app', bodyContent }).replace('</head>', `<link rel="stylesheet" href="${bp('/css/app.css')}?v=app-page-2">\n</head>`);
}
