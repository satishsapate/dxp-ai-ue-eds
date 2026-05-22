import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Flat block — all fields in a single row as separate cells.
  // modelFields: [breadcrumbUrl@aem-content, breadcrumbCurrent@text, badgeText@text,
  //               headingPrefix@text, headingAccent@text, description@richtext]
  const rows = [...block.children];
  if (rows.length === 0) return;

  const cells = [...rows[0].children];

  // ── Breadcrumb nav ────────────────────────────────────────────
  const breadcrumbHref = cells[0]?.querySelector('a')?.href || '/';
  const breadcrumbCurrent = cells[1]?.textContent.trim() || '';

  const nav = document.createElement('nav');
  nav.className = 'breadcrumb';
  nav.setAttribute('aria-label', 'Breadcrumb navigation');

  const homeLink = document.createElement('a');
  homeLink.href = breadcrumbHref;
  homeLink.textContent = 'Home';
  moveInstrumentation(cells[0], homeLink);

  const sep = document.createElement('span');
  sep.className = 'sep';
  sep.setAttribute('aria-hidden', 'true');
  sep.textContent = '›';

  const current = document.createElement('span');
  current.className = 'current';
  current.textContent = breadcrumbCurrent;
  moveInstrumentation(cells[1], current);

  nav.append(homeLink, sep, current);
  block.prepend(nav);

  // ── Main content ─────────────────────────────────────────────
  const content = document.createElement('div');
  content.className = 'page-hero__content';

  // Badge
  const badgeText = cells[2]?.textContent.trim();
  if (badgeText) {
    const badge = document.createElement('div');
    badge.className = 'badge';
    badge.textContent = badgeText;
    moveInstrumentation(cells[2], badge);
    content.append(badge);
  }

  // H1 — headingPrefix + line break + accented headingAccent
  const prefix = cells[3]?.textContent.trim();
  const accent = cells[4]?.textContent.trim();
  if (prefix || accent) {
    const h1 = document.createElement('h1');
    if (prefix) h1.append(document.createTextNode(prefix));
    if (prefix && accent) h1.append(document.createElement('br'));
    if (accent) {
      const accentSpan = document.createElement('span');
      accentSpan.className = 'accent';
      accentSpan.textContent = accent;
      if (cells[4]) moveInstrumentation(cells[4], accentSpan);
      h1.append(accentSpan);
    }
    if (cells[3]) moveInstrumentation(cells[3], h1);
    content.append(h1);
  }

  // Description
  const descHtml = cells[5]?.innerHTML.trim();
  if (descHtml) {
    const desc = document.createElement('div');
    desc.className = 'page-hero__desc';
    desc.innerHTML = descHtml;
    moveInstrumentation(cells[5], desc);
    content.append(desc);
  }

  rows[0].remove();
  block.append(content);
}
