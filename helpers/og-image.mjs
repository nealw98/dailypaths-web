import satori from 'satori';
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fontsDir = join(__dirname, '..', 'fonts');

// Load fonts once
const cormorantData = readFileSync(join(fontsDir, 'CormorantGaramond-SemiBold.ttf'));
const interData = readFileSync(join(fontsDir, 'Inter-Regular.ttf'));
const loraItalicData = readFileSync(join(fontsDir, 'Lora-Italic.ttf'));

const fonts = [
  { name: 'Cormorant Garamond', data: cormorantData, weight: 600, style: 'normal' },
  { name: 'Inter', data: interData, weight: 400, style: 'normal' },
  { name: 'Lora', data: loraItalicData, weight: 400, style: 'italic' },
];

/**
 * Parse a raw quote field into { text, attribution }.
 * Input:  "We come to Al-Anon because... (Paths to Recovery, p. 7)"
 * Output: { text: "We come to Al-Anon because...", attribution: "Paths to Recovery" }
 */
function parseQuote(rawQuote) {
  if (!rawQuote) return { text: '', attribution: '' };

  let text = rawQuote
    .replace(/\\n\\n/g, ' ')
    .replace(/\\n/g, ' ')
    .replace(/\*+/g, '')
    .trim();

  // Extract attribution: "(Book Title, p. XX)" or "(Book Title, p. XX-YY)"
  let attribution = '';
  const attrMatch = text.match(/\(([^,]+),\s*p\.\s*[\d–-]+\)\s*$/);
  if (attrMatch) {
    attribution = attrMatch[1].trim();
    text = text.replace(/\s*\([^)]+\)\s*$/, '').trim();
  }

  // Strip surrounding smart quotes
  text = text.replace(/^["""\u201C]+/, '').replace(/["""\u201D]+$/, '').trim();

  // Truncate if too long for the card
  if (text.length > 140) {
    text = text.slice(0, 137).replace(/\s+\S*$/, '') + '\u2026';
  }

  return { text, attribution };
}

/**
 * Generate an OG image (1200x630 PNG) for a reading.
 *
 * @param {Object} reading - Reading object with title, display_date, quote
 * @returns {Promise<Buffer>} PNG buffer
 */
export async function generateOgImage(reading) {
  const { text: quoteText, attribution } = parseQuote(reading.quote);

  // Build the quote + attribution children
  const quoteChildren = [];
  if (quoteText) {
    quoteChildren.push({
      type: 'p',
      props: {
        style: {
          fontSize: '22px',
          fontFamily: 'Lora',
          fontStyle: 'italic',
          color: '#2D3B3D',
          opacity: '0.7',
          margin: '0',
          lineHeight: '1.5',
          maxWidth: '800px',
        },
        children: `\u201C${quoteText}\u201D`,
      },
    });
    if (attribution) {
      quoteChildren.push({
        type: 'p',
        props: {
          style: {
            fontSize: '17px',
            fontFamily: 'Inter',
            color: '#4E8C89',
            margin: '4px 0 0',
            opacity: '0.6',
          },
          children: `\u2014 ${attribution}`,
        },
      });
    }
  }

  const markup = {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px 64px',
        background: 'linear-gradient(135deg, #F8F8F6 0%, #E6EFEE 50%, #AFCFCD 100%)',
        fontFamily: 'Inter',
      },
      children: [
        // Top: site name
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#2C5F5D',
                  },
                },
              },
              {
                type: 'span',
                props: {
                  style: {
                    fontSize: '20px',
                    color: '#4E8C89',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  },
                  children: 'Al-Anon Daily Paths',
                },
              },
            ],
          },
        },

        // Middle: date + title + quote + attribution
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              flex: '1',
              justifyContent: 'center',
            },
            children: [
              {
                type: 'p',
                props: {
                  style: {
                    fontSize: '22px',
                    color: '#4E8C89',
                    margin: '0',
                    letterSpacing: '0.02em',
                  },
                  children: reading.display_date,
                },
              },
              {
                type: 'h1',
                props: {
                  style: {
                    fontSize: '52px',
                    fontFamily: 'Cormorant Garamond',
                    fontWeight: 600,
                    color: '#2C5F5D',
                    margin: '0',
                    lineHeight: '1.15',
                    maxWidth: '900px',
                  },
                  children: reading.title,
                },
              },
              ...quoteChildren,
            ],
          },
        },

        // Bottom: tagline
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            },
            children: [
              {
                type: 'span',
                props: {
                  style: {
                    fontSize: '18px',
                    color: '#2D3B3D',
                    opacity: '0.4',
                  },
                  children: 'dailypaths.org',
                },
              },
              {
                type: 'span',
                props: {
                  style: {
                    fontSize: '18px',
                    color: '#2D3B3D',
                    opacity: '0.4',
                  },
                  children: 'Daily reflections for the Al-Anon journey',
                },
              },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts,
  });

  const png = await sharp(Buffer.from(svg)).png({ quality: 85 }).toBuffer();
  return png;
}
