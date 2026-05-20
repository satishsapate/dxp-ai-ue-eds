# dxp-ai-ue-eds — DXP AI Headless Website

AI-first Digital Experience Platform built by Zensar/ZensAI. A headless DXP website using AEM Cloud Service for content authoring via the Universal Editor, delivered to the browser through Edge Delivery Services.

## Environments

| Environment | URL |
|---|---|
| Preview | https://main--dxp-ai-ue-eds--satishsapate.aem.page/ |
| Live | https://main--dxp-ai-ue-eds--satishsapate.aem.live/ |
| AEM Author (local) | http://localhost:4502 |
| HTML Kit (local) | http://localhost:3000 |

## Project Overview

- **Stack:** AEM Cloud Service + Universal Editor (authoring) + Edge Delivery Services (rendering)
- **Pattern:** XWalk (Cross-Walk) — content is authored in AEM JCR via the Universal Editor; EDS fetches and delivers pages to the browser; block JavaScript decorates the resulting HTML
- **Brand:** DXP AI — dark navy theme (`#0d0e2a`), purple (`#7c3aed`) primary accent, Sora + DM Sans typefaces
- **Blocks:** 25 self-contained EDS block components under `blocks/`
- **Design reference:** `html-kit/dxp-ai/` — static HTML + SCSS prototype kit

## Prerequisites

- Node.js >= 18.3
- AEM Cloud Service >= 2024.8 (build `17465` or newer)
- [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) installed on this repository

## Installation

```sh
npm i
```

Create a `.env` file at the project root (gitignored):

```sh
AEM_HOST=http://localhost:4502
```

## Local Development Workflow

### HTML Kit (design prototype — no AEM required)

```sh
npm run start
```

Starts a static dev server at `http://localhost:3000` serving the HTML kit prototype under `html-kit/dxp-ai/`. Use this for front-end styling and layout work without needing a running AEM instance.

### AEM + Universal Editor (full stack)

1. Start AEM Author locally at `http://localhost:4502`
2. Open a page in AEM Sites and launch the Universal Editor
3. The Code Sync app keeps this repository in sync with the AEM instance
4. EDS Preview (`aem up` or the Sidekick) proxies content from AEM through EDS rendering

### After changing component models

```sh
npm run build:json
```

Regenerates `component-definition.json`, `component-models.json`, and `component-filters.json` from the source files in `models/` and `blocks/*/`. Never edit the built JSON files directly.

## npm Scripts

| Script | Description |
|---|---|
| `npm run start` | HTML kit dev server at http://localhost:3000 |
| `npm run build:json` | Rebuild all 3 component JSON configs |
| `npm run build:json:models` | Rebuild `component-models.json` only |
| `npm run build:json:definitions` | Rebuild `component-definition.json` only |
| `npm run build:json:filters` | Rebuild `component-filters.json` only |
| `npm run lint` | ESLint + Stylelint check |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run validate` | Custom project validation |

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

## Documentation

Full developer documentation is in [`docs/aem-dev/`](./docs/aem-dev/README.md):

- `01-project-overview.md` — goals, full directory structure, tech stack
- `02-setup-guide.md` — step-by-step environment setup
- `03-architecture.md` — system diagrams, XWalk pattern, loading phases
- `04-block-development-guide.md` — creating new blocks step by step
- `05-universal-editor-guide.md` — UE models, definitions, filters in depth
- `06-css-design-system.md` — all design tokens, patterns, responsive rules
- `09-eds-content-query-api.md` — query index, sitemap, API endpoints

External references:

- [AEM + EDS Getting Started](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/edge-dev-getting-started)
- [Creating Blocks](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/create-block)
- [Content Modelling](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/content-modeling)
- [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
- [Web Performance](https://www.aem.live/developer/keeping-it-100)
