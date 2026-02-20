import { bp } from '../helpers/config.mjs';

/**
 * Base HTML layout — wraps all pages with head, nav, and footer.
 *
 * @param {Object} options
 * @param {string} options.title - Full <title> tag content
 * @param {string} options.description - Meta description
 * @param {string} options.canonicalPath - Path portion (e.g., "/january-1/")
 * @param {string} options.bodyContent - Inner HTML for <main>
 * @param {string} [options.structuredData] - JSON-LD string
 * @param {string} [options.ogType] - Open Graph type (default: "website")
 * @param {string} [options.bodyClass] - Additional class for <body>
 */
export function wrapInLayout({
  title,
  description,
  canonicalPath,
  bodyContent,
  structuredData,
  ogType = 'website',
  ogImage,
  bodyClass = '',
}) {
  const siteUrl = 'https://dailypaths.org';
  const canonicalUrl = siteUrl + canonicalPath;
  const ogImageUrl = ogImage ? siteUrl + ogImage : `${siteUrl}/assets/og-image.png`;
  const twitterCard = ogImage ? 'summary_large_image' : 'summary';
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeAttr(description)}">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Open Graph -->
  <meta property="og:title" content="${escapeAttr(title)}">
  <meta property="og:description" content="${escapeAttr(description)}">
  <meta property="og:type" content="${ogType}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${ogImageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Al-Anon Daily Paths">

  <!-- Twitter -->
  <meta name="twitter:card" content="${twitterCard}">
  <meta name="twitter:title" content="${escapeAttr(title)}">
  <meta name="twitter:description" content="${escapeAttr(description)}">
  <meta name="twitter:image" content="${ogImageUrl}">

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="${bp('/assets/favicon.png')}">
  <link rel="icon" type="image/x-icon" href="${bp('/assets/favicon.ico')}">
  <link rel="apple-touch-icon" href="${bp('/assets/favicon.png')}">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Inter:wght@300;400;500&family=Lora:ital,wght@0,400;1,400&display=swap" rel="stylesheet">

  <!-- Styles -->
  <link rel="stylesheet" href="${bp('/css/style.css')}">

  ${structuredData ? `<!-- Structured Data -->
  <script type="application/ld+json">
${structuredData}
  </script>` : ''}

  <!-- Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-HSDBJDBVCS"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-HSDBJDBVCS');
  </script>
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
  <header class="site-header">
    <div class="header-inner">
      <a href="${bp('/')}" class="site-logo">
        <span class="site-name">Al-Anon Daily Paths</span>
      </a>
      <button class="menu-toggle" data-menu-toggle aria-label="Toggle menu" aria-expanded="false">
        <span class="menu-bar"></span>
        <span class="menu-bar"></span>
        <span class="menu-bar"></span>
      </button>
      <nav class="site-nav" data-mobile-menu>
        <a href="${bp('/')}" class="nav-link">Home</a>
        <a href="${bp('/steps/')}" class="nav-link">Steps</a>
        <a href="${bp('/themes/')}" class="nav-link">Themes</a>
        <a href="${bp('/prayers/')}" class="nav-link">Prayers</a>
        <a href="${bp('/about-alanon/')}" class="nav-link">Al-Anon</a>
      </nav>
    </div>
  </header>

  <main>
${bodyContent}
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="footer-name">Al-Anon Daily Paths</span>
        <p class="footer-tagline">Daily reflections for the Al-Anon journey</p>
      </div>
      <nav class="footer-nav">
        <a href="${bp('/about-alanon/')}">Al-Anon</a>
        <a href="${bp('/support/')}">Support</a>
        <a href="${bp('/privacy/')}">Privacy</a>
        <a href="${bp('/terms/')}">Terms</a>
      </nav>
      <p class="footer-copyright">&copy; ${year} Daily Growth, LLC. All rights reserved.</p>
    </div>
  </footer>

  <script src="${bp('/js/main.js')}" defer></script>
</body>
</html>`;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
