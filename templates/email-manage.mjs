import { wrapInLayout } from './base.mjs';
import { bp } from '../helpers/config.mjs';

const COPY = {
  confirm: {
    title: 'Confirm your email',
    lead: 'Press the button to confirm that you want Daily Paths reflections and article updates by email.',
    button: 'Confirm my email',
  },
  unsubscribe: {
    title: 'Unsubscribe',
    lead: 'Press the button to stop receiving Daily Paths emails at this address.',
    button: 'Unsubscribe',
  },
};

// action: 'confirm' | 'unsubscribe'. These pages are never indexed or listed in the sitemap.
export function renderEmailManagePage(action) {
  const copy = COPY[action];
  const endpoint = (process.env.SUPABASE_URL || '').replace(/\/$/, '') + '/functions/v1/newsletter-manage';
  const bodyContent = `
    <div class="content-page">
      <div class="content-container">
        <h1 class="page-title">${copy.title}</h1>
        <div data-email-manage data-action="${action}" data-endpoint="${endpoint}">
          <p class="page-description" data-email-lead>${copy.lead}</p>
          <p><button type="button" class="site-newsletter-button" data-email-button>${copy.button}</button></p>
          <p role="status" aria-live="polite" data-email-status></p>
        </div>
        <noscript><p>This page needs JavaScript. You can also write to <a href="mailto:support@dailypaths.org">support@dailypaths.org</a>.</p></noscript>
      </div>
    </div>
    <script src="${bp('/js/email-manage.js')}?v=20261002" defer></script>`;
  return wrapInLayout({
    title: `${copy.title} | Daily Paths`,
    description: 'Manage your Daily Paths email updates.',
    canonicalPath: `/email/${action}/`,
    bodyContent,
    bodyClass: 'page-email-manage',
    noindex: true,
    hideNewsletter: true,
  });
}
