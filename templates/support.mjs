import { wrapInLayout } from './base.mjs';

export function renderSupportPage() {
  const bodyContent = `
    <div class="content-page">
      <div class="content-container">
        <h1 class="page-title">Support</h1>
        <p class="page-description">
          We're here to help you get the most out of Al-Anon Daily Paths. Find answers
          to common questions below or reach out to us directly.
        </p>

        <section class="content-section">
          <h2>Contact Us</h2>
          <p>Have a question, suggestion, or feedback? We'd love to hear from you.</p>
          <p>
            <a href="mailto:soberdailies@gmail.com" class="contact-link">soberdailies@gmail.com</a>
          </p>
          <p class="text-muted">We typically respond within 1-2 business days.</p>
        </section>

        <section class="content-section">
          <h2>Frequently Asked Questions</h2>

          <details class="faq-item">
            <summary>What is Al-Anon Daily Paths?</summary>
            <p>
              Al-Anon Daily Paths is a companion app for Al-Anon members featuring 366 original
              daily reflections. Each reading is organized by the 12 Steps (one step per month),
              written in the contemplative style of "Courage to Change," and based on the
              "Paths to Recovery" framework. Every reflection includes a practical application
              for today and an inspirational thought to carry with you.
            </p>
          </details>

          <details class="faq-item">
            <summary>Is Al-Anon Daily Paths affiliated with Al-Anon Family Groups?</summary>
            <p>
              Al-Anon Daily Paths is an independent app created to support those in Al-Anon recovery.
              It is not officially affiliated with, endorsed by, or produced by Al-Anon Family
              Group Headquarters, Inc. The content is original and inspired by Al-Anon principles.
            </p>
          </details>

          <details class="faq-item">
            <summary>How do I navigate between readings?</summary>
            <p>
              On the website, use the previous and next links at the bottom of each reading.
              You can also explore readings by month through the Steps pages, or by topic
              through Themes. In the app, use the Previous and Next buttons, or tap
              the date to open a calendar picker.
            </p>
          </details>

          <details class="faq-item">
            <summary>Can I save my favorite readings?</summary>
            <p>
              Yes! In the Al-Anon Daily Paths app, tap the heart icon on any reading to save it
              to your favorites. You can access all your saved readings from the Favorites
              section in the app.
            </p>
          </details>

          <details class="faq-item">
            <summary>Is my data private?</summary>
            <p>
              Absolutely. We take your privacy seriously. The app uses an anonymous
              identifier stored on your device &mdash; we never collect your name, email, or
              any personally identifiable information. See our
              <a href="/privacy/">Privacy Policy</a> for complete details.
            </p>
          </details>

          <details class="faq-item">
            <summary>How can I provide feedback on a reading?</summary>
            <p>
              In the app, you can rate each reflection using the feedback buttons after reading.
              Your anonymous feedback helps us continuously improve the quality of
              our readings for the entire community.
            </p>
          </details>

          <details class="faq-item">
            <summary>Is Al-Anon Daily Paths free to use?</summary>
            <p>
              The website is free. The Al-Anon Daily Paths app is available as a one-time purchase
              on the App Store. We believe recovery support should be accessible to everyone
              who needs it.
            </p>
          </details>
        </section>

        <section class="content-section resources-section">
          <h2>Al-Anon Resources</h2>
          <p>
            If you or someone you know is affected by someone else's drinking,
            Al-Anon Family Groups can help.
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
    title: 'Support & FAQ | Al-Anon Daily Paths',
    description: 'Get help with Al-Anon Daily Paths. Find answers to common questions about the daily reflections app and website.',
    canonicalPath: '/support/',
    bodyContent,
    bodyClass: 'page-support',
  });
}
