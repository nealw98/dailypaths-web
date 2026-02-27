/**
 * Shared site configuration.
 *
 * BASE_PATH is set via --base-path= CLI arg (e.g. --base-path=/dailypaths-web).
 * Defaults to '' for custom-domain deployments (dailypaths.org).
 *
 * BASE_URL is the absolute origin used for canonical URLs, OG tags, sitemaps, etc.
 * Set SITE_ENV=production to use the custom domain; otherwise defaults to GitHub Pages.
 */

const args = process.argv.slice(2);
const basePathArg = args.find(a => a.startsWith('--base-path='));

/** Path prefix for all internal links — empty string or '/repo-name' (no trailing slash) */
export const BASE_PATH = basePathArg ? basePathArg.split('=')[1].replace(/\/$/, '') : '';

/** Absolute site origin for SEO (canonical, og:url, sitemap, robots.txt) */
export const BASE_URL = 'https://dailypaths.org';

/** Shorthand: prepend BASE_PATH to an absolute path */
export function bp(path) {
  return BASE_PATH + path;
}
