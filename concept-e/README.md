# Concept E, the lean V1

Built 01/09/2026, after the review meeting of the same date. IITA Internal Use.

## What it is

Concept E is not a sixth guess at the information architecture. It is Concept C, which the
01/09/2026 review preferred, reduced to what could launch this year, with every element whose
content depends on an unresolved decision marked by a numbered pin that links to the decision.

It exists because the meeting reached two conclusions that pull against each other. The first is
that C is the right shape: a familiar layout, less risk of alienating users in a non-technical
field. The second is that the real problem is not the mockup at all. There is no design brief, no
defined primary user and no clear vision, roughly fifty versions have been iterated on piecemeal
feedback, and the next step should be a structured decision meeting rather than another mockup
review.

So E is built to be argued with in that meeting rather than admired before it. Turn the pins off
and it is a website. Turn them on and it is an agenda.

## The two things it does that C does not

**It removes copy rather than improving it.** The 01/09/2026 review flagged the AI-generated text
as poor quality. Rewriting it in the same register would have produced better-sounding text that is
equally unowned, so every unsourced sentence has instead been deleted and replaced by a marked gap
saying what has to be written and who has to decide it. Every sentence that remains is either
generated from the catalogue at page load or carries the note it came from. There is no plausible
filler left on the page. This is not a finished voice; it is the absence of a fake one.

**It leaves the primary user blank on purpose.** The choice was to build the V1 with the
primary-user slot explicitly empty and flag every place on the page where that choice changes the
content. D1 is pinned to the headline and to the missing purpose sentence, because those are the
two things that cannot be written without it.

## The home page: ten blocks down to four

| # | Block | Why it survived |
|---|---|---|
| 1 | Split hero: heading, missing purpose sentence, one search field | One primary action, above the fold. Split rather than full-bleed because C and D read as the same site, and the hero image was the reason |
| 2 | The five published areas of work, with live counts | The only externally verifiable spine the catalogue has |
| 3 | Start with these four datasets | The single place the site takes a view instead of listing. If this block is wrong, the site is not opinionated |
| 4 | Latest three publications | The minimum signal that the site is alive, at the cost of the freshness risk pinned at D6 |

Everything else moved to `more.html`. Nothing was deleted from the site, which is what was agreed:
features serving secondary users stay on the site but come off the landing page.

| Taken off the home page | Now at | The note it answers |
|---|---|---|
| Programme targets strip | `more.html#targets` | Targets state what the programme promises, not what a visitor can do |
| Four vantage points | Replaced by one search field and one spine | "A lot of overlap between Datasets, Tools, and Catalog", Brayden Youngberg, 13/08/2026 |
| Weekly spotlight | `more.html#spotlight` | No named editor, no refresh cycle |
| Full-bleed hero and mid-page photo band | Removed | C and D read as the same site because of the hero image, 01/09/2026 |
| Ten editorial themes | `more.html#themes` | "The tab themes overlap a lot, need more diffierentiation", Peter Steward, 11/08/2026 |
| Experts map and list | `more.html#experts` | Round 3 criticised it for having no search. Kept, deprioritised, fault left visible |
| Full latest-publications list | Cut to three | Lean V1. Analytics decide whether it earns more in V2 |

Navigation goes from five tabs to four: Home, Find evidence, Funding & events, More.

## Files

```
concept-e/
  index.html        Four blocks, plus a reviewer-only table of what was cut
  resources.html    The whole catalogue behind one search field and two filters
  news.html         Funding calls and events, separate from publications
  more.html         Everything deprioritised off the home page, kept on the site
  decisions.html    The ten open decisions, each with options and its source note
  README.md         This file
  assets/
    styles.css      Shared with Concepts A to D, byte for byte
    concept-e.css   The lean layer: split hero, decision pins, gap markers
    data.js         Shared catalogue, identical to Concepts A to D
    themes.js       The ten editorial themes and the photo credits, from Concept C
    app-e.js        One script, four pages. Smaller than C's on purpose
    analytics.js    Identical to the copy in every other version
    cgiar-logo.png, img/
```

No build step. Open `index.html` in a browser and it works.

## The ten decisions

D1 primary user &middot; D2 the spine &middot; D3 what earns a place in "start with these four" &middot;
D4 the name &middot; D5 where this site ends and the Data Hub begins &middot; D6 who writes and
refreshes the copy &middot; D7 whether V1 lists people &middot; D8 whether V1 ships before ingestion
and tagging are fixed &middot; D9 what leaves the site as opposed to the home page &middot; D10
handover to the SO team and the CMS.

D1 and D8 are the two that cannot be deferred. D8 is the harder one, and the handover of 12/08/2026
warns that choosing a concept is the easier decision and will crowd it out if allowed to.

## What is deliberately still broken

- **The experts list has no search.** That was the specific round 3 criticism, reproduced unchanged
  in Concept C and left unchanged here, because fixing it is only worth doing if D7 is yes.
- **The catalogue is thin in the places it is most used.** Searching `drought` returns three
  resources and no project. Metadata completeness averages 4.6 of 6 fields, only 5 of 14 datasets
  are complete, and Nigeria is the only African country named in the item fields across all 51
  items. Figures from the Climate Hub handover of 12/08/2026, section 5. No front end fixes this.
- **The name is unresolved**, so the page carries the current one with D4 pinned to it.

## Provenance

Everything on these pages traces to one of: the CGIAR Climate Hub design strategy note of
09/08/2026; the Climate Hub handover of 12/08/2026; the Concept D README of 13/08/2026, which
records the 11/08 and 13/08 review notes verbatim with attribution; or John's meeting notes of
01/09/2026. Statements attributed to 01/09/2026 come from those notes and have not been confirmed
in writing by the speaker. Nothing on these pages is invented, and where something has not been
written it is marked as unwritten rather than filled in plausibly.

The pages carry `noindex`. Concept E is not agreed scope.
