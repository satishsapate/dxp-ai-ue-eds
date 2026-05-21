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

## Critical Rules

### JavaScript
- **No frameworks** — pure ES modules, no React/Vue/Angular/jQuery
- Every block exports `default function decorate(block)` — no named exports
- Import `.js` extension always: `import { fn } from '../../scripts/aem.js'`
- Use `const`/`let`, never `var`
- No `console.log` in production code

### CSS
- **Never hardcode colors or fonts** — always `var(--color-text)`, `var(--heading-font-family)`, etc.
- **Always scope** block styles with `.blockname` prefix
- **Mobile-first**, single breakpoint: `@media (width >= 900px)`
- No `!important`

### Component JSON (Build System)
- **Edit** source files: `models/_*.json` and `blocks/*/_blockname.json`
- **Never edit** directly: `component-definition.json`, `component-models.json`, `component-filters.json`
- **After any model change:** run `npm run build:json`

### AEM Package Deployment — MANDATORY sequence
Every time `tools/create-aem-package.ps1` is run to generate the ZIP, these steps MUST happen first in order:

```bash
# 1. Rebuild the three root-level JSON files from source
npm run build:json

# 2. Commit the updated JSON files so they are in sync with git
git add component-definition.json component-filters.json component-models.json
# (commit with other changed files)

# 3. THEN generate the ZIP — it reads the root-level JSON files
powershell.exe -ExecutionPolicy Bypass -File ".\tools\create-aem-package.ps1"
```

The ZIP (`dxp-ai-ue-eds-component-models-1.0.0.zip`) packages these three root-level files:
- `component-definition.json`
- `component-filters.json`
- `component-models.json`

If `npm run build:json` is skipped, the ZIP will contain stale JSON and UE will not pick up model changes after install.

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
When EDS renders content from AEM, each row of model fields becomes a `div > div` structure:
```
AEM fields: heading="Hello", text="World"

EDS generates:
<div class="myblock">     ← block (passed to decorate)
  <div>                   ← row
    <div>Hello</div>      ← cell 1 (heading field)
    <div>World</div>      ← cell 2 (text field)
  </div>
</div>
```
Access rows: `[...block.children]` — each row is a `div`, each cell is a nested `div`.

---

## Block Rendering Patterns

### Direct-Render Blocks (render HTML statically)
These blocks bypass the EDS row/cell data structure and render complete HTML directly:

- `header.js` — Renders full DXP AI navigation (logo, desktop nav with dropdowns, hamburger, mobile menu) directly. Does NOT load `/nav` fragment.
- `footer.js` — Renders full DXP AI footer (newsletter, 5-col links, socials, legal) directly. Does NOT load `/footer` fragment.
- `hero.js` — Renders DXP AI hero section (orbs, heading, dashboard card, trust badges) directly.

### Data-Driven Blocks (map EDS row/cell data from AEM)
All other blocks receive AEM content as `div > div > div` structure and transform it:

- **carousel:** cells[0]=category, [1]=title, [2]=richtext, [3]=ctaUrl, [4]=ctaText → `div.carousel__slide > article.carousel__card`
- **cta:** cells[0]=overline, [1]=heading, [2]=description, [3]=primaryText, [4]=primaryUrl, [5]=secondaryText, [6]=secondaryUrl, [7]=metaText
- **features / who-uses:** cells[0]=icon, [1]=title, [2]=description, [3]=link → `article.feature-card`
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

## Full Documentation

See [`docs/aem-dev/`](./docs/aem-dev/README.md) for:
- `01-project-overview.md` — goals, full directory structure, tech stack
- `02-setup-guide.md` — step-by-step environment setup
- `03-architecture.md` — system diagrams, XWalk pattern, loading phases
- `04-block-development-guide.md` — creating new blocks step by step
- `05-universal-editor-guide.md` — UE models, definitions, filters in depth
- `06-css-design-system.md` — all design tokens, patterns, responsive rules
- `09-eds-content-query-api.md` — query index, sitemap, API endpoints
