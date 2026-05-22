import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Flat block — cells[0] = heading (text), cells[1] = text (richtext)
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Apply dark background to the entire parent section so sibling blocks
  // (e.g. timeline) are also covered by the dark theme.
  block.closest('.section')?.classList.add('section--dark');

  const cells = [...rows[0].children];

  const wrapper = document.createElement('div');
  wrapper.className = 'section-dark-content';

  if (cells[0]?.textContent.trim()) {
    const headingDiv = document.createElement('div');
    headingDiv.className = 'section-heading';

    const h2 = document.createElement('h2');
    h2.textContent = cells[0].textContent.trim();
    moveInstrumentation(cells[0], h2);
    headingDiv.append(h2);
    wrapper.append(headingDiv);
  }

  if (cells[1]?.innerHTML.trim()) {
    const textDiv = document.createElement('div');
    textDiv.className = 'section-dark-text';
    textDiv.innerHTML = cells[1].innerHTML;
    moveInstrumentation(cells[1], textDiv);
    wrapper.append(textDiv);
  }

  rows[0].remove();
  block.replaceChildren(wrapper);
}
