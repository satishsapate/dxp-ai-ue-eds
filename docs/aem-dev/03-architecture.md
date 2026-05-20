# Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        AUTHORING LAYER                          │
│                                                                 │
│   ┌─────────────────────────────────────────────────────┐      │
│   │           AEM Universal Editor (Browser)             │      │
│   │   - WYSIWYG block editing                           │      │
│   │   - Component picker (component-definition.json)    │      │
│   │   - Field panels (component-models.json)            │      │
│   │   - Nesting rules (component-filters.json)          │      │
│   └───────────────────────┬─────────────────────────────┘      │
│                           │ REST / JCR API                      │
│   ┌───────────────────────▼─────────────────────────────┐      │
│   │         AEM Cloud Service (Author Instance)          │      │
│   │   - JCR content repository                          │      │
│   │   - /content/my-dxp-site/ (page content)            │      │
│   │   - /conf/dxp-ai-ue-eds/ (models/configs)          │      │
│   └───────────────────────┬─────────────────────────────┘      │
└───────────────────────────┼─────────────────────────────────────┘
                            │ Publish / Sync
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DELIVERY LAYER                           │
│                                                                 │
│   ┌─────────────────────────────────────────────────────┐      │
│   │          Adobe Edge Delivery Services (EDS)          │      │
│   │   - Content served from CDN edge nodes              │      │
│   │   - HTML rendering from AEM content                 │      │
│   │   - Block hydration (JS decoration)                 │      │
│   │   - Preview: {branch}--{repo}--{org}.hlx.page      │      │
│   │   - Live: {branch}--{repo}--{org}.hlx.live         │      │
│   └───────────────────────┬─────────────────────────────┘      │
│                           │                                     │
│   ┌───────────────────────▼─────────────────────────────┐      │
│   │                Browser / Client                      │      │
│   │   1. HTML + CSS delivered (no JS framework)         │      │
│   │   2. aem.js loads and decorates blocks              │      │
│   │   3. scripts.js runs eager/lazy/delayed phases      │      │
│   │   4. Block JS files hydrate interactive components  │      │
│   └─────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

## XWalk Pattern (Cross-Walk)

XWalk is the integration pattern connecting Universal Editor with EDS:

```
AEM Author (JCR)           EDS Rendering
─────────────────          ─────────────────
Content node               HTML table markup
  cq:model → blockname     <div class="blockname">
  field: value     →         <div><div>value</div></div>
  field: value     →         <div><div>value</div></div>
                            </div>
```

The Universal Editor saves structured data to JCR. EDS transforms the JCR content into HTML table format, then the block's JS `decorate()` function converts that into final rendered HTML.

## Component Model Flow

```
Developer writes:              Build produces:
─────────────────              ────────────────
blocks/cards/             →    component-definition.json
  _cards.json             →    component-models.json
models/_section.json      →    component-filters.json
models/_button.json
                               ↓ deployed to AEM
                          /conf/dxp-ai-ue-eds/settings/
                               ↓ loaded by
                          Universal Editor sidebar
```

**Build command:** `npm run build:json`

Uses `merge-json-cli` to aggregate all `_*.json` files via `$ref` pointers in `models/_component-definition.json`.

## Block Architecture

Every block follows this contract:

### Directory Structure
```
blocks/blockname/
├── blockname.js        # Required: exports default decorate(block) function
├── blockname.css       # Required: scoped block styles
├── blockname.html      # Required: UE authoring template
└── _blockname.json     # Required: UE model/definition/filter source
```

### JavaScript Contract
```javascript
// blockname.js
export default function decorate(block) {
  // block = DOM element with class "blockname"
  // Transform the raw HTML table structure into final markup
  // Called by aem.js during block loading phase
}
```

### HTML Template (for Universal Editor)
```html
<div class="blockname" data-block-name="blockname">
  <div data-field="fieldname" data-type="text">Default value</div>
  <!-- data-field binds to component model field name -->
  <!-- data-type: text | richtext | reference | multiselect -->
</div>
```

### JSON Model Source (`_blockname.json`)
```json
{
  "definitions": [{
    "title": "Block Name",
    "id": "blockname",
    "plugins": {
      "xwalk": {
        "page": {
          "resourceType": "core/franklin/components/block/v1/block",
          "template": {
            "name": "Block Name",
            "model": "blockname",
            "fieldname": "default value"
          }
        }
      }
    }
  }],
  "models": [{
    "id": "blockname",
    "fields": [
      {
        "component": "text",
        "name": "fieldname",
        "label": "Field Label"
      }
    ]
  }],
  "filters": []
}
```

## Block Rendering Strategies

### Strategy 1: Direct HTML Render (Static Blocks)
Used when the block's visual structure is fixed and doesn't depend on AEM-authored fields.
The `decorate()` function sets `block.innerHTML` directly and ignores the EDS row/cell input.

**Blocks using this pattern:**
- `header.js` — Full DXP AI navigation with dropdowns and mobile menu
- `footer.js` — Full DXP AI footer with newsletter, links, socials, legal
- `hero.js` — DXP AI hero section with decorative orbs and dashboard card visual

```javascript
export default function decorate(block) {
  block.textContent = ''; // clear EDS content
  block.innerHTML = `<div class="hero-inner">...</div>`;
  // wire up JS interactions
}
```

### Strategy 2: Data-Driven Mapping (Dynamic Blocks)
Used for content-editable blocks. EDS delivers AEM fields as `div > div > div` rows/cells.
The `decorate()` function maps cells to semantic HTML.

```
AEM model fields → EDS row/cells → decorate() → Final HTML
```

**Cell mapping examples:**
| Block | cells[0] | cells[1] | cells[2] | cells[3] |
|---|---|---|---|---|
| carousel-item | category | title | richtext content | ctaUrl link |
| cta | overline | heading | description | primaryText |
| features/who-uses | icon emoji | title | description | link |
| stats-band | stat value | stat label | — | — |

**Pattern:**
```javascript
export default function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    const card = document.createElement('article');
    if (cells[0]) { /* map cell 0 */ }
    if (cells[1]) { /* map cell 1 */ }
    row.remove();
    block.append(card);
  });
}
```

### Key Rule: moveInstrumentation
Always call `moveInstrumentation(sourceEl, targetEl)` when replacing EDS-generated elements to preserve Universal Editor `data-aue-*` attributes for in-context editing.

## Content Composition Rules

Defined in `component-filters.json`:

```
main (page body)
└── section (layout wrapper)
     ├── text
     ├── image
     ├── button
     ├── title
     ├── hero
     ├── cards
     │    └── card (item)
     ├── columns
     │    └── column
     │         ├── text
     │         ├── image
     │         ├── button
     │         └── title
     └── fragment
```

Blocks NOT in filters cannot be added to sections directly - they require their own container or are configured separately.

## JavaScript Loading Architecture

```
Browser loads HTML + CSS (from EDS CDN)
         │
         ▼
scripts.js starts (ES module, defer)
         │
         ├── loadEager()        ← synchronous, blocks render
         │    ├── decorate <head> elements
         │    ├── load first section (LCP optimization)
         │    └── load fonts if desktop or cached
         │
         ├── loadLazy()         ← async, after first paint
         │    ├── load header block
         │    ├── load all remaining sections
         │    ├── load footer block
         │    ├── load lazy-styles.css
         │    └── load fonts
         │
         └── loadDelayed()      ← setTimeout 3000ms
              └── import delayed.js (analytics, chat, etc.)
```

### Actual `scripts.js` Source

```javascript
import {
  loadHeader, loadFooter, decorateButtons, decorateIcons,
  decorateSections, decorateBlocks, decorateTemplateAndTheme,
  waitForFirstImage, loadSection, loadSections, loadCSS,
} from './aem.js';

// Moves all attributes from one element to another
export function moveAttributes(from, to, attributes) {
  if (!attributes) {
    attributes = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attributes.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) { to?.setAttribute(attr, value); from.removeAttribute(attr); }
  });
}

// Moves Universal Editor instrumentation attributes (data-aue-*, data-richtext-*)
export function moveInstrumentation(from, to) {
  moveAttributes(
    from, to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')),
  );
}

async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost'))
      sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) { /* do nothing */ }
}

export function decorateMain(main) {
  decorateButtons(main);
  decorateIcons(main);
  // buildAutoBlocks(main); // placeholder — add auto-block logic here if needed
  decorateSections(main);
  decorateBlocks(main);
}

// EAGER — blocks first paint / LCP
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }
  try {
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) loadFonts();
  } catch (e) { /* do nothing */ }
}

// LAZY — after first paint
async function loadLazy(doc) {
  loadHeader(doc.querySelector('header'));
  const main = doc.querySelector('main');
  await loadSections(main);
  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();
  loadFooter(doc.querySelector('footer'));
  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

// DELAYED — 3 seconds after load
function loadDelayed() {
  window.setTimeout(() => import('./delayed.js'), 3000);
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
```

## AEM.js Block Loading

```
aem.js loadBlock(block):
1. Find block class name (e.g., "cards")
2. Load /blocks/cards/cards.js (dynamic import)
3. Load /blocks/cards/cards.css (link inject)
4. Call decorate(block) with DOM element
5. Mark block as "loaded" (class: "cards is-loaded")
```

## Universal Editor Integration Points

### head.html (CSP + Scripts)
```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'nonce-aem' 'strict-dynamic'...">
<script type="module" src="/scripts/aem.js"></script>
<script type="module" src="/scripts/scripts.js"></script>
<link rel="stylesheet" href="/styles/styles.css">
```

### editor-support.js
- Detects Universal Editor context
- Enables in-context editing features
- Handles instrumentation for field binding

### editor-support-rte.js
- Rich Text Editor plugin for Universal Editor
- Enables rich text editing of richtext fields

### Instrumentation (data-aue-* attributes)
When the editor-support scripts detect the Universal Editor context, they add `data-aue-*` attributes to the DOM:
```html
<div data-aue-resource="urn:aem:/content/page/jcr:content/root/section/hero"
     data-aue-type="component"
     data-aue-model="hero"
     data-aue-label="Hero">
```

## CSS Architecture

### Design Tokens (CSS Custom Properties)
Defined in `:root` in `styles/styles.css`:

```css
:root {
  /* DXP AI dark theme */
  --background-color: #0d0e2a;  /* navy background */
  --text-color: #f0f2ff;        /* off-white text */
  --link-color: #7c3aed;        /* purple */
  --c-navy: #0d0e2a;
  --c-purple: #7c3aed;
  --c-cyan: #06b6d4;
  --c-off-white: #f0f2ff;
  --gradient-dxp: linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #9333ea 100%);
  --body-font-family: 'DM Sans', dm-sans-fallback, sans-serif;
  --heading-font-family: 'Sora', sora-fallback, sans-serif;
  --nav-height: 72px;
}

/* Desktop breakpoint: 900px */
@media (width >= 900px) {
  :root {
    --body-font-size-m: 18px;
    --body-font-size-s: 16px;
    /* heading sizes adjust down for desktop */
  }
}
```

### Block CSS Scoping
Each block's CSS uses the block class as a scope:
```css
/* blocks/cards/cards.css */
.cards { ... }        /* block wrapper */
.cards > div { ... }  /* row */
.cards .icon { ... }  /* nested elements */
```

### Section Variants
Sections can have style classes applied by authors:
- `.section.highlight` - highlighted background section
- `.section-dark` - dark background variant (separate block)
- `.section-light` - light background variant (separate block)

## Performance Architecture

### Lighthouse 100 Strategy
1. **No render-blocking resources** - scripts use `type="module"` (deferred by default)
2. **Critical CSS inlined** - first section styled before JS runs
3. **LCP image preloaded** - first hero/image loaded in eager phase
4. **Font optimization** - `font-display: swap`, WOFF2 format, unicode-range subsetting
5. **Block lazy loading** - blocks outside viewport load after paint
6. **No framework overhead** - pure HTML/CSS/JS, no React/Vue/Angular

### RUM (Real User Monitoring)
`aem.js` includes built-in RUM tracking:
- Core Web Vitals (LCP, CLS, FID, INP)
- Error tracking (JS errors, resource failures)
- Weight-based sampling (not every page view tracked)
- UUID-based session tracking
- Data sent to: `https://rum.hlx.page/.rum/`

## Security Considerations

### Content Security Policy
`head.html` defines strict CSP:
```
default-src 'self'
script-src 'nonce-aem' 'strict-dynamic' 'unsafe-inline'
```

### XSS Prevention
`dompurify.min.js` is included for sanitizing any HTML from user-generated content or external sources.

### Path Traversal Protection
The dev server in `scripts/start.js` validates all request paths to prevent directory traversal attacks.

## fstab.yaml - Content Mount Points

```yaml
mountpoints:
  /:
    url: http://localhost:4502
  /content:
    url: http://localhost:4502/content
  /conf:
    url: http://localhost:4502/conf
```

EDS uses these mount points to fetch content from AEM when rendering pages.

## helix-query.yaml - Content Index

```yaml
version: 1
indices:
  pages:
    include:
      - /
    exclude:
      - '**.json'
    target: /query-index.json
    properties:
      lastModified:
        select: none
        value: ...
      robots:
        select: head > meta[name="robots"]
```

Powers the `/query-index.json` endpoint used by Articles and other listing blocks.
