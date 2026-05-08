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

---

## Design Tokens — `styles/styles.css` (actual values)

```css
:root {
  /* colors */
  --background-color: white;
  --light-color: #f8f8f8;
  --dark-color: #505050;
  --text-color: #131313;
  --link-color: #3b63fb;
  --link-hover-color: #1d3ecf;

  /* fonts */
  --body-font-family: roboto, roboto-fallback, sans-serif;
  --heading-font-family: roboto-condensed, roboto-condensed-fallback, sans-serif;

  /* body sizes (mobile) */
  --body-font-size-m: 22px;
  --body-font-size-s: 19px;
  --body-font-size-xs: 17px;

  /* heading sizes (mobile) */
  --heading-font-size-xxl: 55px;
  --heading-font-size-xl:  44px;
  --heading-font-size-l:   34px;
  --heading-font-size-m:   27px;
  --heading-font-size-s:   24px;
  --heading-font-size-xs:  22px;

  /* layout */
  --nav-height: 64px;
}

/* desktop ≥ 900px overrides */
@media (width >= 900px) {
  :root {
    --body-font-size-m: 18px;
    --body-font-size-s: 16px;
    --body-font-size-xs: 14px;
    --heading-font-size-xxl: 45px;
    --heading-font-size-xl:  36px;
    --heading-font-size-l:   28px;
    --heading-font-size-m:   22px;
    --heading-font-size-s:   20px;
    --heading-font-size-xs:  18px;
  }
}
```

Section layout:
```css
main > .section { margin: 40px 0; }
main > .section > div { max-width: 1200px; margin: auto; padding: 0 24px; }
/* desktop */ padding: 0 32px;
/* highlight variant */ background-color: var(--light-color); margin: 0; padding: 40px 0;
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

```yaml
mountpoints:
  /:
    url: http://localhost:4502
  /content:
    url: http://localhost:4502/content
  /conf:
    url: http://localhost:4502/conf
```

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
