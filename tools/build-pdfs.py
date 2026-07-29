#!/usr/bin/env python3
"""
Regenerate the CGIAR Climate Hub sample PDFs:

  assets/briefs/*.pdf    one use-case brief per use case that links to one
  assets/flyers/*.pdf    five Flyer Builder sample country briefs

Why this exists
---------------
These twelve PDFs previously had no generator. They were hand-made, and they
drifted twice as a result: by 29/07/2026 every one of them still said "CGIAR
Climate Data Hub" (a name two renames out of date, and now the name of the
*technical* layer at cgiar-climate-data-hub.github.io, so the attribution was
actively wrong) and every one was still in the pre-28/07 green palette.

So the briefs are no longer written by hand. Their content is read from the
use-case records in assets/app.js, which is the same data the website renders,
which means the status, champion, programme, description and focus areas in a
brief cannot disagree with the site again. A brief is generated for every use
case whose links include an assets/briefs/*.pdf download, so adding that link
to a new use case is all it takes to get a brief for it.

The flyer samples are not use-case data, so their parameters live in FLYERS
below. Their wording is reproduced verbatim from the PDFs that were live on
29/07/2026, with only the Hub name corrected.

Usage
-----
    python3 tools/build-pdfs.py            # writes all twelve
    python3 tools/build-pdfs.py --check    # reports what would change, writes nothing

Requires: reportlab (pip install reportlab) and node (to read assets/app.js).
"""

import json
import os
import re
import subprocess
import sys

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (BaseDocTemplate, Frame, KeepTogether, PageTemplate,
                                Paragraph, Spacer, Table, TableStyle)

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP_JS = os.path.join(HERE, "assets", "app.js")
BRIEF_DIR = os.path.join(HERE, "assets", "briefs")
FLYER_DIR = os.path.join(HERE, "assets", "flyers")

# --- palette, from the :root block of assets/styles.css -----------------------
# Values marked OFFICIAL there are Climate Action programme colours.
BLUE_900 = colors.HexColor("#123E7A")   # --blue-900, primary
BLUE_800 = colors.HexColor("#1955A6")   # --blue-800 / --cta, programme accent
BLUE_100 = colors.HexColor("#E4EEFC")   # --blue-100, programme light
CTA_LT = colors.HexColor("#E7EEF9")     # --cta-lt, callout background
BLUE_50 = colors.HexColor("#F4F8FD")    # --blue-50, table row tint
BORDER = colors.HexColor("#E2E0DF")     # --border
TEXT = colors.HexColor("#1D1D1D")       # --text
TEXT_2 = colors.HexColor("#393939")     # --text-2
TEXT_3 = colors.HexColor("#727070")     # --text-3
WHITE = colors.white

# Site font stack is 'Noto Sans', Arial, Helvetica, sans-serif. Helvetica is a
# built-in reportlab font and the closest of those available without embedding.
FONT = "Helvetica"
FONT_B = "Helvetica-Bold"

PAGE_W, PAGE_H = A4
MARGIN = 40
HEADER_H = 34
FOOTER_H = 46
CONTENT_W = PAGE_W - 2 * MARGIN

HUB = "CGIAR Climate Hub"

# --- boilerplate, verbatim from the PDFs live on 29/07/2026 -------------------
# Only the Hub name is changed. Do not reword these without a decision: the
# honesty caveats are deliberate and match the site's demo-banner convention.

BRIEF_CAVEAT = (
    "<b>Sample brief.</b> This document is generated from the Climate Hub use-case portfolio to "
    "show the intended format. The use case name, programme, status, champion and description "
    "below are the real portfolio entries. The framing sections that follow are illustrative "
    "placeholders and do not yet represent agreed scope, commitments or findings."
)

BRIEF_SUPPORT = (
    "The Hub curates quality-assured climate and agricultural datasets and links them to the "
    "CGIAR use cases they serve. It does not re-host or replace the source platforms: each "
    "dataset card routes to the original platform, where licences, access conditions and "
    "attribution are governed by the provider. For this use case the Hub's role is to shorten "
    "the distance between the question being asked and the authoritative data that can answer it."
)

BRIEF_STATUS_ACTIVE = (
    "This use case is in active development. Next steps are agreed with the use-case champion "
    "and tracked through the Hub's use-case portfolio. Specific milestones, deliverables and "
    "timelines are to be confirmed and are deliberately not stated in this sample brief."
)

BRIEF_STATUS_IDEA = (
    "This use case is currently an idea rather than a committed workstream. It has been logged "
    "in the Hub's use-case portfolio so that interest, data needs and potential partners can be "
    "gathered before any commitment is made. Scope and feasibility are still open questions."
)

BRIEF_FEEDBACK = (
    "Comments on this brief, and on the Climate Hub prototype generally, can be sent using the "
    "“Give feedback” button on the Hub, which opens a pre-filled email to the Hub team."
)

FLYER_CAVEAT = (
    "<b>Sample output.</b> This is a demonstration of the Flyer Builder's intended format and "
    "length. The section structure, sources panel and layout are what the finished tool will "
    "produce. The narrative below is placeholder text: it contains no findings, figures or "
    "country-specific analysis, and must not be cited or circulated as evidence."
)

FLYER_SECTION_BODY = (
    "In the finished tool this section is assembled from the latest CGIAR evidence for the "
    "selected country, audience and topic, with every claim carrying an inline citation back to "
    "its source dataset or publication. The reviewer edits the draft before export. In this "
    "sample the section is left deliberately empty of substance so that the format can be judged "
    "without any risk of placeholder numbers being mistaken for findings."
)

FLYER_SOURCES_INTRO = (
    "The Hub curates and links; it does not re-host. Every source below routes to its original "
    "platform, where licences, access conditions and attribution are governed by the provider."
)

FLYER_HOWTO = [
    "Treat the generated draft as a starting point, never as a finished product.",
    "Check every citation against its source before the brief leaves your desk.",
    "Edit for the audience: a ministry official and a journalist need different framing.",
    "Record the generation date, since the underlying datasets are updated on their own cycles.",
]

FLYER_FEEDBACK = (
    "Comments on this sample, and on the Flyer Builder concept, can be sent using the "
    "“Give feedback” button on the Hub."
)

# Platform tables, as they appeared in the live PDFs. The briefs list AgWise and
# the flyers do not; that difference is preserved deliberately.
PLATFORMS_BRIEF = [
    ("African Agriculture Adaptation Atlas",
     "Spatial climate risk and adaptation options across Africa", "adaptationatlas.cgiar.org"),
    ("Gardian", "CGIAR's flagship open data portal", "gardian.cgiar.org"),
    ("AgMRV", "MRV for agricultural greenhouse gas emissions", "agmrv.org"),
    ("AgWise", "Location-specific climate-smart agronomic recommendations", "agwise.org"),
    ("MapSPAM", "Global crop production surfaces at 5 arcminute resolution", "mapspam.info"),
    ("Climate Security Observatory", "Climate, conflict and food security nexus", "cso.cgiar.org"),
    ("CGSpace", "Open-access institutional repository for CGIAR outputs", "cgspace.cgiar.org"),
]

PLATFORMS_FLYER = [p for p in PLATFORMS_BRIEF if p[0] != "AgWise"]

# --- flyer samples -----------------------------------------------------------
# Not use-case data, so held here. Country, audience and length match the
# selections shown in the live samples.
FLYER_COUNTRY = "Kenya (sample selection)"
FLYER_AUDIENCE = "GCF proposal team (sample selection)"
FLYER_LENGTH = "2 pages"

FLYERS = [
    {"file": "flyer-sample-climate-risks.pdf", "topic": "Climate risks",
     "sections": ["Observed climate trends", "Projected changes",
                  "Exposure and sensitivity", "Priority risks for agriculture"]},
    {"file": "flyer-sample-adaptation-options.pdf", "topic": "Adaptation options",
     "sections": ["Options under consideration", "Evidence of effectiveness",
                  "Costs and feasibility", "Sequencing and prioritisation"]},
    {"file": "flyer-sample-food-security.pdf", "topic": "Food security",
     "sections": ["Production and availability", "Access and affordability",
                  "Stability under shocks", "Nutrition dimensions"]},
    {"file": "flyer-sample-water-stress.pdf", "topic": "Water stress",
     "sections": ["Water availability", "Demand and competition",
                  "Drought exposure", "Management options"]},
    {"file": "flyer-sample-gender-and-climate.pdf", "topic": "Gender and climate",
     "sections": ["Differentiated exposure", "Access to resources and services",
                  "Decision-making and voice", "Options that close gaps"]},
]


# --- reading the use-case records from assets/app.js -------------------------
def load_use_cases():
    """Read the useCases object out of assets/app.js.

    app.js is an IIFE, so the object cannot be imported. Rather than parse JS
    with regular expressions, which would break on the first apostrophe or
    nested brace, the object literal is located by brace matching and then
    evaluated by node, which is the only thing that reads JS correctly.
    """
    src = open(APP_JS, encoding="utf-8").read()
    marker = "const useCases = {"
    start = src.find(marker)
    if start == -1:
        sys.exit("Could not find 'const useCases = {' in assets/app.js. "
                 "If it has been renamed, update load_use_cases().")

    # Brace match from the opening { of the object literal.
    i = src.index("{", start + len(marker) - 1)
    depth = 0
    for j in range(i, len(src)):
        if src[j] == "{":
            depth += 1
        elif src[j] == "}":
            depth -= 1
            if depth == 0:
                literal = src[i:j + 1]
                break
    else:
        sys.exit("Unbalanced braces in the useCases object in assets/app.js.")

    # BRIEF is defined earlier in app.js and referenced inside the literal.
    brief_const = re.search(r"const BRIEF\s*=\s*'([^']*)'", src)
    brief_val = brief_const.group(1) if brief_const else "assets/briefs/"

    script = "const BRIEF = %s;\nconst useCases = %s;\nprocess.stdout.write(JSON.stringify(useCases));" % (
        json.dumps(brief_val), literal)
    try:
        out = subprocess.run(["node", "-e", script], capture_output=True, text=True, check=True)
    except FileNotFoundError:
        sys.exit("node is required to read assets/app.js but was not found on PATH.")
    except subprocess.CalledProcessError as e:
        sys.exit("node could not evaluate the useCases object:\n" + e.stderr)
    return json.loads(out.stdout)


def brief_targets(use_cases):
    """Every use case that links to a brief PDF, with the filename it expects.

    Derived from the data rather than listed here, so a new use case with a
    brief link gets a brief automatically and one without does not.
    """
    out = []
    for key, uc in use_cases.items():
        if key == "all":
            continue
        for link in uc.get("links", []):
            href = link.get("href", "")
            if href.startswith("assets/briefs/") and href.endswith(".pdf"):
                out.append((key, uc, os.path.basename(href)))
                break
    return out


def meta_value(uc, prefix):
    """Pull a labelled value out of a use case's meta badges, e.g. 'Champion: X'."""
    for m in uc.get("meta", []):
        label = m.get("label", "")
        if label.startswith(prefix):
            return label[len(prefix):].strip()
    return None


def status_of(uc):
    for m in uc.get("meta", []):
        if m.get("cls") == "st-active":
            return "Active development"
        if m.get("cls") == "st-idea":
            return "Idea"
    return None


# --- styles ------------------------------------------------------------------
def styles():
    s = {}
    s["title"] = ParagraphStyle("title", fontName=FONT_B, fontSize=20, leading=24,
                                textColor=BLUE_900, spaceAfter=2)
    s["subtitle"] = ParagraphStyle("subtitle", fontName=FONT, fontSize=10.5, leading=14,
                                   textColor=TEXT_3, spaceAfter=14)
    s["h2"] = ParagraphStyle("h2", fontName=FONT_B, fontSize=11.5, leading=15,
                             textColor=BLUE_800, spaceBefore=13, spaceAfter=5)
    s["body"] = ParagraphStyle("body", fontName=FONT, fontSize=9.5, leading=14.5,
                               textColor=TEXT_2, alignment=TA_LEFT, spaceAfter=6)
    s["caveat"] = ParagraphStyle("caveat", fontName=FONT, fontSize=8.5, leading=12.5,
                                 textColor=BLUE_900)
    s["bullet"] = ParagraphStyle("bullet", fontName=FONT, fontSize=9.5, leading=14,
                                 textColor=TEXT_2, leftIndent=12, bulletIndent=2,
                                 spaceAfter=2)
    s["metalabel"] = ParagraphStyle("metalabel", fontName=FONT_B, fontSize=8,
                                    leading=11, textColor=BLUE_800)
    s["metavalue"] = ParagraphStyle("metavalue", fontName=FONT, fontSize=9,
                                    leading=12.5, textColor=TEXT)
    s["th"] = ParagraphStyle("th", fontName=FONT_B, fontSize=8.5, leading=11.5,
                             textColor=WHITE)
    s["td"] = ParagraphStyle("td", fontName=FONT, fontSize=8.5, leading=11.5,
                             textColor=TEXT_2)
    return s


ST = styles()


# --- page furniture ----------------------------------------------------------
def make_page_decorator(doc_kind, footer_left):
    def decorate(canvas, doc):
        canvas.saveState()
        # Header bar
        canvas.setFillColor(BLUE_900)
        canvas.rect(0, PAGE_H - HEADER_H, PAGE_W, HEADER_H, stroke=0, fill=1)
        canvas.setFillColor(WHITE)
        canvas.setFont(FONT_B, 10)
        canvas.drawString(MARGIN, PAGE_H - HEADER_H + 12, HUB)
        canvas.setFont(FONT, 8.5)
        canvas.setFillColor(colors.HexColor("#D7E3F5"))  # --on-dark
        canvas.drawRightString(PAGE_W - MARGIN, PAGE_H - HEADER_H + 12.5, doc_kind)
        # Footer
        canvas.setStrokeColor(BORDER)
        canvas.setLineWidth(0.5)
        canvas.line(MARGIN, FOOTER_H + 10, PAGE_W - MARGIN, FOOTER_H + 10)
        canvas.setFillColor(TEXT_3)
        canvas.setFont(FONT, 7.5)
        canvas.drawString(MARGIN, FOOTER_H - 4, footer_left)
        canvas.drawRightString(PAGE_W - MARGIN, FOOTER_H - 4, "Page %d" % doc.page)
        canvas.restoreState()
    return decorate


def build(path, story, doc_kind, footer_left, title, subject):
    doc = BaseDocTemplate(
        path, pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=HEADER_H + 22, bottomMargin=FOOTER_H + 18,
        title=title, subject=subject, author="CGIAR Climate Hub",
        creator="tools/build-pdfs.py",
    )
    frame = Frame(MARGIN, FOOTER_H + 18, CONTENT_W,
                  PAGE_H - (HEADER_H + 22) - (FOOTER_H + 18), id="body",
                  leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id="std", frames=[frame],
                                       onPage=make_page_decorator(doc_kind, footer_left))])
    doc.build(story)


# --- shared flowables --------------------------------------------------------
def caveat_box(text):
    t = Table([[Paragraph(text, ST["caveat"])]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), CTA_LT),
        ("LINEBEFORE", (0, 0), (0, -1), 2.5, BLUE_800),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    return t


def meta_table(rows):
    label_w = 105
    data = [[Paragraph(k.upper(), ST["metalabel"]), Paragraph(v, ST["metavalue"])]
            for k, v in rows]
    t = Table(data, colWidths=[label_w, CONTENT_W - label_w])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), BLUE_100),
        ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    return t


def platform_table(platforms):
    widths = [150, 250, CONTENT_W - 400]
    data = [[Paragraph("Platform", ST["th"]), Paragraph("What it provides", ST["th"]),
             Paragraph("Address", ST["th"])]]
    for name, provides, address in platforms:
        data.append([Paragraph(name, ST["td"]), Paragraph(provides, ST["td"]),
                     Paragraph(address, ST["td"])])
    t = Table(data, colWidths=widths, repeatRows=1)
    style = [
        ("BACKGROUND", (0, 0), (-1, 0), BLUE_900),
        ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    for r in range(1, len(data)):
        if r % 2 == 0:
            style.append(("BACKGROUND", (0, r), (-1, r), BLUE_50))
    t.setStyle(TableStyle(style))
    return t


def heading(text):
    return Paragraph(text, ST["h2"])


def body(text):
    return Paragraph(text, ST["body"])


# --- the use-case brief ------------------------------------------------------
def build_brief(uc, out_path):
    name = uc["name"]
    status = status_of(uc)
    champion = meta_value(uc, "Champion:")
    programme = uc.get("sub")

    meta_rows = []
    if status:
        meta_rows.append(("Status", status))
    if champion:
        meta_rows.append(("Champion", champion))
    if programme:
        meta_rows.append(("Programme", programme))

    story = [
        Paragraph(name, ST["title"]),
        Paragraph(uc["title"], ST["subtitle"]),
    ]
    if meta_rows:
        story += [meta_table(meta_rows), Spacer(1, 12)]
    story += [
        caveat_box(BRIEF_CAVEAT),
        Spacer(1, 4),
        heading("About this use case"),
        body(uc["desc"]),
    ]

    tags = uc.get("tags") or []
    if tags:
        story.append(heading("Focus areas"))
        for tag in tags:
            story.append(Paragraph(tag, ST["bullet"], bulletText="•"))

    story += [
        heading("How the %s supports this use case" % HUB.replace("CGIAR ", "")),
        body(BRIEF_SUPPORT),
        heading("Curated platforms available through the Hub"),
        platform_table(PLATFORMS_BRIEF),
        heading("Status and next steps"),
        body(BRIEF_STATUS_IDEA if status == "Idea" else BRIEF_STATUS_ACTIVE),
        heading("Feedback"),
        body(BRIEF_FEEDBACK),
    ]

    build(out_path, story,
          doc_kind="Use case brief",
          footer_left="Sample brief, v0.2 prototype. Draft content for review, "
                      "not for external circulation.",
          title="%s: %s use case brief" % (name, HUB),
          subject="Sample use-case brief generated from the %s use-case portfolio." % HUB)


# --- the flyer sample --------------------------------------------------------
def build_flyer(flyer, out_path):
    topic = flyer["topic"]
    story = [
        Paragraph("Country brief: %s" % topic, ST["title"]),
        Paragraph("Generated by the %s Flyer Builder" % HUB, ST["subtitle"]),
        meta_table([
            ("Country", FLYER_COUNTRY),
            ("Audience", FLYER_AUDIENCE),
            ("Topic focus", topic),
            ("Length", FLYER_LENGTH),
        ]),
        Spacer(1, 12),
        caveat_box(FLYER_CAVEAT),
        Spacer(1, 4),
    ]
    for section in flyer["sections"]:
        story.append(KeepTogether([heading(section), body(FLYER_SECTION_BODY)]))

    story += [
        heading("Sources this brief would draw on"),
        body(FLYER_SOURCES_INTRO),
        platform_table(PLATFORMS_FLYER),
        heading("How to use a brief like this"),
    ]
    for item in FLYER_HOWTO:
        story.append(Paragraph(item, ST["bullet"], bulletText="•"))
    story += [heading("Feedback"), body(FLYER_FEEDBACK)]

    build(out_path, story,
          doc_kind="Sample country brief",
          footer_left="Sample output, v0.2 prototype. Placeholder narrative, "
                      "not for citation.",
          title="Country brief: %s (%s Flyer Builder sample)" % (topic, HUB),
          subject="Sample Flyer Builder output. Placeholder narrative, not for citation.")


# --- main --------------------------------------------------------------------
def main():
    check_only = "--check" in sys.argv
    use_cases = load_use_cases()
    targets = brief_targets(use_cases)

    if not targets:
        sys.exit("No use case in assets/app.js links to a brief PDF. Nothing to build.")

    print("Use-case briefs (%d), from assets/app.js:" % len(targets))
    written = 0
    for key, uc, filename in sorted(targets, key=lambda t: t[2]):
        path = os.path.join(BRIEF_DIR, filename)
        existed = os.path.exists(path)
        print("  %-52s %-8s %s" % (filename, key,
                                   "" if existed else "(new file)"))
        if not check_only:
            build_brief(uc, path)
            written += 1

    print("Flyer samples (%d), from FLYERS in this script:" % len(FLYERS))
    for flyer in FLYERS:
        path = os.path.join(FLYER_DIR, flyer["file"])
        print("  %-52s %s" % (flyer["file"],
                              "" if os.path.exists(path) else "(new file)"))
        if not check_only:
            build_flyer(flyer, path)
            written += 1

    # Any brief PDF on disk that no use case links to is now orphaned. Report,
    # do not delete: the site may still link it from somewhere else.
    expected = {f for _, _, f in targets}
    if os.path.isdir(BRIEF_DIR):
        orphans = sorted(f for f in os.listdir(BRIEF_DIR)
                         if f.endswith(".pdf") and f not in expected)
        if orphans:
            print("\nOrphaned brief PDFs, not linked from any use case in app.js:")
            for f in orphans:
                print("  %s" % f)
            print("  Left in place. Delete by hand if they really are unused.")

    if check_only:
        print("\n--check: nothing written.")
    else:
        print("\nWrote %d PDFs." % written)


if __name__ == "__main__":
    main()
