import { wrapInLayout } from './base.mjs';
import { bp } from '../helpers/config.mjs';

// Reviewed and approved by Neal, October 4, 2026. These terms are for the website only; the app links
// to its own terms (Apple's standard EULA).
export function renderTermsPage() {
  const bodyContent = `
    <div class="content-page">
      <div class="content-container">
        <h1 class="page-title">Terms of Service</h1>
        <p class="page-meta">Last updated: October 1, 2026</p>

        <section class="content-section">
          <h2>Overview</h2>
          <p>
            These terms cover your use of the Daily Paths website. Daily Paths is published by
            Daily Growth, LLC ("we," "our," or "us"). By using the website, you agree to them.
            If you do not agree, please do not use the site. The Daily Paths mobile app is
            covered separately, by the terms it links to.
          </p>
        </section>

        <section class="content-section">
          <h2>An independent project</h2>
          <p>
            Daily Paths is an independent project. It is not affiliated with, endorsed by, or
            approved by Al-Anon Family Groups, Inc. or any other organization. The Twelve Steps and
            Twelve Traditions are used with the understanding that they are the shared heritage of
            the recovery community.
          </p>
        </section>

        <section class="content-section">
          <h2>Not professional advice</h2>
          <p>
            Daily Paths is a tool for daily reflection. It is not medical, mental health, legal or
            crisis advice, and it is not a substitute for a professional. If you or someone you know
            is in crisis, call or text 988 (USA) or contact your local emergency services.
          </p>
        </section>

        <section class="content-section">
          <h2>Using the content</h2>
          <p>
            The reflections, articles, guides and images on this site are owned by Daily Growth, LLC
            or used with permission. You may read them, share links to them, and quote short
            excerpts with credit and a link back to the site for personal and non-commercial use.
            Please do not copy, republish, sell or build products from the content without our
            written permission.
          </p>
        </section>

        <section class="content-section">
          <h2>Email updates</h2>
          <p>
            If you join the email list, you agree to receive Daily Paths reflection and article
            updates. You can unsubscribe at any time. See our <a href="${bp('/privacy/')}">Privacy
            Policy</a> for how we handle your email address.
          </p>
        </section>

        <section class="content-section">
          <h2>Links to other sites</h2>
          <p>
            The site links to outside websites, such as Al-Anon Family Groups. We do not control
            them and are not responsible for their content or practices.
          </p>
        </section>

        <section class="content-section">
          <h2>No warranty and limits of liability</h2>
          <p>
            The website is provided "as is" and "as available," without warranties of any kind. To
            the fullest extent allowed by law, Daily Growth, LLC is not liable for any damages
            arising from your use of the site or from relying on its content.
          </p>
        </section>

        <section class="content-section">
          <h2>Changes to these terms</h2>
          <p>
            We may update these terms from time to time. The "Last updated" date shows when. If you
            keep using the site after a change, you accept the updated terms.
          </p>
        </section>

        <section class="content-section">
          <h2>Contact us</h2>
          <p>
            Questions about these terms? Contact us through our
            <a href="${bp('/support/')}">Support</a> page.
          </p>
        </section>
      </div>
    </div>`;

  return wrapInLayout({
    title: 'Terms of Service | Al-Anon Daily Paths',
    description: 'Terms of service for the Daily Paths website.',
    canonicalPath: '/terms/',
    bodyContent,
    bodyClass: 'page-terms',
  });
}
