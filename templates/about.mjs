import { wrapInLayout } from './base.mjs';
import { bp } from '../helpers/config.mjs';

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
          <h2>Explore Al-Anon&rsquo;s Three Legacies</h2>
          <p>
            Al-Anon&rsquo;s program of recovery is built on three legacies: the Steps,
            the Traditions, and the Concepts of Service. Together they guide personal
            recovery, group unity, and worldwide service.
          </p>
          <div class="about-links">
            <a href="${bp('/steps/')}" class="about-link-card">
              <h3>The Twelve Steps</h3>
              <p>A personal program of recovery, one step at a time.</p>
            </a>
            <a href="${bp('/traditions/')}" class="about-link-card">
              <h3>The Twelve Traditions</h3>
              <p>Principles that keep Al-Anon groups unified and focused.</p>
            </a>
            <a href="${bp('/concepts/')}" class="about-link-card">
              <h3>The Twelve Concepts of Service</h3>
              <p>Guidelines for Al-Anon&rsquo;s service structure worldwide.</p>
            </a>
          </div>
        </section>

        <section class="content-section">
          <h2>Is Al-Anon for You?</h2>
          <p>
            Not sure if Al-Anon is right for your situation? A short self-quiz
            can help you reflect on whether someone else&rsquo;s drinking has
            affected your life.
          </p>
          <p>
            <a href="${bp('/quiz/')}" class="external-link">Take the self-quiz &rarr;</a>
          </p>
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
    title: 'About Al-Anon Family Groups | Al-Anon Daily Paths',
    description: 'Learn about Al-Anon Family Groups, a mutual support program for anyone affected by someone else\'s drinking. Find meetings, explore the Steps, Traditions, and Concepts.',
    canonicalPath: '/about/',
    bodyContent,
    bodyClass: 'page-about',
  });
}
