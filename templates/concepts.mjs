import { wrapInLayout } from './base.mjs';

export function renderConceptsPage() {
  const bodyContent = `
    <div class="content-page concepts-page">
      <div class="content-container">
        <h1 class="page-title">The Twelve Concepts of Service</h1>
        <p class="page-description">
          The Twelve Concepts of Service describe how Al-Anon&rsquo;s service
          structure works &mdash; from individual groups all the way to the
          World Service Office. They ensure that the fellowship remains
          accountable, effective, and true to its spiritual principles.
        </p>

        <section class="content-section">
          <ol class="concepts-list">
            <li>The ultimate responsibility and authority for Al-Anon world
                services belongs to the Al-Anon groups.</li>
            <li>The Al-Anon Family Groups have delegated complete
                administrative and operational authority to their Conference
                and its service arms.</li>
            <li>The right of decision makes effective leadership possible.</li>
            <li>Participation is the key to harmony.</li>
            <li>The rights of appeal and petition protect minorities and
                assure that they be heard.</li>
            <li>The Conference acknowledges the primary administrative
                responsibility of the Trustees.</li>
            <li>The Trustees have legal rights while the rights of the
                Conference are traditional.</li>
            <li>The Board of Trustees delegates full authority for routine
                management of Al-Anon Headquarters to its executive
                committees.</li>
            <li>Good personal leadership at all service levels is a necessity.
                In the field of world service the Board of Trustees assumes
                the primary leadership.</li>
            <li>Service responsibility is balanced by carefully defined
                service authority and double-headed management is avoided.</li>
            <li>The World Service Office is composed of standing committees,
                executives and staff members.</li>
            <li>The spiritual foundation for Al-Anon&rsquo;s world services is
                contained in the General Warranties of the Conference,
                Article 12 of the Charter.</li>
          </ol>
        </section>

        <section class="content-section">
          <h2>Why Do the Concepts Matter?</h2>
          <p>
            While the Steps guide personal recovery and the Traditions guide
            group life, the Concepts of Service ensure that Al-Anon&rsquo;s
            worldwide structure operates with integrity. They protect the
            rights of minorities, define clear lines of authority, and keep
            the focus on serving the membership.
          </p>
          <p>
            Many members find the Concepts helpful beyond service work &mdash;
            principles like delegation, participation, and balancing authority
            with accountability apply to workplaces, families, and communities.
          </p>
        </section>

        <section class="content-section">
          <div class="concepts-next-steps">
            <a href="/steps/" class="external-link">Explore the Twelve Steps &rarr;</a>
            <a href="/traditions/" class="external-link">Read the Twelve Traditions &rarr;</a>
            <a href="/about/" class="external-link">Learn more about Al-Anon &rarr;</a>
          </div>
        </section>

        <section class="content-section">
          <p class="concepts-attribution">
            The Twelve Concepts of Service were written by Al-Anon&rsquo;s
            co-founder and adopted by the fellowship in 1970. For the official
            text, visit
            <a href="https://al-anon.org/for-members/the-legacies/the-twelve-concepts-of-service/" target="_blank" rel="noopener noreferrer">al-anon.org</a>.
          </p>
        </section>
      </div>
    </div>`;

  return wrapInLayout({
    title: 'The 12 Concepts of Service &mdash; Al-Anon Service Structure | Al-Anon Daily Paths',
    description: 'The Twelve Concepts of Service guide Al-Anon\'s worldwide service structure, ensuring accountability, integrity, and spiritual principles in all service work.',
    canonicalPath: '/concepts/',
    bodyContent,
    bodyClass: 'page-concepts',
  });
}
