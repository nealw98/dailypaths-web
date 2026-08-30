# What changed, and what's still open

Written August 2026. **Read this before the README.**

## August 29, 2026 — reading-page links + the site link map

Two new documents, both current and both taking precedence over the README where they overlap:

- **`daily-reflection-page.md`** — the bottom of a reflection was a generic topic directory
  (the same four topic cards on all 366 readings). It is now *Keep reading* (three readings from
  this reading's primary topic) and *Related topics* (its secondary topics plus its Step). The
  topic and Step pills under the title are live links. The "New here?" hairline became a seafoam
  panel with the question a newcomer recognizes. Generic "All topics" and "Most read" links were
  removed from the page — the header already carries Topics.
- **`architecture/README.md`** + `architecture/link-map.png` + the live diagram at
  `prototype/Site Architecture.dc.html` — every template and the links between them, including
  the reading ⇄ topic loop above.

Screenshots of the rebuilt sections: `architecture/reading-*.png`.

## The consolidation pass

## Why

The site was doing too much. Six nav items, two competing taxonomies over the same 366
readings, a home page that duplicated the reading page, and six app CTAs arguing with each
other. Everything below is a subtraction unless marked NEW.

## Structural changes

| Before | After |
|---|---|
| Home + Today's Reflection (two pages) | **One page.** Home *is* the day's reading |
| Steps and Themes both in the nav | **Topics** in the nav; Steps live under it |
| Themes (12) | **Topics (14)** — renamed and re-cut; see `content-model.md` |
| Al-Anon page + Start here (overlapping) | **Start here** only; it absorbed the Al-Anon page |
| Essentials (long readings + prayers) | **Prayers** page; long readings moved onto topic pages |
| Six app CTAs | **Three:** home (full pitch), Step detail (journaling), Prayers (own prayers) |
| Three home hero variants | One. Reading-first, decided |
| Step page listed the month's ~30 readings | **Six most-read** for that Step |
| Topic readings grouped by sub-theme | Grouped **by Step**, showing the cross-Step spread |
| — | **NEW: Most read** page (`/most-read/`) |
| — | **NEW: background topic** template, for topics with no readings |

### Things deliberately deleted — don't restore them

- The photo and teal home heroes.
- The home "Are you affected by someone else's drinking?" teal band (Start here says it better).
- The duplicate self-quiz, meeting band, and hero from the old Al-Anon page.
- The Essentials jump-pill nav.
- `reflections-30.webp` and `reflections-33.webp` as any hero — both contain people, which the
  design system's imagery rule forbids.

## Open work, in the order I'd do it

1. **Build the reading calendar** (`/archive/` or `/calendar/`). The mock links to it from the
   reading page and the footer, and it doesn't exist. It's the only browsable path to all 366
   readings, the thing that makes them crawlable, and — per the site owner — the calendar is the
   one place a date-based view belongs.
2. **Build the reading database and tag it.** `content-model.md` has the schema and the plan.
   Everything else on this list depends on it.
3. **Wire the popularity lists** from real favorites/thumbs data: Most read (24), each topic's
   "Most read on this topic" (5), each Step's "Six readings" (6). One monthly job, three outputs.
4. **Decide the literature-quote question.** The background topic template quotes Al-Anon
   literature. The prototype's passages are marked placeholders. Get permission for exact
   approved wording, or delete the quote cards and link out instead. Do not paraphrase Al-Anon
   text into something that reads like Al-Anon text.
5. **A daily-reflection email.** Nothing on the site yet gives a reason to come back to the
   *web*. This is the strongest retention tool available here and the warmest install list the
   project will ever own.
6. **Sticky mobile bottom bar** with prev/next and one app link.

## Ads (AdSense) — deferred, but design them when the time comes

The owner's position: get the basics working and indexed first. When ads do arrive, design the
slots rather than letting auto-ads land anywhere: sand frame, hairline border, small
"Advertisement" label in 11px uppercase muted, fixed positions.

**Hard rules:** no ad above the fold on a reading. None on the Start here page at all —
including the self-quiz and the 988 crisis line. None on the background topics' literature
quotes.

## Review scaffolding in the prototype — never implement

The dark floating pill bar (Desktop/Mobile toggle) and the browser-frame container. The real
page starts at the sticky `<header>`. The mock also fakes responsiveness with CSS container
queries (`cqw`); production should use ordinary viewport queries.
