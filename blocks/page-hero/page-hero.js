import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length === 0) return;

  const content = document.createElement('div');
  content.className = 'page-hero__content';

  rows.forEach((row) => {
    const cells = [...row.children];

    if (cells.length === 2) {
      // Two-cell row: breadcrumb path + label
      const breadcrumb = document.createElement('nav');
      breadcrumb.className = 'breadcrumb';
      breadcrumb.setAttribute('aria-label', 'Breadcrumb navigation');

      const homeLink = document.createElement('a');
      homeLink.href = cells[0].querySelector('a')?.href || '/';
      homeLink.textContent = cells[0].textContent.trim() || 'Home';
      moveInstrumentation(cells[0], homeLink);

      const sep = document.createElement('span');
      sep.className = 'sep';
      sep.setAttribute('aria-hidden', 'true');
      sep.textContent = '›';

      const current = document.createElement('span');
      current.className = 'current';
      current.textContent = cells[1].textContent.trim();
      moveInstrumentation(cells[1], current);

      breadcrumb.append(homeLink, sep, current);
      block.prepend(breadcrumb);
    } else {
      // Single-cell row: heading or description text
      cells.forEach((cell) => {
        const el = document.createElement('div');
        el.append(...cell.childNodes);
        content.append(el);
        moveInstrumentation(cell, el);
      });
    }

    row.remove();
  });

  block.append(content);
}
