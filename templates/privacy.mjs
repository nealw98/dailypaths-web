import { wrapInLayout } from './base.mjs';
import { bp } from '../helpers/config.mjs';

export function renderPrivacyPage() {
  const bodyContent = `
    <div class="content-page">
      <div class="content-container">
        <h1 class="page-title">Privacy Policy</h1>
        <p class="page-meta">Last updated: October 1, 2026</p>

        <section class="content-section">
          <h2>Overview</h2>
          <p>
            Daily Paths ("we," "our," or "us") is published by Daily Growth, LLC. This Privacy
            Policy covers two things: the <strong>Daily Paths website</strong> and the
            <strong>Daily Paths mobile app</strong>. They collect different information, so each
            has its own section below.
          </p>
          <ul>
            <li><a href="#website">The Daily Paths website</a></li>
            <li><a href="#app">The Daily Paths app</a></li>
          </ul>
          <p>
            The sections after those, on children, changes to this policy and how to contact us,
            apply to both.
          </p>
        </section>

        <h2 class="privacy-part" id="website">The Daily Paths Website</h2>

        <section class="content-section">
          <h3>What we collect</h3>
          <p>
            You do not need an account to read the website, and we do not ask for your name. When
            you visit, we collect usage information so we can understand which pages are helpful and
            improve the site, including for product development and marketing:
          </p>
          <ul>
            <li>The pages you view, how you arrived, and how you interact with them, such as clicks and link and form interactions.</li>
            <li>Technical information about your device and browser, such as screen size, browser type, language and operating system.</li>
            <li>Your approximate location, such as country or region, based on your internet address.</li>
          </ul>
          <p>
            This information is not tied to your name or email address, and we do not use it to
            identify you.
          </p>
        </section>

        <section class="content-section">
          <h3>Analytics services and cookies</h3>
          <p>We use two analytics services, each of which may set cookies or similar identifiers in your browser:</p>
          <ul>
            <li><strong>Google Analytics</strong> (Google LLC) measures visits and page views. Learn more in <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Google&rsquo;s explanation of how it uses data from sites that use its services</a>.</li>
            <li><strong>Mixpanel</strong> (Mixpanel, Inc.) records how visitors use the site, such as pages viewed and links clicked. Learn more in <a href="https://mixpanel.com/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">Mixpanel&rsquo;s privacy policy</a>.</li>
          </ul>
          <p>
            You can block or delete cookies in your browser settings, and Google offers a
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">browser add-on</a>
            that opts you out of Google Analytics. The site works without cookies.
          </p>
        </section>

        <section class="content-section">
          <h3>Email updates</h3>
          <p>If you join our email list, we store your email address, the date and version of your consent, and whether you signed up on our development or public website. We use this information for the reflections and article updates you requested. We do not sell the list.</p>
          <p>Addresses are stored in Supabase. Email delivery is not active yet. When delivery begins, messages will include an unsubscribe link. You can also contact us through the <a href="${bp('/support/')}">Support</a> page to request removal. Signup protection uses a temporary hash of your network address; we do not store the raw address in the subscriber list.</p>
        </section>

        <section class="content-section">
          <h3>What we do not collect on the website</h3>
          <p>
            We do not collect payment information, and we do not ask you to create an account or
            enter personal details to read. The only personal information you give us on the website
            is your email address, if you choose to join the email list. We do not sell personal
            information.
          </p>
        </section>

        <h2 class="privacy-part" id="app">The Daily Paths App</h2>


        <section class="content-section">
          <h3>Information We Collect</h3>
          <p>We collect minimal information to provide and improve our service:</p>
          <ul>
            <li>
              <strong>Device Identifier:</strong> When you use the app, we generate a
              random, anonymous identifier stored locally on your device. This identifier
              is not linked to your name, email, or any personally identifiable information.
            </li>
            <li>
              <strong>Feedback Data:</strong> If you choose to rate readings or provide
              feedback, we store this information associated with your anonymous device
              identifier to help us improve our content.
            </li>
            <li>
              <strong>Favorites:</strong> If you mark readings as favorites, this preference
              is stored with your anonymous device identifier.
            </li>
          </ul>
        </section>

        <section class="content-section">
          <h3>Data Stored on Your Device</h3>
          <p>
            Some features of Al-Anon Daily Paths create personal content, including
            journal entries, gratitude entries, personal prayers, bookmarks, and
            audio listening progress. This content is stored locally on your device.
            It is never transmitted to our servers, and we cannot access, read, or
            share it.
          </p>
        </section>

        <section class="content-section">
          <h3>Backup &amp; Sync</h3>
          <p>
            Al-Anon Daily Paths can automatically back up your personal content —
            journal entries, gratitude entries, personal prayers, bookmarks, and
            listening progress — so it is protected if you lose your device and
            stays up to date across your devices.
          </p>
          <ul>
            <li>
              <strong>On iOS,</strong> backups are stored in your private iCloud
              account when you are signed in to iCloud with iCloud Drive turned on.
            </li>
            <li>
              <strong>On Android,</strong> backups are stored in your own Google
              Drive account, in a hidden folder reserved for the app, and only
              after you choose to connect your Google account.
            </li>
          </ul>
          <p>
            Backup data travels directly from your device to your personal cloud
            account. It is never sent to or stored on our servers, and we cannot
            access it. Once stored in your iCloud or Google Drive account, it is
            also protected by Apple's or Google's privacy policies and your own
            account settings. If you move to a new device, you can restore your
            content from that same account; the restore also goes directly between
            your cloud account and your device, never through us.
          </p>
          <p>
            Device settings, purchase information, and downloaded audio are not
            included in backups.
          </p>
          <p>
            You stay in control: from the app's Backup &amp; Sync screen you can
            turn sync off, disconnect Google Drive, or permanently delete your
            Daily Paths data from iCloud or Google Drive at any time.
          </p>
        </section>

        <section class="content-section">
          <h3>Google User Data</h3>
          <p>
            On Android, Backup &amp; Sync uses Google Drive through Google Sign-In.
            The app requests only the <em>drive.appdata</em> permission, which
            limits its access to a hidden, app-specific folder in your Google
            Drive. The app cannot see, read, or modify any of your other Google
            Drive files.
          </p>
          <p>
            When you connect your Google account, the app can see your Google
            account email address. It is used only on your device to manage the
            connection and show which account is connected; it is never
            transmitted to us.
          </p>
          <p>
            Al-Anon Daily Paths' use of information received from Google APIs
            adheres to the
            <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener">Google
            API Services User Data Policy</a>, including the Limited Use
            requirements.
          </p>
        </section>

        <section class="content-section">
          <h3>Information We Do Not Collect</h3>
          <p>We do not collect:</p>
          <ul>
            <li>Your name, email address, or contact information (if you connect
              Google Drive for backups, your Google account email is visible to
              the app on your device only and is never sent to us)</li>
            <li>Location data</li>
            <li>Device contacts or photos</li>
            <li>Browsing history outside our app</li>
            <li>Payment information (credit card numbers, billing details). All purchases are processed directly by Apple (App Store) or Google (Google Play). We do not receive or store your payment information.</li>
            <li>Any information that could personally identify you</li>
          </ul>
        </section>

        <section class="content-section">
          <h3>How We Use Your Information</h3>
          <p>We use the anonymous information we collect to:</p>
          <ul>
            <li>Improve the quality of our daily readings based on user feedback</li>
            <li>Understand which content resonates with our community</li>
            <li>Maintain and enhance the app experience</li>
          </ul>
        </section>

        <section class="content-section">
          <h3>Data Sharing</h3>
          <p>
            We do not sell, trade, or share your information with third parties.
            The anonymous feedback and preference data we collect remains within
            our secure systems and is used solely for improving the Al-Anon Daily
            Paths experience. Your personal content and backups are different:
            they belong to you, stay on your device and in your personal cloud
            account, and never pass through our systems at all.
          </p>
        </section>

        <section class="content-section">
          <h3>Data Retention</h3>
          <p>
            We retain anonymous feedback and preference data indefinitely to support
            ongoing content improvement. Since this data is not linked to any
            personally identifiable information, it cannot be used to identify you.
          </p>
        </section>

        <section class="content-section">
          <h3>Data Security</h3>
          <p>
            We implement appropriate technical and organizational measures to protect
            the information we collect. Our data is stored on secure servers with
            industry-standard encryption and access controls.
          </p>
        </section>

        <section class="content-section">
          <h3>Your Choices</h3>
          <p>
            You can use Al-Anon Daily Paths without providing any feedback or ratings.
            The core reading experience does not require any data collection beyond
            the anonymous device identifier used to remember your preferences.
            Backup &amp; Sync is likewise under your control: you can turn it off,
            disconnect Google Drive, or delete your cloud data from within the
            app at any time.
          </p>
        </section>

        <h2 class="privacy-part">Both the Website and the App</h2>


        <section class="content-section">
          <h3>Children's Privacy</h3>
          <p>
            Al-Anon Daily Paths is intended for adults. We do not knowingly collect
            information from children under 13 years of age.
          </p>
        </section>

        <section class="content-section">
          <h3>Changes to This Policy</h3>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last updated" date.
          </p>
        </section>

        <section class="content-section">
          <h3>Contact Us</h3>
          <p>
            If you have questions about this Privacy Policy, please contact us
            through our <a href="${bp('/support/')}">Support</a> page.
          </p>
        </section>
      </div>
    </div>`;

  return wrapInLayout({
    title: 'Privacy Policy | Al-Anon Daily Paths',
    description: 'Daily Paths privacy policy for the website and the mobile app: what each collects, how it is used, and your choices.',
    canonicalPath: '/privacy/',
    bodyContent,
    bodyClass: 'page-privacy',
  });
}
