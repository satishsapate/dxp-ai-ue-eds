# ============================================================
# create-aem-package.ps1
# Creates a CRX-installable AEM content package for
# /conf/my-dxp-site/settings/dam/adminui-extension/
#
# IMPORTANT: Uses System.IO.Compression directly (NOT
# Compress-Archive) to ensure ZIP entries use forward slashes.
# Compress-Archive produces backslash paths on Windows which
# causes AEM Package Manager to fail with "Missing jcr_root".
# ============================================================

param(
    [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot),
    [string]$PackageName = "dxp-ai-ue-eds-component-models",
    [string]$PackageVersion = "1.0.0",
    [string]$SiteName = "my-dxp-site"
)

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zipPath = Join-Path $ProjectRoot "$PackageName-$PackageVersion.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath }

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$zipStream = [System.IO.File]::Open($zipPath, [System.IO.FileMode]::Create)
$archive   = New-Object System.IO.Compression.ZipArchive($zipStream, [System.IO.Compression.ZipArchiveMode]::Create)

# Helper: add a string as a ZIP entry (UTF-8, no BOM, LF line endings)
function Add-TextEntry($archive, $entryPath, $content) {
    $entry  = $archive.CreateEntry($entryPath, [System.IO.Compression.CompressionLevel]::Optimal)
    $stream = $entry.Open()
    # Trim leading/trailing whitespace and normalize to LF (not CRLF)
    $normalized = $content.Trim().Replace("`r`n", "`n").Replace("`r", "`n")
    $bytes  = $utf8NoBom.GetBytes($normalized)
    $stream.Write($bytes, 0, $bytes.Length)
    $stream.Close()
}

# Helper: add an empty directory entry (required by AEM vault loader)
function Add-DirEntry($archive, $entryPath) {
    # Directory entries must end with /
    $path = $entryPath.TrimEnd('/') + '/'
    $archive.CreateEntry($path) | Out-Null
}

# Helper: add a file from disk as a ZIP entry
function Add-FileEntry($archive, $entryPath, $filePath) {
    $entry  = $archive.CreateEntry($entryPath, [System.IO.Compression.CompressionLevel]::Optimal)
    $stream = $entry.Open()
    $bytes  = [System.IO.File]::ReadAllBytes($filePath)
    $stream.Write($bytes, 0, $bytes.Length)
    $stream.Close()
}

# ---- Required directory entries (AEM vault loader needs these) ----
Add-DirEntry $archive 'jcr_root'
Add-DirEntry $archive 'jcr_root/conf'
Add-DirEntry $archive "jcr_root/conf/$SiteName"
Add-DirEntry $archive "jcr_root/conf/$SiteName/settings"
Add-DirEntry $archive "jcr_root/conf/$SiteName/settings/dam"
Add-DirEntry $archive "jcr_root/conf/$SiteName/settings/dam/adminui-extension"

# ---- META-INF/vault/config.xml ----
Add-TextEntry $archive 'META-INF/vault/config.xml' @'
<?xml version="1.0" encoding="UTF-8"?>
<vaultfs version="1.1">
</vaultfs>
'@

# ---- META-INF/vault/settings.xml ----
Add-TextEntry $archive 'META-INF/vault/settings.xml' @'
<?xml version="1.0" encoding="UTF-8"?>
<vault version="1.1">
  <ignore name=".svn"/>
</vault>
'@

# ---- META-INF/vault/filter.xml ----
$filterXml = @"
<?xml version="1.0" encoding="UTF-8"?>
<workspaceFilter version="1.0">
  <filter root="/conf/$SiteName/settings/dam/adminui-extension"/>
</workspaceFilter>
"@
Add-TextEntry $archive 'META-INF/vault/filter.xml' $filterXml

# ---- META-INF/vault/properties.xml ----
# NOTE: DOCTYPE removed — AEM Cloud Service XXE protection rejects external DTD references
$propertiesXml = @"
<?xml version="1.0" encoding="UTF-8"?>
<properties>
  <entry key="name">$PackageName</entry>
  <entry key="version">$PackageVersion</entry>
  <entry key="group">dxp-ai-ue-eds</entry>
  <entry key="description">Component Models, Definitions and Filters for $SiteName Universal Editor</entry>
  <entry key="requiresRoot">false</entry>
  <entry key="allowIndexDefinitions">false</entry>
  <entry key="path">/etc/packages/dxp-ai-ue-eds/$PackageName-$PackageVersion.zip</entry>
  <entry key="acHandling">merge_preserve</entry>
  <entry key="packageType">content</entry>
</properties>
"@
Add-TextEntry $archive 'META-INF/vault/properties.xml' $propertiesXml

# ---- JCR folder nodes ----
$folderXml = @'
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    jcr:primaryType="sling:Folder"/>
'@
Add-TextEntry $archive "jcr_root/conf/$SiteName/settings/dam/.content.xml" $folderXml
Add-TextEntry $archive "jcr_root/conf/$SiteName/settings/dam/adminui-extension/.content.xml" $folderXml

# ---- Component JSON files ----
$extPath = "jcr_root/conf/$SiteName/settings/dam/adminui-extension"
Add-FileEntry $archive "$extPath/component-models.json"     "$ProjectRoot\component-models.json"
Add-FileEntry $archive "$extPath/component-definition.json" "$ProjectRoot\component-definition.json"
Add-FileEntry $archive "$extPath/component-filters.json"    "$ProjectRoot\component-filters.json"

$archive.Dispose()
$zipStream.Close()

Write-Host "Package created: $zipPath"
Write-Host ("Size: {0:N1} KB" -f ((Get-Item $zipPath).Length / 1KB))
