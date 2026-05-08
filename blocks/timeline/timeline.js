import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length === 0) return;

  // First row: optional heading/intro (single cell)
  let headingRow = null;
  const eventRows = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1 && !eventRows.length) {
      headingRow = row;
    } else {
      eventRows.push(row);
    }
  });

  const fragment = document.createDocumentFragment();

  if (headingRow) {
    const heading = document.createElement('div');
    heading.className = 'section-heading';
    moveInstrumentation(headingRow, heading);
    [...headingRow.children].forEach((cell) => heading.append(cell));
    headingRow.remove();
    fragment.append(heading);
  }

  if (eventRows.length > 0) {
    const timeline = document.createElement('div');
    timeline.className = 'timeline';

    eventRows.forEach((row) => {
      const cells = [...row.children];
      const item = document.createElement('div');
      item.className = 'timeline-item';
      moveInstrumentation(row, item);

      // Cell 0: year, Cell 1: title, Cell 2: description
      const yearEl = document.createElement('div');
      yearEl.className = 'ti-year';
      yearEl.textContent = cells[0]?.textContent.trim() || '';

      const titleEl = document.createElement('h4');
      titleEl.textContent = cells[1]?.textContent.trim() || '';

      const descEl = document.createElement('p');
      descEl.textContent = cells[2]?.textContent.trim() || '';

      if (cells[1]) moveInstrumentation(cells[1], titleEl);
      if (cells[2]) moveInstrumentation(cells[2], descEl);

      item.append(yearEl, titleEl, descEl);
      row.remove();
      timeline.append(item);
    });

    fragment.append(timeline);
  }

  block.replaceChildren(fragment);
}
