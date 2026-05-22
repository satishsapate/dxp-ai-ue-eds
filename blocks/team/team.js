import { moveInstrumentation } from '../../scripts/scripts.js';

// Avatar gradient pairs — cycled by insertion order to give each card a distinct colour.
const AVATAR_GRADIENTS = [
  ['#1A1B4B', '#2D1B69'], // navy → purple
  ['#1B4B2D', '#0D2A1A'], // dark green
  ['#4B1B2A', '#2A0D1A'], // dark red
  ['#1B3A4B', '#0D1A2A'], // dark teal
];

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // White background for the full parent section to match HTML kit.
  block.closest('.section')?.classList.add('section--team');

  // Parent model rows have 1 cell each (overline, heading).
  // Member item rows have 3 cells (memberName, role, bio).
  // Capture up to 2 single-cell rows as parent fields before member rows.
  const parentRows = [];
  const memberRows = [];

  rows.forEach((row) => {
    const cellCount = row.children.length;
    if (cellCount === 1 && parentRows.length < 2) {
      parentRows.push(row);
    } else {
      memberRows.push(row);
    }
  });

  const fragment = document.createDocumentFragment();

  // ── Section heading (overline + h2) ──────────────────────────
  const overlineText = parentRows[0]?.children[0]?.textContent.trim() || '';
  const headingText = parentRows[1]?.children[0]?.textContent.trim() || '';

  if (overlineText || headingText) {
    const headingDiv = document.createElement('div');
    headingDiv.className = 'section-heading';

    if (overlineText) {
      const span = document.createElement('span');
      span.className = 'overline';
      span.textContent = overlineText;
      if (parentRows[0]?.children[0]) moveInstrumentation(parentRows[0].children[0], span);
      headingDiv.append(span);
    }

    if (headingText) {
      const h2 = document.createElement('h2');
      h2.textContent = headingText;
      if (parentRows[1]?.children[0]) moveInstrumentation(parentRows[1].children[0], h2);
      headingDiv.append(h2);
    }

    parentRows.forEach((r) => r.remove());
    fragment.append(headingDiv);
  } else {
    parentRows.forEach((r) => r.remove());
  }

  // ── Team grid ─────────────────────────────────────────────────
  if (memberRows.length > 0) {
    const grid = document.createElement('div');
    grid.className = 'team-grid';

    memberRows.forEach((row) => {
      const cells = [...row.children];
      // Model: cells[0]=memberName, cells[1]=role, cells[2]=bio
      const nameText = cells[0]?.textContent.trim() || '';
      const roleText = cells[1]?.textContent.trim() || '';
      const bioText = cells[2]?.textContent.trim() || '';

      const card = document.createElement('div');
      card.className = 'team-card';
      moveInstrumentation(row, card);

      // Avatar — initials generated from name; colour cycled by card index
      const [c1, c2] = AVATAR_GRADIENTS[grid.children.length % AVATAR_GRADIENTS.length];
      const parts = nameText.split(' ').filter(Boolean);
      const initials = parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : (parts[0]?.[0] || '?').toUpperCase();

      const avatar = document.createElement('div');
      avatar.className = 'team-card__avatar';
      avatar.style.background = `linear-gradient(135deg,${c1},${c2})`;

      const initialsEl = document.createElement('div');
      initialsEl.className = 'team-initials';
      initialsEl.textContent = initials;
      avatar.append(initialsEl);
      card.append(avatar);

      const body = document.createElement('div');
      body.className = 'team-card__body';

      const nameEl = document.createElement('div');
      nameEl.className = 'team-card__name';
      nameEl.textContent = nameText;
      if (cells[0]) moveInstrumentation(cells[0], nameEl);

      const roleEl = document.createElement('div');
      roleEl.className = 'team-card__role';
      roleEl.textContent = roleText;
      if (cells[1]) moveInstrumentation(cells[1], roleEl);

      const bioEl = document.createElement('div');
      bioEl.className = 'team-card__bio';
      bioEl.textContent = bioText;
      if (cells[2]) moveInstrumentation(cells[2], bioEl);

      body.append(nameEl, roleEl, bioEl);
      card.append(body);
      row.remove();
      grid.append(card);
    });

    fragment.append(grid);
  }

  block.replaceChildren(fragment);
}
