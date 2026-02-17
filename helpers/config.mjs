/**
 * Shared site configuration.
 *
 * BASE_PATH is set via --base-path= CLI arg (e.g. --base-path=/dailypaths-web).
 * Defaults to '' for custom-domain deployments (dailypaths.org).
 */

const args = process.argv.slice(2);
const basePathArg = args.find(a => a.startsWith('--base-path='));

/** Path prefix for all internal links — empty string or '/repo-name' (no trailing slash) */
export const BASE_PATH = basePathArg ? basePathArg.split('=')[1].replace(/\/$/, '') : '';

/** Shorthand: prepend BASE_PATH to an absolute path */
export function bp(path) {
  return BASE_PATH + path;
}
