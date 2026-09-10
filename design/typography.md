# Typography

The type system for dailypaths.org. **Build tokens from this file. Never derive a size
per page** — that is how the current prototype ended up with three near-identical values for
"section heading."

Specimen: `../Typography.dc.html` (open in a browser — every role is rendered at real size)

---

## 1. Why this changed

The old site was one thing: a daily reader. Cormorant Garamond could carry every serif job
because every serif job was devotional.

The new site has three content types with different purposes:

| Type | Purpose | Grain | Register |
|---|---|---|---|
| **Reflection** | Sit with this for a moment | One per day, 366 | Devotional |
| **Guide** | "Understanding Boundaries" — orient the reader on a subject, structural, returnable | One per subject, 6 | Practical |
| **Article** | "Dealing with the guilt of saying no" — one specific problem | Many, standalone | Practical |

**The topics section is gone.** Reflections, guides, and articles are **three separate,
parallel tracks.** An article is not part of a guide, does not live under one, and is not
reached through one. Some articles concern someone else's drinking, some general codependency.

### What this means for type

Only two things, both about length:

- **Articles are brief and single-subject**, so they use a plain heading hierarchy —
  `display-editorial`, then `chapter-h2` if needed. **No folio labels or numbers**; those
  belong to guides, whose sections are long enough to need wayfinding.
- **Guide titles run long** (see below); article titles are short and can take the full
  editorial display size.

### Guide titles are long — the type has to plan for it

The six guides are phrased as the reader's own framing ("Where to Start When Someone Else's
Drinking Affects You"), which runs 6–10 words. At `display-editorial`'s 56px ceiling that
wraps to four lines and dominates the page.

**So every guide carries two titles in the content model:**

| Field | Example | Set in |
|---|---|---|
| `shortName` | "Boundaries" | Nav, cards, inline links, the guides index grid |
| `title` | "Understanding Boundaries" | The guide page hero |
| `question` | "What limits can I set, and how do I follow through?" | The lede, directly under the hero title |

The reader's question is too good to bury — set it as the `lede`, in the reader's voice, and
the guide immediately confirms it is about them.

Cormorant is wrong for the second two, and the failure is concrete: at card-title size
(19–23px) its stems get thin and its high contrast breaks up, so "Why you feel guilty after
setting a boundary" reads as delicate and precious rather than useful. It also reads *prayer
book*, which actively works against an article someone found by searching a problem.

**So the serif job splits in two, with one rule for which is which.**

## 2. The two registers

**Register one — devotional. Cormorant Garamond, italic.**
The reflection, prayers, the wordmark, and exactly one thesis quote per article.
Italic is the signal. It means *sit with this*.

**Register two — practical. Newsreader, upright.**
Every article title, guide title, section heading, card title — and all reading body.
Moderate contrast, sturdier stems, designed for screens, real italics, holds from 15px to
60px. It means *here is something useful*.

**The rule:** if you are unsure which register a piece of text belongs to, it is upright.
Devotional is the exception, deliberately rationed. This is also what gives the site the extra
energy without losing the calm — the calm now comes from the sand palette, the space, and the
photography, not from the typeface being fragile.

**Register three — interface. Manrope.** Unchanged: nav, buttons, labels, eyebrows, dates,
metadata, captions. Never used for long-form prose.

### Why Newsreader

It reads editorial rather than corporate, it was built for exactly this (news/reading at
mixed sizes), it has a genuine italic for takeaways, and it sits comfortably beside Cormorant
because both are transitional-leaning serifs — related, not clashing. It is not one of the
overexposed display serifs.

## 3. The ladder

The implemented roles live in `css/site-system.css`. Sizes are
`clamp(min, preferred, max)` and must remain visibly stepped in context, not merely
different on paper.

| Role | Family | Weight | Size | LH | Tracking | Used by |
|---|---|---|---|---|---|---|
| `reflection` | Cormorant *italic* | 500 | `clamp(44px,5.2vw,68px)` | 1.04 | −0.4px | Reflection hero, home hero |
| `page` / `article` | Newsreader | 500 | `clamp(42px,4.2vw,58px)` | 1.08 | −0.7px | Index and article titles |
| `guide` | Newsreader | 500 | `clamp(36px,3.5vw,48px)` | 1.12 | −0.5px | Guide heroes; cap at 22ch |
| `section` | Newsreader | 500 | `clamp(30px,2.8vw,38px)` | 1.14 | −0.45px | Top-level page sections |
| `chapter` | Newsreader | 500 | `clamp(25px,2.2vw,30px)` | 1.2 | −0.3px | Sub-heads in articles/guides |
| `card` | Newsreader | 500 | `clamp(20px,1.7vw,24px)` | 1.24 | −0.2px | Card titles |
| `lede` | Newsreader | 400 | `clamp(19px,1.55vw,22px)` | 1.55 | — | One per page |
| `thesis-quote` | Cormorant *italic* | 500 | `clamp(25px,2.6vw,34px)` | 1.42 | −0.25px | One per article, centered |
| `body-reading` | Newsreader | 400 | `clamp(17.5px,1.25vw,18.5px)` | 1.68 | — | All long-form prose |
| `takeaway` | Newsreader *italic* | 400 | same as body | 1.66 | — | Chapter closers, inline |
| `prayer` | Cormorant *italic* | 500 | 19px | 1.7 | — | Prayers only, centered |
| `body-ui` | Manrope | 400 | 16px | 1.65 | — | Outside the reading column |
| `small` | Manrope | 400 | 15px | 24px | — | Card body, secondary |
| `label` | Manrope | 600 | 12px | 1.5 | +1.4px uppercase | Eyebrows, folios |
| `nav` / `button` | Manrope | 600 | 15px | 1.4 | — | Nav, buttons, inline links |
| `caption` | Manrope | 400 | 12px | 1.5 | +0.3px | Dates, sources, disclaimers |

### Reconciliations — these supersede the old per-page values

- **Section headings** were `clamp(26px,3.2vw,40px)` in the site mock and
  `clamp(25px,2.8vw,32px)` on the theme page. Both become `section-h2`.
- **Eyebrow tracking** was +0.4px in the app and on early pages, +1.4px on the theme-page
  folios. **+1.4px wins** for web — it is what makes small caps read as editorial rather than
  as a form label.
- **Reading body is intentionally quiet** (`clamp(17.5px,1.25vw,18.5px)`/1.68), with a
  maximum measure of 68 characters. It is the stable baseline beneath the display ladder.
- **Reading titles**: the app uses Manrope Light 300 at 36/44. That is an app-only exception;
  on the web a reading title is `display-devotional`.

## 4. Rules

- **One `lede`, one `thesis-quote`, one `display-*` per page.** Rationing is what makes them
  work.
- **Takeaways are never boxed, bordered, or recolored** — italic, body size, inline, as the
  last line of a chapter.
- **Manrope never sets long-form prose.** Newsreader never sets a button or a label.
- **Negative tracking above 15px**, none below.
- **Reading measure is 760px**; full-width sections are 1160px. Never set `body-reading`
  wider than 68ch.
- Do not add a fourth family. Do not add a weight outside 400/500/600.

## 5. Loading

All three families are served locally through `css/tokens/fonts.css`; normal pages do
not depend on Google Fonts. **Lora is no longer used** — nothing in the ladder
references it. Newsreader is a variable font with an optical-size axis; let `opsz`
track the font size.

## 6. Settled

1. **The wordmark is Cormorant Garamond italic 600**, exactly as the app sets it — not the
   upright bold serif from the home-page mockup. Site and app must read as one product. This
   is the one place Cormorant appears outside the devotional register.
2. **Topics are replaced by articles and guides** — three parallel tracks with reflections, not
   a hierarchy. The ladder handles both: guides lean on `guide-title` + `lede` (the reader's
   question) + `chapter-h2` + numbered steps; articles on `display-editorial` + `lede` +
   `body-reading`.

3. **Lora is dropped.** Newsreader is the workhorse — it carries every title *and* all reading
   body. Three families total: Newsreader, Cormorant Garamond, Manrope. Nothing in the ladder
   uses Lora; remove it from the font loading.

**Why Newsreader won it:** the optical-size axis. One face has to serve a 44px guide title and
a 17px paragraph, and Newsreader is effectively two designs in one file — sturdier and more
open when small, sharper and tighter when large. Lora has no equivalent and, being optimized
for text, softens at display sizes. Second reason: Lora's italic is strongly calligraphic and
lands close to Cormorant italic, which would blur the devotional signal. Newsreader's italic
reads as plain emphasis.

## 8. Consequences for the existing prototypes

- `Letting Go Redesign.dc.html` — **migrated.** It is the guide template. All Lora and all
  editorial Cormorant became Newsreader; heading weights dropped 600 → 500 to suit the face;
  the hero moved to `guide-title`. Cormorant survives in exactly three places: the header
  wordmark, the footer wordmark, and the one thesis quote.
- `Dailypaths Site.dc.html` — **not migrated.** Still Cormorant + Lora throughout, and its IA
  is pre-articles/guides (it still has a Topics section), so the type migration is best done as
  part of that restructure rather than twice.
- **No article template exists yet.** It is a new, lighter build: `display-editorial` title,
  `lede`, `body-reading`, one image, no folios. Plus a magazine-style articles index.
- `Dailypaths Site.dc.html` — the larger job, and now also an IA job: the Topics index and
  topic-detail templates split into Articles and Guides. All Cormorant card titles and section
  headings become Newsreader; only the reading hero, prayers, thesis quotes, and the wordmark
  stay Cormorant.
- `topics.json`, `content-model.md`, and `CHANGES.md` still describe the topics taxonomy and
  need reworking for the articles/guides split.
