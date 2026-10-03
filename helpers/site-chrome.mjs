// Story Room pages that the site has no template for are published as complete saved pages, so their footer is whatever the
// site looked like on the day they were saved. This brings the parts that must stay current up to date from a page the build
// just made: the e-mail sign-up block (the live form, not the old disabled one), the script that runs it, and the style-sheet
// version label. Self-contained on purpose: the preview server embeds this function as text.
export function syncNewsletter(html, ref) {
  if (!html || !ref) return html;
  // Published CMS snapshots receive the shared contact section too, once only.
  const contactRe = /<section\b[^>]*class="site-contact"[^>]*>[\s\S]*?<\/section>/i;
  const contact = ref.match(contactRe)?.[0];
  let out = html;
  if (contact) out = contactRe.test(out) ? out.replace(contactRe, () => contact) : out.replace(/<footer\b/i, () => contact + '\n<footer');
  const sectionRe = /<section class="site-newsletter"[\s\S]*?<\/section>/i;
  const section = ref.match(sectionRe)?.[0];
  if (!section || !sectionRe.test(out)) return out;
  out = out.replace(sectionRe, () => section);
  const scriptRe = /<script[^>]*src="[^"]*\/js\/newsletter\.js[^"]*"[^>]*><\/script>/i;
  const script = ref.match(scriptRe)?.[0];
  if (script) out = scriptRe.test(out) ? out.replace(scriptRe, () => script) : out.replace(/<\/body>/i, () => script + '\n</body>');
  const css = ref.match(/site-system\.css\?v=[^"'\s>]+/)?.[0];
  if (css) out = out.replace(/site-system\.css\?v=[^"'\s>]+/g, () => css);
  return out;
}
