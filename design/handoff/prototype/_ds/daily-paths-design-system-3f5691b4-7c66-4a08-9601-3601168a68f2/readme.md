# Daily Paths Design System

The design language of **Al-Anon Daily Paths** — a daily-reader and recovery-companion app
— extended so it can also carry an expanded marketing + reading website.

Daily Paths gives someone in Al-Anon four things each day: a **daily reflection** to read, a
**notebook** with four ways to write (freeform Journal, Gratitude, Spot Check, Nightly
Review), **speaker recordings** to listen to, and the **prayers** they already know. The
mobile app ships on iOS (paid download) and Android (trial + subscription, with lifetime
grandfathering). The website is the new surface this system is being stretched to cover.

## Sources

Everything here was read from source, not from screenshots:

- **GitHub — <https://github.com/nealw98/daily-paths>** (branch `main`). The Expo /
  React Native app. Key files: `constants/theme.ts` (the authoritative palette, font
  registry, type scale, spacing, shadows), `app/(tabs)/home.tsx`, `app/(tabs)/journal.tsx`,
  `components/ui/Sanctuary.tsx`, `components/shared/TealHeader.tsx`,
  `components/icons/*` (the custom line-art icon set), `constants/journalCategories.ts`,
  `docs/visual-redesign-change-spec.md`, `TYPOGRAPHY_AUDIT.md`, `THEME_ELEMENTS_AND_COLORS.md`.
  Explore that repo further before building anything ambitious — the screens have
  more nuance than any summary can hold.
- `WEB_STYLE_GUIDE.md` in the same repo is **stale**: it names an older teal ramp
  (`#2C5F5D` / `#4A8B8D`) and Inter as the body face. `constants/theme.ts` is the truth
  and is what this system encodes.

No Figma file, brand book, or logo vector was provided.

---

## CONTENT FUNDAMENTALS

**Voice: a steady friend, not a coach, and never a cheerleader.** The product speaks to
someone who may be having a hard morning. It is calm, plain, unhurried, and never
congratulatory.

- **Person.** The app addresses the reader as *you* in prompts and descriptions
  ("Count your blessings today", "Write freely about what's on your mind"). The reader's
  own writing is in *I* — every guided prompt is first-person interior speech:
  "What am I feeling?", "What's my part?", "Where was I selfish, dishonest, or afraid?"
  That split is deliberate: the UI invites, the reader answers in their own voice.
- **Sentence length.** Short. Often fragments. "Pause. Breathe. Work through what's
  happening." Instructions are one line; nothing is explained twice.
- **Casing.** Sentence case everywhere except small eyebrow labels, which are UPPERCASE
  with +0.4px tracking ("TODAY'S REFLECTION", "PRACTICE", "FEATURED SPEAKER"). Titles are
  title case ("Daily Tools", "Nightly Review", "Your Prayers"). No ALL-CAPS headlines.
- **Time-aware, gentle.** The home screen greets by hour — "Good morning" / "Good
  afternoon" / "Good evening" — and nothing else on the screen shouts.
- **Metadata is quiet, never gamified.** Streaks and counts appear once, small, muted:
  "12 entries · 4 day streak", "3 new this week". No badges, no confetti, no "You're on
  fire!". A streak is a fact, not a reward.
- **Links read as sentences with an arrow**: "Open your notebook →",
  "Explore all speakers →", "Read more ›", "Listen", "Open". Verb first, never "Click here".
- **Empty states describe, then invite**: "No favorites yet", "Speaker recordings will
  appear here.", "Tap edit to add your personal prayers…" — no exclamation marks.
- **Hints are permissive.** "Write as many or as few as you'd like." "This can wait until
  tomorrow — just note it here." "Be gentle but honest with yourself…" The product never
  implies the user is behind.
- **Ellipses and em dashes carry the pacing.** Placeholders trail off ("I'm grateful
  for…", "One small step I can take right now…"); em dashes hold an aside
  ("A collection of prayers — and a place to add your own.").
- **No emoji.** The app deliberately replaced every emoji with the custom line icons
  (`docs/visual-redesign-change-spec.md` §1). Do not reintroduce them.
- **Recovery register.** Quotes are attributed to their source ("Courage to Change, p. 41")
  and Step language is used plainly ("Step Three") without jargon-splaining. Never write
  new Al-Anon/AA literature text — use placeholder copy and mark it as such.

## VISUAL FOUNDATIONS

**The feeling: still water at first light.** Warm paper under cool green-teal, one strong
brand color, generous leading, photographs of nature with no people in them.

**Color.** One dominant hue — teal — over a warm sand page. `--surface` `#f4f1ea` is the
page; containers step *cooler and greener* as they rise (`#F2F4F3` → `#EDF1EF` → `#E7ECEA`
→ `#D9E1DE`), with pure white reserved for elevated cards. Text is near-black green ink
`#1C2524`; secondary is `#5A6C69`. Accent `#376662` carries headers, primary buttons, links,
icon pips; `#2D4C47`→`#214743` is the 135° hero gradient; seafoam `#BAECE6` is the only
light accent (secondary buttons, selected pills). Four saturated entry-type accents
(journal blue `#3366A8`, gratitude green `#3DA35D`, spot-check coral `#D4553A`, nightly
purple `#6B3FA0`) are used *only* for notebook color-coding. Terracotta `#8F5546` is fixed
across all themes and belongs to subscription/membership UI alone. The app ships eleven
selectable palettes (Ocean light/dark, Forest, Deep Sea, Rose Garden, Desert Twilight,
Plum, Coffee Break, Peach Blossom, Morning Light); **Ocean Light is the design default**
and the only one encoded as base tokens here (Ocean Dark ships as a `[data-theme="dark"]`
scope). Never invent a new hue — swap the whole palette or stay inside this one.

**Type.** Three families, each with one job. **Cormorant Garamond** is the editorial voice:
the italic wordmark, greetings (36/44, weight 500), page titles (30–32px, 600), section
headings (~25px, 600), and prayer text (18px italic, 1.7 leading, centered). **Manrope** is
the interface: every label, button, description, nav item, timestamp — 17/28 body, 15/24
small, 13/20 labels, 12/16 captions, tracking slightly negative (−0.1 to −0.6px) on
anything above 15px. **Lora** carries devotional and quoted text (19/26 in quote boxes).
Reading titles are an intentional exception: Manrope **Light 300** at 36/44 with −0.9px
tracking — airy, not bold. In-app text size scales every dynamic token XS→XL, so never
hardcode a size that must scale with reading comfort.

**Spacing & layout.** 4 / 8 / 16 / 20 / 24 / 32 / 40. Screen gutters are 16px for cards and
20px for text; the web page max is 1160px. Vertical rhythm is expressed in multiples of the
body line-height — roughly 1.2× between sections, 0.7× from a heading to its first card,
0.85× between stacked cards — so the whole layout breathes with the user's text size.
Cards are 100px minimum height with a 115px (90px for speakers) full-bleed icon pip flush
to the left edge.

**Corner radii.** 10px on elevated list cards, 12px on buttons/controls/fields, 14px on
notebook and prayer cards, 16px on heroes and flat panels, 999px on pills. Icon pips
inherit the card radius on their two left corners only (9px inside a 10px card).

**Cards.** White (`--surface-lowest`), a **0.5px** `#c5dedd` hairline border, `0 4px 12px
rgba(0,0,0,.10)`. Lighter list cards (notebook, prayers) drop the border and use
`0 1px 3px rgba(0,0,0,.04)`. Notebook entries add a 3.5px left border in the entry-type
color — that border is the *only* differentiation: no badges, no colored top strips, no
tinted card fills.

**Shadows.** Four, all neutral-cool and wide rather than dark: card `0 1px 3px/.04`,
surface `0 4px 12px/.10`, floating `0 10px 24px rgba(25,28,28,.08)`, ambient
`0 12px 32px rgba(25,28,28,.06)`. The tab bar casts *upward* (`0 -8px 24px`). The FAB is the
one saturated shadow: `0 4px 15px rgba(45,76,71,.40)`.

**Backgrounds & imagery.** Photography is the emotional layer: 41 rotating "reflection"
images, one per day — water, light through trees, horizons, stone, mist. Soft natural
light, cool-to-neutral cast, low contrast, **no people, no text, no faces**. Always
full-bleed, always behind a scrim (`transparent → rgba(0,0,0,.55)`) before any type sits on
it. The second background system is flat teal with the **ripple motif**: six concentric
hairline white circles (r 50–200, 0.75px, opacity .45→.06) emanating from the top-right
corner. There are no gradients other than the 135° teal hero gradient and the photo scrim —
and no patterns, textures, grain, or noise.

**Transparency & blur.** Used sparingly: header/glass surfaces at 80% with a 12px blur,
white text at .95/.73/.55 opacity for hierarchy on teal, ghost borders at 15% opacity.
Never blur behind body copy.

**Motion.** Restrained. 120–320ms, `cubic-bezier(.4,0,.2,1)`. Cross-fades and small
translations only — no bounce, no spring, no parallax, no attention-seeking loops. The one
"living" element is the speaker equalizer bar while audio plays.

**Hover / press.** Hover brightens a filled surface ~6% or shifts teal toward ocean; press
translates 1px down and drops opacity to ~0.6–0.8 on text targets. Disabled is a flat 0.55
opacity — never a grey re-color. Focus is a 2px `#2D4C47` border on the field itself.

**Rules & dividers.** Hairlines only: `rgba(0,0,0,.08)` between content, `#C6D2CF` around
cards and modals. Timeline date dividers are centered 11px uppercase text with hairlines
either side.

**Fixed elements.** Teal header at the top of every screen; 5-tab bar pinned at the bottom
(Today, Notebook, Speakers, Prayers, Settings); FAB bottom-right in the notebook, above the
tab bar. On the web the header becomes a sticky translucent bar and the tab bar becomes a
teal footer.

## ICONOGRAPHY

The app runs **its own hand-drawn line-art set** — not a licensed icon font. Ten SVGs live
at `components/icons/*` in the repo and are copied here as
`assets/icons/*.svg` and as the `Icon` component:

`feather` (Journal) · `seedling` (Gratitude) · `soft-exhale` (Spot Check) ·
`moon-on-water` (Nightly Review) · `light-on-water` (Today) · `leaf-on-water` (Prayers) ·
`stacked-stones` (Settings/More) · `microphone` (Speakers) · `nautilus` · `four-squares`.

Rules, taken from `docs/visual-redesign-change-spec.md` §1:
- 32×32 viewBox, `fill="none"`, round caps and joins, stroke-width **1.6 default / 1.8
  active**, secondary strokes dropped to 0.5/0.3 opacity to suggest water and depth.
- Sizes in use: 14px inline with a label, 18px in chips and tinted squares, 24px in nav and
  form headers, 34–38px inside icon pips, 40px on web feature cards.
- Entry-type icons always take their type's accent color. Nav icons are teal at full
  opacity when active, 0.35–0.55 when not. On teal, icons are white at 0.9–1.0 opacity.
- **No emoji, anywhere** — the redesign explicitly removed them.
- The small utility glyphs (chevron, play, search, plus, bookmark, share, book, settings)
  are drawn to the same 32-grid and stroke weights so the set stays coherent. Material
  Icons appear in the current native build for a few of these; the versions here are the
  brand-consistent replacements.

**Logo:** the repo ships **no vector logo or wordmark**. The only brand marks are raster app
icons (`assets/icon.png`, `assets/new-splash-icon.png`, `assets/adaptive-icon.png`, copied
in). Wherever a logo would go, set the name **"Al-Anon Daily Paths" in Cormorant Garamond
italic 600** — that is how the app itself renders its brand. Nothing here was drawn from
memory; ask the brand owner for a real mark if one exists.

---

## Index

**Root**
- `styles.css` — the single entry point consumers link. `@import`s only.
- `readme.md` — this file. `SKILL.md` — portable skill wrapper. `github.md` — source association.
- `thumbnail.html` — homepage tile.

**`tokens/`** — `fonts.css` (Manrope, Cormorant Garamond, Lora via Google Fonts),
`colors.css`, `typography.css`, `spacing.css`, `elevation.css`, `base.css` (link colors).

**`assets/`** — `icons/*.svg` (the 10 brand icons), `reflections/*.webp` (6 of the 41 daily
reflection photographs), app icons (`icon.png`, `new-splash-icon.png`,
`round-splash-icon.png`, `adaptive-icon.png`, `favicon.png`), feature imagery
(`hero-image.jpg`, `home-page.jpg`, `journal.jpg`, `gratitude.jpg`, `spot_check.jpg`,
`nightly_review.jpg`), and `fonts/CrimsonText-Regular.ttf` (shipped in the repo but unused
by the current theme).

**Components**

*Core (`components/core/`)* — `Button`, `Pill`, `Card`, `Field`, `Input`, `Badge`,
`ProgressBar`, `Icon`.

*Layout (`components/layout/`)* — `AppHeader`, `PageTitle`, `SectionTitle`,
`CollectionLink`, `TabBar`.

*Content (`components/content/`)* — `HeroCard`, `ToolRow`, `EntryCard`, `PrayerCard`,
`SpeakerCard`, `QuoteBlock`, `RippleField`.

Each directory carries a `*.card.html` gallery; each component has a `.d.ts` contract and a
`.prompt.md` usage note.

**UI kits**
- `ui_kits/app/` — the shipping mobile app: Today, Daily Reflection, Notebook, Prayers,
  Speakers, click-through in a device frame.
- `ui_kits/website/` — the expanded website: Home, Today's Reflection, Daily Tools,
  Speakers.

**Guidelines (`guidelines/`)** — 19 specimen cards feeding the Design System tab: color
ramps, type ladders, spacing, radii, elevation, icons, brand mark, imagery, ripple motif.

### Intentional additions

The source is a React Native app, so a few web primitives have no literal counterpart:
- `Input` — a bare web text input to sit inside `Field` (RN's `TextInput` is one component).
- `Badge` — extracted from the inline "Downloaded" / "E" markers on speaker cards.
- `RippleField` — extracted from the inline SVG ripple decoration in `home.tsx`.
- `QuoteBlock` — extracted from the repeated open-quote-glyph + Lora pattern used on the
  home speaker card and the reading screen.
- Utility glyphs in `Icon` (chevron, play, search, plus, bookmark, share, book, settings) —
  the app uses Material Icons for these; these are stroke-matched replacements.

### Known gaps / substitutions

- **Fonts** load from Google Fonts (Manrope, Cormorant Garamond, Lora) — the repo loads
  them via `@expo-google-fonts`, so no binaries exist to copy. `CrimsonText` and
  `Quintessential` TTFs are in the repo but unused by the current theme.
- **Reflection photography** — 6 of 41 images copied as representative samples.
- **No logo vector.** See ICONOGRAPHY.
- Screens not recreated: Settings/More, Journal entry detail, date picker, paywall/trial
  sheets, QA panel.
