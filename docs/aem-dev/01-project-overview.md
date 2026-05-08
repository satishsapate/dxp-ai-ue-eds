# DXP AI - AEM + Universal Editor + EDS Project Overview

## Project Identity

| Property | Value |
|---|---|
| Project Name | dxp-ai-ue-eds |
| Base Boilerplate | [aem-boilerplate-xwalk](https://github.com/adobe-rnd/aem-boilerplate-xwalk) |
| AEM Package | `@adobe/aem-boilerplate` v1.3.0 |
| License | Apache 2.0 |
| Node.js Requirement | >= 18.3 |
| AEM Cloud Requirement | >= 2024.8 |

## What This Project Is

This is a **headless Digital Experience Platform (DXP)** implementation using three Adobe technologies working together:

| Layer | Technology | Role |
|---|---|---|
| Content Authoring | AEM Universal Editor (UE) | WYSIWYG editor, component configuration |
| Content Storage | AEM Cloud Service (JCR) | Content repository, component models |
| Content Delivery | Adobe Edge Delivery Services (EDS) | CDN-based headless rendering |

The combination is called **"XWalk"** (Cross-Walk) - Adobe's pattern for connecting Universal Editor authoring with EDS rendering.

## Project Goals

- **Headless DXP website** - content authored in AEM, rendered via EDS
- **AI-first DXP product** - DXP AI brand, targeting AI/ML solutions market
- **Universal Editor authoring** - structured WYSIWYG editing with component models
- **Edge Delivery performance** - Lighthouse 100 performance targets
- **Component-based architecture** - 25+ reusable block components

## Repository Structure

```
dxp-ai-ue-eds/
├── blocks/                      # 25 reusable EDS block components
│   ├── accordion/               # Expandable FAQ section
│   ├── articles/                # Article listing
│   ├── breadcrumb/              # Navigation breadcrumbs
│   ├── cards/                   # Card grid layout
│   ├── carousel/                # Image/content carousel
│   ├── cms-compat/              # CMS compatibility layer
│   ├── columns/                 # Multi-column layouts
│   ├── cta/                     # Call-to-action section
│   ├── features/                # Features list
│   ├── footer/                  # Site footer
│   ├── fragment/                # Reusable fragment/content
│   ├── header/                  # Site navigation header
│   ├── hero/                    # Hero banner
│   ├── page-hero/               # Page-specific hero
│   ├── pricing/                 # Pricing table
│   ├── richtext/                # Rich text editor block
│   ├── section-dark/            # Dark background section
│   ├── section-generic/         # Generic section wrapper
│   ├── section-light/           # Light background section
│   ├── stats-band/              # Statistics display band
│   ├── team/                    # Team member showcase
│   ├── timeline/                # Timeline/history display
│   └── who-uses/               # Client/customer logos
├── models/                      # Universal Editor component models (source)
│   ├── _component-definition.json  # Aggregator (uses $ref)
│   ├── _component-filters.json     # Aggregator (uses $ref)
│   ├── _section.json
│   ├── _text.json
│   ├── _title.json
│   ├── _image.json
│   └── _button.json
├── scripts/                     # Core EDS JavaScript
│   ├── aem.js                   # EDS core library (RUM, block loading)
│   ├── scripts.js               # App initialization and loading phases
│   ├── editor-support.js        # Universal Editor integration
│   ├── editor-support-rte.js    # RTE support for Universal Editor
│   ├── delayed.js               # Deferred functionality
│   ├── dompurify.min.js         # XSS sanitization
│   └── start.js                 # Local dev server (port 3000)
├── styles/                      # Global design system CSS
│   ├── styles.css               # Design tokens + global styles
│   ├── fonts.css                # Roboto font face declarations
│   └── lazy-styles.css          # Deferred CSS placeholder
├── html-kit/dxp-ai/            # Static HTML prototype kit
│   ├── assets/css/              # SCSS design system files
│   ├── assets/images/           # Brand assets, logos
│   └── components/              # Component HTML + SCSS prototypes
├── tools/sidekick/config.json  # AEM Sidekick configuration
├── fonts/                       # Font files (WOFF2)
├── icons/                       # Icon SVG assets
├── head.html                    # Global <head> template
├── 404.html                     # 404 error page
├── helix-query.yaml             # EDS query index configuration
├── helix-sitemap.yaml           # Sitemap generation config
├── fstab.yaml                   # AEM file system sync mount points
├── paths.json                   # AEM Sync file mapping config
├── component-definition.json   # BUILT - All UE component definitions
├── component-filters.json       # BUILT - UE composition rules
├── component-models.json        # BUILT - UE component data models
├── package.json                 # npm project configuration
└── .env                         # Local environment variables
```

## Technology Stack

**Frontend:**
- HTML5, CSS3 (custom properties / variables)
- JavaScript ES Modules (no framework/bundler)
- Roboto font family (WOFF2, unicode-range optimized)

**AEM / Adobe:**
- AEM Cloud Service (content repository)
- Universal Editor (WYSIWYG authoring)
- Edge Delivery Services (CDN rendering)
- AEM Sidekick (preview/publish Chrome extension)
- Franklin / Helix runtime

**Development Tooling:**
- Node.js 18+ (dev server, build scripts)
- ESLint (airbnb-base + xwalk plugin)
- Stylelint (stylelint-config-standard)
- Husky (pre-commit linting hooks)
- merge-json-cli (JSON model aggregation)
- Renovate (automated dependency updates)

## Content Architecture

```
Page (JCR node in AEM)
  └── main
       ├── Section 1
       │    ├── Hero block
       │    └── Text component
       ├── Section 2
       │    ├── Cards block
       │    │    ├── Card item 1
       │    │    └── Card item 2
       │    └── CTA block
       └── Section 3
            └── Footer block
```

Content flows: **AEM JCR → EDS CDN → Browser (rendered HTML)**

## Key Concepts

### Blocks
Each EDS block is a directory containing:
- `blockname.js` - decoration function, client-side logic
- `blockname.css` - block-specific styles
- `blockname.html` - Universal Editor authoring template
- `_blockname.json` - model/definition/filter for Universal Editor (source)
- `blockname.json` - built/merged component definition

### Component Models
Three JSON files power Universal Editor:
1. `component-definition.json` - what components exist, their templates
2. `component-models.json` - what editable fields each component has
3. `component-filters.json` - what can be nested inside what

### Loading Phases
EDS uses three-phase loading for optimal Lighthouse scores:
1. **Eager** - Critical CSS, LCP image (< 3KB inline)
2. **Lazy** - After first paint: fonts, blocks, sections
3. **Delayed** - 3 seconds after load: analytics, chat widgets

## Local Development URLs

| Environment | URL |
|---|---|
| AEM Author | http://localhost:4502 |
| AEM Publish | http://localhost:4503 |
| HTML Kit Dev Server | http://localhost:3000 |
| EDS Preview | https://{branch}--{repo}--{org}.hlx.page |
| EDS Live | https://{branch}--{repo}--{org}.hlx.live |
