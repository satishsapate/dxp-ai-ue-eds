# CSS Design System

The DXP AI project uses a **dark navy theme** with purple/cyan accents. All design values are expressed as CSS custom properties in `styles/styles.css`. Always consume tokens in block CSS — never hardcode colors, fonts, or sizes.

---

## Font Loading

Google Fonts are loaded via `@import` at the top of `styles/styles.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
```

**Typefaces:**

| Family | Weights | Role |
|---|---|---|
| `Sora` | 400, 600, 700, 800 | All headings (`--heading-font-family`) |
| `DM Sans` | 300, 400, 500, 600, 700 | All body text (`--body-font-family`) |

**Fallback fonts** are declared in `styles/fonts.css` using `@font-face` with `local('Arial')` and `size-adjust` to minimise Cumulative Layout Shift (CLS) while the Google Fonts stylesheet resolves:

```css
@font-face {
  font-family: sora-fallback;
  size-adjust: 105%;
  src: local('Arial');
}

@font-face {
  font-family: dm-sans-fallback;
  size-adjust: 100%;
  src: local('Arial');
}
```

Fonts are loaded in the **lazy phase** via `loadFonts()` in `scripts.js`. On desktop (>= 900px) or when the `fonts-loaded` sessionStorage key is present, they are promoted to the **eager phase** to avoid a visible swap on repeat visits.

---

## Design Tokens — Full Reference

### Core Palette

| Token | Value | Description |
|---|---|---|
| `--background-color` | `#0d0e2a` | Navy — main page background |
| `--light-color` | `#1a1b4b` | Dark blue — elevated surfaces |
| `--dark-color` | `#080a1e` | Deep background (darkest) |
| `--text-color` | `#f0f2ff` | Off-white — primary text |
| `--link-color` | `#7c3aed` | Purple — links and primary actions |
| `--link-hover-color` | `#9333ea` | Violet — link/button hover |

### Extended Palette

These are available globally and used directly in block CSS:

| Token | Value | Description |
|---|---|---|
| `--c-navy` | `#0d0e2a` | Page background alias |
| `--c-dark-blue` | `#1a1b4b` | Elevated surface alias |
| `--c-purple` | `#7c3aed` | Primary brand purple |
| `--c-violet` | `#9333ea` | Secondary brand violet |
| `--c-cyan` | `#06b6d4` | Accent cyan (icons, dots, overlines) |
| `--c-white` | `#ffffff` | Pure white |
| `--c-off-white` | `#f0f2ff` | Soft white for body text on dark bg |
| `--c-mid-gray` | `#6b7aab` | Muted text, secondary labels |

### Gradients

| Token | Value | Use |
|---|---|---|
| `--gradient-dxp` | `linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #9333ea 100%)` | Primary brand gradient — buttons, highlights, gradient text |
| `--gradient-hero` | `linear-gradient(135deg, #0d0e2a 0%, #1a1b4b 40%, #2d1b69 100%)` | Hero section background |

### Typography

| Token | Value | Description |
|---|---|---|
| `--body-font-family` | `'DM Sans', dm-sans-fallback, sans-serif` | All body text |
| `--heading-font-family` | `'Sora', sora-fallback, sans-serif` | All headings |

**Body sizes** — identical on mobile and desktop (no breakpoint override):

| Token | Value | Use |
|---|---|---|
| `--body-font-size-m` | `18px` | Default body text |
| `--body-font-size-s` | `16px` | Secondary / supporting text |
| `--body-font-size-xs` | `14px` | Captions, labels |

**Heading sizes — mobile (default):**

| Token | Value | Heading |
|---|---|---|
| `--heading-font-size-xxl` | `48px` | h1 |
| `--heading-font-size-xl` | `38px` | h2 |
| `--heading-font-size-l` | `30px` | h3 |
| `--heading-font-size-m` | `24px` | h4 |
| `--heading-font-size-s` | `20px` | h5 |
| `--heading-font-size-xs` | `18px` | h6 |

**Heading sizes — desktop (>= 900px):**

| Token | Value | Heading |
|---|---|---|
| `--heading-font-size-xxl` | `56px` | h1 |
| `--heading-font-size-xl` | `44px` | h2 |
| `--heading-font-size-l` | `34px` | h3 |
| `--heading-font-size-m` | `28px` | h4 |
| `--heading-font-size-s` | `22px` | h5 |
| `--heading-font-size-xs` | `18px` | h6 |

### Layout

| Token | Value | Description |
|---|---|---|
| `--nav-height` | `72px` | Fixed header height |

Section container rules:

```css
main > .section {
  margin: 0;                    /* sections sit flush — no gap between them */
}

main > .section > div {
  max-width: 1280px;
  margin: auto;
  padding: 0 24px;              /* mobile */
}

@media (width >= 900px) {
  main > .section > div {
    padding: 0 32px;            /* desktop */
  }
}
```

### Shape and Shadow

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | `8px` | Small elements (tags, badges) |
| `--radius-md` | `14px` | Inputs, small cards |
| `--radius-lg` | `20px` | Cards, panels (most common) |
| `--radius-xl` | `28px` | Large modals, hero cards |
| `--shadow-md` | `0 4px 20px rgba(13, 14, 42, 0.4)` | Card resting elevation |
| `--shadow-lg` | `0 12px 40px rgba(13, 14, 42, 0.5)` | Hover lift state |
| `--shadow-glow` | `0 0 40px rgba(124, 58, 237, 0.35)` | Purple glow on focus/hover |

---

## Global Styles

### Headings

```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--heading-font-family);
  font-weight: 600;
  line-height: 1.25;
  margin-top: 0.8em;
  margin-bottom: 0.25em;
  scroll-margin: 40px;
  color: var(--text-color);
}

h1 { font-size: var(--heading-font-size-xxl); }
h2 { font-size: var(--heading-font-size-xl); }
h3 { font-size: var(--heading-font-size-l); }
h4 { font-size: var(--heading-font-size-m); }
h5 { font-size: var(--heading-font-size-s); }
h6 { font-size: var(--heading-font-size-xs); }
```

### Links

```css
a:any-link {
  color: var(--link-color);
  text-decoration: none;
  overflow-wrap: break-word;
}

a:hover {
  color: var(--link-hover-color);
  text-decoration: underline;
}
```

### Buttons

**HTML structure expected by global button styles:**

```html
<p class="button-container">
  <a href="/path" title="Get Started" class="button primary">Get Started</a>
</p>
```

**Primary button (default):**

```css
a.button:any-link, button {
  border-radius: 999px;           /* pill shape */
  padding: 0.6em 1.5em;
  font-weight: 600;
  background: linear-gradient(135deg, #7c3aed, #9333ea);  /* --gradient-dxp short */
  color: #fff;
  transition: all 0.25s ease;
  text-decoration: none;
  display: inline-block;
}
```

**Hover state:**

```css
a.button:hover, button:hover {
  background: linear-gradient(135deg, #6d28d9, #7c3aed);
  box-shadow: var(--shadow-glow);
  transform: translateY(-1px);
}
```

**Secondary variant:**

```css
a.button.secondary, button.secondary {
  background: transparent;
  border: 1.5px solid rgba(124, 58, 237, 0.5);
  color: var(--c-off-white);
}

a.button.secondary:hover, button.secondary:hover {
  border-color: var(--c-purple);
  background: rgba(124, 58, 237, 0.1);
}
```

---

## Section Variants

Apply these CSS classes to section blocks in Universal Editor to change the background:

| Section class | Background | Token |
|---|---|---|
| *(default)* | `#0d0e2a` | `--background-color` |
| `.light` or `.highlight` | `#1a1b4b` | `--light-color` |
| `.dark` | `#080a1e` | `--dark-color` |

```css
main .section.light,
main .section.highlight {
  background-color: var(--light-color);   /* #1a1b4b */
}

main .section.dark {
  background-color: var(--dark-color);    /* #080a1e */
}
```

Dedicated section-variant blocks (`section-light`, `section-dark`, `section-generic`) wrap content so authors can apply visual backgrounds without needing CSS class knowledge.

---

## Responsive Design Breakpoints

This project uses a **mobile-first** approach with a **single breakpoint**:

```css
/* Default styles apply at all widths (mobile-first) */

@media (width >= 900px) {
  /* Desktop overrides */
}
```

The 900px breakpoint is used consistently across:
- Global heading sizes (see token table above)
- Navigation (hamburger menu vs. full nav)
- Block grid layouts (single column → multi-column)

Body font sizes do **not** change at the breakpoint — they are fixed at their desktop values for all viewports.

---

## Block CSS Patterns

### Block-scoped CSS Variables

Every block defines its own `--blockname-*` variables in `:root` so overrides are predictable:

```css
:root {
  --features-gap: 24px;
  --features-radius: 20px;
  --features-bg: rgba(255, 255, 255, 0.04);
  --features-border: rgba(124, 58, 237, 0.18);
  --features-heading: var(--c-off-white);
  --features-copy: rgba(255, 255, 255, 0.65);
}
```

### Glass-Morphism Card

The dominant card pattern across the project:

```css
.blockname-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(124, 58, 237, 0.18);
  border-radius: var(--radius-lg);          /* 20px */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--shadow-md);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}

.blockname-card:hover {
  box-shadow: var(--shadow-lg), var(--shadow-glow);
  transform: translateY(-4px);
}
```

### Gradient Text

Used for section headings and hero text to render the DXP brand gradient:

```css
.blockname h2 {
  background: var(--gradient-dxp);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Overline Labels

Small uppercase category labels above headings:

```css
.blockname-overline {
  color: var(--c-purple);           /* or var(--c-cyan) for variety */
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: var(--body-font-size-xs);
  font-weight: 700;
}
```

### Bullet Dots (Lists)

Feature lists and card bullet points use a pseudo-element dot instead of list-style:

```css
.blockname-item::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--c-cyan);
  flex-shrink: 0;
  margin-top: 0.5em;
}
```

### Standard Responsive Block Grid

```css
.blockname-grid {
  display: grid;
  grid-template-columns: 1fr;           /* mobile: single column */
  gap: var(--features-gap, 24px);
}

@media (width >= 900px) {
  .blockname-grid {
    grid-template-columns: repeat(3, 1fr);  /* desktop: 3 columns */
  }
}
```

### Using Design Tokens in Block CSS

```css
/* Do this — always reference tokens */
.myblock h2 {
  font-family: var(--heading-font-family);
  font-size: var(--heading-font-size-l);
  color: var(--text-color);
}

.myblock p {
  font-size: var(--body-font-size-m);
  color: var(--c-mid-gray);
}

/* Never do this — hardcoded values */
.myblock h2 {
  font-family: 'Sora', sans-serif;  /* wrong */
  font-size: 34px;                  /* wrong */
  color: #f0f2ff;                   /* wrong */
}
```

---

## Icons

Icons are SVG files in the `/icons/` directory. The EDS runtime resolves `<span class="icon icon-*">` references and injects inline SVG automatically:

```html
<!-- In authored HTML -->
<span class="icon icon-arrow-right"></span>

<!-- EDS loads /icons/arrow-right.svg and injects it inline -->
```

Global icon sizing:

```css
.icon {
  display: inline-block;
  height: 24px;
  width: 24px;
}

.icon img,
.icon svg {
  height: 100%;
  width: 100%;
}
```

For coloured icons on the dark background, use `fill: currentColor` in the SVG so the icon inherits the parent's `color` value.

---

## Accessibility CSS Considerations

### Focus Indicators

Dark backgrounds reduce default focus ring visibility. Always apply a visible focus outline:

```css
a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--c-purple);
  outline-offset: 3px;
  box-shadow: var(--shadow-glow);
}
```

### Colour Contrast

The dark theme provides strong contrast for the default text (`--text-color: #f0f2ff`) on `--background-color: #0d0e2a`. However, muted colours like `--c-mid-gray` (`#6b7aab`) must only be used for secondary/supporting text, not for primary readable content, to meet WCAG AA contrast ratios.

### Screen Reader Utility

```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);   /* modern replacement for deprecated clip: rect() */
  white-space: nowrap;
  border: 0;
}
```

> **Note:** `clip: rect(0, 0, 0, 0)` is deprecated. Stylelint (`property-no-deprecated`) will error on it. Always use `clip-path: inset(50%)` instead.

### Motion Reduction

Wrap transitions and animations in a motion-safe guard:

```css
@media (prefers-reduced-motion: no-preference) {
  .blockname-card {
    transition: box-shadow 0.25s ease, transform 0.25s ease;
  }
}
```

---

## CSS Lint Rules — Common Gotchas

Stylelint is configured with `stylelint-config-standard`. These rules cause the most issues when writing block CSS:

### 1. Color function notation (`color-function-notation`)
**Error:** `Unexpected deprecated color-function-notation "legacy"`  
**Cause:** Using `rgba(x, y, z, a)` old notation  
**Fix:** Use `rgb(x y z / a%)` modern notation — or run `npm run lint:css -- --fix` to auto-convert

```css
/* wrong */
background: rgba(255, 255, 255, 0.04);
border-color: rgba(124, 58, 237, 0.18);

/* correct */
background: rgb(255 255 255 / 4%);
border-color: rgb(124 58 237 / 18%);
```

### 2. Deprecated `clip` property (`property-no-deprecated`)
**Error:** `Unexpected deprecated property "clip"`  
**Fix:** Replace `clip: rect(0, 0, 0, 0)` with `clip-path: inset(50%)` in visually-hidden patterns.

### 3. Single-line declaration blocks (`declaration-block-single-line-max-declarations`)
**Error:** `Expected no more than 1 declaration`  
**Cause:** Multiple CSS declarations on one line (commonly in `@keyframes`)  
**Fix:** Expand to multi-line:

```css
/* wrong */
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

/* correct */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}
```

### 4. Descending specificity (`no-descending-specificity`)
**Error:** `Expected selector "X" to come before selector "Y"`  
**Cause:** A lower-specificity selector targeting the same elements appears *after* a higher-specificity one  
**Fix:** Reorder so lower-specificity rules come first:

```css
/* wrong — .menu a (0,2,1) comes after .nav-item > a:hover (0,2,2) */
header .nav-item > a:hover { color: #fff; }
...
header .nav-mobile-menu a { color: rgb(255 255 255 / 80%); }

/* correct — lower specificity first */
header .nav-mobile-menu a { color: rgb(255 255 255 / 80%); }
...
header .nav-item > a:hover { color: #fff; }
```

### 5. Duplicate properties (`declaration-block-no-duplicate-properties`)
**Error:** `Unexpected duplicate "background-clip"`  
**Cause:** Writing vendor-prefix pattern with the standard property twice  
**Fix:** `--fix` handles this automatically. If you need both prefixed and unprefixed, put `-webkit-` first.

### Quick lint fix workflow
```bash
npm run lint:css -- --fix   # auto-fix color notation, duplicates (handles ~70% of issues)
npm run lint:css            # see remaining manual fixes
npm run lint                # full JS + CSS check
```

---

## HTML Kit (SCSS Source)

For complex designs, SCSS source files live in `html-kit/dxp-ai/assets/css/`:

| File | Purpose |
|---|---|
| `_variables.scss` | SCSS variables — mirrors the CSS custom properties above |
| `_base.scss` | Base typography, body reset |
| `_a11y.scss` | Accessibility-specific styles |
| `_icons.scss` | Icon system styles |

The compiled output is `html-kit/dxp-ai/assets/css/main.css`.

**Workflow:** Design in SCSS prototype → convert variable values to CSS custom properties → implement in block CSS.
