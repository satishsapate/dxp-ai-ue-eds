import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Flat block — fields arrive in a single row as separate cells.
  // New model (3 cells): [overline@text, heading@text, text@richtext]
  // Old model (2 cells): [heading@text, text@richtext]  — detected by cell count
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Apply dark background to the entire parent section so sibling blocks
  // (e.g. timeline) are also covered by the dark theme.
  block.closest('.section')?.classList.add('section--dark');

  const cells = [...rows[0].children];

  // Detect model version by cell count
  const isNewModel = cells.length >= 3;
  const overlineCell = isNewModel ? cells[0] : null;
  const headingCell = isNewModel ? cells[1] : cells[0];
  const textCell = isNewModel ? cells[2] : cells[1];

  // Section heading — uses section-heading--light for visibility on dark bg
  if (headingCell?.textContent.trim() || overlineCell?.textContent.trim()) {
    const headingDiv = document.createElement('div');
    headingDiv.className = 'section-heading section-heading--light';

    if (overlineCell?.textContent.trim()) {
      const span = document.createElement('span');
      span.className = 'overline';
      span.textContent = overlineCell.textContent.trim();
      moveInstrumentation(overlineCell, span);
      headingDiv.append(span);
    }

    if (headingCell?.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.textContent = headingCell.textContent.trim();
      moveInstrumentation(headingCell, h2);
      headingDiv.append(h2);
    }

    block.append(headingDiv);
  }

  if (textCell?.innerHTML.trim()) {
    const textDiv = document.createElement('div');
    textDiv.className = 'section-dark-text';
    textDiv.innerHTML = textCell.innerHTML;
    moveInstrumentation(textCell, textDiv);
    block.append(textDiv);
  }

  rows[0].remove();
}
