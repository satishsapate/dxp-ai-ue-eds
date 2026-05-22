import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Flat block — fields arrive in a single row as separate cells.
  // New model (3 cells): [overline@text, heading@text, text@richtext]
  // Old model (2 cells): [heading@text, text@richtext]  — detected by cell count
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Apply light background to the entire parent section so sibling blocks
  // (e.g. features cards) share the same light background.
  block.closest('.section')?.classList.add('section--light');

  const cells = [...rows[0].children];

  // Detect model version by cell count
  const isNewModel = cells.length >= 3;
  const overlineCell = isNewModel ? cells[0] : null;
  const headingCell = isNewModel ? cells[1] : cells[0];
  const textCell = isNewModel ? cells[2] : cells[1];

  const wrapper = document.createElement('div');
  wrapper.className = 'section-heading';

  if (overlineCell?.textContent.trim()) {
    const span = document.createElement('span');
    span.className = 'overline';
    span.textContent = overlineCell.textContent.trim();
    moveInstrumentation(overlineCell, span);
    wrapper.append(span);
  }

  if (headingCell?.textContent.trim()) {
    const h2 = document.createElement('h2');
    h2.textContent = headingCell.textContent.trim();
    moveInstrumentation(headingCell, h2);
    wrapper.append(h2);
  }

  if (textCell?.innerHTML.trim()) {
    const textEl = document.createElement('p');
    textEl.innerHTML = textCell.innerHTML;
    moveInstrumentation(textCell, textEl);
    wrapper.append(textEl);
  }

  rows[0].remove();
  block.replaceChildren(wrapper);
}
