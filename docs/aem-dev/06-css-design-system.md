# CSS Design System

## Design Tokens (CSS Custom Properties)

All design values are defined as CSS custom properties in `styles/styles.css`. Always use these tokens in block CSS — never hardcode values.

### Full `styles/styles.css` (source of truth)

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
  --heading-font-size-xl: 44px;
  --heading-font-size-l: 34px;
  --heading-font-size-m: 27px;
  --heading-font-size-s: 24px;
  --heading-font-size-xs: 22px;

  /* nav height */
  --nav-height: 64px;
}

/* fallback fonts (reduce CLS) */
@font-face {
  font-family: roboto-condensed-fallback;
  size-adjust: 88.82%;
  src: local('Arial');
}
@font-face {
  font-family: roboto-fallback;
  size-adjust: 99.529%;
  src: local('Arial');
}

/* desktop overrides */
@media (width >= 900px) {
  :root {
    --body-font-size-m: 18px;
    --body-font-size-s: 16px;
    --body-font-size-xs: 14px;
    --heading-font-size-xxl: 45px;
    --heading-font-size-xl: 36px;
    --heading-font-size-l: 28px;
    --heading-font-size-m: 22px;
    --heading-font-size-s: 20px;
    --heading-font-size-xs: 18px;
  }
}

body { display: none; margin: 0; background-color: var(--background-color);
  color: var(--text-color); font-family: var(--body-font-family);
  font-size: var(--body-font-size-m); line-height: 1.6; }
body.appear { display: block; }

header { height: var(--nav-height); }
header .header, footer .footer { visibility: hidden; }
header .header[data-block-status="loaded"], footer .footer[data-block-status="loaded"] { visibility: visible; }

h1,h2,h3,h4,h5,h6 { margin-top: 0.8em; margin-bottom: 0.25em;
  font-family: var(--heading-font-family); font-weight: 600;
  line-height: 1.25; scroll-margin: 40px; }
h1 { font-size: var(--heading-font-size-xxl); }
h2 { font-size: var(--heading-font-size-xl); }
h3 { font-size: var(--heading-font-size-l); }
h4 { font-size: var(--heading-font-size-m); }
h5 { font-size: var(--heading-font-size-s); }
h6 { font-size: var(--heading-font-size-xs); }

/* sections */
main > .section { margin: 40px 0; }
main > .section > div { max-width: 1200px; margin: auto; padding: 0 24px; }
main > .section:first-of-type { margin-top: 0; }
@media (width >= 900px) { main > .section > div { padding: 0 32px; } }
main .section.light, main .section.highlight {
  background-color: var(--light-color); margin: 0; padding: 40px 0; }

/* links */
a:any-link { color: var(--link-color); text-decoration: none; overflow-wrap: break-word; }
a:hover { color: var(--link-hover-color); text-decoration: underline; }

/* buttons */
a.button:any-link, button {
  box-sizing: border-box; display: inline-block; max-width: 100%;
  margin: 12px 0; border: 2px solid transparent; border-radius: 2.4em;
  padding: 0.5em 1.2em; font-family: var(--body-font-family);
  font-style: normal; font-weight: 500; line-height: 1.25;
  text-align: center; text-decoration: none;
  background-color: var(--link-color); color: var(--background-color);
  cursor: pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
a.button:hover, a.button:focus, button:hover, button:focus {
  background-color: var(--link-hover-color); cursor: pointer; }
button:disabled, button:disabled:hover { background-color: var(--light-color); cursor: unset; }
a.button.secondary, button.secondary {
  background-color: unset; border: 2px solid currentcolor; color: var(--text-color); }

main img { max-width: 100%; width: auto; height: auto; }
.icon { display: inline-block; height: 24px; width: 24px; }
.icon img { height: 100%; width: 100%; }
```

### Token Quick Reference

| Token | Mobile | Desktop | Use for |
|---|---|---|---|
| `--background-color` | white | — | Page/component backgrounds |
| `--light-color` | #f8f8f8 | — | Subtle backgrounds, highlight sections |
| `--dark-color` | #505050 | — | Secondary text |
| `--text-color` | #131313 | — | Primary text |
| `--link-color` | #3b63fb | — | Links, primary button bg |
| `--link-hover-color` | #1d3ecf | — | Link/button hover |
| `--body-font-family` | roboto... | — | Body text |
| `--heading-font-family` | roboto-condensed... | — | All headings |
| `--body-font-size-m` | 22px | 18px | Default body |
| `--body-font-size-s` | 19px | 16px | Secondary |
| `--body-font-size-xs` | 17px | 14px | Captions |
| `--heading-font-size-xxl` | 55px | 45px | h1 |
| `--heading-font-size-xl` | 44px | 36px | h2 |
| `--heading-font-size-l` | 34px | 28px | h3 |
| `--heading-font-size-m` | 27px | 22px | h4 |
| `--heading-font-size-s` | 24px | 20px | h5 |
| `--heading-font-size-xs` | 22px | 18px | h6 |
| `--nav-height` | 64px | — | Header height |

## Font Loading

Fonts are declared in `styles/fonts.css` using `@font-face`:

```css
@font-face {
  font-family: roboto-fallback;
  size-adjust: 100.06%;
  ascent-override: 95%;
  src: local("Arial");
}

@font-face {
  font-family: roboto-condensed-fallback;
  size-adjust: 113%;
  ascent-override: 90%;
  src: local("Arial Narrow");
}

@font-face {
  font-family: roboto;
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("../fonts/roboto-400.woff2") format("woff2");
  unicode-range: U+0000-00FF, U+0131, ...;
}
```

**Key optimizations:**
- `font-display: swap` - prevents invisible text during font load
- `unicode-range` subsetting - only loads character ranges needed for the language
- Fallback fonts (`roboto-fallback`) use `size-adjust` to minimize CLS
- WOFF2 format only - best compression, wide browser support

Fonts load in the **lazy phase** via `loadFonts()` in `scripts.js`:
```javascript
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  // Cache in sessionStorage to avoid re-request
  document.body.classList.add('appear');
}
```

## Global Styles Reference

### Headings
```css
h1 { font-size: var(--heading-font-size-xxl); }
h2 { font-size: var(--heading-font-size-xl); }
h3 { font-size: var(--heading-font-size-l); }
h4 { font-size: var(--heading-font-size-m); }
h5 { font-size: var(--heading-font-size-s); }
h6 { font-size: var(--heading-font-size-xs); }

h1, h2, h3, h4, h5, h6 {
  font-family: var(--heading-font-family);
  font-weight: 600;
  line-height: 1.25;
  margin-top: 1em;
  margin-bottom: 0.5em;
  scroll-margin: calc(var(--nav-height) + 1em);
}
```

### Links
```css
a:any-link {
  color: var(--color-link);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
  color: var(--color-link-hover);
}
```

### Buttons

**HTML structure expected by global button styles:**
```html
<p class="button-container">
  <a href="/path" title="CTA" class="button primary">Click Here</a>
</p>
```

**Button variants:**
```css
a.button:any-link {
  font-family: var(--body-font-family);
  font-size: var(--body-font-size-s);
  background-color: var(--color-link);
  color: var(--color-background);
  border-radius: 30px;
  padding: 5px 30px;
}

a.button.secondary {
  background-color: unset;
  border: 2px solid currentcolor;
  color: var(--color-text);
}
```

### Sections

**Standard section layout:**
```css
.section {
  margin: 40px 0;
}

.section > div {
  max-width: 1200px;
  margin: auto;
  padding: 0 24px;
}

/* Full-width section variant */
.section.full-width > div {
  max-width: unset;
  padding: 0;
}

/* Highlighted section */
.section.highlight {
  background-color: var(--color-light);
}
```

## Responsive Design Breakpoints

This project uses a **mobile-first** approach with a single major breakpoint:

```css
/* Default: mobile styles */

/* Desktop: >= 900px */
@media (width >= 900px) {
  /* Desktop overrides */
}
```

The 900px breakpoint is used consistently across:
- Global styles (font sizes)
- Navigation (hamburger menu)
- Block layouts (grid columns)

## Block CSS Patterns

### Standard Block Layout
```css
.blockname {
  /* Block wrapper - usually full width */
}

.blockname > div {
  /* Content container with max-width */
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

/* Responsive grid */
.blockname .blockname-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (width < 900px) {
  .blockname .blockname-grid {
    grid-template-columns: 1fr;
  }
}
```

### Using Design Tokens in Blocks
```css
.myblock h2 {
  font-family: var(--heading-font-family);
  font-size: var(--heading-font-size-l);
  color: var(--color-text);
}

.myblock p {
  font-size: var(--body-font-size-m);
  color: var(--color-dark);
}

.myblock a.button {
  /* Inherits global button styles */
  /* Add overrides only if needed */
}
```

## Icons

Icons are SVG files in the `/icons/` directory. The EDS framework automatically resolves icon references:

```html
<!-- In HTML -->
<span class="icon icon-chevron"></span>

<!-- EDS loads /icons/chevron.svg and injects as inline SVG -->
```

Icon size is set globally:
```css
.icon {
  display: inline-block;
  height: 24px;
  width: 24px;
}

.icon img, .icon svg {
  height: 100%;
  width: 100%;
}
```

## Section Variants via Blocks

Instead of CSS classes on sections, this project uses dedicated section blocks:

| Block | Background | Text |
|---|---|---|
| `section-light` | Light (`--color-light`) | Default |
| `section-dark` | Dark (`#1a1a1a` or similar) | White |
| `section-generic` | White / transparent | Default |

These blocks wrap their content in the appropriate background, giving authors visual control without needing CSS class knowledge.

## HTML Kit (SCSS Source)

For complex designs, SCSS source files are in `html-kit/dxp-ai/assets/css/`:

| File | Purpose |
|---|---|
| `_variables.scss` | SCSS variables (mirrors CSS custom properties) |
| `_base.scss` | Base typography and body styles |
| `_a11y.scss` | Accessibility-specific styles |
| `_icons.scss` | Icon system styles |

The compiled CSS from SCSS is in `html-kit/dxp-ai/assets/css/main.css`.

**Workflow:** Design → SCSS prototype → Convert to CSS custom properties → Block CSS

## Accessibility CSS Considerations

```css
/* Focus visible for keyboard navigation */
a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--color-link);
  outline-offset: 2px;
}

/* Screen reader only class */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
}
```

## Performance CSS Rules

1. **Avoid `@import` in CSS** - use `<link>` tags instead (parallel loading)
2. **Use `font-display: swap`** - always on `@font-face`
3. **Minimize paint-triggering properties** - prefer `transform` over `top/left` for animations
4. **Use `contain: layout`** on isolated sections
5. **Lazy-load non-critical CSS** - use `loadCSS()` from `aem.js` for below-fold styles
