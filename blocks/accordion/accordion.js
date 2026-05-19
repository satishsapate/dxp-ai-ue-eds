import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'accordion';

  rows.forEach((row) => {
    const cells = [...row.children];
    const questionCell = cells[0];
    const answerCell = cells[1];

    if (!questionCell) return;

    const item = document.createElement('div');
    item.className = 'accordion-item';
    moveInstrumentation(row, item);

    const header = document.createElement('div');
    header.className = 'accordion-header';
    header.setAttribute('tabindex', '0');
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', 'false');

    const h4 = document.createElement('h4');
    h4.textContent = questionCell.textContent.trim();
    moveInstrumentation(questionCell, h4);

    const icon = document.createElement('span');
    icon.className = 'accordion-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '+';

    header.append(h4, icon);

    const body = document.createElement('div');
    body.className = 'accordion-body';
    body.hidden = true;
    if (answerCell) {
      body.innerHTML = answerCell.innerHTML;
      moveInstrumentation(answerCell, body);
    }

    const toggleItem = () => {
      const isOpen = item.classList.toggle('open');
      body.hidden = !isOpen;
      header.setAttribute('aria-expanded', String(isOpen));
      icon.textContent = isOpen ? '−' : '+';
    };

    header.addEventListener('click', toggleItem);
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleItem(); }
    });

    item.append(header, body);
    row.remove();
    wrapper.append(item);
  });

  block.replaceChildren(wrapper);
}
