import { moveInstrumentation } from '../../scripts/scripts.js';

function animateCount(el, target, suffix) {
  const duration = 1800;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    const current = Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

function parseStatValue(text) {
  const cleaned = text.trim();
  const match = cleaned.match(/^([\d,.]+)(.*)$/);
  if (!match) return { number: null, suffix: cleaned };
  const number = parseFloat(match[1].replace(/,/g, ''));
  return { number, suffix: match[2] };
}

export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length === 0) return;

  // Build grid from rows: each row = one stat (value in first cell, label in second)
  const grid = document.createElement('div');
  grid.className = 'stats-band__grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const item = document.createElement('div');
    item.className = 'stat-item';
    moveInstrumentation(row, item);

    const valueText = cells[0]?.textContent.trim() || '';
    const labelText = cells[1]?.textContent.trim() || '';

    const valueEl = document.createElement('div');
    valueEl.className = 'sv';
    valueEl.textContent = valueText;
    // Move data-aue-prop so UE can identify and inline-edit the value field
    if (cells[0]) moveInstrumentation(cells[0], valueEl);

    const labelEl = document.createElement('div');
    labelEl.className = 'sl';
    labelEl.textContent = labelText;
    // Move data-aue-prop so UE can identify and inline-edit the label field
    if (cells[1]) moveInstrumentation(cells[1], labelEl);

    item.append(valueEl, labelEl);
    grid.append(item);
    row.remove();
  });

  // Add visible dividers between stat items to match HTML kit 2-row layout.
  // The dividers take up grid cells in the repeat(4,1fr) grid, placing stats at
  // columns 1 and 3 of each row → 2 rows of 2 stats each.
  const items = [...grid.querySelectorAll('.stat-item')];
  items.forEach((item, i) => {
    if (i < items.length - 1) {
      const divider = document.createElement('div');
      divider.className = 'stat-divider';
      divider.setAttribute('role', 'separator');
      divider.setAttribute('aria-hidden', 'true');
      item.after(divider);
    }
  });

  block.append(grid);

  // UE loads the page inside an iframe — skip the animation there to prevent
  // layout thrashing when editor-support.js re-decorates the block on every click.
  let inEditor = false;
  try { inEditor = window.self !== window.top; } catch { inEditor = true; }
  if (inEditor) return;

  // Count-up animation on scroll into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      block.querySelectorAll('.sv').forEach((el) => {
        const { number, suffix } = parseStatValue(el.textContent);
        if (number !== null) animateCount(el, number, suffix);
      });
    });
  }, { threshold: 0.3 });

  observer.observe(block);
}
