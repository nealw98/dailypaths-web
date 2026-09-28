import { FIRST_MEETING } from './launch-review.mjs';
// Navigation and presentation are independent of the established content URLs.
// These are existing source pages; editorial expansion is tracked in FOUNDATION.md.
export const GUIDES = [
  { title: 'Surrender', path: '/guides/surrender/', description: 'Recognizing powerlessness, admitting unmanageability, and practicing the Three C’s.' },
  { title: 'Detachment', path: '/guides/detachment-with-love/', description: 'What it means to care without getting pulled into someone else’s choices.' },
  { title: 'Boundaries', path: '/guides/boundaries/', description: 'Recognizing your limits and making room for your own needs.' },
  { title: 'About Al-Anon', path: '/guides/about-alanon/', description: 'What Al-Anon is, how the program works, and whether it might be for you.' },
  { title: 'Finding Support', path: '/guides/finding-help/', description: 'An introduction to Al-Anon and finding people who understand.' },
];

export const VOICES_ARTICLE = {
  "title": "Voices from the Grave",
  "path": "/articles/voices-from-the-grave/",
  "image": "articles/voices-from-the-grave/voices-from-the-grave-hero.webp",
  "alt": "A vintage telephone with its receiver off the hook beside old family photographs and letters.",
  "category": "Finding your voice",
  "description": "Old family rules can follow you into adult relationships. Explore how Al-Anon helps you release their authority, find your voice, and live in the present."
};

export const ARTICLES = [
  { title: 'Letting Go: Caring Without Carrying', path: '/articles/letting-go/', image: 'articles/letting-go-tightrope.webp', alt: 'A tightrope walker balances above a circus ring, viewed from overhead', category: 'Letting go', description: 'Recognizing what is yours to handle—and what you can begin to put down.' },
  // Reclassified as articles. Their addresses are unchanged: classification is
  // free to move, URLs are not (AGENTS.md). Both follow their titles to
  // /articles/… once the rewrites settle, as the five moved themes did.
  { title: 'One Day at a Time', path: '/topics/one-day-at-a-time/', image: 'articles/one-day-at-a-time-hero.jpg', alt: 'A quiet lake at sunset with a resting canoe', category: 'Everyday perspective', description: 'Meeting today without carrying all of tomorrow.' },
  { title: 'Who Am I Behind the Mask', path: '/articles/who-am-i-behind-the-mask/', image: 'articles/self-worth-hero.jpg', alt: 'Walking through a golden wheat field in the sun', category: 'Knowing yourself', description: 'Reconnecting with the person you are beyond someone else’s drinking.' },
  { title: 'Gratitude & Hope', path: '/topics/gratitude-and-hope/', image: 'articles/gratitude-and-hope-hero.jpg', alt: 'A quiet moment of natural light', category: 'Everyday perspective', description: 'Making space for what is still good, even when life feels uncertain.' },
  { title: 'Honesty', path: '/articles/the-stories-we-tell-ourselves/', image: 'articles/honesty-hero.jpg', alt: 'A moment of quiet reflection', category: 'Knowing yourself', description: 'Beginning with the truth about how things are—and how you feel.' },
  { title: 'The Line I Kept Moving', path: '/articles/the-line-i-kept-moving/', image: 'articles/the-line-i-kept-moving/dinner-table-photo.webp', alt: 'A woman with dinner at the table while her adult son prepares another meal in the kitchen', category: 'Personal Story', description: 'Learning to set boundaries with my mother—and to stop disappearing in the effort to earn her love.' },
  VOICES_ARTICLE,
];

// Published and reviewed, so it belongs in the catalog on both sides. The Story
// Room supplies the page, its card title, summary and hero either way. What this
// seeds is the category, which syncCatalog keeps rather than overwriting — so the
// card read "Getting started" in the preview and "Article" in production.
ARTICLES.push(FIRST_MEETING);
