import { wrapInLayout } from './base.mjs';
import { bp } from '../helpers/config.mjs';

export function renderTraditionsPage() {
  const bodyContent = `
    <div class="content-page traditions-page">
      <div class="content-container">
        <h1 class="page-title">The Twelve Traditions</h1>
        <p class="page-description">
          The Twelve Traditions guide how Al-Anon groups relate to one another
          and to the world outside. While the Steps help individuals recover,
          the Traditions keep the fellowship unified and focused on its
          primary purpose.
        </p>

        <section class="content-section">
          <ol class="traditions-list">
            <li>Our common welfare should come first; personal progress for
                the greatest number depends upon unity.</li>
            <li>For our group purpose there is but one authority &mdash; a loving
                God as He may express Himself in our group conscience. Our
                leaders are but trusted servants &mdash; they do not govern.</li>
            <li>The relatives of alcoholics, when gathered together for mutual
                aid, may call themselves an Al-Anon Family Group, provided
                that, as a group, they have no other affiliation. The only
                requirement for membership is that there be a problem of
                alcoholism in a relative or friend.</li>
            <li>Each group should be autonomous, except in matters affecting
                another group or Al-Anon or AA as a whole.</li>
            <li>Each Al-Anon Family Group has but one purpose: to help families
                of alcoholics. We do this by practicing the Twelve Steps of AA
                ourselves, by encouraging and understanding our alcoholic
                relatives, and by welcoming and giving comfort to families of
                alcoholics.</li>
            <li>Our Family Groups ought never endorse, finance or lend our name
                to any outside enterprise, lest problems of money, property and
                prestige divert us from our primary spiritual aim. Although a
                separate entity, we should always co-operate with Alcoholics
                Anonymous.</li>
            <li>Every group ought to be fully self-supporting, declining
                outside contributions.</li>
            <li>Al-Anon Twelfth Step work should remain forever non-professional,
                but our service centers may employ special workers.</li>
            <li>Our groups, as such, ought never be organized; but we may create
                service boards or committees directly responsible to those
                they serve.</li>
            <li>The Al-Anon Family Groups have no opinion on outside issues;
                hence our name ought never be drawn into public controversy.</li>
            <li>Our public relations policy is based on attraction rather than
                promotion; we need always maintain personal anonymity at the
                level of press, radio, films, and TV. We need guard with
                special care the anonymity of all AA members.</li>
            <li>Anonymity is the spiritual foundation of all our Traditions,
                ever reminding us to place principles above personalities.</li>
          </ol>
        </section>

        <section class="content-section">
          <h2>Why Do the Traditions Matter?</h2>
          <p>
            The Traditions protect the fellowship from the very human tendencies
            that can pull groups apart: ego, money, power, and outside
            controversy. By following these simple guidelines, Al-Anon groups
            remain a safe place where anyone affected by someone else&rsquo;s
            drinking can find help.
          </p>
          <p>
            Many members find that the Traditions also offer wisdom for personal
            relationships &mdash; principles like anonymity, autonomy, and
            placing the common good above individual desires are as useful
            at home as they are in a meeting room.
          </p>
        </section>

        <section class="content-section">
          <div class="traditions-next-steps">
            <a href="${bp('/steps/')}" class="external-link">Explore the Twelve Steps &rarr;</a>
            <a href="${bp('/concepts/')}" class="external-link">Read the Twelve Concepts of Service &rarr;</a>
            <a href="${bp('/about/')}" class="external-link">Learn more about Al-Anon &rarr;</a>
          </div>
        </section>

        <section class="content-section">
          <p class="traditions-attribution">
            The Twelve Traditions are adapted from Alcoholics Anonymous and used by
            Al-Anon Family Groups. For the official text, visit
            <a href="https://al-anon.org/for-members/the-legacies/the-twelve-traditions/" target="_blank" rel="noopener noreferrer">al-anon.org</a>.
          </p>
        </section>
      </div>
    </div>`;

  return wrapInLayout({
    title: 'The 12 Traditions of Al-Anon &mdash; Group Unity Principles | Al-Anon Daily Paths',
    description: 'The Twelve Traditions of Al-Anon Family Groups guide how groups relate to one another and to the world, keeping the fellowship unified and focused on recovery.',
    canonicalPath: '/traditions/',
    bodyContent,
    bodyClass: 'page-traditions',
  });
}
