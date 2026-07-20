# CGIAR Climate Data Hub

A working prototype of the Climate Data Hub, shared for review. Static site, no build step.

**Live:** https://cgiar-climate-data-hub-lcyq.vercel.app
**Status:** v0.2 prototype, shared for review. Not for external circulation.

## Files

```
cgiar-climate-data-hub/
  index.html              The main page
  use-cases.html          Use-case portfolio page
  README.md               This file
  assets/
    cgiar-logo.png        Header and footer logo
    social-preview.png    Open Graph / Twitter card image (1200x630)
    styles.css            All styling
    app.js                Use-case switcher, search, news tabs, Ask the Hub,
                          FAQ, Flyer Builder, feedback modal
    briefs/               Seven use-case brief PDFs plus two review PDFs
    flyers/               Five sample country briefs, one per topic focus
```

## Deployment

The repo is connected to Vercel, which rebuilds and republishes automatically on
every push to `main`. There is no manual deploy step: push, and the live site follows.

From the Mac, `Deploy Climate Data Hub.command` in the RCA Dashboard folder does this
end to end. It refuses to run on a dirty tree, pushes, then polls the live site and
compares its `index.html` against the local copy by hash, so it can actually fail if
Vercel has not published. It writes a log to `Deploy Climate Data Hub result.txt`.

To roll back, promote the previous deployment in the Vercel dashboard.

## What works

- Sticky header with logo, search field and Ask the Hub button
- Smooth-scrolling anchor nav (Datasets, Tools, News, Catalogue, About)
- Hero with use-case pills that rewrite the title, copy, quick links and topic tags live
- **Site search**, real and client-side, over use cases, dataset cards, linked platforms,
  news and events, and FAQ entries. Both the header and hero inputs are wired to it.
  Scored ranking, keyboard navigation (arrows, Enter, Escape), an empty state, and
  click-through that opens platforms externally, expands the matching FAQ, or activates
  the matching use case. No network calls.
- **Use-case portfolio page** (`use-cases.html`), listing all seven use cases grouped by
  status, with programme, champion, focus areas and links to every brief
- **Use-case brief PDFs**, one per use case, generated into `assets/briefs/` and linked
  from each use case's primary call to action, plus review PDFs for GCF and B4T
- 8-card featured dataset grid, all linking to the real source platforms
- Tabbed news widget (Funding, Conferences, Calls for papers, Publications) with
  verified links
- All-sources strip, all nine linking to the real platforms
- FAQ accordion
- Open Graph and Twitter card tags, so the link previews properly when shared
- "Give feedback" button with a structured form. It opens a pre-filled email, and then
  shows the message with a copy button, so comments are not lost when a machine has no
  mail client registered.
- Responsive down to 600 px

## What is still a mock

- **Ask the Hub** returns the same fixed sample answer to every question. It is not
  connected to a retrieval back end. Labelled as a demonstration in the section and on
  the answer itself.
- **Flyer Builder** does not assemble text from live evidence. It now returns a real sample
  PDF matching the chosen topic focus, so the intended format and length can be judged, and
  states plainly that the country and audience selections are not yet reflected and that the
  narrative is placeholder text.

## Known gaps

- Five footer links have no destination yet: STAC Catalogue, API Access, Data policy,
  Contact and Accessibility. Data policy and Accessibility need real institutional content
  and should not be mocked up.
- The sample answer's claim that ASALs cover "over 80%" of Kenya is illustrative and has
  not been verified against a source.

Nothing on the site now points at `cgiar-climate-data-hub.github.io`. The portfolio link
goes to `use-cases.html` and the two review links to sample PDFs.

## Sample use-case briefs

`assets/briefs/` holds one PDF per use case. Each carries the real portfolio entry
(name, programme, status, champion, description, focus areas) above a visible notice
that the surrounding narrative is illustrative placeholder content, so a reader does not
mistake a sample for agreed scope or findings.

Regenerate them with the `make-briefs.py` script if the use-case definitions in
`assets/app.js` change.

## Collecting feedback

The recipient address is set near the feedback section of `assets/app.js`:

```js
const FEEDBACK_EMAIL = 'j.choptiany@cgiar.org';
```

Change that string to point feedback at a different inbox or shared mailbox.

## Decisions baked into the copy

- CGIAR sources only for Ask the Hub, FAO and partner sources flagged as planned
- Flyer Builder described in terms of planned behaviour, with the demonstration state
  stated plainly
- News widget described as scraped and editorially curated, updated weekly
- British English throughout
- Copyright 2026

## Possible next iterations

- Connect Ask the Hub to a real CGIAR-only retrieval back end
- Build the Flyer Builder draft preview and PDF export flow
- Resolve the outstanding footer links
- Replace the sample flyer output with generation from live evidence
- Add a country profile page (Ethiopia, Kenya, Mali) as a deep-dive template
- Add a simple admin route for the editorial team to curate the news widget
