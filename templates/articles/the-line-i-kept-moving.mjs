import { wrapInLayout } from '../base.mjs';
import { photoHero, terminalBand } from '../ui.mjs';
import { bp, BASE_URL } from '../../helpers/config.mjs';
import { readingSlug } from '../../helpers/slug-utils.mjs';

export const STORY = {
  title: 'The Line I Kept Moving',
  path: '/articles/the-line-i-kept-moving/',
  author: 'Jeff J.',
  description: 'I thought boundaries meant cutting my mother out of my life. In Al-Anon, I began learning where she stopped and I began.',
  readings: [
    { day: 114, reason: 'Letting someone be disappointed without giving up your own needs.' },
    { day: 180, reason: 'Recognizing when giving support has become giving more than you can sustain.' },
    { day: 353, reason: 'Learning to include yourself in the care you give.' },
  ],
  related: [
    { title: 'Boundaries', kind: 'Guide', path: '/topics/boundaries/', description: 'Recognizing your limits and making room for your own needs.' },
    { title: 'Finding Yourself', kind: 'Guide', path: '/topics/self-worth/', description: 'Reconnecting with the person you are beyond someone else’s drinking.' },
    { title: 'Letting Go: Caring Without Carrying', kind: 'Article', path: '/topics/letting-go/', description: 'Caring about someone without taking responsibility for every outcome.' },
    { title: 'Voices from the Grave', kind: 'Personal story', status: 'pending', plannedPath: '/articles/voices-from-the-grave/', description: 'More from Jeff J. on the influence a parent can have long after they’re gone.' },
    { title: 'The Power of Saying No', kind: 'Article', status: 'pending', plannedPath: '/articles/the-power-of-saying-no/', description: 'Saying no, facing guilt, and allowing your answer to stand.' },
  ],
};

// Contributor narrative is edited from Jeff J.’s supplied submission. The
// reflection insert is accompanying editorial copy approved separately by Neal.
const sections = [
  { body: [
    'One of the first things I learned in Al-Anon was about boundaries. I had none.',
    'I thought setting a boundary with the alcoholic meant cutting them out of your life completely. It seemed like a harsh form of amputation. In Al-Anon, I learned that a boundary is where they stop and I begin.',
    'Living with my mother was easy at first. I thought that was how our relationship was supposed to be. I did everything possible to make her comfortable and safe, giving her what she needed when she asked. I thought I was demonstrating my love for her.',
    'I didn’t realize she had a problem until years later. By then, I was exhausted and worn down to the point that it felt as though there was nothing left of me. Mentally, I was confused, always trying to figure out why things didn’t work. Physically, I felt worn out, too.',
  ] },
  { heading: 'The line kept moving', body: [
    'I can’t count how many times I said to myself, “This is the last time I’m going to do this for her.” Or, “If she does that or says that one more time, I will leave. I’ve had enough.”',
    'I told her I couldn’t go through another rejection or being shut out again. But I always went back because I loved her.',
    'The boundaries I tried to set never lasted. Somehow, they got lost in my thinking: “Can’t she see everything I’m doing for her and just love me?”',
  ] },
  { pullQuote: 'Can’t she see everything I’m doing for her and just love me?' },
  { body: [
    'The red line in the sand I had drawn was always moved just a little further back. I was the one paying the price. She kept doing what she wanted, and I was disappearing more and more.',
  ] },
  { heading: 'I mattered, too', body: [
    'Then I found Al-Anon and started going like my life depended on it. I didn’t understand at the time how much I needed some kind of intervention. Al-Anon did that for me.',
    'After several months, I started to realize that I was just as important as she was, but I was acting and living my life like I didn’t matter.',
    'Setting boundaries became a way to show myself that I cared about myself. I started learning how to tell her no and mean it.',
  ] },
  { heading: 'One dinner was enough', body: [
    'If I fixed a meal and she didn’t want it, I wasn’t going to run out, get something else, and fix that instead. She could get her own dinner. This was what I had made; she could eat it or not.',
    'I began learning that I didn’t have to feel hurt by her choice or think I was a bad person because I hadn’t made something else.',
    'Probably most important for me was learning to set limits when she told me I was worthless or didn’t love her—that if I did love her, I would do this or that for her. Through boundaries, I began learning that I could protect myself from that kind of treatment.',
  ] },
  { heading: 'A pattern I didn’t want to repeat', body: [
    'Boundaries are tools I use almost every day. It feels good to be able to say no and mean it. The more I practiced, the freer I started to feel inside.',
    'Without Al-Anon, the steps, and the fellowship of the people I met, I would still be stuck. My life might look the same—not necessarily with my mom, but in another relationship. The cycle would continue.',
    'Al-Anon helped me begin to break that cycle. Boundaries are a major part of that help.',
  ] },
];

export const TAKEAWAYS = [
  { title: 'I don’t have to keep proving I’m worth loving.', body: 'Caring for someone can become a bargain we barely recognize: if I do enough, perhaps they will finally love me.', question: 'What am I hoping this person will give me if I keep doing more?' },
  { title: '“This is the last time” needs to mean something to me.', body: '“This is the last time” expresses frustration. A boundary becomes meaningful when we decide what we will do the next time and follow through.', question: 'What is one thing I’m ready to do differently next time?' },
  { title: "Their disappointment doesn't mean I've done something wrong.", body: 'When she said I didn’t love her, I wanted to convince her that I did. I was learning that I could care about her without doing everything she asked.', question: 'When someone questions my love, do I feel I have to change my answer?' },
  { title: 'I don’t want to lose myself like this again.', body: 'I began to see that I could carry these same habits into another relationship. Learning to recognize them mattered beyond my relationship with my mother.', question: 'Where else am I saying yes when I’m already worn out?' },
];
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function renderLineIKeptMoving(allReadings) {
  const flow = sections.map(section => section.pullQuote
    ? `<blockquote class="tg-thesis"><p>“${esc(section.pullQuote)}”</p></blockquote>`
    : `<section class="tg-section">${section.heading ? `<h2>${esc(section.heading)}</h2>` : ''}<div class="prose-lora">${section.body.map(p => `<p>${esc(p)}</p>`).join('')}</div></section>`).join('');
  const readings = STORY.readings.map(item => {
    const reading = allReadings.find(r => r.day_of_year === item.day);
    if (!reading) throw new Error(`Jeff J. article: missing related reading ${item.day}`);
    return `<article><p class="sd-kicker">${esc(reading.display_date)}</p><h3><a href="${bp('/' + readingSlug(reading.day_of_year, reading.title) + '/')}">${esc(reading.title)}</a></h3><p>${esc(item.reason)}</p></article>`;
  }).join('');
  const transcript = TAKEAWAYS.map((item, index) => `<section><h3>${index + 1}. ${esc(item.title)}</h3><p>${esc(item.body)}</p><p><em>${esc(item.question)}</em></p></section>`).join('');
  const related = STORY.related.map(item => `<article><p class="sd-kicker">${esc(item.kind)}${item.status === 'pending' ? ' · Coming soon' : ''}</p><h3>${item.path ? `<a href="${bp(item.path)}">${esc(item.title)}</a>` : esc(item.title)}</h3><p>${esc(item.description)}</p></article>`).join('');
  return wrapInLayout({
    title: `${STORY.title} — A Personal Story by Jeff J. | Daily Paths`,
    description: STORY.description, canonicalPath: STORY.path,
    bodyClass: 'page-topic-detail page-personal-story', navSection: 'articles', ogType: 'article', hasAppPanel: true,
    structuredData: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Article', headline: STORY.title,
      description: STORY.description, author: { '@type': 'Person', name: STORY.author },
      publisher: { '@type': 'Organization', name: 'Daily Paths' },
      mainEntityOfPage: BASE_URL + STORY.path,
    }),
    bodyContent: `<nav class="collection-rail" aria-label="Breadcrumb"><div class="collection-rail-inner"><a href="${bp('/articles/')}">&larr; Back to Articles</a><span aria-current="page">${STORY.title}</span></div></nav>
${photoHero({ image: bp('/assets/articles/the-line-i-kept-moving/dinner-table-photo.webp'), alt: 'A woman seated at the dinner table with a plate of food while her adult son cooks another meal in the kitchen behind her.', eyebrow: 'Personal story · Boundaries', title: STORY.title, subtitle: STORY.description, size: 'lg', titleClass: 'photo-hero-title--theme' })}
<article class="rd-article tg-article"><p class="story-byline">By Jeff J.</p>${flow}
<figure class="tg-diagram story-reflection-insert"><img src="${bp('/assets/articles/the-line-i-kept-moving/reflection-insert-editorial.png')}" alt="Four reflections on boundaries and self-worth. Complete text follows." width="1086" height="1448" loading="lazy"><figcaption class="story-insert-caption">Questions to consider alongside Jeff’s story.</figcaption><details class="story-insert-text"><summary>Read the reflection text</summary><h2>A moment to reflect</h2>${transcript}</details></figure></article>
<section class="wrap section--lg story-connections" aria-labelledby="story-readings"><h2 id="story-readings">Related daily readings</h2><div class="story-reading-links">${readings}</div></section>
<section class="wrap section--md story-connections" aria-labelledby="story-related"><h2 id="story-related">Keep exploring</h2><div class="story-related-links">${related}</div></section>
${terminalBand()}`,
  });
}
