import { wrapInLayout } from './base.mjs';

export function renderAboutPage() {
  const bodyContent = `
    <div class="content-page about-page">
      <div class="content-container">
        <h1 class="page-title">About Al-Anon</h1>
        <p class="page-description">
          Al-Anon Family Groups are a fellowship of relatives and friends of
          alcoholics who share their experience, strength, and hope in order
          to solve their common problems.
        </p>

        <section class="content-section">
          <h2>What Is Al-Anon?</h2>
          <p>
            Al-Anon is a mutual support program for people whose lives have been
            affected by someone else&rsquo;s drinking. Whether that person is a spouse,
            parent, child, friend, or coworker, the effects of alcoholism reach
            far beyond the drinker.
          </p>
          <p>
            Al-Anon members come together to learn that they are not alone, that they
            did not cause the alcoholism, cannot control it, and cannot cure it. Through
            meetings, literature, and the shared wisdom of fellow members, people find
            practical tools for their own recovery.
          </p>
          <p>
            Al-Anon is not allied with any sect, denomination, political entity,
            organization, or institution. There are no dues for membership. It is
            self-supporting through its own voluntary contributions.
          </p>
        </section>

        <section class="content-section">
          <h2>Is Al-Anon for You?</h2>
          <p>
            The following questions are designed to help you decide whether
            Al-Anon might be helpful for you. There are no right or wrong
            answers &mdash; simply reflect honestly on each one.
          </p>
          <ol class="quiz-list">
            <li>Do you worry about how much someone drinks?</li>
            <li>Do you have money problems because of someone else&rsquo;s drinking?</li>
            <li>Do you tell lies to cover up for someone else&rsquo;s drinking?</li>
            <li>Do you feel that if the drinker cared about you, he or she would stop drinking to please you?</li>
            <li>Do you blame the drinker&rsquo;s behavior on his or her companions?</li>
            <li>Are plans frequently upset or canceled or meals delayed because of the drinker?</li>
            <li>Do you make threats, such as, &ldquo;If you don&rsquo;t stop drinking, I&rsquo;ll leave you&rdquo;?</li>
            <li>Do you secretly try to smell the drinker&rsquo;s breath?</li>
            <li>Are you afraid to upset someone for fear it will set off a drinking bout?</li>
            <li>Have you been hurt or embarrassed by a drinker&rsquo;s behavior?</li>
            <li>Are holidays and gatherings spoiled because of drinking?</li>
            <li>Have you considered calling the police for help in fear of abuse?</li>
            <li>Do you search for hidden alcohol?</li>
            <li>Do you ever ride in a car with a driver who has been drinking?</li>
            <li>Have you refused social invitations out of fear or anxiety?</li>
            <li>Do you feel like a failure because you can&rsquo;t control the drinking?</li>
            <li>Do you think that if the drinker stopped drinking, your other problems would be solved?</li>
            <li>Do you ever threaten to hurt yourself to scare the drinker?</li>
            <li>Do you feel angry, confused, or depressed most of the time?</li>
            <li>Do you feel there is no one who understands your problems?</li>
          </ol>
          <p class="quiz-note">
            If you answered &ldquo;yes&rdquo; to any of these questions, Al-Anon may be
            able to help. You are welcome at any Al-Anon meeting, whether or not the
            person in your life is still drinking.
          </p>
          <p class="quiz-attribution">
            Adapted from the Al-Anon Family Groups self-quiz at
            <a href="https://al-anon.org/newcomers/self-quiz/" target="_blank" rel="noopener noreferrer">al-anon.org</a>.
          </p>
        </section>

        <section class="content-section">
          <h2>Find a Meeting</h2>
          <p>
            Al-Anon meetings are held in communities around the world, and many
            are also available online. Meetings are free and open to anyone affected
            by someone else&rsquo;s drinking.
          </p>
          <p>
            <a href="https://al-anon.org/al-anon-meetings/" target="_blank" rel="noopener noreferrer" class="external-link">
              Find an Al-Anon meeting near you &rarr;
            </a>
          </p>
        </section>

        <section class="content-section">
          <h2>The Twelve Traditions</h2>
          <p>
            The Traditions guide how Al-Anon groups relate to one another, to
            Alcoholics Anonymous, and to the outside world. They are the principles
            that keep Al-Anon unified and focused on its primary purpose.
          </p>
          <ol class="traditions-list">
            <li>Our common welfare should come first; personal progress for the greatest number depends upon unity.</li>
            <li>For our group purpose there is but one authority &mdash; a loving God as He may express Himself in our group conscience. Our leaders are but trusted servants &mdash; they do not govern.</li>
            <li>The relatives of alcoholics, when gathered together for mutual aid, may call themselves an Al-Anon Family Group, provided that, as a group, they have no other affiliation. The only requirement for membership is that there be a problem of alcoholism in a relative or friend.</li>
            <li>Each group should be autonomous, except in matters affecting another group or Al-Anon or AA as a whole.</li>
            <li>Each Al-Anon Family Group has but one purpose: to help families of alcoholics. We do this by practicing the Twelve Steps of AA ourselves, by encouraging and understanding our alcoholic relatives, and by welcoming and giving comfort to families of alcoholics.</li>
            <li>Our Family Groups ought never endorse, finance or lend our name to any outside enterprise, lest problems of money, property and prestige divert us from our primary spiritual aim. Although a separate entity, we should always co-operate with Alcoholics Anonymous.</li>
            <li>Every group ought to be fully self-supporting, declining outside contributions.</li>
            <li>Al-Anon Twelfth Step work should remain forever non-professional, but our service centers may employ special workers.</li>
            <li>Our groups, as such, ought never be organized; but we may create service boards or committees directly responsible to those they serve.</li>
            <li>The Al-Anon Family Groups have no opinion on outside issues; hence our name ought never be drawn into public controversy.</li>
            <li>Our public relations policy is based on attraction rather than promotion; we need always maintain personal anonymity at the level of press, radio, films, and TV. We need guard with special care the anonymity of all AA members.</li>
            <li>Anonymity is the spiritual foundation of all our Traditions, ever reminding us to place principles above personalities.</li>
          </ol>
        </section>

        <section class="content-section">
          <h2>The Twelve Concepts of Service</h2>
          <p>
            The Concepts of Service describe the structure that allows Al-Anon to
            function as a worldwide fellowship. They provide guidance for Al-Anon&rsquo;s
            service arms at every level.
          </p>
          <ol class="concepts-list">
            <li>The ultimate responsibility and authority for Al-Anon world services belongs to the Al-Anon groups.</li>
            <li>The Al-Anon Family Groups have delegated complete administrative and operational authority to their Conference and its service arms.</li>
            <li>The right of decision makes effective leadership possible.</li>
            <li>Participation is the key to harmony.</li>
            <li>The rights of appeal and petition protect minorities and insure that they be heard.</li>
            <li>The Conference acknowledges the primary administrative responsibility of the Trustees.</li>
            <li>The Trustees have legal rights while the rights of the Conference are traditional.</li>
            <li>The Board of Trustees delegates full authority for routine management of Al-Anon Headquarters to its executive committees.</li>
            <li>Good personal leadership at all service levels is a necessity. In the field of world service the Board of Trustees assumes the primary leadership.</li>
            <li>Service responsibility is balanced by carefully defined service authority and double-headed management is avoided.</li>
            <li>The World Service Office is composed of selected committees, executives and staff members.</li>
            <li>The spiritual foundation for Al-Anon&rsquo;s world services is contained in the General Warranties of the Conference, Article 12 of the Charter.</li>
          </ol>
        </section>

        <section class="content-section resources-section">
          <h2>Learn More</h2>
          <p>
            Al-Anon Daily Paths is an independent resource inspired by Al-Anon principles.
            For official Al-Anon information, literature, and meeting schedules, visit
            the Al-Anon Family Groups website.
          </p>
          <p>
            <a href="https://al-anon.org" target="_blank" rel="noopener noreferrer" class="external-link">
              Visit al-anon.org &rarr;
            </a>
          </p>
        </section>
      </div>
    </div>`;

  return wrapInLayout({
    title: 'About Al-Anon &mdash; Is Al-Anon for You? | Al-Anon Daily Paths',
    description: 'Learn about Al-Anon Family Groups, take the self-quiz to see if Al-Anon is for you, and find a meeting near you. Includes the Twelve Traditions and Concepts of Service.',
    canonicalPath: '/about/',
    bodyContent,
    bodyClass: 'page-about',
  });
}
