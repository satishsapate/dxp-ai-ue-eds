# AEM Dev Documentation

This directory contains technical documentation for the `dxp-ai-ue-eds` project — the DXP AI headless website built with AEM + Universal Editor + Edge Delivery Services (XWalk pattern).

## Documents

| File | Description |
|---|---|
| [01-project-overview.md](./01-project-overview.md) | Project identity, goals, repository structure, design system, tech stack |
| [02-setup-guide.md](./02-setup-guide.md) | Development environment setup from scratch (AEM, EDS, GitHub) |
| [03-architecture.md](./03-architecture.md) | System architecture, XWalk pattern, block rendering strategies, loading phases |
| [04-block-development-guide.md](./04-block-development-guide.md) | Step-by-step guide to creating EDS blocks, patterns, CSS naming |
| [05-universal-editor-guide.md](./05-universal-editor-guide.md) | UE component models, definitions, filters, field types |
| [06-css-design-system.md](./06-css-design-system.md) | DXP AI dark theme tokens, glass-morphism patterns, responsive design |
| [07-claude-project-instructions.md](./07-claude-project-instructions.md) | How CLAUDE.md works (points to `/CLAUDE.md`) |
| [08-aem-package-creation.md](./08-aem-package-creation.md) | Creating and installing AEM content packages |
| [09-eds-content-query-api.md](./09-eds-content-query-api.md) | EDS query index, sitemap, API endpoints |
| [10-prompts-library.md](./10-prompts-library.md) | Reusable prompts for block creation, CSS fixes, UE models, and debugging |

## Quick Reference

### Daily Development Commands
```bash
npm run start          # HTML kit dev server at http://localhost:3000 (design reference)
npm run build:json     # Rebuild component JSON configs after any model change
npm run lint           # Check JS and CSS linting (ESLint + Stylelint)
npm run lint:fix       # Auto-fix linting issues
```

### New Block Checklist
- [ ] Reference `html-kit/dxp-ai/index.html` for target visual design
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
/content/my-dxp-site/                                       ↑
                                                    blocks/*.js decorates HTML
```

### Block Rendering Strategies
| Strategy | Blocks | When to use |
|---|---|---|
| Direct HTML render | header, footer, hero | Complex fixed structure — render HTML in JS directly |
| Data-driven mapping | all other blocks | AEM-authored content mapped from EDS row/cell structure |

### Component JSON Files (Build System)
- **Edit source:** `models/_*.json` and `blocks/*/_*.json`
- **Never edit directly:** `component-definition.json`, `component-models.json`, `component-filters.json`
- **Rebuild:** `npm run build:json`

### DXP AI Design Tokens (key values)
```css
/* Colors */
--background-color: #0d0e2a    /* navy page bg */
--text-color: #f0f2ff           /* off-white text */
--c-purple: #7c3aed             /* primary purple */
--c-cyan: #06b6d4               /* cyan accent */
--c-off-white: #f0f2ff          /* headings/labels */
--gradient-dxp: linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #9333ea 100%)

/* Fonts */
--body-font-family: 'DM Sans', dm-sans-fallback, sans-serif
--heading-font-family: 'Sora', sora-fallback, sans-serif

/* Layout */
--nav-height: 72px
/* max section width: 1280px */

/* Shape */
--radius-lg: 20px               /* card border-radius */
--shadow-glow: 0 0 40px rgba(124, 58, 237, 0.35)
```

### Single Breakpoint
```css
@media (width >= 900px) { /* desktop */ }
```

### Glass-Morphism Card Pattern
```css
.my-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(124, 58, 237, 0.18);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(8px);
}
```

### EDS Local URLs

| What | URL |
|---|---|
| AEM Author | http://localhost:4502 (admin/admin) |
| AEM Publish | http://localhost:4503 |
| HTML Kit dev server | http://localhost:3000 |
| EDS Preview | https://main--dxp-ai-ue-eds--satishsapate.aem.page/ |
| EDS Live | https://main--dxp-ai-ue-eds--satishsapate.aem.live/ |
