#!/usr/bin/env python3
"""Assemble the V1 pages.

Every page shares a head, a review switcher, a prototype bar, a decision-pin bar,
the mega menu and the footer. They are written once here and stamped into each
page, so the nine pages cannot drift apart the way the concept folders did.

Run:  python3 build-v1.py
Out:  v1/*.html
"""
import os
import re

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "v1")

# --------------------------------------------------------------------------- #
# Shared furniture
# --------------------------------------------------------------------------- #

HEAD = """<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="robots" content="noindex, nofollow">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=Noto+Serif:wght@400;700&display=swap" rel="stylesheet" media="all" onerror="this.remove()">
<link rel="stylesheet" href="assets/styles.css">
<link rel="stylesheet" href="assets/v1.css">
<script src="assets/analytics.js" defer></script>
</head>
<body>
<a href="#main" class="skip-link">Skip to main content</a>
"""

SWITCHER_CSS = """<style>
.xsw{background:#0A1F3D;border-bottom:1px solid rgba(255,255,255,.18);
  font-family:'Noto Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif}
.xsw-in{max-width:1240px;margin:0 auto;padding:9px 24px;display:flex;align-items:center;
  gap:7px;flex-wrap:wrap}
.xsw-lab{font-size:11px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;
  color:#8FC4FF;margin-right:6px;white-space:nowrap}
.xsw-item{display:flex;flex-direction:column;gap:1px;text-decoration:none;
  padding:5px 11px;border-radius:6px;border:1px solid rgba(255,255,255,.22);
  background:rgba(255,255,255,.06);min-width:0}
a.xsw-item:hover{background:rgba(255,255,255,.16);border-color:rgba(255,255,255,.4)}
a.xsw-item:focus-visible,.xsw-about:focus-visible{outline:2px solid #8FC4FF;outline-offset:2px}
.xsw-name{font-size:12.5px;font-weight:700;color:#fff;line-height:1.3}
.xsw-sub{font-size:10.5px;color:#BCCFE9;line-height:1.3}
.xsw-here{background:#fff;border-color:#fff}
.xsw-here .xsw-name{color:#0A1F3D}
.xsw-here .xsw-sub{color:#4A5A70}
.xsw-you{font-size:9.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;
  color:#1955A6;line-height:1.3}
.xsw-about{margin-left:auto;font-size:12px;color:#8FC4FF;text-decoration:underline;
  white-space:nowrap;padding:5px 0}
.xsw-about:hover{color:#fff}
@media(max-width:980px){
  .xsw-in{padding:8px 16px;gap:6px}
  .xsw-lab{width:100%;margin:0 0 2px}
  .xsw-item{flex:1;padding:5px 9px}
  .xsw-about{margin-left:0;width:100%;padding-top:6px}
}
</style>
"""

SWITCHER = SWITCHER_CSS + """<div class="xsw">
  <div class="xsw-in">
    <span class="xsw-lab">V1 candidate</span>
    <a class="xsw-item" href="../index.html"><span class="xsw-name">Current site</span><span class="xsw-sub">v0.2</span></a>
    <a class="xsw-item" href="../concept-c/index.html"><span class="xsw-name">Concept C</span><span class="xsw-sub">GESI-style</span></a>
    <a class="xsw-item" href="../concept-e/index.html"><span class="xsw-name">Concept E</span><span class="xsw-sub">the lean V1</span></a>
    <span class="xsw-item xsw-here" aria-current="true"><span class="xsw-name">V1</span><span class="xsw-sub">Gender-layout port</span><span class="xsw-you">you are here</span></span>
    <a class="xsw-about" href="../compare.html">All versions &rarr;</a>
  </div>
</div>
"""

PROTO = """<div class="proto-bar">
  <strong>V1 candidate, 03/09/2026.</strong>
  The Climate Hub ported to the CGIAR Gender Platform layout, for a Drupal build. Structure read from
  gender.cgiar.org on 03/09/2026; four storytelling patterns adapted from lexiconoffood.com. Not a CGIAR
  publication and not approved scope. IITA Internal Use.
</div>
"""

PINBAR = """<div class="pinbar">
  <div class="pinbar-in">
    <p><strong>Decision pins are on.</strong> Orange pins mark content that still depends on a decision nobody
    has taken. Green pins mark the ones the feedback of 03/09/2026 closed. Turn them off to see the page as a
    visitor would.</p>
    <button class="pinbtn" id="pinToggle" type="button" aria-pressed="true">Hide decision pins</button>
  </div>
</div>
"""

HEADER = """<header>
  <div class="header-inner">
    <a href="index.html" class="brand-link" aria-label="CGIAR Climate Hub home">
      <img src="assets/cgiar-logo.png" alt="" height="34">
      <span class="brand-name">CGIAR Climate Hub<a class="pin" href="decisions.html#d4" title="Decision 4: the name, still open">D4</a></span>
    </a>
  </div>
</header>
"""

HUB = "https://cgiar-climate-data-hub.github.io/"

NAV_GROUPS = [
    ("explore", "Explore", [
        ("areas.html", "Areas of work", "The five published areas, with live counts", "", ""),
        ("resources.html", "Find evidence", "Search the whole catalogue", "", ""),
        ("storytelling.html", "Storytelling", "V2 preview, patterns from the Lexicon work", "", ""),
    ]),
    ("research", "Research", [
        ("resources.html?type=publication", "Publications", "", "", ""),
        ("resources.html?type=dataset", "Datasets", "", "", ""),
        ("updates.html#projects", "Projects", "", "", ""),
        (HUB, "Climate Data Hub", "The data piece: datasets, notebooks, tutorials", "ext", ""),
    ]),
    ("learn", "Learn and apply", [
        ("learn.html", "Tools, methods, manuals", "", "", ""),
        ("learn.html#innovations", "Innovations", "", "", ""),
        ("learn.html#experts", "Experts", "", "", ""),
        ("operating-system.html", "Operating system", "CA-OS. CGIAR sign-in required", "", "lock"),
    ]),
    ("updates", "Updates", [
        ("updates.html#funding", "Funding calls", "", "", ""),
        ("updates.html#events", "Events", "", "", ""),
    ]),
    ("about", "About", [
        ("about.html", "Who we are", "", "", ""),
        ("about.html#our-work", "Our work", "", "", ""),
        ("about.html#how-we-curate", "How we curate", "The promise, and the measurement that tests it", "", ""),
        ("decisions.html", "The open decisions", "What V1 still needs someone to decide", "", ""),
    ]),
]


def nav(current):
    out = ['<nav class="gnav" aria-label="Main navigation">', '  <div class="gnav-in">']
    for key, label, links in NAV_GROUPS:
        here = ' here' if key == current else ''
        out.append(f'    <div class="gnav-group{here}">')
        out.append(f'      <button class="gnav-top" type="button" aria-expanded="false">'
                   f'{label}<span class="caret" aria-hidden="true">&#9662;</span></button>')
        out.append('      <div class="gnav-panel">')
        for href, text, sub, kind, mark in links:
            attrs = ' target="_blank" rel="noopener"' if kind == "ext" else ""
            arrow = ' <span class="ext">&#8599;</span>' if kind == "ext" else ""
            lock = ' <span class="lockmark">CGIAR sign-in</span>' if mark == "lock" else ""
            subhtml = f'<span class="sub">{sub}</span>' if sub else ""
            out.append(f'        <a href="{href}"{attrs}>{text}{arrow}{lock}{subhtml}</a>')
        out.append('      </div>')
        out.append('    </div>')
    out.append("""    <div class="gnav-tail">
      <form class="gnav-search" role="search" action="resources.html" method="get">
        <label class="sr-only" for="navq">Search the catalogue</label>
        <input type="search" id="navq" name="q" placeholder="Search">
        <button type="submit">Search</button>
      </form>
      <button class="listbtn" id="listBtn" type="button">Reading list</button>
    </div>""")
    out.append('  </div>')
    out.append('</nav>')
    return "\n".join(out) + "\n"


FOOTER = """<footer>
  <div class="footer-inner">
    <div class="footer-top">
      <div>
        <img src="assets/cgiar-logo.png" alt="CGIAR" height="42">
        <p>CGIAR Climate Action. V1 candidate, structured after the CGIAR Gender Platform and intended for a
        Drupal build. Nothing on these pages is an approved CGIAR position.</p>
      </div>
      <div class="footer-col">
        <h3>Contact us</h3>
        <p style="margin:0 0 6px;font-size:13.5px">Climate Action Science Program</p>
        <span class="gap">Inbox not yet named</span>
        <a href="decisions.html#d6">Who owns this site &rarr;</a>
      </div>
      <div class="footer-col">
        <h3>Keep up</h3>
        <a href="https://www.linkedin.com/showcase/cgiar-climate/" target="_blank" rel="noopener">CGIAR Climate Action on LinkedIn &#8599;</a>
        <span class="gap">Newsletter not yet decided</span>
        <a href="updates.html">Funding calls and events</a>
      </div>
      <div class="footer-col">
        <h3>How this site works</h3>
        <a href="about.html#how-we-curate">How we harvest, select and prioritise</a>
        <a href="decisions.html">The open decisions</a>
        <a href="{hub}" target="_blank" rel="noopener">Climate Data Hub &#8599;</a>
      </div>
      <div class="footer-col">
        <h3>Support</h3>
        <a href="https://www.cgiar.org/funders" target="_blank" rel="noopener">CGIAR Trust Fund Contributors &#8599;</a>
        <a href="https://www.cgiar.org/climate-action/" target="_blank" rel="noopener">CGIAR Climate Action &#8599;</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2026 CGIAR. Photographs are Creative Commons and credited on screen. Linked content stays
      under its own licence. Analytics are cookie-free, so no consent banner is needed.</span>
      <span>British English &middot; V1 candidate, 03/09/2026 &middot; IITA Internal Use</span>
    </div>
  </div>
</footer>

<script src="assets/data.js"></script>
<script src="assets/themes.js"></script>
<script src="assets/app-v1.js"></script>
</body>
</html>
""".replace("{hub}", HUB)


def page(name, title, desc, group, body):
    html = (HEAD.format(title=title, desc=desc)
            + SWITCHER + PROTO + PINBAR + HEADER + nav(group)
            + '<main id="main" tabindex="-1">\n' + body + '\n</main>\n'
            + FOOTER)
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        f.write(html)
    return name


# --------------------------------------------------------------------------- #
# Page bodies
# --------------------------------------------------------------------------- #

HOME = """
<!-- BLOCK 1: hero. Gender puts a statement over a photograph, then an Explore
     heading with a strapline and a scroll cue. Same order here. -->
<div class="ghero">
  <div class="ghero-img"><img src="assets/img/hero-sahel.jpg" alt="Innovative farming practices in the Sahel"></div>
  <div class="ghero-in">
    <div class="pinnable">
      <div class="ghero-kicker">CGIAR Climate Action</div>
      <h1>Turning CGIAR&rsquo;s climate research into coordinated action<a class="pin" href="decisions.html#d1" title="Decision 1: who the primary user is">D1</a>
        <span class="thin">Across food, land and water systems, in <span class="area-n">5</span> published areas of work.</span></h1>
    </div>
    <div class="ghero-explore">
      <h2>Explore</h2>
      <p>Search <span class="corpus-n">51</span> catalogued items, or browse the five areas of work as published
      on cgiar.org.</p>
      <form class="gsearch" id="heroSearch" role="search" action="resources.html" method="get">
        <label class="sr-only" for="q">Search the catalogue</label>
        <input type="search" id="q" name="q" placeholder="Search">
        <button type="submit">Search</button>
      </form>
      <div class="gapblock pinnable" style="margin-top:20px">
        <strong>Not written yet:</strong> the one sentence under the heading that tells a named person what they
        can do here and what they should go elsewhere for. It cannot be written until decision D1 is taken. The
        site that serves a national planning ministry is not the site that serves a CGIAR breeding scientist.
      </div>
      <a class="scrolldown" href="#selection-band">Scroll to explore &darr;</a>
    </div>
    <div class="ghero-cap" data-credit="hero-sahel.jpg"></div>
  </div>
</div>

<!-- BLOCK 2: the approach strip, straight from the Gender home page -->
<div class="gcta">
  <div class="gcta-in">
    <p>Want to know more about the approach behind CGIAR Climate Action?</p>
    <a class="btn" href="about.html">Discover our work</a>
  </div>
</div>

<!-- BLOCK 3: the selection band. Gender curates this weekly. -->
<section class="section" id="selection-band">
  <div class="wrap">
    <div class="section-head pinnable">
      <div class="section-label">In the spotlight</div>
      <h2>Our selection<a class="pin" href="decisions.html#d6" title="Decision 6: who curates and refreshes this">D6</a></h2>
      <p>The Gender Platform refreshes this band every week, and says so on the page. Nobody has yet been named
      to do that here.</p>
    </div>
    <div class="gcards" id="selection"></div>
    <span class="src">Until an editor is named, this band shows the three most recent publications in the
    catalogue, generated at page load rather than chosen. The photographs are Creative Commons images from the
    CGIAR Climate Flickr stream, credited beneath each card: they illustrate the programme, and none of them is
    a photograph of the publication beside it. Decision D6 names the editor and the cadence.</span>
  </div>
</section>

<!-- BLOCK 4: by area of work, mirroring Gender's "By research area" -->
<section class="section tint">
  <div class="wrap">
    <div class="section-head pinnable">
      <div class="section-label">By area of work</div>
      <h2>Want a particular area of climate work?<a class="pin done" href="decisions.html#d2" title="Decision 2: closed on 03/09/2026, the five areas are the spine for V1">D2</a></h2>
      <p>The five areas of work exactly as published on cgiar.org. Counts are catalogued items under each,
      computed at page load.</p>
    </div>
    <div class="gareas" id="areas"></div>
    <span class="src">The Gender Platform uses ten research themes here. Ours uses five areas of work rather
    than the ten editorial themes tried in Concept C, because only the areas of work are externally verifiable:
    no CGIAR climate-terms taxonomy exists yet. The full taxonomy is V2 work in the plan of 03/09/2026.</span>
  </div>
</section>

<!-- BLOCK 5: the opinionated block. No Gender equivalent; kept from Concept E. -->
<section class="section">
  <div class="wrap">
    <div class="section-head pinnable">
      <div class="section-label">Start here</div>
      <h2>Four climate records to start with<a class="pin" href="decisions.html#d3" title="Decision 3: what earns a place here">D3</a></h2>
      <p>The one place this site takes a view instead of listing. Each badge counts how many of six metadata
      fields are recorded, so the claim is measured rather than asserted.</p>
    </div>
    <div class="gcards" id="startFour"></div>
    <span class="src">These four are CHIRPS, ERA5, AgERA5 and GLW4, carried from Concept C where the build team
    picked them. <strong>No stated rule decides what belongs here.</strong> Decision D3 writes that rule and
    names who applies it. The Gender Platform has no block like this; it is kept because the meeting of
    01/09/2026 agreed the site has to be opinionated somewhere.</span>
  </div>
</section>

<!-- BLOCK 6: by category, mirroring Gender's four regions -->
<section class="section tint">
  <div class="wrap">
    <div class="section-head">
      <div class="section-label">By category</div>
      <h2>Looking for a specific type of resource?</h2>
    </div>

    <section class="gcat">
      <div class="gcat-head">
        <div><h3>Funding and events</h3><p>Calls, deadlines and meetings, kept separate from publications</p></div>
        <a class="viewmore" href="updates.html">View more &rarr;</a>
      </div>
      <div class="gcards" id="catNews"></div>
    </section>

    <section class="gcat">
      <div class="gcat-head">
        <div><h3>Datasets</h3><p>Climate records with resolution, coverage, cadence and licence stated</p></div>
        <a class="viewmore" href="resources.html?type=dataset">View more &rarr;</a>
      </div>
      <div class="gcards" id="catData"></div>
    </section>

    <section class="gcat">
      <div class="gcat-head">
        <div><h3>Tools, methods and manuals</h3><p>How to do the work, not only what exists</p></div>
        <a class="viewmore" href="learn.html">View more &rarr;</a>
      </div>
      <div class="gcards" id="catTools"></div>
    </section>

    <section class="gcat">
      <div class="gcat-head">
        <div><h3>Publications</h3><p>Scientific evidence and data</p></div>
        <a class="viewmore" href="resources.html?type=publication">View more &rarr;</a>
      </div>
      <div class="gcards" id="catPubs"></div>
    </section>
  </div>
</section>

<!-- BLOCK 7: the storytelling teaser, Lexicon-derived, flagged V2 -->
<div class="lex">
  <div class="lex-in">
    <span class="lex-note">V2 preview &middot; complementary, not the foundation</span>
    <h2>Storytelling, and where it belongs</h2>
    <p style="max-width:70ch;font-size:15.5px;color:#4A4740;margin-top:10px">
      The plan of 03/09/2026 puts the storytelling layer in V2 and frames the Lexicon work as complementary:
      their site carries the external impact narrative, this one carries resource access, and the data piece is
      a subset of it. Four of their patterns are adapted on the next page against real catalogue material, so
      the merge can be discussed against something specific.</p>
    <a class="lex-btn" href="storytelling.html">See the four patterns</a>
  </div>
</div>

<!-- BLOCK 8: for reviewers -->
<section class="section">
  <div class="wrap">
    <div class="section-head">
      <div class="section-label">For reviewers, not for visitors</div>
      <h2>What this port changes, and what it leaves alone</h2>
      <p>Concept E carried four home page blocks and four nav tabs. The Gender Platform layout carries more of
      both, and the 03/09/2026 feedback chose that layout deliberately, because most of the work then becomes
      text and photo swaps inside a CMS that already handles updating.</p>
    </div>
    <div class="tablescroll">
    <table class="cuts">
      <thead><tr><th>Element</th><th>What happened to it</th><th>Why</th></tr></thead>
      <tbody>
        <tr><td>Navigation</td><td>Four tabs become five grouped menus</td>
            <td>Ported from gender.cgiar.org: Explore, Research, Learn and apply, Updates, About. Read from the live site on 03/09/2026.</td></tr>
        <tr><td>Full-bleed hero</td><td>Restored</td>
            <td>Concept E replaced it with a split panel only to stop C and D reading as the same site. With one V1 candidate that reason has expired, and the image-led hero is the Gender pattern.</td></tr>
        <tr><td>Weekly spotlight</td><td>Back on the home page, generated rather than curated</td>
            <td>It is a standing block on the Gender home page. Nobody is named to curate it here, so it is filled from the catalogue and pinned to D6.</td></tr>
        <tr><td>Ten editorial themes</td><td>Still off the spine</td>
            <td>&ldquo;The tab themes overlap a lot, need more diffierentiation&rdquo;, Peter Steward, 11/08/2026. Full taxonomy is V2 in the 03/09/2026 plan.</td></tr>
        <tr><td>Experts</td><td>Kept, on Learn and apply, still without search</td>
            <td>The Gender Platform has an Experts page under the same menu. The missing search was the round 3 criticism and is left visible pending D7.</td></tr>
        <tr><td>The data piece</td><td>Now a labelled external link in the Research menu and the footer</td>
            <td>Asked for on 03/09/2026. The hub is resource access; the Climate Data Hub is the data subset.</td></tr>
        <tr><td>Operating system</td><td>New nav item, linking to CA-OS behind CGIAR sign-in</td>
            <td>Asked for on 03/09/2026, destination supplied the same day. CA-OS enforces its own sign-in, so this site needs no gate: the only build work is a labelled link. What remains open is who may hold an account. Decision D11.</td></tr>
        <tr><td>Storytelling</td><td>One V2 preview page, four adapted patterns</td>
            <td>Lexicon framed as complementary on 03/09/2026. Kept off the V1 spine on purpose.</td></tr>
      </tbody>
    </table>
    </div>
    <span class="src">Rows citing 01/09/2026 and 03/09/2026 come from John&rsquo;s meeting notes of those dates
    and have not been confirmed in writing by the speakers.</span>
  </div>
</section>
"""

RESOURCES = """
<div class="ghero" style="background:var(--blue-900)">
  <div class="ghero-in" style="padding-top:44px;padding-bottom:38px">
    <div class="ghero-kicker">Explore</div>
    <h1 style="font-size:clamp(24px,3.4vw,34px)">Find evidence</h1>
    <p style="color:var(--on-dark);font-size:15.5px;max-width:70ch;margin-top:10px">
      The whole catalogue behind one search field and three filters. Search requires every term to appear, so a
      phrase narrows rather than widens. An empty result is information about the catalogue.</p>
  </div>
</div>

<div class="filters">
  <div class="filters-in">
    <label class="sr-only" for="fq">Search</label>
    <input type="search" id="fq" placeholder="Search the catalogue">
    <label class="sr-only" for="ftype">Resource type</label>
    <select id="ftype"><option value="">All resource types</option></select>
    <label class="sr-only" for="farea">Area of work</label>
    <select id="farea"><option value="">All areas of work</option></select>
    <label class="sr-only" for="flens">Climate action</label>
    <select id="flens">
      <option value="">Adaptation and mitigation</option>
      <option value="adaptation">Adaptation</option>
      <option value="mitigation">Mitigation</option>
      <option value="cross">Cross-cutting</option>
    </select>
    <button class="ghostbtn" id="freset" type="button">Reset</button>
    <span class="resultcount" id="count"></span>
  </div>
</div>

<section class="section">
  <div class="wrap">
    <div class="rowlist" id="rows"></div>
    <span class="src">Every row is written from the catalogue at page load. The badge counts how many of six
    metadata fields are recorded: provider, resolution, time coverage, update cadence, licence and access
    format. A field nobody has recorded shows as absent rather than being filled in plausibly, which is why the
    badges are worth reading. Filter and search use are recorded anonymously, without cookies.</span>
  </div>
</section>
"""

AREAS = """
<div class="ghero" style="background:var(--blue-900)">
  <div class="ghero-in" style="padding-top:44px;padding-bottom:38px">
    <div class="ghero-kicker">Explore</div>
    <h1 style="font-size:clamp(24px,3.4vw,34px)">Areas of work</h1>
    <p style="color:var(--on-dark);font-size:15.5px;max-width:70ch;margin-top:10px">
      The five areas of work as published on cgiar.org, each with what the catalogue currently holds under it.
      Where an area is thin, the page shows it thin.</p>
  </div>
</div>

<section class="section">
  <div class="wrap">
    <div id="areaSections"></div>
    <span class="src">Area names and descriptions are quoted from cgiar.org as read on 10/08/2026 and recorded
    in the design strategy note of 09/08/2026. Item counts are computed at page load. The Gender Platform gives
    each of its ten themes a page of its own; whether each area of work earns a page or a filtered view is a
    build decision for the SO team, recorded in the Drupal spec.</span>
  </div>
</section>
"""

LEARN = """
<div class="ghero" style="background:var(--blue-900)">
  <div class="ghero-in" style="padding-top:44px;padding-bottom:38px">
    <div class="ghero-kicker">Learn and apply</div>
    <h1 style="font-size:clamp(24px,3.4vw,34px)">Tools, methods and manuals</h1>
    <p style="color:var(--on-dark);font-size:15.5px;max-width:70ch;margin-top:10px">
      How to do the work, not only what exists. Ported from the Gender Platform's menu of the same name.</p>
  </div>
</div>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <div class="section-label">Methods and training</div>
      <h2>Tools, methods, manuals</h2>
    </div>
    <div class="gcards" id="tools"></div>
  </div>
</section>

<section class="section tint" id="innovations">
  <div class="wrap">
    <div class="section-head">
      <div class="section-label">Innovation catalogues</div>
      <h2>Innovations</h2>
      <p>Links out to the catalogues the round 2 feedback named: getting information quickly out of TAAT, ACCRA
      and WOCAT, and knowing whether those resources connect to climate.</p>
    </div>
    <div class="gcards" id="innov"></div>
  </div>
</section>

<section class="section" id="experts">
  <div class="wrap">
    <div class="section-head pinnable">
      <div class="section-label">People</div>
      <h2>Experts<a class="pin" href="decisions.html#d7" title="Decision 7: whether V1 lists people at all">D7</a></h2>
      <p>Six use-case champions, each with the work they can be asked about.</p>
    </div>
    <div class="gcards" id="experts"></div>
    <div class="gapblock" style="margin-top:20px">
      <strong>Deliberately still broken.</strong> This list has no search and no filter. That was the specific
      criticism in round 3 of the Mural feedback, and it is reproduced here unchanged, because fixing it is only
      worth doing if decision D7 says V1 lists people at all. <strong>This is not a directory of CGIAR climate
      experts</strong> and does not claim to be one: it is the six people already named against use cases in the
      v0.2 prototype.
    </div>
  </div>
</section>
"""

UPDATES = """
<div class="ghero" style="background:var(--blue-900)">
  <div class="ghero-in" style="padding-top:44px;padding-bottom:38px">
    <div class="ghero-kicker">Updates</div>
    <h1 style="font-size:clamp(24px,3.4vw,34px)">Funding calls, events and projects</h1>
    <p style="color:var(--on-dark);font-size:15.5px;max-width:70ch;margin-top:10px">
      Kept separate from publications, because a deadline and a paper are not the same kind of thing to a
      reader in a hurry.</p>
  </div>
</div>

<section class="section" id="funding">
  <div class="wrap">
    <div class="section-head pinnable">
      <div class="section-label">Deadlines</div>
      <h2>Funding calls<a class="pin" href="decisions.html#d6" title="Decision 6: who keeps this current">D6</a></h2>
      <p>Rolling and dated calls recorded in the catalogue.</p>
    </div>
    <div class="gcards" id="funding"></div>
    <div class="gapblock" style="margin-top:20px">
      <strong>The freshness risk, stated plainly.</strong> A funding page with a passed deadline on it does more
      damage than no funding page. Nobody is yet named to check these. In the Drupal build this is the one view
      that should expire items automatically on their closing date, which is in the build spec.
    </div>
  </div>
</section>

<section class="section tint" id="events">
  <div class="wrap">
    <div class="section-head">
      <div class="section-label">Diary</div>
      <h2>Events</h2>
    </div>
    <div class="gcards" id="events"></div>
  </div>
</section>

<section class="section" id="projects">
  <div class="wrap">
    <div class="section-head">
      <div class="section-label">Delivery</div>
      <h2>Projects</h2>
      <p>Work in progress inside the programme, with the champion named where one is recorded.</p>
    </div>
    <div class="gcards" id="projects"></div>
  </div>
</section>
"""

ABOUT = """
<div class="ghero" style="background:var(--blue-900)">
  <div class="ghero-in" style="padding-top:44px;padding-bottom:38px">
    <div class="ghero-kicker">About</div>
    <h1 style="font-size:clamp(24px,3.4vw,34px)">Who we are, and how this site is put together</h1>
  </div>
</div>

<section class="section">
  <div class="wrap">
    <div class="section-head pinnable">
      <div class="section-label">Who we are</div>
      <h2>Not written yet<a class="pin" href="decisions.html#d6" title="Decision 6: who writes and owns the copy">D6</a></h2>
    </div>
    <div class="gapblock">
      <strong>Not written yet:</strong> two or three paragraphs on what CGIAR Climate Action is, who runs the
      Hub and who it is for. The Gender Platform's equivalent page is the model. This has to be written by a
      person with the authority to say it, and signed off, not generated. Decision D6 names that person.
    </div>
    <span class="src">Every other sentence on this site is either generated from the catalogue at page load or
    carries the note it came from. This page is where a real voice is most obviously missing, and it is left
    missing rather than filled with plausible text nobody owns.</span>
  </div>
</section>

<section class="section tint" id="our-work">
  <div class="wrap">
    <div class="section-head">
      <div class="section-label">Our work</div>
      <h2>What the programme has committed to</h2>
      <p>Published programme targets. Stated as published and never recomputed here.</p>
    </div>
    <div class="tablescroll">
      <table class="cuts">
        <thead><tr><th>Target</th><th>As published</th></tr></thead>
        <tbody>
          <tr><td>Smallholder farmers to benefit</td><td>16 million</td></tr>
          <tr><td>Climate finance to be unlocked</td><td>USD 15 billion</td></tr>
          <tr><td>Emissions reduction by 2030</td><td>1 gigaton CO<sub>2</sub>-equivalent</td></tr>
          <tr><td>Priority countries</td><td>20, across Tier 1 and Tier 2</td></tr>
        </tbody>
      </table>
    </div>
    <span class="src">Figures as published on cgiar.org, read 10/08/2026. The programme publishes 20 priority
    countries as a count and not as a list, so this site names no countries and offers no country selector.
    Concept E moved this strip off the home page because targets say what the programme promises, not what a
    visitor can do; it belongs here instead.</span>
  </div>
</section>

<section class="section" id="how-we-curate">
  <div class="wrap">
    <div class="section-head">
      <div class="section-label">How we curate</div>
      <h2>How we harvest, select and prioritise resources</h2>
      <p>The Gender Platform publishes a page under this name. Ours carries the same promise, and then the
      measurement that tests it, computed at page load so that it cannot quietly go out of date.</p>
    </div>
    <div id="measures"></div>
    <div class="gapblock" style="margin-top:20px">
      <strong>What these numbers mean for V1.</strong> No choice of front end fixes any of them. Whether V1
      ships before ingestion and tagging are fixed is decision D8, and the handover of 12/08/2026 warns that
      choosing a layout is the easier decision and will crowd D8 out if allowed to.
    </div>
    <span class="src">Computed from the catalogue in assets/data.js each time this page loads. Every entry was
    either carried over from the v0.2 prototype, where its link had already been checked, or read from the
    provider's own page on 10/08/2026. Fields nobody has recorded are left empty rather than guessed.</span>
  </div>
</section>
"""

OPSYS = """
<div class="ghero" style="background:#322A5E">
  <div class="ghero-in" style="padding-top:44px;padding-bottom:38px">
    <div class="ghero-kicker" style="color:#C9C2F0">Learn and apply</div>
    <h1 style="font-size:clamp(24px,3.4vw,34px)">Operating system<a class="pin done" href="decisions.html#d11" title="Decision 11: destination and access model settled 03/09/2026; who is entitled still open">D11</a></h1>
    <p style="color:#D8D3F2;font-size:15.5px;max-width:70ch;margin-top:10px">
      CA-OS, the Climate Action Operating System. Access is by CGIAR sign-in, enforced by CA-OS itself.</p>
  </div>
</div>

<section class="section">
  <div class="wrap">
    <div class="gate">
      <h2>CA-OS, the Climate Action Operating System</h2>
      <p style="margin-top:10px">A separate CGIAR application, not part of this site. Everything behind its
      sign-in belongs to it; this page is the signposted way in and nothing more.</p>
      <dl>
        <dt>Destination</dt><dd><a href="https://ca-os-bice.vercel.app/" target="_blank" rel="noopener">ca-os-bice.vercel.app &#8599;</a></dd>
        <dt>What it covers</dt><dd>Six modules, named on its own landing page: Plan, Know, Produce, Share, Connect and Scan.</dd>
        <dt>Access</dt><dd>&ldquo;Sign in with CGIAR&rdquo;. Nothing is readable without signing in.</dd>
        <dt>Who is entitled</dt><dd><span class="gap">Not recorded: who may hold a CA-OS account, and who administers that</span></dd>
      </dl>
      <p style="margin-top:18px">
        <a class="btn" href="https://ca-os-bice.vercel.app/" target="_blank" rel="noopener">Open CA-OS &#8599;</a>
        <a href="decisions.html#d11" style="margin-left:16px">What is still open &rarr;</a>
      </p>
      <span class="src">Title, the six module names and the sign-in wording were read from the CA-OS landing
      page on 03/09/2026, in a browser, without signing in. The four lines above are all that page shows before
      sign-in. Nothing here describes what CA-OS contains, because that is behind its sign-in and I have not
      seen it.</span>
    </div>

    <div class="section-head" style="margin-top:44px">
      <div class="section-label">For the build</div>
      <h2>What knowing the destination settles</h2>
      <p>The 03/09/2026 feedback asked for &ldquo;a password-controlled operating system link&rdquo;. Now that
      the destination is known, that turns out to be simpler than it sounded, and cheaper to build.</p>
    </div>
    <div class="tablescroll">
      <table class="cuts">
        <thead><tr><th>Question</th><th>Answer</th><th>What it means for the Drupal build</th></tr></thead>
        <tbody>
          <tr><td>Where does the link go?</td>
              <td>CA-OS, at ca-os-bice.vercel.app</td>
              <td>One external menu item and one landing page. No new content type.</td></tr>
          <tr><td>How is access controlled?</td>
              <td>CGIAR sign-in, enforced by CA-OS</td>
              <td><strong>This site needs no gate of its own.</strong> No shared password, no Drupal role,
              no accounts to administer here, and nothing for the SO team to integrate on the Hub side. The
              three options costed in the build spec are moot.</td></tr>
          <tr><td>Is anything exposed by linking to it?</td>
              <td>No. The landing page shows only the product name, the six module names and the sign-in button</td>
              <td>The link can sit in public navigation. Checked on 03/09/2026 without signing in.</td></tr>
          <tr><td>Who may sign in?</td>
              <td>Not recorded</td>
              <td>Not this site&rsquo;s decision, but worth knowing before the link is advertised, so that
              people who cannot get in are not sent to a door that will not open. The label says CGIAR
              sign-in for that reason.</td></tr>
        </tbody>
      </table>
    </div>
    <span class="src">The build spec of 03/09/2026, section 9, costed a shared password, a Drupal role and
    CGIAR single sign-on. That section is superseded by this page: the gating already exists in CA-OS, so the
    only work left is a labelled link.</span>

    <div class="gapblock" style="margin-top:24px">
      <strong>One thing to decide before launch.</strong> A menu item most visitors cannot open is a small
      cost paid on every visit. It is worth it if the audience for this site includes the people who hold
      CA-OS accounts, and not if it does not, in which case the link belongs in a signed-in menu or in an
      internal handbook instead. That depends on decision D1, the primary user, which is not taken.
    </div>
  </div>
</section>
"""

STORY = """
<div class="lex">
  <div class="lex-in">
    <span class="lex-note">V2 preview &middot; four adapted patterns</span>
    <h1 style="font-size:clamp(26px,3.6vw,38px);line-height:1.2;max-width:26ch">Storytelling patterns, tested against real material</h1>
    <p style="max-width:72ch;font-size:16px;color:#4A4740;margin-top:14px">
      The plan of 03/09/2026 puts the storytelling layer in V2 and frames the Lexicon work as complementary
      rather than as the foundation: their site carries the external impact narrative, this one carries resource
      access, and the data piece is a subset of it. Merging the two is the stated goal, but not at their price.
    </p>
    <p style="max-width:72ch;font-size:16px;color:#4A4740;margin-top:12px">
      So this page borrows four <em>patterns</em> from lexiconoffood.com/regen-ag, read on 03/09/2026, and fills
      each with material the catalogue already holds. Not one word of narrative has been written to make them
      look better. Where a pattern needs content that does not exist, it says so.
    </p>
  </div>
</div>

<!-- PATTERN 1: the audience-labelled module -->
<div class="lex">
  <div class="lex-in" style="border-top:1px solid var(--lex-line)">
    <h2>Pattern 1. The audience-labelled module</h2>
    <p style="max-width:72ch;font-size:15px;color:#4A4740;margin-top:10px">
      Every section of their page opens with an audience label, then a short title, two or three sentences, one
      image and a single call to action. The label is the part worth stealing: it tells a reader in three words
      whether the next block is for them, which is exactly what a hub serving four audiences at once cannot
      currently do.
    </p>
    <div class="lex-mods">
      <div class="lex-mod">
        <div class="lex-aud">For a proposal writer</div>
        <h3>Climate rationale, from evidence to narrative</h3>
        <div class="lex-fig"><img src="assets/img/theme-models.jpg" alt="Crop-climate modelling workshop in Accra"></div>
        <p>A notebook that turns hazard and exposure data into the risk narrative a Green Climate Fund proposal
        has to contain. Held in the catalogue as a project with a named champion.</p>
        <span class="src" data-credit="theme-models.jpg"></span>
        <a class="lex-btn" href="resources.html?q=GCF">See what the catalogue holds</a>
      </div>
      <div class="lex-mod">
        <div class="lex-aud">For a scientist</div>
        <h3>Four climate records, with their limits stated</h3>
        <div class="lex-fig"><img src="assets/img/theme-water.jpg" alt="Working with water terraces in Lower Nyando, Kenya"></div>
        <p>Resolution, time coverage, update cadence, licence and access format, recorded per dataset, with the
        gaps visible. The badge is a count of recorded fields, not a quality rating.</p>
        <span class="src" data-credit="theme-water.jpg"></span>
        <a class="lex-btn" href="resources.html?type=dataset">Open the datasets</a>
      </div>
      <div class="lex-mod">
        <div class="lex-aud">For an investor</div>
        <h3>Innovation catalogues, and whether they touch climate</h3>
        <div class="lex-fig"><img src="assets/img/theme-farm.jpg" alt="Climate-smart farm"></div>
        <p>The round 2 feedback asked for exactly this: fast extraction from TAAT, ACCRA and WOCAT, and a way to
        tell whether what they hold connects to climate at all.</p>
        <span class="src" data-credit="theme-farm.jpg"></span>
        <a class="lex-btn" href="learn.html#innovations">Open the catalogues</a>
      </div>
    </div>
    <span class="src">Three audience labels are shown because the design strategy note records at least four
    candidate users and ranks none of them. Which label survives into V1 is decision D1. Photographs are
    Creative Commons images from the CGIAR Climate Flickr stream, credited above, and illustrate the programme
    rather than the specific resource.</span>
  </div>
</div>

<!-- PATTERN 2: numbered annotations over an image -->
<div class="lex">
  <div class="lex-in" style="border-top:1px solid var(--lex-line)">
    <h2>Pattern 2. Numbered annotations over an image</h2>
    <p style="max-width:72ch;font-size:15px;color:#4A4740;margin-top:10px">
      Their signature device: a photograph with numbered notes laid over it, so a reader learns by looking
      rather than by reading a paragraph. It is the pattern most often asked for and the most dangerous to
      copy, because annotations invite invented detail. Every note below is a metadata field already recorded
      against a real catalogue entry, and nothing has been added to make the picture tell a better story.
    </p>
    <div class="artwork">
      <img src="assets/img/theme-adaptation.jpg" alt="A climate-smart farm in Doyogena, Ethiopia">
      <div class="annot" style="top:6%;left:4%"><b>1</b><span>CHIRPS gives rainfall at 0.05 degrees, 1981 to present, updated monthly. Recorded licence: open.</span></div>
      <div class="annot" style="top:34%;right:4%"><b>2</b><span>ERA5 gives temperature and other variables hourly from 1940, at roughly 31 km. The field a reader most often wants, bias adjustment, is not recorded.</span></div>
      <div class="annot" style="bottom:8%;left:8%"><b>3</b><span>Searching <em>drought</em> across all <span class="corpus-n">51</span> items returns three resources and no project, although drought was the most recurrent topic in the check-in of 10/08/2026.</span></div>
    </div>
    <div class="annot-list">
      <ol>
        <li>CHIRPS gives rainfall at 0.05 degrees, 1981 to present, updated monthly. Recorded licence: open.</li>
        <li>ERA5 gives temperature and other variables hourly from 1940, at roughly 31 km. The field a reader most often wants, bias adjustment, is not recorded.</li>
        <li>Searching <em>drought</em> across all <span class="corpus-n">51</span> items returns three resources and no project, although drought was the most recurrent topic in the check-in of 10/08/2026.</li>
      </ol>
    </div>
    <span class="src" data-credit="theme-adaptation.jpg"></span>
    <span class="src">Notes 1 and 2 are quoted from the catalogue's own metadata fields, read from the
    providers' pages on 10/08/2026. Note 3 is a live count. On a narrow screen the notes move below the image,
    because annotations pinned to a photograph stop being legible under about 860 pixels: that is the honest
    limit of this pattern, and it has to be designed for rather than discovered later.</span>
  </div>
</div>

<!-- PATTERN 3: the validation badge -->
<div class="lex">
  <div class="lex-in" style="border-top:1px solid var(--lex-line)">
    <h2>Pattern 3. The validation badge</h2>
    <p style="max-width:72ch;font-size:15px;color:#4A4740;margin-top:10px">
      Their case studies carry a small completion marker. Ours carries a count of how many of six metadata
      fields are recorded, which is the same idea backed by something checkable:
      <span class="vbadge full">&#10003; 6/6 metadata</span> means every field is recorded, and
      <span class="vbadge part">4/6 metadata</span> means two are missing and hovering says which.
    </p>
    <p style="max-width:72ch;font-size:15px;color:#4A4740;margin-top:10px">
      This is the one Lexicon pattern worth taking into V1 rather than V2, because it costs nothing to compute
      and it makes the catalogue's real state visible on every card. It is also the pattern most likely to be
      objected to, since it publishes the gaps. That objection is the argument for fixing ingestion first,
      which is decision D8.
    </p>
    <span class="src">A badge counts recorded fields. It says nothing about whether a dataset is any good, and
    it must never be presented as a quality score.</span>
  </div>
</div>

<!-- PATTERN 4: the curated journey -->
<div class="lex">
  <div class="lex-in" style="border-top:1px solid var(--lex-line)">
    <h2>Pattern 4. The curated journey</h2>
    <p style="max-width:72ch;font-size:15px;color:#4A4740;margin-top:10px">
      Halfway down their page a reader picks a role, and the page reassembles for that role. It is the most
      tempting pattern here, because the Hub has four candidate audiences and no ranking. It is also the one to
      be most careful with: a role selector can look like a decision while quietly avoiding one, and the
      meeting of 01/09/2026 concluded that a site built for all four audiences is the site that already exists.
    </p>
    <p style="max-width:72ch;font-size:15px;color:#4A4740;margin-top:10px">
      Shown here as a working demonstration so the trade-off can be argued from something real. Each route is
      assembled by filtering fields the catalogue already has.
    </p>
    <div class="journey" id="journey"></div>
    <div class="jout" id="jout"></div>
    <span class="src">Candidate users and the evidence for each are from the design strategy note of
    09/08/2026 and the V1 decision meeting pack of 01/09/2026. The national partner route is deliberately left
    to come back nearly empty: Nigeria is the only African country named anywhere in the item fields across all
    <span class="corpus-n">51</span> items.</span>
  </div>
</div>

<!-- What was not borrowed -->
<section class="section">
  <div class="wrap">
    <div class="section-head">
      <div class="section-label">Boundaries</div>
      <h2>What was deliberately not taken from the Lexicon work</h2>
    </div>
    <div class="tablescroll">
      <table class="cuts">
        <thead><tr><th>Their element</th><th>Not borrowed, because</th></tr></thead>
        <tbody>
          <tr><td>Illustrated concept sequences, eight captionless panels</td>
              <td>They carry the argument in commissioned artwork. Nothing equivalent exists here, and a sequence of stock photographs would be decoration pretending to be explanation.</td></tr>
          <tr><td>Contributor bylines under portraits</td>
              <td>The Hub lists six use-case champions, not authors of narrative. Attaching bylines to material they did not write would misattribute it.</td></tr>
          <tr><td>The 60-logo partner grid</td>
              <td>Partner permission and an accurate list are needed before any organisation's mark appears. Neither exists for this site.</td></tr>
          <tr><td>Their typography and colour</td>
              <td>Cream ground and near-black type are used only inside these preview blocks, to mark them as a different register. The CGIAR Climate Action palette stays in charge everywhere else.</td></tr>
          <tr><td>Their impact narrative itself</td>
              <td>That is their content and their commission. The 03/09/2026 framing is complementary, not foundational, and merging is a negotiation rather than a copy.</td></tr>
        </tbody>
      </table>
    </div>
    <span class="src">Patterns described from lexiconoffood.com/regen-ag as read on 03/09/2026. No markup,
    stylesheet, imagery or text from that site is used here. If the merge goes ahead, what is theirs and what is
    ours needs writing down before either site changes, not after.</span>
  </div>
</section>
"""

DECISIONS = """
<div class="ghero" style="background:var(--blue-900)">
  <div class="ghero-in" style="padding-top:44px;padding-bottom:38px">
    <div class="ghero-kicker">About</div>
    <h1 style="font-size:clamp(24px,3.4vw,34px)">The open decisions</h1>
    <p style="color:var(--on-dark);font-size:15.5px;max-width:72ch;margin-top:10px">
      Eleven decisions, each pinned to the place on this site where it changes what appears on screen. Four
      were closed by the feedback of 03/09/2026 and are marked in green, D11 in part. D1 and D8 still cannot
      be deferred.</p>
  </div>
</div>

<section class="section">
  <div class="wrap">
    <div class="dlist">

      <div class="dcard" id="d1">
        <h3>D1. Who is the primary user, this year</h3>
        <div class="dwho">Owner: Michelle &middot; Still open &middot; Pinned to the headline and the missing purpose sentence</div>
        <p>Four candidates are recorded, ranked by nobody: a CGIAR programme scientist inside the portfolio;
        senior leadership and the investment audience; a national partner or planning ministry; an external
        researcher.</p>
        <ul class="dopts">
          <li>The scientist makes this a working catalogue, where search and metadata quality matter most.</li>
          <li>The investment audience makes it a short, opinionated front page with the catalogue behind one link.</li>
          <li>The national partner makes country the primary axis, which the catalogue cannot yet support.</li>
          <li>The external researcher shifts weight to licence, citation and download.</li>
        </ul>
        <div class="dsrc">If deferred: nothing else can be decided, the purpose sentence stays blank, and the
        site stays unopinionated. Source: design strategy note 09/08/2026; V1 decision meeting pack
        01/09/2026.</div>
      </div>

      <div class="dcard closed" id="d2">
        <h3>D2. The spine: five areas of work, or ten editorial themes</h3>
        <div class="dwho">Closed 03/09/2026 &middot; Pinned to the by-area block</div>
        <p>Closed by the V1 plan: port the Gender Platform layout now, and leave the full taxonomy to V2. The
        five published areas of work are the V1 spine because they are the only externally verifiable grouping;
        the ten editorial themes built from item tags stay off it.</p>
        <div class="dsrc">Source: John's feedback note of 03/09/2026, &ldquo;V2 (next year): impact pathways,
        full taxonomy, storytelling layer&rdquo;. Not confirmed in writing by the speakers.</div>
      </div>

      <div class="dcard" id="d3">
        <h3>D3. What earns a place in &ldquo;start with these four&rdquo;</h3>
        <div class="dwho">Owner: Michelle, applied by the content owner &middot; Still open</div>
        <p>Four datasets are shown as the place the site takes a view. No stated rule decides which four, and
        the current set is a build-team pick carried over from Concept C.</p>
        <div class="dsrc">If deferred: the block stays an unexplained selection, which is the opposite of
        opinionated.</div>
      </div>

      <div class="dcard" id="d4">
        <h3>D4. The name</h3>
        <div class="dwho">Owner: Michelle with programme communications &middot; Still open &middot; Pinned to the masthead</div>
        <p>Six review rounds have re-litigated where this site ends and the Climate Data Hub begins, and the
        name is part of that. This port launches under the current name.</p>
        <div class="dsrc">If deferred: launch as is. Renaming after launch costs considerably more than
        renaming before it.</div>
      </div>

      <div class="dcard closed" id="d5">
        <h3>D5. Where this site ends and the Climate Data Hub begins</h3>
        <div class="dwho">Closed in principle 03/09/2026 &middot; Pinned to the Research menu and the footer</div>
        <p>Closed by the V1 plan: this site is resource access, the data piece is a subset of it, and the two
        are joined by a labelled link rather than merged. Implemented here as an external item in the Research
        menu and in the footer.</p>
        <div class="dsrc">Source: 03/09/2026, &ldquo;the hub is resource access; the data piece is a
        subset&rdquo; and &ldquo;add a link to the data piece&rdquo;. What remains open is whether the two
        catalogues share metadata, which is a build question for the SO team.</div>
      </div>

      <div class="dcard" id="d6">
        <h3>D6. Who writes and refreshes the copy</h3>
        <div class="dwho">Owner: Michelle names a person and a cadence &middot; Still open &middot; Pinned to the spotlight band, the About page and the funding page</div>
        <p>Every marked gap on this site is here for want of this decision. The Gender Platform refreshes its
        spotlight weekly and says so on the page; that promise needs a person behind it.</p>
        <div class="dsrc">If deferred: the site launches with marked gaps, or with filler nobody owns. A page
        that goes stale reads as abandoned, raised 13/08/2026.</div>
      </div>

      <div class="dcard" id="d7">
        <h3>D7. Whether V1 lists people at all</h3>
        <div class="dwho">Owner: Michelle &middot; Still open &middot; Pinned to the Experts block</div>
        <p>Six use-case champions are listed, without search, exactly as criticised in round 3. Fixing the
        search is only worth doing if the answer is yes.</p>
        <div class="dsrc">If deferred: the list stays, unsearchable, under Learn and apply.</div>
      </div>

      <div class="dcard" id="d8">
        <h3>D8. Whether V1 ships before ingestion and tagging are fixed</h3>
        <div class="dwho">Owner: Michelle &middot; Still open &middot; The one most likely to be crowded out</div>
        <p>Measured on 12/08/2026 and recomputed live on the How we curate page: searching <em>drought</em>
        returns three resources and no project; metadata completeness averages 4.6 of 6 fields; only 5 of 14
        datasets are complete; Nigeria is the only African country named in the item fields across all 51
        items.</p>
        <div class="dsrc">If deferred: V1 ships and the first serious visitor searches <em>drought</em>.
        Choosing a layout is the easier decision and will crowd this one out. Source: Climate Hub handover
        12/08/2026, section 5.</div>
      </div>

      <div class="dcard" id="d9">
        <h3>D9. What leaves the site, as opposed to leaving the home page</h3>
        <div class="dwho">Owner: Michelle with Ibukun &middot; Still open</div>
        <p>Concept E moved seven elements off the home page and kept them on the site. This port puts several
        back, because the Gender layout has a standing place for them. Nothing has been deleted yet.</p>
        <div class="dsrc">If deferred: everything stays, deprioritised, and dates quietly.</div>
      </div>

      <div class="dcard closed" id="d10">
        <h3>D10. Handover to the SO team, and what the CMS must allow</h3>
        <div class="dwho">Closed 03/09/2026 &middot; Owner for delivery: John with the SO team</div>
        <p>Closed by the V1 plan: Drupal, following the Gender Platform, so that most of the remaining work is
        text and photo swaps and resource collation inside a CMS that already handles automatic updates. The
        content model, fields, taxonomy, views, roles and the migration files are in the Drupal build spec of
        03/09/2026.</p>
        <div class="dsrc">Source: 03/09/2026, &ldquo;V1 approach: port existing hub to match the Gender
        Platform layout&rdquo; and &ldquo;mostly text/photo swaps, resource collation, automatic updates
        already built in Drupal&rdquo;. What remains open is the date.</div>
      </div>

      <div class="dcard closed" id="d11">
        <h3>D11. What the operating system is, and who may see it</h3>
        <div class="dwho">Destination and access model closed 03/09/2026 &middot; One part still open &middot; Pinned to the Operating system page</div>
        <p>Closed on the substance: the link goes to CA-OS, the Climate Action Operating System, at
        ca-os-bice.vercel.app, and access is by CGIAR sign-in enforced by CA-OS itself. That means this site
        needs no gate of its own: no shared password, no Drupal role, no accounts to administer here. The three
        options costed in the build spec are moot, and the only work left is a labelled external link.</p>
        <p>Checked without signing in on 03/09/2026: the CA-OS landing page shows its name, six module names
        and the sign-in button, and nothing else, so linking to it from a public page exposes nothing.</p>
        <ul class="dopts">
          <li><strong>Still open:</strong> who may hold a CA-OS account, and who administers that. Not this
          site's decision, but it decides whether a menu item most visitors cannot open is worth its place.</li>
          <li>That in turn depends on D1. If the primary user is a CGIAR programme scientist the link earns its
          place; if it is the investment audience or a national partner, it does not, and it belongs in a
          signed-in menu or an internal handbook.</li>
        </ul>
        <div class="dsrc">Source: John's feedback note of 03/09/2026 for the request, and the CA-OS landing
        page read on 03/09/2026 for the destination, the modules and the access model.</div>
      </div>

    </div>
    <span class="src">Decisions D1 to D10 are carried from the V1 decision meeting pack of 01/09/2026, which
    itself draws on the design strategy note of 09/08/2026, the Climate Hub handover of 12/08/2026 and the
    Concept D README of 13/08/2026. D11 is new. Statements attributed to 01/09/2026 and 03/09/2026 come from
    John's meeting notes of those dates and have not been confirmed in writing by the speakers.</span>
  </div>
</section>
"""

PAGES = [
    ("index.html", "CGIAR Climate Hub &mdash; V1 candidate", "The Climate Hub ported to the CGIAR Gender Platform layout, for a Drupal build. V1 candidate of 03/09/2026.", "explore", HOME),
    ("resources.html", "Find evidence &mdash; CGIAR Climate Hub V1", "Search the whole Climate Hub catalogue by type, area of work and climate action.", "explore", RESOURCES),
    ("areas.html", "Areas of work &mdash; CGIAR Climate Hub V1", "The five CGIAR Climate Action areas of work, with what the catalogue holds under each.", "explore", AREAS),
    ("learn.html", "Tools, methods and manuals &mdash; CGIAR Climate Hub V1", "Methods, innovation catalogues and use-case champions.", "learn", LEARN),
    ("updates.html", "Funding calls, events and projects &mdash; CGIAR Climate Hub V1", "Climate funding calls, events and programme projects.", "updates", UPDATES),
    ("about.html", "About &mdash; CGIAR Climate Hub V1", "Who runs the Hub, the published programme targets, and how resources are harvested and prioritised.", "about", ABOUT),
    ("operating-system.html", "Operating system &mdash; CGIAR Climate Hub V1", "CA-OS, the Climate Action Operating System, reached by CGIAR sign-in.", "learn", OPSYS),
    ("storytelling.html", "Storytelling patterns &mdash; CGIAR Climate Hub V1", "Four storytelling patterns adapted from the Lexicon of Food work, tested against real catalogue material. V2 preview.", "explore", STORY),
    ("decisions.html", "The open decisions &mdash; CGIAR Climate Hub V1", "Eleven decisions pinned to the places on the site where they change what appears.", "about", DECISIONS),
]


def main():
    os.makedirs(OUT, exist_ok=True)
    written = []
    for name, title, desc, group, body in PAGES:
        written.append(page(name, title, desc, group, body))
    print("wrote %d pages: %s" % (len(written), ", ".join(written)))


if __name__ == "__main__":
    main()
