import { wrapInLayout } from './base.mjs';
import { bp } from '../helpers/config.mjs';

export function renderPrayersPage() {
  const prayers = [
    {
      id: 'just-for-today',
      title: 'Just for Today',
      paragraphs: [
        'Just for today I will try to live through this day only, and not tackle my whole life problem at once.',
        'Just for today I will be happy. This assumes to be true what Abraham Lincoln said, that &ldquo;most folks are as happy as they make up their minds to be.&rdquo;',
        'Just for today I will adjust myself to what is and not try to adjust everything to my own desires.',
        'Just for today I will try to strengthen my mind. I will study. I will learn something useful. I will not be a mental loafer. I will read something that requires effort, thought, and concentration.',
        'Just for today I will exercise my soul in three ways: I will do somebody a good turn and not get found out. I will do at least two things I don&rsquo;t want to do, just for exercise.',
        'Just for today I will be agreeable. I will look as well as I can, dress becomingly, talk low, act courteously, criticize not one bit, not find fault with anything, and not try to improve or regulate anybody except myself.',
        'Just for today I will have a program. I may not follow it exactly, but I will have it. I will save myself from two pests: hurry and indecision.',
        'Just for today I will have a quiet half hour all by myself and relax. During this half hour, sometime, I will try to get a better perspective of my life.',
        'Just for today I will be unafraid. Especially I will not be afraid to enjoy what is beautiful and to believe that as I give to the world, so the world will give to me.',
      ],
    },
    {
      id: 'serenity',
      title: 'Serenity Prayer',
      lines: [
        'God, grant me the serenity',
        'to accept the things I cannot change,',
        'courage to change the things I can,',
        'and wisdom to know the difference.',
      ],
      source: 'Reinhold Niebuhr',
    },
    {
      id: 'st-francis',
      title: 'Prayer of St. Francis',
      sections: [
        {
          lines: [
            'Make me an instrument of your peace.',
            'Where there is hatred, let me bring love.',
            'Where there is offense, let me bring pardon.',
            'Where there is discord, let me bring union.',
            'Where there is error, let me bring truth.',
            'Where there is doubt, let me bring faith.',
            'Where there is despair, let me bring hope.',
            'Where there is darkness, let me bring your light.',
            'Where there is sadness, let me bring joy.',
          ],
        },
        {
          text: 'Let me not seek so much to be consoled as to console, to be understood as to understand, to be loved as to love.',
        },
        {
          text: 'For it is in giving that we receive, it is in pardoning that we are pardoned, and it is in surrendering that we find new life.',
        },
      ],
      source: 'Adapted from St. Francis of Assisi',
    },
    {
      id: 'third-step',
      title: 'Third Step Prayer',
      paragraphs: [
        'God, I offer myself to Thee &mdash; to build with me and to do with me as Thou wilt. Relieve me of the bondage of self, that I may better do Thy will. Take away my difficulties, that victory over them may bear witness to those I would help of Thy Power, Thy Love, and Thy Way of life. May I do Thy will always!',
        'Amen.',
      ],
    },
    {
      id: 'seventh-step',
      title: 'Seventh Step Prayer',
      paragraphs: [
        'My Creator, I am now willing that you should have all of me, good and bad. I pray that you now remove from me every single defect of character which stands in the way of my usefulness to you and my fellows. Grant me strength, as I go out from here, to do your bidding.',
        'Amen.',
      ],
    },
    {
      id: 'let-go',
      title: 'Let Go and Let God',
      paragraphs: [
        'To &ldquo;let go&rdquo; does not mean to stop caring, it means I can&rsquo;t do it for someone else.',
        'To &ldquo;let go&rdquo; is not to cut myself off, it&rsquo;s the realization I can&rsquo;t control another.',
        'To &ldquo;let go&rdquo; is not to enable, but to allow learning from natural consequences.',
        'To &ldquo;let go&rdquo; is to admit powerlessness, which means the outcome is not in my hands.',
        'To &ldquo;let go&rdquo; is not to try to change or blame another, it&rsquo;s to make the most of myself.',
        'To &ldquo;let go&rdquo; is not to care for, but to care about.',
        'To &ldquo;let go&rdquo; is not to fix, but to be supportive.',
        'To &ldquo;let go&rdquo; is not to judge, but to allow another to be a human being.',
        'To &ldquo;let go&rdquo; is not to be in the middle arranging all the outcomes, but to allow others to affect their own destinies.',
        'To &ldquo;let go&rdquo; is not to deny, but to accept.',
        'To &ldquo;let go&rdquo; is not to nag, scold, or argue, but instead to search out my own shortcomings and correct them.',
        'To &ldquo;let go&rdquo; is not to criticize and regulate anybody, but to try to become what I dream I can be.',
        'To &ldquo;let go&rdquo; is to fear less and to love more.',
      ],
    },
    {
      id: 'just-for-tonight',
      title: 'Just for Tonight',
      paragraphs: [
        'Just for tonight, I will be grateful. I will give thanks for the past day &mdash; its failures as well as its successes, its sadness as well as its joy and its pain as well as its pleasure. I will take comfort in knowing that every event and circumstance that occurred today can be used for my good and the good of others.',
        'Just for tonight, I will accept that I have done the best I could, remembering that my goal is spiritual progress and not perfection. I will let go of any expectation I had for this day, as well as any disappointment, shame or guilt I felt for not being perfect today.',
        'Just for tonight, I will be humble. I will give my shortcomings to a Power greater than myself, trusting that doing so can bring about changes in me that I could not bring about by myself.',
        'Just for tonight, I will not attempt to rectify today&rsquo;s mistakes or solve tomorrow&rsquo;s problems. I will remind myself that I am better able to receive guidance when my mind and body are rested and refreshed.',
        'Just for tonight, I will set aside my fears, frustrations and aspirations and take a few minutes to review the abundance that exists in my life today. I will place my future in the care of a loving God of my own understanding, trusting my needs will be met at a time and in a way that is best for all concerned.',
      ],
    },
  ];

  function renderPrayer(prayer) {
    let bodyHtml = '';

    if (prayer.lines) {
      // Single stanza poem-style (Serenity Prayer)
      bodyHtml = `<div class="prayer-text prayer-verse">
              ${prayer.lines.map(l => `<p class="verse-line">${l}</p>`).join('\n              ')}
            </div>`;
    } else if (prayer.sections) {
      // Multi-section with lines and paragraphs (St. Francis)
      bodyHtml = prayer.sections.map(section => {
        if (section.lines) {
          return `<div class="prayer-text prayer-verse">
              ${section.lines.map(l => `<p class="verse-line">${l}</p>`).join('\n              ')}
            </div>`;
        }
        return `<p class="prayer-text">${section.text}</p>`;
      }).join('\n            ');
    } else if (prayer.paragraphs) {
      // Paragraph-style
      bodyHtml = prayer.paragraphs.map(p =>
        `<p class="prayer-text">${p}</p>`
      ).join('\n            ');
    }

    const sourceHtml = prayer.source
      ? `\n            <p class="prayer-source">&mdash; ${prayer.source}</p>`
      : '';

    return `
          <details class="prayer-item" id="${prayer.id}">
            <summary class="prayer-title">${prayer.title}</summary>
            <div class="prayer-body">
            ${bodyHtml}${sourceHtml}
            </div>
          </details>`;
  }

  // Serenity Prayer gets featured treatment
  const serenity = prayers.find(p => p.id === 'serenity');
  const otherPrayers = prayers.filter(p => p.id !== 'serenity');
  const prayerCards = otherPrayers.map(renderPrayer).join('\n');

  const bodyContent = `
      <!-- Hero -->
      <header class="pr-hero">
        <div class="pr-hero-image">
          <img src="${bp('/assets/themes/prayers.jpg')}" alt="Prayers and Meditations" />
          <div class="pr-hero-overlay"></div>
        </div>
        <div class="pr-hero-content">
          <span class="pr-hero-label">Recovery Resources</span>
          <h1 class="pr-hero-title">Prayers &amp; Meditations</h1>
          <p class="pr-hero-desc">Words that have carried countless members through their darkest hours and brightest mornings.</p>
        </div>
      </header>

      <!-- Featured: Serenity Prayer -->
      <div class="pr-featured-wrap">
        <div class="pr-featured">
          <span class="pr-featured-label">The Foundation</span>
          <h2 class="pr-featured-title">${serenity.title}</h2>
          <div class="pr-featured-verse">
            ${serenity.lines.map(l => `<p>${l}</p>`).join('\n            ')}
          </div>
          <p class="pr-featured-source">&mdash; ${serenity.source}</p>
        </div>
      </div>

      <!-- App Promo -->
      <div class="pr-app-wrap">
        <aside class="pr-app-callout">
          <p class="pr-app-text">With the <strong>Al-Anon Daily Paths</strong> app, you can carry these prayers with you wherever you go. Use them when you need them most.</p>
          <div class="pr-app-badges">
            <a href="https://apps.apple.com/app/id6755981862" target="_blank" rel="noopener noreferrer">
              <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="Download on the App Store" class="pr-app-badge">
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.dailypaths" target="_blank" rel="noopener noreferrer">
              <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" class="pr-app-badge pr-app-badge-play">
            </a>
          </div>
        </aside>
      </div>

      <!-- Prayer Cards -->
      <div class="pr-list-wrap">
        <h2 class="pr-list-heading">More Prayers &amp; Reflections</h2>
        <p class="pr-list-intro">Tap any prayer to read it.</p>
        <div class="prayer-list">
${prayerCards}
        </div>
      </div>`;

  return wrapInLayout({
    title: 'Al-Anon Recovery Prayers & Meditations | Al-Anon Daily Paths',
    description: 'Read prayers commonly used in Al-Anon recovery including the Serenity Prayer, Just for Today, Prayer of St. Francis, Third Step Prayer, and more.',
    canonicalPath: '/prayers/',
    bodyContent,
    bodyClass: 'page-prayers',
  });
}
