/**
 * Convert simple markdown (**bold** and *italic*) to HTML
 */
export function markdownToHtml(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

/**
 * Convert text with \\n\\n paragraph breaks into HTML paragraphs
 */
export function textToHtmlParagraphs(text) {
  if (!text) return '';
  // Normalize escaped newlines from JSON
  const normalized = text.replace(/\\n\\n/g, '\n\n').replace(/\\n/g, '\n');
  return normalized
    .split(/\n\n+/)
    .filter(p => p.trim())
    .map(para => `<p>${markdownToHtml(para.trim())}</p>`)
    .join('\n');
}

/**
 * Render a quote field — splits paragraphs, italicizes, handles attribution in parentheses
 */
export function renderQuote(quoteText) {
  if (!quoteText) return '';
  const normalized = quoteText.replace(/\\n\\n/g, '\n\n').replace(/\\n/g, '\n');
  let citation = '';
  const inner = normalized
    .split(/\n\n+/)
    .filter(p => p.trim())
    .map(para => {
      // Strip surrounding asterisks if present
      let cleaned = para.trim().replace(/^\*+|\*+$/g, '').trim();
      // Check for parenthetical attribution at the end
      const attrMatch = cleaned.match(/^(.*?)(\s*\(([^)]+)\)\s*)$/s);
      if (attrMatch) {
        const [, quote, , ref] = attrMatch;
        citation = ref.trim();
        return `<p class="quote-text"><em>${markdownToHtml(quote.trim())}</em></p>`;
      }
      return `<p class="quote-text"><em>${markdownToHtml(cleaned)}</em></p>`;
    })
    .join('\n');
  const footerHtml = citation
    ? `\n<footer class="source-citation-footer"><cite>${citation}</cite></footer>`
    : '';
  return `<blockquote class="source-citation">\n${inner}${footerHtml}\n</blockquote>`;
}

/**
 * Split a quote field into its body and its parenthetical citation.
 *
 * The design system's QuoteBlock sets the two separately — Lora for the
 * quotation, uppercase Manrope for the attribution — so callers need them
 * apart rather than as one pre-built blockquote.
 *
 * @param {string} quoteText
 * @returns {{ paragraphs: string[], citation: string }}
 */
export function parseQuote(quoteText) {
  if (!quoteText) return { text: '', citation: '' };
  const normalized = quoteText.replace(/\\n\\n/g, '\n\n').replace(/\\n/g, '\n');
  let citation = '';
  const paragraphs = normalized
    .split(/\n\n+/)
    .filter(p => p.trim())
    .map(para => {
      let cleaned = para.trim().replace(/^\*+|\*+$/g, '').trim();
      const attrMatch = cleaned.match(/^(.*?)(\s*\(([^)]+)\)\s*)$/s);
      if (attrMatch) {
        const [, quote, , ref] = attrMatch;
        citation = ref.trim();
        cleaned = quote.trim();
      }
      return markdownToHtml(cleaned);
    });

  return { paragraphs, citation };
}

/**
 * Strip markdown and HTML for use in meta descriptions
 */
export function stripForMeta(text, maxLength = 155) {
  if (!text) return '';
  const plain = text
    .replace(/\\n\\n/g, ' ')
    .replace(/\\n/g, ' ')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength - 3).replace(/\s+\S*$/, '') + '...';
}
