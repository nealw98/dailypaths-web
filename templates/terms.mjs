import { wrapInLayout } from './base.mjs';

export function renderTermsPage() {
  const bodyContent = `
    <div class="content-page">
      <div class="content-container">
        <h1 class="page-title">Terms of Service</h1>
        <p class="page-description">Terms of Service content coming soon.</p>
      </div>
    </div>`;

  return wrapInLayout({
    title: 'Terms of Service | Daily Paths',
    description: 'Terms of service for Daily Paths, an Al-Anon daily reflections app and website.',
    canonicalPath: '/terms/',
    bodyContent,
    bodyClass: 'page-terms',
  });
}
