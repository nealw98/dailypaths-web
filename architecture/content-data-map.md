# Daily Paths content data map

This document defines how daily readings support the website's Steps, themes,
reader-favorite sections, and moderated member perspectives. It distinguishes
the current production data from proposed scaffolding that still needs approval
or implementation.

## Content relationships

```text
Reading (366)
  |-- belongs to one program principle: Step, Tradition, or Concept
  |-- belongs to 1-3 ranked website themes
  |-- receives anonymous app feedback
  |-- may be selected editorially as a foundational reading
  `-- may surface as a reader favorite when feedback is sufficient

Program principle page (Step / Tradition / Concept)
  |-- contains concise educational content
  |-- links to foundational readings
  |-- links to qualified reader favorites
  `-- may contain moderated member perspectives

Theme page
  |-- contains concise educational content
  |-- owns readings for which it is the primary theme
  |-- links to readings for which it is a supporting theme
  |-- links to foundational readings
  |-- links to qualified reader favorites
  `-- may contain moderated member perspectives
```

## 1. Daily readings

Source of truth: `public.readings` in Supabase.

### Existing production fields used by the website

| Field | Purpose |
| --- | --- |
| `id` | Stable database identifier |
| `day_of_year` | Calendar identity and ordering |
| `display_date` | Human-readable date |
| `title` | Reading title |
| `opening` | Opening text |
| `body` | Main reflection |
| `application` | Practical application |
| `quote` | Closing quotation |
| `thought_for_day` | Closing thought |
| `step_theme` | Exact program principle, such as `Step 8`, `Tradition 8`, or `Concept 8` |
| `secondary_theme` | Legacy broad classification; not suitable as the new website-theme relationship |

### Proposed fields

| Field | Type | Rule |
| --- | --- | --- |
| `themes` | ordered `text[]` | One to three active theme slugs; first value is primary |
| `keywords` | `text[]` | Optional search terms; not used to determine theme membership |

Theme rules:

1. Every classified reading has exactly one primary website theme.
2. A second or third theme is added only when it is substantively important.
3. Array order represents relevance.
4. Theme membership is editorial; app feedback never assigns a theme.
5. `step_theme` remains authoritative and independent of `themes`.

Example:

```json
{
  "id": "reading-id",
  "day_of_year": 232,
  "step_theme": "Step 8",
  "themes": [
    "guilt-blame-shame",
    "getting-yourself-back"
  ]
}
```

## 2. Website themes

Source of truth: `public.themes` in Supabase. The physical table name remains
`themes` so existing site and app integrations do not break.

### Proposed active taxonomy

| Order | Slug | Display name | Kind |
| ---: | --- | --- | --- |
| 1 | `letting-go` | Letting Go | readings |
| 2 | `living-with-active-drinking` | Living With Active Drinking | readings |
| 3 | `anger-and-resentment` | Anger and Resentment | readings |
| 4 | `fear-and-worry` | Fear and Worry | readings |
| 5 | `guilt-blame-shame` | Guilt, Blame, and Shame | readings |
| 6 | `detachment-with-love` | Detachment with Love | readings |
| 7 | `helping-or-enabling` | Helping or Enabling? | readings |
| 8 | `boundaries` | Boundaries and Saying No | readings |
| 9 | `getting-yourself-back` | Getting Yourself Back | readings |
| 10 | `one-day-at-a-time` | One Day at a Time | readings |
| 11 | `higher-power-and-trust` | Higher Power and Trust | readings |
| 12 | `gratitude` | Gratitude | readings |
| 13 | `alcoholism-as-a-disease` | Alcoholism as a Disease | background |
| 14 | `youre-not-alone` | You're Not Alone | background |

`readings` themes organize the daily-reading collection. `background` themes
primarily support educational and newcomer content but may still have related
readings.

Before classification, each theme needs a short editorial definition covering:

- What belongs in the theme
- What does not belong
- Neighboring themes that are easily confused with it
- Two or three representative reading examples

## 3. Program principles

The existing `readings.step_theme` value is the relationship between a reading
and a Step, Tradition, or Concept. No new `primary_step` field is needed.

Examples:

```text
Step 8
Tradition 8
Concept 8
```

The calendar month provides the shared number, but the exact `step_theme` value
determines which section owns the reading. A Step Eight page must not present a
Tradition Eight or Concept Eight reading as Step Eight material.

## 4. App feedback

Current source: `public.app_reading_feedback` in the external Supabase project.

Current site aggregation:

```text
day_of_year -> positive, neutral, negative, total
```

Favorites are mentioned in the app and privacy copy, but the current website
fetcher does not retrieve an aggregate favorite count. The favorite source and
available denominator must be confirmed before favorite-based ranking is built.

Feedback has two separate uses:

1. **Editorial improvement**: identify readings that may need revision.
2. **Reader-favorite selection**: rank already-relevant readings within a Step
   or theme after a minimum-data threshold is met.

Feedback must not determine Step or theme membership.

### Proposed derived metrics

| Metric | Definition |
| --- | --- |
| `helpful_rate` | Positive responses divided by eligible rating responses |
| `negative_rate` | Negative responses divided by eligible rating responses |
| `favorite_count` | Number of users who saved the reading |
| `favorite_rate` | Favorites divided by an agreed eligible-user or view denominator, if available |
| `feedback_count` | Total qualifying responses |

The public label `Reader favorites` should not appear until a minimum sample
rule is agreed. Counts and percentages should always include their denominator.

## 5. Editorial reading selections

Each Step or theme may have stable, manually approved foundational readings.
These should be stored separately from calculated reader favorites.

Proposed logical record:

```text
collection type: theme | step | tradition | concept
collection key: theme slug or exact step_theme value
reading id
selection type: foundational | featured
rank
editor note
active
```

A normalized join table is preferable to embedding reading IDs in essay copy.
It permits ranking, moderation, and future reuse without changing page HTML.

Proposed table name: `content_reading_selections`.

## 6. Moderated member perspectives

Current source: `public.member_shares`.

Fields currently consumed by the build:

| Field | Purpose |
| --- | --- |
| `id` | Stable submission identifier |
| `topic_slug` | Current page association |
| `display_name` | Public attribution or anonymous display |
| `content` | Submitted perspective |
| `created_at` | Ordering |
| `is_approved` | Moderation gate |
| `is_featured` | Publication gate used by the website |

The current relationship supports theme pages. To support Steps, Traditions,
and Concepts cleanly, the association should eventually become polymorphic:

```text
collection type: theme | step | tradition | concept
collection key: theme slug or exact step_theme value
```

Until there are more submissions, perspectives remain embedded supporting
content. They should not generate standalone indexable pages or empty sections.

## 7. Page assembly rules

### Theme page

```text
Concise educational guide
-> Foundational readings (manual, stable)
-> Reader favorites (calculated, only above threshold)
-> More related readings (primary first, supporting second)
-> Moderated member perspective, when available
```

### Step / Tradition / Concept page

```text
Concise educational guide
-> Foundational readings matching exact step_theme
-> Reader favorites matching exact step_theme
-> Related themes
-> Moderated member perspective, when available
```

### Reading page

```text
Reading content
-> Exact Step / Tradition / Concept link
-> Primary theme link
-> Optional supporting-theme links
-> Previous and next reading
```

Empty sections are omitted from generated HTML. No placeholder cards or hidden
SEO content should be emitted.

## 8. Classification workflow

1. Approve the final theme list and definitions.
2. Generate one-to-three ranked theme candidates for all 366 readings.
3. Store confidence and a short classification reason in the review artifact,
   not necessarily in the production table.
4. Manually review ambiguous cases, all three-theme assignments, distribution
   outliers, and random samples from high-confidence assignments.
5. Export the approved mapping as CSV.
6. Dry-run the importer and review conflicts and distribution counts.
7. Apply the approved mapping to Supabase.
8. Update the site fetcher and templates to use `themes` instead of the legacy
   `secondary_theme` mapping.

Suggested review CSV:

```csv
date,slug,primary_theme,theme_2,theme_3,confidence,reason,review_status,notes
```

## 9. Decisions still required

1. Approve or revise the fourteen-theme taxonomy.
2. Write inclusion/exclusion definitions for every theme.
3. Decide whether `background` themes may own readings or only support them.
4. Confirm where favorite events are stored and what denominator is available.
5. Set the minimum sample threshold for the `Reader favorites` label.
6. Decide how many foundational and favorite readings appear on each page.
7. Choose whether editorial selections live in Supabase or a version-controlled
   site data file.
8. Decide whether member shares should adopt the generalized collection
   relationship now or later.

## 10. Implementation status

| Component | Status |
| --- | --- |
| Existing reading content and `step_theme` | Production |
| Legacy `secondary_theme` | Production; slated for replacement in site relationships |
| Proposed `themes` array and taxonomy migration | Present locally; not assumed deployed |
| Theme classification importer | Present locally; assignments not complete |
| Rating aggregation | Implemented for positive/neutral/negative feedback |
| Favorite aggregation | Not yet confirmed or implemented for the website |
| Approved/featured theme shares | Implemented |
| Step/Tradition/Concept share association | Proposed |
| Editorial selection store | Proposed |
| Theme-based page assembly | Partially implemented using legacy tags; needs migration |
