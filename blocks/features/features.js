import { moveInstrumentation } from '../../scripts/scripts.js';

// SVG icons keyed by iconKey model value.
// All use stroke="currentColor" so colour comes from .icon-box--{variant}.
const SVGS = {
  cms: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
  personalize: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
  multichannel: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  ai: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>',
  integrations: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  analytics: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  platform: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  search: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  security: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  cloud: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
  star: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  rocket: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
};

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const fragment = document.createDocumentFragment();

  // ── Row 0: block model fields ─────────────────────────────────
  // Cells map in order to: [overline, heading, description]
  const headingRow = rows[0];
  const hCells = [...headingRow.children];

  const sectionHeading = document.createElement('div');
  sectionHeading.className = 'section-heading';
  moveInstrumentation(headingRow, sectionHeading);

  const overlineText = hCells[0]?.textContent.trim();
  if (overlineText) {
    const span = document.createElement('span');
    span.className = 'overline';
    span.textContent = overlineText;
    moveInstrumentation(hCells[0], span);
    sectionHeading.append(span);
  }

  const headingText = hCells[1]?.textContent.trim();
  if (headingText) {
    const h2 = document.createElement('h2');
    h2.textContent = headingText;
    moveInstrumentation(hCells[1], h2);
    sectionHeading.append(h2);
  }

  const descHTML = hCells[2]?.innerHTML?.trim();
  if (descHTML) {
    const p = document.createElement('p');
    p.innerHTML = descHTML;
    moveInstrumentation(hCells[2], p);
    sectionHeading.append(p);
  }

  headingRow.remove();
  fragment.append(sectionHeading);

  // ── Rows 1+: feature-item rows ───────────────────────────────
  // Cells map in order to: [iconKey, iconVariant, tag, title, text]
  const itemRows = rows.slice(1);
  if (itemRows.length > 0) {
    const grid = document.createElement('div');
    grid.className = 'cards-grid';

    itemRows.forEach((row) => {
      const cells = [...row.children];
      const card = document.createElement('article');
      card.className = 'feature-card animate-on-scroll';
      moveInstrumentation(row, card);

      const iconKey     = cells[0]?.textContent.trim() || '';
      const iconVariant = (cells[1]?.textContent.trim() || 'purple').toLowerCase();
      const tagText     = cells[2]?.textContent.trim();
      const titleText   = cells[3]?.textContent.trim();
      const descContent = cells[4]?.innerHTML?.trim();

      // Icon box — fc-icon icon-box icon-box--lg icon-box--{variant}
      const svg = SVGS[iconKey];
      if (svg) {
        const iconBox = document.createElement('div');
        iconBox.className = `fc-icon icon-box icon-box--lg icon-box--${iconVariant}`;
        iconBox.setAttribute('aria-hidden', 'true');
        iconBox.innerHTML = svg;
        moveInstrumentation(cells[0], iconBox);
        card.append(iconBox);
      }

      // Tag / capability badge
      if (tagText) {
        const tagEl = document.createElement('span');
        tagEl.className = 'fc-tag';
        tagEl.textContent = tagText;
        moveInstrumentation(cells[2], tagEl);
        card.append(tagEl);
      }

      // Card heading
      if (titleText) {
        const h3 = document.createElement('h3');
        h3.textContent = titleText;
        moveInstrumentation(cells[3], h3);
        card.append(h3);
      }

      // Card description
      if (descContent) {
        const desc = document.createElement('div');
        desc.className = 'fc-desc';
        desc.innerHTML = descContent;
        moveInstrumentation(cells[4], desc);
        card.append(desc);
      }

      row.remove();
      grid.append(card);
    });

    fragment.append(grid);
  }

  block.replaceChildren(fragment);
}
