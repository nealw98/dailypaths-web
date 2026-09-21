import { IS_PREVIEW } from './config.mjs';
import { FIRST_MEETING } from './launch-review.mjs';
// Navigation and presentation are independent of the established content URLs.
// These are existing source pages; editorial expansion is tracked in FOUNDATION.md.
export const GUIDES = [
  { title: 'Surrender', path: '/topics/powerlessness/', description: 'Recognizing powerlessness, admitting unmanageability, and practicing the Three C’s.' },
  { title: 'Detachment', path: '/topics/detachment/', description: 'What it means to care without getting pulled into someone else’s choices.' },
  { title: 'Boundaries', path: '/topics/boundaries/', description: 'Recognizing your limits and making room for your own needs.' },
  { title: 'One Day at a Time', path: '/topics/one-day-at-a-time/', description: 'Meeting today without carrying all of tomorrow.' },
  { title: 'Finding Yourself', path: '/topics/self-worth/', description: 'Reconnecting with the person you are beyond someone else’s drinking.' },
  { title: 'Finding Support', path: '/about-alanon/', description: 'An introduction to Al-Anon and finding people who understand.' },
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
  { title: 'Letting Go: Caring Without Carrying', path: '/topics/letting-go/', image: 'articles/letting-go-hero.jpg', alt: 'A woman pauses during a phone call at her dining table in warm evening light', category: 'Letting go', description: 'Recognizing what is yours to handle—and what you can begin to put down.' },
  { title: 'Gratitude & Hope', path: '/topics/gratitude-and-hope/', image: 'articles/gratitude-and-hope-hero.jpg', alt: 'A quiet moment of natural light', category: 'Everyday perspective', description: 'Making space for what is still good, even when life feels uncertain.' },
  { title: 'Honesty', path: '/topics/honesty/', image: 'articles/honesty-hero.jpg', alt: 'A moment of quiet reflection', category: 'Knowing yourself', description: 'Beginning with the truth about how things are—and how you feel.' },
  { title: 'The Line I Kept Moving', path: '/articles/the-line-i-kept-moving/', image: 'articles/the-line-i-kept-moving/dinner-table-photo.webp', alt: 'A woman with dinner at the table while her adult son prepares another meal in the kitchen', category: 'Personal story · Jeff J.', description: 'Learning to set boundaries with my mother—and to stop disappearing in the effort to earn her love.' },
  VOICES_ARTICLE,
];

if (IS_PREVIEW) ARTICLES.push(FIRST_MEETING);
