# V1: the Climate Hub ported to the CGIAR Gender Platform layout

Built 03/09/2026, after the feedback of the same date. IITA Internal Use. Not approved scope.

## What this is, and what it is not

This is not a sixth concept. The five concepts were a question about information architecture and
the 03/09/2026 feedback answered it: port the existing hub to the Gender Platform layout, build it
in Drupal, ship this year rather than spin for two. So V1 is Concept E, the lean V1 of 01/09/2026,
restructured to follow gender.cgiar.org, with the two new items that feedback asked for.

It is a **static prototype that maps one to one onto a Drupal build**. Every block on every page
corresponds to a content type, a view or a block in the accompanying spec, so the SO team can
build the site rather than interpret a picture of one.

Three companion documents:

- `../../CGIAR Climate Hub V1 Drupal build spec 2026-09-03.md`, the content model: content types,
  fields, taxonomy, views, blocks, roles, the gated area and the migration plan.
- `migration/`, the catalogue exported as migration-ready CSV and JSON, with a README carrying the
  rules that matter more than the columns.
- `decisions.html`, eleven decisions pinned to the places on the site where each changes what
  appears on screen.

## What the 03/09/2026 feedback changed

| Feedback | What was done |
|---|---|
| Port to the Gender Platform layout | Five nav groups, the home page block order and the footer element set, read from the rendered gender.cgiar.org home page on 03/09/2026 and rebuilt with the Climate Action palette |
| Build in Drupal for the CMS | Every block maps to a content type, view or block in the spec. Nothing in the prototype depends on a feature Drupal does not have |
| Mostly text and photo swaps | Nine pages, one stylesheet layer, one renderer. All resource text is generated from the catalogue, so a swap is a CMS edit rather than a code change |
| Add a link to the data piece | The Climate Data Hub is a labelled external item in the Research menu and in the footer. Decision D5 closed in principle: this site is resource access, the data piece is a subset |
| Add a password-controlled operating system link | A real nav item to CA-OS, the Climate Action Operating System, at ca-os-bice.vercel.app, marked "CGIAR sign-in". CA-OS enforces its own sign-in, so this site needs no gate: no password, no Drupal role, no accounts to administer. Decision D11, closed on the substance the same day |
| V2: impact pathways, full taxonomy, storytelling | Kept off the V1 spine. `storytelling.html` is a V2 preview only |
| Lexicon complementary, not the foundation | Four of their patterns adapted against real catalogue material, and a table of what was deliberately not borrowed |

## Pages

```
v1/
  index.html               Home. Eight blocks, in the Gender Platform's order
  areas.html               The five published areas of work, with what sits under each
  resources.html           Find evidence: one search field, three facets, the whole catalogue
  learn.html               Tools, methods and manuals; innovations; experts
  updates.html             Funding calls, events, projects
  about.html               Who we are (unwritten), programme targets, how we curate
  operating-system.html    CA-OS: what it is, how access works, what it settles for the build
  storytelling.html        V2 preview: four patterns adapted from the Lexicon work
  decisions.html           The eleven decisions, four now closed, D11 in part
  migration/               Nine CSVs, one JSON, and the rules for importing them
  assets/
    styles.css             Shared byte for byte with Concepts A to E
    v1.css                 The Gender-layout layer, plus the Lexicon-derived patterns
    data.js                The 51-item catalogue, identical to the concepts
    themes.js              Photograph credits, and the ten themes kept for reference
    app-v1.js              One renderer, all nine pages, no router
    analytics.js           Identical to every other copy, now with a /v1 version label
```

No build step for the site itself. `build-v1.py` regenerates the pages from one set of shared
furniture so the nine cannot drift apart, and `export-migration.mjs` regenerates the migration
files from `assets/data.js`. Neither is needed to view the site.

## The rules this inherits from Concept E, unchanged

- **Nothing is fabricated.** Every sentence is either generated from the catalogue at page load or
  carries the note it came from. Where copy has to be written by a person and has not been, the
  page shows a marked gap saying what is missing and who has to decide it.
- **No country figures and no country selector.** The programme publishes 20 priority countries as
  a count, not a list.
- **The experts list is not a directory** and says so. It still has no search, which was the round
  3 criticism, left visible because fixing it is only worth doing if decision D7 says yes.
- **Metadata completeness is measured, not asserted.** The badge counts recorded fields out of six
  and must never be labelled quality.
- **Photographs are Creative Commons, credited on screen, and illustrative.** None is a photograph
  of the resource it sits beside, and the page says so. All seven are CGIAR or CGIAR-centre images:
  four from the CGIAR Climate Flickr stream, one G. Ambaw / CCAFS, one IITA, one Neil Palmer / CIAT.
  Captions are written from one licence record at page load, so a caption cannot drift from it.

## What the prototype turned up that was not known before

- **Two of the five areas of work hold no dataset at all**: Locally-Led Adaptation and Finance
  and Policy for Scaling Solutions. The second is the area most relevant to the investment
  audience named in Mural round 2, so filtering datasets by it returns nothing. All 14 datasets
  sit under the other three areas, 7 of them under Prioritisation and Coordination alone.
- **Digital Advisories and Climate Risk Management holds 5 datasets and nothing else**: no
  publication, no method, no innovation and no named expert.
- **Time coverage is the field missing most often**, absent from 9 of 14 datasets. Previous rounds
  measured the average, 4.6 of 6, but not which field was worst.
- **86 of 119 tags are used by exactly one item.** Tags cannot be a browse structure, which puts a
  number on how much V2 taxonomy work there is.
- **Eleven of the 51 items carry no link at all.** Six are people, where that is expected. The
  other five are projects, which is 5 of the 8 projects on the site, and that is a real gap.
- The largest single link destination is the **Climate Data Hub itself**, with 10 of the 40 links
  that exist, which supports the 03/09/2026 framing that the data piece is a subset of this site.
- The **national partner** curated journey returns 2 items, shown rather than hidden.

None of these is a design problem, and none is fixed by choosing a layout. They are decision D8.

## Verification

Tested in headless Chromium on 03/09/2026 with every third-party host blocked, so nothing was
sent anywhere during testing.

- All nine pages: no console errors, no JavaScript errors, exactly one analytics loader each, and
  the version label `V1, Gender-layout port` recorded once per page.
- No horizontal document overflow at 320, 390, 768, 1024, 1280 or 1600 pixels. One real defect was
  found and fixed: the reading-list button forced the document to 414 pixels wide at 320 until the
  navigation tail was allowed to wrap.
- Every internal link resolves. Four links point outside this folder, to the other versions and
  the compare page, and are verified against the repository rather than the test sandbox.
- Search, all three facets, the deep link `?type=publication`, the empty state, the reset button,
  the reading list, the mega menu, the pin toggle and all four curated journeys work.
- Every page still renders readable text with JavaScript disabled entirely.
- The annotation overlay falls back to a numbered list below 860 pixels, verified at 390.

Settled on 03/09/2026 after the first build: the operating system link (CA-OS, CGIAR sign-in), the
LinkedIn link in the footer, a programme inbox rather than a postal address, and keeping the reading
list. Two short markers remain in the footer, the inbox address and whether a newsletter exists.

Not verified: the LinkedIn page identity, because LinkedIn's robots.txt blocks fetching, so
`showcase/cgiar-climate` went in on John's selection rather than on my reading of it; what CA-OS
contains and who may hold an account, both behind its sign-in; how gender.cgiar.org is actually built, since only its rendered pages are visible to
me; the facets on its listing pages, because a second page load was refused; and whether the
Drupal build behaves as specified, which cannot be tested until it exists.
