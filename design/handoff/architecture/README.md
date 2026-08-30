# Link map — how the pages connect

Live diagram: `../prototype/Site Architecture.dc.html` (open in a browser; two tweaks toggle
the route slugs and the cross-link lines). Flat capture: `link-map.png`.

## How to read it

- **Teal band across the top** — the global header, present on every page: Today's Reflection ·
  Topics · Prayers · Start here. The four short drops below it are those nav links.
- **Solid teal lines** — the primary path between two page types. Arrowheads show direction;
  the one two-headed line (reading ⇄ its topic) is the loop the site is built around.
- **Dashed terracotta line** — a link that exists in the design but whose destination is not
  built: the reading calendar.
- **Grey boxes at the bottom** — off-site: the app stores and al-anon.org.
- **Small teal text inside a card** — outbound links that are real but not drawn, kept as text
  so the picture stays readable. Read them as part of the map, not as notes.
- **Edge labels** — why a line exists: "12 cards", "from intro copy", "grouped by Step".

## The nine templates

| Route | Template | In nav | Count |
|---|---|---|---|
| `/` | Today's Reflection — the home page *is* the day's reading | yes | template for 366 |
| `/topics/` | Topics index | yes | 14 cards |
| `/topics/{slug}/` | Topic — reading collection | — | 12 |
| `/topics/{slug}/` | Topic — background | — | 2 |
| `/steps/` | Steps index | — | 1 |
| `/steps/{n}/` | Step detail | — | 12 |
| `/most-read/` | Most read | — | 1 |
| `/prayers/` | Prayers | yes | 1 |
| `/start-here/` | Start here | yes | 1 |

Steps are reachable only from a sentence in the Topics intro — deliberate; the Steps are a
secondary axis over the same 366 readings, not a second taxonomy in the header.

## The rules the map encodes

1. **No page dead-ends.** Every template has at least one contextual path onward.
2. **A reading hands you to its own topic, its own Step, and other readings in that topic** —
   never to a generic directory. See `../daily-reflection-page.md`.
3. **Date-based browsing lives only in the calendar.** No archive links anywhere else.
4. **Three app CTAs, site-wide:** home, Step detail, Prayers.
5. **Background topics must point at the collections that carry the subject**, or they
   dead-end by construction.
6. **Popularity ordering is never shown as numbers** — no counts, hearts, or ranks.

## The one gap

The calendar. Two live pages already link to it, and without it 365 of the 366 readings have no
crawlable route. Highest-priority build item.
