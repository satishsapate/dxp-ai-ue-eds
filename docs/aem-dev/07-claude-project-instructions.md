# Claude AI Context — CLAUDE.md

The project instructions and full embedded source context for Claude are maintained in the **`CLAUDE.md`** file at the project root.

**File location:** [`/CLAUDE.md`](../../CLAUDE.md)

Claude Code reads `CLAUDE.md` automatically on every session. It contains:

- Project identity and architecture overview
- All critical development rules (JS, CSS, JSON build system)
- Actual `styles/styles.css` design tokens (embedded inline)
- Actual `component-models.json` (embedded inline)
- Actual `component-filters.json` (embedded inline)
- Actual `scripts.js` loading phase logic (embedded inline)
- Actual `head.html` content (embedded inline)
- Actual `fstab.yaml` content (embedded inline)
- Real block example: `cards.js` and `_cards.json`
- Universal Editor field types reference
- Local environment URLs

## Why CLAUDE.md instead of uploading files?

`CLAUDE.md` at the project root is automatically picked up by Claude Code CLI in every session — no manual file uploads needed. All key source file content is embedded directly into `CLAUDE.md`, so Claude has complete context without needing to read each source file separately.

The docs in `docs/aem-dev/` also embed actual source content inline, so reading any doc file gives Claude the real values, not just descriptions.

## Keeping CLAUDE.md Updated

When you change any of these source files, update the corresponding section in `CLAUDE.md`:

| Source File | CLAUDE.md Section |
|---|---|
| `styles/styles.css` | "Design Tokens" section |
| `component-models.json` | "component-models.json" section |
| `component-filters.json` | "component-filters.json" section |
| `scripts/scripts.js` | "scripts.js — Loading Phases" section |
| `head.html` | "head.html" section |
| `fstab.yaml` | "fstab.yaml" section |

Also update `docs/aem-dev/06-css-design-system.md` when `styles.css` changes,
and `docs/aem-dev/05-universal-editor-guide.md` when model JSON files change.
