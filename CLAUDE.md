# CLAUDE.md — DXP AI UE EDS Project

This file is automatically read by Claude Code. It provides complete context for this AEM + Universal Editor + Edge Delivery Services headless DXP project.

Full documentation is in [`docs/aem-dev/`](./docs/aem-dev/README.md).

---

## Project Identity

- **Project:** `dxp-ai-ue-eds` — Headless DXP website (AI-first brand)
- **Boilerplate:** [aem-boilerplate-xwalk](https://github.com/adobe-rnd/aem-boilerplate-xwalk)
- **Stack:** AEM Cloud Service + Universal Editor (authoring) + Edge Delivery Services (rendering)
- **Pattern:** XWalk — UE authors to JCR, EDS delivers to browser, block JS decorates
- **Node.js:** >= 18.3 | **AEM Cloud:** >= 2024.8

---

## Repository Layout

```
blocks/          # 25 EDS block components — each is self-contained
models/          # Universal Editor component model SOURCE files (_*.json)
scripts/         # aem.js (EDS core), scripts.js (loading), editor-support.js
styles/          # styles.css (design tokens), fonts.css, lazy-styles.css
html-kit/dxp-ai/ # Static HTML + SCSS prototype kit (design reference only)
tools/sidekick/  # AEM Sidekick config

# BUILT files — never edit directly, run `npm run build:json` to regenerate
component-definition.json
component-models.json
component-filters.json

# Config
fstab.yaml       # AEM mount points for EDS
paths.json       # AEM Sync file mappings
head.html        # Global <head> template
package.json     # npm scripts and dependencies
.env             # AEM_HOST=http://localhost:4502 (gitignored, create manually)
```

---

## npm Scripts

```bash
npm run start                # HTML kit dev server at http://localhost:3000
npm run build:json           # Rebuild all 3 component JSON configs
npm run build:json:models    # Rebuild component-models.json only
npm run build:json:definitions  # Rebuild component-definition.json only
npm run build:json:filters   # Rebuild component-filters.json only
npm run lint                 # ESLint + Stylelint check
npm run lint:fix             # Auto-fix linting issues
npm run validate             # Custom project validation
```

---

## Communication Rules

### Always surface manual steps
At the end of every task, explicitly list any steps the user must perform manually — things Claude cannot do autonomously. Format them as a numbered checklist so nothing is missed. Common manual steps in this project include:

- Installing the AEM package via `/crx/packmgr` after `create-aem-package.ps1` generates the ZIP
- Running `aem up` / starting the local AEM instance if it is not already running
- Logging into AEM Author (`http://localhost:4502`) to verify content or publish pages
- Flushing the Dispatcher or CDN cache after deploying changes
- Previewing/publishing pages via the Sidekick extension after content edits
- Committing and pushing the built JSON files after `npm run build:json`

Even if a step seems obvious, call it out — the user may be context-switching and will rely on this checklist.

---

## Critical Rules

### JavaScript
- **No frameworks** — pure ES modules, no React/Vue/Angular/jQuery
- Every block exports `default function decorate(block)` — no named exports
- Import `.js` extension always: `import { fn } from '../../scripts/aem.js'`
- Use `const`/`let`, never `var`
- No `console.log` in production code

### CSS
- **Never hardcode colors or fonts** — always `var(--color-text)`, `var(--heading-font-family)`, etc.
- **Always scope** block styles with `.blockname` prefix — **CRITICAL:** the EDS block element gets class `blockname` (the folder name), **NOT** `blockname-block`. The selector `.cta` is correct; `.cta-block` never matches anything.
- **Mobile-first**, single breakpoint: `@media (width >= 900px)`
- No `!important`
- **Modern color syntax only** — use `rgb(x y z / a%)` not `rgba(x, y, z, a)`. Stylelint enforces this. Run `npm run lint:css -- --fix` to auto-convert.
- **No deprecated properties** — `clip: rect(0,0,0,0)` is deprecated; use `clip-path: inset(50%)` for visually-hidden patterns.
- **Keyframe declarations must be multi-line** — `@keyframes` steps with multiple properties must each be on their own line (Stylelint `declaration-block-single-line-max-declarations`).
- **CSS selector order matters** — lower-specificity selectors targeting the same elements must come *before* higher-specificity ones (`no-descending-specificity`). If a mobile-menu `a` rule appears after a `.nav-item > a:hover` rule, move it earlier.

### XWalk ESLint Rules (eslint-plugin-xwalk)

These rules enforce the AEM content model constraints and catch real authoring bugs early.

#### `xwalk/no-orphan-collapsible-fields`
Fields whose name ends with `Text`, `Title`, `Type`, `Alt`, or `MimeType` are **collapsible** — they must have a corresponding base field with the same prefix. Without the base field, UE will have an orphan panel entry and lint will error.

| Field name | Requires | Fix if no base field |
|---|---|---|
| `linkText` | `link` must also exist | OK — `link` is the `aem-content` base |
| `imageAlt` | `image` must also exist | OK — `image` is the `reference` base |
| `ctaText` | `cta` base field needed | Rename to `ctaBtn` or `ctaLabel` |
| `primaryText` | `primary` base field needed | Rename to `primaryBtn` |
| `badgeText` | `badge` base field needed | Rename to `badge` (drop `Text` suffix) |
| `sidebarTitle` | `sidebar` base field needed | Rename to `sidebarHeading` |

**Rule:** Only use the `*Text`/`*Title` suffix when the base field (`link`, `image`, etc.) is present in the same model. Otherwise drop the suffix or use a neutral suffix like `Btn`, `Label`, `Heading`, `Content`.

#### `xwalk/max-cells`
Each block row may have at most **4 cell groups**. Collapsible fields that have a base field collapse into 1 group with their base (they do not count separately). Fields without a collapsible suffix each count as 1.

When a block genuinely needs more than 4 fields (e.g., a CTA with 8 fields), add an override to `.eslintrc.js`:

```javascript
'xwalk/max-cells': ['error', {
  cta: 8,            // model id → allowed cell count
  'carousel-item': 7,
  hero: 7,
}],
```

**Current overrides in `.eslintrc.js`:**
- `carousel-item`: 7
- `cta`: 8
- `features-item`: 7
- `hero`: 7
- `page-hero`: 6
- `pricing-plan`: 8
- `richtext-block`: 8

#### `no-nested-ternary` (airbnb-base)
Convert nested ternaries to `if / else if` blocks. Lint will reject:
```javascript
const x = a ? 'a' : b ? 'b' : 'c'; // error
```
Use:
```javascript
let x = 'c';
if (a) x = 'a';
else if (b) x = 'b';
```

#### `quote-props` (airbnb-base)
Do not wrap valid JS identifier property names in quotes in object literals (e.g., `.eslintrc.js` rule objects). `cta: 8` is correct; `'cta': 8` triggers an error.

### Component JSON (Build System)
- **Edit** source files: `models/_*.json` and `blocks/*/_blockname.json`
- **Never edit** directly: `component-definition.json`, `component-models.json`, `component-filters.json`
- **After any model change:** run `npm run build:json`

### ⛔ AEM Package ZIP — NEVER skip `npm run build:json` first

> **This rule has been violated before. It must NEVER be skipped again.**

`create-aem-package.ps1` bundles the three root-level JSON files **as they exist on disk at the moment it runs**. If `npm run build:json` has not been run first, the ZIP will contain **stale JSON** and Universal Editor will silently show wrong or missing fields after install — with no error message.

**Claude MUST always run these steps in this exact order before suggesting or running the ZIP script:**

```bash
# STEP 1 — always first, no exceptions
npm run build:json

# STEP 2 — commit the rebuilt files so git is in sync
git add component-definition.json component-filters.json component-models.json
# (commit together with other changed files)

# STEP 3 — only now generate the ZIP
powershell.exe -ExecutionPolicy Bypass -File ".\tools\create-aem-package.ps1"
```

**Files packaged into the ZIP:**
- `component-definition.json`
- `component-filters.json`
- `component-models.json`

**Checklist before every ZIP creation:**
- [ ] `npm run build:json` was run in this session
- [ ] The three JSON files have been staged/committed
- [ ] No uncommitted changes remain in `models/` or `blocks/*/`

If any checklist item is false, run `npm run build:json` before proceeding.

---

## Design Tokens — `styles/styles.css` (actual values)

```css
/* Google Fonts import at top */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:...');

:root {
  /* DXP AI colour system */
  --background-color: #0d0e2a;
  --light-color: #1a1b4b;
  --dark-color: #080a1e;
  --text-color: #f0f2ff;
  --link-color: #7c3aed;
  --link-hover-color: #9333ea;

  /* extended palette */
  --c-navy: #0d0e2a;
  --c-dark-blue: #1a1b4b;
  --c-purple: #7c3aed;
  --c-violet: #9333ea;
  --c-cyan: #06b6d4;
  --c-white: #ffffff;
  --c-off-white: #f0f2ff;
  --c-mid-gray: #6b7aab;
  --gradient-dxp: linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #9333ea 100%);
  --gradient-hero: linear-gradient(135deg, #0d0e2a 0%, #1a1b4b 40%, #2d1b69 100%);

  /* fonts */
  --body-font-family: 'DM Sans', dm-sans-fallback, sans-serif;
  --heading-font-family: 'Sora', sora-fallback, sans-serif;

  /* body sizes (same mobile AND desktop) */
  --body-font-size-m: 18px;
  --body-font-size-s: 16px;
  --body-font-size-xs: 14px;

  /* heading sizes (mobile) */
  --heading-font-size-xxl: 48px;
  --heading-font-size-xl:  38px;
  --heading-font-size-l:   30px;
  --heading-font-size-m:   24px;
  --heading-font-size-s:   20px;
  --heading-font-size-xs:  18px;

  /* layout */
  --nav-height: 72px;

  /* radius/shadow tokens */
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 28px;
  --shadow-md: 0 4px 20px rgba(13, 14, 42, 0.4);
  --shadow-lg: 0 12px 40px rgba(13, 14, 42, 0.5);
  --shadow-glow: 0 0 40px rgba(124, 58, 237, 0.35);
}

/* Desktop overrides (headings only) */
@media (width >= 900px) {
  :root {
    --heading-font-size-xxl: 56px;
    --heading-font-size-xl:  44px;
    --heading-font-size-l:   34px;
    --heading-font-size-m:   28px;
    --heading-font-size-s:   22px;
    --heading-font-size-xs:  18px;
  }
}
```

Section layout:
```css
main > .section { margin: 0; }
main > .section > div { max-width: 1280px; margin: auto; padding: 0 24px; }
/* desktop */ padding: 0 32px;
/* light/highlight variant */ background-color: var(--light-color); margin: 0; padding: 40px 0;
/* dark variant */ background-color: var(--dark-color); margin: 0; padding: 40px 0;
```

---

## head.html (actual content)

```html
<meta
  http-equiv="Content-Security-Policy"
  content="script-src 'nonce-aem' 'strict-dynamic' 'unsafe-inline' http: https:; base-uri 'self'; object-src 'none';"
  move-to-http-header="true"
>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<script nonce="aem" src="/scripts/aem.js" type="module"></script>
<script nonce="aem" src="/scripts/scripts.js" type="module"></script>
<link rel="stylesheet" href="/styles/styles.css"/>
```

---

## scripts.js — Loading Phases (actual logic)

```javascript
// EAGER — critical path, blocks first paint
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);               // buttons, icons, sections, blocks
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage); // LCP
  }
  // load fonts early on desktop or if cached
  if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) loadFonts();
}

// LAZY — after first paint
async function loadLazy(doc) {
  loadHeader(doc.querySelector('header'));
  await loadSections(doc.querySelector('main'));  // all remaining sections
  loadFooter(doc.querySelector('footer'));
  loadCSS('.../styles/lazy-styles.css');
  loadFonts();
}

// DELAYED — 3 seconds after load (analytics, chat)
function loadDelayed() {
  window.setTimeout(() => import('./delayed.js'), 3000);
}
```

Key utility exports from `scripts.js`:
- `moveAttributes(from, to, attributes)` — moves DOM attributes between elements
- `moveInstrumentation(from, to)` — moves `data-aue-*` and `data-richtext-*` UE attributes
- `decorateMain(main)` — runs buttons, icons, sections, blocks decoration

---

## component-models.json (actual content)

```json
[
  { "id": "page-metadata",
    "fields": [
      { "component": "text",        "name": "jcr:title",     "label": "Title"       },
      { "component": "text",        "name": "jcr:description","label": "Description" },
      { "component": "text",        "name": "keywords",       "label": "Keywords", "multi": true }
    ]
  },
  { "id": "image",
    "fields": [
      { "component": "reference",   "name": "image",    "label": "Image",    "multi": false },
      { "component": "text",        "name": "imageAlt", "label": "Alt Text" }
    ]
  },
  { "id": "title",
    "fields": [
      { "component": "text",   "name": "title",     "label": "Title" },
      { "component": "select", "name": "titleType", "label": "Title Type",
        "options": [{"name":"h1","value":"h1"},{"name":"h2","value":"h2"},{"name":"h3","value":"h3"},
                    {"name":"h4","value":"h4"},{"name":"h5","value":"h5"},{"name":"h6","value":"h6"}] }
    ]
  },
  { "id": "button",
    "fields": [
      { "component": "aem-content", "name": "link",      "label": "Link"  },
      { "component": "text",        "name": "linkText",  "label": "Text"  },
      { "component": "text",        "name": "linkTitle", "label": "Title" },
      { "component": "select",      "name": "linkType",  "label": "Type",
        "options": [{"name":"default","value":""},{"name":"primary","value":"primary"},{"name":"secondary","value":"secondary"}] }
    ]
  },
  { "id": "section",
    "fields": [
      { "component": "text",        "name": "name",  "label": "Section Name" },
      { "component": "multiselect", "name": "style", "label": "Style",
        "options": [{"name":"Highlight","value":"highlight"}] }
    ]
  },
  { "id": "card",
    "fields": [
      { "component": "reference", "name": "image", "label": "Image", "multi": false },
      { "component": "richtext",  "name": "text",  "label": "Text"  }
    ]
  },
  { "id": "columns",
    "fields": [
      { "component": "text", "valueType": "number", "name": "columns", "label": "Columns" },
      { "component": "text", "valueType": "number", "name": "rows",    "label": "Rows"    }
    ]
  },
  { "id": "fragment",
    "fields": [
      { "component": "aem-content", "name": "reference", "label": "Reference" }
    ]
  },
  { "id": "hero",
    "fields": [
      { "component": "reference", "name": "image",    "label": "Image", "multi": false },
      { "component": "text",      "name": "imageAlt", "label": "Alt"   },
      { "component": "richtext",  "name": "text",     "label": "Text"  }
    ]
  }
]
```

---

## component-filters.json (actual content)

```json
[
  { "id": "main",    "components": ["section"] },
  { "id": "section", "components": ["text","image","button","title","hero","cards","columns","fragment"] },
  { "id": "cards",   "components": ["card"] },
  { "id": "columns", "components": ["column"] },
  { "id": "column",  "components": ["text","image","button","title"] }
]
```

---

## component-definition.json (group summary)

**Default Content:** text, title, image, button
**Sections:** section
**Blocks (20+):** accordion, articles, breadcrumb, cards (+card item), carousel, cms-compat, columns, cta, features, footer, fragment, header, hero, page-hero, pricing, richtext, section-dark, section-generic, section-light, stats-band, team, timeline, who-uses

All blocks use `resourceType: "core/franklin/components/block/v1/block"`.
Child items (e.g. card) use `resourceType: "core/franklin/components/block/v1/block/item"`.

---

## fstab.yaml (actual content)

For EDS routing, the AEM author Cloud Service URL is used — AEM connects to EDS via the Code Bus, not direct localhost. The format is:

```yaml
mountpoints:
  /:
    url: https://author-p<programId>-e<environmentId>.adobeaemcloud.com
  /content:
    url: https://author-p<programId>-e<environmentId>.adobeaemcloud.com/content
```

For local development, `localhost:4502` is used directly instead of the Cloud Service URL.

---

## Block Architecture

### Directory Structure
```
blocks/blockname/
├── blockname.js        # exports default function decorate(block)
├── blockname.css       # scoped with .blockname prefix
├── blockname.html      # UE authoring template (data-field bindings)
└── _blockname.json     # source: definitions + models + filters
```

### Real Example — `blocks/cards/cards.js`
```javascript
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.replaceChildren(ul);
}
```

### Real Example — `blocks/cards/_cards.json`
```json
{
  "definitions": [
    { "title": "Cards", "id": "cards",
      "plugins": { "xwalk": { "page": {
        "resourceType": "core/franklin/components/block/v1/block",
        "template": { "name": "Cards", "filter": "cards" }
      }}}
    },
    { "title": "Card", "id": "card",
      "plugins": { "xwalk": { "page": {
        "resourceType": "core/franklin/components/block/v1/block/item",
        "template": { "name": "Card", "model": "card" }
      }}}
    }
  ],
  "models": [
    { "id": "card", "fields": [
      { "component": "reference", "name": "image", "label": "Image", "multi": false },
      { "component": "richtext",  "name": "text",  "label": "Text"  }
    ]}
  ],
  "filters": [
    { "id": "cards", "components": ["card"] }
  ]
}
```

### EDS HTML Structure (what `decorate(block)` receives)

**CRITICAL — Two different structures depending on block type:**

#### Flat blocks (no `filter` in definition — `model` is set directly on the block)
All fields arrive in **one row**, each as a separate cell:
```
AEM model: heading="Hello", text="World"

EDS generates:
<div class="myblock">     ← block
  <div>                   ← single row
    <div>Hello</div>      ← cell 0 (heading)
    <div>World</div>      ← cell 1 (text)
  </div>
</div>
```
Read: `const cells = [...block.firstElementChild.children]`  
→ `cells[0]` = heading, `cells[1]` = text

#### Parent blocks with child items (definition has `filter`, `model` is NOT on the block itself)
The parent block fields arrive as **one row per field**, each with a single cell:
```
AEM model on carousel block: overline="Platform Pillars", heading="...", description="..."

EDS generates:
<div class="carousel">
  <div><div>Platform Pillars</div></div>   ← row 0: overline (1 cell)
  <div><div>Everything You Need</div></div> ← row 1: heading (1 cell)
  <div><div>Seven powerful...</div></div>   ← row 2: description (1 cell)
  ... child item rows follow ...
</div>
```
Read: `const rows = [...block.children]`  
→ `rows[0].children[0]` = overline, `rows[1].children[0]` = heading, `rows[2].children[0]` = description

**Why the difference?** When a block has a `filter` (allowing child items), AEM stores parent fields and child items in the same JCR node tree. EDS serialises each parent field as its own `<div><div>value</div></div>` row so child items can be distinguished by row count. Flat blocks have no children so all fields fit in one row.

**Rule:** Always read block content by **row index** (`rows[i].children[0]`), not by cells from the first row, unless you have verified the block is a flat (no-filter) model.

---

## Block Rendering Patterns

### Direct-Render Blocks (render HTML statically)
These blocks bypass the EDS row/cell data structure and render complete HTML directly:

- `header.js` — Renders full DXP AI navigation (logo, desktop nav with dropdowns, hamburger, mobile menu) directly. Does NOT load `/nav` fragment.
- `footer.js` — Renders full DXP AI footer (newsletter, 5-col links, socials, legal) directly. Does NOT load `/footer` fragment.
- `hero.js` — Renders DXP AI hero section (orbs, heading, dashboard card, trust badges) directly.

### Data-Driven Blocks (map EDS row/cell data from AEM)
All other blocks receive AEM content as `div > div > div` structure and transform it:

- **carousel (parent):** rows[0]=overline, [1]=heading, [2]=description (one row per field, filter block)  
  **carousel-item:** cells[0]=iconKey, [1]=iconVariant, [2]=category, [3]=title, [4]=text, [5]=ctaBtn, [6]=ctaUrl → `article.carousel__card`
- **cta:** rows[0]=overline, [1]=heading, [2]=description, [3]=primaryBtn, [4]=primaryUrl, [5]=secondaryBtn, [6]=secondaryUrl, [7]=metaNote (one row per field, filter block)
- **features / who-uses:** each item — cells[0]=icon, [1]=title, [2]=description, [3]=link → `article.feature-card`
- **stats-band:** cells[0]=value, [1]=label → `.stat-item` with `.sv` / `.sl`
- **articles:** first row = heading (single cell), subsequent rows = article data

---

## Universal Editor Field Types

| `"component"` | Editor UI | Notes |
|---|---|---|
| `"text"` | Single-line input | `"valueType": "string"` |
| `"richtext"` | WYSIWYG editor | HTML output |
| `"reference"` | DAM asset picker | Images/video |
| `"aem-content"` | Page picker | Internal links |
| `"select"` | Dropdown | Requires `"options": [{name, value}]` |
| `"multiselect"` | Multi-checkbox | Requires `"options": [{name, value}]` |
| `"boolean"` | Toggle | `"valueType": "boolean"` |
| `"number"` | Number input | `"valueType": "number"` |
| `"tab"` | UI grouping | `"value": "Tab Label"` |

---

## Local Environment

| What | URL |
|---|---|
| AEM Author | http://localhost:4502 (admin/admin) |
| AEM Publish | http://localhost:4503 |
| HTML Kit server | http://localhost:3000 (`npm run start`) |
| `.env` | `AEM_HOST=http://localhost:4502` |

---

## ⛔ Content Authoring — JCR .content.xml (CRITICAL RULES)

These rules were learned the hard way after repeated mistakes. Every rule below has caused real bugs. Never skip any of them.

---

### Pre-authoring mandatory checklist

Before writing a single `.content.xml` file:

- [ ] Read at least one **working** page first — use `index/.content.xml` as the reference template
- [ ] Author ONE page first, verify it renders in AEM, THEN continue with remaining pages
- [ ] Know the correct file path (see below) — the `/en/` path mistake was made twice

---

### File path — where `.content.xml` files live

```
CORRECT:   site-content/My DXP site Content/jcr_root/content/my-dxp-site/[page]/.content.xml
WRONG:     site-content/My DXP site Content/jcr_root/content/my-dxp-site/en/[page]/.content.xml
WRONG:     site-content/My DXP site Content/jcr_root/content/my-dxp-site/[page]/_jcr_content/.content.xml
```

- There is **no `/en/` segment** in the content path
- `jcr:content` is **inline** in `[page]/.content.xml` — there is NO separate `_jcr_content/` subfolder
- Working page content files are at: `index`, `platform`, `about`, `solutions`, `pricing`, `why-dxp`, `ai-capabilities`, `integrations`, `security`, `resources`, `blog`, `case-studies`, `contact`, `documentation`

---

### Page file skeleton — outer structure

Every page uses this exact outer structure:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
          xmlns:mix="http://www.jcp.org/jcr/mix/1.0" xmlns:cq="http://www.day.com/jcr/cq/1.0"
          xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    jcr:primaryType="cq:Page">
    <jcr:content
        cq:template="/libs/core/franklin/templates/page"
        jcr:primaryType="cq:PageContent"
        jcr:title="Page Title Here"
        sling:resourceType="core/franklin/components/page/v1/page">
        <root
            jcr:primaryType="nt:unstructured"
            sling:resourceType="core/franklin/components/root/v1/root">

            <section
                jcr:primaryType="nt:unstructured"
                sling:resourceType="core/franklin/components/section/v1/section">
                <!-- blocks go here -->
            </section>

            <section_2
                jcr:primaryType="nt:unstructured"
                sling:resourceType="core/franklin/components/section/v1/section">
                <!-- more blocks -->
            </section_2>

        </root>
    </jcr:content>
</jcr:root>
```

Key facts:
- `jcr:primaryType="cq:Page"` on root element
- `<jcr:content>` is a direct child of `<jcr:root>` — NOT a subfolder
- All blocks live inside `<root>` → `<section_N>` wrappers
- Sections are named `section`, `section_2`, `section_3`, etc. (first is just `section`)

---

### Root site `.content.xml` — page registration

`site-content/My DXP site Content/jcr_root/content/my-dxp-site/.content.xml` registers all child pages. Every new page must be added as an empty child element:

```xml
<jcr:root ... jcr:primaryType="cq:Page">
    <jcr:content ... jcr:title="My DXP Site" .../>
    <footer/>
    <index/>
    <nav/>
    <about/>
    <pricing/>
    <platform/>
    <solutions/>
    <contact/>
    <ai-capabilities/>
    <why-dxp/>
    <security/>
    <integrations/>
    <blog/>
    <case-studies/>
    <resources/>
    <documentation/>
</jcr:root>
```

---

### Three mandatory UE attributes on every block

Without these three attributes on a block, the Universal Editor properties panel shows NOTHING:

```xml
<my_block
    aueComponentId="block-name"
    model="block-model-id"
    modelFields="[field1@type,field2@type,...]"
    name="Block Display Name"
    ...field values.../>
```

| Attribute | Purpose | Example |
|---|---|---|
| `aueComponentId` | Tells UE which component this is | `"page-hero"` |
| `model` | Links block to its model definition | `"page-hero"` |
| `modelFields` | Lists all editable fields for UE panel | `"[heading@text,text@richtext]"` |
| `name` | Display label in UE component tree | `"Page Hero"` |

**Child items** (inside parent blocks with `filter`) need only `model` and `name` — NOT `aueComponentId` or `modelFields` (unless they have complex models like `features-item`).

---

### Section with highlight style

For sections that need the highlight background, add UE attributes directly on the section:

```xml
<section_3
    jcr:primaryType="nt:unstructured"
    sling:resourceType="core/franklin/components/section/v1/section"
    aueComponentId="section"
    model="section"
    modelFields="[name@text,style@multiselect]"
    style="highlight">
    <!-- blocks inside -->
</section_3>
```

---

### HTML escaping rules

In XML attribute values, HTML content must be escaped:

| Character | Escaped form |
|---|---|
| `<` | `&lt;` |
| `>` | `&gt;` |
| `&` | `&amp;` |
| `"` inside attribute | `&quot;` |
| `'` inside attribute | `&apos;` (or use `&apos;`) |

Example — a `text` field containing HTML:
```xml
text="&lt;p>Some &lt;strong>bold&lt;/strong> text &amp; more.&lt;/p>"
```

Rich text with lists:
```xml
text="&lt;p>Intro paragraph.&lt;/p>&lt;ul>&lt;li>Item one&lt;/li>&lt;li>Item &amp;amp; two&lt;/li>&lt;/ul>"
```

Note: `&amp;amp;` means a literal `&amp;` in the HTML output. Use `&amp;amp;` to render `&amp;` on the page.

---

### Internal link format

All internal links must use this format:

```
/content/my-dxp-site/[page]
```

| Page | Link value |
|---|---|
| Home | `/content/my-dxp-site/index` |
| Platform | `/content/my-dxp-site/platform` |
| Solutions | `/content/my-dxp-site/solutions` |
| Pricing | `/content/my-dxp-site/pricing` |
| Why DXP | `/content/my-dxp-site/why-dxp` |
| AI Capabilities | `/content/my-dxp-site/ai-capabilities` |
| Integrations | `/content/my-dxp-site/integrations` |
| Security | `/content/my-dxp-site/security` |
| Resources | `/content/my-dxp-site/resources` |
| Blog | `/content/my-dxp-site/blog` |
| Case Studies | `/content/my-dxp-site/case-studies` |
| Contact | `/content/my-dxp-site/contact` |
| Documentation | `/content/my-dxp-site/documentation` |
| About | `/content/my-dxp-site/about` |

**NEVER use:** `/content/sites/dxp-ai-ue-eds/en/[page]` — wrong path, not valid in this project.

---

### Block reference — exact field names and structure

Use the index page (`site-content/My DXP site Content/jcr_root/content/my-dxp-site/index/.content.xml`) as the authoritative live reference. The patterns below match that file exactly.

#### `hero` block (home page only — direct-render, data-driven fields)

```xml
<hero
    jcr:primaryType="nt:unstructured"
    sling:resourceType="core/franklin/components/block/v1/block"
    aueComponentId="hero"
    eyebrow="Powered by ZensAI · Zensar Technologies"
    heading="&lt;h1>Heading with &lt;em>emphasis&lt;/em>&lt;/h1>"
    model="hero"
    modelFields="[eyebrow@text,heading@richtext,subheading@richtext,primaryCtaText@text,primaryCtaUrl@aem-content,secondaryCtaText@text,secondaryCtaUrl@aem-content]"
    name="Hero"
    primaryCtaText="Request a DXP Demo"
    primaryCtaUrl="/content/my-dxp-site/contact"
    secondaryCtaText="Explore Platform"
    secondaryCtaUrl="/content/my-dxp-site/platform"
    subheading="&lt;p>Subheading paragraph text here.&lt;/p>"/>
```

Fields: `eyebrow` (text), `heading` (richtext — must contain `<h1>`), `subheading` (richtext), `primaryCtaText`, `primaryCtaUrl`, `secondaryCtaText`, `secondaryCtaUrl`.

---

#### `page-hero` block (used on all inner pages)

```xml
<page_hero
    jcr:primaryType="nt:unstructured"
    sling:resourceType="core/franklin/components/block/v1/block"
    aueComponentId="page-hero"
    badgeText="Badge Label"
    breadcrumbCurrent="Page Name"
    breadcrumbUrl="/content/my-dxp-site/index"
    description="&lt;p>Description paragraph.&lt;/p>"
    headingAccent="Accent Part."
    headingPrefix="Prefix Part."
    model="page-hero"
    modelFields="[breadcrumbUrl@aem-content,breadcrumbCurrent@text,badgeText@text,headingPrefix@text,headingAccent@text,description@richtext]"
    name="Page Hero"/>
```

Fields: `breadcrumbUrl` (aem-content), `breadcrumbCurrent` (text), `badgeText` (text), `headingPrefix` (text), `headingAccent` (text), `description` (richtext).

---

#### `stats-band` block (parent with items)

```xml
<stats_band
    jcr:primaryType="nt:unstructured"
    sling:resourceType="core/franklin/components/block/v1/block"
    aueComponentId="stats-band"
    filter="stats-band"
    name="Stats Band">
    <item_0
        jcr:primaryType="nt:unstructured"
        sling:resourceType="core/franklin/components/block/v1/block/item"
        label="Enterprise Clients Globally"
        model="stats-item"
        name="Stats Item"
        value="500+"/>
    <item_1 ... label="Platform Uptime SLA" value="99.9%" .../>
</stats_band>
```

Note: `stats-band` has NO parent-level `model` or `modelFields` — only the items have `model="stats-item"`.
Item fields: `value` (text), `label` (text).

---

#### `features` block (parent with items)

Parent level:
```xml
<features
    jcr:primaryType="nt:unstructured"
    sling:resourceType="core/franklin/components/block/v1/block"
    aueComponentId="features"
    description="Section description text."
    filter="features"
    heading="Section Heading"
    model="features"
    modelFields="[overline@text,heading@text,description@text]"
    name="Features"
    overline="Overline Text">
```

Item level (`model="features-item"`) — fields vary by page context:

Minimal (most pages — just heading + text):
```xml
<item_0
    jcr:primaryType="nt:unstructured"
    sling:resourceType="core/franklin/components/block/v1/block/item"
    heading="Feature Title"
    model="features-item"
    name="Features Item"
    text="&lt;p>Description paragraph.&lt;/p>"/>
```

Full (with icon + link — used on index/platform):
```xml
<item_0
    jcr:primaryType="nt:unstructured"
    sling:resourceType="core/franklin/components/block/v1/block/item"
    iconKey="cms"
    iconVariant="purple"
    linkText="Learn more"
    model="features-item"
    modelFields="[iconKey@select,iconVariant@select,tag@text,title@text,text@richtext,linkText@text,linkUrl@aem-content]"
    name="Features Item"
    tag="CMS"
    text="&lt;p>Description.&lt;/p>"
    title="Feature Title"/>
```

With CTA (used on resources page):
```xml
<item_0
    ...
    ctaText="Download Report"
    ctaUrl="/content/my-dxp-site/contact"
    heading="Feature Title"
    model="features-item"
    name="Features Item"
    text="&lt;p>Description.&lt;/p>"/>
```

Valid `iconKey` values: `cms`, `personalize`, `multichannel`, `ai`, `integrations`, `analytics`, `security`
Valid `iconVariant` values: `purple`, `green`, `blue`, `orange`, `violet`

---

#### `carousel` block (parent with items)

Parent level:
```xml
<carousel
    jcr:primaryType="nt:unstructured"
    sling:resourceType="core/franklin/components/block/v1/block"
    aueComponentId="carousel"
    description="Section description."
    filter="carousel"
    heading="Section Heading"
    model="carousel"
    modelFields="[overline@text,heading@text,description@text]"
    name="Carousel"
    overline="Overline Text">
```

Item level (`model="carousel-item"`):
```xml
<item_0
    jcr:primaryType="nt:unstructured"
    sling:resourceType="core/franklin/components/block/v1/block/item"
    category="Content Management"
    ctaText="Explore"
    ctaUrl="/content/my-dxp-site/platform"
    model="carousel-item"
    name="Carousel Item"
    text="&lt;p>Card description text.&lt;/p>"
    title="Card Title"/>
```

With icons (optional):
```xml
<item_0
    ...
    iconKey="ai"
    iconVariant="violet"
    model="carousel-item"
    modelFields="[iconKey@select,iconVariant@select,category@text,title@text,text@richtext,ctaText@text,ctaUrl@aem-content]"
    .../>
```

---

#### `cms-compat` block (parent with items)

```xml
<cms_compat
    jcr:primaryType="nt:unstructured"
    sling:resourceType="core/franklin/components/block/v1/block"
    aueComponentId="cms-compat"
    filter="cms-compat"
    name="CMS Compat">
    <item_0
        jcr:primaryType="nt:unstructured"
        sling:resourceType="core/franklin/components/block/v1/block/item"
        heading="Approach Title"
        model="cms-compat-approach"
        name="CMS Compat Approach"
        text="&lt;p>Description.&lt;/p>&lt;ul>&lt;li>Point one&lt;/li>&lt;/ul>"/>
</cms_compat>
```

Note: XML node name uses underscore (`cms_compat`) but `aueComponentId` uses hyphen (`cms-compat`). This applies to all hyphenated block names.

---

#### `who-uses` block (parent with items)

```xml
<who_uses
    jcr:primaryType="nt:unstructured"
    sling:resourceType="core/franklin/components/block/v1/block"
    aueComponentId="who-uses"
    filter="who-uses"
    name="Who Uses">
    <item_0
        jcr:primaryType="nt:unstructured"
        sling:resourceType="core/franklin/components/block/v1/block/item"
        ctaText="For Marketing"
        ctaUrl="/content/my-dxp-site/solutions"
        heading="Marketing Teams"
        model="who-uses-item"
        name="Who Uses Item"
        text="&lt;p>Description.&lt;/p>&lt;ul>&lt;li>Feature&lt;/li>&lt;/ul>"/>
</who_uses>
```

---

#### `articles` block (no child items — parent only)

```xml
<articles
    jcr:primaryType="nt:unstructured"
    sling:resourceType="core/franklin/components/block/v1/block"
    aueComponentId="articles"
    description="&lt;p>Section description.&lt;/p>"
    heading="Latest from the DXP AI Blog"
    model="articles"
    modelFields="[heading@text,description@richtext]"
    name="Articles"/>
```

Self-closing — no child items. The articles block fetches its content dynamically.

For the blog page, articles block uses child items (`filter="articles"`, `model="article-item"`):
```xml
<articles
    jcr:primaryType="nt:unstructured"
    sling:resourceType="core/franklin/components/block/v1/block"
    aueComponentId="articles"
    filter="articles"
    name="Articles">
    <item_0
        jcr:primaryType="nt:unstructured"
        sling:resourceType="core/franklin/components/block/v1/block/item"
        category="AI &amp; Personalization"
        ctaText="Read Article"
        ctaUrl="/content/my-dxp-site/blog"
        model="article-item"
        name="Article Item"
        text="&lt;p>Article excerpt.&lt;/p>"
        title="Article Title"/>
</articles>
```

---

#### `richtext` block (model id = `richtext-block`)

```xml
<richtext
    jcr:primaryType="nt:unstructured"
    sling:resourceType="core/franklin/components/block/v1/block"
    aueComponentId="richtext"
    ctaText="Button Label"
    ctaUrl="/content/my-dxp-site/contact"
    heading="Main Heading"
    lead="Lead sentence — appears larger above body text."
    model="richtext-block"
    modelFields="[overline@text,heading@text,lead@text,text@richtext,sidebarTitle@text,sidebarText@richtext,ctaUrl@aem-content,ctaText@text]"
    name="Richtext"
    overline="Section Label"
    sidebarText="&lt;p>Sidebar content here.&lt;/p>"
    sidebarTitle="Sidebar Heading"
    text="&lt;p>Body content with &lt;strong>bold&lt;/strong> and &lt;em>italic&lt;/em>.&lt;/p>&lt;h3>Sub heading&lt;/h3>&lt;p>More content.&lt;/p>"/>
```

Note: `model="richtext-block"` NOT `model="richtext"` — the model ID has `-block` suffix.
Fields: `overline`, `heading`, `lead`, `text` (richtext), `sidebarTitle`, `sidebarText` (richtext), `ctaUrl` (aem-content), `ctaText`.

---

#### `cta` block

```xml
<cta
    jcr:primaryType="nt:unstructured"
    sling:resourceType="core/franklin/components/block/v1/block"
    aueComponentId="cta"
    description="&lt;p>Supporting description text.&lt;/p>"
    heading="CTA Heading"
    metaText="Note below buttons — e.g. No credit card required"
    model="cta"
    modelFields="[overline@text,heading@text,description@richtext,primaryText@text,primaryUrl@aem-content,secondaryText@text,secondaryUrl@aem-content,metaText@text]"
    name="CTA"
    overline="Overline Label"
    primaryText="Primary Button"
    primaryUrl="/content/my-dxp-site/contact"
    secondaryText="Secondary Button"
    secondaryUrl="/content/my-dxp-site/pricing"/>
```

`overline`, `secondaryText`, `secondaryUrl`, and `metaText` are all optional. At minimum provide `heading`, `primaryText`, `primaryUrl`.

---

#### `team` block (parent with items)

```xml
<team
    jcr:primaryType="nt:unstructured"
    sling:resourceType="core/franklin/components/block/v1/block"
    aueComponentId="team"
    filter="team"
    name="Team">
    <item_0
        jcr:primaryType="nt:unstructured"
        sling:resourceType="core/franklin/components/block/v1/block/item"
        bio="Short bio text."
        memberName="Full Name"
        model="team-member"
        name="Team Member"
        role="Job Title, Company"/>
</team>
```

Item fields: `memberName` (text), `role` (text), `bio` (text).

---

#### `timeline` block (parent with items)

```xml
<timeline
    jcr:primaryType="nt:unstructured"
    sling:resourceType="core/franklin/components/block/v1/block"
    aueComponentId="timeline"
    filter="timeline"
    name="Timeline">
    <item_0
        jcr:primaryType="nt:unstructured"
        sling:resourceType="core/franklin/components/block/v1/block/item"
        description="Description of this milestone."
        heading="Milestone Title"
        model="timeline-event"
        name="Timeline Event"
        year="1991"/>
</timeline>
```

Item fields: `year` (text), `heading` (text), `description` (text).

---

#### `pricing` block (parent with items)

```xml
<pricing
    jcr:primaryType="nt:unstructured"
    sling:resourceType="core/franklin/components/block/v1/block"
    aueComponentId="pricing"
    filter="pricing"
    name="Pricing">
    <item_0
        jcr:primaryType="nt:unstructured"
        sling:resourceType="core/franklin/components/block/v1/block/item"
        ctaText="Start Free Trial"
        ctaUrl="/content/my-dxp-site/contact"
        description="Plan short description."
        features="&lt;ul>&lt;li>Feature one&lt;/li>&lt;li>Feature two&lt;/li>&lt;/ul>"
        model="pricing-plan"
        name="Pricing Plan"
        period="/month"
        planName="Starter"
        price="$2,499"/>
</pricing>
```

Item fields: `planName`, `price`, `period`, `description`, `features` (richtext — list of features), `ctaText`, `ctaUrl`.
Use `period="\0"` for plans with no period (e.g., custom/enterprise pricing).

---

#### `accordion` block (parent with items)

```xml
<accordion
    jcr:primaryType="nt:unstructured"
    sling:resourceType="core/franklin/components/block/v1/block"
    aueComponentId="accordion"
    filter="accordion"
    name="Accordion">
    <item_0
        jcr:primaryType="nt:unstructured"
        sling:resourceType="core/franklin/components/block/v1/block/item"
        answer="&lt;p>Full answer text here.&lt;/p>"
        model="accordion-item"
        name="Accordion Item"
        question="Question text here?"/>
</accordion>
```

Item fields: `question` (text), `answer` (richtext).

---

#### `section-light` and `section-dark` blocks

These are visual divider/heading blocks used INSIDE a section alongside other blocks:

```xml
<section_light
    jcr:primaryType="nt:unstructured"
    sling:resourceType="core/franklin/components/block/v1/block"
    aueComponentId="section-light"
    heading="Section Heading"
    model="section-light"
    modelFields="[heading@text,text@richtext]"
    name="Section Light"
    text="&lt;p>Optional supporting text.&lt;/p>"/>

<section_dark
    jcr:primaryType="nt:unstructured"
    sling:resourceType="core/franklin/components/block/v1/block"
    aueComponentId="section-dark"
    heading="Section Heading"
    model="section-dark"
    modelFields="[heading@text,text@richtext]"
    name="Section Dark"
    text="&lt;p>Optional supporting text.&lt;/p>"/>
```

Both accept `heading` (text) and `text` (richtext). The XML node names use underscores (`section_light`, `section_dark`); `aueComponentId` uses hyphens (`section-light`, `section-dark`).

---

### XML node naming rules

| Block name | XML node name | aueComponentId |
|---|---|---|
| `hero` | `<hero` | `hero` |
| `page-hero` | `<page_hero` | `page-hero` |
| `stats-band` | `<stats_band` | `stats-band` |
| `cms-compat` | `<cms_compat` | `cms-compat` |
| `who-uses` | `<who_uses` | `who-uses` |
| `section-light` | `<section_light` | `section-light` |
| `section-dark` | `<section_dark` | `section-dark` |
| `page-hero` | `<page_hero` | `page-hero` |

**Rule:** XML element names cannot contain hyphens — replace with underscore. `aueComponentId` always uses the hyphenated form.

---

### ⛔ Content package — source first, ZIP second (NEVER edit the ZIP directly)

> **This rule has been violated. The ZIP is a build output — NEVER the source of truth.**

**The only source of truth for site content is the directory:**
```
site-content/My DXP site Content/jcr_root/content/my-dxp-site/
```

**The ZIP is always generated FROM that directory — it is never edited directly:**
```
site-content/My DXP site Content.zip   ← BUILD OUTPUT, regenerated every time
```

**Mandatory sequence for any content change:**

```
STEP 1 — Edit the .content.xml file(s) at the source path:
          site-content/My DXP site Content/jcr_root/content/my-dxp-site/[page]/.content.xml

STEP 2 — Commit the changed source file(s) to git

STEP 3 — Rebuild the ZIP from the source directory (see script below)

STEP 4 — Install the ZIP via AEM Package Manager at http://localhost:4502/crx/packmgr
```

If you skip Step 1 and try to "update the ZIP directly", the source files and the ZIP are out of sync — the next ZIP rebuild will overwrite your changes silently.

---

There are TWO separate AEM packages to install:

**1. Component models package** — generated by `create-aem-package.ps1`:
```
dxp-ai-ue-eds-component-models-1.0.0.zip
```
Contains: `component-models.json`, `component-definition.json`, `component-filters.json`
Installs to: `/conf/my-dxp-site/settings/dam/adminui-extension/`
Rebuild: `npm run build:json` → then run `tools/create-aem-package.ps1`

**2. Site content package** — the `My DXP site Content.zip`:
```
site-content/My DXP site Content.zip
```
Source directory: `site-content/My DXP site Content/` ← EDIT FILES HERE, never in the ZIP
Installs to: `/content/my-dxp-site/`
Rebuild: use the PowerShell script below after updating source files

**Rebuild `My DXP site Content.zip`** — run this after updating ANY `.content.xml` file:
```powershell
powershell.exe -ExecutionPolicy Bypass -Command "
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
\$sourceDir = 'C:\Satish_Sapate_Data\AEM_Local\AEM_UE_EDS_Project\dxp-ai-ue-eds\site-content\My DXP site Content'
\$zipPath   = 'C:\Satish_Sapate_Data\AEM_Local\AEM_UE_EDS_Project\dxp-ai-ue-eds\site-content\My DXP site Content.zip'
if (Test-Path \$zipPath) { Remove-Item \$zipPath }
\$utf8NoBom = New-Object System.Text.UTF8Encoding(\$false)
\$zipStream = [System.IO.File]::Open(\$zipPath, [System.IO.FileMode]::Create)
\$archive   = New-Object System.IO.Compression.ZipArchive(\$zipStream, [System.IO.Compression.ZipArchiveMode]::Create)
Get-ChildItem -Path \$sourceDir -Recurse | ForEach-Object {
    \$relativePath = \$_.FullName.Substring(\$sourceDir.Length + 1).Replace('\', '/')
    if (\$_.PSIsContainer) { \$archive.CreateEntry(\$relativePath + '/') | Out-Null }
    else {
        \$entry  = \$archive.CreateEntry(\$relativePath, [System.IO.Compression.CompressionLevel]::Optimal)
        \$stream = \$entry.Open()
        \$bytes  = [System.IO.File]::ReadAllBytes(\$_.FullName)
        \$stream.Write(\$bytes, 0, \$bytes.Length)
        \$stream.Close()
    }
}
\$archive.Dispose(); \$zipStream.Close()
Write-Host 'Done: My DXP site Content.zip rebuilt'
"
```

**Why System.IO.Compression and NOT Compress-Archive?** `Compress-Archive` produces backslash paths on Windows — AEM Package Manager fails with "Missing jcr_root". Always use `System.IO.Compression` directly.

---

### Common mistakes — NEVER repeat

| Mistake | What happened | Rule |
|---|---|---|
| Wrong path `/en/[page]/` | Pages created at wrong JCR path, not reachable by AEM | File path is always `my-dxp-site/[page]/.content.xml` |
| `_jcr_content/` subfolder | jcr:content was in a subfolder instead of inline | `<jcr:content>` is a direct child of `<jcr:root>`, never a folder |
| No `model`/`aueComponentId` | UE properties panel showed nothing to edit | Every block needs all 3 UE attributes |
| Single `text` richtext per item | All content stuffed in one richtext field with `<h3>`, `<p>`, etc. | Use separate XML attributes per field — `heading="..."` NOT `<h3>` in text |
| Wrong link path | Links using `/content/sites/dxp-ai-ue-eds/en/[page]` | Always `/content/my-dxp-site/[page]` |
| No section wrappers | Blocks placed directly inside `<root>`, not in `<section_N>` | Every block must live inside a `<section_N sling:resourceType="...section/v1/section">` |
| `model="richtext"` | Wrong model ID for richtext block | Always `model="richtext-block"` |
| XML hyphen in node name | `<section-dark>` — invalid XML | Use underscore: `<section_dark>`, keep hyphen only in `aueComponentId` |
| Authoring all pages before testing one | Errors propagated across all 14 pages | Author 1 page → verify in AEM → then continue |
| Editing the ZIP directly | Source files and ZIP out of sync; next ZIP rebuild silently discards changes | ALWAYS edit source files under `site-content/My DXP site Content/jcr_root/` first, then rebuild ZIP |

---

## Full Documentation

See [`docs/aem-dev/`](./docs/aem-dev/README.md) for:
- `01-project-overview.md` — goals, full directory structure, tech stack
- `02-setup-guide.md` — step-by-step environment setup
- `03-architecture.md` — system diagrams, XWalk pattern, loading phases
- `04-block-development-guide.md` — creating new blocks step by step
- `05-universal-editor-guide.md` — UE models, definitions, filters in depth
- `06-css-design-system.md` — all design tokens, patterns, responsive rules
- `09-eds-content-query-api.md` — query index, sitemap, API endpoints
