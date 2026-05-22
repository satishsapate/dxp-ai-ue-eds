import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Flat block — all fields arrive in a single row as separate cells.
  // modelFields: [overline@text, heading@text, lead@text, text@richtext,
  //               sidebarTitle@text, sidebarText@richtext, ctaUrl@aem-content, ctaText@text]
  const rows = [...block.children];
  if (rows.length === 0) return;

  const cells = [...rows[0].children];

  const layout = document.createElement('div');
  layout.className = 'richtext-layout';

  // ── Main content column ────────────────────────────────────────────────────
  const main = document.createElement('div');
  main.className = 'richtext-content';

  if (cells[0]?.textContent.trim()) {
    const overline = document.createElement('span');
    overline.className = 'rt-overline';
    overline.textContent = cells[0].textContent.trim();
    moveInstrumentation(cells[0], overline);
    main.append(overline);
  }

  if (cells[1]?.textContent.trim()) {
    const heading = document.createElement('h2');
    heading.className = 'rt-heading';
    heading.textContent = cells[1].textContent.trim();
    moveInstrumentation(cells[1], heading);
    main.append(heading);
  }

  if (cells[2]?.textContent.trim()) {
    const lead = document.createElement('p');
    lead.className = 'rt-lead';
    lead.textContent = cells[2].textContent.trim();
    moveInstrumentation(cells[2], lead);
    main.append(lead);
  }

  if (cells[3]?.innerHTML.trim()) {
    const body = document.createElement('div');
    body.className = 'rt-body';
    body.innerHTML = cells[3].innerHTML;
    moveInstrumentation(cells[3], body);
    main.append(body);
  }

  layout.append(main);

  // ── Sidebar column ─────────────────────────────────────────────────────────
  const sidebarTitle = cells[4]?.textContent.trim();
  const sidebarContent = cells[5]?.innerHTML.trim();
  const ctaHref = cells[6]?.querySelector('a')?.href || cells[6]?.textContent.trim() || '#';
  const ctaLabel = cells[7]?.textContent.trim();

  if (sidebarTitle || sidebarContent) {
    const sidebar = document.createElement('div');
    sidebar.className = 'richtext-sidebar';

    const card = document.createElement('div');
    card.className = 'sidebar-card sidebar-card--cta';

    if (sidebarTitle) {
      const title = document.createElement('div');
      title.className = 'sidebar-card__title';
      title.textContent = sidebarTitle;
      moveInstrumentation(cells[4], title);
      card.append(title);
    }

    if (sidebarContent) {
      const text = document.createElement('div');
      text.innerHTML = sidebarContent;
      moveInstrumentation(cells[5], text);
      card.append(text);
    }

    if (ctaLabel) {
      const a = document.createElement('a');
      a.href = ctaHref;
      a.className = 'sc-cta-btn';
      a.textContent = ctaLabel;
      moveInstrumentation(cells[7], a);
      card.append(a);
    }

    // Preserve ctaUrl prop for UE link picker
    if (cells[6]) {
      const urlSpan = document.createElement('span');
      urlSpan.hidden = true;
      moveInstrumentation(cells[6], urlSpan);
      card.append(urlSpan);
    }

    sidebar.append(card);
    layout.append(sidebar);
  }

  rows[0].remove();
  block.replaceChildren(layout);
}
