import { bp, BASE_URL } from '../helpers/config.mjs';
import { icon } from './ui.mjs';

/**
 * Path to today's reading, used for the "Today's Reflection" nav item.
 * Set once by build.mjs before pages render; `data-today-link` lets the client
 * correct it if the visitor's local date has moved past the build date.
 */
let TODAY_PATH = '/';

/** @param {string} path - e.g. "/august-9-let-go-and-let-god/" */
export function setTodayPath(path) {
  TODAY_PATH = path;
}

/** Header nav — six items is the ceiling; "Start here" stays out by design. */
function navItems() {
  return [
    { id: 'home', label: 'Home', href: bp('/') },
    { id: 'reflection', label: "Today's Reflection", href: bp(TODAY_PATH), today: true },
    { id: 'steps', label: 'Steps', href: bp('/steps/') },
    { id: 'themes', label: 'Themes', href: bp('/themes/') },
    { id: 'essentials', label: 'Essentials', href: bp('/essentials/') },
    { id: 'alanon', label: 'Al-Anon', href: bp('/about-alanon/') },
  ];
}

/**
 * Base HTML layout — wraps all pages with head, sticky header, and footer.
 *
 * @param {Object} options
 * @param {string} options.title - Full <title> tag content
 * @param {string} options.description - Meta description
 * @param {string} options.canonicalPath - Path portion (e.g., "/january-1/")
 * @param {string} options.bodyContent - Inner HTML for <main>
 * @param {string} [options.structuredData] - JSON-LD string
 * @param {string} [options.ogType] - Open Graph type (default: "website")
 * @param {string} [options.bodyClass] - Additional class for <body>
 * @param {string} [options.navSection] - Nav item to mark active. Step detail
 *   pages pass "steps"; theme detail pages pass "themes".
 * @param {boolean} [options.hasAppPanel] - Page contains #get-the-app, so the
 *   header CTA can scroll in place instead of going home.
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
  noindex = false,
  navSection = '',
  hasAppPanel = false,
}) {
  const canonicalUrl = BASE_URL + canonicalPath;
  const ogImageUrl = ogImage ? BASE_URL + ogImage : `${BASE_URL}/assets/og-image.png`;
  const twitterCard = ogImage ? 'summary_large_image' : 'summary';
  const appHref = hasAppPanel ? '#get-the-app' : bp('/#get-the-app');

  const nav = navItems();

  const desktopNav = nav.map(n => {
    const active = n.id === navSection;
    return `        <a href="${n.href}" class="nav-link${active ? ' is-active' : ''}"${active ? ' aria-current="page"' : ''}${n.today ? ' data-today-link' : ''}>${n.label}</a>`;
  }).join('\n');

  const mobileNav = nav.map(n => {
    const active = n.id === navSection;
    return `        <a href="${n.href}" class="mobile-menu-row${active ? ' is-active' : ''}"${n.today ? ' data-today-link' : ''}>${n.label}${icon('chevronRight', { size: 16, className: 'mobile-menu-chevron' })}</a>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeAttr(description)}">
  <link rel="canonical" href="${canonicalUrl}">${noindex ? '\n  <meta name="robots" content="noindex, nofollow">' : ''}
  <meta name="theme-color" content="#f4f1ea">

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
  <link rel="icon" type="image/png" sizes="48x48" href="${bp('/assets/favicon-48.png')}">
  <link rel="icon" type="image/png" sizes="512x512" href="${bp('/assets/favicon.png')}">
  <link rel="icon" type="image/x-icon" sizes="256x256" href="${bp('/assets/favicon.ico')}">
  <link rel="apple-touch-icon" sizes="512x512" href="${bp('/assets/favicon.png')}">

  <!-- Fonts — Cormorant Garamond (display), Manrope (UI), Lora (reading) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Manrope:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">

  <!-- Styles -->
  <link rel="stylesheet" href="${bp('/css/style.css')}?v=${Date.now()}">

  ${structuredData ? (Array.isArray(structuredData) ? structuredData : [structuredData]).map(json => `<!-- Structured Data -->
  <script type="application/ld+json">
${json}
  </script>`).join('\n  ') : ''}

  <!-- Google Analytics (skip admin pages) -->
  <script>
    if (!/^\\/admin(\\/|$)/.test(location.pathname)) {
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=G-HSDBJDBVCS';
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-HSDBJDBVCS');
    }
  </script>

  <!-- Analytics -->
  <script type="text/javascript">
    (function(e,c){if(!c.__SV){var l,h;window.mixpanel=c;c._i=[];c.init=function(q,r,f){function t(d,a){var g=a.split(".");2==g.length&&(d=d[g[0]],a=g[1]);d[a]=function(){d.push([a].concat(Array.prototype.slice.call(arguments,0)))}}var b=c;"undefined"!==typeof f?b=c[f]=[]:f="mixpanel";b.people=b.people||[];b.toString=function(d){var a="mixpanel";"mixpanel"!==f&&(a+="."+f);d||(a+=" (stub)");return a};b.people.toString=function(){return b.toString(1)+".people (stub)"};l="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders start_session_recording stop_session_recording people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
    for(h=0;h<l.length;h++)t(b,l[h]);var n="set set_once union unset remove delete".split(" ");b.get_group=function(){function d(p){a[p]=function(){b.push([g,[p].concat(Array.prototype.slice.call(arguments,0))])}}for(var a={},g=["get_group"].concat(Array.prototype.slice.call(arguments,0)),m=0;m<n.length;m++)d(n[m]);return a};c._i.push([q,r,f])};c.__SV=1.2;var k=e.createElement("script");k.type="text/javascript";k.async=!0;k.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===
    e.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";e=e.getElementsByTagName("script")[0];e.parentNode.insertBefore(k,e)}})(document,window.mixpanel||[]);
    mixpanel.init('52f2220068271346a45866162087fc9c', {
      autocapture: true,
      record_sessions_percent: 100,
    });
  </script>
  <script src="${bp('/js/analytics.js')}"></script>
  <script>
    Analytics.init('mixpanel');
    Analytics.trackPageView();
  </script>
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
  <a href="#main" class="skip-link">Skip to content</a>

  <header class="site-header">
    <div class="header-inner">
      <a href="${bp('/')}" class="brand">
        <img src="${bp('/assets/app-icon.png')}" alt="" class="brand-icon" width="38" height="38">
        <span class="brand-text">
          <span class="brand-name">Al-Anon Daily Paths</span>
          <span class="brand-sub">Daily reflections</span>
        </span>
      </a>
      <span class="header-divider" aria-hidden="true"></span>
      <nav class="site-nav" aria-label="Main navigation">
${desktopNav}
      </nav>
      <a href="${appHref}" class="btn btn--sm header-cta">Get the app</a>
      <button type="button" class="menu-toggle" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu">
        <span class="menu-glyph" aria-hidden="true"><span></span><span></span><span></span></span>
        <span data-menu-label>Menu</span>
      </button>
    </div>
    <div class="mobile-menu" id="mobile-menu" data-mobile-menu hidden>
      <nav aria-label="Mobile navigation">
${mobileNav}
      </nav>
      <a href="${appHref}" class="btn btn--full mobile-menu-cta">Get the app</a>
    </div>
  </header>

  <main id="main">
${bodyContent}
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <p class="footer-wordmark">Al-Anon Daily Paths</p>
        <p class="footer-tagline">Daily reflections for the Al-Anon journey.</p>
      </div>
      <div class="footer-col">
        <p class="footer-col-title">Read</p>
        <nav class="footer-links" aria-label="Readings">
          <a href="${bp(TODAY_PATH)}" data-today-link>Today&rsquo;s reflection</a>
          <a href="${bp('/steps/')}">The Twelve Steps</a>
          <a href="${bp('/themes/')}">Themes</a>
          <a href="${bp('/essentials/')}">Essentials</a>
        </nav>
      </div>
      <div class="footer-col">
        <p class="footer-col-title">Al-Anon</p>
        <nav class="footer-links" aria-label="About Al-Anon">
          <a href="${bp('/start/')}">Start here</a>
          <a href="${bp('/about-alanon/')}">About Al-Anon</a>
          <a href="${bp('/about-project/')}">About the project</a>
          <a href="https://al-anon.org" target="_blank" rel="noopener noreferrer">al-anon.org</a>
        </nav>
      </div>
      <div class="footer-col">
        <p class="footer-col-title">More</p>
        <nav class="footer-links" aria-label="More">
          <a href="${bp('/support/')}">Support</a>
          <a href="${bp('/privacy/')}">Privacy</a>
          <a href="${bp('/terms/')}">Terms</a>
          <a href="${appHref}">Get the app</a>
        </nav>
      </div>
    </div>
    <div class="footer-bar">
      <p>&copy; 2026 Daily Growth, LLC. All rights reserved.</p>
      <p>In crisis? Help is available 24/7. Call or text <strong>988</strong> (USA).</p>
    </div>
  </footer>

  <script src="${bp('/js/main.js')}" defer></script>
${bodyClass === 'page-reading' ? `  <script src="${bp('/js/calendar.js')}" defer></script>` : ''}
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
