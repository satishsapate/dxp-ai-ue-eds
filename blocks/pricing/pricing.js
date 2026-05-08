import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length === 0) return;

  // First row: optional heading/intro (single cell)
  let headingRow = null;
  const planRows = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1 && !planRows.length) {
      headingRow = row;
    } else {
      planRows.push(row);
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

  if (planRows.length > 0) {
    const grid = document.createElement('div');
    grid.className = 'pricing-grid';

    planRows.forEach((row, index) => {
      const cells = [...row.children];
      const card = document.createElement('article');
      card.className = 'pricing-card';

      // Middle plan gets "featured" treatment
      if (index === 1 && planRows.length === 3) {
        card.classList.add('featured');
        const badge = document.createElement('div');
        badge.className = 'pricing-badge';
        badge.textContent = 'Most Popular';
        card.append(badge);
      }

      moveInstrumentation(row, card);

      // Cell 0: plan name, Cell 1: description, Cell 2: price,
      // Cell 3: features list, Cell 4: CTA button, Cell 5: note
      const labels = ['plan-name', 'plan-desc', 'plan-price', null, 'pricing-cta', 'pricing-note'];

      cells.forEach((cell, i) => {
        if (i === 3) {
          // Features list
          const ul = document.createElement('ul');
          ul.className = 'pricing-features';
          const items = cell.textContent.split('\n').map((s) => s.trim()).filter(Boolean);
          items.forEach((item) => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.append(li);
          });
          card.append(ul);
        } else {
          const div = document.createElement('div');
          if (labels[i]) div.className = labels[i];
          div.append(...cell.childNodes);
          card.append(div);
        }
      });

      row.remove();
      grid.append(card);
    });

    fragment.append(grid);
  }

  block.replaceChildren(fragment);
}
