import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Parent block with child items (filter block).
  // Each event row: cells[0]=year, cells[1]=heading, cells[2]=description
  const rows = [...block.children];
  if (rows.length === 0) return;

  const fragment = document.createDocumentFragment();

  rows.forEach((row) => {
    const cells = [...row.children];
    const item = document.createElement('div');
    item.className = 'timeline-item';
    moveInstrumentation(row, item);

    const yearEl = document.createElement('div');
    yearEl.className = 'ti-year';
    yearEl.textContent = cells[0]?.textContent.trim() || '';

    const titleEl = document.createElement('h4');
    titleEl.textContent = cells[1]?.textContent.trim() || '';
    if (cells[1]) moveInstrumentation(cells[1], titleEl);

    const descEl = document.createElement('p');
    descEl.textContent = cells[2]?.textContent.trim() || '';
    if (cells[2]) moveInstrumentation(cells[2], descEl);

    item.append(yearEl, titleEl, descEl);
    row.remove();
    fragment.append(item);
  });

  block.replaceChildren(fragment);
}
