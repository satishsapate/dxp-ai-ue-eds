import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length === 0) return;

  // First row: optional heading/intro (single cell)
  let headingRow = null;
  const memberRows = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1 && !memberRows.length) {
      headingRow = row;
    } else {
      memberRows.push(row);
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

  if (memberRows.length > 0) {
    const grid = document.createElement('div');
    grid.className = 'team-grid';

    memberRows.forEach((row) => {
      const cells = [...row.children];
      const card = document.createElement('article');
      card.className = 'team-card';
      moveInstrumentation(row, card);

      // Cell 0: avatar/image, Cell 1: name, Cell 2: role, Cell 3: bio
      const avatarCell = cells[0];
      const body = document.createElement('div');
      body.className = 'team-card__body';

      if (avatarCell) {
        const avatarWrapper = document.createElement('div');
        avatarWrapper.className = 'team-card__avatar';
        const pic = avatarCell.querySelector('picture');
        if (pic) {
          const img = pic.querySelector('img');
          if (img) {
            const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '300' }]);
            moveInstrumentation(img, optimized.querySelector('img'));
            pic.replaceWith(optimized);
          }
          avatarWrapper.append(avatarCell.firstElementChild || avatarCell);
        } else {
          avatarWrapper.textContent = avatarCell.textContent;
        }
        card.append(avatarWrapper);
      }

      cells.slice(1).forEach((cell, i) => {
        const el = document.createElement('div');
        el.className = ['team-card__name', 'team-card__role', 'team-card__bio'][i] || 'team-card__extra';
        el.append(...cell.childNodes);
        body.append(el);
      });

      card.append(body);
      row.remove();
      grid.append(card);
    });

    fragment.append(grid);
  }

  block.replaceChildren(fragment);
}
