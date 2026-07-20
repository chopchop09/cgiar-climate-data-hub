# CGIAR Climate Data Hub

A working prototype of the Climate Data Hub, shared for review. Static site, no build step.

**Live:** https://cgiar-climate-data-hub-lcyq.vercel.app
**Status:** v0.2 prototype, shared for review. Not for external circulation.

## Files

```
cgiar-climate-data-hub/
  index.html              The page
  README.md               This file
  assets/
    cgiar-logo.png        Header and footer logo
    social-preview.png    Open Graph / Twitter card image (1200x630)
    styles.css            All styling
    app.js                Use-case switcher, search, news tabs, Ask the Hub,
                          FAQ, Flyer Builder, feedback modal
    briefs/               Seven sample use-case brief PDFs
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
- **Use-case brief PDFs**, one per use case, generated into `assets/briefs/` and linked
  from each use case's primary call to action
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
- **Flyer Builder** does not generate a document. The controls show the intended inputs.
  Labelled as a demonstration.

## Known gaps

- These footer links have no destination yet: STAC Catalogue, API Access, Data policy,
  Contact, Accessibility, and the CC BY 4.0 licence.
- Three links point at `cgiar-climate-data-hub.github.io/use-cases/`, which was not
  responding when last checked: "View the use-case portfolio" on the default hero view,
  and the review links under the GCF and B4T use cases. The seven per-use-case brief
  buttons no longer depend on it.
- The sample answer's claim that ASALs cover "over 80%" of Kenya is illustrative and has
  not been verified against a source.

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
- Publish or retire the `use-cases` Pages site, and repoint the three remaining links
- Resolve the outstanding footer links
- Add a country profile page (Ethiopia, Kenya, Mali) as a deep-dive template
- Add a simple admin route for the editorial team to curate the news widget
