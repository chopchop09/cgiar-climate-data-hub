# Concept D, the reviewed reading

Built 13/08/2026. Five pages: `index.html`, `areas.html`, `resources.html`, `news.html`,
`get-involved.html`.

## What it is

Concept D is not a fourth independent guess at the information architecture. It is the shape the review
board asked for, built so the group can judge whether its own instructions produce a site it wants.

The instruction it answers most directly, from Brayden Youngberg on 13/08/2026:

> Overall I think a mix of C and the current (based on below feedback) would be best

## Every decision, and the note it came from

| Decision | Note it answers | Author, date |
|---|---|---|
| Multi-page, not one long page | "I prefer the multi-page design over 1 long single page" | Brayden Youngberg, 13/08 |
| Sticky bar with brand, nav and a persistent technical data hub link, all in one row | "Navbar should be sticky/be consolidated next to the hero + have a link to the technical data hub (copied from concept A)" | Brayden Youngberg, 13/08 |
| Five nav items, down from the current site's overlapping set | "A lot of overlap between Datasets, Tools, and Catalog"; "Catalog, Tools, Datasets and for data scientist will link to pretty much the same thing?" | Brayden Youngberg 13/08, Peter Steward 11/08 |
| Boundary panel on the home page | Six notes across four sections asking where this site ends and the technical hub begins | Both, 11/08 and 13/08 |
| Areas of work at the top level, use cases nested inside, folded by default | "Organization on thematic areas with use-cases nested within"; "perhaps a heirarchical filterable view would be good here" | Peter Steward, 11/08 |
| Five published areas of work used as the spine rather than the ten editorial themes | "The tab themes overlap a lot, need more diffierentiation" | Peter Steward, 11/08 |
| One search field, suggestions in the placeholder, no pills, no activity counters | "Possibly removing the search suggestion pills would help? the search placeholder can have these suggestions. Similarly, the 3 active/5 ideas could maybe be removed" | Brayden Youngberg, 13/08 |
| Featured datasets reduced to those meeting a stated, checkable rule | "Possibly this should just highlight some key 'foundational' datasets/tools"; "We just need to define what goes here vs the technical catalog" | Brayden Youngberg, 13/08 |
| Funding calls, events and calls for papers in three separate lists | "I would want the funding calls separate to publications" | Peter Steward, 11/08 |
| Freshness and ownership stated in the open on the news page | "How do we keep this up to date and managed? ... if it falls out of date it will look abandoned and people will stop looking" | Brayden Youngberg, 13/08 |
| A get-involved page saying what a use case is, what is wanted and what is offered | "Does not show how to suggest a new use-case or get involved"; "contact us/get involved needs unpacking" | Peter Steward, 11/08 |
| Footer trimmed, dataset list dropped, technical hub link added | "Possibly a bit tall with a bit too much content. I think datasets should be removed. + a link to the technical data hub again" | Brayden Youngberg, 13/08 |

## What it deliberately does not do, and why

Listed on `get-involved.html` rather than mocked up, because each needs content or infrastructure that does
not exist, and a plausible-looking mock-up would mislead the review.

- **Expert finder and forum.** No directory content beyond the six named use-case champions.
- **Ask the Hub.** Seven change notes and two costed objections from both reviewers.
- **Flyer Builder.** Same, with the cheaper alternative already proposed on the board.
- **Country profiles or a country selector.** The programme publishes a count of 20 priority countries, not
  the names, and no country-level figures have been compiled.
- **Newsletter sign-up and mailing lists.** Need a mailing tool, a cost line and an owner first.

## Data

`assets/data.js` and `assets/themes.js` are byte-identical copies of Concept C's. `assets/analytics.js` is the
shared tracking file with one line added, a `/concept-d` branch in `versionOf()`, and is byte-identical across
all five copies.

Nothing on any page is a typed-in number. Every count, including the metadata completeness figures, is computed
from the catalogue at page load. Three of the computed figures reproduce numbers established independently
while building the earlier concepts: 51 catalogued items, 5 of 14 datasets with complete metadata, and 3 items
matching a search for "drought" with none of them a use case.

## Not done

- `compare.html` still describes four versions. Adding Concept D to it is a content decision, since it changes
  the four-way table and possibly the eleven review questions.
- Concept D is **not** in the guard list in `Publish Hub concepts.command`. It has to be added in two places,
  the `:(exclude)` list in step 3 and the `git add` line in step 4, before it will publish.
