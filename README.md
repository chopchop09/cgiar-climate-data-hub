# CGIAR Climate Data Hub, Variant B Medium

A working website implementation of the design prototype, ready to showcase for feedback.

## Files

```
cgiar-climate-data-hub/
  index.html         The page
  README.md          This file
  assets/
    cgiar-logo.png   Header and footer logo
    styles.css       All styling
    app.js           Persona switcher, news tabs, Ask the Hub, FAQ, Flyer Builder, feedback modal
```

## View locally

Just open `index.html` in any modern browser. Everything is static, no build step.

## Share with reviewers (three options)

1. Zip the `cgiar-climate-data-hub` folder and email it. Reviewers double-click `index.html` and it runs locally.
2. Drag and drop the folder onto Netlify Drop (https://app.netlify.com/drop) for a free temporary URL you can share.
3. Push the folder to a GitHub repo and turn on GitHub Pages.

## Collecting feedback

A "Give feedback" button sits in the bottom right of every page. Reviewers fill in a short form (name, role, section, comment) and pressing send opens their mail client with a pre-filled email addressed to the project lead.

The recipient address is set in `assets/app.js` near the top of the feedback section:

```js
const FEEDBACK_EMAIL = 'j.choptiany@cgiar.org';
```

Change that string to point feedback at a different inbox or shared mailbox.

## What works in this build

- Sticky header with CGIAR Climate Action logo and search field
- Smooth-scrolling anchor nav (Datasets, Tools, News, Catalogue, About)
- Header "Ask the Hub" button jumps to the Tools section (was broken in the prototype, fixed here)
- Hero with persona pills that rewrite the title, copy, quick links and topic tags live
- Hero search routes the query into the Ask the Hub box (was broken in the prototype, fixed here)
- 8-card featured dataset grid
- Ask the Hub with example questions and a mock answer with citations
- Flyer Builder form with the four selectors and a mock "draft ready for review" state
- Tabbed news widget (Funding, Conferences, Calls for papers, Publications)
- All-sources strip
- FAQ accordion
- Footer with CGIAR logo and 2026 copyright
- "Give feedback" floating button with a structured comment form
- Responsive down to 600 px

## What is still a mock

- Ask the Hub returns the same canned Kenya answer for every question (front-end only)
- Flyer Builder does not actually generate a PDF
- Dataset links go to `#`, swap in real URLs when known
- News items have placeholder links

## Decisions baked into the copy

- CGIAR sources only for Ask the Hub, FAO and partner sources flagged as planned
- Flyer Builder is auto-generated, with explicit "review and edit before PDF export" wording
- News widget described as scraped and editorially curated, updated weekly
- Copyright 2026

## Possible next iterations

- Wire dataset card and source-pill `href` to the real platforms
- Connect Ask the Hub to a real CGIAR-only retrieval back end
- Add a country profile page (Ethiopia, Kenya, Mali) as a deep-dive template
- Build the Flyer Builder draft-preview and PDF export flow
- Add a simple admin route for the editorial team to curate the news widget
