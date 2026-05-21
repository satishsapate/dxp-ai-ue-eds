import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Single row: cells map to model fields in order
  // 0=overline, 1=heading, 2=description, 3=primaryText,
  // 4=primaryUrl, 5=secondaryText, 6=secondaryUrl, 7=metaText
  const row = rows[0];
  const cells = [...row.children];

  // NOTE: Do NOT call moveInstrumentation(row, content).
  // For model-only blocks (no filter), the row has the same data-aue-resource
  // as the block element. Moving it to a child container creates a duplicate
  // data-aue-resource inside the block, which confuses UE and can cause
  // editor-support.js to fall back to window.location.reload().
  // The block element already owns the resource. Only move cell-level
  // data-aue-prop attrs to their new visible elements.
  const content = document.createElement('div');
  content.className = 'cta-content';

  if (cells[0]?.textContent.trim()) {
    const overline = document.createElement('span');
    overline.className = 'cta-overline';
    overline.textContent = cells[0].textContent.trim();
    if (cells[0]) moveInstrumentation(cells[0], overline);
    content.append(overline);
  }

  if (cells[1]?.textContent.trim()) {
    const h2 = document.createElement('h2');
    h2.innerHTML = cells[1].innerHTML;
    if (cells[1]) moveInstrumentation(cells[1], h2);
    content.append(h2);
  }

  if (cells[2]?.innerHTML.trim()) {
    const desc = document.createElement('p');
    desc.innerHTML = cells[2].innerHTML;
    if (cells[2]) moveInstrumentation(cells[2], desc);
    content.append(desc);
  }

  const primaryText = cells[3]?.textContent.trim();
  const primaryHref = cells[4]?.querySelector('a')?.href || cells[4]?.textContent.trim() || '#';
  const secondaryText = cells[5]?.textContent.trim();
  const secondaryHref = cells[6]?.querySelector('a')?.href || cells[6]?.textContent.trim() || '#';

  if (primaryText || secondaryText) {
    const btnGroup = document.createElement('div');
    btnGroup.className = 'cta-buttons';

    if (primaryText) {
      const a = document.createElement('a');
      a.href = primaryHref;
      a.className = 'btn btn--primary';
      a.textContent = primaryText;
      // Move primaryText prop to button for inline editing
      if (cells[3]) moveInstrumentation(cells[3], a);
      btnGroup.append(a);
    }
    // Hidden span preserves primaryUrl prop so UE link picker can edit it
    if (cells[4]) {
      const urlSpan = document.createElement('span');
      urlSpan.hidden = true;
      moveInstrumentation(cells[4], urlSpan);
      btnGroup.append(urlSpan);
    }

    if (secondaryText) {
      const a = document.createElement('a');
      a.href = secondaryHref;
      a.className = 'btn btn--secondary';
      a.textContent = secondaryText;
      if (cells[5]) moveInstrumentation(cells[5], a);
      btnGroup.append(a);
    }
    // Hidden span preserves secondaryUrl prop
    if (cells[6]) {
      const urlSpan = document.createElement('span');
      urlSpan.hidden = true;
      moveInstrumentation(cells[6], urlSpan);
      btnGroup.append(urlSpan);
    }

    content.append(btnGroup);
  }

  if (cells[7]?.textContent.trim()) {
    const meta = document.createElement('div');
    meta.className = 'cta-meta';
    meta.textContent = cells[7].textContent.trim();
    if (cells[7]) moveInstrumentation(cells[7], meta);
    content.append(meta);
  }

  row.remove();
  block.replaceChildren(content);
}
