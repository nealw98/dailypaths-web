# Handoff: dailypaths.org site redesign (Daily Paths design system)

## Overview

A full-site visual redesign of **dailypaths.org** — the free Al-Anon Daily Paths reading site
— rebuilt in the **Daily Paths design system** (the visual language of the Al-Anon Daily
Paths mobile app: warm sand page, one teal accent, Cormorant Garamond / Manrope / Lora,
nature photography, the ripple motif).

Content is the real, current site content (pulled from dailypaths.org in August 2026).
Structure has been reorganized in places where the design system suggested a better
arrangement — noted per page below.

**The structure was consolidated in August 2026** — see `CHANGES.md` for what moved and why.
The site now has **four nav items** and nine page templates. Home *is* today's reading; the
Al-Anon page was absorbed into Start here; Essentials was split; Steps live under Topics.

Header nav (four items, in order): **Today's Reflection · Topics · Prayers · Start here**.

| Template | Suggested route | Count |
|---|---|---|
| Today's Reflection (**is the home page**) | `/` and `/august-9-let-go-and-let-god/` | 366 |
| Topics index | `/topics/` | 1 |
| Topic detail — reading collection | `/topics/letting-go/` | 12 |
| Topic detail — background | `/topics/alcoholism-as-a-disease/` | 2 |
| Most read | `/most-read/` | 1 |
| Steps index | `/steps/` | 1 |
| Step detail | `/steps/step-1-honesty/` | 12 |
| Prayers | `/prayers/` | 1 |
| Start here | `/start/` | 1 |

Home and the day's reading are the **same template**. Decide one canonical URL for a given
day's reading and have `/` render the current day's — don't ship two indexable copies.

Not in the nav, reached by link: **Most read** (home, Topics intro, footer), **Steps index**
(Topics intro, Step rails, footer), and a **reading calendar** that does not exist yet —
the mock links to it from the reading page and the footer. Build it; see `CHANGES.md`.

## About the design files

The files in `prototype/` are **design references created in HTML** — a prototype showing
the intended look, hierarchy, and behavior. They are **not production code to copy
directly**. The prototype is a single self-contained "design component" file that renders
with React from a small runtime (`support.js`); its markup is a template, not a component
library.

The task is to **recreate these designs in the real dailypaths.org codebase**, using that
project's existing environment, templating, and build pipeline (the live site appears to be
a static/SSG site — implement in whatever it already uses). Where the codebase already has
patterns for layout containers, links, and image handling, use those. If a piece of the
site has no existing pattern, the token list at the bottom of this document is the source
of truth.

**Two chrome-level notes before you start:**

1. The prototype wraps the site in a mock "browser frame" with a floating pill control bar
   at the top (Desktop / Mobile toggle and a hero-variant switcher). That bar and the frame
   are **presentation scaffolding for design review — do not implement them.** The real
   page starts at the sticky `<header>`.
2. The prototype simulates mobile with a fixed 402px-wide container and CSS **container
   queries** (`cqw` units, `container-type: inline-size`). In production these should become
   ordinary **viewport** media queries / responsive units. Every `clamp(min, Ncqw, max)`
   in the prototype means "scale between these two values between mobile and desktop" —
   translate to `clamp(min, Nvw, max)` or breakpoint rules as your codebase prefers.

## Fidelity

**High-fidelity.** Colors, typography, spacing, radii, shadows, and copy are final and
should be matched closely. Interaction detail (hover, transitions) is specified below.
Photography in the prototype is sample imagery from the design system — the real site's own
photo set should be used in the same roles (see **Assets**).

---

## Global chrome

### Header (all pages)

Sticky to the top, `z-index: 20`. Background `--surface-glass` `rgba(244,241,234,.80)` with
`backdrop-filter: blur(12px)`; 1px bottom border `--rule` `rgba(0,0,0,.08)`.
Inner row: `max-width: 1160px`, centered, padding `12px 5vw`, `display:flex`,
`align-items:center`, `gap: clamp(16px, 2.4vw, 32px)`.

**Brand lockup (left)** — a button that navigates home:
- App icon, 38×38, `border-radius: 9px`, shadow `0 1px 3px rgba(0,0,0,.04)`, `flex-shrink:0`
- Stacked text, `gap: 2px`:
  - "Al-Anon Daily Paths" — Cormorant Garamond, italic, 600, **22px**, line-height 1,
    letter-spacing 0.1px, color `--accent-strong` `#2D4C47`, `white-space: nowrap`
  - "DAILY REFLECTIONS" — Manrope 600, 10px, line-height 1, letter-spacing 1.1px, uppercase,
    color `--text-muted` `#5A6C69`

**Divider** — 1px vertical hairline (`--rule`), `align-self: stretch`, `margin-left: auto`
(this is what right-aligns the nav). Hidden on mobile.

**Nav (desktop only)** — `display:flex`, `gap: 22px`. Items: Home · Today's Reflection ·
Steps · Themes · Essentials · Al-Anon. Each is Manrope 600, **14.5px**, line-height 1.2,
letter-spacing −0.1px, padding `5px 0 4px`, `border-bottom: 2px solid transparent`.
Active: color `--accent-strong`, border-bottom `--accent` `#376662`. Inactive: `--text-muted`.
Step-detail pages mark **Steps** active; theme-detail pages mark **Themes** active.

**"Get the app" button (desktop only)** — design-system Button, `size="sm"` (40px min-height,
14px padding, 15px label). Must be `flex-shrink: 0` and `white-space: nowrap`.

**Mobile header** — nav and CTA are replaced by a **Menu button** on the right:
40px min-height, padding `0 14px`, `border-radius: 12px`, background `--surface-high`
`#E7ECEA`, color `--accent-strong`, Manrope 600 14px, with a 3-bar glyph (three 16×1.6px
rounded bars, 3.5px gaps). Label toggles "Menu" ⇄ "Close".
Tapping it opens a **dropdown panel** directly under the header row: background
`--surface-lowest` white, 1px top border `--rule`, padding `8px 5vw 16px`, shadow
`0 4px 12px rgba(0,0,0,.10)`. Each nav item is a full-width row: `justify-content:
space-between`, padding `15px 2px`, 1px bottom `--rule`, Manrope 600 17px, with a 16px
`chevronRight` brand icon on the right. Below the rows, a full-width primary
"Get the app" button (`margin-top: 16px`). Selecting any item navigates **and** closes the
menu.

### Footer (all pages)

Background `--accent-strong` `#2D4C47`, text `rgba(255,255,255,.85)`,
`margin-top: clamp(52px, 7vw, 88px)`.
Grid: `max-width:1160px`, padding `clamp(36px,4.5vw,56px) 5vw 32px`,
`grid-template-columns: repeat(auto-fit, minmax(160px, 1fr))`, `gap: 32px`.
- Column 1: wordmark in Cormorant italic 600 26px white, then "Daily reflections for the
  Al-Anon journey." at 15px/24px, `max-width: 36ch`.
- Columns 2–4, headers uppercase 12px letter-spacing .6px `rgba(255,255,255,.55)`, items
  15px in a 9px-gap column:
  - **READ** — Today's reflection · The Twelve Steps · Themes · Essentials
  - **AL-ANON** — Start here · About Al-Anon · About the project · al-anon.org
  - **MORE** — Support · Privacy · Terms · Get the app
- Bottom bar: 1px top border `rgba(255,255,255,.15)`, padding `16px 5vw`, space-between,
  12.5px, `rgba(255,255,255,.6)`:
  "© 2026 Daily Growth, LLC. All rights reserved." and
  "In crisis? Help is available 24/7. Call or text **988** (USA)." (988 in white, bold).

---

## Screens

Nine templates. Sizes are given as the prototype writes them (`cqw` → `vw` in production).

### 1. Today's Reflection — **this is the home page**

**Purpose:** the reading, first. This is why people come.

1. **Photo hero**, `min-height: clamp(240px,30vw,380px)`, full-bleed `reflections-37.webp`,
   standard scrim, content bottom-aligned in the 1160px container: eyebrow "August 9 · Step
   Eight" (13px 600 uppercase, +0.4px, white .72), H1 Cormorant 600
   `clamp(36px,4.8vw,60px)`/1.08, −0.5px, max 18ch.
2. **Article, 820px measure.** Pills row (topic, Step) → quote card (white, 3.5px left
   `--accent` border, radius `0 14px 14px 0`, QuoteBlock + attribution) → body paragraphs
   Lora `clamp(17px,1.5vw,18.5px)`/1.66, 22px apart → **Today's Reminder** seafoam panel
   (radius 16, eyebrow teal-700, Lora `clamp(19px,1.9vw,23px)`/1.6 teal-900).
3. **Prev / next** cards, `flex: 1 1 220px` each, radius 10, next right-aligned; then a
   centered "Browse the reading calendar →" link, 15px 600 accent.
4. **Attribution line**, 13px/22px muted.
5. **"New here?" strip** — a hairline strip, *not a card*: 18px `lightOnWater` icon, "New
   here?" 15px muted, "Find out if Al-Anon is for you →" 15px 600 accent, 1px rules top and
   bottom, 12px vertical padding, hover `opacity:.72`. It has been iterated down three times;
   do not let it grow into a card.
6. **Read by topic** — H2 Cormorant 600 `clamp(28px,3.4vw,40px)`, intro 17px/28px muted with
   an inline link to Most read, "All topics →" right-aligned on the baseline; then four topic
   cards, `repeat(auto-fill,minmax(250px,1fr))`, gap 14, `--surface-low`, radius 14.
7. **App CTA** — white card radius 16, ambient shadow, two columns: pitch left, 64px app icon
   + store badges right. **The only full app pitch on the site.**

### 2. Topics index

Photo hero `clamp(220px,26vw,340px)` (`themes-hero.jpg`), H1 "Topics", Lora sub-line
"Fourteen ways in — twelve reading collections and two pieces of background."

Lora intro (64ch) explaining that topics are how people look for a reading, with inline links
to the Steps index and Most read; then a 15px muted line noting that two entries are
background rather than collections.

Cards: `repeat(auto-fill,minmax(260px,1fr))`, gap 16, white, 0.5px `--border-card`, radius 14,
shadow card. Title Cormorant 600 23px, line 15px/24px muted, and a baseline-aligned footer row:
"Explore →" (14px 600 accent) left, **quiet meta right** (12px muted) — either "42 readings"
or "Background · Al-Anon literature". No counts anywhere else, no badges.

### 3. Topic detail — reading collection (shown: Letting Go)

1. **Topic rail** above the hero: `--surface-low` band, 1px bottom rule, prev topic / "All
   topics" / next topic, 14px 600, middle link accent.
2. Photo hero `clamp(240px,30vw,400px)`: eyebrow "Topic", H1 Cormorant 500
   `clamp(34px,4.6vw,58px)`, Lora sub-line.
3. **820px article:** centered Cormorant italic pull-quote `clamp(24px,2.9vw,34px)`/1.5 in
   `--accent-strong`, then Lora essay paragraphs.
4. **Share Your Experience** card (white, radius 16): name Field, textarea Field, 3000-char
   counter, "Post insight" Button, consent line 13px muted.
5. **Al-Anon reading on this topic** — `--surface-low` radius 14: eyebrow, Cormorant H2, the
   passage as Lora 17px/28px lines, hairline footer with source note + "Read the whole
   passage →". This is where the old Essentials long readings live now; one per topic.
6. **Most read on this topic** (1160px): H2 + "The five members save most often — from five
   different Steps." Five cards, minmax(240px,1fr), each with eyebrow "{Step} · {date}".
   **Populate from real favorites data, not by hand.**
7. **Readings across the Steps** — the full list, grouped by **Step**, each group a centered
   11px uppercase label with a hairline to its right, then `minmax(230px,1fr)` tiles
   (`--surface-low`, radius 10) of date + title. The cross-Step spread is the point: it shows
   a topic isn't a month.
8. No app CTA on this page.

### 4. Topic detail — background (shown: Alcoholism as a Disease)

For topics worth having that **no daily readings cover**. Same rail and hero as §3 with
eyebrow "Background".

1. 820px: a 15px muted line — "This is background, not a daily reading" — then a Cormorant/Lora
   essay with H2 sub-heads.
2. **"In Al-Anon's own words"** — a hairline section label, then quote cards: white, 3.5px left
   accent border, radius `0 14px 14px 0`, Lora 19px/1.55, hairline footer with the source
   (13px muted) and "Find this book at al-anon.org ↗".
   **The prototype's passages are marked placeholders.** Do not ship them. Either obtain
   permission for Al-Anon's exact approved wording, or delete the quote cards and link out.
3. **"Where the readings pick this up"** — 4 cards linking to the reading collections that do
   carry the subject, each with its quiet reading count. This is what keeps a background page
   from dead-ending; every background topic needs it.
4. No app CTA.

### 5. Most read

**Purpose:** proof of quality, and the best landing page on the site for someone who has never
read the app.

Photo hero (`hero-image.jpg`) with eyebrow "Most read", H1 "The readings people come back to",
Lora sub-line. Lora intro (64ch).

**Tier one:** six cards, `minmax(300px,1fr)`, white, radius 14, surface shadow — eyebrow
"{date} · {topic}", Cormorant 600 `clamp(23px,2.3vw,27px)` title, one Lora line on why, "Read
it →" pinned to the bottom.
**Tier two:** hairline label "Also well read", then eighteen `minmax(260px,1fr)` tiles
(`--surface-low`, radius 10) of "{date} · {topic}" + title.
Then 13px muted: "Ordered by how often members save a reading in the app. Updated monthly."
Close with a seafoam "Read by topic instead" panel → Topics.

**Voice rule, non-negotiable:** no counts, no hearts, no rank numbers, no "#1". The ordering
does the work. Generate the list from favorites/thumbs data on a monthly job.

### 6. Steps index

Not in the nav — reached from the Topics intro, the Step rails, and the footer.

Photo hero `clamp(220px,26vw,340px)` (`reflections-21.webp`), H1 "The Twelve Steps", Lora
sub-line. Twelve cards `minmax(250px,1fr)`, gap 16, white, radius 10: big Cormorant numeral
34px in `--accent-soft`, word (18px 600), line (15px/24px muted), "Read the Step →".
Closing 13px muted adaptation notice linking al-anon.org. No app CTA.

### 7. Step detail (shown: Step One)

1. **Step rail:** prev Step / "All Steps" / next Step.
2. Photo hero `clamp(240px,30vw,400px)` (`reflections-4.webp`): eyebrow with the Step's
   principle, H1 Cormorant 500 "Step One".
3. 820px article: Step-text quote card, then essay blocks with Cormorant H2 sub-heads.
4. **Questions for Reflection** — white card radius 16: rows of 18px `feather` icon + Lora
   17px/27px question, each with a bottom hairline.
5. **Step 1 in Action** — seafoam panel radius 16, bulleted actions in teal-900, closing
   *Paths to Recovery* pointer in teal-700.
6. **Six readings on Step One** (1160px) — eyebrow "Most read", H2, then a 62ch line pointing
   at the topic page and the calendar. Six cards `minmax(260px,1fr)`: date, title, and one
   muted line on why. **This replaced a 12-card month calendar** — a Step page must not act as
   a calendar; that job belongs to the calendar. Populate from favorites data.
7. **App CTA** on `--hero-gradient`, radius 16, ripple — the journaling argument only. Second
   of the site's three app CTAs.

### 8. Prayers

Photo hero (`reflections-12.webp`), H1 "Prayers", Lora sub-line "…set line by line for reading
aloud."

Five prayer cards, `minmax(280px,1fr)`, gap 16: white, 0.5px hairline, radius 14, centered —
12px uppercase title, Cormorant **italic** 19px/1.7 body with `white-space: pre-line` (the line
breaks are the design), muted note pinned to the bottom. Serenity, Third Step, Seventh Step,
Set Aside, St. Francis.

Closing seafoam "Add your own prayers." panel — third and last app CTA.

### 9. Start here (new page — the newcomer funnel, and the Al-Anon explainer)

**Purpose:** someone who arrived from a search like "is my husband an alcoholic" and needs to
know whether this is for them. It also carries everything the old Al-Anon page carried.

Teal-gradient hero + ripple, 820px column, eyebrow "New here", H1 "Start here", Lora intro.

Then four numbered steps — big Cormorant numeral in `--accent-soft` beside a Cormorant H2,
body indented `padding-left: 46px` to align under the heading:

1. **See whether this is your situation** — the five al-anon.org self-quiz questions as
   tappable rows (radius 12; unchecked white + `--border-soft`; checked `--accent-soft`, filled
   `--accent-strong` checkbox with a white tick). Once any is checked, a white response card
   appears: "You checked *N*. That's not a diagnosis — it's just a sign you're in the right
   place." **Client-side only. Nothing saved, nothing sent, no analytics** — the page says so
   in copy and that must stay literally true.
2. **Know what you'd be walking into** — three `--surface-low` fact rows (free / anonymous /
   not therapy and not religion), then **"What Al-Anon is"** (H3 + two Lora paragraphs +
   al-anon.org link), then the **three common questions** as `--surface-low` cards and a link
   to al-anon.org's FAQ. This block is the absorbed Al-Anon page; the duplicate self-quiz,
   duplicate meeting band, and duplicate hero were deleted.
3. **Read three things this week** — three cards, each with "Read first / Then / Then", a
   Cormorant title, and a Lora line on why it comes first.
4. **Sit in one meeting** — plain Lora paragraph ("You don't have to speak…"), then "Find a
   meeting near you ↗" and a ghost "Read the Serenity Prayer" → Prayers.

**"If you keep going"** (1160px) — H2 "How the program works" + four pillar cards (Steps,
Fellowship, Literature, Service): 34px icon, 11px uppercase eyebrow, Cormorant 24px title,
15px/24px body, link pinned bottom.

**Related fellowships** — three cards (ACA, CoDA, Alateen) + the independence disclaimer in
13px muted.

**Close** — seafoam "One reading a day, wherever you are" panel, then the 988 crisis line.
**No ads ever on this page** (see `CHANGES.md`).



- **Navigation.** Header nav, mobile menu rows, Step cards, topic cards, reading cards, the
  "All topics →" / "Explore →" links, and the Steps pillar card all navigate. Every navigation
  scrolls the window to top (`behavior: "smooth"`) — in production this is just normal page
  navigation. Step detail, Steps index, topic detail, background topic, and Most read all mark
  **Topics** as the active nav item.
- **Hover.** Cards raise shadow from `0 1px 3px rgba(0,0,0,.04)` to `0 4px 12px rgba(0,0,0,.10)`;
  tinted cards step one surface level (`--surface-low` → `--surface-card`); filled buttons
  brighten ~6% (`filter: brightness(1.06)`); the white-outline dark-surface buttons take a
  `rgba(255,255,255,.12)` fill.
- **Press.** Buttons translate 1px down.
- **Focus.** 2px `--accent-strong` border on the field itself (design-system rule).
- **Transitions.** 120–320ms, `cubic-bezier(.4,0,.2,1)`. Nothing bounces, nothing parallaxes,
  no looping motion.
- **Mobile menu.** Open/close on tap; closes on selection; is only present below the desktop
  breakpoint.
- **Share Your Experience form.** Prototype is non-functional. Real behavior needed: 3000-char
  limit with a live counter, name + insight required, consent copy shown, presumably moderated
  before publication.

## State

Minimal — this is a content site. The prototype's real state is `page` (routing, becomes real
URLs), `menuOpen` (mobile nav), and `quiz` (the Start here toggles — client-side only, never
persisted or transmitted). One further switch (`device`) is review-only and must not ship. No data fetching beyond whatever already renders the readings.

## Design tokens

All values come from the Daily Paths design system; the CSS custom properties are in
`prototype/_ds/daily-paths-design-system-*/tokens/` — **link those token files rather than
re-typing the values where you can.**

**Color**
| Token | Value | Use |
|---|---|---|
| `--surface` | `#f4f1ea` | page background (warm sand) |
| `--surface-lowest` | `#FFFFFF` | elevated cards |
| `--surface-low` | `#F2F4F3` | tinted cards, rails |
| `--surface-card` | `#EDF1EF` | tinted card hover |
| `--surface-high` | `#E7ECEA` | mobile Menu button |
| `--surface-glass` | `rgba(244,241,234,.80)` | sticky header |
| `--text-primary` | `#1C2524` | body ink |
| `--text-muted` | `#5A6C69` | secondary text |
| `--accent` | `#376662` | links, icons, teal bands, active nav |
| `--accent-strong` | `#2D4C47` | footer, wordmark, headings on light |
| `--accent-deep` | `#214743` | gradient end |
| `--accent-soft` | `#BAECE6` | seafoam panels, secondary buttons, numerals |
| `--border-card` | `#c5dedd` | 0.5px card hairline |
| `--rule` | `rgba(0,0,0,.08)` | dividers |
| `--dp-field` | `#dfe8e4` | form field fill |
| `--hero-gradient` | `linear-gradient(135deg,#2D4C47,#214743)` | hero/CTA gradient |
| scrim | `linear-gradient(180deg, rgba(28,37,36,.10) → .74)` | over photos |

Entry-type accents (journal `#3366A8`, gratitude `#3DA35D`, spot-check `#D4553A`, nightly
`#6B3FA0`) and terracotta `#8F5546` exist in the system but are **not used on the website** —
they belong to the app's notebook and subscription UI. Don't introduce them here.

**Type** — Cormorant Garamond (display/editorial, incl. the italic wordmark and prayers),
Manrope (all UI: nav, buttons, labels, dates, card text), Lora (reading: essays, quotes,
lede paragraphs). Loaded from Google Fonts.
Scale in use: display `clamp(34–38px, ~5vw, 58–68px)`; section H2 `clamp(26px,3.2vw,40px)`;
card titles 22–24px Cormorant; body 17px/28px Manrope; reading body 17–18.5px/1.66 Lora;
small 15px/24px; labels 13px/20px (uppercase eyebrows +0.4px tracking); captions 12px/16px.
Negative tracking (−0.1 to −0.9px) on anything above 15px.

**Spacing** — 4 / 8 / 16 / 20 / 24 / 32 / 40. Page max width 1160px; reading measure 820px
(900px for Essentials). Horizontal gutter 5vw. Section rhythm `clamp(52px, 7vw, 88px)`.

**Radii** — 10 elevated list cards · 12 buttons/controls/fields · 14 tinted & pillar cards ·
16 heroes, flat panels, large cards · 999 pills. (Nothing else — no 20px.)

**Shadows** — card `0 1px 3px rgba(0,0,0,.04)` · surface `0 4px 12px rgba(0,0,0,.10)` ·
floating `0 10px 24px rgba(25,28,28,.08)` · ambient `0 12px 32px rgba(25,28,28,.06)`.

## Assets

In `prototype/assets/` — all sample imagery from the design system, **placeholders for the
real site's photography**:
- `reflections/reflections-4 · -12 · -21 · -37.webp` — daily-reflection photographs
  (water, forest, mist). Used as: Step detail + background topic hero (-4), Prayers hero (-12),
  Steps index hero (-21), **home / reading hero (-37)**.
- `hero-image.jpg` — Most read hero.
- `themes-hero.jpg` — Topics index and topic detail hero.
- `icon.png` — app icon, used in the header lockup (38px) and home CTA (64px).
- `reflections-33.webp` and `reflections-30.webp` are present but **deliberately unused** —
  both contain people, which the system's imagery rule forbids. `-30` was the reading hero
  until this pass; don't put it back.

Imagery rule to hold to when swapping in the real photos: soft natural light, cool-to-neutral
cast, low contrast, **no people, no faces, no text**, always full-bleed, always behind the
scrim before type sits on it.

Icons are the design system's own 10 hand-drawn line icons plus stroke-matched utility glyphs
(32×32 viewBox, `fill:none`, round caps, stroke-width 1.6 default / 1.8 active). Used here:
`lightOnWater`, `book`, `feather`, `softExhale`, `seedling`, `leafOnWater`, `stackedStones`,
`chevronRight`. Source SVGs live in the design system repo under `assets/icons/`; the
prototype mounts them from `_ds/.../_ds_bundle.js`. **No emoji anywhere.**

Store badges: use Apple's and Google's official artwork; the prototype's dark chips are
stand-ins.

## Voice & copy rules

Copy is the live site's own, lightly re-cased to the system's voice. Keep it that way:
sentence case (uppercase only for small eyebrow labels), short sentences, links written as
verb-first phrases with an arrow ("Explore the Steps →", "Read the whole passage →"), quiet
metadata, no exclamation marks, no gamification, no emoji, quotes always attributed
("Paths to Recovery, p. 82"). Never author new Al-Anon or AA literature text.

## Files

- `CHANGES.md` — what the August 2026 consolidation moved, and the open work. **Read it first.**
- `theme-page/README.md` — the theme-page template: the element vocabulary, the four-chapter
  spine, the circle figure, and screenshots. Read it before building any topic page.
- `content-model.md` — the reading record, the taxonomy rules, and the tagging plan.
- `topics.json` — the fourteen topics, machine-readable (slugs, kind, sizing targets).
- `readings.schema.json` — JSON Schema for one reading record.
- `prototype/Dailypaths Site.dc.html` — the full design (nine templates, header/footer,
  mobile menu). Open it directly in a browser.
- `prototype/support.js` — runtime the prototype needs to render. Not for production.
- `prototype/_ds/daily-paths-design-system-*/` — the design system: token CSS files
  (`tokens/colors.css`, `typography.css`, `spacing.css`, `elevation.css`, `fonts.css`,
  `base.css`), `styles.css`, and `_ds_bundle.js` (Button, Pill, Card, Field/Input, Icon,
  QuoteBlock, RippleField, SpeakerCard, ToolRow, …).
- `prototype/assets/` — imagery listed above.

To view: open `prototype/Dailypaths Site.dc.html` in a browser. The floating control bar at the
top switches Desktop/Mobile — review scaffolding only. Pages not reachable from the nav are
reached by link: **Most read** from the home topic section or the Topics intro, **Steps index**
from the Topics intro, **background topic** from the Topics grid (the two cards labelled
"Background"), **Step detail** from the Steps index, **topic detail** from any topic card.
