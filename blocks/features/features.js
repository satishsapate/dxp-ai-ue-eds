import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length === 0) return;

  // First row may be a heading/intro row (single cell spanning full width)
  let headingRow = null;
  const cardRows = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1 && !cardRows.length) {
      headingRow = row;
    } else {
      cardRows.push(row);
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

  if (cardRows.length > 0) {
    const grid = document.createElement('div');
    grid.className = 'cards-grid';

    cardRows.forEach((row) => {
      const cells = [...row.children];
      const card = document.createElement('article');
      card.className = 'feature-card';
      moveInstrumentation(row, card);

      cells.forEach((cell) => card.append(cell));
      row.remove();
      grid.append(card);
    });

    fragment.append(grid);
  }

  block.replaceChildren(fragment);
}
