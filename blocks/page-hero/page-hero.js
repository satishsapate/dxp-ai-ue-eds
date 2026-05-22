import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Flat block — all 6 fields arrive in a single row as separate cells.
  // modelFields: [breadcrumbUrl@aem-content, breadcrumbCurrent@text, badgeText@text,
  //               headingPrefix@text, headingAccent@text, description@richtext]
  const rows = [...block.children];
  if (rows.length === 0) return;

  const cells = [...rows[0].children];

  // ── Decorative orb (matches HTML kit visual) ──────────────────
  const orb = document.createElement('div');
  orb.className = 'orb orb--1';

  // ── Breadcrumb ────────────────────────────────────────────────
  const breadcrumbHref = cells[0]?.querySelector('a')?.href || '/';
  const breadcrumbCurrent = cells[1]?.textContent.trim() || '';

  const breadcrumb = document.createElement('div');
  breadcrumb.className = 'breadcrumb';

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

  breadcrumb.append(homeLink, sep, current);

  // ── Main content ──────────────────────────────────────────────
  const content = document.createElement('div');
  content.className = 'page-hero__content';

  // Badge — cyan variant to match HTML kit
  const badgeText = cells[2]?.textContent.trim();
  if (badgeText) {
    const badge = document.createElement('div');
    badge.className = 'badge badge--cyan';
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

  // Description — output <p> directly (not wrapped in div.page-hero__desc)
  // cells[5] contains richtext HTML, typically <p>text</p>
  const descHtml = cells[5]?.innerHTML.trim();
  if (descHtml) {
    const p = document.createElement('p');
    // Extract inner content from the wrapping <p> to avoid p-in-p nesting
    const tmp = document.createElement('div');
    tmp.innerHTML = descHtml;
    const firstBlock = tmp.firstElementChild;
    p.innerHTML = firstBlock ? firstBlock.innerHTML : tmp.innerHTML;
    moveInstrumentation(cells[5], p);
    content.append(p);
  }

  rows[0].remove();
  block.replaceChildren(orb, breadcrumb, content);
}
