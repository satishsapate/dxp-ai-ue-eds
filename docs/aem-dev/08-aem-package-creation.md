# AEM Package Creation Guide

## Overview

This guide documents how to create a CRX-installable AEM content package from this project.
The package deploys component models, definitions, and filters to the AEM Cloud Service instance.

---

## Critical Rule — Always Use Forward Slashes in ZIP Entries

**Problem:** PowerShell's `Compress-Archive` cmdlet creates ZIP files with Windows backslash
(`\`) path separators in entry names. AEM Package Manager (Java-based) requires forward slash
(`/`) separators and will fail with one of these errors:

- `Given archive is not a content package. Missing 'jcr_root'`
- `Error while loading package /tmp/vaultpack*.zip`

**Solution:** Always use `System.IO.Compression.ZipArchive` directly (never `Compress-Archive`)
so entry paths can be set explicitly with forward slashes.

```powershell
# WRONG — produces backslash paths, AEM rejects it
Compress-Archive -Path "$source\*" -DestinationPath $dest

# CORRECT — entry paths set manually with forward slashes
$archive.CreateEntry('jcr_root/conf/my-dxp-site/settings/dam/adminui-extension/.content.xml')
```

---

## Package Structure

A valid AEM content package ZIP must contain:

```
package.zip
├── META-INF/
│   └── vault/
│       ├── config.xml       ← required, declares vault format version
│       ├── filter.xml       ← required, defines which JCR paths are installed
│       ├── properties.xml   ← required, package name/version/group metadata
│       └── settings.xml     ← required, vault ignore rules
└── jcr_root/
    └── <path matching filter.xml root>/
        ├── .content.xml     ← declares JCR node type (sling:Folder, etc.)
        └── <files>
```

### config.xml (must be well-formed XML)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<vaultfs version="1.1">
</vaultfs>
```

> **Note:** A common mistake is omitting the `<` before `vaultfs` when building via
> string concatenation, producing `vaultfs version="1.1">` which is malformed XML
> and causes "Error while loading package".

### filter.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<workspaceFilter version="1.0">
  <filter root="/conf/my-dxp-site/settings/dam/adminui-extension"/>
</workspaceFilter>
```

### properties.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
  <entry key="name">package-name</entry>
  <entry key="version">1.0.0</entry>
  <entry key="group">group-name</entry>
  <entry key="packageType">content</entry>
  <entry key="acHandling">merge_preserve</entry>
</properties>
```

---

## Build Script

A reusable PowerShell script is provided at `tools/create-aem-package.ps1`.

### Usage

```powershell
# Default — creates dxp-ai-ue-eds-component-models-1.0.0.zip in project root
powershell -File tools/create-aem-package.ps1

# Custom site name or version
powershell -File tools/create-aem-package.ps1 -SiteName "my-other-site" -PackageVersion "1.0.1"
```

### What it deploys

| File | JCR Path |
|---|---|
| `component-models.json` | `/conf/my-dxp-site/settings/dam/adminui-extension/component-models.json` |
| `component-definition.json` | `/conf/my-dxp-site/settings/dam/adminui-extension/component-definition.json` |
| `component-filters.json` | `/conf/my-dxp-site/settings/dam/adminui-extension/component-filters.json` |

---

## Install via CRX Package Manager

1. Run the build script to generate the ZIP
2. Open: `https://author-p24056-e1593080.adobeaemcloud.com/crx/packmgr/index.jsp`
3. Click **Upload Package** → select the ZIP
4. Click **Install** → confirm
5. Verify in CRXDE at `/conf/my-dxp-site/settings/dam/adminui-extension/`

---

## Rebuild After Model Changes

Any time you edit block models or add new blocks, regenerate all 3 JSON files and reinstall:

```bash
# Step 1 — rebuild JSON files from source models
npm run build:json

# Step 2 — recreate the AEM package
powershell -File tools/create-aem-package.ps1

# Step 3 — install updated package in AEM Cloud
# Upload dxp-ai-ue-eds-component-models-1.0.0.zip via CRX Package Manager
```
