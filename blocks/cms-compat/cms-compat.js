import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length === 0) return;

  // First row: optional heading/intro (single cell)
  let headingRow = null;
  const contentRows = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1 && !contentRows.length) {
      headingRow = row;
    } else {
      contentRows.push(row);
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

  // Two-column approach grid (first two content rows)
  if (contentRows.length > 0) {
    const grid = document.createElement('div');
    grid.className = 'approach-grid';

    const approachRows = contentRows.splice(0, 2);
    approachRows.forEach((row) => {
      const cells = [...row.children];
      const card = document.createElement('article');
      card.className = 'approach-card';
      moveInstrumentation(row, card);
      cells.forEach((cell) => card.append(...cell.childNodes));
      row.remove();
      grid.append(card);
    });

    fragment.append(grid);
  }

  // Remaining rows become the logos grid
  if (contentRows.length > 0) {
    const logosGrid = document.createElement('div');
    logosGrid.className = 'cms-logos-grid';
    logosGrid.setAttribute('role', 'list');

    contentRows.forEach((row) => {
      const cells = [...row.children];
      const logoCard = document.createElement('div');
      logoCard.className = 'cms-logo-card';
      logoCard.setAttribute('role', 'listitem');
      moveInstrumentation(row, logoCard);

      if (cells[0]) {
        const icon = document.createElement('div');
        icon.className = 'clc-icon';
        icon.textContent = cells[0].textContent.trim().slice(0, 2);
        logoCard.append(icon);
      }
      if (cells[1]) {
        const name = document.createElement('div');
        name.className = 'clc-name';
        name.textContent = cells[1].textContent.trim();
        moveInstrumentation(cells[1], name);
        logoCard.append(name);
      }

      row.remove();
      logosGrid.append(logoCard);
    });

    fragment.append(logosGrid);
  }

  block.replaceChildren(fragment);
}
