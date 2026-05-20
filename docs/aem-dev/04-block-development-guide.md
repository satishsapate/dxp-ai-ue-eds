# Block Development Guide

## What is a Block?

A block is the fundamental unit of content in AEM Edge Delivery Services. Each block:
- Has its own directory under `/blocks/`
- Defines its authoring interface (Universal Editor fields)
- Controls its own rendering (JS decoration function)
- Scopes its own styles (CSS)

## Existing Blocks Reference

| Block | Purpose | Has JS | Has CSS |
|---|---|---|---|
| accordion | Expandable FAQ sections | Yes | Yes |
| articles | Article listing with query index (full rewrite - builds card grid from data) | Yes | Yes |
| breadcrumb | Navigation breadcrumbs | Yes | Yes |
| cards | Card grid layout (3-col default) | Yes | Yes |
| carousel | Image/content slider | Yes | Yes |
| cms-compat | CMS compatibility shim | Yes | Yes |
| columns | Multi-column layout | Minimal | Yes |
| cta | Call-to-action with button (full field mapping: 8 fields → semantic CTA structure) | Yes | Yes |
| features | Feature list display | Minimal | Yes |
| footer | Site footer with newsletter | Yes | Yes |
| fragment | Reusable content fragments | Minimal | Yes |
| header | Site navigation + hamburger | Yes | Yes |
| hero | Full-width hero banner (renders full DXP AI hero HTML directly) | Yes | Yes |
| page-hero | Page-specific hero section | Minimal | Yes |
| pricing | Pricing plans table | Yes | Yes |
| richtext | Rich text content area | Minimal | Yes |
| section-dark | Dark background section | Minimal | Yes |
| section-generic | Generic section wrapper | Minimal | Yes |
| section-light | Light background section | Minimal | Yes |
| stats-band | Statistics display strip | No | Yes |
| team | Team member showcase | Yes | Yes |
| timeline | Timeline/history display | Yes | Yes |
| who-uses | Client logos/references | Yes | Yes |

## Creating a New Block (Step-by-Step)

### Step 1: Create Block Directory

```bash
mkdir blocks/myblock
```

### Step 2: Create the JSON Model Source (`_myblock.json`)

This is the source file that defines the block for Universal Editor. It contains three sections: `definitions`, `models`, and `filters`.

```json
{
  "definitions": [
    {
      "title": "My Block",
      "id": "myblock",
      "plugins": {
        "xwalk": {
          "page": {
            "resourceType": "core/franklin/components/block/v1/block",
            "template": {
              "name": "My Block",
              "model": "myblock",
              "heading": "Default Heading",
              "description": "Default description text"
            }
          }
        }
      }
    }
  ],
  "models": [
    {
      "id": "myblock",
      "fields": [
        {
          "component": "text",
          "name": "heading",
          "label": "Heading",
          "valueType": "string"
        },
        {
          "component": "richtext",
          "name": "description",
          "label": "Description"
        },
        {
          "component": "reference",
          "name": "image",
          "label": "Image",
          "valueType": "string"
        },
        {
          "component": "text",
          "name": "linkText",
          "label": "Link Text",
          "valueType": "string"
        },
        {
          "component": "aem-content",
          "name": "link",
          "label": "Link URL"
        }
      ]
    }
  ],
  "filters": []
}
```

### Component Field Types Reference

| `component` value | Editor UI | Content stored as |
|---|---|---|
| `text` | Single-line text input | Plain string |
| `richtext` | Rich text editor | HTML string |
| `reference` | Media picker (images/videos) | DAM path string |
| `aem-content` | Page/content picker | JCR path string |
| `select` | Dropdown selector | String enum value |
| `multiselect` | Multi-checkbox selector | Comma-separated string |
| `boolean` | Toggle switch | `true` / `false` string |
| `number` | Number input | Numeric string |

### Step 3: Create the HTML Template (`myblock.html`)

The HTML template is displayed in the Universal Editor authoring view. Use `data-field` to bind fields from the model.

```html
<div class="myblock" data-block-name="myblock">
  <div>
    <div data-field="heading" data-type="text">Default Heading</div>
    <div data-field="description" data-type="richtext"><p>Description text</p></div>
  </div>
  <div>
    <div data-field="image" data-type="reference"></div>
    <div data-field="linkText" data-type="text">Learn More</div>
  </div>
</div>
```

**Data attributes for Universal Editor:**
- `data-field="fieldname"` - binds to the model field with this name
- `data-type="text"` - display type hint for the editor
- `data-block-name="blockname"` - identifies this as a block

### Step 4: Create the JavaScript (`myblock.js`)

```javascript
export default function decorate(block) {
  // `block` is the DOM element with class "myblock"
  // It contains table-structured content from EDS
  
  // Example: extract first row, first cell as heading
  const rows = [...block.children];
  
  rows.forEach((row) => {
    const cells = [...row.children];
    // cells[0] = first column
    // cells[1] = second column
    
    // Transform or enhance the DOM structure
    // EDS has already created div > div > div structure
  });
  
  // Example: add event listener
  const button = block.querySelector('a');
  if (button) {
    button.classList.add('button');
    button.closest('div').classList.add('button-container');
  }
}
```

**Key patterns in block JS:**

```javascript
// Get all rows (each table row becomes a div)
const rows = [...block.children];

// Get cells from first row
const [firstCell, secondCell] = [...block.firstElementChild.children];

// Get text content
const heading = firstCell.textContent.trim();

// Get link href
const link = block.querySelector('a');
const href = link?.href;

// Get image
const img = block.querySelector('img');

// Create new elements
const wrapper = document.createElement('div');
wrapper.className = 'myblock-wrapper';
block.append(wrapper);

// Move elements
wrapper.append(firstCell);
block.innerHTML = '';
block.append(wrapper);
```

### Step 5: Create the CSS (`myblock.css`)

```css
/* Always scope to block class */
.myblock {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

.myblock > div {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: center;
}

.myblock h2 {
  font-family: var(--heading-font-family);
  font-size: var(--heading-font-size-l);
  color: var(--color-text);
}

.myblock p {
  font-size: var(--body-font-size-m);
  color: var(--color-dark);
}

.myblock img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

/* Mobile responsive */
@media (width < 900px) {
  .myblock > div {
    grid-template-columns: 1fr;
  }
}
```

**Always use CSS custom properties for colors and fonts!** Never hardcode colors in blocks - use `var(--color-text)`, `var(--body-font-family)`, etc.

### Step 6: Rebuild the JSON Models

```bash
npm run build:json
```

This merges your `_myblock.json` into the three configuration files. After running:
- `component-definition.json` now includes "My Block"
- `component-models.json` now includes the "myblock" model
- Deploy these files to AEM for the block to appear in Universal Editor

## Block HTML Structure from EDS

When EDS renders content authored in Universal Editor, blocks become HTML tables wrapped in divs. Understanding this structure is critical for writing the `decorate()` function.

### Simple Block (one row, two cells)
```
AEM Content:
  heading = "Hello World"
  description = "Some text"

EDS generates:
<div class="myblock">
  <div>                        ← row
    <div>Hello World</div>     ← cell 1 (heading)
    <div>Some text</div>       ← cell 2 (description)
  </div>
</div>
```

### Multi-row Block (e.g., Cards with items)
```
AEM Content:
  heading = "Our Cards"
  [card 1]: title = "Card A", text = "..."
  [card 2]: title = "Card B", text = "..."

EDS generates:
<div class="cards">
  <div>
    <div>Our Cards</div>      ← block header row
  </div>
  <div>                      ← card 1 row
    <div>Card A</div>
    <div>...</div>
  </div>
  <div>                      ← card 2 row
    <div>Card B</div>
    <div>...</div>
  </div>
</div>
```

### Block with Variants
Authors can apply named variants to blocks in Universal Editor. These appear as additional classes:
```html
<div class="cards filter">       ← "cards" block with "filter" variant
<div class="hero centered">      ← "hero" block with "centered" variant
```

Check for variants in JS:
```javascript
const isFiltered = block.classList.contains('filter');
const isCentered = block.classList.contains('centered');
```

## Blocks with Child Items

Some blocks contain repeating child items (e.g., Cards containing Card items). This requires:

### 1. Define child component in `_blockname.json`
```json
{
  "definitions": [
    {
      "title": "Cards",
      "id": "cards",
      "plugins": { "xwalk": { ... } }
    },
    {
      "title": "Card",
      "id": "card",
      "plugins": {
        "xwalk": {
          "page": {
            "resourceType": "core/franklin/components/block/v1/block/item",
            "template": { ... }
          }
        }
      }
    }
  ],
  "models": [...],
  "filters": [
    {
      "id": "cards",
      "components": ["card"]
    }
  ]
}
```

### 2. Add to component-filters.json
The filters section controls what child components can be added inside a parent:
```json
{
  "id": "cards",
  "components": ["card"]
}
```

## Using Fragments

Fragments allow reusing content across pages. The `fragment` block loads content from another page path:

```json
{
  "component": "aem-content",
  "name": "reference",
  "label": "Fragment Reference"
}
```

The fragment JS fetches the referenced page and injects its main section content.

## Header and Footer (Direct-Render Blocks)

The header and footer blocks render their HTML directly from JavaScript,
bypassing the EDS fragment/data-loading approach. This ensures the complex
visual design (dropdown navs, newsletter forms, social links) can be fully
controlled without AEM content constraints.

**header.js** — Renders complete DXP AI navigation:
- Fixed nav bar with `rgba(13,14,42,0.88)` glass background + blur
- Logo: "DXP AI" (gradient text) + "Powered by ZensAI" sub-label
- Desktop nav: Platform (dropdown), Solutions, Why DXP AI, Resources (dropdown), Pricing, About
- Actions: Login + Request Demo buttons
- Hamburger menu → `.nav-mobile-menu` slide-down on mobile
- Scroll effect: adds `.scrolled` class after 20px for stronger blur/shadow
- Keyboard accessible: Enter/Space toggles dropdowns, Escape closes

**footer.js** — Renders complete DXP AI footer:
- Newsletter section with email input + subscribe button
- 5-column grid: brand column (2fr) + Platform, Solutions, Resources, Company (1fr each)
- Social links: LinkedIn, X, YouTube, GitHub
- Divider + legal bar with certification badges

**hero.js** — Renders complete DXP AI hero:
- 3 decorative orbs (animated radial gradients)
- Left: eyebrow, h1 with gradient accent, subtext, CTA buttons, trust badges
- Right: simulated dashboard card with metrics and feature rows
- Scroll indicator animation

## Linting Rules for Blocks

### JavaScript (ESLint - airbnb-base)
- Use `const` and `let`, never `var`
- ES module imports must include `.js` extension
- No unused variables
- Prefer arrow functions
- xwalk-specific rules from `eslint-plugin-xwalk`

### CSS (Stylelint - standard)
- Use CSS custom properties (no hardcoded colors)
- Mobile-first responsive design
- Block-scoped selectors only (prefix with `.blockname`)
- No `!important`

Run linting before committing:
```bash
npm run lint
npm run lint:fix   # auto-fix where possible
```

## Block Development Workflow

0. **Reference** - Check `html-kit/dxp-ai/index.html` for the target visual design of the block
1. **Design** - Create HTML prototype in `html-kit/dxp-ai/components/myblock/`
2. **Model** - Define fields in `blocks/myblock/_myblock.json`
3. **Template** - Create authoring template in `blocks/myblock/myblock.html`
4. **Style** - Write scoped CSS in `blocks/myblock/myblock.css`
5. **Decorate** - Write decoration logic in `blocks/myblock/myblock.js`
6. **Build** - Run `npm run build:json` to update config files
7. **Deploy** - Push configs to AEM and test in Universal Editor
8. **Preview** - Preview on EDS via AEM Sidekick
9. **Lint** - Run `npm run lint` and fix any issues
10. **Commit** - Pre-commit hook runs linting automatically

## CSS Naming Patterns (DXP AI blocks)

Blocks use consistent CSS class naming conventions:

| Pattern | Class examples | Purpose |
|---|---|---|
| Block root | `.features`, `.carousel`, `.cta-block` | Block wrapper |
| Section heading | `.section-heading` | Overline + h2 + p intro |
| Overline | `.overline`, `.cta-overline`, `.rt-overline` | Uppercase label above heading |
| Icon box | `.fc-icon`, `.card-icon`, `.nav-dd-icon` | Square icon container |
| Tag/Badge | `.fc-tag`, `.card-category` | Pill-shaped label |
| List | `.fc-list`, `.card-points` | Bullet list with cyan dots |
| Link | `.fc-link`, `.card-cta` | "Learn more →" style link |
| Card | `.feature-card`, `.carousel__card` | Card container |
| Grid | `.cards-grid` | 3-column card grid |
| Value/Label | `.sv`/`.sl` (stats), `.hpc-val`/`.hpc-label` | Metric displays |
| Button | `.btn--primary`, `.btn--secondary` | CTA buttons |
| Meta | `.cta-meta`, `.hero-trust` | Fine print / trust text |
