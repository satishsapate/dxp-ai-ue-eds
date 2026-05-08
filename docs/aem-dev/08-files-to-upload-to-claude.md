# Claude Context Strategy — CLAUDE.md Approach

> This project uses `CLAUDE.md` at the project root instead of uploading files to Claude.ai Projects.
> No file uploads are needed.

## How It Works

`CLAUDE.md` (at `dxp-ai-ue-eds/CLAUDE.md`) is automatically read by Claude Code CLI at the start of every session. It embeds the actual content of all key source files directly — no uploads, no manual steps.

**Files whose content is embedded in CLAUDE.md:**

| Source File | What's embedded |
|---|---|
| `styles/styles.css` | Full CSS custom properties (design tokens) |
| `component-models.json` | All component field model definitions |
| `component-filters.json` | All composition/nesting rules |
| `scripts/scripts.js` | Loading phase functions (eager/lazy/delayed) |
| `head.html` | CSP meta, script tags, stylesheet link |
| `fstab.yaml` | AEM mount point configuration |
| `blocks/cards/cards.js` | Real block JS example |
| `blocks/cards/_cards.json` | Real block model/definition/filter example |

**Docs in `docs/aem-dev/` also embed actual content:**

| Doc File | Embedded source |
|---|---|
| `03-architecture.md` | Full `scripts.js` source |
| `05-universal-editor-guide.md` | Full `component-models.json` + `component-filters.json` |
| `06-css-design-system.md` | Full `styles/styles.css` |

## Maintenance

When source files change, update the corresponding sections in these files:

```
styles/styles.css changed?
  → Update: CLAUDE.md "Design Tokens" section
  → Update: docs/aem-dev/06-css-design-system.md

component-models.json changed?
  → Update: CLAUDE.md "component-models.json" section
  → Update: docs/aem-dev/05-universal-editor-guide.md

component-filters.json changed?
  → Update: CLAUDE.md "component-filters.json" section
  → Update: docs/aem-dev/05-universal-editor-guide.md

scripts/scripts.js changed?
  → Update: CLAUDE.md "scripts.js" section
  → Update: docs/aem-dev/03-architecture.md

head.html changed?
  → Update: CLAUDE.md "head.html" section

fstab.yaml changed?
  → Update: CLAUDE.md "fstab.yaml" section
```

## If Using Claude.ai Web (not CLI)

If you are using claude.ai web interface rather than Claude Code CLI:
1. Copy the entire content of `CLAUDE.md` and paste it as your first message, OR
2. Upload `CLAUDE.md` as a single file to the Claude.ai Project — it contains everything needed
