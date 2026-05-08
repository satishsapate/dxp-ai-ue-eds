import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length === 0) return;

  // First row: optional heading/intro (single cell)
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

      // Cell 0: icon/emoji, Cell 1: title, Cell 2: description, Cell 3: link
      if (cells[0]) {
        const icon = document.createElement('div');
        icon.className = 'fc-icon';
        icon.append(...cells[0].childNodes);
        card.append(icon);
      }
      if (cells[1]) {
        const title = document.createElement('h3');
        title.textContent = cells[1].textContent.trim();
        moveInstrumentation(cells[1], title);
        card.append(title);
      }
      if (cells[2]) {
        const desc = document.createElement('p');
        desc.textContent = cells[2].textContent.trim();
        moveInstrumentation(cells[2], desc);
        card.append(desc);
      }
      if (cells[3]) {
        const link = cells[3].querySelector('a') || cells[3];
        link.classList?.add('fc-link');
        card.append(cells[3]);
      }

      row.remove();
      grid.append(card);
    });

    fragment.append(grid);
  }

  block.replaceChildren(fragment);
}
