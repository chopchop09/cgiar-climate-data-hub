#!/usr/bin/env python3
"""Build the publication cut of Concept C, the working version.

Five pages share one head, header, nav and footer, written once here and stamped
into each so they cannot drift. Run from anywhere:

    python3 build-c-publish.py

Writes into the concept-c folder beside this script (OUT below).
"""
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "concept-c")
HUB = "https://cgiar-climate-data-hub.github.io/"
CA_PAGE = "https://www.cgiar.org/cgiar-research-portfolio-2025-2030/climate-action"
LINKEDIN = "https://www.linkedin.com/showcase/cgiar-climate/"

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
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=Noto+Serif:wght@700&display=swap" rel="stylesheet" media="all" onerror="this.remove()">
<link rel="stylesheet" href="assets/styles.css">
<link rel="stylesheet" href="assets/concept-c.css">
<link rel="stylesheet" href="assets/publish.css">
<script src="assets/analytics.js" defer></script>
</head>
<body>
<a href="#main" class="skip-link">Skip to main content</a>

<header>
  <div class="header-inner">
    <a href="index.html" class="brand-link" aria-label="CGIAR Climate Hub home">
      <img src="assets/cgiar-logo.png" alt="" height="34">
      <span class="brand-name">CGIAR Climate Hub</span>
    </a>
  </div>
</header>
"""

NAV_ITEMS = [
    ("index.html", "Home"),
    ("resources.html", "Resources &amp; Data"),
    ("themes.html", "Themes"),
    ("news.html", "News &amp; Events"),
    ("about.html", "About &amp; Contact"),
]


def nav(current):
    out = ['<nav class="ctabs" aria-label="Main navigation">', '  <div class="ctabs-in">']
    for href, label in NAV_ITEMS:
        cur = ' aria-current="page"' if href == current else ''
        out.append(f'    <a class="ctab" href="{href}"{cur}>{label}</a>')
    out.append(f"""    <a class="ctab ctab-hub" href="{HUB}" target="_blank" rel="noopener">Climate Data Hub <span aria-hidden="true">&#8599;</span></a>
    <form class="ctab-search" role="search" action="resources.html" method="get">
      <label class="sr-only" for="navq">Search the Hub</label>
      <input id="navq" name="q" type="search" placeholder="Search the Hub" autocomplete="off">
      <button type="submit" aria-label="Search"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 L21 21"/></svg></button>
    </form>
    <a class="ctab ctab-signin" href="about.html#contact" title="Operating system, for programme staff">Sign in</a>
  </div>
</nav>

<main id="main" tabindex="-1">
""")
    return "\n".join(out)


FOOTER = f"""
</main>

<footer>
  <div class="footer-inner">
    <div class="footer-top">
      <div>
        <img src="assets/cgiar-logo.png" alt="CGIAR" height="42">
        <p>The evidence behind the CGIAR Climate Action Science Program: datasets, publications, tools and
        methods, curated as one front door and linked to where each lives.</p>
      </div>
      <div class="footer-col">
        <h3>Explore</h3>
        <a href="index.html">Home</a>
        <a href="resources.html">Resources and data</a>
        <a href="themes.html">Themes</a>
        <a href="news.html">News and events</a>
        <a href="about.html">About and contact</a>
      </div>
      <div class="footer-col">
        <h3>Go deeper</h3>
        <a href="{HUB}" target="_blank" rel="noopener">Climate Data Hub &#8599;</a>
        <a href="https://cgspace.cgiar.org/" target="_blank" rel="noopener">CGSpace &#8599;</a>
        <a href="https://gardian.cgiar.org/" target="_blank" rel="noopener">Gardian &#8599;</a>
      </div>
      <div class="footer-col">
        <h3>Programme</h3>
        <a href="{CA_PAGE}" target="_blank" rel="noopener">CGIAR Climate Action &#8599;</a>
        <a href="{LINKEDIN}" target="_blank" rel="noopener">Climate Action on LinkedIn &#8599;</a>
        <a href="https://www.cgiar.org/funders" target="_blank" rel="noopener">CGIAR Trust Fund Contributors &#8599;</a>
      </div>
      <div class="footer-col">
        <h3>Contact</h3>
        <a href="mailto:climate@cgiar.org">climate@cgiar.org</a>
        <a href="about.html#contact">How to reach the programme</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2026 CGIAR. Photographs are Creative Commons and credited in their captions. Linked content
      stays under its own licence. Analytics are cookie-free, so no consent banner is needed.</span>
      <span>Publication cut, 02/11/2026 &middot; <a href="../compare.html" style="color:inherit">Earlier versions, for the record</a></span>
    </div>
  </div>
</footer>

<script src="assets/data.js"></script>
<script src="assets/themes.js"></script>
<script src="assets/app.js"></script>
</body>
</html>
"""


def page(name, title, desc, body):
    html = HEAD.format(title=title, desc=desc) + nav(name) + body + FOOTER
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        f.write(html)
    return name


# --------------------------------------------------------------------------- #
# Page bodies
# --------------------------------------------------------------------------- #

HOME = f"""
<div class="chero chero-short">
  <img class="chero-img" src="assets/img/hero-sahel.jpg"
       alt="A farmer preparing planting pits using innovative farming practices in the Sahel">
  <div class="chero-caption" id="cap-hero"></div>
</div>
<div class="chero-words">
  <div class="chero-words-in">
    <p class="chero-mission">The evidence behind CGIAR&rsquo;s climate work, in one place</p>
    <p class="chero-sub">&ldquo;We aim to drive science, innovation, and collaboration to transform food, land, and
    water systems&rdquo; for a climate-resilient, net-zero and equitable future. This site is the curated front
    door to the datasets, publications, tools and methods that work runs on.</p>
    <form class="herosearch" role="search" action="resources.html" method="get">
      <label class="sr-only" for="q">Search the catalogue</label>
      <input type="search" id="q" name="q" placeholder="Search">
      <button type="submit">Search</button>
    </form>
    <p class="src">Quotation from the Climate Action programme overview on cgiar.org, read 02/11/2026.</p>
  </div>
</div>

<div class="targetstrip">
  <div class="wrap">
    <div class="targets" id="targets"></div>
    <p class="targets-src">Targets and country count as published on cgiar.org, read 10/08/2026 and again 02/11/2026.</p>
  </div>
</div>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <div class="section-label">Find evidence</div>
      <h2>What are you looking for?</h2>
    </div>
    <div class="typecards" id="typecards"></div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <div class="section-head">
      <div class="section-label">Browse by theme</div>
      <h2>Ten climate themes</h2>
      <p>An editorial grouping built from the tags on the catalogued items, not a CGIAR taxonomy. An item can sit
      under more than one theme, and every count is matched from the catalogue at page load.</p>
    </div>
    <div class="themelist" id="themelistShort"></div>
    <p style="margin-top:20px"><a class="btn ghost" href="themes.html">See all ten themes in full &rarr;</a></p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <div class="section-label">Programme structure</div>
      <h2>The five areas of work</h2>
      <p>As published on cgiar.org. Counts are the catalogued evidence sitting under each.</p>
    </div>
    <div class="aowlist" id="aowList"></div>
  </div>
</section>

<div class="hubcall">
  <div class="wrap hubcall-in">
    <div>
      <div class="section-label" style="color:#8FC4FF">The data itself</div>
      <h2>Looking for the datasets, notebooks and tutorials?</h2>
      <p>The Climate Data Hub is the data piece: catalogued climate records with their metadata, runnable
      notebooks, and tutorials for getting data into Python, R or a desktop GIS. This site points to it rather than
      copying it.</p>
    </div>
    <a class="btn on-dark" href="{HUB}" target="_blank" rel="noopener">Open the Climate Data Hub &#8599;</a>
  </div>
</div>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <div class="section-label">Foundational data</div>
      <h2>Four climate records most analyses start from</h2>
      <p>Resolution, coverage and update cadence read from each provider on 10/08/2026. Where a provider has not
      published a field, it is left out rather than guessed.</p>
    </div>
    <div class="cards" id="foundational"></div>
  </div>
</section>

<div class="photoband">
  <img src="assets/img/banner-harvest.jpg" alt="Harvesting season in Nyando climate-smart villages">
  <div class="photoband-cap" id="cap-banner"></div>
</div>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <div class="section-label">Recent</div>
      <h2>Latest publications</h2>
    </div>
    <div class="rows" id="latestPubs"></div>
    <p style="margin-top:18px">
      <a class="btn ghost" href="resources.html?type=publication">All publications &rarr;</a>
      <a class="btn ghost" href="news.html" style="margin-left:8px">Funding calls and events &rarr;</a>
    </p>
  </div>
</section>
"""

RESOURCES = """
<div class="pagehead">
  <div class="wrap">
    <div class="section-label">Resources &amp; Data</div>
    <h1>Publications, data, tools and methods</h1>
    <p>Everything catalogued, behind one search field and two filters. Search needs every word to appear, so a
    phrase narrows rather than widens. The full record of each item lives with its publisher; this page links to it
    rather than copying it.</p>
  </div>
</div>

<div class="filters">
  <div class="wrap filters-in">
    <label class="sr-only" for="fq">Search</label>
    <input type="search" id="fq" placeholder="Search the catalogue">
    <label class="sr-only" for="fType">Resource type</label>
    <select id="fType">
      <option value="all">All resource types</option>
      <option value="publication">Publications</option>
      <option value="dataset">Datasets</option>
      <option value="method">Tools and methods</option>
      <option value="innovation">Innovation catalogues</option>
    </select>
    <label class="sr-only" for="fTheme">Theme</label>
    <select id="fTheme"><option value="all">All themes</option></select>
    <button class="ghostbtn" id="fReset" type="button">Reset</button>
    <span class="resultcount" id="rCount"></span>
  </div>
</div>

<section class="section">
  <div class="wrap">
    <div id="rResults"></div>
    <p class="src" style="margin-top:22px">Every entry was either carried over from the earlier prototype, where its
    link had already been checked, or read from the provider&rsquo;s own page on 10/08/2026. Fields nobody has
    recorded are left empty rather than filled in. The complete records live in
    <a href="https://cgspace.cgiar.org/" target="_blank" rel="noopener">CGSpace</a> and
    <a href="https://gardian.cgiar.org/" target="_blank" rel="noopener">Gardian</a>; the data itself is on the
    <a href="https://cgiar-climate-data-hub.github.io/" target="_blank" rel="noopener">Climate Data Hub</a>.</p>
  </div>
</section>
"""

THEMES = """
<div class="pagehead">
  <div class="wrap">
    <div class="section-label">Themes</div>
    <h1>The ten themes in full</h1>
    <p>An editorial grouping, not a CGIAR taxonomy. The labels were written from the tags already on the
    catalogued items, so every count below can be reproduced by searching for the term. An item can sit under more
    than one theme, which is why the counts add up to more than the catalogue.</p>
  </div>
</div>

<section class="section">
  <div class="wrap">
    <div id="themeBlocks"></div>
  </div>
</section>
"""

NEWS = """
<div class="pagehead">
  <div class="wrap">
    <div class="section-label">News &amp; Events</div>
    <h1>Funding calls, events and calls for papers</h1>
    <p>One list, newest first where a date is recorded. Rolling calls are marked as rolling.</p>
  </div>
</div>

<section class="section">
  <div class="wrap">
    <div class="rows" id="newsList"></div>
  </div>
</section>
"""

ABOUT = f"""
<div class="pagehead">
  <div class="wrap">
    <div class="section-label">About &amp; Contact</div>
    <h1>What this site is, and how to reach the programme</h1>
  </div>
</div>

<section class="section">
  <div class="wrap narrow">
    <h2>The programme</h2>
    <p>The CGIAR Climate Action Science Program, 2025 to 2030, describes its aim on cgiar.org as follows:</p>
    <blockquote class="quote">
      <p>&ldquo;We aim to drive science, innovation, and collaboration to transform food, land, and water
      systems&rdquo; for a climate-resilient, net-zero and equitable future.</p>
      <p>&ldquo;Through more resilient, low-emissions farms, landscapes, and aquatic systems, we will advance
      research across agri-food systems benefiting 16 million vulnerable small-scale producers&rdquo; and value
      chain actors across 20 countries.</p>
    </blockquote>
    <p class="src">Quoted from <a href="{CA_PAGE}" target="_blank" rel="noopener">the Climate Action programme page on
    cgiar.org</a>, read 02/11/2026. Words outside the quotation marks paraphrase the surrounding text on that page.</p>

    <h3 style="margin-top:28px">Published targets</h3>
    <div class="tablescroll">
      <table class="plain">
        <tbody>
          <tr><td>Smallholder farmers helped</td><td>16 million</td></tr>
          <tr><td>Unlocked in climate finance</td><td>USD 15 billion</td></tr>
          <tr><td>CO<sub>2</sub>-equivalent reduction by 2030</td><td>1 gigaton</td></tr>
          <tr><td>Priority countries</td><td>20</td></tr>
        </tbody>
      </table>
    </div>
    <p class="src">As published on cgiar.org under &ldquo;Our goal&rdquo;, read 02/11/2026. The programme publishes
    the country figure as a count, not a list, so this site names no countries.</p>

    <h3 style="margin-top:28px">The five areas of work</h3>
    <div class="aowlist" id="aowList"></div>
  </div>
</section>

<section class="section tint">
  <div class="wrap narrow">
    <h2>This site</h2>
    <p>A curated front door, not another repository. It holds <span class="corpus-n">37</span> catalogued items
    across datasets, publications, tools and methods, innovation catalogues, and funding calls and events, and links
    each to where it lives: the publisher&rsquo;s own page, CGSpace, Gardian, or the Climate Data Hub for the data
    itself.</p>
    <p>Every number on the site is computed from the catalogue when the page loads rather than typed in, and every
    metadata field was read from the provider or carried over from a checked record. Where a provider has not
    published a field, it is left empty.</p>
    <div id="measures"></div>
    <p class="src">Computed from the catalogue at page load.</p>
  </div>
</section>

<section class="section" id="contact">
  <div class="wrap narrow">
    <h2>Reaching the programme</h2>
    <p>Questions about the site, the programme, or a resource you think should be listed:
    <a href="mailto:climate@cgiar.org">climate@cgiar.org</a>.</p>
    <p>Programme staff reach the internal operating system through their CGIAR sign-in; it is not part of this
    site.</p>
    <p>Follow the programme on <a href="{LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a>.</p>
  </div>
</section>
"""

PAGES = [
    ("index.html", "CGIAR Climate Hub", "The evidence behind the CGIAR Climate Action Science Program: datasets, publications, tools and methods, curated as one front door.", HOME),
    ("resources.html", "Resources and data &mdash; CGIAR Climate Hub", "Search and filter the Climate Hub catalogue of publications, datasets, tools and methods.", RESOURCES),
    ("themes.html", "Themes &mdash; CGIAR Climate Hub", "Ten climate themes, each with every matching catalogued item.", THEMES),
    ("news.html", "News and events &mdash; CGIAR Climate Hub", "Climate funding calls, events and calls for papers.", NEWS),
    ("about.html", "About and contact &mdash; CGIAR Climate Hub", "What the Climate Hub is, the programme behind it, and how to reach it.", ABOUT),
]


def main():
    for name, title, desc, body in PAGES:
        page(name, title, desc, body)
    print("wrote %d pages" % len(PAGES))


if __name__ == "__main__":
    main()
