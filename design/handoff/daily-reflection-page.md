# Daily Reflection page — link changes (August 29, 2026)

Supersedes the "Read by topic" section described in `README.md`. Everything else on the
reading page is unchanged. Prototype: `prototype/Dailypaths Site.dc.html`, `page: "home"`.
Link map for the whole site: `prototype/Site Architecture.dc.html`.

## Why

The bottom of a reflection was a site directory, not a continuation. `themesPreview` rendered
the **first four topics in the list — identical on all 366 readings** — plus "All topics" and
"Most read" links. Nothing on the page was specific to what the person had just read, and
reading-to-reading links did not exist anywhere on the site.

The rule now: **a reflection hands you to its own topic, its own Step, and other reflections
in that topic. Nothing generic.** The header already carries Topics; the page must not repeat it.

## What the page links to now, top to bottom

| Element | Destination | Source of truth |
|---|---|---|
| Topic pill under the title | primary topic collection | `topics[0]` |
| Step pill under the title | that reading's Step page | derived from month |
| Previous / Next cards | adjacent day | `date` ± 1 |
| Browse the reading calendar | `/calendar/` | still unbuilt |
| **New here panel** (rebuilt) | `/start-here/` | static |
| **Keep reading** — 3 reading cards | 3 other readings in `topics[0]` | see selection rule |
| "All of Letting Go →" | primary topic collection | `topics[0]` |
| **Related topics** — 2 cards | `topics[1]`, `topics[2]` | secondary tags |
| **Related topics** — 3rd card | that reading's Step page | derived from month |
| App CTA | store links | static |

Removed: the four generic topic cards, "All topics →", "The readings people come back to →".
Most read keeps its entry points in the Topics intro and the footer.

## 1. Keep reading — "More on letting go"

Section head: eyebrow `Keep reading` (Manrope 600, 13px, uppercase, +0.4px, `--accent`),
h2 in Cormorant 600 clamp(28–40px) reading `More on {topic, lowercased}`, then a line naming
the collection with its count, and a right-aligned `All of {Topic} →` link.

Three cards, `repeat(auto-fill,minmax(250px,1fr))`, gap 14px:
`--surface-low` fill, radius 14, `--shadow-card`, **no border** — date eyebrow (12px uppercase
muted) · title (Cormorant 600, 22px) · one-line why (15/24 muted) · `Read →`.

**Selection rule (build-time, deterministic — do not randomize):** from `topics[0]`'s reading
list, take the three highest-favorited readings that are not this one and not its Previous or
Next. Tie-break by date ascending. Precompute per reading; never query at request time.

The one-line "why" is authored copy, not the first sentence of the reading. It belongs in the
reading record (`teaser`, ≤90 chars) — see `readings.schema.json`.

## 2. Related topics

Divider: 44px top margin, 26px padding above the rule, `1px var(--rule)`. Eyebrow
`Related topics`. Three cards on the same grid, visually **distinct in kind** from the reading
cards: white `--surface-lowest`, `0.5px var(--border-card)` hairline, radius 14, `--shadow-card`
— title (Cormorant 600, 21px) · line (15/23 muted) · count as quiet metadata (13px, `--text-muted`, +0.3px).

Cards 1–2 are `topics[1..2]`. Card 3 is the reading's Step, worded so it explains itself
("Willingness — the Step this reading belongs to"), because a newcomer does not know what
Step Eight is.

A reading with only one topic renders two cards; the grid absorbs it. Never pad to three.

**Link wording — settled, do not reword.** Every one of these links goes to a *topic page*, so
the **topic name is the link and the count is metadata**. Never label a link with a reading
count ("42 readings →"): the destination is a topic page with an essay above its list, not a
list of 42 readings. Never invent a verb phrase for it either ("Open the collection", "Read the
collection") — the topic name is the label. On the cards, the whole card is the click target,
the title carries the name, and the count sits underneath as plain muted text with no arrow.

## 3. New here — rebuilt, louder on purpose

Was a hairline strip. A newcomer did not see it. Now a `--accent-soft` (seafoam) panel,
radius 16, padding clamp(22–30px) × clamp(22–34px), flex with the CTA on the right:

- 28px `lightOnWater` icon, `--dp-teal-700`
- Cormorant 600 clamp(24–30px), `--dp-teal-900`: **"Is someone else's drinking affecting your life?"**
- 16/26 `--dp-teal-800`: "Twelve questions, two minutes. Nothing you answer is saved or sent anywhere."
- Primary Button: `Start here →`

The whole panel is the click target. **The privacy claim must stay literally true** — the quiz
persists and transmits nothing, including analytics.

This reverses an earlier decision to shrink this element; it is deliberate and it is the one
loud thing on the page. Keep it below the reading, never above it.

## 4. The pills are links now

`Letting Go →` and `Step Eight →`. Same destinations as the Keep reading heading and the Step
card — intentional duplication at two different moments (before reading, after reading).

**Decision still open:** where the topic pill lands. Today it opens the topic page at the top of
its essay, which is a wall of prose for someone who has just finished reading. Recommended:
`/topics/letting-go/#step-eight` — anchor into the reading list at the Step group this reading
came from. Essay for search arrivals, list for reading arrivals.

## Type sizes on the web

The design system's scale is written for a phone; on a 1160px page it reads small. Use:
reading body `clamp(18px,1.6cqw,19.5px)`/1.62 · section intros 17/28 · **card body and
descriptions 16/26** · nav, buttons, inline links 15px · eyebrows, dates, counts 13px.
Nothing below 12px. Card descriptions are content, not chrome — never 15px.

The prototype was updated to this scale on August 29.

## Data this section needs

Per reading: `topics[0..2]`, `step`, `teaser`, `favorites` (for sibling selection), and per
topic: `title`, `line`, `readingCount`. All of it precomputable in the monthly job that already
produces Most read, each topic's top five, and each Step's six.

Until the reading database exists, the prototype's sibling readings and counts are plausible
placeholders.
