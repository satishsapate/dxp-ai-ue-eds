import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length === 0) return;

  // First row is the section heading if it has a single cell and no card rows yet.
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

      // AEM xwalk renders each model field as a cell in the item row:
      // cells[0] = tag (text), cells[1] = title (text), cells[2] = text (richtext)
      const tag = cells[0]?.textContent.trim();
      if (tag) {
        const tagEl = document.createElement('span');
        tagEl.className = 'fc-tag';
        tagEl.textContent = tag;
        if (cells[0]) moveInstrumentation(cells[0], tagEl);
        card.append(tagEl);
      }

      const titleText = cells[1]?.textContent.trim();
      if (titleText) {
        const h3 = document.createElement('h3');
        h3.textContent = titleText;
        if (cells[1]) moveInstrumentation(cells[1], h3);
        card.append(h3);
      }

      const descHTML = cells[2]?.innerHTML.trim();
      if (descHTML) {
        const desc = document.createElement('div');
        desc.className = 'fc-desc';
        desc.innerHTML = descHTML;
        if (cells[2]) moveInstrumentation(cells[2], desc);
        card.append(desc);
      }

      row.remove();
      grid.append(card);
    });

    fragment.append(grid);
  }

  block.replaceChildren(fragment);
}
