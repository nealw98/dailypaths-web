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
import { dayToSlug, themeToSlug } from './helpers/slug-utils.mjs';
import { generateSitemap, generateRobotsTxt } from './helpers/seo.mjs';

import { renderHomepage } from './templates/homepage.mjs';
import { renderReadingPage } from './templates/reading.mjs';
import { renderBrowseDatePage } from './templates/browse-date.mjs';
import { renderThemesIndexPage, renderThemePage } from './templates/browse-themes.mjs';
import { renderPrivacyPage } from './templates/privacy.mjs';
import { renderSupportPage } from './templates/support.mjs';
import { renderTermsPage } from './templates/terms.mjs';
import { wrapInLayout } from './templates/base.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;

// Parse CLI args
const args = process.argv.slice(2);
const versionArg = args.find(a => a.startsWith('--version='));
const cssVersion = versionArg ? versionArg.split('=')[1] : 'a';
const outDir = join(ROOT, 'docs');

console.log(`\nDaily Paths Static Site Generator`);
console.log(`  CSS version: ${cssVersion}`);
console.log(`  Output: ${outDir}\n`);

const start = Date.now();

// --- Step 1: Fetch readings ---
console.log('Fetching readings from Supabase...');
const readings = await fetchAllReadings();

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
  join(outDir, 'browse'),
  join(outDir, 'themes'),
  join(outDir, 'privacy'),
  join(outDir, 'support'),
  join(outDir, 'terms'),
];
dirs.forEach(d => mkdirSync(d, { recursive: true }));

// Create reading page directories
for (const reading of readings) {
  const slug = dayToSlug(reading.day_of_year);
  mkdirSync(join(outDir, slug), { recursive: true });
}

// Create theme page directories
const themeMap = new Map();
for (const reading of readings) {
  if (reading.secondary_theme) {
    const theme = reading.secondary_theme;
    if (!themeMap.has(theme)) themeMap.set(theme, []);
    themeMap.get(theme).push(reading);
  }
}
for (const theme of themeMap.keys()) {
  const slug = themeToSlug(theme);
  mkdirSync(join(outDir, 'themes', slug), { recursive: true });
}

// --- Step 3: Generate pages ---
let pageCount = 0;

function writePage(filePath, html) {
  writeFileSync(filePath, html, 'utf-8');
  pageCount++;
}

// Homepage
console.log('Generating homepage...');
writePage(join(outDir, 'index.html'), renderHomepage());

// Reading pages
console.log('Generating 366 reading pages...');
for (let i = 0; i < readings.length; i++) {
  const reading = readings[i];
  const prev = readings[(i - 1 + readings.length) % readings.length];
  const next = readings[(i + 1) % readings.length];
  const slug = dayToSlug(reading.day_of_year);
  writePage(join(outDir, slug, 'index.html'), renderReadingPage(reading, prev, next));
}

// Browse by date
console.log('Generating browse page...');
writePage(join(outDir, 'browse', 'index.html'), renderBrowseDatePage(readings));

// Themes index + individual theme pages
console.log(`Generating theme pages (${themeMap.size} themes)...`);
writePage(join(outDir, 'themes', 'index.html'), renderThemesIndexPage(themeMap));
for (const [theme, themeReadings] of themeMap) {
  const slug = themeToSlug(theme);
  writePage(join(outDir, 'themes', slug, 'index.html'), renderThemePage(theme, themeReadings));
}

// Static content pages
console.log('Generating static pages...');
writePage(join(outDir, 'privacy', 'index.html'), renderPrivacyPage());
writePage(join(outDir, 'support', 'index.html'), renderSupportPage());
writePage(join(outDir, 'terms', 'index.html'), renderTermsPage());

// 404 page
const notFoundHtml = wrapInLayout({
  title: 'Page Not Found | Daily Paths',
  description: 'The page you are looking for could not be found.',
  canonicalPath: '/404.html',
  bodyContent: `
    <div class="error-page">
      <h1>404</h1>
      <p>The page you're looking for isn't here.</p>
      <a href="/" class="btn-primary">Go Home</a>
    </div>`,
  bodyClass: 'page-404',
});
writePage(join(outDir, '404.html'), notFoundHtml);

// --- Step 4: Generate SEO artifacts ---
console.log('Generating sitemap and robots.txt...');
const themes = [...themeMap.keys()];
writeFileSync(join(outDir, 'sitemap.xml'), generateSitemap(readings, themes), 'utf-8');
writeFileSync(join(outDir, 'robots.txt'), generateRobotsTxt(), 'utf-8');

// --- Step 5: Copy static assets ---
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

// CNAME for GitHub Pages
writeFileSync(join(outDir, 'CNAME'), 'dailypaths.org', 'utf-8');

// --- Done ---
const elapsed = ((Date.now() - start) / 1000).toFixed(2);
console.log(`\nDone! Generated ${pageCount} pages in ${elapsed}s`);
console.log(`Output: ${outDir}`);
