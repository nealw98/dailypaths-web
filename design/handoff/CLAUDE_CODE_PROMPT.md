# Prompt for Claude Code — Daily Reflection page

Paste this whole block.

---

Read `design_handoff_dailypaths_site/CHANGES.md`, then `daily-reflection-page.md`, then
`architecture/README.md`. The live reference for every visual decision is the prototype at
`prototype/Dailypaths Site.dc.html` (page state `home`). **When the prototype and my prose
disagree, the prototype wins. Do not invent copy, labels, or link wording that is not in one of
those files — if something is unspecified, stop and ask rather than filling it in.**

Scope: the Daily Reflection page (`/`, and the same template for all 366 readings). Do not
touch other templates in this pass.

## What to build

1. **Keep reading** — replaces the four generic topic cards at the foot of the reading. Eyebrow
   "Keep reading", h2 "More on {topic name, lowercased}", a line giving the collection's size in
   words ("Forty-two readings on what was never yours to cure."), and a right-aligned link
   "All of {Topic} →". Below it, three cards linking to three *other readings* in this reading's
   primary topic.
2. **Related topics** — after a hairline divider, eyebrow "Related topics" and three cards: the
   reading's second and third topics, plus its Step. Each links to that page.
3. **New here** — the seafoam panel, exactly as in the prototype, between the reading and Keep
   reading. The whole panel is the click target.
4. **The topic and Step pills** under the title become links to the topic page and the Step page.

Removed and not to be reintroduced: the generic topic cards, "All topics →", and
"The readings people come back to →". The header already carries Topics.

## Rules that have bitten us already

- **Link wording is settled.** Every one of these links goes to a topic or Step *page*. The page
  name is the link; a reading count is metadata, never link text. No "42 readings →", no
  "Open the collection", no "Read the collection", no invented verb phrases.
- **Two card kinds must stay visually distinct.** Reading cards: `--surface-low` fill, no border.
  Topic/Step cards: white `--surface-lowest` with a 0.5px `--border-card` hairline. Both radius
  14, `--shadow-card`.
- **Sibling selection is deterministic and precomputed** — the three highest-favorited readings
  in the primary topic, excluding this reading and its previous/next; tie-break by date. Never
  random, never computed per request.
- **The New here privacy line must stay literally true.** The quiz persists and transmits
  nothing, including analytics.
- **Never render popularity as a number** — no counts of favorites, no ranks, no hearts. Reading
  counts per topic are fine; they are inventory, not popularity.
- **No emoji.** Icons come from the brand set only.
- A reading with only one topic renders two cards in Related topics. Never pad to three.

## Type sizes — use these, not the app's mobile scale

The design system's scale is written for a phone. On the desktop web, step it up:

| Role | Size |
|---|---|
| Long-form reading body (Lora) | `clamp(18px, 1.6cqw, 19.5px)` / 1.62 |
| Section intro paragraphs (Manrope) | 17px / 28px |
| Card body and descriptions | 16px / 26px |
| Nav, buttons, inline links | 15px |
| Eyebrows, dates, counts, metadata | 13px |
| Absolute floor, anywhere | 12px |

Card *content* is content, not chrome — do not set it at 15px. Nothing below 12px ships.

## Still open — do not decide these yourself

- Where the topic pill lands. Recommended `/topics/{slug}/#step-{n}`, anchoring into the reading
  list at this reading's Step group rather than the top of the topic essay. Confirm before
  implementing.
- The reading calendar does not exist. Leave the existing link pointing at it; do not build,
  rename, or remove it.
