import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Flat block — cells[0] = heading (text), cells[1] = text (richtext)
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Apply light background to the entire parent section so sibling blocks
  // (e.g. features cards) share the same light background.
  block.closest('.section')?.classList.add('section--light');

  const cells = [...rows[0].children];

  const wrapper = document.createElement('div');
  wrapper.className = 'section-heading';

  if (cells[0]?.textContent.trim()) {
    const h2 = document.createElement('h2');
    h2.textContent = cells[0].textContent.trim();
    moveInstrumentation(cells[0], h2);
    wrapper.append(h2);
  }

  if (cells[1]?.innerHTML.trim()) {
    const textEl = document.createElement('p');
    textEl.innerHTML = cells[1].innerHTML;
    moveInstrumentation(cells[1], textEl);
    wrapper.append(textEl);
  }

  rows[0].remove();
  block.replaceChildren(wrapper);
}
