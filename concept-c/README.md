# Concept C: the GESI-style reading

One of three design interpretations built on 10/08/2026, circulated alongside the
current v0.2 site as a four-way review set. IITA Internal Use.

**The interpretation.** The 10/08 discussion named gender.cgiar.org as the reference
for what a static resource hub looks like: "a very static resource hub on a specific
topic". Concept C stops describing that site and builds it, so the group can react to
the thing rather than to a memory of it.

**What is copied, deliberately.** The homepage opens on a full-width photograph before
any information. Entry is by "vantage point", the four routes by resource format that
the GENDER Platform offers. There is a weekly spotlight. Everything sits under ten
named themes with sub-topics listed beneath each, presented as a plain list rather than
cards. Content is split across five tabs rather than stacked on one page. The experts
page is a map and a list with no way to search them.

That last one matters. It was the specific criticism raised on 10/08, and it is
reproduced rather than improved, with a notice saying so. Concept C is only useful if it
carries what was disliked about the model as well as what was liked.

## Files

```
concept-c/
  index.html          Photograph, mission line, vantage points, spotlight, ten themes
  themes.html         All ten themes with every matching catalogue item
  resources.html      Publications, data, tools and methods. Filters only, no search
  experts.html        Africa outline map plus a list of six. No search
  news.html           Funding calls, events and calls for papers, one list
  README.md           This file
  assets/
    styles.css        Shared with Concepts A and B, byte for byte
    concept-c.css     The GESI layout layer, loaded after it
    data.js           Shared catalogue, plus the ten themes and the image credits
    app.js            Renders every page from the catalogue
    cgiar-logo.png
    img/              Seven photographs, 577 kB total
```

No build step. Open `index.html` in a browser and it works.

## The ten themes

The GENDER Platform runs on ten research themes. Concept C mirrors that with ten
climate themes: climate risk and hazards; water and drought; crops and breeding;
livestock and aquatic foods; mitigation and emissions; seasonal forecasts and
advisories; climate finance and policy; adaptation options and tracking; landscapes and
biodiversity; data, methods and standards.

**These are an editorial grouping, not a CGIAR taxonomy.** No climate-terms taxonomy
exists yet, and the design strategy note records that as outstanding. The labels were
written from the tags already present on the 44 catalogued items, exactly as the three
hero categories on the v0.2 prototype were, and they carry the same caveat on the page.
Argue with them.

Item counts are matched from the catalogue at page load by plain substring search over
the same fields the site search uses. Nothing is typed in, so every count can be
reproduced by searching for the term yourself, and a theme showing a small number is
telling the truth about the catalogue. An item can match more than one theme, which is
why the counts sum to more than 44.

## Photographs

Seven images, all Creative Commons, all credited in a visible caption on the page:

- Hero: "Innovative farming practices in the Sahel", CGIAR Climate / Flickr / CC BY-NC-SA 2.0
- Spotlight: "Community engagement in Tibtenga Climate-Smart Village", CGIAR Climate / Flickr / CC BY-NC-SA 2.0
- Band: "Harvesting season in Nyando climate-smart villages", CGIAR Climate / Flickr / CC BY-NC-SA 2.0
- Themes: Doyogena, Ethiopia (G. Ambaw / CCAFS); Lower Nyando water terraces (CGIAR Climate);
  Accra crop-climate modelling workshop (IITA); climate-smart farm (Neil Palmer / CIAT, CC BY-SA 2.0)

Source records and full attribution strings are in the RCA Dashboard Image Library,
with `IMAGE-ATTRIBUTIONS.txt`. Six of the seven are NonCommercial licences, which is
appropriate for an internal review prototype but should be checked before any
commercial or externally promoted use.

Every image was resized and recompressed for the web, from 2,062 kB to 577 kB. Round 2
of the Mural feedback asked for speed explicitly, and an image-led page is the easiest
way to lose it.

## The map

The Africa outline is drawn from `africa.geojson`, already held in the programme's
working files, on an equirectangular projection. It is a locator, not an analytical map.

Nigeria is highlighted because it is the only African country named anywhere in the item
fields of the catalogue, appearing twice and both times through the Tier 2 livestock
uncertainty work. The other 48 countries drawn are unnamed across all 44 items. No
expert pins are plotted, because no location has been recorded for any of the six people
listed and placing them anywhere would be invention.

## What is real

- All 44 catalogued items, shared byte for byte with Concepts A and B.
- The type and theme filters on `resources.html`.
- Every count on every page, matched at load rather than typed.
- The ten themes' membership, reproducible by search.
- The image credits, written from the licence records.
- The Nigeria finding on the map.

## What is deliberately not real

- **The spotlight does not rotate.** A weekly slot needs an editor with a weekly slot,
  and nobody has been identified. The same gap already undermines the news widget on the
  current site. Said plainly on the page.
- **"Stories of change" is empty.** The GENDER Platform's strongest route has no
  equivalent here, because no impact narrative has been written for this Hub. Shown as
  empty rather than filled with something invented.
- **No search anywhere.** Faithful to the model, and labelled.
- **No country figures, and no country selector.** As in the other concepts.
- **The experts list is six champions, not a directory.**

## What to watch for in feedback

Concept C is the only version that puts an image before information, and the only one
without a search box. If reviewers like it, the interesting question is whether they
like the imagery or the ten-theme spine, because those are separable: Concept A could
take the themes without the photographs, and Concept C could take a search box without
ceasing to look like this.
