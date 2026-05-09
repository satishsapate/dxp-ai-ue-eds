const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

const zip = new AdmZip();
const pkgDir = path.resolve(__dirname, '..', 'aem-package');
const outputZip = path.resolve(__dirname, '..', 'dxp-ai-ue-eds-content-1.0.0.zip');

console.log('Package dir:', pkgDir);

function addDir(dir, zipBase) {
  fs.readdirSync(dir).forEach(entry => {
    const full = path.join(dir, entry);
    const rel = zipBase ? zipBase + '/' + entry : entry;
    // skip apps dir
    if (rel.startsWith('jcr_root/apps') || rel.startsWith('jcr_root\\apps')) return;
    if (fs.statSync(full).isDirectory()) {
      addDir(full, rel);
    } else {
      zip.addFile(rel, fs.readFileSync(full));
    }
  });
}

addDir(pkgDir, '');
zip.writeZip(outputZip);
console.log('Package built:', outputZip);
