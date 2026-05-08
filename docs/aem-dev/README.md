# AEM Dev Documentation

This directory contains technical documentation for the `dxp-ai-ue-eds` project — a headless DXP implementation using AEM + Universal Editor + Edge Delivery Services.

## Documents

| File | Description |
|---|---|
| [01-project-overview.md](./01-project-overview.md) | Project identity, goals, repository structure, tech stack |
| [02-setup-guide.md](./02-setup-guide.md) | Development environment setup from scratch |
| [03-architecture.md](./03-architecture.md) | System architecture, XWalk pattern, loading phases |
| [04-block-development-guide.md](./04-block-development-guide.md) | Step-by-step guide to creating EDS blocks |
| [05-universal-editor-guide.md](./05-universal-editor-guide.md) | UE component models, definitions, filters |
| [06-css-design-system.md](./06-css-design-system.md) | Design tokens, CSS patterns, responsive design |
| [07-claude-project-instructions.md](./07-claude-project-instructions.md) | How CLAUDE.md works (points to `/CLAUDE.md`) |
| [08-files-to-upload-to-claude.md](./08-files-to-upload-to-claude.md) | Claude context strategy and maintenance guide |
| [09-eds-content-query-api.md](./09-eds-content-query-api.md) | EDS query index, sitemap, API endpoints |

## Quick Reference

### Daily Development Commands
```bash
npm run start          # Start HTML kit dev server (port 3000)
npm run build:json     # Rebuild component JSON configs after model changes
npm run lint           # Check JS and CSS linting
npm run lint:fix       # Auto-fix linting issues
```

### New Block Checklist
- [ ] Create `blocks/blockname/` directory
- [ ] Write `_blockname.json` (definitions + models + filters)
- [ ] Write `blockname.html` (UE authoring template with data-field attributes)
- [ ] Write `blockname.js` (exports `default function decorate(block)`)
- [ ] Write `blockname.css` (block-scoped styles using CSS custom properties)
- [ ] Run `npm run build:json`
- [ ] Add block ID to section filter in `component-filters.json` if needed
- [ ] Deploy updated JSON configs to AEM
- [ ] Test in Universal Editor

### Architecture Summary
```
AEM Author (JCR) → Universal Editor (WYSIWYG) → Publish → EDS CDN → Browser
                                                           ↑
                                                   blocks/*.js decorates HTML
```

### Component JSON Files (Build System)
- **Edit:** `models/_*.json` and `blocks/*/_*.json` (source files)
- **Never edit directly:** `component-definition.json`, `component-models.json`, `component-filters.json`
- **Rebuild:** `npm run build:json`

### CSS Design Tokens
```css
/* Colors */
var(--color-text)         /* #1a1a1a - primary text */
var(--color-link)         /* #1f78c1 - links */
var(--color-dark)         /* #707070 - secondary */
var(--color-light)        /* #f0f0f0 - backgrounds */

/* Fonts */
var(--body-font-family)      /* Roboto */
var(--heading-font-family)   /* Roboto Condensed */

/* Font Sizes */
var(--heading-font-size-xxl) /* 55px mobile / 45px desktop */
var(--body-font-size-m)      /* 22px mobile / 18px desktop */

/* Layout */
var(--nav-height)  /* 64px */
```

### Breakpoint
```css
@media (width >= 900px) { /* desktop */ }
```
