# Content model

## One reading

366 records. `date` is the natural key. See `readings.schema.json` for the machine-readable
version.

```json
{
  "date": "01-15",
  "slug": "january-15-the-convincing-game",
  "title": "The Convincing Game",
  "quote": "…",
  "attribution": "Paths to Recovery, p. 82",
  "body": ["paragraph", "paragraph"],
  "reminder": "Partnership means I do my part and God does God's part.",
  "step": 1,
  "topics": ["letting-go", "guilt-blame-shame"],
  "favorites": 412,
  "thumbs": 88
}
```

## The two rules that matter

**One Step per reading.** You get it free from the month the reading sits in — twelve months,
twelve Steps. No tagging work, no judgment calls.

**One primary topic per reading**, which is `topics[0]`. It decides which topic page *owns*
the reading and where the canonical internal link points. Without a primary, every reading
drifts into four or five topics and the topic pages stop being distinct from each other.

Then: **no reading without at least one topic.** An untagged reading is an orphan page that
only the calendar links to.

Secondary topics are optional. Cap at three total. Resist a feelings/keyword layer — put those
words in the topic page's prose, where they do the search work without a second table to
maintain.

## Sizing

- A topic needs **≥ 12 readings** or the page is too thin to be worth landing on.
- A topic over **~45 readings** has become a calendar and needs splitting or sub-grouping.
- 366 readings × 1–3 topics ≈ 500–650 tag slots ÷ 12 collections ≈ **35–45 each**. That's the
  target band.

If two topics keep collecting the same readings, they are one topic. If a topic's name is a
program concept rather than a situation someone would type into a search box, rename it.

## How to tag 366 readings without losing a week

1. **Fill `step` by rule** from the month. Zero effort, 366 rows done.
2. **Pass one — primary topic only**, month by month in a spreadsheet. It goes fast because a
   given month's readings cluster into two or three topics.
3. **Pass two — secondary topics only where obvious.** Skip anything that needs thinking about;
   a missing secondary tag costs nothing.
4. **Check the counts.** Anything under 12 or over 45 means the topic is wrong, not the tagging.
5. Export one `readings.json` and generate every page from it.

## The fourteen topics

Twelve reading collections plus two background topics. Machine-readable in `topics.json`.

| Topic | Kind | Note |
|---|---|---|
| Letting Go | readings | Merged the old Powerlessness & Surrender with Letting Go of Control. The spine; will be the biggest |
| Living With Active Drinking | readings | NEW — where most readers actually are |
| Anger and Resentment | readings | NEW — big gap in the old list |
| Fear and Worry | readings | NEW |
| Guilt, Blame, and Shame | readings | NEW — "was this my fault" |
| Detachment with Love | readings | Kept; the one piece of Al-Anon vocabulary people search by name |
| Helping or Enabling? | readings | NEW — the first-month question |
| Boundaries and Saying No | readings | Kept, expanded |
| Getting Yourself Back | readings | Replaced Focus on Yourself + Self-Worth & Identity |
| One Day at a Time | readings | Kept; canonical and searched |
| Higher Power and Trust | readings | Kept, renamed — must hold space for people who bristle at it |
| Gratitude | readings | Split from the old Gratitude & Hope |
| Alcoholism as a Disease | background | Great topic, few or no readings — hence the background template |
| You're Not Alone | background | Meetings and fellowship |

**Retired:** Powerlessness & Surrender, Letting Go of Control, Focus on Yourself, Self-Worth &
Identity, Honesty & Self-Awareness, Gratitude & Hope, Understanding the Disease, Community &
Fellowship, Themes (as a name).

**Held in reserve** — add once the tag counts are in: *Grown Children of Alcoholics* (distinct
audience, heavy search demand, may not match the readings at all), *Forgiveness and Amends*,
*When Things Get Better* (for members years in — the returning readers).

## Popularity data

You already have favorites and thumbs from the app. Three surfaces read from it, all generated
by one monthly job:

| Surface | Size | Query |
|---|---|---|
| `/most-read/` | 6 + 18 | top 24 overall |
| Topic page, "Most read on this topic" | 5 | top 5 where topic is primary |
| Step page, "Six readings on Step N" | 6 | top 6 where step = N |

**Never render the numbers.** No counts, no hearts, no rank badges — the design system's voice
rule is that metadata is quiet and never gamified. The ordering is the whole signal. One muted
line at the foot of Most read is allowed to say how it's ordered.
