# Secondary themes — a proposed taxonomy

A proposal for review, not generated output. Every one of the 366 reflections was
read and assigned. Two files accompany this one:

- `theme-taxonomy-proposed.csv` — the 43 proposed themes, each with its size, how
  many Steps/Traditions/Concepts it spans, and the current themes folded into it.
- `theme-taxonomy-readings.csv` — all 366 readings with current theme, proposed
  theme, and a `changed` flag. This is the sheet to review and correct.

Nothing is applied. The themes live in the Reading Room; changing them is an
editorial act, not a deployment.

## Why the current set does not work

| | Now | Proposed |
|---|---|---|
| Themes | 132 | **43** |
| Median readings per theme | 1 | 8 |
| Used by exactly one reading | 69 | 0 |
| Pages that could not show 3 related readings | 151 (41%) | **0** |

The site currently works around this by grouping related readings by *destination*
rather than by theme — a theme used once still joins the others heading to the
same page. That is what makes 132 themes survivable. It also means the theme word
is doing almost no work of its own.

## What actually went wrong

The year runs Step One in January through Step Twelve in December. Within each
month the tagger appears to have avoided repeating a word, so once the obvious
theme was spent, the next reading got an abstraction.

Step Ten has 26 readings and **26 distinct themes**. Step Eight has 26 and 25.
Step Nine has 25 and 24. That is not a taxonomy; it is a rule against repetition.

The clearest evidence: six readings tagged `Immediacy`, `Proportionality`,
`Courtesy`, `Purification`, `Continuity` and `Consideration` are all, without
exception, about **making amends** — and there was no `Amends` theme anywhere in
the 132. The same gap explains `Effort`, `Foundation`, `Tools`, `Application`,
`Completeness` and `Resourcefulness`, which are all about **practising the
program**, and `Availability` and `Example`, which are both **service**.

So the fix is not "find a synonym for Courtesy." It is to name the themes that
were never named and let each absorb its cluster. `Amends` arrives at 14 readings.
`Practice` at 17.

## The two tests every theme passes

1. **At least 5 readings** — enough to fill three related-reading cards after the
   reading itself and its previous/next neighbours are excluded. All 43 pass.
2. **Spanning at least 3 Steps/Traditions/Concepts** — a theme confined to one
   Step is that Step wearing a different name.

Seven themes fail the second test, deliberately: `Amends`, `Living Amends`,
`Coming to Believe`, `Readiness`, `Shame and Guilt`, `Powerlessness` and
`Understanding the Disease`. Each is a Step's actual subject — amends belong to
Steps Eight and Nine, readiness to Step Six — so concentration is correct, not
drift. Treat the spread test as a check on merges done for arithmetic, not as a
rule.

## Scale of the change

**280 of 366 readings (77%) get a different theme.** 86 keep the one they have.
That is a large edit, and it is the point: the current word on three-quarters of
these readings was chosen to avoid repetition rather than to describe the reading.

## What this unlocks

Related readings can match on **shared theme** alone, dropping the destination
layer. The heading becomes "More on amends" and means it — fourteen readings from
Steps Eight and Nine about the same thing, rather than a group assembled from
whatever pointed at the same page.

It also decouples the two jobs the theme table is doing. Once themes stand on
their own, the theme→destination table is free to be about *where a reader should
go next*, which is a separate editorial question (`LAUNCH-READINESS.md` B9).

## Where to push back

The assignments are judgement calls and some are close. Worth a second look:

- **`Practice` at 17** is the largest and the loosest — "using the program in
  daily life." It may want splitting into `Practice` and `Spiritual Growth`
  (currently 8), or some of it belongs in `Responsibility`.
- **`Amends` vs `Living Amends`** — the split is verbal amends versus changed
  behaviour. Defensible either way; merging gives one theme of 24, which is too
  big.
- **`Self-Awareness` at 14** absorbed `The Pause`, which is arguably its own idea
  (the gap between trigger and response).
- **`Letting Go` at 16 vs `Surrender` at 10 vs `Acceptance` at 10** — three
  neighbouring ideas. The lines between them are the most arguable in the set.

Correct the `proposed_theme` column in `theme-taxonomy-readings.csv` and the
counts can be re-checked before anything goes into the Reading Room.
