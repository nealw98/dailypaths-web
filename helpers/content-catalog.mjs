import { FIRST_MEETING } from './launch-review.mjs';
// Navigation and presentation are independent of the established content URLs.
// These are existing source pages; editorial expansion is tracked in FOUNDATION.md.
export const GUIDES = [
  // About Al-Anon and About the Al-Anon Program were consolidated into Finding
  // Help on September 29 and retired. Both addresses forward here.
  { title: 'Finding Help', path: '/guides/finding-help/', description: 'Recognizing the effects of someone else’s drinking, finding a meeting, and what the program asks of you.' },
  { title: 'The Twelve Steps', path: '/guides/twelve-steps/', image: 'guides/twelve-steps/stone-steps-hero.webp', alt: 'Worn stone steps rise through a leafy garden toward a sunlit opening.', description: 'Key takeaways and core principles for each Step, with links to explore each Step and its daily reflections.' },
  { title: 'Surrender', path: '/guides/surrender/', description: 'Recognizing powerlessness, admitting unmanageability, and practicing the Three C’s.' },
  { title: 'Detachment', path: '/guides/detachment-with-love/', description: 'What it means to care without getting pulled into someone else’s choices.' },
  { title: 'Boundaries', path: '/guides/boundaries/', description: 'Recognizing your limits and making room for your own needs.' },
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
  { title: 'The Stories We Tell Ourselves', path: '/articles/the-stories-we-tell-ourselves/', image: 'articles/honesty-hero.jpg', alt: 'An owl looking ahead with clear, steady eyes', category: 'Knowing yourself', description: 'Fear of rejection, uncertainty, and not being enough can shape the stories we tell ourselves.' },
  { title: 'The Line I Kept Moving', path: '/articles/the-line-i-kept-moving/', image: 'articles/the-line-i-kept-moving/dinner-table-photo.webp', alt: 'A woman with dinner at the table while her adult son prepares another meal in the kitchen', category: 'Personal Story', description: 'Learning to set boundaries with my mother—and to stop disappearing in the effort to earn her love.' },
  VOICES_ARTICLE,
  // Celina R's first-person account. The Story Room owns its title, summary and
  // hero; this seeds the category, which syncCatalog keeps rather than
  // overwriting — without it the card read "Article" like any explanatory piece.
  { title: 'Learning to Trust', path: '/articles/learning-to-trust/', image: 'articles/fellowship-hero.jpg', alt: 'Hands joined in a circle on the grass', category: 'Personal Story', description: 'Learning to trust my father again, and myself, after years of not being able to.' },
];

// Published and reviewed, so it belongs in the catalog on both sides. The Story
// Room supplies the page, its card title, summary and hero either way. What this
// seeds is the category, which syncCatalog keeps rather than overwriting — so the
// card read "Getting started" in the preview and "Article" in production.
ARTICLES.push(FIRST_MEETING);
