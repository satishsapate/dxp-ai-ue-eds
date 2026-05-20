import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Single row: cells map to model fields in order
  // 0=overline, 1=heading, 2=description, 3=primaryText,
  // 4=primaryUrl, 5=secondaryText, 6=secondaryUrl, 7=metaText
  const row = rows[0];
  const cells = [...row.children];

  const content = document.createElement('div');
  content.className = 'cta-content';
  moveInstrumentation(row, content);

  if (cells[0]?.textContent.trim()) {
    const overline = document.createElement('span');
    overline.className = 'cta-overline';
    overline.textContent = cells[0].textContent.trim();
    content.append(overline);
  }

  if (cells[1]?.textContent.trim()) {
    const h2 = document.createElement('h2');
    h2.innerHTML = cells[1].innerHTML;
    content.append(h2);
  }

  if (cells[2]?.innerHTML.trim()) {
    const desc = document.createElement('p');
    desc.innerHTML = cells[2].innerHTML;
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
      btnGroup.append(a);
    }

    if (secondaryText) {
      const a = document.createElement('a');
      a.href = secondaryHref;
      a.className = 'btn btn--secondary';
      a.textContent = secondaryText;
      btnGroup.append(a);
    }

    content.append(btnGroup);
  }

  if (cells[7]?.textContent.trim()) {
    const meta = document.createElement('div');
    meta.className = 'cta-meta';
    meta.textContent = cells[7].textContent.trim();
    content.append(meta);
  }

  row.remove();
  block.replaceChildren(content);
}
