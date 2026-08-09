/**
 * Shared UI primitives for the Daily Paths design system.
 *
 * The design system's own hand-drawn line icons (32×32 grid, fill:none, round
 * caps), the ripple motif, store badges, and the layout blocks that repeat
 * across pages — photo heroes, section headers, teal bands, app panels.
 *
 * Source of truth for icon geometry and token values is the design system
 * bundled with the handoff, under _ds/daily-paths-design-system.
 */

import { bp } from '../helpers/config.mjs';

export const APP_STORE_URL = 'https://apps.apple.com/app/id6755981862';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.nealw98.dailypaths';
export const MEETING_DIRECTORY_URL = 'https://al-anon.org/al-anon-meetings/find-an-al-anon-meeting/';

/* ─────────────────────────── Icons ─────────────────────────── */

/**
 * Design system line icons. Each value is the inner markup of a 32×32 viewBox.
 * Stroke widths are baked per-path (1.6 default / 1.8 active), matching the
 * design system; opacity carries the hand-drawn water layering.
 */
const ICON_PATHS = {
  feather:
    '<path d="M26 4c-8 2-12 8-14 16l-4 8 8-4c8-2 14-6 16-14" stroke-width="1.6"/>' +
    '<path d="M12 20L26 4" stroke-width="1.6"/>',

  seedling:
    '<path d="M16 28V16" stroke-width="1.8"/>' +
    '<path d="M16 16c0-6 6-10 12-8-2 6-6 8-12 8Z" stroke-width="1.8"/>' +
    '<path d="M16 20c0-5-5-8-10-7 1.5 5 5 7 10 7Z" stroke-width="1.8"/>',

  softExhale:
    '<path d="M6 16c4-6 8-6 10-3s6 3 10-3" stroke-width="1.8"/>' +
    '<path d="M6 22c3-4 6-4 8-2s5 2 8-2" stroke-width="1.8" opacity="0.55"/>' +
    '<path d="M8 27c2-3 4-3 6-1.5s4 1.5 6-1.5" stroke-width="1.8" opacity="0.3"/>',

  lightOnWater:
    '<circle cx="16" cy="14" r="4" stroke-width="1.5"/>' +
    '<path d="M16 7V5" stroke-width="1.4" opacity="0.6"/>' +
    '<path d="M21.5 9l1.5-1.5" stroke-width="1.6" opacity="0.45"/>' +
    '<path d="M10.5 9l-1.5-1.5" stroke-width="1.6" opacity="0.45"/>' +
    '<path d="M23 14h2" stroke-width="1.6" opacity="0.35"/>' +
    '<path d="M7 14h2" stroke-width="1.6" opacity="0.35"/>' +
    '<path d="M3 20c4-1.5 7 0 13-1s9-1.5 13 0" stroke-width="1.6"/>' +
    '<path d="M4 24c4-1 7 0 12-1s8-1 12 0" stroke-width="1.3" opacity="0.4"/>' +
    '<path d="M6 27.5c3-.8 5 0 10-.8s7-.8 10 0" stroke-width="1.2" opacity="0.2"/>',

  leafOnWater:
    '<path d="M12 10c4-3 10-3 13 0-3 4-8 6-13 4Z" stroke-width="1.6"/>' +
    '<path d="M12 10c4 1 7 1 10 0" stroke-width="1.2" opacity="0.5"/>' +
    '<path d="M12 10c-1 2-2 4-2 6" stroke-width="1.4"/>' +
    '<path d="M6 20c3-1.5 6 0 10-1s7-1.5 10 0" stroke-width="1.4"/>' +
    '<path d="M4 24c4-1.5 7 0 12-1s8-1.5 12 0" stroke-width="1.4" opacity="0.5"/>' +
    '<path d="M6 28c3-1 5 0 10-1s7-1 10 0" stroke-width="1.2" opacity="0.25"/>',

  stackedStones:
    '<path d="M16 4a2 2 0 1 1 0 4 2 2 0 1 1 0-4" stroke-width="1.6"/>' +
    '<path d="M11.5 9a4.5 2.5 0 1 1 9 0 4.5 2.5 0 1 1-9 0" stroke-width="1.6"/>' +
    '<path d="M9.5 15a6.5 3 0 1 1 13 0 6.5 3 0 1 1-13 0" stroke-width="1.6"/>' +
    '<path d="M7 21.5a9 3.5 0 1 1 18 0 9 3.5 0 1 1-18 0" stroke-width="1.6"/>',

  book:
    '<path d="M5 6h9a3 3 0 0 1 3 3v17a3 3 0 0 0-3-3H5z" stroke-width="1.6"/>' +
    '<path d="M27 6h-9a3 3 0 0 0-3 3v17a3 3 0 0 1 3-3h9z" stroke-width="1.6"/>',

  chevronRight: '<path d="M13 8l8 8-8 8" stroke-width="2"/>',
};

/**
 * Render a design system icon as inline SVG.
 *
 * @param {string} name - Key in ICON_PATHS
 * @param {Object} [options]
 * @param {number} [options.size=24] - Square size in px
 * @param {string} [options.className] - Extra class on the <svg>
 */
export function icon(name, { size = 24, className = '' } = {}) {
  const paths = ICON_PATHS[name];
  if (!paths) return '';
  return `<svg class="dp-icon${className ? ` ${className}` : ''}" width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

/* ─────────────────────────── Ripple motif ─────────────────────────── */

/** Six hairline circles from a corner — the water signature. */
const RIPPLES = [[50, 0.45], [80, 0.32], [110, 0.22], [140, 0.15], [170, 0.1], [200, 0.06]];

/**
 * The ripple field. Bleeds off the top-right of its positioned container.
 *
 * @param {number} [size=520] - Rendered square size in px
 */
export function ripple(size = 520) {
  const circles = RIPPLES
    .map(([r, o]) => `<circle cx="200" cy="200" r="${r}" stroke="#FFFFFF" stroke-width="0.75" fill="none" opacity="${o}"/>`)
    .join('');
  const offset = -size / 2;
  return `<svg class="ripple-field" width="${size}" height="${size}" viewBox="0 0 400 400" aria-hidden="true" style="right:${offset}px;top:${offset}px">${circles}</svg>`;
}

/* ─────────────────────────── Store badges ─────────────────────────── */

/**
 * Official Apple and Google store badge artwork.
 *
 * @param {Object} [options]
 * @param {string} [options.context] - Analytics/label context, e.g. "home"
 */
export function storeBadges({ context = '' } = {}) {
  const suffix = context ? ` Al-Anon Daily Paths` : '';
  // width/height carry each badge's true aspect ratio so the box is reserved
  // before CSS lands. Apple's SVG is 119.664×40; Google's PNG is 646×250.
  return `<div class="store-badges">
          <a href="${APP_STORE_URL}" target="_blank" rel="noopener noreferrer" class="store-badge-link">
            <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="Download${suffix} on the App Store" class="store-badge store-badge--ios" width="120" height="40" loading="lazy">
          </a>
          <a href="${PLAY_STORE_URL}" target="_blank" rel="noopener noreferrer" class="store-badge-link">
            <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get${suffix} on Google Play" class="store-badge store-badge--play" width="154" height="60" loading="lazy">
          </a>
        </div>`;
}

/* ─────────────────────────── Layout blocks ─────────────────────────── */

/**
 * Full-bleed photo hero with the standard scrim.
 *
 * @param {Object} options
 * @param {string} options.image - Path (already run through bp())
 * @param {string} options.alt
 * @param {string} [options.eyebrow] - Small uppercase label above the title
 * @param {string} options.title
 * @param {string} [options.subtitle] - Lora sub-line
 * @param {string} [options.size] - "sm" | "md" | "lg" — controls min-height
 * @param {string} [options.titleClass] - Extra class for measure/weight tweaks
 */
export function photoHero({ image, alt, eyebrow, title, subtitle, size = 'md', titleClass = '' }) {
  return `<header class="photo-hero photo-hero--${size}">
        <img class="photo-hero-img" src="${image}" alt="${alt}" />
        <div class="photo-hero-scrim"></div>
        <div class="photo-hero-inner">
          ${eyebrow ? `<p class="eyebrow eyebrow--on-dark">${eyebrow}</p>` : ''}
          <h1 class="photo-hero-title${titleClass ? ` ${titleClass}` : ''}">${title}</h1>
          ${subtitle ? `<p class="photo-hero-sub">${subtitle}</p>` : ''}
        </div>
      </header>`;
}

/**
 * Section header: heading + description on the left, a text link on the right.
 */
export function sectionHeader({ heading, description, linkHref, linkLabel }) {
  return `<div class="section-head">
          <div class="section-head-text">
            <h2 class="section-title">${heading}</h2>
            ${description ? `<p class="section-desc">${description}</p>` : ''}
          </div>
          ${linkHref ? `<a href="${linkHref}" class="text-link">${linkLabel}</a>` : ''}
        </div>`;
}

/**
 * Prev / next rail above a hero (Step and Theme detail pages).
 */
export function detailRail({ prevHref, prevLabel, allHref, allLabel, nextHref, nextLabel }) {
  return `<nav class="detail-rail" aria-label="${allLabel}">
        <div class="detail-rail-inner">
          <a href="${prevHref}" class="detail-rail-link">&larr; ${prevLabel}</a>
          <a href="${allHref}" class="detail-rail-link detail-rail-link--all">${allLabel}</a>
          <a href="${nextHref}" class="detail-rail-link detail-rail-link--next">${nextLabel} &rarr;</a>
        </div>
      </nav>`;
}

/**
 * App CTA panel.
 *
 * @param {Object} options
 * @param {'white'|'seafoam'|'gradient'} options.tone
 * @param {string} options.heading
 * @param {string} options.text
 * @param {boolean} [options.showIcon] - Show the 64px app icon lockup (home)
 * @param {string} [options.context] - Passed to storeBadges for alt text
 */
export function appPanel({ tone = 'seafoam', heading, text, showIcon = false, context = '' }) {
  const iconLockup = showIcon
    ? `<div class="app-panel-lockup">
              <img src="${bp('/assets/app-icon.png')}" alt="Al-Anon Daily Paths app icon" class="app-panel-icon" width="64" height="64" loading="lazy">
              <div>
                <p class="app-panel-name">Al-Anon Daily Paths</p>
                <p class="app-panel-platforms">iPhone &middot; Android</p>
              </div>
            </div>`
    : '';

  return `<section class="app-panel app-panel--${tone}">
          ${tone === 'gradient' ? ripple(520) : ''}
          <div class="app-panel-inner">
            <div class="app-panel-text">
              <h2 class="app-panel-heading">${heading}</h2>
              <p class="app-panel-body">${text}</p>
            </div>
            <div class="app-panel-actions">
              ${iconLockup}
              ${storeBadges({ context })}
            </div>
          </div>
        </section>`;
}

/**
 * Full-bleed teal band with the ripple motif and a two-column body.
 *
 * @param {Object} options
 * @param {string} options.eyebrow
 * @param {string} options.heading
 * @param {string} options.body - Lora paragraph HTML
 * @param {string} [options.actions] - Markup for the button row
 * @param {string} [options.aside] - Markup for the translucent right panel
 */
export function tealBand({ eyebrow, heading, body, actions = '', aside = '' }) {
  return `<section class="teal-band">
        ${ripple(640)}
        <div class="teal-band-inner">
          <div class="teal-band-main">
            ${eyebrow ? `<p class="eyebrow eyebrow--on-dark">${eyebrow}</p>` : ''}
            <h2 class="teal-band-heading">${heading}</h2>
            <p class="teal-band-body">${body}</p>
            ${actions ? `<div class="teal-band-actions">${actions}</div>` : ''}
          </div>
          ${aside}
        </div>
      </section>`;
}

/**
 * Translucent panel used inside teal bands (Serenity Prayer, crisis line).
 */
export function glassPanel({ label, lines, caption }) {
  return `<div class="glass-panel">
            <p class="glass-panel-label">${label}</p>
            <p class="glass-panel-verse">${lines.join('<br>')}</p>
            ${caption ? `<p class="glass-panel-caption">${caption}</p>` : ''}
          </div>`;
}

/**
 * Design system Pill. Renders as a link when href is given, else a span.
 */
export function pill(label, { href, selected = false, className = '' } = {}) {
  const cls = `pill${selected ? ' pill--selected' : ''}${className ? ` ${className}` : ''}`;
  return href
    ? `<a href="${href}" class="${cls}">${label}</a>`
    : `<span class="${cls}">${label}</span>`;
}

/**
 * QuoteBlock — open-quote glyph plus Lora quotation and uppercase attribution.
 */
export function quoteBlock({ text, attribution, align = 'left' }) {
  return `<figure class="quote-block${align === 'center' ? ' quote-block--center' : ''}">
            <span class="quote-block-glyph" aria-hidden="true">&ldquo;</span>
            <div class="quote-block-body">
              <blockquote class="quote-block-text">${text}</blockquote>
              ${attribution ? `<figcaption class="quote-block-attr">${attribution}</figcaption>` : ''}
            </div>
          </figure>`;
}

/**
 * Small reading card: uppercase date over a title. Used in reading grids.
 */
export function readingCard({ href, date, title, className = '', tone = 'white' }) {
  return `<a href="${href}" class="reading-card reading-card--${tone}${className ? ` ${className}` : ''}">
                <span class="reading-card-date">${date}</span>
                <span class="reading-card-title">${title}</span>
              </a>`;
}
