# Development Environment Setup Guide

## Prerequisites

| Requirement | Version | Purpose |
|---|---|---|
| Node.js | >= 18.3 | Build tools, dev server |
| npm | >= 9.x | Package management |
| AEM Cloud | >= 2024.8 | Content authoring |
| Java | 11 or 17 | AEM local instance |
| AEM SDK | Latest | Local AEM author |
| Chrome | Latest | AEM Sidekick extension |

## Step 1 - Clone and Install

```bash
# Clone the repository
git clone <repo-url> dxp-ai-ue-eds
cd dxp-ai-ue-eds

# Install dependencies
npm install
```

This installs all devDependencies defined in package.json including ESLint, Stylelint, Husky, merge-json-cli.

## Step 2 - Environment Configuration

Create a `.env` file in the project root:

```env
AEM_HOST=http://localhost:4502
```

This is the only required environment variable. It points to your local AEM author instance.

**Note:** The `.env` file is gitignored and must be created manually per developer.

## Step 3 - AEM Local Instance Setup

### Download AEM SDK
1. Go to [Adobe Software Distribution](https://experience.adobe.com/#/downloads)
2. Download **AEM as a Cloud Service SDK** (latest version)
3. Extract the SDK JAR file

### Start AEM Author
```bash
# Start AEM author on port 4502 (default)
java -jar aem-sdk-quickstart-*.jar -r author -port 4502
```

Default credentials: `admin` / `admin`

### Install Universal Editor Package
1. Open [AEM Package Manager](http://localhost:4502/crx/packmgr)
2. Upload and install the Universal Editor Service connector package
3. Verify at http://localhost:4502/libs/universaleditor/

### Configure CORS for Universal Editor
Universal Editor requires CORS configuration in AEM to allow the editor service to communicate:

1. Go to AEM → Tools → Operations → Web Console (OSGi Config)
2. Find "Adobe Granite Cross-Origin Resource Sharing Policy"
3. Add configuration for Universal Editor origin

## Step 4 - Configure AEM Content Structure

### Create Required Paths in JCR
The project uses these content paths (defined in `paths.json`):

```
/content/my-dxp-site/        # Page content (site root)
/content/my-dxp-site/nav     # Navigation fragment
/conf/dxp-ai-ue-eds/         # Configuration and component models
```

### Upload Component Models to AEM
```bash
# Sync component models and configs to AEM
npm run build:json
```

This merges all `_*.json` model files from `models/` and `blocks/` into:
- `component-models.json`
- `component-definition.json`
- `component-filters.json`

These JSON files must be present in AEM at:
```
/conf/dxp-ai-ue-eds/settings/dam/adminui-extension/component-models.json
/conf/dxp-ai-ue-eds/settings/dam/adminui-extension/component-definition.json
/conf/dxp-ai-ue-eds/settings/dam/adminui-extension/component-filters.json
```

## Step 5 - AEM Sidekick Setup

1. Install [AEM Sidekick Chrome Extension](https://chrome.google.com/webstore/detail/aem-sidekick/ccfggkjabjahcjoljmgmklhpaccedipo)
2. Click the extension icon on your EDS preview URL
3. Sidekick config is at `tools/sidekick/config.json`
4. The edit button uses pattern: `{{contentSourceUrl}}{{pathname}}?cmd=open`

## Step 6 - EDS GitHub Integration

EDS requires your repository to be connected to Adobe's CDN:

1. Go to [AEM Onboarding](https://www.aem.live/docs/setup-customer-sharepoint) 
2. Install the **AEM Bot** GitHub app on your repository
3. Configure `fstab.yaml` with your AEM instance URL:

```yaml
mountpoints:
  /:
    url: http://localhost:4502
```

Note: The URL depends on environment — for local dev use `http://localhost:4502`, for production use the AEM Cloud author URL. The current `fstab.yaml` uses `http://localhost:4502` for the `/:` mountpoint.

4. For production, replace with your AEM Cloud Service author URL

## Step 7 - Local HTML Kit Server

For rapid UI development without AEM:

```bash
npm run start
```

This starts a static dev server at **http://localhost:3000** serving from `/html-kit/dxp-ai/`.

The server includes:
- Automatic MIME type detection
- Directory index (auto-serve `index.html`)
- Path traversal attack protection

## Available npm Scripts

| Script | Command | Description |
|---|---|---|
| Install | `npm install` | Install all dependencies |
| Start | `npm run start` | Start HTML kit dev server (port 3000) |
| Lint JS | `npm run lint:js` | Check JavaScript with ESLint |
| Lint CSS | `npm run lint:css` | Check CSS with Stylelint |
| Lint All | `npm run lint` | Run both JS and CSS linting |
| Lint Fix | `npm run lint:fix` | Auto-fix linting issues |
| Build JSON | `npm run build:json` | Merge all component JSON models |
| Build Models | `npm run build:json:models` | Merge only component-models.json |
| Build Definitions | `npm run build:json:definitions` | Merge only component-definition.json |
| Build Filters | `npm run build:json:filters` | Merge only component-filters.json |
| Validate | `npm run validate` | Run custom validation script |
| Validate fstab | `npm run validate:fstab` | Validate fstab.yaml config |

## Git Hooks (Husky)

A pre-commit hook runs automatically before each commit:
```bash
# .husky/pre-commit executes:
node .husky/pre-commit.mjs
```

This runs linting to prevent committing code that fails ESLint or Stylelint checks.

To bypass (not recommended):
```bash
git commit --no-verify -m "message"
```

> **Important fix applied:** The `.husky/pre-commit` file must have `#!/bin/sh` as the first line and Unix LF line endings. On Windows, if you see "Exec format error" on commit, run: `sed -i 's/\r//' .husky/pre-commit` or recreate the file with proper shebang.

## File Sync with AEM (paths.json)

The `paths.json` configures how EDS URL paths map to AEM content paths:

```json
{
  "mappings": [
    { "path": "/**", "suffix": ".html", "type": "page" }
  ]
}
```

Note: paths.json maps EDS URL paths to AEM content paths. The actual site content is at `/content/my-dxp-site/` in AEM.

## Troubleshooting

### AEM won't start
- Ensure Java 11 or 17 is installed and on PATH
- Check port 4502 is not in use: `lsof -i :4502`
- Minimum 4GB RAM recommended

### npm install fails
- Ensure Node.js >= 18.3: `node --version`
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, retry

### ESLint errors on commit
- Run `npm run lint:fix` to auto-fix where possible
- Check `.eslintrc.js` for project rules
- The xwalk ESLint plugin enforces AEM-specific patterns

### Universal Editor not showing components
- Verify `component-definition.json` is deployed to AEM
- Check browser console for CORS errors
- Ensure Universal Editor service is running

### EDS page not loading blocks
- Verify block folder name matches class name in HTML
- Check `aem.js` block loading in browser Network tab
- Ensure block JS exports a default function

### Pre-commit hook "Exec format error" on Windows
- The `.husky/pre-commit` file has wrong line endings or missing shebang
- Fix: ensure first line is `#!/bin/sh` with LF line endings
- Run: `git config core.autocrlf false` before cloning to prevent CRLF conversion

### EDS page shows wrong content / blocks not matching design
- The `html-kit/dxp-ai/` directory is the design reference (static HTML prototype)
- Block JS files must map EDS row/cell data to match html-kit HTML structure
- Header, Footer, and Hero blocks render HTML directly (not from AEM data)
- Run `npm run start` to preview html-kit at http://localhost:3000
