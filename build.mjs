#!/usr/bin/env node

/**
 * Daily Paths Static Site Generator
 *
 * Fetches 366 readings from Supabase and generates a full static site.
 *
 * Usage:
 *   node build.mjs              # Build with default CSS (version-a)
 *   node build.mjs --version=a  # Build with version A CSS
 *   node build.mjs --version=b  # Build with version B CSS
 */

import 'dotenv/config';
import { mkdirSync, writeFileSync, cpSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { fetchAllReadings } from './helpers/fetch-readings.mjs';
import { fetchAllSteps } from './helpers/fetch-steps.mjs';
import { fetchAllThemes } from './helpers/fetch-themes.mjs';
import { fetchReadingRatings } from './helpers/fetch-ratings.mjs';
import { fetchApprovedShares } from './helpers/fetch-shares.mjs';
import { dayToSlug } from './helpers/slug-utils.mjs';
import { generateSitemap, generateRobotsTxt } from './helpers/seo.mjs';
import { generateOgImage } from './helpers/og-image.mjs';

import { renderHomepage } from './templates/homepage.mjs';
import { renderReadingPage } from './templates/reading.mjs';
import { renderTopicsIndexPage, renderTopicPage, TOPICS } from './templates/topics.mjs';
import { TOPIC_PULL_QUOTES, TOPIC_TOOLS, TOPIC_THEME_TAGS } from './helpers/theme-data.mjs';
import { renderPrivacyPage } from './templates/privacy.mjs';
import { renderSupportPage } from './templates/support.mjs';
import { renderTermsPage } from './templates/terms.mjs';
import { renderEssentialsPage } from './templates/essentials.mjs';
import { renderAboutProjectPage } from './templates/about-project.mjs';
import { renderAboutAlanonPage } from './templates/about-alanon.mjs';
import { renderStepsIndexPage, renderStepPage, STEPS, STEP_TOOLS, STEP_HOOKS, STEP_TAGLINES, PULL_QUOTES } from './templates/steps.mjs';
import { renderLiteratureIndexPage, renderLiteraturePage, BOOKS } from './templates/literature.mjs';
import { renderMonthArchivePage } from './templates/month-archive.mjs';
import { renderAdminPage } from './templates/admin.mjs';
import { wrapInLayout } from './templates/base.mjs';
import { bp } from './helpers/config.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;

// Parse CLI args
const args = process.argv.slice(2);
const versionArg = args.find(a => a.startsWith('--version='));
const cssVersion = versionArg ? versionArg.split('=')[1] : 'b';
const outDir = join(ROOT, 'docs');

console.log(`\nDaily Paths Static Site Generator`);
console.log(`  CSS version: ${cssVersion}`);
console.log(`  Output: ${outDir}\n`);

const start = Date.now();

// --- Step 1: Fetch readings, steps, themes ---
console.log('Fetching readings from Supabase...');
const readings = await fetchAllReadings();

// Fetch steps from Supabase (optional — falls back to hardcoded STEPS)
console.log('Fetching steps from Supabase...');
const supabaseSteps = await fetchAllSteps().catch(err => {
  console.warn('  Steps fetch failed, using hardcoded data:', err.message);
  return null;
});

// Merge Supabase steps into STEPS array and lookup objects if available
if (supabaseSteps) {
  for (const dbStep of supabaseSteps) {
    const n = dbStep.number;
    const existing = STEPS.find(s => s.number === n);
    if (existing) {
      if (dbStep.description && dbStep.description.length > 0) existing.description = dbStep.description;
      if (dbStep.questions && dbStep.questions.length > 0) existing.questions = dbStep.questions;
    }
    // Update global lookup objects
    if (dbStep.hook) STEP_HOOKS[n] = dbStep.hook;
    if (dbStep.tagline) STEP_TAGLINES[n] = dbStep.tagline;
    if (dbStep.pull_quote) PULL_QUOTES[n] = dbStep.pull_quote;
    if (dbStep.tools && dbStep.tools.length > 0) STEP_TOOLS[n] = dbStep.tools;
  }
  console.log(`  Merged ${supabaseSteps.length} steps from Supabase`);
}

// Fetch themes from Supabase (optional — falls back to hardcoded TOPICS)
console.log('Fetching themes from Supabase...');
const supabaseThemes = await fetchAllThemes().catch(err => {
  console.warn('  Themes fetch failed, using hardcoded data:', err.message);
  return null;
});

// Merge Supabase themes into TOPICS array and lookup objects if available
if (supabaseThemes) {
  for (const dbTheme of supabaseThemes) {
    const slug = dbTheme.slug;
    const existing = TOPICS.find(t => t.slug === slug);
    if (existing) {
      if (dbTheme.body) existing.body = dbTheme.body;
      if (dbTheme.short_description) existing.shortDescription = dbTheme.short_description;
      if (dbTheme.meta_description) existing.metaDescription = dbTheme.meta_description;
      if (dbTheme.featured_days && dbTheme.featured_days.length > 0) existing.featuredDays = dbTheme.featured_days;
    }
    // Update global lookup objects
    if (dbTheme.pull_quote) TOPIC_PULL_QUOTES[slug] = dbTheme.pull_quote;
    if (dbTheme.tools && dbTheme.tools.length > 0) TOPIC_TOOLS[slug] = dbTheme.tools;
    if (dbTheme.theme_tags && dbTheme.theme_tags.length > 0) TOPIC_THEME_TAGS[slug] = dbTheme.theme_tags;
  }
  console.log(`  Merged ${supabaseThemes.length} themes from Supabase`);
}

// Fetch reading ratings for auto-featured readings on principle pages
console.log('Fetching reading ratings from Supabase...');
const ratingsMap = await fetchReadingRatings().catch(err => {
  console.warn('  Ratings fetch failed, featured readings will fall back to manual:', err.message);
  return new Map();
});

// Fetch approved member shares for principle pages
console.log('Fetching member shares from Supabase...');
const sharesMap = await fetchApprovedShares().catch(err => {
  console.warn('  Shares fetch failed, using hardcoded defaults:', err.message);
  return new Map();
});

// --- Step 2: Clean and create output directory ---
console.log('Preparing output directory...');
if (existsSync(outDir)) {
  rmSync(outDir, { recursive: true });
}

const dirs = [
  outDir,
  join(outDir, 'css'),
  join(outDir, 'js'),
  join(outDir, 'assets'),
  join(outDir, 'themes'),
  join(outDir, 'privacy'),
  join(outDir, 'support'),
  join(outDir, 'terms'),
  join(outDir, 'essentials'),
  join(outDir, 'about-project'),
  join(outDir, 'about-alanon'),
  join(outDir, 'steps'),
  ...Array.from({ length: 12 }, (_, i) => join(outDir, 'steps', `step-${i + 1}`)),
  join(outDir, 'literature'),
  ...BOOKS.map(b => join(outDir, 'literature', b.slug)),
  join(outDir, 'admin'),
  join(outDir, 'months'),
  ...Array.from({ length: 12 }, (_, i) => {
    const months = ['january','february','march','april','may','june','july','august','september','october','november','december'];
    return join(outDir, 'months', months[i]);
  }),
];
dirs.forEach(d => mkdirSync(d, { recursive: true }));

// Create reading page directories
for (const reading of readings) {
  const slug = dayToSlug(reading.day_of_year);
  mkdirSync(join(outDir, slug), { recursive: true });
}

// Create theme (topic) page directories
for (const topic of TOPICS) {
  mkdirSync(join(outDir, 'themes', topic.slug), { recursive: true });
}

// --- Step 3: Generate pages ---
let pageCount = 0;

function writePage(filePath, html) {
  writeFileSync(filePath, html, 'utf-8');
  pageCount++;
}

// Homepage — show today's reading
console.log('Generating homepage...');
const now = new Date();
const todayMonth = now.getMonth(); // 0-indexed
const todayDate = now.getDate();
const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let todayDayOfYear = todayDate;
for (let m = 0; m < todayMonth; m++) todayDayOfYear += daysInMonth[m];
const todayIdx = readings.findIndex(r => r.day_of_year === todayDayOfYear);
const todayReading = readings[todayIdx >= 0 ? todayIdx : 0];
const todayPrev = readings[(todayIdx - 1 + readings.length) % readings.length];
const todayNext = readings[(todayIdx + 1) % readings.length];
writePage(join(outDir, 'index.html'), renderHomepage(todayReading, todayPrev, todayNext, readings));

// Reading pages
console.log('Generating 366 reading pages...');
for (let i = 0; i < readings.length; i++) {
  const reading = readings[i];
  const prev = readings[(i - 1 + readings.length) % readings.length];
  const next = readings[(i + 1) % readings.length];
  const slug = dayToSlug(reading.day_of_year);
  writePage(join(outDir, slug, 'index.html'), renderReadingPage(reading, prev, next, readings));
}

// Principles index + individual principle pages
console.log(`Generating principle pages (${TOPICS.length} principles)...`);
writePage(join(outDir, 'themes', 'index.html'), renderTopicsIndexPage());

// Build a readings lookup by day_of_year for featured reading resolution
const readingsByDay = new Map();
for (const reading of readings) {
  readingsByDay.set(reading.day_of_year, reading);
}

for (const topic of TOPICS) {
  // Auto-select top-rated readings as featured for this principle
  const themeTags = TOPIC_THEME_TAGS[topic.slug] || [];
  const matchedReadings = readings.filter(
    r => r.secondary_theme && themeTags.includes(r.secondary_theme)
  );

  let featuredReadings;
  if (ratingsMap.size > 0 && matchedReadings.length > 0) {
    // Sort by positive rating count (highest first), then by total ratings
    featuredReadings = matchedReadings
      .slice()
      .sort((a, b) => {
        const ra = ratingsMap.get(a.day_of_year) || { positive: 0, total: 0 };
        const rb = ratingsMap.get(b.day_of_year) || { positive: 0, total: 0 };
        if (rb.positive !== ra.positive) return rb.positive - ra.positive;
        return rb.total - ra.total;
      })
      .slice(0, 5);
  } else {
    // Fallback to manual featured_days if no ratings data
    featuredReadings = (topic.featuredDays || [])
      .map(day => readingsByDay.get(day))
      .filter(Boolean);
  }

  // Get approved shares for this theme (most recent first)
  const topicShares = sharesMap.get(topic.slug) || [];

  writePage(
    join(outDir, 'themes', topic.slug, 'index.html'),
    renderTopicPage(topic, featuredReadings, readings, topicShares)
  );
}

// Static content pages
console.log('Generating static pages...');
writePage(join(outDir, 'privacy', 'index.html'), renderPrivacyPage());
writePage(join(outDir, 'support', 'index.html'), renderSupportPage());
writePage(join(outDir, 'terms', 'index.html'), renderTermsPage());
writePage(join(outDir, 'essentials', 'index.html'), renderEssentialsPage());
writePage(join(outDir, 'about-project', 'index.html'), renderAboutProjectPage());
writePage(join(outDir, 'about-alanon', 'index.html'), renderAboutAlanonPage());
// Admin page
console.log('Generating admin page...');
writePage(join(outDir, 'admin', 'index.html'), renderAdminPage());

// Steps index + individual step pages
console.log('Generating step pages (12 steps)...');
writePage(join(outDir, 'steps', 'index.html'), renderStepsIndexPage());

for (const step of STEPS) {
  writePage(
    join(outDir, 'steps', `step-${step.number}`, 'index.html'),
    renderStepPage(step, readings)
  );
}

// Month archive pages (one per month)
console.log('Generating month archive pages (12 months)...');
const monthNames = ['january','february','march','april','may','june','july','august','september','october','november','december'];
for (let m = 0; m < 12; m++) {
  writePage(
    join(outDir, 'months', monthNames[m], 'index.html'),
    renderMonthArchivePage(m, readings)
  );
}

// Literature index + individual book pages
console.log(`Generating literature pages (${BOOKS.length} books)...`);
writePage(join(outDir, 'literature', 'index.html'), renderLiteratureIndexPage());

for (const book of BOOKS) {
  writePage(
    join(outDir, 'literature', book.slug, 'index.html'),
    renderLiteraturePage(book)
  );
}

// 404 page
const notFoundHtml = wrapInLayout({
  title: 'Page Not Found | Al-Anon Daily Paths',
  description: 'The page you are looking for could not be found.',
  canonicalPath: '/404.html',
  bodyContent: `
    <div class="error-page">
      <h1>404</h1>
      <p>The page you're looking for isn't here.</p>
      <a href="${bp('/')}" class="btn-primary">Go Home</a>
    </div>`,
  bodyClass: 'page-404',
  noindex: true,
});
writePage(join(outDir, '404.html'), notFoundHtml);

// --- Step 4: Generate OG images for reading pages ---
console.log('Generating 366 OG images...');
const ogStart = Date.now();
const BATCH_SIZE = 50;
for (let i = 0; i < readings.length; i += BATCH_SIZE) {
  const batch = readings.slice(i, i + BATCH_SIZE);
  await Promise.all(batch.map(async (reading) => {
    const slug = dayToSlug(reading.day_of_year);
    const png = await generateOgImage(reading);
    writeFileSync(join(outDir, slug, 'og.png'), png);
  }));
}
const ogElapsed = ((Date.now() - ogStart) / 1000).toFixed(1);
console.log(`  OG images generated in ${ogElapsed}s`);

// --- Step 5: Generate SEO artifacts ---
console.log('Generating sitemap and robots.txt...');
writeFileSync(join(outDir, 'sitemap.xml'), generateSitemap(readings, TOPICS, BOOKS), 'utf-8');
writeFileSync(join(outDir, 'robots.txt'), generateRobotsTxt(), 'utf-8');

// --- Step 6: Copy static assets ---
console.log('Copying static assets...');

// CSS
const cssSource = join(__dirname, 'css', `version-${cssVersion}.css`);
if (!existsSync(cssSource)) {
  console.error(`CSS file not found: ${cssSource}`);
  process.exit(1);
}
cpSync(cssSource, join(outDir, 'css', 'style.css'));

// JS
cpSync(join(__dirname, 'js', 'main.js'), join(outDir, 'js', 'main.js'));
cpSync(join(__dirname, 'js', 'admin.js'), join(outDir, 'js', 'admin.js'));
cpSync(join(__dirname, 'js', 'analytics.js'), join(outDir, 'js', 'analytics.js'));

// Admin CSS
cpSync(join(__dirname, 'css', 'admin.css'), join(outDir, 'css', 'admin.css'));

// Assets — copy from existing repo if available, otherwise from local assets
const existingAssetsDir = join(ROOT, 'src', 'assets');
const localAssetsDir = join(__dirname, 'assets');

// Logo
const logoSources = [
  join(localAssetsDir, 'logo.png'),
  join(existingAssetsDir, 'logo.png'),
];
for (const src of logoSources) {
  if (existsSync(src)) {
    cpSync(src, join(outDir, 'assets', 'logo.png'));
    break;
  }
}

// Favicons
const faviconSources = [
  { src: join(localAssetsDir, 'favicon.png'), dest: 'favicon.png' },
  { src: join(localAssetsDir, 'favicon.ico'), dest: 'favicon.ico' },
];
for (const f of faviconSources) {
  if (existsSync(f.src)) {
    cpSync(f.src, join(outDir, 'assets', f.dest));
  }
}

// App Store badge
if (existsSync(join(localAssetsDir, 'app-store-badge.svg'))) {
  cpSync(join(localAssetsDir, 'app-store-badge.svg'), join(outDir, 'assets', 'app-store-badge.svg'));
}

// OG image
if (existsSync(join(localAssetsDir, 'og-image.png'))) {
  cpSync(join(localAssetsDir, 'og-image.png'), join(outDir, 'assets', 'og-image.png'));
}

// Homepage banner
if (existsSync(join(localAssetsDir, 'hero-image.jpg'))) {
  cpSync(join(localAssetsDir, 'hero-image.jpg'), join(outDir, 'assets', 'hero-image.jpg'));
}

// Theme images
const themesAssetsDir = join(localAssetsDir, 'themes');
if (existsSync(themesAssetsDir)) {
  cpSync(themesAssetsDir, join(outDir, 'assets', 'themes'), { recursive: true });
}

// Book cover images
for (const book of BOOKS) {
  const src = join(localAssetsDir, book.image);
  if (existsSync(src)) {
    cpSync(src, join(outDir, 'assets', book.image));
  }
}

// CNAME for GitHub Pages custom domain
writeFileSync(join(outDir, 'CNAME'), 'dailypaths.org', 'utf-8');

// --- Done ---
const elapsed = ((Date.now() - start) / 1000).toFixed(2);
console.log(`\nDone! Generated ${pageCount} pages in ${elapsed}s`);
console.log(`Output: ${outDir}`);
