# DXP AI EDS — Prompts Library

Reusable prompts for common development tasks on the `dxp-ai-ue-eds` project.
Copy the relevant prompt, fill in `[PLACEHOLDERS]`, and paste directly into Claude Code.

Each prompt is self-contained — it pre-loads all required context so Claude does not need
to explore the codebase, keeping token usage low.

---

## Quick Index

| # | Task | When to use |
|---|---|---|
| [P-01](#p-01--new-block-from-html-kit) | New block from html-kit | Copy existing html-kit component → EDS block |
| [P-02](#p-02--new-block-from-description) | New block from description | Design a new block from scratch |
| [P-03](#p-03--fix-block-not-matching-html-kit) | Fix block — html-kit mismatch | Block renders wrong, compare against html-kit |
| [P-04](#p-04--fix-css-dark-theme-issue) | Fix CSS dark theme | Block has wrong colors/fonts/layout |
| [P-05](#p-05--add--update-ue-model-fields) | Add/update UE model fields | Add editable fields to a block |
| [P-06](#p-06--rewrite-block-js-cell-mapping) | Rewrite block JS cell mapping | Block JS doesn't map AEM fields correctly |
| [P-07](#p-07--direct-render-block-rewrite) | Direct-render block rewrite | Complex block — bypass AEM data, render HTML directly |
| [P-08](#p-08--debug-block-not-loading) | Debug block not loading | Block shows empty or throws errors |
| [P-09](#p-09--aem-content-package-for-block-data) | AEM content package | Create/update AEM content for a block |
| [P-10](#p-10--responsive-layout-fix) | Responsive layout fix | Block looks wrong on mobile or tablet |

---

## Stack Context (paste at top of any prompt if needed)

```
PROJECT: dxp-ai-ue-eds — AEM + Universal Editor + Edge Delivery Services (XWalk pattern)
REPO: C:\Satish_Sapate_Data\AEM_Local\AEM_UE_EDS_Project\dxp-ai-ue-eds
GITHUB: satishsapate/dxp-ai-ue-eds  |  EDS: https://main--dxp-ai-ue-eds--satishsapate.aem.page
DESIGN REF: html-kit/dxp-ai/index.html (and pages/*.html)
DOCS: docs/aem-dev/README.md

RULES:
- JS: pure ES modules, no frameworks, default export decorate(block), import with .js extension
- CSS: always var(--token), .blockname prefix, mobile-first, single breakpoint @media (width >= 900px), no !important
- JSON: edit blocks/*/_blockname.json then run npm run build:json
- moveInstrumentation(from, to) when replacing EDS-generated DOM elements
```

---

## P-01 — New Block from html-kit

**Use when:** A component exists in `html-kit/dxp-ai/` and you need to create the full EDS block.

```
Create a new EDS block called [BLOCKNAME] for the dxp-ai-ue-eds project.

DESIGN REFERENCE — read this file first:
  html-kit/dxp-ai/index.html  (or pages/[PAGE].html)
  Look for the section with class "[HTML_KIT_CLASS]" (around line [LINE_NUMBER])

FILES TO CREATE:
  blocks/[BLOCKNAME]/[BLOCKNAME].js
  blocks/[BLOCKNAME]/[BLOCKNAME].css
  blocks/[BLOCKNAME]/[BLOCKNAME].html
  blocks/[BLOCKNAME]/_[BLOCKNAME].json

APPROACH: [choose one]
  OPTION A — DATA-DRIVEN: Content comes from AEM (typical for cards, stats, text blocks).
    Map EDS row/cell structure → semantic HTML. Max 4 cells per row (XWalk limit).
  OPTION B — DIRECT RENDER: Structure is fixed, can't come from plain AEM text fields.
    Set block.textContent = '' then block.innerHTML = `...complete HTML...`

AEM MODEL FIELDS (for _[BLOCKNAME].json):
  [list fields: name | component type | label]
  Example:
    heading    | text      | Heading
    body       | richtext  | Body Copy
    ctaText    | text      | Button Text
    ctaUrl     | aem-content | Button Link

CSS REQUIREMENTS:
  - Dark DXP AI theme (dark navy page, glass cards)
  - Key tokens: --background-color:#0d0e2a  --c-purple:#7c3aed  --c-cyan:#06b6d4
    --c-off-white:#f0f2ff  --gradient-dxp:linear-gradient(135deg,#2563eb,#7c3aed,#9333ea)
    --heading-font-family:'Sora'  --body-font-family:'DM Sans'  --nav-height:72px
    --radius-lg:20px  --shadow-glow:0 0 40px rgba(124,58,237,0.35)
  - Glass card pattern: background:rgba(255,255,255,0.04); border:1px solid rgba(124,58,237,0.18); border-radius:var(--radius-lg)
  - Gradient text: background:var(--gradient-dxp); -webkit-background-clip:text; -webkit-text-fill-color:transparent
  - Overline: color:var(--c-purple); text-transform:uppercase; letter-spacing:0.16em; font-weight:700
  - Bullet dots: content:''; width:6px; height:6px; border-radius:50%; background:var(--c-cyan)
  - Section padding: 100px 0
  - Max-width: 1280px with margin:auto padding:0 24px (desktop: 0 32px)

AFTER CREATING FILES:
  Run: npm run build:json
  Then lint: npm run lint

Match the html-kit design as closely as possible. Produce all 4 files.
```

---

## P-02 — New Block from Description

**Use when:** No html-kit prototype exists — you need to design and build from a description.

```
Create a new EDS block called [BLOCKNAME] for the dxp-ai-ue-eds project.

PURPOSE: [describe what the block does — e.g., "displays team members in a 3-column grid with photo, name, role, and LinkedIn link"]

VISUAL STYLE: DXP AI dark navy theme
  - Background: rgba(255,255,255,0.04) glass card on #0d0e2a page
  - Primary: #7c3aed (purple), Accent: #06b6d4 (cyan)
  - Headings: 'Sora' font, body: 'DM Sans'
  - Cards: border:1px solid rgba(124,58,237,0.18); border-radius:20px
  - Section overline (uppercase purple label above h2)
  - Responsive: [COLUMNS] columns desktop → 2 col tablet → 1 col mobile

AEM CONTENT MODEL — fields per [block/item]:
  [list: fieldName | type | description]

LAYOUT PATTERN: [choose]
  SINGLE BLOCK (all fields in one row): hero, cta, richtext style
  REPEATING ITEMS (parent + child items): cards, carousel, features style
    If repeating: define both parent block + child item in _[BLOCKNAME].json

FILES TO CREATE:
  blocks/[BLOCKNAME]/[BLOCKNAME].js    — decorate(block) with moveInstrumentation
  blocks/[BLOCKNAME]/[BLOCKNAME].css   — scoped .blockname styles, :root token overrides
  blocks/[BLOCKNAME]/[BLOCKNAME].html  — UE authoring template with data-field attributes
  blocks/[BLOCKNAME]/_[BLOCKNAME].json — definitions, models, filters

CONSTRAINTS:
  - Max 4 cells per block/item row (xwalk/max-cells lint rule)
  - Group multiple fields with richtext if more than 4 fields needed
  - No console.log, no var, no frameworks
  - Run npm run build:json after creating JSON

Create all 4 files now.
```

---

## P-03 — Fix Block Not Matching html-kit

**Use when:** A block is live but doesn't match the html-kit design reference.

```
Fix the [BLOCKNAME] block in blocks/[BLOCKNAME]/ to match the html-kit design.

STEP 1 — Read these files:
  html-kit/dxp-ai/index.html        line [START]-[END]  (the target design)
  blocks/[BLOCKNAME]/[BLOCKNAME].js  (current JS)
  blocks/[BLOCKNAME]/[BLOCKNAME].css (current CSS)

STEP 2 — Identify the gap:
  The html-kit uses these CSS classes: [LIST KEY CLASSES from html-kit e.g., .feature-card, .fc-icon, .fc-list]
  The current block outputs: [DESCRIBE WHAT IT CURRENTLY RENDERS - e.g., "just divs with no classes"]

KNOWN PATTERNS TO APPLY:
  - EDS row/cell structure: block > div(row) > div(cell) — map cells[0..n] to semantic HTML
  - moveInstrumentation(row, newEl) when replacing rows
  - Glass card: background:rgba(255,255,255,0.04); border:1px solid rgba(124,58,237,0.18); border-radius:var(--radius-lg)
  - Bullet list (.fc-list or .card-points):
      list-style:none; ::before { content:''; background:var(--c-cyan); border-radius:50%; width:6px; height:6px }
  - Section heading pattern: div.section-heading > span.overline + h2 + p
  - CTA link (.fc-link, .card-cta): color:#a78bfa; font-weight:700; margin-top:auto

SPECIFIC ISSUES TO FIX: [describe what's wrong]
  Example:
  - [ ] Cards have white background — need dark glass style
  - [ ] Icon not rendering — cells[0] is emoji/SVG, needs div.fc-icon wrapper
  - [ ] No bullet list — cells[2] has richtext with UL, needs .fc-list class + cyan ::before dots
  - [ ] Link arrow missing — cells[3] link needs .fc-link class

Fix [BLOCKNAME].js and [BLOCKNAME].css. Run npm run lint after.
```

---

## P-04 — Fix CSS Dark Theme Issue

**Use when:** A block has wrong colors, fonts, backgrounds, or layout on the dark DXP AI page.

```
Fix the CSS for blocks/[BLOCKNAME]/[BLOCKNAME].css.

PROBLEMS: [describe what looks wrong]
  Example:
  - White/light background clashing with #0d0e2a page
  - Wrong font (should be 'DM Sans' body / 'Sora' headings)
  - Hardcoded colors that should use CSS variables
  - Missing hover effects on cards

DXP AI CSS RULES — apply these corrections:

1. BACKGROUNDS (never white/light on dark pages):
   Page bg:    transparent or rgba(255,255,255,0.02-0.06)
   Cards:      rgba(255,255,255,0.04) with border:1px solid rgba(124,58,237,0.15-0.2)
   Elevated:   var(--c-dark-blue) = #1a1b4b
   Deep dark:  var(--dark-color) = #080a1e

2. TEXT COLORS:
   Headings:   var(--c-off-white) = #f0f2ff
   Body:       rgba(255,255,255,0.65-0.72)
   Muted:      rgba(255,255,255,0.45-0.55)
   Links:      var(--c-purple) = #7c3aed  or  #a78bfa (softer)
   Labels:     var(--c-cyan) = #06b6d4

3. BORDERS:
   Subtle:     rgba(124,58,237,0.12-0.18)
   Visible:    rgba(124,58,237,0.25-0.35)
   Hover:      rgba(124,58,237,0.35-0.5)

4. GRADIENT TEXT pattern (for stat values, headings):
   background: linear-gradient(135deg,#7c3aed,#06b6d4);
   background-clip:text; -webkit-text-fill-color:transparent;

5. FONTS — replace any hardcoded font with:
   --body-font-family:    'DM Sans'
   --heading-font-family: 'Sora'

6. WRONG TOKEN NAMES — use only these (from styles/styles.css):
   ✅ var(--c-purple)  var(--c-cyan)  var(--c-navy)  var(--c-off-white)
   ✅ var(--gradient-dxp)  var(--radius-lg)  var(--shadow-glow)
   ❌ var(--color-purple)  var(--primary)  var(--accent)  [these don't exist]

Rewrite [BLOCKNAME].css fixing the above. Keep all structural/layout rules unchanged.
Only fix color/font/background values. Run npm run lint:css after.
```

---

## P-05 — Add / Update UE Model Fields

**Use when:** You need to add, rename, or restructure editable fields in Universal Editor for a block.

```
Update the UE component model for the [BLOCKNAME] block.

FILE TO EDIT: blocks/[BLOCKNAME]/_[BLOCKNAME].json

CURRENT MODEL (read the file first to confirm):
  blocks/[BLOCKNAME]/_[BLOCKNAME].json

REQUIRED CHANGES:
  [describe changes — examples:]
  ADD field: name=[fieldName] | type=[text/richtext/reference/aem-content/select/boolean] | label=[Label]
  REMOVE field: [fieldName]
  RENAME: [oldName] → [newName]
  ADD select options to [fieldName]: [{name:"Label", value:"val"}, ...]

FIELD TYPE REFERENCE:
  "text"        → single-line text input  (valueType:"string")
  "richtext"    → WYSIWYG HTML editor
  "reference"   → DAM image/video picker (add "multi":false)
  "aem-content" → AEM page/link picker
  "select"      → dropdown (requires "options":[{name,value}])
  "multiselect" → multi-checkbox (requires "options")
  "boolean"     → toggle switch  (valueType:"boolean")
  "number"      → number input   (valueType:"number")

XWALK CONSTRAINT: Max 4 fields per model (xwalk/max-cells rule).
  If more than 4 fields needed, combine related text into a richtext field.

TEMPLATE DEFAULTS: Update the "template" object in definitions[] to include
  default values for any new fields.

After editing _[BLOCKNAME].json, run: npm run build:json
Then verify component-models.json was updated correctly.
Also update [BLOCKNAME].js cell mapping if field order changed.
```

---

## P-06 — Rewrite Block JS Cell Mapping

**Use when:** Block JS doesn't correctly map AEM model fields to the right HTML elements.

```
Rewrite blocks/[BLOCKNAME]/[BLOCKNAME].js to correctly map AEM fields to HTML.

READ FIRST:
  blocks/[BLOCKNAME]/_[BLOCKNAME].json   (to see model field order)
  blocks/[BLOCKNAME]/[BLOCKNAME].js      (current broken JS)

EDS CELL MAPPING RULE:
  AEM model fields are delivered as:
    block > div(row) > div(cell[0]) div(cell[1]) div(cell[2]) ...
  Field order in the model = cell index in the row.

TARGET FIELD MAPPING (from _[BLOCKNAME].json model):
  cells[0] = [fieldName] ([type]) → render as [HTML element + class]
  cells[1] = [fieldName] ([type]) → render as [HTML element + class]
  cells[2] = [fieldName] ([type]) → render as [HTML element + class]
  [etc.]

HTML STRUCTURE TO PRODUCE (match html-kit):
  [paste the target HTML from html-kit/dxp-ai/index.html]

PATTERN TO USE:
```js
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  // [optional: detect heading row — single cell before card rows]
  rows.forEach((row) => {
    const cells = [...row.children];
    const card = document.createElement('article');
    card.className = '[CARD_CLASS]';
    moveInstrumentation(row, card);

    if (cells[0]) { /* map to icon/tag/heading */ }
    if (cells[1]) { /* map to title h3 */ }
    if (cells[2]) { /* map to description p */ }
    if (cells[3]) { /* map to link */ }

    row.remove();
    // append card to grid/fragment
  });
  block.replaceChildren(/* grid */);
}
```

SPECIAL HANDLING:
  richtext field → use cell.innerHTML (not textContent)
  aem-content field → cells[n].querySelector('a') gives the link element
  reference field → cells[n].querySelector('img') or 'picture'
  text field → cells[n].textContent.trim()

Rewrite [BLOCKNAME].js. Run npm run lint after.
```

---

## P-07 — Direct-Render Block Rewrite

**Use when:** A block has complex fixed structure (nav, footer, hero) that cannot be data-driven from AEM text fields.

```
Rewrite blocks/[BLOCKNAME]/[BLOCKNAME].js to render HTML directly.

READ DESIGN REFERENCE:
  html-kit/dxp-ai/index.html  lines [START]-[END]
  (copy the exact HTML structure from there)

READ CURRENT FILES:
  blocks/[BLOCKNAME]/[BLOCKNAME].js
  blocks/[BLOCKNAME]/[BLOCKNAME].css

PATTERN — direct render:
```js
export default function decorate(block) {
  block.textContent = ''; // clear EDS placeholder content

  const wrapper = document.createElement('div');
  wrapper.className = '[WRAPPER_CLASS]';

  wrapper.innerHTML = `
    [FULL HTML FROM HTML-KIT — paste it here]
  `;

  // Wire up JS interactions (event listeners, scroll effects, etc.)
  // [describe what interactions are needed]

  block.append(wrapper);
}
```

JS INTERACTIONS NEEDED:
  [list what JS behaviour is required — examples:]
  - Hamburger toggle (mobile menu open/close)
  - Dropdown hover on desktop (mouseenter/mouseleave on .nav-drop)
  - Keyboard: Enter/Space to open dropdown, Escape to close
  - Scroll effect: add .scrolled class to wrapper after window.scrollY > 20px
  - Carousel: track.style.transform = translateX, dot active states

CSS CHANGES NEEDED:
  [list any CSS class names that differ between html-kit and the EDS block]
  The CSS already exists at blocks/[BLOCKNAME]/[BLOCKNAME].css — [update/keep/rewrite]

BREAKPOINT: isDesktop = window.matchMedia('(min-width: 900px)')
  Use this to gate desktop-only behaviours (don't fire dropdowns on mobile, etc.)

Produce the rewritten [BLOCKNAME].js. Run npm run lint after.
```

---

## P-08 — Debug Block Not Loading

**Use when:** A block renders empty, throws a JS error, or doesn't appear on the EDS page.

```
Debug why the [BLOCKNAME] block is not rendering correctly on the EDS page.

SYMPTOMS: [describe what's happening]
  Example:
  - Block wrapper exists in DOM but is empty
  - JS console error: [paste error message]
  - CSS not loading (block looks unstyled)
  - Block partially renders (some rows missing)

READ THESE FILES:
  blocks/[BLOCKNAME]/[BLOCKNAME].js
  blocks/[BLOCKNAME]/[BLOCKNAME].css
  blocks/[BLOCKNAME]/_[BLOCKNAME].json

CHECK LIST — work through these in order:

1. JS export: Does [BLOCKNAME].js export `export default function decorate(block)`?
   (named exports or missing default = block won't load)

2. CSS class selector: Does [BLOCKNAME].css use `.blockname` prefix not `.blockname-block`?
   EDS adds class = folder name, not block-[name].

3. Cell count: Does the JS try to access cells[4]+ when model only has 4 fields?
   (xwalk/max-cells allows max 4 per row)

4. moveInstrumentation: Are EDS-generated rows being removed before appending new elements?
   If `row.remove()` is missing, old divs stay in DOM causing duplication.

5. richtext field: Is `cell.innerHTML` used (not `textContent`) for richtext fields?
   textContent strips HTML tags from richtext.

6. aem-content field: Does the JS use `cell.querySelector('a')?.href` for link fields?
   The cell contains an `<a>` tag, not plain text.

7. Build check: After any _[BLOCKNAME].json change, was `npm run build:json` run?
   Stale component-models.json can cause UE to send wrong field order.

Diagnose the issue and provide the specific fix. Show the exact lines to change.
```

---

## P-09 — AEM Content Package for Block Data

**Use when:** You need to create or update AEM JCR content to populate a block's fields.

```
Create an AEM FileVault content package to set the [BLOCKNAME] block content on page [PAGE_PATH].

AEM INSTANCE: http://localhost:4502 (admin/admin) or
              https://author-p24056-e1593080.adobeaemcloud.com

PAGE PATH IN AEM: /content/my-dxp-site/[PAGE_PATH]
BLOCK PATH:       /content/my-dxp-site/[PAGE_PATH]/jcr:content/root/[SECTION]/[BLOCKNAME]

CONTENT TO SET (from _[BLOCKNAME].json model):
  [fieldName1]: "[value1]"
  [fieldName2]: "[value2 — can be HTML for richtext fields]"
  [fieldName3]: "[value3]"

PACKAGE STRUCTURE needed:
  META-INF/vault/filter.xml    (filter to just the block path)
  META-INF/vault/properties.xml
  jcr_root/content/my-dxp-site/[...path...]/.content.xml

.content.xml format (JCR node with field values):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0"
          xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    jcr:primaryType="nt:unstructured"
    sling:resourceType="core/franklin/components/block/v1/block"
    name="[BLOCKNAME]"
    [field1]="[value1]"
    [field2]="[value2]"/>
```

If the block has REPEATING ITEMS (e.g., carousel-items, feature cards):
  Each item is a child node: [item-name]/.content.xml with its own fields.

CREATE the package ZIP at: [OUTPUT_PATH]/[blockname]-content.zip
INSTALL via: http://localhost:4502/crx/packmgr

After installing, use AEM Sidekick to Preview the page so EDS picks up the new content.
```

---

## P-10 — Responsive Layout Fix

**Use when:** A block looks wrong on mobile (< 900px) or needs a layout adjustment at a specific breakpoint.

```
Fix the responsive layout for blocks/[BLOCKNAME]/[BLOCKNAME].css.

CURRENT PROBLEM: [describe the issue]
  Example:
  - 3-column grid overflows on mobile (needs to stack to 1 column)
  - Text is too large on mobile
  - Padding too much on small screens
  - Hamburger menu not hiding on desktop

BREAKPOINT RULE for this project: single breakpoint only
  Mobile (default): < 900px
  Desktop:          @media (width >= 900px)
  Tablet:           @media (width <= 1024px) [use only if needed for grid changes]

COMMON FIXES:

Grid columns:
```css
.blockname .cards-grid {
  grid-template-columns: 1fr;        /* mobile: stack */
}
@media (width >= 900px) {
  .blockname .cards-grid {
    grid-template-columns: repeat(3, 1fr);  /* desktop: 3 col */
  }
}
@media (width <= 1024px) {
  .blockname .cards-grid {
    grid-template-columns: repeat(2, 1fr);  /* tablet: 2 col */
  }
}
```

Show/hide elements:
```css
.blockname .desktop-only { display: none; }
@media (width >= 900px) { .blockname .desktop-only { display: flex; } }

.blockname .mobile-only { display: flex; }
@media (width >= 900px) { .blockname .mobile-only { display: none; } }
```

Font scaling (use clamp for fluid type):
```css
.blockname h2 {
  font-size: clamp(1.8rem, 3vw, 2.8rem);  /* fluid between breakpoints */
}
```

Section padding (reduce on mobile):
```css
.blockname { padding: 60px 0; }
@media (width >= 900px) { .blockname { padding: 100px 0; } }
```

READ blocks/[BLOCKNAME]/[BLOCKNAME].css and apply the specific fixes needed.
Do NOT add !important. Do NOT change desktop styles — only add/fix mobile styles.
```

---

## Compound Prompts — Multi-step Workflows

### C-01: New Page + All Blocks

```
I need to add a new page [PAGE_NAME] to the dxp-ai-ue-eds project that matches
html-kit/dxp-ai/pages/[PAGE_FILE].html.

STEP 1: Read html-kit/dxp-ai/pages/[PAGE_FILE].html to identify all sections/blocks.
STEP 2: For each block NOT yet in blocks/:
  - Create the 4 files using the html-kit HTML as reference
STEP 3: For blocks that exist but need CSS updates:
  - Update the CSS to handle any page-specific variants
STEP 4: Run npm run build:json and npm run lint

List all blocks found on the page before starting work.
Use DXP AI dark theme CSS throughout (tokens from styles/styles.css).
```

### C-02: Block Audit — All Blocks vs html-kit

```
Audit all EDS blocks against the html-kit design reference.

READ: html-kit/dxp-ai/index.html (full file)
THEN: For each block section found in html-kit, check blocks/[blockname]/[blockname].js
and blocks/[blockname]/[blockname].css.

Report a table:
  Block | html-kit class | EDS class match? | JS renders correctly? | CSS gap?

Focus on blocks used on the index page:
  hero, stats-band, features, carousel, cms-compat, who-uses, articles, richtext, cta

For each gap found, describe the specific fix needed (don't fix yet — just audit).
```

---

## CSS Token Cheat Sheet (inline reference)

Paste this into any CSS prompt as a quick token reference:

```css
/* === DXP AI CSS TOKENS — styles/styles.css === */

/* Colors */
--background-color: #0d0e2a    /* navy page bg */
--light-color:      #1a1b4b    /* elevated surface */
--dark-color:       #080a1e    /* deep bg */
--text-color:       #f0f2ff    /* body text */
--link-color:       #7c3aed    /* purple link */
--c-navy:           #0d0e2a
--c-dark-blue:      #1a1b4b
--c-purple:         #7c3aed    /* primary brand */
--c-violet:         #9333ea
--c-cyan:           #06b6d4    /* accent */
--c-white:          #ffffff
--c-off-white:      #f0f2ff    /* headings */
--c-mid-gray:       #6b7aab
--gradient-dxp:     linear-gradient(135deg,#2563eb 0%,#7c3aed 50%,#9333ea 100%)
--gradient-hero:    linear-gradient(135deg,#0d0e2a 0%,#1a1b4b 40%,#2d1b69 100%)

/* Fonts */
--body-font-family:    'DM Sans', dm-sans-fallback, sans-serif
--heading-font-family: 'Sora', sora-fallback, sans-serif

/* Sizes */
--body-font-size-m:        18px
--body-font-size-s:        16px
--body-font-size-xs:       14px
--heading-font-size-xxl:   56px (desktop) / 48px (mobile)
--heading-font-size-xl:    44px / 38px
--heading-font-size-l:     34px / 30px
--heading-font-size-m:     28px / 24px
--heading-font-size-s:     22px / 20px
--heading-font-size-xs:    18px

/* Layout */
--nav-height:  72px
/* max-width: 1280px, padding: 0 24px (mobile) / 0 32px (desktop) */

/* Shape */
--radius-sm:     8px
--radius-md:     14px
--radius-lg:     20px      /* cards */
--radius-xl:     28px
--shadow-md:     0 4px 20px rgba(13,14,42,0.4)
--shadow-lg:     0 12px 40px rgba(13,14,42,0.5)
--shadow-glow:   0 0 40px rgba(124,58,237,0.35)
```

---

## JS Pattern Cheat Sheet

Paste this as reference context in any JS prompt:

```js
// === DXP AI EDS BLOCK PATTERNS ===

// Import (always include .js)
import { moveInstrumentation } from '../../scripts/scripts.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

// Standard data-driven pattern
export default function decorate(block) {
  const rows = [...block.children];
  const fragment = document.createDocumentFragment();

  // Optional: detect single-cell heading row
  let headingRow = null;
  const itemRows = [];
  rows.forEach((row) => {
    if ([...row.children].length === 1 && !itemRows.length) headingRow = row;
    else itemRows.push(row);
  });

  if (headingRow) {
    const hd = document.createElement('div');
    hd.className = 'section-heading';
    moveInstrumentation(headingRow, hd);
    [...headingRow.children].forEach((c) => hd.append(c));
    headingRow.remove();
    fragment.append(hd);
  }

  const grid = document.createElement('div');
  grid.className = 'cards-grid';
  itemRows.forEach((row) => {
    const cells = [...row.children];
    const card = document.createElement('article');
    card.className = 'feature-card';
    moveInstrumentation(row, card);
    // Map cells to card content
    row.remove();
    grid.append(card);
  });

  fragment.append(grid);
  block.replaceChildren(fragment);
}

// Direct-render pattern
export default function decorate(block) {
  block.textContent = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'my-wrapper';
  wrapper.innerHTML = `<div class="my-inner">...</div>`;
  // add event listeners
  block.append(wrapper);
}

// Cell extraction helpers
const text   = (cell) => cell?.textContent.trim() ?? '';
const html   = (cell) => cell?.innerHTML ?? '';
const link   = (cell) => cell?.querySelector('a') ?? null;
const img    = (cell) => cell?.querySelector('img, picture') ?? null;
```

---

*Maintained in `docs/aem-dev/10-prompts-library.md` — update when new patterns are established.*
