// Replacements for recommendations to legacy essays awaiting a 2.0 rewrite.
// These are internal-link choices, not redirects or publication decisions.
// Self-contained: embedded in the CMS preview Worker for saved publications too.
export function internalLinkDestination(path, theme = '', source = '') {
 const two='/steps/al-anon-step-2-hope/';
 const three='/steps/al-anon-step-3-faith/';
 const eleven='/steps/al-anon-step-11-connection/';
 if (path === '/topics/higher-power/' || path === '/themes/higher-power/') {
  if (source === two) return null; // The surrounding Step Two text already explains it.
  if (source === '/articles/letting-go/') return three;
  if (/\/steps\/al-anon-step-(5|7|10|12)-/.test(source)) return eleven;
  if (/\/steps\/al-anon-step-6-/.test(source)) return three;
  if (['Prayer','Prayer and Meditation','Spiritual Connection','Spiritual intimacy','Spirit','Awakening','Spiritual Growth'].includes(theme)) return eleven;
  if (['Faith','Trust','Reliance','Trust in a Higher Power'].includes(theme)) return three;
  return two;
 }
 if (path === '/topics/focus-on-yourself/' || path === '/themes/focus-on-yourself/') {
  return ['Self-Care','Self-love','Self-Acceptance'].includes(theme) ? '/guides/boundaries/' : '/guides/surrender/';
 }
 if (path === '/topics/the-disease/' || path === '/themes/the-disease/') return '/guides/finding-help/';
 if (path === '/october-31/' || path === '/october-31-the-intimacy-of-transparency/') return '/october-31-afraid-i-did-it-wrong/';
 return undefined;
}
