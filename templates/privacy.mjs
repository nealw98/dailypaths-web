import { wrapInLayout } from './base.mjs';
import { bp } from '../helpers/config.mjs';

export function renderPrivacyPage() {
  const bodyContent = `
    <div class="content-page">
      <div class="content-container">
        <h1 class="page-title">Privacy Policy</h1>
        <p class="page-meta">Last updated: August 25, 2026</p>

        <section class="content-section">
          <h2>Overview</h2>
          <p>
            Al-Anon Daily Paths ("we," "our," or "us") is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, and safeguard information
            when you use our mobile application and website.
          </p>
        </section>

        <section class="content-section">
          <h2>Information We Collect</h2>
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
          <h2>Data Stored on Your Device</h2>
          <p>
            Some features of Al-Anon Daily Paths create personal content, including
            journal entries, gratitude entries, personal prayers, bookmarks, and
            audio listening progress. This content is stored locally on your device.
            It is never transmitted to our servers, and we cannot access, read, or
            share it.
          </p>
        </section>

        <section class="content-section">
          <h2>Backup &amp; Sync</h2>
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
            account settings.
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
          <h2>Google User Data</h2>
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
          <h2>Information We Do Not Collect</h2>
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
          <h2>How We Use Your Information</h2>
          <p>We use the anonymous information we collect to:</p>
          <ul>
            <li>Improve the quality of our daily readings based on user feedback</li>
            <li>Understand which content resonates with our community</li>
            <li>Maintain and enhance the app experience</li>
          </ul>
        </section>

        <section class="content-section">
          <h2>Data Sharing</h2>
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
          <h2>Data Retention</h2>
          <p>
            We retain anonymous feedback and preference data indefinitely to support
            ongoing content improvement. Since this data is not linked to any
            personally identifiable information, it cannot be used to identify you.
          </p>
        </section>

        <section class="content-section">
          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect
            the information we collect. Our data is stored on secure servers with
            industry-standard encryption and access controls.
          </p>
        </section>

        <section class="content-section">
          <h2>Your Choices</h2>
          <p>
            You can use Al-Anon Daily Paths without providing any feedback or ratings.
            The core reading experience does not require any data collection beyond
            the anonymous device identifier used to remember your preferences.
            Backup &amp; Sync is likewise under your control: you can turn it off,
            disconnect Google Drive, or delete your cloud data from within the
            app at any time.
          </p>
        </section>

        <section class="content-section">
          <h2>Children's Privacy</h2>
          <p>
            Al-Anon Daily Paths is intended for adults. We do not knowingly collect
            information from children under 13 years of age.
          </p>
        </section>

        <section class="content-section">
          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last updated" date.
          </p>
        </section>

        <section class="content-section">
          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us
            through our <a href="${bp('/support/')}">Support</a> page.
          </p>
        </section>
      </div>
    </div>`;

  return wrapInLayout({
    title: 'Privacy Policy | Al-Anon Daily Paths',
    description: 'Al-Anon Daily Paths privacy policy. Learn how we protect your privacy with anonymous-only data collection.',
    canonicalPath: '/privacy/',
    bodyContent,
    bodyClass: 'page-privacy',
  });
}
