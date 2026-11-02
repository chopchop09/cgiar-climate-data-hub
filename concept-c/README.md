# CGIAR Climate Hub: the publication cut

Concept C, the working version, reduced on 02/11/2026 to what can be published at CGIAR
without a model, a sign-in, or a service other than this folder and the links it points to.
IITA Internal Use until approved.

## What it is

Five pages, one shared catalogue, no build step. Open `index.html` in a browser and it works.

```
concept-c/
  index.html        Photograph, one sourced mission line, one search field, targets,
                    three doors by resource type, ten themes, five areas of work,
                    the Climate Data Hub call-out, four foundational records,
                    latest publications
  resources.html    The whole catalogue behind one search field and two filters
  themes.html       Ten themes with every matching item
  news.html         Funding calls, events and calls for papers
  about.html        The programme, quoted from cgiar.org; what the site holds,
                    measured at load; how to reach the programme
  assets/
    styles.css      Shared base, unchanged
    concept-c.css   The GESI layout layer, with the rules for removed pages pruned
    publish.css     Only what this cut adds: shorter hero, search, three doors,
                    Data Hub call-out, page heads, filters, quotation, nav wrapping
    data.js         The catalogue, unchanged
    themes.js       The ten themes and the photograph credits, unchanged
    app.js          One renderer for the five pages
    analytics.js    Identical to every other copy in the repository
    img/            Seven Creative Commons photographs, credited on screen
```

`tools/build-c-publish.py` regenerates the five pages from one set of shared furniture, so they
cannot drift apart. It is not needed to view the site.

## What came out, and why

| Removed | Reason |
|---|---|
| Front Desk, and the search that routed into it | Needs a model to answer. Search now goes straight to Resources & Data, where it needs nothing but the catalogue |
| Impact and Where We Work | Wishlist items with no content behind them yet: an empty Stories of change route, an empty Partners block, no country content behind the map |
| El Niño response page | Mock filters and one country summary from an internal input; no forecast source was ever read in |
| Experts | Six names with no search, criticised in review round 3 and never fixed. Not a directory |
| Weekly spotlight and the four vantage points | The spotlight needs an editor nobody has named; the vantage points overlapped with the type filter and were criticised for it |
| Review switcher and prototype bar | Review scaffolding. One line in the footer still leads to the earlier versions, and can be deleted |
| The wishlist notes on each page | They described what a page should become; a published page should be what it is |

Kept on request: the "Sign in" link at the far right of the bar, which goes to the contact
section and nothing else, and the Climate Data Hub, which is now in the bar as an outward link,
in a call-out on the home page, and in the footer.

## Copy

Every sentence about the programme is quoted from the Climate Action page on cgiar.org, with the
source stated beneath it, or is a published figure. Everything about a resource is written from
the catalogue at page load. Nothing on these pages was written to sound plausible; where the
earlier version carried placeholders, the block came out.

One address appears: climate@cgiar.org. It is the mailbox the climate.cgiar.org wishlist of
08/09/2026 named, and the earlier version recorded it as proposed and not yet staffed. **Confirm it
is read before the site is promoted.**

The catalogue still holds six people and eight projects. Neither has a page in this cut, so the
counts on the About page cover only what the site shows: 37 items across five types.

## Photographs

All seven are CGIAR or CGIAR-centre images under Creative Commons, credited on screen from one
licence record. Six carry a NonCommercial licence, which is fine for a programme site and should be
checked before any commercial or sponsored use.

## Verification, 02/11/2026

Tested in headless Chromium with every third-party host blocked, so nothing was sent anywhere.

- All five pages: no console or JavaScript errors, one analytics loader each, nothing linking to
  a removed page or to an outside sign-in, no review scaffolding left in the markup.
- No horizontal document overflow at 320, 390, 768, 1024, 1280 or 1600 pixels. One defect found
  and fixed: the nav bar scrolled the whole document sideways on phones; it now wraps.
- Search from the home page lands on Resources with the query applied; search, both filters, the
  deep links `?type=` and `?q=`, the empty state and reset all work; search and filter events are
  recorded with readable labels.
- Every page still renders readable text with JavaScript off.

Not verified: the LinkedIn page identity, which LinkedIn blocks from being fetched; that
climate@cgiar.org is staffed; and how any of this renders inside Drupal once it is built there.
