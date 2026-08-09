import { wrapInLayout } from './base.mjs';
import { bp, BASE_URL } from '../helpers/config.mjs';
import { photoHero, pill, appPanel, ripple } from './ui.mjs';

/**
 * Recovery Essentials.
 *
 * The long readings sit in a 900px column of white cards, set in full — the
 * prototype excerpted them to 3–4 lines and offered a "read the whole passage"
 * link; with the full text on the page that affordance is gone.
 *
 * The prayers move into a full-bleed teal band with the ripple motif.
 */
export function renderEssentialsPage() {
  const readings = [
    {
      id: 'just-for-today',
      title: 'Just for Today',
      note: 'Nine reflections',
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
      id: 'just-for-tonight',
      title: 'Just for Tonight',
      note: 'Five reflections',
      paragraphs: [
        'Just for tonight, I will be grateful. I will give thanks for the past day &mdash; its failures as well as its successes, its sadness as well as its joy and its pain as well as its pleasure. I will take comfort in knowing that every event and circumstance that occurred today can be used for my good and the good of others.',
        'Just for tonight, I will accept that I have done the best I could, remembering that my goal is spiritual progress and not perfection. I will let go of any expectation I had for this day, as well as any disappointment, shame or guilt I felt for not being perfect today.',
        'Just for tonight, I will be humble. I will give my shortcomings to a Power greater than myself, trusting that doing so can bring about changes in me that I could not bring about by myself.',
        'Just for tonight, I will not attempt to rectify today&rsquo;s mistakes or solve tomorrow&rsquo;s problems. I will remind myself that I am better able to receive guidance when my mind and body are rested and refreshed.',
        'Just for tonight, I will set aside my fears, frustrations and aspirations and take a few minutes to review the abundance that exists in my life today. I will place my future in the care of a loving God of my own understanding, trusting my needs will be met at a time and in a way that is best for all concerned.',
      ],
    },
    {
      id: 'let-go',
      title: 'Letting Go',
      note: 'Thirteen lines',
      verse: true,
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
      id: 'promises',
      title: 'The Al-Anon Promises',
      note: 'From Survival to Recovery, p. 269&ndash;270',
      paragraphs: [
        'If we willingly surrender ourselves to the spiritual discipline of the Twelve Steps, our lives will be transformed. We will become mature, responsible individuals with a great capacity for joy, fulfillment, and wonder.',
        'Though we may never be perfect, continued spiritual progress will reveal to us our enormous potential. We will discover that we are worthy of love and loving.',
        'We will love others without losing ourselves, and will learn to accept love in return.',
        'Our sight, once clouded and confused, will clear and we will be able to perceive reality and recognize truth.',
        'Courage and fellowship will replace fear.',
        'We will be able to risk failure to develop new, hidden talents.',
        'Our lives, no matter how battered and degraded, will yield hope to share with others.',
        'We will begin to feel and will come to know the vastness of our emotions, but we will not be slaves to them.',
        'Our secrets will no longer bind us in shame.',
        'As we gain the ability to forgive ourselves, our families, and the world, our choices will expand.',
        'With dignity we will stand for ourselves, but not against our fellows.',
        'Serenity and peace will have meaning for us as we allow our lives and the lives of those we love to flow day by day with God&rsquo;s ease, balance, and grace.',
        'No longer terrified, we will discover we are free to delight in life&rsquo;s paradox, mystery, and awe.',
        'We will laugh more.',
        'Fear will be replaced by faith, and gratitude will come naturally as we realize that our Higher Power is doing for us what we cannot do for ourselves.',
      ],
    },
    {
      id: 'st-francis',
      title: 'Prayer of St. Francis',
      note: 'St. Francis of Assisi',
      verse: true,
      stanzas: [
        [
          'Lord, make me a channel of thy peace,',
          'that where there is hatred, I may bring love;',
          'that where there is wrong, I may bring the spirit of forgiveness;',
          'that where there is discord, I may bring harmony;',
          'that where there is error, I may bring truth;',
          'that where there is doubt, I may bring faith;',
          'that where there is despair, I may bring hope;',
          'that where there are shadows, I may bring light;',
          'that where there is sadness, I may bring joy.',
        ],
        [
          'Lord, grant that I may seek rather to',
          'comfort than to be comforted;',
          'to understand, than to be understood;',
          'to love, than to be loved.',
        ],
        [
          'For it is by self-forgetting that one finds.',
          'It is by forgiving that one is forgiven.',
          'It is by dying that one awakens to Eternal Life.',
        ],
      ],
    },
  ];

  const prayers = [
    {
      id: 'serenity',
      title: 'Serenity Prayer',
      lines: [
        'God, grant me the serenity',
        'to accept the things I cannot change,',
        'courage to change the things I can,',
        'and wisdom to know the difference.',
      ],
      note: 'Reinhold Niebuhr',
    },
    {
      id: 'third-step',
      title: 'Third Step Prayer',
      lines: [
        'God, I offer myself to Thee &mdash; to build with me and to do with me as Thou wilt. Relieve me of the bondage of self, that I may better do Thy will. Take away my difficulties, that victory over them may bear witness to those I would help of Thy Power, Thy Love, and Thy Way of life. May I do Thy will always!',
      ],
      note: 'Amen.',
    },
    {
      id: 'seventh-step',
      title: 'Seventh Step Prayer',
      lines: [
        'My Creator, I am now willing that you should have all of me, good and bad. I pray that you now remove from me every single defect of character which stands in the way of my usefulness to you and my fellows. Grant me strength, as I go out from here, to do your bidding.',
      ],
      note: 'Amen.',
    },
    {
      id: 'set-aside',
      title: 'Set Aside Prayer',
      lines: [
        'Dear God, please help me set aside everything I think I know &mdash; about myself, my disease, the Big Book, the 12 Steps, the Program, the Fellowship, all spiritual terms, and especially you God &mdash; so I may have an open mind and a new experience with all these things. Please help me see the Truth.',
      ],
      note: 'Amen.',
    },
  ];

  // Jump nav — the five readings plus the prayers band
  const jumpTargets = [
    ...readings.map(r => ({ id: r.id, label: r.title })),
    { id: 'prayers', label: 'Recovery Prayers' },
  ];

  const jumpNav = jumpTargets
    .map(t => pill(t.label, { href: `#${t.id}` }))
    .join('\n        ');

  function renderReadingCard(item) {
    let lines;
    if (item.stanzas) {
      lines = item.stanzas
        .map(stanza => `<div class="ess-verse">${stanza.map(l => `<p class="ess-line">${l}</p>`).join('')}</div>`)
        .join('');
    } else if (item.verse) {
      lines = `<div class="ess-verse">${item.paragraphs.map(l => `<p class="ess-line">${l}</p>`).join('')}</div>`;
    } else {
      lines = item.paragraphs.map(p => `<p class="ess-line">${p}</p>`).join('');
    }

    return `
        <article class="ess-card" id="${item.id}">
          <h2 class="ess-card-title">${item.title}</h2>
          <div class="ess-lines">${lines}</div>
          <div class="ess-card-footer"><p>${item.note}</p></div>
        </article>`;
  }

  const prayerCards = prayers.map(p => `
            <article class="prayer-card" id="${p.id}">
              <h3 class="prayer-card-title">${p.title}</h3>
              ${p.lines.length > 1
                ? `<p class="prayer-card-body">${p.lines.join('<br>')}</p>`
                : `<p class="prayer-card-body">${p.lines[0]}</p>`}
              <p class="prayer-card-note">${p.note}</p>
            </article>`).join('');

  const bodyContent = `
${photoHero({
    image: bp('/assets/themes/prayers.jpg'),
    alt: 'Stone cairn on a quiet shore — the essentials of Al-Anon recovery',
    title: 'Recovery Essentials',
    subtitle: 'Inspiration and grounding for daily recovery.',
    size: 'md',
  })}

    <section class="wrap section--sm">
      <nav class="pill-row" aria-label="Jump to a reading">
        ${jumpNav}
      </nav>
    </section>

    <section class="ess-column">
${readings.map(renderReadingCard).join('\n')}
    </section>

    <section class="prayer-band" id="prayers">
      ${ripple(700)}
      <div class="prayer-band-inner">
        <p class="eyebrow eyebrow--on-dark">Recovery prayers</p>
        <h2 class="prayer-band-heading">The prayers you already know</h2>
        <p class="prayer-band-intro">Set line by line for reading aloud.</p>
        <div class="prayer-grid">${prayerCards}
        </div>
      </div>
    </section>

    <div class="wrap section--lg" id="get-the-app">
      ${appPanel({
        tone: 'seafoam',
        heading: 'Keep these close, wherever you are.',
        text: 'Every reading and prayer here lives in the app &mdash; and you can add your own beside them.',
        context: 'essentials',
      })}
    </div>`;

  const allEntries = [...readings, ...prayers];

  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Recovery Essentials — Al-Anon Daily Paths',
    description: 'The foundational readings, prayers, and meditations of the Al-Anon program. A curated reference for recovery essentials including Just for Today, the Serenity Prayer, Letting Go, and more.',
    author: { '@type': 'Person', name: 'Neal W.' },
    publisher: {
      '@type': 'Organization',
      name: 'Daily Growth, LLC',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/assets/favicon.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/essentials/` },
    hasPart: allEntries.map((e, i) => ({
      '@type': 'CreativeWork',
      name: e.title,
      position: i + 1,
    })),
  }, null, 2);

  return wrapInLayout({
    title: 'Recovery Essentials | Al-Anon Daily Paths',
    description: 'The foundational readings, prayers, and meditations of the Al-Anon program. A curated reference for recovery essentials including Just for Today, the Serenity Prayer, Letting Go, and more.',
    canonicalPath: '/essentials/',
    bodyContent,
    bodyClass: 'page-essentials',
    structuredData,
    navSection: 'essentials',
    hasAppPanel: true,
  });
}
