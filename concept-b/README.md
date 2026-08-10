# Concept B: the unified reading

One of two design interpretations of the feedback of 10/08/2026, built to elicit
structured feedback rather than general reaction. IITA Internal Use.

**The interpretation.** The same three layers, read the opposite way. The layering is
a build sequence for the team, not a structure for the visitor. Someone arriving with
a question should not have to know that answering it involves a static collection, a
query layer and a synthesis step. So there is one page, one query, and three bands
that all react to the same state. There is no navigation between layers because there
are no separate layers.

**The bet.** A visitor's question does not arrive pre-sorted into a tier. Ask about
drought and you want the evidence, the people working on it and something you can
send onwards, in that order, without clicking anywhere. The cost of the bet is
plainly visible: the page is long, and a visitor who only wanted one link scrolls
past two bands that were not for them.

## Files

```
concept-b/
  index.html          The entire site
  README.md           This file
  assets/
    data.js           The content model, shared byte-for-byte with Concept A
    styles.css        All styling, shared byte-for-byte with Concept A
    app.js            Single query state, three bands rendered from it
    cgiar-logo.png    Header and footer logo
```

No build step. Open `index.html` and it works, including offline: the only network
request is the Google Fonts stylesheet, and the local font stack takes over silently
if it does not load.

## How the one query works

There is a single state object: query text, adaptation or mitigation, geography,
resource type. Every band re-renders from it.

- **Band 1, what already exists.** Matching publications, datasets, methods, innovation
  catalogues, experts, news and events, grouped by kind. Respects the resource-type
  facet.
- **Band 2, who is working on it.** The eight-project portfolio, filtered by the same
  query. Deliberately ignores the resource-type facet, because a project is not a
  resource type. An empty band here is informative: it says nobody has picked the
  topic up.
- **Band 3, build a brief.** The country-brief structure, with its scope line updating
  to reflect the query above, so a reviewer can see the synthesis layer reacting rather
  than sitting inert.

The facet bar is sticky, because in this concept filtering is the state of the page
rather than somewhere you go.

## What is real

- All 44 catalogued items, their sources and their outbound links. Every link was
  either carried over from the v0.2 prototype, where it had already been checked, or
  verified on 10/08/2026 while building this.
- The search and all three facets. Real scoring, real filtering, entirely in the
  browser, no network calls, nothing sent anywhere.
- Every count on the page, computed from the data at render time rather than typed.
- The brief's section list, named source layers and stated obstacles.

## What is deliberately not real

- **No figures in the brief.** Structure and source layers only, and the page says so.
  Plausible placeholder numbers would make honest review impossible.
- **No country selector.** The programme publishes a count of priority countries,
  20 Tier 1 and 6 Tier 2, but the names were not confirmed for this prototype.
- **The experts shown are six use-case champions, not a directory.** No
  centre-by-centre list exists and no opt-out process has been agreed. Stated on the
  page.
- **The corpus is 44 hand-catalogued items.** Search does not reach CGSpace, Gardian
  or the Data Hub catalogue.

## A finding worth raising

Search `drought` and band 1 returns one item while band 2 returns nothing at all.
Drought was named on 10/08 as the topic recurring across the most conversations. In
Concept B that gap is unusually visible, because the empty portfolio band sits
directly under the thin resource band. Whether that visibility is a virtue or an
embarrassment is worth asking the group directly.

## Naming

The folder uses hyphens rather than spaces so the paths stay clean if this is ever
served from the existing Vercel project. Nothing here uses underscores.

## Deploying

If pushed to the existing `cgiar-climate-data-hub` repo, Vercel publishes this at
`/concept-b/`. Nothing in this folder touches the live v0.2 prototype.
