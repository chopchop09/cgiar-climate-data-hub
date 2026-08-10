# Concept A: the layered reading

One of two design interpretations of the feedback of 10/08/2026, built to elicit
structured feedback rather than general reaction. IITA Internal Use.

**The interpretation.** The feedback described three layers stacked on each other:
static content, a query layer on top, and an analytics and country-profile layer on
top of that. Concept A takes that literally and keeps the layers genuinely separate.
Three pages, three tiers, each reachable on its own and each able to be built,
judged, funded or dropped without touching the others.

**The bet.** The three layers have different costs, different owners and different
failure modes, so they should not be fused. Tier 1 is cheap and useful alone. Tier 2
is a modest addition once tier 1 exists. Tier 3 is expensive and depends on data
nobody has assembled. If the bet is right, the front page should feel plain, and
that plainness is a feature.

## Files

```
concept-a/
  index.html          Tier 1, the six static collections, plus the doors to tiers 2 and 3
  query.html          Tier 2, one query across every collection
  analyse.html        Tier 3, country profile structure and portfolio analytics
  README.md           This file
  assets/
    data.js           The content model, shared byte-for-byte with Concept B
    styles.css        All styling, shared byte-for-byte with Concept B
    app.js            Shelf tabs, lens filters, query, profile template
    cgiar-logo.png    Header and footer logo
```

No build step. Open `index.html` in a browser and it works, including offline: the
only network request is the Google Fonts stylesheet, and the local font stack takes
over silently if it does not load.

## What is real

- All 44 catalogued items, their sources and their outbound links. Every link was
  either carried over from the v0.2 prototype, where it had already been checked, or
  verified on 10/08/2026 while building this.
- The keyword search on tier 2. Real scoring, real filtering, entirely in the browser,
  no network calls, nothing sent anywhere.
- The lens filters on every collection, and the geography facet, built from the data.
- The portfolio analytics on tier 3: counts computed from the eight projects at page
  load, so they cannot drift out of step with the list on tier 1.
- The country profile section list, the named source layers, and the obstacle stated
  against each section.

## What is deliberately not real

- **No country figures anywhere.** Populating the profile with plausible-looking
  numbers would make the mockup impossible to review honestly, so it shows structure
  only and says so on the page.
- **No country selector.** The programme publishes a count of priority countries,
  20 Tier 1 and 6 Tier 2, but the names were not confirmed for this prototype.
- **The experts collection is six use-case champions, not a directory.** The
  centre-by-centre list does not exist yet and no process for maintaining it or for
  opting out has been agreed. Stated on the page.
- **The corpus is 44 hand-catalogued items.** Search does not reach CGSpace, Gardian
  or the Data Hub catalogue. An empty result means this prototype has not catalogued
  something, not that CGIAR has not done it. Stated on both pages that search.

## A finding worth raising

Searching tier 2 for `drought` returns one item. Drought was named in the 10/08
discussion as the topic recurring across the most conversations. That gap is not a
bug in the search: it is what the prototype's own catalogue currently contains, and
it is a reasonable argument that the tagging and ingestion work matters more than
either concept's front end.

## Naming

The folder uses hyphens rather than spaces so the paths stay clean if this is ever
served from the existing Vercel project. Nothing here uses underscores.

## Deploying

If these are pushed to the existing `cgiar-climate-data-hub` repo, Vercel publishes
them automatically at `/concept-a/`. Nothing in this folder touches the
files of the live v0.2 prototype.
